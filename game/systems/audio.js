/* =========================================================
   AUDIO
   ========================================================= */

import { save, saveGame } from './save.js';
import { notify } from '../render/notify.js';

export const AudioManager = {
  musicVolume: 0.35, sfxVolume: 0.2, ambientVolume: 0.25, ctx: null, unlocked: false, assets: {},
  unlock() {
    if (this.unlocked || !save.audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext(); this.unlocked = true;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    } catch (error) { console.warn('FireFly: áudio indisponível.', error); }
  },
  tone(frequency = 440, duration = 0.09, type = 'sine', volume = this.sfxVolume) {
    if (!this.unlocked || !this.ctx || !save.audioEnabled) return;
    try {
      const oscillator = this.ctx.createOscillator(); const gain = this.ctx.createGain();
      oscillator.type = type; oscillator.frequency.value = frequency;
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain); gain.connect(this.ctx.destination); oscillator.start(now); oscillator.stop(now + duration + 0.02);
    } catch (error) { console.warn('FireFly: erro de áudio.', error); }
  },
  playSFX(id) {
    if (!save.audioEnabled) return;
    switch (id) {
      case 'capture': this.tone(660, 0.08); setTimeout(() => this.tone(880, 0.12), 70); break;
      case 'coin': this.tone(980, 0.1); break;
      case 'purchase': this.tone(520, 0.08); setTimeout(() => this.tone(780, 0.12), 90); break;
      case 'quest-complete': this.tone(523, 0.1); setTimeout(() => this.tone(784, 0.1), 100); setTimeout(() => this.tone(1046, 0.16), 200); break;
      case 'van-door': this.tone(180, 0.12, 'square'); break;
      case 'van-engine': this.tone(90, 0.5, 'sawtooth', 0.08); break;
      case 'fish': this.tone(340, 0.12); break;
      case 'fish-bite': this.tone(420, 0.06); setTimeout(() => this.tone(300, 0.08), 60); break;
      case 'line-snap': this.tone(180, 0.18, 'sawtooth', 0.18); break;
      case 'net-swing': this.tone(240, 0.05, 'triangle', 0.12); break;
      case 'error': this.tone(150, 0.12, 'square'); break;
      default: break;
    }
  },
  playMusic(map) { this.currentMap = map; },
  playAmbient(map) { this.currentAmbient = map; },
  toggle() { save.audioEnabled = !save.audioEnabled; saveGame(); notify(save.audioEnabled ? 'Som ativado' : 'Som desativado'); }
};
