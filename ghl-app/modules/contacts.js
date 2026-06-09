const ContactsModule = {
  contacts: [],
  filtered: [],
  page: 1,
  perPage: 25,
  selected: new Set(),
  activeContact: null,

  init(container) {
    this.contacts = this.getMockContacts();
    this.filtered = [...this.contacts];
    container.innerHTML = this.render();
    this.bindEvents();
    this.renderTable();
  },

  getMockContacts() {
    const tags = ['Hot Lead','VIP','Newsletter','Facebook Ad','Cold Lead','Customer','Follow Up','Referral'];
    const sources = ['Facebook Ad','Google Ad','Referral','Website','Manual','Instagram','Cold Outreach'];
    const statuses = ['Lead','Active','Customer','Unsubscribed'];
    const stages = ['New Lead','Contacted','Proposal','Won','Lost'];
    const names = [
      ['James','Wilson'],['Emma','Rodriguez'],['Michael','Chen'],['Sarah','Johnson'],['David','Martinez'],
      ['Lisa','Thompson'],['Robert','Brown'],['Jennifer','Davis'],['William','Garcia'],['Patricia','Miller'],
      ['Charles','Wilson'],['Barbara','Anderson'],['Thomas','Taylor'],['Linda','Moore'],['Mark','Jackson'],
      ['Nancy','White'],['Steven','Harris'],['Betty','Thompson'],['Andrew','Lewis'],['Dorothy','Lee'],
      ['Paul','Walker'],['Sandra','Hall'],['Kevin','Allen'],['Ashley','Young'],['Brian','Hernandez']
    ];
    return names.map(([fn,ln],i) => ({
      id: i+1,
      firstName: fn, lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      phone: `+1 (${300+i}) ${500+i}-${1000+i}`,
      address: `${100+i*10} Main St`,
      city: ['New York','Los Angeles','Chicago','Houston','Phoenix'][i%5],
      state: ['NY','CA','IL','TX','AZ'][i%5],
      tags: [tags[i%tags.length], tags[(i+2)%tags.length]].slice(0, i%2===0?2:1),
      source: sources[i%sources.length],
      status: statuses[i%statuses.length],
      stage: stages[i%stages.length],
      value: Math.round((Math.random()*10000+500)/100)*100,
      lastActivity: new Date(Date.now() - Math.random()*30*86400000).toLocaleDateString(),
      dateAdded: new Date(Date.now() - Math.random()*180*86400000).toLocaleDateString(),
      notes: [],
      avatar: fn[0]+ln[0],
      avatarColor: ['blue','green','purple','orange','pink','indigo','teal'][i%7]
    }));
  },

  render() {
    return `
<div class="flex h-full">
  <!-- Left Smart Lists Sidebar -->
  <div class="w-52 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0" style="min-height:calc(100vh - 60px)">
    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Smart Lists</div>
    ${[
      ['All Contacts','fas fa-users','all',this.contacts.length],
      ['My Contacts','fas fa-user','mine',8],
      ['Recent','fas fa-clock','recent',12],
      ['Hot Leads','fas fa-fire','hot',5],
      ['Customers','fas fa-star','customers',7],
      ['Unsubscribed','fas fa-ban','unsub',3],
    ].map(([l,i,k,c])=>`
    <button data-list="${k}" class="smart-list-btn w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${k==='all'?'bg-blue-50 text-blue-700 font-medium':''}">
      <span class="flex items-center gap-2"><i class="${i} w-4 text-center"></i>${l}</span>
      <span class="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5">${c}</span>
    </button>`).join('')}
    <div class="mt-3 border-t border-gray-200 pt-3">
      <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Custom Lists</div>
      <button class="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50">
        <i class="fas fa-plus"></i> Add Smart List
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
        <input id="contact-search" type="text" placeholder="Search contacts..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button id="filter-toggle" class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
        <i class="fas fa-filter text-gray-500"></i> Filter
      </button>
      <button id="import-btn" class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
        <i class="fas fa-upload text-gray-500"></i> Import
      </button>
      <button id="export-btn" class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
        <i class="fas fa-download text-gray-500"></i> Export
      </button>
      <div id="bulk-actions" class="hidden flex items-center gap-2">
        <select id="bulk-select" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Bulk Actions</option>
          <option value="tag">Add Tag</option>
          <option value="email">Send Email</option>
          <option value="sms">Send SMS</option>
          <option value="delete">Delete</option>
        </select>
        <button id="bulk-apply" class="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">Apply</button>
      </div>
      <button id="add-contact-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 ml-auto">
        <i class="fas fa-plus"></i> Add Contact
      </button>
    </div>

    <!-- Filter Panel -->
    <div id="filter-panel" class="hidden bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap gap-3">
      <select id="filter-status" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
        <option value="">All Statuses</option>
        <option>Lead</option><option>Active</option><option>Customer</option><option>Unsubscribed</option>
      </select>
      <select id="filter-source" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
        <option value="">All Sources</option>
        <option>Facebook Ad</option><option>Google Ad</option><option>Referral</option><option>Website</option><option>Manual</option>
      </select>
      <select id="filter-tag" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
        <option value="">All Tags</option>
        <option>Hot Lead</option><option>VIP</option><option>Newsletter</option><option>Customer</option>
      </select>
      <button id="clear-filters" class="text-sm text-red-600 hover:underline">Clear Filters</button>
    </div>

    <!-- Table -->
    <div class="flex-1 overflow-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th class="w-10 px-4 py-3"><input type="checkbox" id="select-all" class="rounded"></th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Activity</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody id="contacts-tbody" class="bg-white divide-y divide-gray-100"></tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-between">
      <span id="pagination-info" class="text-sm text-gray-500"></span>
      <div class="flex gap-2">
        <button id="prev-page" class="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">Previous</button>
        <span id="page-indicator" class="px-3 py-1.5 text-sm text-gray-700"></span>
        <button id="next-page" class="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</div>

<!-- Add/Edit Contact Modal -->
<div id="contact-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <h2 id="contact-modal-title" class="text-lg font-semibold">Add Contact</h2>
      <button id="close-contact-modal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5 grid grid-cols-2 gap-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input id="cf-firstName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input id="cf-lastName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Email *</label><input id="cf-email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Phone</label><input id="cf-phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Address</label><input id="cf-address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">City</label><input id="cf-city" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">State</label><input id="cf-state" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Source</label>
        <select id="cf-source" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Facebook Ad</option><option>Google Ad</option><option>Referral</option><option>Website</option><option>Manual</option><option>Instagram</option>
        </select>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select id="cf-status" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Lead</option><option>Active</option><option>Customer</option><option>Unsubscribed</option>
        </select>
      </div>
      <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div class="flex flex-wrap gap-2" id="tag-picker">
          ${['Hot Lead','VIP','Newsletter','Facebook Ad','Cold Lead','Customer','Follow Up','Referral'].map(t=>`
          <label class="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full text-xs cursor-pointer hover:bg-gray-50">
            <input type="checkbox" value="${t}" class="tag-checkbox rounded"> ${t}
          </label>`).join('')}
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-3 p-5 border-t border-gray-200">
      <button id="cancel-contact-modal" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
      <button id="save-contact-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Contact</button>
    </div>
  </div>
</div>

<!-- Contact Detail Drawer -->
<div id="contact-drawer" class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-40 overflow-y-auto">
  <div id="contact-drawer-content"></div>
</div>
<div id="drawer-overlay" class="fixed inset-0 bg-black bg-opacity-30 hidden z-30" id="drawer-bg"></div>

<!-- Import Modal -->
<div id="import-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Import Contacts</h2>
      <button id="close-import-modal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
    </div>
    <div id="import-step-1">
      <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-blue-400 cursor-pointer" id="csv-drop-zone">
        <i class="fas fa-cloud-upload-alt text-4xl text-gray-300 mb-2"></i>
        <p class="text-gray-600 font-medium">Drop CSV file here or</p>
        <label class="mt-2 inline-block cursor-pointer text-blue-600 hover:underline font-medium text-sm">
          Browse files <input type="file" id="csv-file-input" accept=".csv" class="hidden">
        </label>
        <p class="text-xs text-gray-400 mt-2">Supported format: .CSV</p>
      </div>
      <a href="#" id="download-template" class="text-sm text-blue-600 hover:underline flex items-center gap-1">
        <i class="fas fa-download text-xs"></i> Download CSV template
      </a>
    </div>
    <div id="import-step-2" class="hidden">
      <div id="csv-preview"></div>
      <div class="flex justify-end gap-3 mt-4">
        <button id="back-import" class="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
        <button id="confirm-import" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Import Contacts</button>
      </div>
    </div>
  </div>
</div>`;
  },

  renderTable() {
    const start = (this.page - 1) * this.perPage;
    const end = Math.min(start + this.perPage, this.filtered.length);
    const page = this.filtered.slice(start, end);
    const tbody = document.getElementById('contacts-tbody');
    if (!tbody) return;
    const statusColors = { Lead:'yellow', Active:'blue', Customer:'green', Unsubscribed:'red' };
    const tagColors = { 'Hot Lead':'red','VIP':'purple','Newsletter':'blue','Facebook Ad':'indigo','Cold Lead':'gray','Customer':'green','Follow Up':'orange','Referral':'teal' };
    tbody.innerHTML = page.map(c => `
    <tr class="hover:bg-gray-50 cursor-pointer contact-row" data-id="${c.id}">
      <td class="px-4 py-3"><input type="checkbox" class="contact-checkbox rounded" data-id="${c.id}" onclick="event.stopPropagation()"></td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-${c.avatarColor}-100 text-${c.avatarColor}-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">${c.avatar}</div>
          <div>
            <div class="font-medium text-gray-900">${c.firstName} ${c.lastName}</div>
            <div class="text-xs text-gray-400">${c.email}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3 text-gray-600">${c.phone}</td>
      <td class="px-4 py-3">
        <div class="flex flex-wrap gap-1">
          ${c.tags.map(t=>`<span class="px-2 py-0.5 bg-${tagColors[t]||'gray'}-100 text-${tagColors[t]||'gray'}-700 rounded-full text-xs">${t}</span>`).join('')}
        </div>
      </td>
      <td class="px-4 py-3 text-gray-600 text-xs">${c.source}</td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 bg-${statusColors[c.status]||'gray'}-100 text-${statusColors[c.status]||'gray'}-700 rounded-full text-xs font-medium">${c.status}</span>
      </td>
      <td class="px-4 py-3 text-gray-600 text-xs">${c.stage}</td>
      <td class="px-4 py-3 text-gray-400 text-xs">${c.lastActivity}</td>
      <td class="px-4 py-3">
        <div class="flex gap-2">
          <button class="text-gray-400 hover:text-blue-600 contact-edit-btn" data-id="${c.id}" title="Edit" onclick="event.stopPropagation()"><i class="fas fa-edit"></i></button>
          <button class="text-gray-400 hover:text-red-600 contact-delete-btn" data-id="${c.id}" title="Delete" onclick="event.stopPropagation()"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('') || '<tr><td colspan="9" class="px-4 py-10 text-center text-gray-400">No contacts found</td></tr>';

    document.getElementById('pagination-info').textContent = `Showing ${start+1}–${end} of ${this.filtered.length} contacts`;
    document.getElementById('page-indicator').textContent = `Page ${this.page}`;
    document.getElementById('prev-page').disabled = this.page === 1;
    document.getElementById('next-page').disabled = end >= this.filtered.length;
  },

  openDrawer(id) {
    const c = this.contacts.find(x => x.id === id);
    if (!c) return;
    this.activeContact = c;
    const drawerContent = document.getElementById('contact-drawer-content');
    const statusColors = { Lead:'yellow', Active:'blue', Customer:'green', Unsubscribed:'red' };
    drawerContent.innerHTML = `
    <div class="p-5 border-b border-gray-200 flex items-center justify-between">
      <h3 class="font-semibold text-gray-900">Contact Details</h3>
      <button id="close-drawer" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5">
      <div class="flex items-center gap-4 mb-5">
        <div class="w-14 h-14 rounded-full bg-${c.avatarColor}-100 text-${c.avatarColor}-700 flex items-center justify-center text-xl font-bold">${c.avatar}</div>
        <div>
          <h4 class="text-lg font-bold text-gray-900">${c.firstName} ${c.lastName}</h4>
          <span class="px-2 py-0.5 bg-${statusColors[c.status]||'gray'}-100 text-${statusColors[c.status]||'gray'}-700 rounded-full text-xs font-medium">${c.status}</span>
        </div>
      </div>
      <div class="space-y-3 mb-5">
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-envelope text-gray-400 w-4"></i><a href="mailto:${c.email}" class="text-blue-600 hover:underline">${c.email}</a></div>
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-phone text-gray-400 w-4"></i><span class="text-gray-700">${c.phone}</span></div>
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-map-marker-alt text-gray-400 w-4"></i><span class="text-gray-700">${c.address}, ${c.city}, ${c.state}</span></div>
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-tag text-gray-400 w-4"></i><div class="flex gap-1 flex-wrap">${c.tags.map(t=>`<span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">${t}</span>`).join('')}</div></div>
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-funnel-dollar text-gray-400 w-4"></i><span class="text-gray-700">${c.stage}</span></div>
        <div class="flex items-center gap-3 text-sm"><i class="fas fa-dollar-sign text-gray-400 w-4"></i><span class="text-gray-700 font-medium">$${c.value.toLocaleString()}</span></div>
      </div>
      <div class="flex gap-2 mb-5">
        <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"><i class="fas fa-sms"></i>SMS</button>
        <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"><i class="fas fa-envelope"></i>Email</button>
        <button class="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"><i class="fas fa-phone"></i>Call</button>
      </div>
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-4">
        <div class="flex gap-4">
          ${['Timeline','Notes','Tasks','Appointments'].map((t,i)=>`
          <button data-drawer-tab="${t.toLowerCase()}" class="drawer-tab-btn pb-2 text-sm font-medium ${i===0?'text-blue-600 border-b-2 border-blue-600':'text-gray-500 hover:text-gray-700'}">${t}</button>`).join('')}
        </div>
      </div>
      <div id="drawer-tab-content">
        <div class="space-y-3">
          ${['Contact created','Email sent: Welcome sequence','SMS: Follow up message','Stage updated to Contacted','Note added by Admin'].map((a,i)=>`
          <div class="flex gap-3 text-sm"><div class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div><div><p class="text-gray-700">${a}</p><span class="text-xs text-gray-400">${i+1} day${i?'s':''} ago</span></div></div>`).join('')}
        </div>
      </div>
    </div>`;
    document.getElementById('contact-drawer').classList.remove('translate-x-full');
    document.getElementById('drawer-overlay').classList.remove('hidden');
    document.getElementById('close-drawer').addEventListener('click', () => this.closeDrawer());
    document.getElementById('drawer-overlay').addEventListener('click', () => this.closeDrawer());
    document.querySelectorAll('.drawer-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.drawer-tab-btn').forEach(b => { b.className = 'drawer-tab-btn pb-2 text-sm font-medium text-gray-500 hover:text-gray-700'; });
        btn.className = 'drawer-tab-btn pb-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600';
      });
    });
  },

  closeDrawer() {
    document.getElementById('contact-drawer').classList.add('translate-x-full');
    document.getElementById('drawer-overlay').classList.add('hidden');
  },

  bindEvents() {
    document.getElementById('contact-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      this.filtered = this.contacts.filter(c =>
        `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q)
      );
      this.page = 1;
      this.renderTable();
    });

    document.getElementById('filter-toggle')?.addEventListener('click', () => {
      document.getElementById('filter-panel').classList.toggle('hidden');
    });

    ['filter-status','filter-source','filter-tag'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.applyFilters());
    });

    document.getElementById('clear-filters')?.addEventListener('click', () => {
      ['filter-status','filter-source','filter-tag'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
      this.filtered = [...this.contacts];
      this.page = 1;
      this.renderTable();
    });

    document.getElementById('prev-page')?.addEventListener('click', () => { if(this.page>1){this.page--;this.renderTable();} });
    document.getElementById('next-page')?.addEventListener('click', () => { if(this.page*this.perPage<this.filtered.length){this.page++;this.renderTable();} });

    document.getElementById('select-all')?.addEventListener('change', e => {
      document.querySelectorAll('.contact-checkbox').forEach(cb => { cb.checked = e.target.checked; });
      const bulk = document.getElementById('bulk-actions');
      if (bulk) bulk.classList.toggle('hidden', !e.target.checked);
    });

    document.getElementById('contacts-tbody')?.addEventListener('click', e => {
      const row = e.target.closest('.contact-row');
      const editBtn = e.target.closest('.contact-edit-btn');
      const deleteBtn = e.target.closest('.contact-delete-btn');
      if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id);
        if (confirm('Delete this contact?')) {
          this.contacts = this.contacts.filter(c => c.id !== id);
          this.filtered = this.filtered.filter(c => c.id !== id);
          this.renderTable();
        }
      } else if (editBtn) {
        this.openModal(parseInt(editBtn.dataset.id));
      } else if (row) {
        this.openDrawer(parseInt(row.dataset.id));
      }
    });

    document.getElementById('add-contact-btn')?.addEventListener('click', () => this.openModal(null));
    document.getElementById('close-contact-modal')?.addEventListener('click', () => document.getElementById('contact-modal').classList.add('hidden'));
    document.getElementById('cancel-contact-modal')?.addEventListener('click', () => document.getElementById('contact-modal').classList.add('hidden'));

    document.getElementById('save-contact-btn')?.addEventListener('click', () => {
      const fn = document.getElementById('cf-firstName').value.trim();
      const ln = document.getElementById('cf-lastName').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      if (!fn || !ln || !email) { alert('Please fill required fields'); return; }
      const tags = [...document.querySelectorAll('.tag-checkbox:checked')].map(cb => cb.value);
      const contact = {
        id: this.activeContact ? this.activeContact.id : Date.now(),
        firstName: fn, lastName: ln, email,
        phone: document.getElementById('cf-phone').value,
        address: document.getElementById('cf-address').value,
        city: document.getElementById('cf-city').value,
        state: document.getElementById('cf-state').value,
        source: document.getElementById('cf-source').value,
        status: document.getElementById('cf-status').value,
        tags, stage:'New Lead', value:0, lastActivity:'Today',
        dateAdded: new Date().toLocaleDateString(), notes:[],
        avatar: fn[0]+(ln[0]||''), avatarColor:'blue'
      };
      if (this.activeContact) {
        const idx = this.contacts.findIndex(c => c.id === this.activeContact.id);
        this.contacts[idx] = contact;
        const fidx = this.filtered.findIndex(c => c.id === this.activeContact.id);
        if(fidx>=0) this.filtered[fidx] = contact;
      } else {
        this.contacts.unshift(contact);
        this.filtered.unshift(contact);
      }
      document.getElementById('contact-modal').classList.add('hidden');
      this.renderTable();
    });

    document.getElementById('import-btn')?.addEventListener('click', () => document.getElementById('import-modal').classList.remove('hidden'));
    document.getElementById('close-import-modal')?.addEventListener('click', () => document.getElementById('import-modal').classList.add('hidden'));

    document.getElementById('csv-file-input')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const lines = ev.target.result.split('\n').filter(Boolean);
        const headers = lines[0].split(',');
        const preview = lines.slice(1,4);
        document.getElementById('import-step-1').classList.add('hidden');
        document.getElementById('import-step-2').classList.remove('hidden');
        document.getElementById('csv-preview').innerHTML = `
        <p class="text-sm text-gray-600 mb-3">Found <b>${lines.length-1} contacts</b>. Preview:</p>
        <div class="overflow-x-auto rounded border border-gray-200 mb-3">
          <table class="text-xs w-full"><thead class="bg-gray-50"><tr>${headers.map(h=>`<th class="px-2 py-1 text-left">${h}</th>`).join('')}</tr></thead>
          <tbody>${preview.map(row=>`<tr class="border-t border-gray-100">${row.split(',').map(v=>`<td class="px-2 py-1">${v}</td>`).join('')}</tr>`).join('')}</tbody></table>
        </div>`;
      };
      reader.readAsText(file);
    });

    document.getElementById('download-template')?.addEventListener('click', e => {
      e.preventDefault();
      const csv = 'firstName,lastName,email,phone,address,city,state,source,status\nJohn,Doe,john@example.com,555-0100,123 Main St,New York,NY,Website,Lead';
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='contacts_template.csv'; a.click();
    });

    document.getElementById('export-btn')?.addEventListener('click', () => {
      const headers = 'firstName,lastName,email,phone,city,state,source,status,stage\n';
      const rows = this.contacts.map(c => `${c.firstName},${c.lastName},${c.email},${c.phone},${c.city},${c.state},${c.source},${c.status},${c.stage}`).join('\n');
      const blob = new Blob([headers+rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='contacts.csv'; a.click();
    });
  },

  openModal(id) {
    this.activeContact = id ? this.contacts.find(c => c.id === id) : null;
    document.getElementById('contact-modal-title').textContent = id ? 'Edit Contact' : 'Add Contact';
    if (this.activeContact) {
      const c = this.activeContact;
      ['firstName','lastName','email','phone','address','city','state','source','status'].forEach(f => {
        const el = document.getElementById('cf-'+f);
        if (el) el.value = c[f] || '';
      });
      document.querySelectorAll('.tag-checkbox').forEach(cb => { cb.checked = c.tags.includes(cb.value); });
    } else {
      ['firstName','lastName','email','phone','address','city','state'].forEach(f => {
        const el = document.getElementById('cf-'+f); if (el) el.value = '';
      });
      document.querySelectorAll('.tag-checkbox').forEach(cb => { cb.checked = false; });
    }
    document.getElementById('contact-modal').classList.remove('hidden');
  },

  applyFilters() {
    const status = document.getElementById('filter-status')?.value;
    const source = document.getElementById('filter-source')?.value;
    const tag = document.getElementById('filter-tag')?.value;
    this.filtered = this.contacts.filter(c =>
      (!status || c.status === status) &&
      (!source || c.source === source) &&
      (!tag || c.tags.includes(tag))
    );
    this.page = 1;
    this.renderTable();
  }
};
