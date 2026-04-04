class AudioBeep {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
  }

  init() {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  play(beepCount = 1, frequency = 800, duration = 200, delay = 100) {
    if (!this.isEnabled) return;
    
    this.init();
    if (!this.audioContext) return;
    
    for (let i = 0; i < beepCount; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, duration);
      }, i * (duration + delay));
    }
  }

  playWarning() {
    this.play(2, 600, 150, 100);
  }

  playCritical() {
    this.play(3, 1000, 200, 80);
  }

  playSuccess() {
    this.play(1, 1200, 100, 0);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

export const audioBeep = new AudioBeep();

// Auto-initialize on first user interaction
export const initAudio = () => {
  const init = () => {
    audioBeep.init();
    document.removeEventListener('click', init);
    document.removeEventListener('touchstart', init);
  };
  document.addEventListener('click', init);
  document.addEventListener('touchstart', init);
};
