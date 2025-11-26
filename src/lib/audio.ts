import * as Tone from 'tone'

export class AudioManager {
  private synth: Tone.Synth | null = null
  private tabla: Tone.Sampler | null = null
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      await Tone.start()
      this.synth = new Tone.Synth().toDestination()
      
      // Create a simple tabla sampler using basic oscillators
      // In production, you would use actual tabla samples
      this.tabla = new Tone.Sampler({
        C4: "https://tonejs.github.io/audio/casio/A1.mp3", // Placeholder
        C3: "https://tonejs.github.io/audio/casio/A2.mp3", // Placeholder
      }).toDestination()
      
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  playNote(note: string, duration: string = '8n') {
    if (!this.initialized || !this.synth) {
      console.warn('Audio not initialized')
      return
    }

    try {
      this.synth.triggerAttackRelease(note, duration)
    } catch (error) {
      console.error('Failed to play note:', error)
    }
  }

  playTablaBeat() {
    if (!this.initialized) {
      console.warn('Audio not initialized')
      return
    }

    try {
      // Simulate tabla sounds using Tone.js synth
      if (this.synth) {
        // High pitch tabla sound (na/teen)
        this.synth.triggerAttackRelease('C6', '16n')
        
        // Low pitch tabla sound (dhum/ge) with slight delay
        setTimeout(() => {
          this.synth?.triggerAttackRelease('G3', '8n')
        }, 50)
      }
    } catch (error) {
      console.error('Failed to play tabla beat:', error)
    }
  }

  playSuccessSound() {
    this.playNote('C5', '16n')
    setTimeout(() => this.playNote('E5', '16n'), 100)
    setTimeout(() => this.playNote('G5', '8n'), 200)
  }

  playErrorSound() {
    this.playNote('C3', '16n')
    setTimeout(() => this.playNote('A2', '8n'), 100)
  }

  playNavigationSound() {
    this.playNote('A4', '32n')
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose()
      this.synth = null
    }
    if (this.tabla) {
      this.tabla.dispose()
      this.tabla = null
    }
    this.initialized = false
  }
}

export const audioManager = new AudioManager()
