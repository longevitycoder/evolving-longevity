// ============================================
// EVOLVING LONGEVITY — AI Chatbot Widget
// Powered by Claude (Anthropic API)
// ============================================
(function() {
  'use strict';

  // Site knowledge base — Claude uses this as context
  const SITE_CONTEXT = `You are the Evolving Longevity AI assistant on evolvinglongevity.com. You help visitors learn about Zach's longevity protocol, data, articles, and services.

KEY FACTS ABOUT ZACH & THE SITE:
- Zach is 33 years old, 6'2", 215 lbs, Director of Operations, married with a toddler (Emmett)
- Functional age: 23.5 (chronological: 33) — Don't Die global rank #97
- Tracks 41 biomarkers with ZERO out of range
- Wears WHOOP 4.0 + Oura Ring Gen 4 simultaneously, 24/7, 600+ nights tracked
- VO2 Max: 46 (+31% improvement in 14 months)
- Cardiovascular age via Oura: 25

THE FOUR HORSEMEN (why this exists):
Zach built this protocol to stave off: metabolic disease (diabetes), heart disease, cancer, and neurodegenerative decline. After his son was born, he committed to being the strongest version of himself. His vision is that shared, honest data helps humanity evolve past preventable disease.

DAILY SUPPLEMENT STACK ($336/month total protocol):
- Blueprint Longevity Mix ($49/mo) — foundation, clinical-dose CaAKG, ashwagandha KSM-66, creatine, glycine, taurine, magnesium, vitamin C
- Creatine Monohydrate 5g/day ($15/mo) — 2.5g in Longevity Mix + 2.5g separate
- Blueprint Omega-3 Algae Oil ($39/mo) — 800mg EPA/DHA
- Extra Virgin Olive Oil ($20/mo) — high polyphenol, 2 tbsp 3-4x/week
- Men's One A Day ($12/mo) — insurance policy
- Woke AF Pre-Workout ($15/mo) — gym days only, before 4pm caffeine cutoff
- Protein shakes 2x/day ($90/mo)
- Crunch Fitness ($35/mo) — PPL 3-4x/week
- WHOOP + Oura subscriptions ($36/mo)
- Quarterly blood panels (~$25/mo amortized)

3 SLEEP RULES:
1. No caffeine after 4pm → +18min deep sleep
2. Dinner done 3.5+ hours before bed → +6pts Oura sleep score
3. Near-zero alcohol (once/month max) → +12% HRV improvement

SERVICES OFFERED:
- Snapshot ($49 one-time): 30-day data analysis, PDF report, 3 recommendations, 48hr delivery
- Deep Dive ($149 one-time): 90-day analysis, interactive dashboard, supplement audit, 15-min video walkthrough, 5 business day delivery
- Protocol Build ($79/month): Everything in Deep Dive + monthly refreshes, trend tracking, protocol adjustments, priority support

ARTICLES ON THE SITE:
1. WHOOP 4.0 vs Oura Ring Gen 4: 88 Days Wearing Both
2. AG1 vs Blueprint Longevity Mix: Why I Chose Blueprint (never tried AG1 — chose Blueprint based on dosing research)
3. I Reduced Alcohol to Once a Month and Tracked Every Biometric
4. My $336/Month Longevity Stack: What's Worth It and What I Cut
5. The 3 Sleep Rules That Actually Moved the Needle (600+ Nights of Data)

RESPONSE GUIDELINES:
- Be concise, helpful, and data-focused
- Reference specific numbers from Zach's data when relevant
- Direct people to specific articles or the services page when appropriate
- If asked medical questions, clarify this is data interpretation, not medical advice
- Keep responses under 150 words unless the question requires more detail
- Use a warm but professional tone — match the site's voice`;

  // Create widget HTML
  const widget = document.createElement('div');
  widget.id = 'el-chatbot';
  widget.innerHTML = `
    <style>
      #el-chatbot { position: fixed; bottom: 20px; right: 20px; z-index: 9998; font-family: 'DM Sans', -apple-system, sans-serif; }
      #el-chat-toggle { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #E8C97A, #D4A853, #A07D3A); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(212,168,83,0.3), 0 2px 8px rgba(0,0,0,0.3); transition: all 0.3s; position: relative; }
      #el-chat-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(212,168,83,0.4), 0 4px 12px rgba(0,0,0,0.3); }
      #el-chat-toggle svg { width: 26px; height: 26px; fill: #0A0A0A; transition: transform 0.3s; }
      #el-chat-toggle.open svg { transform: rotate(45deg); }
      #el-chat-toggle .pulse { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(212,168,83,0.3); animation: el-pulse 2s infinite; }
      @keyframes el-pulse { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
      
      #el-chat-window { display: none; position: absolute; bottom: 68px; right: 0; width: 360px; max-width: calc(100vw - 32px); height: 500px; max-height: calc(100vh - 120px); background: #111111; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 1px rgba(212,168,83,0.2); flex-direction: column; }
      #el-chat-window.open { display: flex; animation: el-slideUp 0.3s ease; }
      @keyframes el-slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      
      .el-chat-header { padding: 16px 18px; background: #1A1A1A; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
      .el-chat-header .el-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #E8C97A, #D4A853); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #0A0A0A; flex-shrink: 0; }
      .el-chat-header .el-info { flex: 1; }
      .el-chat-header .el-name { font-size: 14px; font-weight: 600; color: #E8E8E8; }
      .el-chat-header .el-status { font-size: 11px; color: #4ADE80; display: flex; align-items: center; gap: 4px; }
      .el-chat-header .el-dot { width: 6px; height: 6px; background: #4ADE80; border-radius: 50%; }
      
      .el-chat-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      .el-chat-body::-webkit-scrollbar { width: 4px; }
      .el-chat-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      
      .el-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.6; word-wrap: break-word; }
      .el-msg.bot { align-self: flex-start; background: #1A1A1A; color: #B8B8B8; border-bottom-left-radius: 4px; }
      .el-msg.user { align-self: flex-end; background: #D4A853; color: #0A0A0A; border-bottom-right-radius: 4px; }
      .el-msg.bot a { color: #D4A853; text-decoration: underline; }
      .el-typing { align-self: flex-start; padding: 10px 14px; background: #1A1A1A; border-radius: 12px; border-bottom-left-radius: 4px; display: none; }
      .el-typing span { display: inline-block; width: 6px; height: 6px; background: #888; border-radius: 50%; margin: 0 2px; animation: el-blink 1.2s infinite; }
      .el-typing span:nth-child(2) { animation-delay: 0.2s; }
      .el-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes el-blink { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
      
      .el-chat-input { padding: 12px 16px; background: #141414; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 8px; flex-shrink: 0; }
      .el-chat-input input { flex: 1; padding: 10px 14px; background: #1A1A1A; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #E8E8E8; font-family: inherit; font-size: 14px; outline: none; }
      .el-chat-input input:focus { border-color: rgba(212,168,83,0.3); }
      .el-chat-input input::placeholder { color: #555; }
      .el-chat-input button { padding: 10px 14px; background: #D4A853; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; flex-shrink: 0; }
      .el-chat-input button:hover { background: #E8C97A; }
      .el-chat-input button svg { width: 18px; height: 18px; fill: #0A0A0A; }
      
      .el-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
      .el-quick-btn { padding: 6px 12px; background: rgba(212,168,83,0.08); border: 1px solid rgba(212,168,83,0.2); border-radius: 16px; color: #D4A853; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
      .el-quick-btn:hover { background: rgba(212,168,83,0.15); border-color: rgba(212,168,83,0.4); }

      @media (max-width: 480px) {
        #el-chat-window { width: calc(100vw - 16px); right: -12px; bottom: 64px; height: calc(100vh - 100px); border-radius: 12px; }
      }
    </style>
    
    <div id="el-chat-window">
      <div class="el-chat-header">
        <div class="el-avatar">EL</div>
        <div class="el-info">
          <div class="el-name">Evolving Longevity AI</div>
          <div class="el-status"><span class="el-dot"></span> Online</div>
        </div>
      </div>
      <div class="el-chat-body" id="el-chat-body">
        <div class="el-msg bot">Hey! I'm the Evolving Longevity assistant. Ask me anything about Zach's protocol, supplements, sleep optimization, wearable data, or our personalized dashboard services.</div>
      </div>
      <div class="el-quick-btns" id="el-quick-btns">
        <button class="el-quick-btn" onclick="elAsk('What supplements does Zach take?')">Supplements</button>
        <button class="el-quick-btn" onclick="elAsk('How do I improve my sleep?')">Sleep tips</button>
        <button class="el-quick-btn" onclick="elAsk('What are the dashboard services?')">Services</button>
        <button class="el-quick-btn" onclick="elAsk('WHOOP vs Oura?')">WHOOP vs Oura</button>
      </div>
      <div class="el-typing" id="el-typing"><span></span><span></span><span></span></div>
      <div class="el-chat-input">
        <input type="text" id="el-chat-msg" placeholder="Ask me anything..." onkeydown="if(event.key==='Enter')elSend()">
        <button onclick="elSend()"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
      </div>
    </div>
    
    <button id="el-chat-toggle" onclick="elToggle()">
      <span class="pulse"></span>
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  let chatOpen = false;
  let conversationHistory = [];

  window.elToggle = function() {
    chatOpen = !chatOpen;
    document.getElementById('el-chat-window').classList.toggle('open', chatOpen);
    document.getElementById('el-chat-toggle').classList.toggle('open', chatOpen);
    // Remove pulse after first open
    const pulse = document.querySelector('#el-chat-toggle .pulse');
    if (pulse) pulse.remove();
    if (chatOpen) document.getElementById('el-chat-msg').focus();
  };

  window.elAsk = function(text) {
    document.getElementById('el-chat-msg').value = text;
    elSend();
    // Hide quick buttons after first use
    document.getElementById('el-quick-btns').style.display = 'none';
  };

  window.elSend = async function() {
    const input = document.getElementById('el-chat-msg');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    // Add user message
    addMessage(msg, 'user');
    
    // Show typing
    document.getElementById('el-typing').style.display = 'block';
    scrollChat();

    // Add to history
    conversationHistory.push({ role: 'user', content: msg });

    try {
      const response = await fetch('https://el-chatbot-proxy.czemeresz.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SITE_CONTEXT,
          messages: conversationHistory.slice(-10) // Keep last 10 messages for context
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Feel free to email zach@evolvinglongevity.com for help!";
      
      conversationHistory.push({ role: 'assistant', content: reply });
      document.getElementById('el-typing').style.display = 'none';
      addMessage(reply, 'bot');
    } catch (err) {
      document.getElementById('el-typing').style.display = 'none';
      addMessage("I'm having trouble connecting right now. You can email <a href='mailto:zach@evolvinglongevity.com'>zach@evolvinglongevity.com</a> or check out our <a href='/pages/services.html'>services page</a> for more info!", 'bot');
    }
  };

  function addMessage(text, type) {
    const body = document.getElementById('el-chat-body');
    const div = document.createElement('div');
    div.className = 'el-msg ' + type;
    if (type === 'bot') {
      // Allow links in bot messages
      div.innerHTML = text.replace(/\n/g, '<br>');
    } else {
      div.textContent = text;
    }
    body.appendChild(div);
    scrollChat();
  }

  function scrollChat() {
    const body = document.getElementById('el-chat-body');
    setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
  }
})();
