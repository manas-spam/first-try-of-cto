import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface PostcardConfig {
  element: HTMLElement
  fileName?: string
  format?: 'png' | 'pdf' | 'both'
  quality?: number
  width?: number
  height?: number
}

export interface PostcardResult {
  success: boolean
  error?: string
  dataUrl?: string
  pdfBlob?: Blob
}

export async function generatePostcardImage(
  element: HTMLElement,
  quality: number = 0.95
): Promise<string | null> {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      background: '#ffffff',
      logging: false,
      width: element.scrollWidth * 2,
      height: element.scrollHeight * 2,
    })

    return canvas.toDataURL('image/png', quality)
  } catch (error) {
    console.error('Error generating postcard image:', error)
    return null
  }
}

export async function generatePostcardPDF(
  element: HTMLElement,
  fileName: string = 'postcard.pdf'
): Promise<Blob | null> {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      background: '#ffffff',
      logging: false,
      width: element.scrollWidth * 2,
      height: element.scrollHeight * 2,
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const imgData = canvas.toDataURL('image/png', 0.95)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    return pdf.output('blob')
  } catch (error) {
    console.error('Error generating PDF:', error)
    return null
  }
}

export async function generatePostcard(
  config: PostcardConfig
): Promise<PostcardResult> {
  const {
    element,
    fileName = 'postcard',
    format = 'pdf',
    quality = 0.95,
  } = config

  try {
    if (format === 'png' || format === 'both') {
      const dataUrl = await generatePostcardImage(element, quality)
      if (!dataUrl) {
        return { success: false, error: 'Failed to generate image' }
      }

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${fileName}.png`
        link.href = dataUrl
        link.click()
        return { success: true, dataUrl }
      }

      if (format === 'both') {
        const pdfBlob = await generatePostcardPDF(element, fileName)
        if (!pdfBlob) {
          return { success: false, error: 'Failed to generate PDF' }
        }

        const link = document.createElement('a')
        link.download = `${fileName}.png`
        link.href = dataUrl
        link.click()

        const pdfUrl = URL.createObjectURL(pdfBlob)
        const pdfLink = document.createElement('a')
        pdfLink.download = `${fileName}.pdf`
        pdfLink.href = pdfUrl
        pdfLink.click()
        URL.revokeObjectURL(pdfUrl)

        return { success: true, dataUrl, pdfBlob }
      }
    }

    if (format === 'pdf') {
      const pdfBlob = await generatePostcardPDF(element, fileName)
      if (!pdfBlob) {
        return { success: false, error: 'Failed to generate PDF' }
      }

      const pdfUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.download = `${fileName}.pdf`
      link.href = pdfUrl
      link.click()
      URL.revokeObjectURL(pdfUrl)

      return { success: true, pdfBlob }
    }

    return { success: false, error: 'Invalid format' }
  } catch (error) {
    console.error('Error generating postcard:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function sharePostcard(
  dataUrl: string,
  title: string = 'My Travel Memory'
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.share) {
      resolve(false)
      return
    }

    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'postcard.png', { type: 'image/png' })
        return navigator.share({
          title,
          text: 'Check out my travel memory!',
          files: [file],
        })
      })
      .then(() => resolve(true))
      .catch(() => resolve(false))
  })
}
