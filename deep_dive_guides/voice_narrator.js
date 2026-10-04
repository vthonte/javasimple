/**
 * Audio Narration Controller for Java Deep Dive Guides
 * Uses HTML5 Web Speech API (speechSynthesis) with zero external dependencies.
 * Provides Play, Pause, Resume, Stop, Speed (1x, 1.25x, 1.5x, 2x), and Progress controls.
 */
class VoiceNarrator {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentSpeed = 1.0;
    this.textQueue = [];
    this.currentChunkIndex = 0;
    this.voices = [];

    this.initVoices();
    this.injectUI();
  }

  initVoices() {
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };
    updateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getBestVoice() {
    if (!this.voices || this.voices.length === 0) return null;
    // Prefer natural sounding English voices
    const preferred = this.voices.find(v => 
      (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Samantha") || v.name.includes("Jenny")) 
      && v.lang.startsWith("en")
    );
    return preferred || this.voices.find(v => v.lang.startsWith("en")) || this.voices[0];
  }

  extractContent() {
    const mainEl = document.querySelector('main');
    if (!mainEl) return [];

    // Extract headings, paragraphs, and list items while cleanly summarizing code blocks
    const nodes = mainEl.querySelectorAll('h1, h2, h3, h4, p, li, pre');
    const chunks = [];

    nodes.forEach(node => {
      // Don't read nav buttons or back links
      if (node.closest('header') || node.closest('.border-t')) return;

      if (node.tagName.toLowerCase() === 'pre') {
        const title = node.parentElement.querySelector('.font-bold')?.innerText || 'Code block';
        chunks.push(`Code example for ${title}. You can review the syntax on screen.`);
      } else {
        const text = node.innerText.trim();
        // Skip very short fragments or icons
        if (text.length > 5 && !text.startsWith('←') && !text.startsWith('Next')) {
          chunks.push(text);
        }
      }
    });

    return chunks;
  }

  play() {
    if (this.isPaused) {
      this.synth.resume();
      this.isPlaying = true;
      this.isPaused = false;
      this.updateUI();
      return;
    }

    this.stop();
    this.textQueue = this.extractContent();
    if (this.textQueue.length === 0) return;

    this.currentChunkIndex = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.speakCurrentChunk();
    this.updateUI();
  }

  speakCurrentChunk() {
    if (!this.isPlaying || this.currentChunkIndex >= this.textQueue.length) {
      this.stop();
      return;
    }

    const text = this.textQueue[this.currentChunkIndex];
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = this.currentSpeed;
    
    const voice = this.getBestVoice();
    if (voice) this.utterance.voice = voice;

    this.utterance.onend = () => {
      if (this.isPlaying) {
        this.currentChunkIndex++;
        this.updateProgress();
        this.speakCurrentChunk();
      }
    };

    this.utterance.onerror = (e) => {
      console.warn("Speech synthesis error or cancel:", e);
      if (this.isPlaying) {
        this.currentChunkIndex++;
        this.speakCurrentChunk();
      }
    };

    this.synth.speak(this.utterance);
    this.updateProgress();
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.isPlaying = false;
      this.updateUI();
    }
  }

  stop() {
    this.synth.cancel();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentChunkIndex = 0;
    this.updateUI();
    this.updateProgress();
  }

  setSpeed(speed) {
    this.currentSpeed = parseFloat(speed);
    if (this.isPlaying) {
      // Restart current chunk with new rate
      this.synth.cancel();
      this.speakCurrentChunk();
    }
    const speedBtn = document.getElementById('audioSpeedBtn');
    if (speedBtn) speedBtn.innerText = `${this.currentSpeed}x`;
  }

  cycleSpeed() {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    let nextIdx = (speeds.indexOf(this.currentSpeed) + 1) % speeds.length;
    this.setSpeed(speeds[nextIdx]);
  }

  updateProgress() {
    const progressEl = document.getElementById('audioProgressBar');
    const labelEl = document.getElementById('audioProgressLabel');
    if (!progressEl || this.textQueue.length === 0) return;

    const percent = Math.min(100, Math.round((this.currentChunkIndex / this.textQueue.length) * 100));
    progressEl.style.width = `${percent}%`;
    if (labelEl) labelEl.innerText = `${percent}%`;
  }

  updateUI() {
    const playBtn = document.getElementById('audioPlayBtn');
    const statusText = document.getElementById('audioStatusText');
    if (!playBtn) return;

    if (this.isPlaying) {
      playBtn.innerHTML = '⏸️ Pause';
      playBtn.className = 'px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-amber-600/30';
      if (statusText) statusText.innerText = 'Narrating guide...';
    } else if (this.isPaused) {
      playBtn.innerHTML = '▶️ Resume';
      playBtn.className = 'px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30';
      if (statusText) statusText.innerText = 'Paused';
    } else {
      playBtn.innerHTML = '🔊 Listen (Voice)';
      playBtn.className = 'px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30';
      if (statusText) statusText.innerText = 'Ready to narrate';
    }
  }

  injectUI() {
    if (document.getElementById('voicePlayerWidget')) return;

    const bar = document.createElement('div');
    bar.id = 'voicePlayerWidget';
    bar.className = 'fixed bottom-5 right-5 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2 max-w-sm w-full text-xs text-slate-700 transition-all';
    
    bar.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-slate-900 tracking-tight">Audio Explanation</span>
          <span id="audioProgressLabel" class="text-[10px] text-slate-500 font-mono">0%</span>
        </div>
        <span id="audioStatusText" class="text-[11px] text-slate-500">Ready to narrate</span>
      </div>

      <!-- Progress bar -->
      <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div id="audioProgressBar" class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-between pt-1">
        <div class="flex items-center gap-2">
          <button id="audioPlayBtn" onclick="window.voiceNarrator.isPlaying ? window.voiceNarrator.pause() : window.voiceNarrator.play()" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20">
            🔊 Listen (Voice)
          </button>
          <button id="audioStopBtn" onclick="window.voiceNarrator.stop()" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all">
            ⏹️ Stop
          </button>
        </div>

        <button id="audioSpeedBtn" onclick="window.voiceNarrator.cycleSpeed()" title="Change Playback Speed" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold transition-all">
          1x
        </button>
      </div>
    `;

    document.body.appendChild(bar);
  }
}

// Automatically mount when DOM loads
window.addEventListener('DOMContentLoaded', () => {
  window.voiceNarrator = new VoiceNarrator();
});
