import * as Tone from 'tone'

export class AudioManager {
  private synth: Tone.Synth | null = null
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      await Tone.start()
      this.synth = new Tone.Synth().toDestination()
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
      this.initialized = false
    }
  }
}

export const audioManager = new AudioManager()
