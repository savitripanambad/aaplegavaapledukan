/**
 * Audio voice greeting utility for "आपलं गाव आपलं दुकान" / "आपल्या गावातील दुकान"
 */

export function playMarathiVoiceGreeting(
  customText: string = 'आपलं गाव, आपलं दुकान! आपल्या गावातील सर्व दुकाने आणि सेवा आता एकाच ठिकाणी.'
): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Play subtle pleasant chime tone via Web Audio API first
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Ignore audio context errors if blocked by browser policy
  }

  // 2. Play Marathi spoken voice via Web Speech Synthesis API
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech

      const utterance = new SpeechSynthesisUtterance(customText);
      utterance.rate = 0.95; // Natural friendly pace
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      // Try to find Marathi or Hindi Indian voice
      const marathiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('mr') ||
          v.lang.toLowerCase().includes('mr-in') ||
          v.lang.toLowerCase().includes('hi-in') ||
          v.lang.toLowerCase().includes('hi')
      );

      if (marathiVoice) {
        utterance.voice = marathiVoice;
        utterance.lang = marathiVoice.lang;
      } else {
        utterance.lang = 'mr-IN';
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  return false;
}
