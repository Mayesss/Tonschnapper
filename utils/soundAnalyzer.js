export default class SoundAnalyzer {
  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.stream = null;
    this.onSpectrumUpdate = null;
  }

  startAnalysis() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.stream = stream;
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
          this.analyser.getByteFrequencyData(dataArray);
          const spectrum = Array.from(dataArray);
          if (this.onSpectrumUpdate) {
            this.onSpectrumUpdate(spectrum);
          }

          requestAnimationFrame(update);
        };

        update();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  stopAnalysis() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  setSpectrumUpdateCallback(callback) {
    this.onSpectrumUpdate = callback;
  }
}