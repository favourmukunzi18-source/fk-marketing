const SettingsModule = {
  activeTab: 'business',

  init(container) {
    container.innerHTML = this.render();
    this.bindEvents();
  },

  render() {
    const tabs = [
      ['business','fas fa-building','Business Info'],
      ['team','fas fa-users','Team & Users'],
      ['phone','fas fa-phone','Phone Numbers'],
      ['email-settings','fas fa-envelope','Email Settings'],
      ['integrations','fas fa-plug','Integrations'],
      ['billing','fas fa-credit-card','Billing'],
      ['custom-fields','fas fa-list','Custom Fields'],
      ['tags','fas fa-tags','Tags'],
      ['api','fas fa-code','API Keys'],
    ];
    return `
<div class="flex h-full">
  <!-- Settings Sidebar -->
  <div class="w-56 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0">
    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Settings</div>
    ${tabs.map(([k,i,l])=>`
    <button data-settings-tab="${k}" class="settings-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${k===this.activeTab?'bg-blue-50 text-blue-700 font-medium':''}">
      <i class="${i} w-4 text-center text-xs"></i>${l}
    </button>`).join('')}
  </div>

  <!-- Settings Content -->
  <div class="flex-1 overflow-auto">

    <!-- Business Info -->
    <div id="stab-business" class="${this.activeTab!=='business'?'hidden':''}">
      <div class="max-w-2xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Business Information</h2>
        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">L</div>
            <div>
              <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Upload Logo</button>
              <p class="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          ${[['Business Name','LeadFlow CRM'],['Website','https://leadflow.com'],['Phone','+1 (555) 000-0001'],['Email','hello@leadflow.com'],['Address','123 Business Ave'],['City','San Francisco'],['State','CA'],['Zip','94105']].map(([l,v])=>`
          <div><label class="block text-sm font-medium text-gray-700 mb-1">${l}</label><input type="text" value="${v}" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>`).join('')}
          <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>America/New_York</option><option>America/Chicago</option><option>America/Denver</option><option selected>America/Los_Angeles</option><option>UTC</option>
              </select>
            </div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option selected>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option><option>CAD (CA$)</option>
              </select>
            </div>
          </div>
          <div class="pt-2"><button class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button></div>
        </div>
      </div>
    </div>

    <!-- Team & Users -->
    <div id="stab-team" class="${this.activeTab!=='team'?'hidden':''}">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Team & Users</h2>
          <button id="add-user-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Invite User</button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200"><tr>${['User','Role','Status','Last Login','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-gray-100">
              ${[
                {n:'Alice Martinez',e:'alice@leadflow.com',r:'Admin',s:'Active',l:'Today',c:'blue',i:'AM'},
                {n:'Bob Kim',e:'bob@leadflow.com',r:'Manager',s:'Active',l:'Yesterday',c:'green',i:'BK'},
                {n:'Carol Thompson',e:'carol@leadflow.com',r:'User',s:'Active',l:'2 days ago',c:'purple',i:'CT'},
                {n:'David Ross',e:'david@leadflow.com',r:'User',s:'Active',l:'3 days ago',c:'orange',i:'DR'},
                {n:'Eve Johnson',e:'eve@leadflow.com',r:'View Only',s:'Inactive',l:'2 weeks ago',c:'gray',i:'EJ'},
              ].map(u=>`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-${u.c}-100 text-${u.c}-700 flex items-center justify-center text-xs font-bold">${u.i}</div><div><p class="font-medium text-gray-800">${u.n}</p><p class="text-xs text-gray-400">${u.e}</p></div></div></td>
                <td class="px-4 py-3"><span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">${u.r}</span></td>
                <td class="px-4 py-3"><span class="px-2 py-1 bg-${u.s==='Active'?'green':'gray'}-100 text-${u.s==='Active'?'green':'gray'}-700 rounded-full text-xs">${u.s}</span></td>
                <td class="px-4 py-3 text-gray-500 text-xs">${u.l}</td>
                <td class="px-4 py-3"><div class="flex gap-2"><button class="text-xs text-blue-600 hover:underline">Edit</button><button class="text-xs text-red-500 hover:underline">Remove</button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Integrations -->
    <div id="stab-integrations" class="${this.activeTab!=='integrations'?'hidden':''}">
      <div class="p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Integrations</h2>
        <div class="grid grid-cols-2 gap-4">
          ${[
            {name:'Stripe',desc:'Accept payments and manage subscriptions',icon:'fab fa-stripe',color:'purple',status:'Connect'},
            {name:'Twilio',desc:'Send SMS and make calls',icon:'fas fa-sms',color:'red',status:'Configure',fields:['Account SID','Auth Token','Phone Number']},
            {name:'Mailgun',desc:'Send transactional emails',icon:'fas fa-envelope',color:'orange',status:'Configure',fields:['API Key','Domain']},
            {name:'Google',desc:'Sync calendar and contacts with Gmail',icon:'fab fa-google',color:'blue',status:'Connect'},
            {name:'Facebook',desc:'Connect pages and ad accounts',icon:'fab fa-facebook',color:'blue',status:'Connect'},
            {name:'Zapier',desc:'Connect to 5,000+ apps',icon:'fas fa-bolt',color:'orange',status:'Copy Webhook'},
            {name:'Google Analytics',desc:'Track website visitors',icon:'fab fa-google',color:'yellow',fields:['Tracking ID (UA-XXXXXXXX)'],status:'Configure'},
            {name:'Facebook Pixel',desc:'Track ad conversions',icon:'fab fa-facebook-square',color:'blue',fields:['Pixel ID'],status:'Configure'},
          ].map(i=>`
          <div class="bg-white rounded-xl border border-gray-200 p-5">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-${i.color}-100 rounded-lg flex items-center justify-center"><i class="${i.icon} text-${i.color}-600 text-lg"></i></div>
                <div><p class="font-semibold text-gray-800">${i.name}</p><p class="text-xs text-gray-400">${i.desc}</p></div>
              </div>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">Not Connected</span>
            </div>
            ${i.fields?i.fields.map(f=>`<div class="mb-2"><input type="text" placeholder="${f}" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>`).join(''):''}
            <button class="w-full mt-2 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 font-medium">${i.status}</button>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Phone Numbers -->
    <div id="stab-phone" class="${this.activeTab!=='phone'?'hidden':''}">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Phone Numbers</h2>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Buy Number</button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200"><tr>${['Number','Label','Type','Forwarding','Status','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-gray-100">
              ${[
                ['+1 (555) 100-0001','Main Line','SMS + Voice','+1 (555) 000-0001','Active'],
                ['+1 (555) 200-0002','Sales','SMS Only','—','Active'],
                ['+1 (555) 300-0003','Support','Voice Only','+1 (555) 000-0003','Active'],
              ].map(r=>`
              <tr class="hover:bg-gray-50">
                ${r.map((v,i)=>`<td class="px-4 py-3 ${i===0?'font-medium text-gray-900':i===4?'':' text-gray-600'}">${i===4?`<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">${v}</span>`:v}</td>`).join('')}
                <td class="px-4 py-3"><div class="flex gap-2"><button class="text-xs text-blue-600 hover:underline">Configure</button><button class="text-xs text-red-500 hover:underline">Release</button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Email Settings -->
    <div id="stab-email-settings" class="${this.activeTab!=='email-settings'?'hidden':''}">
      <div class="max-w-2xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Email Settings</h2>
        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">From Name</label><input type="text" value="LeadFlow Team" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">From Email</label><input type="email" value="hello@leadflow.com" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
            <div class="flex gap-3">
              ${['Mailgun','SendGrid','SMTP'].map((p,i)=>`<label class="flex items-center gap-2 text-sm"><input type="radio" name="email-provider" ${i===0?'checked':''} class="text-blue-600">${p}</label>`).join('')}
            </div>
          </div>
          <div class="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Mailgun API Key</label><input type="password" placeholder="key-xxxxxxxxxxxxxxxx" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Mailgun Domain</label><input type="text" placeholder="mg.yourdomain.com" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
          </div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Email Signature</label>
            <div class="border border-gray-200 rounded-lg">
              <div class="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
                ${['bold','italic','underline','link'].map(f=>`<button class="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded text-xs"><i class="fas fa-${f}"></i></button>`).join('')}
              </div>
              <textarea rows="3" class="w-full px-3 py-2 text-sm focus:outline-none resize-none rounded-b-lg" placeholder="Your email signature...">Best regards,\nThe LeadFlow Team\nhello@leadflow.com</textarea>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Settings</button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Send Test Email</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing -->
    <div id="stab-billing" class="${this.activeTab!=='billing'?'hidden':''}">
      <div class="max-w-3xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white mb-6">
          <div class="flex items-center justify-between">
            <div><p class="text-blue-200 text-sm">Current Plan</p><p class="text-2xl font-bold">Agency Pro</p><p class="text-blue-200 text-sm mt-1">$297/month · Renews Jun 28, 2026</p></div>
            <button class="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50">Manage Plan</button>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4">
            ${[['Contacts','1,247 / Unlimited'],['Emails Sent','8,234 / 50,000'],['SMS Sent','2,156 / 10,000']].map(([l,v])=>`
            <div class="bg-blue-700 bg-opacity-50 rounded-lg p-3">
              <p class="text-blue-200 text-xs">${l}</p>
              <p class="text-white font-semibold text-sm mt-0.5">${v}</p>
            </div>`).join('')}
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h3 class="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div class="flex items-center gap-3">
            <div class="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <span class="text-gray-700">•••• •••• •••• 4242</span>
            <span class="text-gray-400 text-sm">Expires 12/27</span>
            <button class="ml-auto text-sm text-blue-600 hover:underline">Update</button>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-5 py-3 border-b border-gray-200"><h3 class="font-semibold text-gray-900">Invoice History</h3></div>
          <table class="w-full text-sm">
            <thead class="bg-gray-50"><tr>${['Date','Description','Amount','Status',''].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-gray-100">
              ${[['May 28, 2026','Agency Pro - Monthly','$297.00','Paid'],['Apr 28, 2026','Agency Pro - Monthly','$297.00','Paid'],['Mar 28, 2026','Agency Pro - Monthly','$297.00','Paid'],['Feb 28, 2026','Agency Pro - Monthly','$297.00','Paid']].map(r=>`
              <tr class="hover:bg-gray-50">${r.map((v,i)=>`<td class="px-4 py-3 ${i===2?'font-medium':i===3?'':'text-gray-600'}">${i===3?`<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">${v}</span>`:v}</td>`).join('')}<td class="px-4 py-3"><button class="text-xs text-blue-600 hover:underline">Download</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Custom Fields -->
    <div id="stab-custom-fields" class="${this.activeTab!=='custom-fields'?'hidden':''}">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Custom Fields</h2>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Add Field</button>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200"><tr>${['Field Name','Type','Object','Required','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-gray-100">
              ${[
                ['Company Size','Dropdown','Contact','No'],
                ['Annual Revenue','Number','Contact','No'],
                ['Lead Score','Number','Contact','No'],
                ['Industry','Dropdown','Contact','Yes'],
                ['Contract Value','Number','Opportunity','Yes'],
                ['Decision Maker','Text','Opportunity','No'],
              ].map(r=>`
              <tr class="hover:bg-gray-50">
                ${r.map((v,i)=>`<td class="px-4 py-3 ${i===0?'font-medium text-gray-800':i===3?'':'text-gray-600'}">${i===3?`<span class="px-2 py-0.5 bg-${v==='Yes'?'blue':'gray'}-100 text-${v==='Yes'?'blue':'gray'}-600 rounded-full text-xs">${v}</span>`:v}</td>`).join('')}
                <td class="px-4 py-3"><div class="flex gap-2"><button class="text-xs text-blue-600 hover:underline">Edit</button><button class="text-xs text-red-500 hover:underline">Delete</button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div id="stab-tags" class="${this.activeTab!=='tags'?'hidden':''}">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Tags Management</h2>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Add Tag</button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${[
            {name:'Hot Lead',color:'red',contacts:42,opps:15},
            {name:'VIP',color:'purple',contacts:18,opps:8},
            {name:'Newsletter',color:'blue',contacts:389,opps:0},
            {name:'Customer',color:'green',contacts:156,opps:24},
            {name:'Facebook Ad',color:'indigo',contacts:201,opps:32},
            {name:'Cold Lead',color:'gray',contacts:67,opps:5},
            {name:'Follow Up',color:'orange',contacts:54,opps:18},
            {name:'Referral',color:'teal',contacts:38,opps:12},
          ].map(t=>`
          <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-${t.color}-500 flex-shrink-0"></div>
            <div class="flex-1">
              <p class="font-medium text-gray-800 text-sm">${t.name}</p>
              <p class="text-xs text-gray-400">${t.contacts} contacts · ${t.opps} opportunities</p>
            </div>
            <div class="flex gap-1">
              <button class="p-1 text-gray-400 hover:text-blue-600 text-xs"><i class="fas fa-edit"></i></button>
              <button class="p-1 text-gray-400 hover:text-red-600 text-xs"><i class="fas fa-trash"></i></button>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- API Keys -->
    <div id="stab-api" class="${this.activeTab!=='api'?'hidden':''}">
      <div class="max-w-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">API Keys</h2>
          <button id="gen-api-key-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><i class="fas fa-plus"></i>Generate Key</button>
        </div>
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <i class="fas fa-exclamation-triangle text-yellow-500 mt-0.5"></i>
          <div><p class="text-sm font-medium text-yellow-800">Keep your API keys secure</p><p class="text-xs text-yellow-600">Never share your API keys in public repositories or client-side code.</p></div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200"><tr>${['Name','Key','Created','Last Used','Actions'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
            <tbody id="api-keys-tbody" class="divide-y divide-gray-100">
              ${[
                {name:'Production',key:'lf_prod_sk_xxxxxxxxxxxxxxxxxxxxxxxx',created:'Jan 15',used:'Today'},
                {name:'Development',key:'lf_dev_sk_xxxxxxxxxxxxxxxxxxxxxxxxx',created:'Mar 22',used:'Yesterday'},
              ].map(k=>`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">${k.name}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-600">${k.key.substring(0,20)}••••</td>
                <td class="px-4 py-3 text-gray-400 text-xs">${k.created}</td>
                <td class="px-4 py-3 text-gray-400 text-xs">${k.used}</td>
                <td class="px-4 py-3"><div class="flex gap-2"><button class="text-xs text-blue-600 hover:underline">Copy</button><button class="text-xs text-red-500 hover:underline">Revoke</button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</div>`;
  },

  bindEvents() {
    document.querySelectorAll('.settings-sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.settingsTab;
        document.querySelectorAll('.settings-sidebar-btn').forEach(b => {
          b.className = `settings-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${b.dataset.settingsTab===this.activeTab?'bg-blue-50 text-blue-700 font-medium':''}`;
        });
        ['business','team','phone','email-settings','integrations','billing','custom-fields','tags','api'].forEach(t => {
          document.getElementById('stab-'+t)?.classList.toggle('hidden', t !== this.activeTab);
        });
      });
    });

    document.getElementById('gen-api-key-btn')?.addEventListener('click', () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const key = 'lf_sk_' + Array.from({length:32},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
      const tbody = document.getElementById('api-keys-tbody');
      if (tbody) {
        const name = prompt('Key name:') || 'New Key';
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `<td class="px-4 py-3 font-medium text-gray-800">${name}</td><td class="px-4 py-3 font-mono text-xs text-gray-600">${key.substring(0,20)}••••</td><td class="px-4 py-3 text-gray-400 text-xs">Today</td><td class="px-4 py-3 text-gray-400 text-xs">Never</td><td class="px-4 py-3"><div class="flex gap-2"><button onclick="navigator.clipboard.writeText('${key}');alert('Copied!')" class="text-xs text-blue-600 hover:underline">Copy</button><button onclick="this.closest('tr').remove()" class="text-xs text-red-500 hover:underline">Revoke</button></div></td>`;
        tbody.appendChild(row);
      }
    });
  }
};
