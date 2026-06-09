const CampaignsModule = {
  activeTab: 'email',
  campaigns: [],
  editingId: null,

  init(container) {
    this.campaigns = this.getMockCampaigns();
    container.innerHTML = this.render();
    this.bindEvents();
    this.renderCampaigns();
  },

  getMockCampaigns() {
    return [
      { id:1, name:'Summer Promo 2024', type:'email', status:'Active', sent:1247, openRate:28.4, clickRate:6.2, unsubscribes:12, created:'Jun 1', subject:'Don\'t miss our summer deals! 🌞' },
      { id:2, name:'Follow Up Sequence', type:'email', status:'Active', sent:834, openRate:34.1, clickRate:9.8, unsubscribes:5, created:'May 28', subject:'Following up on your inquiry...' },
      { id:3, name:'Lead Nurture Drip', type:'email', status:'Paused', sent:456, openRate:22.7, clickRate:4.1, unsubscribes:8, created:'May 20', subject:'Here\'s what we can do for you' },
      { id:4, name:'Monthly Newsletter', type:'email', status:'Draft', sent:0, openRate:0, clickRate:0, unsubscribes:0, created:'Jun 5', subject:'June Updates & News' },
      { id:5, name:'Flash Sale Alert', type:'sms', status:'Completed', sent:2341, deliveredRate:98.2, replyRate:4.3, failed:42, created:'May 15' },
      { id:6, name:'Appointment Reminder', type:'sms', status:'Active', sent:678, deliveredRate:99.1, replyRate:12.8, failed:6, created:'Jun 3' },
      { id:7, name:'Welcome SMS', type:'sms', status:'Active', sent:1100, deliveredRate:97.8, replyRate:8.4, failed:24, created:'Apr 10' },
    ];
  },

  render() {
    return `
<div class="flex h-full">
  <!-- Left Sidebar -->
  <div class="w-52 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0">
    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Marketing</div>
    ${[
      ['email','fas fa-envelope','Email Campaigns'],
      ['sms','fas fa-sms','SMS Campaigns'],
      ['social','fas fa-share-alt','Social Planner'],
      ['drip','fas fa-stream','Drip Sequences'],
    ].map(([k,i,l])=>`
    <button data-campaign-tab="${k}" class="campaign-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${k===this.activeTab?'bg-blue-50 text-blue-700 font-medium':''}">
      <i class="${i} w-4 text-center text-xs"></i>${l}
    </button>`).join('')}
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-auto">
    <!-- Email Campaigns -->
    <div id="tab-email" class="${this.activeTab!=='email'?'hidden':''}">
      <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <h2 class="text-lg font-semibold text-gray-900 flex-1">Email Campaigns</h2>
        <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>All Statuses</option><option>Active</option><option>Draft</option><option>Paused</option><option>Completed</option></select>
        <button id="create-email-campaign-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Create Campaign</button>
      </div>
      <div class="p-5">
        <table class="w-full text-sm bg-white rounded-xl border border-gray-200 overflow-hidden">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>${['Campaign','Status','Sent','Open Rate','Click Rate','Unsubs','Created','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr>
          </thead>
          <tbody id="email-campaigns-tbody" class="divide-y divide-gray-100"></tbody>
        </table>
      </div>
    </div>

    <!-- SMS Campaigns -->
    <div id="tab-sms" class="${this.activeTab!=='sms'?'hidden':''}">
      <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <h2 class="text-lg font-semibold text-gray-900 flex-1">SMS Campaigns</h2>
        <button id="create-sms-campaign-btn" class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"><i class="fas fa-plus"></i>Create SMS Campaign</button>
      </div>
      <div class="p-5">
        <table class="w-full text-sm bg-white rounded-xl border border-gray-200 overflow-hidden">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>${['Campaign','Status','Sent','Delivered','Reply Rate','Failed','Created','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr>
          </thead>
          <tbody id="sms-campaigns-tbody" class="divide-y divide-gray-100"></tbody>
        </table>
      </div>
    </div>

    <!-- Social Planner -->
    <div id="tab-social" class="${this.activeTab!=='social'?'hidden':''}">
      <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <h2 class="text-lg font-semibold text-gray-900 flex-1">Social Planner</h2>
        <button class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"><i class="fas fa-plus"></i>Create Post</button>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-3 gap-4 mb-6">
          ${[
            ['Facebook','fab fa-facebook','blue','Connect','Not Connected'],
            ['Instagram','fab fa-instagram','pink','Connect','Not Connected'],
            ['Google Business','fab fa-google','red','Connect','Not Connected'],
          ].map(([n,i,c,btn,status])=>`
          <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div class="w-10 h-10 bg-${c}-100 rounded-lg flex items-center justify-center"><i class="${i} text-${c}-600 text-lg"></i></div>
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm">${n}</p>
              <p class="text-xs text-gray-400">${status}</p>
            </div>
            <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">${btn}</button>
          </div>`).join('')}
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <i class="fas fa-calendar-alt text-5xl text-gray-200 mb-4"></i>
          <p class="text-gray-500 font-medium">Connect a social account to start scheduling posts</p>
          <button class="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Connect Account</button>
        </div>
      </div>
    </div>

    <!-- Drip Sequences -->
    <div id="tab-drip" class="${this.activeTab!=='drip'?'hidden':''}">
      <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <h2 class="text-lg font-semibold text-gray-900 flex-1">Drip Sequences</h2>
        <button id="create-drip-btn" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"><i class="fas fa-plus"></i>Create Sequence</button>
      </div>
      <div class="p-5 space-y-4">
        ${[
          {name:'7-Day Lead Nurture',steps:7,enrolled:234,status:'Active',color:'green'},
          {name:'Post-Sale Onboarding',steps:5,enrolled:89,status:'Active',color:'green'},
          {name:'Re-engagement Series',steps:4,enrolled:45,status:'Paused',color:'yellow'},
          {name:'Trial User Upgrade',steps:6,enrolled:12,status:'Draft',color:'gray'},
        ].map(s=>`
        <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div class="flex-1">
            <p class="font-semibold text-gray-800">${s.name}</p>
            <p class="text-sm text-gray-500">${s.steps} steps · ${s.enrolled} enrolled</p>
          </div>
          <span class="px-2 py-1 bg-${s.color}-100 text-${s.color}-700 rounded-full text-xs font-medium">${s.status}</span>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">Edit</button>
            <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">Stats</button>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<!-- Email Campaign Modal -->
<div id="email-campaign-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <div>
        <h2 class="text-lg font-semibold">Create Email Campaign</h2>
        <div class="flex gap-2 mt-2">
          ${['Setup','Recipients','Email','Review'].map((s,i)=>`<span class="step-indicator text-xs px-2 py-0.5 rounded-full ${i===0?'bg-blue-600 text-white':'bg-gray-100 text-gray-500'}" data-step="${i}">${i+1}. ${s}</span>`).join('')}
        </div>
      </div>
      <button id="close-email-campaign-modal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <!-- Step 1: Setup -->
    <div id="ec-step-0" class="p-5 space-y-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label><input id="ec-name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. June Newsletter"></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">From Name</label><input id="ec-from-name" type="text" value="LeadFlow Team" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">From Email</label><input id="ec-from-email" type="email" value="hello@leadflow.com" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Subject Line *</label>
        <div class="flex gap-2">
          <input id="ec-subject" type="text" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your subject line...">
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50" title="Add emoji">😊</button>
        </div>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
        <div class="flex gap-3">
          <label class="flex items-center gap-2 text-sm"><input type="radio" name="ec-schedule" value="now" checked class="text-blue-600">Send Now</label>
          <label class="flex items-center gap-2 text-sm"><input type="radio" name="ec-schedule" value="schedule" class="text-blue-600">Schedule</label>
          <label class="flex items-center gap-2 text-sm"><input type="radio" name="ec-schedule" value="recurring" class="text-blue-600">Recurring</label>
        </div>
        <input type="datetime-local" id="ec-schedule-time" class="mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hidden focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
    </div>
    <!-- Step 2: Recipients (hidden) -->
    <div id="ec-step-1" class="p-5 hidden space-y-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Select Contact List(s)</label>
        <div class="space-y-2">
          ${['All Contacts (1,247)','Hot Leads (42)','Newsletter (389)','Customers (156)','My Contacts (89)'].map(l=>`
          <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="rounded text-blue-600"> <span class="text-sm text-gray-700">${l}</span>
          </label>`).join('')}
        </div>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
        <i class="fas fa-info-circle text-blue-500"></i>
        <p class="text-sm text-blue-700">Estimated recipients: <b>1,247</b></p>
      </div>
    </div>
    <!-- Step 3: Email Builder (hidden) -->
    <div id="ec-step-2" class="p-5 hidden">
      <p class="text-sm font-medium text-gray-700 mb-3">Choose a Template</p>
      <div class="grid grid-cols-3 gap-3 mb-4">
        ${['Blank','Newsletter','Promotion','Announcement','Follow Up','Thank You'].map((t,i)=>`
        <div class="border-2 ${i===0?'border-blue-500':'border-gray-200'} rounded-lg p-3 cursor-pointer hover:border-blue-400 text-center">
          <div class="w-full h-20 bg-gradient-to-b ${['from-gray-100 to-gray-200','from-blue-100 to-blue-200','from-green-100 to-green-200','from-purple-100 to-purple-200','from-orange-100 to-orange-200','from-pink-100 to-pink-200'][i]} rounded mb-2"></div>
          <p class="text-xs text-gray-700 font-medium">${t}</p>
        </div>`).join('')}
      </div>
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gray-800 text-white p-3 flex gap-2 text-xs">
          <button class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Header</button>
          <button class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Text</button>
          <button class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Button</button>
          <button class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Image</button>
          <button class="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">+ Divider</button>
        </div>
        <div class="p-6 bg-gray-50 min-h-48">
          <div class="max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2 text-center" contenteditable="true">Your Email Headline</h2>
            <p class="text-gray-600 text-sm text-center mb-4" contenteditable="true">Write your email body here. Click to edit any block.</p>
            <div class="text-center"><button class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm" contenteditable="true">Call to Action</button></div>
            <p class="text-xs text-gray-400 text-center mt-4">Unsubscribe · View in browser</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Step 4: Review (hidden) -->
    <div id="ec-step-3" class="p-5 hidden">
      <div class="space-y-3">
        ${[['Campaign Name','(will show here)','ec-review-name'],['From','LeadFlow Team <hello@leadflow.com>',null],['Subject','(will show here)','ec-review-subject'],['Recipients','~1,247 contacts',null],['Schedule','Send Now',null]].map(([l,v,id])=>`
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="text-sm text-gray-500">${l}</span>
          <span class="text-sm font-medium text-gray-800" ${id?`id="${id}"`:''} >${v}</span>
        </div>`).join('')}
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
          <i class="fas fa-exclamation-triangle text-yellow-500"></i>
          <div>
            <p class="text-sm font-medium text-yellow-800">Spam Check</p>
            <p class="text-xs text-yellow-700">Score: 1.2/10 (Excellent) · No issues found</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between p-5 border-t border-gray-200">
      <button id="ec-prev-btn" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 hidden">Back</button>
      <div class="flex gap-3 ml-auto">
        <button id="ec-test-btn" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Send Test</button>
        <button id="ec-next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next</button>
      </div>
    </div>
  </div>
</div>

<!-- SMS Campaign Modal -->
<div id="sms-campaign-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-lg">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <h2 class="text-lg font-semibold">Create SMS Campaign</h2>
      <button id="close-sms-campaign-modal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5 space-y-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label><input id="sc-name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <div class="relative">
          <textarea id="sc-body" rows="4" maxlength="160" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Hi {first_name}, ..."></textarea>
          <span id="sc-char-count" class="absolute bottom-2 right-3 text-xs text-gray-400">0/160</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">Use {first_name}, {last_name}, {business_name} for personalization</p>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
        <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Contacts (1,247)</option><option>Hot Leads (42)</option><option>Customers (156)</option>
        </select>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
        <div class="flex gap-3">
          <label class="flex items-center gap-2 text-sm"><input type="radio" name="sc-schedule" value="now" checked>Send Now</label>
          <label class="flex items-center gap-2 text-sm"><input type="radio" name="sc-schedule" value="schedule">Schedule</label>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-3 p-5 border-t border-gray-200">
      <button id="cancel-sms-modal" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
      <button id="save-sms-campaign-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Launch Campaign</button>
    </div>
  </div>
</div>`;
  },

  renderCampaigns() {
    const emailTbody = document.getElementById('email-campaigns-tbody');
    const smsTbody = document.getElementById('sms-campaigns-tbody');
    const statusColors = { Active:'green', Draft:'gray', Paused:'yellow', Completed:'blue' };

    if (emailTbody) {
      emailTbody.innerHTML = this.campaigns.filter(c=>c.type==='email').map(c=>{
        const sc = statusColors[c.status]||'gray';
        return `<tr class="hover:bg-gray-50">
          <td class="px-4 py-3"><p class="font-medium text-gray-900">${c.name}</p><p class="text-xs text-gray-400">${c.subject||''}</p></td>
          <td class="px-4 py-3"><span class="px-2 py-1 bg-${sc}-100 text-${sc}-700 rounded-full text-xs font-medium">${c.status}</span></td>
          <td class="px-4 py-3 text-gray-700">${c.sent.toLocaleString()}</td>
          <td class="px-4 py-3"><span class="font-medium ${parseFloat(c.openRate)>25?'text-green-700':'text-gray-700'}">${c.openRate}%</span></td>
          <td class="px-4 py-3 text-gray-700">${c.clickRate}%</td>
          <td class="px-4 py-3 text-gray-700">${c.unsubscribes}</td>
          <td class="px-4 py-3 text-gray-400 text-xs">${c.created}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              <button class="text-xs text-blue-600 hover:underline">Edit</button>
              <button class="text-xs text-gray-500 hover:underline">Clone</button>
              <button class="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    if (smsTbody) {
      smsTbody.innerHTML = this.campaigns.filter(c=>c.type==='sms').map(c=>{
        const sc = statusColors[c.status]||'gray';
        return `<tr class="hover:bg-gray-50">
          <td class="px-4 py-3 font-medium text-gray-900">${c.name}</td>
          <td class="px-4 py-3"><span class="px-2 py-1 bg-${sc}-100 text-${sc}-700 rounded-full text-xs font-medium">${c.status}</span></td>
          <td class="px-4 py-3 text-gray-700">${c.sent.toLocaleString()}</td>
          <td class="px-4 py-3 text-gray-700">${c.deliveredRate||0}%</td>
          <td class="px-4 py-3 text-gray-700">${c.replyRate||0}%</td>
          <td class="px-4 py-3 text-gray-700">${c.failed||0}</td>
          <td class="px-4 py-3 text-gray-400 text-xs">${c.created}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              <button class="text-xs text-blue-600 hover:underline">Edit</button>
              <button class="text-xs text-gray-500 hover:underline">Clone</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    }
  },

  bindEvents() {
    let ecStep = 0;
    document.querySelectorAll('.campaign-sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.campaignTab;
        document.querySelectorAll('.campaign-sidebar-btn').forEach(b => {
          b.className = `campaign-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${b.dataset.campaignTab===this.activeTab?'bg-blue-50 text-blue-700 font-medium':''}`;
        });
        ['email','sms','social','drip'].forEach(t => {
          document.getElementById('tab-'+t)?.classList.toggle('hidden', t !== this.activeTab);
        });
      });
    });

    document.getElementById('create-email-campaign-btn')?.addEventListener('click', () => {
      ecStep = 0;
      this.showEcStep(ecStep);
      document.getElementById('email-campaign-modal').classList.remove('hidden');
    });

    document.getElementById('close-email-campaign-modal')?.addEventListener('click', () => document.getElementById('email-campaign-modal').classList.add('hidden'));

    document.getElementById('ec-next-btn')?.addEventListener('click', () => {
      if (ecStep < 3) { ecStep++; this.showEcStep(ecStep); }
      else {
        const name = document.getElementById('ec-name')?.value;
        const subject = document.getElementById('ec-subject')?.value;
        if (!name || !subject) { alert('Please fill required fields'); ecStep=0; this.showEcStep(0); return; }
        this.campaigns.unshift({ id:Date.now(), name, type:'email', status:'Active', sent:0, openRate:0, clickRate:0, unsubscribes:0, created:'Today', subject });
        document.getElementById('email-campaign-modal').classList.add('hidden');
        this.renderCampaigns();
      }
    });

    document.getElementById('ec-prev-btn')?.addEventListener('click', () => {
      if (ecStep > 0) { ecStep--; this.showEcStep(ecStep); }
    });

    document.querySelectorAll('input[name="ec-schedule"]').forEach(r => {
      r.addEventListener('change', () => {
        const show = r.value === 'schedule';
        document.getElementById('ec-schedule-time')?.classList.toggle('hidden', !show);
      });
    });

    document.getElementById('create-sms-campaign-btn')?.addEventListener('click', () => document.getElementById('sms-campaign-modal').classList.remove('hidden'));
    document.getElementById('close-sms-campaign-modal')?.addEventListener('click', () => document.getElementById('sms-campaign-modal').classList.add('hidden'));
    document.getElementById('cancel-sms-modal')?.addEventListener('click', () => document.getElementById('sms-campaign-modal').classList.add('hidden'));

    document.getElementById('sc-body')?.addEventListener('input', e => {
      const el = document.getElementById('sc-char-count');
      if (el) el.textContent = `${e.target.value.length}/160`;
    });

    document.getElementById('save-sms-campaign-btn')?.addEventListener('click', () => {
      const name = document.getElementById('sc-name')?.value;
      if (!name) { alert('Enter campaign name'); return; }
      this.campaigns.unshift({ id:Date.now(), name, type:'sms', status:'Active', sent:0, deliveredRate:0, replyRate:0, failed:0, created:'Today' });
      document.getElementById('sms-campaign-modal').classList.add('hidden');
      this.renderCampaigns();
    });
  },

  showEcStep(step) {
    for (let i=0;i<4;i++) {
      document.getElementById('ec-step-'+i)?.classList.toggle('hidden', i !== step);
    }
    document.querySelectorAll('.step-indicator').forEach((el,i) => {
      el.className = `step-indicator text-xs px-2 py-0.5 rounded-full ${i===step?'bg-blue-600 text-white':i<step?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`;
    });
    const nextBtn = document.getElementById('ec-next-btn');
    const prevBtn = document.getElementById('ec-prev-btn');
    if (nextBtn) nextBtn.textContent = step === 3 ? 'Send Campaign' : 'Next';
    if (prevBtn) prevBtn.classList.toggle('hidden', step === 0);
    if (step === 3) {
      const name = document.getElementById('ec-name')?.value;
      const subject = document.getElementById('ec-subject')?.value;
      const revName = document.getElementById('ec-review-name');
      const revSubj = document.getElementById('ec-review-subject');
      if (revName) revName.textContent = name || '—';
      if (revSubj) revSubj.textContent = subject || '—';
    }
  }
};
