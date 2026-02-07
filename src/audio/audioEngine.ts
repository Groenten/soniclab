import * as Tone from 'tone'
let synth: Tone.Synth | null = null

export async function initAudio() {
  // Esto ayuda mucho a depurar:
  console.log('initAudio() called. Tone.context.state =', Tone.context.state)

  if (!synth) {
    await Tone.start()
    synth = new Tone.Synth().toDestination()
    console.log('Synth created ✅')
  }
}

export function playNote(note: string) {
  if (!synth) {
    console.warn('playNote() pero synth aún es null')
    return
  }
  console.log('Playing note:', note)
  synth.triggerAttackRelease(note, '8n')
}
