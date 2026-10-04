/**
 * Gemini AI Interactive Assistant for Java Deep Dive Guides
 * Features:
 * - Floating AI Tutor badge & collapsible chat drawer
 * - Context-aware system prompting (automatically reads the current page's topic)
 * - Uses Google Gemini API (gemini-1.5-flash / gemini-2.5-flash) with client-side API key configuration
 * - Persistent chat history per page in localStorage
 * - Pre-configured quick-prompt chips ("Explain like I'm a Node dev", "How would this be asked in an interview?", "Show me a bug example")
 */
class GeminiAIAssistant {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.isOpen = false;
    this.isStreaming = false;
    this.history = [];
    this.model = 'gemini-1.5-flash';

    this.injectUI();
    this.loadHistory();
  }

  getCurrentPageContext() {
    const title = document.querySelector('h1')?.innerText || document.title;
    const subtitle = document.querySelector('main p')?.innerText || '';
    return {
      title,
      summary: subtitle,
      url: window.location.pathname
    };
  }

  injectUI() {
    if (document.getElementById('geminiAssistantWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'geminiAssistantWidget';
    widget.className = 'fixed bottom-5 left-5 z-50 flex flex-col items-start font-sans text-xs';

    widget.innerHTML = `
      <!-- Collapsible Chat Drawer -->
      <div id="geminiChatDrawer" class="hidden mb-3 w-[380px] sm:w-[440px] max-h-[580px] h-[520px] bg-white/95 backdrop-blur-xl border border-indigo-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        <!-- Drawer Header -->
        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs">✨</span>
            <div>
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                Gemini AI Java Tutor
                <span class="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-mono font-normal">Context-Aware</span>
              </div>
              <div class="text-[10px] text-slate-500 truncate max-w-[240px]" id="geminiPageTopic">Loading topic...</div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="window.geminiAssistant.promptApiKey()" title="Configure API Key" class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
              ⚙️
            </button>
            <button onclick="window.geminiAssistant.toggle()" class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
              ✕
            </button>
          </div>
        </div>

        <!-- API Key Missing Alert Banner -->
        <div id="geminiKeyBanner" class="hidden px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
          <span>Enter your free Gemini API key to ask questions.</span>
          <button onclick="window.geminiAssistant.promptApiKey()" class="underline font-bold text-amber-900 hover:text-indigo-600 ml-2">Set Key</button>
        </div>

        <!-- Chat Message Log -->
        <div id="geminiMessages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
          <!-- Populated dynamically -->
        </div>

        <!-- Suggested Prompt Chips -->
        <div class="px-3 py-1.5 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <button onclick="window.geminiAssistant.sendQuickPrompt('Explain this concept specifically using a Node.js analogy')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-all">
            💡 Node.js Analogy
          </button>
          <button onclick="window.geminiAssistant.sendQuickPrompt('What is the hardest question an interviewer will ask about this?')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-all">
            🎯 Interview Question
          </button>
          <button onclick="window.geminiAssistant.sendQuickPrompt('Show me a code snippet where this creates a production bug')" class="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200 transition-all">
            🐛 Production Bug
          </button>
        </div>

        <!-- Input Box -->
        <form onsubmit="window.geminiAssistant.handleSubmit(event)" class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input 
            type="text" 
            id="geminiInput" 
            placeholder="Ask anything about this Java concept..." 
            class="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button 
            type="submit" 
            id="geminiSendBtn"
            class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center shrink-0">
            Send
          </button>
        </form>

      </div>

      <!-- Floating Launch Badge -->
      <button 
        onclick="window.geminiAssistant.toggle()"
        class="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all transform hover:scale-105 active:scale-95">
        <span class="text-sm">✨</span>
        <span>Ask Gemini AI</span>
      </button>
    `;

    document.body.appendChild(widget);
    this.updateTopicHeader();
    this.checkApiKey();
  }

  updateTopicHeader() {
    const topicEl = document.getElementById('geminiPageTopic');
    if (topicEl) {
      const ctx = this.getCurrentPageContext();
      topicEl.innerText = ctx.title;
    }
  }

  checkApiKey() {
    const banner = document.getElementById('geminiKeyBanner');
    if (!banner) return;
    if (!this.apiKey) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  promptApiKey() {
    const current = this.apiKey ? '••••' + this.apiKey.slice(-4) : 'none';
    const key = prompt(`Enter your Google Gemini API Key (Current: ${current}):\n\nYou can get a free API key at https://aistudio.google.com/`);
    if (key !== null && key.trim() !== '') {
      this.apiKey = key.trim();
      localStorage.setItem('gemini_api_key', this.apiKey);
      this.checkApiKey();
      alert('Gemini API key saved securely in your browser!');
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById('geminiChatDrawer');
    if (!drawer) return;
    if (this.isOpen) {
      drawer.classList.remove('hidden');
      this.updateTopicHeader();
      setTimeout(() => document.getElementById('geminiInput')?.focus(), 100);
    } else {
      drawer.classList.add('hidden');
    }
  }

  loadHistory() {
    const key = 'gemini_chat_' + window.location.pathname;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        this.history = JSON.parse(saved);
        this.renderMessages();
        return;
      }
    } catch (e) {}

    // Initial greeting
    const ctx = this.getCurrentPageContext();
    this.history = [
      {
        role: 'model',
        text: `Hello! I'm your Gemini AI backend tutor. We are currently studying: **${ctx.title}**.\n\nAsk me anything! I can explain Java concepts using Node.js analogies, generate JUnit tests, or run an interview mock with you.`
      }
    ];
    this.renderMessages();
  }

  saveHistory() {
    const key = 'gemini_chat_' + window.location.pathname;
    try {
      localStorage.setItem(key, JSON.stringify(this.history));
    } catch (e) {}
  }

  renderMessages() {
    const container = document.getElementById('geminiMessages');
    if (!container) return;

    container.innerHTML = this.history.map(msg => {
      const isUser = msg.role === 'user';
      return `
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'}">
          <div class="max-w-[88%] p-3 rounded-2xl ${isUser ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'} space-y-1">
            <div class="text-[10px] font-bold ${isUser ? 'text-indigo-200' : 'text-indigo-600'}">
              ${isUser ? 'You' : 'Gemini AI'}
            </div>
            <div class="leading-relaxed whitespace-pre-wrap text-[11px]">${this.formatMarkdown(msg.text)}</div>
          </div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  }

  formatMarkdown(text) {
    // Basic formatting for code blocks and bold
    return text
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/50 p-2 rounded border border-slate-700/60 font-mono text-[10px] my-1 overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px]">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  sendQuickPrompt(text) {
    const input = document.getElementById('geminiInput');
    if (input) {
      input.value = text;
      this.handleSubmit(new Event('submit'));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('geminiInput');
    const question = input?.value?.trim();
    if (!question || this.isStreaming) return;

    if (!this.apiKey) {
      this.promptApiKey();
      if (!this.apiKey) return;
    }

    // Append user message
    this.history.push({ role: 'user', text: question });
    input.value = '';
    this.renderMessages();

    // Prepare context
    const ctx = this.getCurrentPageContext();
    const systemInstruction = `You are an elite Senior Staff Java & Spring Boot engineer teaching a senior Node.js developer (4-7 years experience).
Current topic on user's screen: "${ctx.title} - ${ctx.summary}".
Guidelines:
1. Always use precise Node.js vs Java analogies (e.g. libuv vs Virtual Threads, Prisma vs JPA, express middleware vs filters/interceptors).
2. Write concise, clean, production-grade code snippets.
3. Be direct, authoritative, and focused on senior interview / production trade-offs.`;

    // Append temporary loading model message
    this.isStreaming = true;
    this.history.push({ role: 'model', text: 'Thinking...' });
    this.renderMessages();

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${question}` }]
        }
      ];

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'Gemini API Error');
      }

      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      this.history[this.history.length - 1].text = answer;
      this.saveHistory();
    } catch (err) {
      this.history[this.history.length - 1].text = `⚠️ Error connecting to Gemini API: ${err.message}\n\nPlease verify your API key using the ⚙️ gear icon above.`;
    } finally {
      this.isStreaming = false;
      this.renderMessages();
    }
  }
}

// Mount when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.geminiAssistant = new GeminiAIAssistant();
});
