const ConversationsModule = {
  threads: [],
  activeThread: null,
  activeChannel: 'all',
  activeFilter: 'all',

  init(container) {
    this.threads = this.getMockThreads();
    container.innerHTML = this.render();
    this.bindEvents();
    if (this.threads.length) this.openThread(this.threads[0].id);
  },

  getMockThreads() {
    const contacts = ['James Wilson','Emma Rodriguez','Michael Chen','Sarah Johnson','David Martinez','Lisa Thompson','Robert Brown','Jennifer Davis','William Garcia','Patricia Miller','Charles Wilson','Barbara Anderson','Thomas Taylor','Linda Moore','Mark Jackson','Nancy White','Steven Harris','Betty Thompson','Andrew Lewis','Dorothy Lee'];
    const channels = ['sms','email','sms','email','sms','sms','email','sms','email','sms','sms','email','sms','email','sms','sms','email','sms','email','sms'];
    const previews = [
      'Hey, I wanted to follow up on our conversation yesterday...',
      'Thank you for the information! I have a few questions...',
      'When is our appointment scheduled for?',
      'I received your proposal and it looks great!',
      'Can you send me more details about the pricing?',
      'Just checking in - are we still on for Tuesday?',
      'I'm interested in getting started. What are the next steps?',
      'Do you offer any discounts for annual plans?',
      'Your team has been so helpful, thank you!',
      'I need to reschedule our meeting if possible',
      'Quick question about the contract...',
      'Love the product! Can I refer a friend?',
      'My invoice seems incorrect, can you check?',
      'When will my account be set up?',
      'I'm having trouble logging in',
      'Is there a free trial available?',
      'Can we hop on a call this week?',
      'Thanks for the quick response!',
      'I have a few changes to request',
      'Everything looks good, let\'s proceed!'
    ];
    return contacts.map((name,i) => ({
      id: i+1,
      contact: name,
      channel: channels[i],
      preview: previews[i],
      time: this.randomTime(i),
      unread: i < 5,
      starred: i === 1 || i === 4,
      assignedTo: ['Alice M.','Bob K.','Carol T.','David R.'][i%4],
      messages: this.generateMessages(name, channels[i], i)
    }));
  },

  randomTime(i) {
    if (i===0) return 'Just now';
    if (i===1) return '5m ago';
    if (i===2) return '23m ago';
    if (i<8) return `${i}h ago`;
    return `${i-5} days ago`;
  },

  generateMessages(name, channel, seed) {
    const msgs = [];
    const count = 4 + (seed % 4);
    for (let i = 0; i < count; i++) {
      const incoming = i % 2 === 0;
      msgs.push({
        id: i+1,
        from: incoming ? name : 'You',
        body: incoming ?
          ['Hi there! I saw your ad online.','Can you tell me more about your services?','That sounds great, what are the pricing options?','Perfect, I\'ll think about it and get back to you.','Actually, let\'s go ahead!'][i%5] :
          ['Hi! Thanks for reaching out.','Of course! We offer a full marketing platform.','Our plans start at $97/month. Want a demo?','Absolutely, take your time. I\'m here if you have questions.','Excellent! Let me send you the onboarding details.'][i%5],
        time: new Date(Date.now() - (count-i)*3600000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
        incoming, channel, read: true
      });
    }
    return msgs;
  },

  render() {
    return `
<div class="flex h-full" style="height:calc(100vh - 60px)">
  <!-- Thread List Panel -->
  <div class="w-80 border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
    <!-- Inbox Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-bold text-gray-900 mb-3">Conversations</h2>
      <div class="relative mb-3">
        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
        <input id="conv-search" type="text" placeholder="Search conversations..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <!-- Channel Filter -->
      <div class="flex gap-1">
        ${[['all','All'],['sms','SMS'],['email','Email'],['facebook','FB']].map(([k,l])=>`
        <button data-channel="${k}" class="channel-btn flex-1 py-1.5 text-xs rounded-lg font-medium ${k==='all'?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}">${l}</button>`).join('')}
      </div>
    </div>
    <!-- Filter Tabs -->
    <div class="flex border-b border-gray-200">
      ${[['all','All'],['unread','Unread'],['starred','Starred'],['mine','Mine']].map(([k,l])=>`
      <button data-filter="${k}" class="filter-btn flex-1 py-2 text-xs font-medium ${k==='all'?'text-blue-600 border-b-2 border-blue-600':'text-gray-500 hover:text-gray-700'}">${l}</button>`).join('')}
    </div>
    <!-- Thread List -->
    <div class="flex-1 overflow-y-auto" id="thread-list"></div>
  </div>

  <!-- Chat Panel -->
  <div class="flex-1 flex flex-col bg-gray-50">
    <div id="chat-area" class="flex-1 flex flex-col"></div>
  </div>

  <!-- Contact Info Sidebar -->
  <div class="w-64 border-l border-gray-200 bg-white flex-shrink-0 overflow-y-auto" id="conv-contact-sidebar"></div>
</div>

<!-- Templates Modal -->
<div id="templates-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-lg">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <h2 class="text-lg font-semibold">Message Templates</h2>
      <button id="close-templates" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
    </div>
    <div class="p-4">
      <input type="text" placeholder="Search templates..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div class="space-y-2 max-h-80 overflow-y-auto">
        ${[
          ['Follow Up','Hi {first_name}, just following up on our conversation. Do you have any questions?'],
          ['Appointment Reminder','Hi {first_name}! This is a reminder about your appointment tomorrow at {time}. Reply to confirm.'],
          ['Welcome Message','Welcome {first_name}! We\'re excited to have you on board. Here\'s what happens next...'],
          ['Re-engagement','Hi {first_name}, we haven\'t heard from you in a while. Is there anything we can help with?'],
          ['Proposal Sent','Hi {first_name}, I just sent over the proposal. Let me know if you have any questions!'],
          ['Thank You','Thank you for choosing us, {first_name}! We look forward to working with you.'],
        ].map(([title,body])=>`
        <div class="template-item p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" data-body="${body}">
          <p class="text-sm font-medium text-gray-800">${title}</p>
          <p class="text-xs text-gray-500 mt-0.5">${body.substring(0,80)}...</p>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>`;
  },

  renderThreadList() {
    let threads = this.threads;
    if (this.activeChannel !== 'all') threads = threads.filter(t => t.channel === this.activeChannel);
    if (this.activeFilter === 'unread') threads = threads.filter(t => t.unread);
    if (this.activeFilter === 'starred') threads = threads.filter(t => t.starred);
    if (this.activeFilter === 'mine') threads = threads.filter(t => t.assignedTo === 'Alice M.');

    document.getElementById('thread-list').innerHTML = threads.map(t => `
    <div class="thread-item px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${this.activeThread?.id === t.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}" data-id="${t.id}">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-${['blue','green','purple','orange'][t.id%4]}-100 text-${['blue','green','purple','orange'][t.id%4]}-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            ${t.contact.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 ${t.unread?'font-semibold':''}">${t.contact}</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="text-xs text-gray-400">${t.time}</span>
          <div class="flex gap-1">
            <i class="fas fa-${t.channel==='sms'?'sms':'envelope'} text-${t.channel==='sms'?'green':'blue'}-400 text-xs"></i>
            ${t.unread ? '<span class="w-2 h-2 bg-blue-500 rounded-full"></span>' : ''}
            ${t.starred ? '<i class="fas fa-star text-yellow-400 text-xs"></i>' : ''}
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-500 truncate ml-10">${t.preview}</p>
    </div>`).join('') || '<div class="p-8 text-center text-gray-400 text-sm">No conversations found</div>';
  },

  openThread(id) {
    const thread = this.threads.find(t => t.id === id);
    if (!thread) return;
    this.activeThread = thread;
    thread.unread = false;
    this.renderThreadList();
    this.renderChat(thread);
    this.renderContactSidebar(thread);
  },

  renderChat(thread) {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = `
    <!-- Chat Header -->
    <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
          ${thread.contact.split(' ').map(n=>n[0]).join('')}
        </div>
        <div>
          <p class="font-semibold text-gray-900">${thread.contact}</p>
          <p class="text-xs text-gray-400"><i class="fas fa-${thread.channel==='sms'?'sms':'envelope'} mr-1"></i>${thread.channel.toUpperCase()} · ${thread.assignedTo}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1"><i class="fas fa-phone"></i>Call</button>
        <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1"><i class="fas fa-calendar"></i>Appt</button>
        <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1"><i class="fas fa-tasks"></i>Task</button>
        <button class="p-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50"><i class="fas fa-ellipsis-v"></i></button>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-5 space-y-4" id="messages-container">
      ${thread.messages.map(m => `
      <div class="flex ${m.incoming?'justify-start':'justify-end'}">
        <div class="max-w-xs lg:max-w-md">
          <div class="px-4 py-2.5 rounded-2xl text-sm ${m.incoming?'bg-white border border-gray-200 text-gray-800 rounded-tl-sm':'bg-blue-600 text-white rounded-tr-sm'}">
            ${m.body}
          </div>
          <p class="text-xs text-gray-400 mt-1 ${m.incoming?'text-left':'text-right'}">${m.time}</p>
        </div>
      </div>`).join('')}
    </div>

    <!-- Composer -->
    <div class="bg-white border-t border-gray-200 p-4 flex-shrink-0">
      <!-- Channel Toggle -->
      <div class="flex gap-2 mb-3">
        <button data-compose-channel="sms" class="compose-channel-btn px-3 py-1.5 text-xs rounded-lg font-medium flex items-center gap-1 ${thread.channel==='sms'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          <i class="fas fa-sms"></i>SMS
        </button>
        <button data-compose-channel="email" class="compose-channel-btn px-3 py-1.5 text-xs rounded-lg font-medium flex items-center gap-1 ${thread.channel==='email'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
          <i class="fas fa-envelope"></i>Email
        </button>
      </div>

      <!-- SMS Composer -->
      <div id="sms-composer" class="${thread.channel!=='sms'?'hidden':''}">
        <textarea id="sms-body" rows="3" placeholder="Type your SMS message..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"></textarea>
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button class="open-templates-btn text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"><i class="fas fa-file-alt"></i>Templates</button>
            <button class="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"><i class="fas fa-user-tag"></i>{personalize}</button>
            <span id="sms-char-count" class="text-xs text-gray-400">0/160</span>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1"><i class="fas fa-clock"></i>Schedule</button>
            <button id="send-sms-btn" class="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center gap-1"><i class="fas fa-paper-plane"></i>Send SMS</button>
          </div>
        </div>
      </div>

      <!-- Email Composer -->
      <div id="email-composer" class="${thread.channel!=='email'?'hidden':''}">
        <input type="text" placeholder="Subject..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div class="border border-gray-300 rounded-lg mb-2">
          <div class="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            ${['bold','italic','underline','link'].map(f=>`<button class="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded text-xs" title="${f}"><i class="fas fa-${f}"></i></button>`).join('')}
          </div>
          <textarea rows="4" placeholder="Compose your email..." class="w-full px-3 py-2 text-sm focus:outline-none resize-none rounded-b-lg"></textarea>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button class="open-templates-btn text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"><i class="fas fa-file-alt"></i>Templates</button>
            <button class="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"><i class="fas fa-paperclip"></i>Attach</button>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">Save Draft</button>
            <button id="send-email-btn" class="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1"><i class="fas fa-paper-plane"></i>Send Email</button>
          </div>
        </div>
      </div>
    </div>`;

    // Scroll to bottom
    const mc = document.getElementById('messages-container');
    if (mc) mc.scrollTop = mc.scrollHeight;

    this.bindChatEvents(thread);
  },

  renderContactSidebar(thread) {
    const first = thread.contact.split(' ')[0];
    document.getElementById('conv-contact-sidebar').innerHTML = `
    <div class="p-4 border-b border-gray-200">
      <div class="text-center mb-3">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold mx-auto mb-2">
          ${thread.contact.split(' ').map(n=>n[0]).join('')}
        </div>
        <p class="font-semibold text-gray-900 text-sm">${thread.contact}</p>
        <p class="text-xs text-gray-400">${thread.assignedTo}</p>
      </div>
    </div>
    <div class="p-4 space-y-3">
      <div><p class="text-xs font-semibold text-gray-400 uppercase mb-1">Tags</p>
        <div class="flex flex-wrap gap-1">
          <span class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">Hot Lead</span>
          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Newsletter</span>
        </div>
      </div>
      <div><p class="text-xs font-semibold text-gray-400 uppercase mb-1">Pipeline</p>
        <span class="text-sm text-gray-700">Contacted</span>
      </div>
      <div><p class="text-xs font-semibold text-gray-400 uppercase mb-1">Source</p>
        <span class="text-sm text-gray-700">Facebook Ad</span>
      </div>
      <div><p class="text-xs font-semibold text-gray-400 uppercase mb-1">Campaigns</p>
        <span class="text-xs text-gray-500">Summer Promo, Follow Up Seq.</span>
      </div>
    </div>
    <div class="p-4 border-t border-gray-200">
      <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Quick Note</p>
      <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Add a note..."></textarea>
      <button class="mt-1.5 w-full py-1.5 bg-gray-800 text-white rounded-lg text-xs hover:bg-gray-700">Save Note</button>
    </div>`;
  },

  bindChatEvents(thread) {
    document.querySelectorAll('.compose-channel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = btn.dataset.composeChannel;
        document.getElementById('sms-composer').classList.toggle('hidden', ch !== 'sms');
        document.getElementById('email-composer').classList.toggle('hidden', ch !== 'email');
        document.querySelectorAll('.compose-channel-btn').forEach(b => {
          const active = b.dataset.composeChannel === ch;
          const isEmail = b.dataset.composeChannel === 'email';
          b.className = `compose-channel-btn px-3 py-1.5 text-xs rounded-lg font-medium flex items-center gap-1 ${active?(isEmail?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'):'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;
        });
      });
    });

    document.getElementById('sms-body')?.addEventListener('input', e => {
      const len = e.target.value.length;
      const el = document.getElementById('sms-char-count');
      if (el) { el.textContent = `${len}/160`; el.className = `text-xs ${len > 160 ? 'text-red-500' : 'text-gray-400'}`; }
    });

    document.getElementById('send-sms-btn')?.addEventListener('click', () => {
      const body = document.getElementById('sms-body')?.value.trim();
      if (!body) return;
      thread.messages.push({ id: Date.now(), from:'You', body, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), incoming:false, channel:'sms', read:true });
      thread.preview = body;
      document.getElementById('sms-body').value = '';
      this.renderChat(thread);
    });

    document.getElementById('send-email-btn')?.addEventListener('click', () => {
      const bodyEl = document.querySelector('#email-composer textarea');
      const body = bodyEl?.value.trim();
      if (!body) return;
      thread.messages.push({ id: Date.now(), from:'You', body, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), incoming:false, channel:'email', read:true });
      thread.preview = body;
      if(bodyEl) bodyEl.value = '';
      this.renderChat(thread);
    });

    document.querySelectorAll('.open-templates-btn').forEach(btn => {
      btn.addEventListener('click', () => document.getElementById('templates-modal').classList.remove('hidden'));
    });
  },

  bindEvents() {
    this.renderThreadList();

    document.getElementById('thread-list')?.addEventListener('click', e => {
      const item = e.target.closest('.thread-item');
      if (item) this.openThread(parseInt(item.dataset.id));
    });

    document.querySelectorAll('.channel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeChannel = btn.dataset.channel;
        document.querySelectorAll('.channel-btn').forEach(b => {
          b.className = `channel-btn flex-1 py-1.5 text-xs rounded-lg font-medium ${b.dataset.channel===this.activeChannel?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;
        });
        this.renderThreadList();
      });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.className = `filter-btn flex-1 py-2 text-xs font-medium ${b.dataset.filter===this.activeFilter?'text-blue-600 border-b-2 border-blue-600':'text-gray-500 hover:text-gray-700'}`;
        });
        this.renderThreadList();
      });
    });

    document.getElementById('conv-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      // Filter threads by search
      const filtered = this.threads.filter(t => t.contact.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q));
      document.getElementById('thread-list').innerHTML = filtered.map(t => `
      <div class="thread-item px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50" data-id="${t.id}">
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm font-medium text-gray-900">${t.contact}</p>
          <span class="text-xs text-gray-400">${t.time}</span>
        </div>
        <p class="text-xs text-gray-500 truncate">${t.preview}</p>
      </div>`).join('');
    });

    document.getElementById('close-templates')?.addEventListener('click', () => document.getElementById('templates-modal').classList.add('hidden'));
    document.querySelectorAll('.template-item').forEach(item => {
      item.addEventListener('click', () => {
        const body = item.dataset.body;
        const smsBody = document.getElementById('sms-body');
        if (smsBody && !document.getElementById('sms-composer')?.classList.contains('hidden')) {
          smsBody.value = body;
        }
        document.getElementById('templates-modal').classList.add('hidden');
      });
    });
  }
};
