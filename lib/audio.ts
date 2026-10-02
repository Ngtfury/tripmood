/**
 * Web Audio API synthesizer for a cute, satisfying Christmas bell / fairy chime.
 * Completely self-contained, zero external asset dependencies, works offline!
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a sweet, sparkling bell chime (C6 -> E6 -> G6 -> C7)
   * with bell decay and soft harmonics.
   */
  playCuteBellRing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Sparkling upward arpeggio: C6, E6, G6, C7
      const notes = [
        { freq: 1046.5, time: 0, duration: 0.7, gain: 0.15 },    // C6
        { freq: 1318.51, time: 0.08, duration: 0.8, gain: 0.16 }, // E6
        { freq: 1567.98, time: 0.16, duration: 0.9, gain: 0.18 }, // G6
        { freq: 2093.0, time: 0.25, duration: 1.2, gain: 0.22 },  // C7 (bell linger)
      ];

      notes.forEach(({ freq, time, duration, gain }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Sine wave gives a pure, gentle music-box / bell timbre
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        // Bell strike envelope: instant attack, exponential natural decay
        gainNode.gain.setValueAtTime(0.001, now + time);
        gainNode.gain.exponentialRampToValueAtTime(gain, now + time + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);

        // Add soft metallic shimmer overtone for an authentic gentle bell sparkle
        const overtoneOsc = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtoneOsc.type = 'triangle';
        overtoneOsc.frequency.setValueAtTime(freq * 2.75, now + time);

        overtoneGain.gain.setValueAtTime(0.001, now + time);
        overtoneGain.gain.exponentialRampToValueAtTime(gain * 0.25, now + time + 0.01);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration * 0.4);

        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);

        overtoneOsc.start(now + time);
        overtoneOsc.stop(now + time + duration * 0.4);
      });

      // Mobile haptic vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([25, 30, 45]);
      }
    } catch (err) {
      console.warn('Audio effect error:', err);
    }
  }
}

export const soundEffects = new SoundEffects();
