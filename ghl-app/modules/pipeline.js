const PipelineModule = {
  opportunities: [],
  pipelines: ['Sales Pipeline','Onboarding','Support'],
  activePipeline: 'Sales Pipeline',
  view: 'kanban',
  stages: ['New Lead','Contacted','Proposal Sent','Negotiation','Won','Lost'],
  stageColors: {'New Lead':'blue','Contacted':'indigo','Proposal Sent':'purple','Negotiation':'orange','Won':'green','Lost':'red'},
  dragId: null,

  init(container) {
    this.opportunities = this.getMockOpportunities();
    container.innerHTML = this.render();
    this.renderBoard();
    this.bindEvents();
  },

  getMockOpportunities() {
    const stages = ['New Lead','Contacted','Proposal Sent','Negotiation','Won','Lost'];
    const contacts = ['James Wilson','Emma Rodriguez','Michael Chen','Sarah Johnson','David Martinez','Lisa Thompson','Robert Brown','Jennifer Davis','William Garcia','Patricia Miller','Charles Wilson','Barbara Anderson','Thomas Taylor','Linda Moore','Mark Jackson','Nancy White','Steven Harris','Betty Thompson','Andrew Lewis','Dorothy Lee'];
    const sources = ['Facebook Ad','Google Ad','Referral','Website','Cold Outreach'];
    return contacts.map((name,i) => ({
      id: i+1,
      name: `Deal - ${name}`,
      contact: name,
      value: Math.round((Math.random()*45000+500)/100)*100,
      probability: [10,25,50,75,100,0][i%6],
      stage: stages[i%6],
      source: sources[i%5],
      assignedTo: ['Alice M.','Bob K.','Carol T.','David R.'][i%4],
      closeDate: new Date(Date.now()+(Math.random()*90-30)*86400000).toLocaleDateString(),
      daysInStage: Math.floor(Math.random()*20+1),
      priority: ['high','medium','low'][i%3],
      notes: `Follow up needed for ${name}.`,
      created: new Date(Date.now()-Math.random()*60*86400000).toLocaleDateString()
    }));
  },

  render() {
    return `
<div class="flex flex-col h-full">
  <!-- Top Bar -->
  <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-wrap">
    <select id="pipeline-selector" class="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
      ${this.pipelines.map(p=>`<option ${p===this.activePipeline?'selected':''}>${p}</option>`).join('')}
    </select>
    <div class="flex border border-gray-300 rounded-lg overflow-hidden">
      <button data-view="kanban" class="view-btn px-3 py-2 text-sm ${this.view==='kanban'?'bg-blue-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}">
        <i class="fas fa-columns mr-1"></i>Kanban
      </button>
      <button data-view="list" class="view-btn px-3 py-2 text-sm border-l border-gray-300 ${this.view==='list'?'bg-blue-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}">
        <i class="fas fa-list mr-1"></i>List
      </button>
    </div>
    <div class="relative">
      <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
      <input id="opp-search" type="text" placeholder="Search opportunities..." class="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52">
    </div>
    <select id="opp-filter-assignee" class="border border-gray-300 rounded-lg px-3 py-2 text-sm">
      <option value="">All Assignees</option>
      <option>Alice M.</option><option>Bob K.</option><option>Carol T.</option><option>David R.</option>
    </select>
    <div class="ml-auto flex items-center gap-3">
      <div class="text-sm text-gray-500">
        <span id="total-value" class="font-semibold text-gray-800"></span> pipeline
      </div>
      <button id="add-opp-btn" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
        <i class="fas fa-plus"></i> Add Opportunity
      </button>
    </div>
  </div>

  <!-- Board / List -->
  <div class="flex-1 overflow-hidden" id="pipeline-view-container"></div>
</div>

<!-- Opportunity Modal -->
<div id="opp-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-xl w-full max-w-lg">
    <div class="flex items-center justify-between p-5 border-b border-gray-200">
      <h2 id="opp-modal-title" class="text-lg font-semibold">Add Opportunity</h2>
      <button id="close-opp-modal" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5 space-y-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Opportunity Name *</label><input id="of-name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Deal - John Smith"></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Contact</label><input id="of-contact" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search contact..."></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Value ($)</label><input id="of-value" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
          <select id="of-stage" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            ${this.stages.map(s=>`<option>${s}</option>`).join('')}
          </select>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label><input id="of-probability" type="number" min="0" max="100" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="50"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Expected Close</label><input id="of-closeDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select id="of-source" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Facebook Ad</option><option>Google Ad</option><option>Referral</option><option>Website</option><option>Cold Outreach</option>
          </select>
        </div>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
        <select id="of-assignee" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Alice M.</option><option>Bob K.</option><option>Carol T.</option><option>David R.</option>
        </select>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea id="of-notes" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Additional notes..."></textarea></div>
    </div>
    <div class="flex justify-end gap-3 p-5 border-t border-gray-200">
      <button id="cancel-opp-modal" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
      <button id="save-opp-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Opportunity</button>
    </div>
  </div>
</div>

<!-- Opportunity Drawer -->
<div id="opp-drawer" class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-40 overflow-y-auto">
  <div id="opp-drawer-content"></div>
</div>
<div id="opp-drawer-overlay" class="fixed inset-0 bg-black bg-opacity-30 hidden z-30"></div>`;
  },

  renderBoard() {
    const container = document.getElementById('pipeline-view-container');
    if (!container) return;
    const opps = this.opportunities;
    const total = opps.reduce((s,o) => s + (o.stage !== 'Lost' ? o.value : 0), 0);
    const el = document.getElementById('total-value');
    if (el) el.textContent = '$' + total.toLocaleString();

    if (this.view === 'kanban') {
      container.className = 'flex-1 overflow-x-auto overflow-y-hidden';
      container.innerHTML = `<div class="flex gap-4 p-5 h-full" style="min-width:max-content">
        ${this.stages.map(stage => {
          const cards = opps.filter(o => o.stage === stage);
          const stageTotal = cards.reduce((s,o)=>s+o.value,0);
          const color = this.stageColors[stage] || 'gray';
          return `
          <div class="flex flex-col w-64 bg-gray-50 rounded-xl border border-gray-200 flex-shrink-0" style="max-height:calc(100vh - 140px)">
            <div class="p-3 border-b border-gray-200 flex-shrink-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-gray-800 text-sm">${stage}</span>
                <span class="bg-${color}-100 text-${color}-700 text-xs font-medium px-2 py-0.5 rounded-full">${cards.length}</span>
              </div>
              <div class="text-xs text-gray-500">$${stageTotal.toLocaleString()}</div>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-2 kanban-col" data-stage="${stage}">
              ${cards.map(o => this.renderCard(o)).join('')}
            </div>
            <div class="p-2 flex-shrink-0">
              <button class="add-opp-stage-btn w-full py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1" data-stage="${stage}">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>`;
        }).join('')}
      </div>`;
      this.initDragDrop();
    } else {
      container.className = 'flex-1 overflow-auto';
      const priorityColors = { high:'red', medium:'yellow', low:'green' };
      container.innerHTML = `
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            ${['Contact','Value','Stage','Probability','Close Date','Source','Assigned','Days'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          ${opps.map(o=>{
            const color = this.stageColors[o.stage]||'gray';
            const pc = priorityColors[o.priority]||'gray';
            return `<tr class="hover:bg-gray-50 cursor-pointer opp-list-row" data-id="${o.id}">
              <td class="px-4 py-3 font-medium text-gray-900">${o.contact}<div class="text-xs text-gray-400">${o.name}</div></td>
              <td class="px-4 py-3 font-semibold text-green-700">$${o.value.toLocaleString()}</td>
              <td class="px-4 py-3"><span class="px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium">${o.stage}</span></td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-1.5"><div class="bg-blue-500 h-1.5 rounded-full" style="width:${o.probability}%"></div></div>
                  <span class="text-xs text-gray-500">${o.probability}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 text-xs">${o.closeDate}</td>
              <td class="px-4 py-3 text-gray-600 text-xs">${o.source}</td>
              <td class="px-4 py-3 text-gray-600 text-xs">${o.assignedTo}</td>
              <td class="px-4 py-3"><span class="px-2 py-0.5 bg-${pc}-100 text-${pc}-700 rounded text-xs">${o.daysInStage}d</span></td>
              <td class="px-4 py-3">
                <button class="opp-edit-btn text-gray-400 hover:text-blue-600" data-id="${o.id}" onclick="event.stopPropagation()"><i class="fas fa-edit"></i></button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;
    }

    this.bindBoardEvents();
  },

  renderCard(o) {
    const priorityColors = { high:'red', medium:'yellow', low:'green' };
    const pc = priorityColors[o.priority] || 'gray';
    return `
    <div class="opp-card bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
         draggable="true" data-id="${o.id}">
      <div class="flex items-start justify-between mb-2">
        <p class="text-sm font-medium text-gray-800 leading-tight">${o.contact}</p>
        <span class="text-xs bg-${pc}-100 text-${pc}-700 px-1.5 py-0.5 rounded font-medium flex-shrink-0 ml-1">${o.priority}</span>
      </div>
      <p class="text-xs text-gray-500 mb-2">${o.name}</p>
      <div class="text-lg font-bold text-green-700 mb-2">$${o.value.toLocaleString()}</div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="flex-1 bg-gray-200 rounded-full h-1 w-16"><div class="bg-blue-500 h-1 rounded-full" style="width:${o.probability}%"></div></div>
          <span class="text-xs text-gray-400">${o.probability}%</span>
        </div>
        <span class="text-xs text-gray-400">${o.daysInStage}d</span>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="text-xs text-gray-400">${o.assignedTo}</span>
        <span class="text-xs text-gray-400">${o.closeDate}</span>
      </div>
    </div>`;
  },

  initDragDrop() {
    document.querySelectorAll('.opp-card').forEach(card => {
      card.addEventListener('dragstart', e => { this.dragId = parseInt(card.dataset.id); card.classList.add('opacity-50'); });
      card.addEventListener('dragend', e => { card.classList.remove('opacity-50'); });
    });
    document.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('bg-blue-50'); });
      col.addEventListener('dragleave', () => col.classList.remove('bg-blue-50'));
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('bg-blue-50');
        const stage = col.dataset.stage;
        const opp = this.opportunities.find(o => o.id === this.dragId);
        if (opp) { opp.stage = stage; this.renderBoard(); }
      });
    });
  },

  bindBoardEvents() {
    document.querySelectorAll('.opp-card, .opp-list-row').forEach(el => {
      el.addEventListener('click', e => {
        if (!e.target.closest('.opp-edit-btn')) this.openDrawer(parseInt(el.dataset.id));
      });
    });
    document.querySelectorAll('.add-opp-stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('of-stage').value = btn.dataset.stage;
        document.getElementById('opp-modal').classList.remove('hidden');
      });
    });
    document.querySelectorAll('.opp-edit-btn').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); this.openModal(parseInt(btn.dataset.id)); });
    });
  },

  openDrawer(id) {
    const o = this.opportunities.find(x => x.id === id);
    if (!o) return;
    const color = this.stageColors[o.stage] || 'gray';
    document.getElementById('opp-drawer-content').innerHTML = `
    <div class="p-5 border-b border-gray-200 flex items-center justify-between">
      <h3 class="font-semibold text-gray-900">Opportunity Details</h3>
      <button id="close-opp-drawer" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-lg"></i></button>
    </div>
    <div class="p-5 space-y-4">
      <h4 class="text-lg font-bold text-gray-900">${o.name}</h4>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><p class="text-gray-400 text-xs">Contact</p><p class="font-medium">${o.contact}</p></div>
        <div><p class="text-gray-400 text-xs">Value</p><p class="font-bold text-green-700 text-lg">$${o.value.toLocaleString()}</p></div>
        <div><p class="text-gray-400 text-xs">Stage</p><span class="px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium">${o.stage}</span></div>
        <div><p class="text-gray-400 text-xs">Probability</p><p class="font-medium">${o.probability}%</p></div>
        <div><p class="text-gray-400 text-xs">Close Date</p><p class="font-medium">${o.closeDate}</p></div>
        <div><p class="text-gray-400 text-xs">Source</p><p class="font-medium">${o.source}</p></div>
        <div><p class="text-gray-400 text-xs">Assigned To</p><p class="font-medium">${o.assignedTo}</p></div>
        <div><p class="text-gray-400 text-xs">Days in Stage</p><p class="font-medium">${o.daysInStage} days</p></div>
      </div>
      <div class="border-t border-gray-100 pt-4">
        <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Move to Stage</p>
        <div class="flex flex-wrap gap-2">
          ${this.stages.map(s=>`<button class="move-stage-btn px-3 py-1.5 text-xs rounded-full border ${s===o.stage?'bg-blue-600 text-white border-blue-600':'border-gray-300 text-gray-600 hover:bg-gray-50'}" data-id="${o.id}" data-stage="${s}">${s}</button>`).join('')}
        </div>
      </div>
      <div class="border-t border-gray-100 pt-4">
        <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</p>
        <p class="text-sm text-gray-700">${o.notes}</p>
        <textarea placeholder="Add a note..." rows="2" class="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        <button class="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">Add Note</button>
      </div>
    </div>`;
    document.getElementById('opp-drawer').classList.remove('translate-x-full');
    document.getElementById('opp-drawer-overlay').classList.remove('hidden');
    document.getElementById('close-opp-drawer')?.addEventListener('click', () => {
      document.getElementById('opp-drawer').classList.add('translate-x-full');
      document.getElementById('opp-drawer-overlay').classList.add('hidden');
    });
    document.getElementById('opp-drawer-overlay')?.addEventListener('click', () => {
      document.getElementById('opp-drawer').classList.add('translate-x-full');
      document.getElementById('opp-drawer-overlay').classList.add('hidden');
    });
    document.querySelectorAll('.move-stage-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const opp = this.opportunities.find(x => x.id === parseInt(btn.dataset.id));
        if (opp) { opp.stage = btn.dataset.stage; this.renderBoard(); this.openDrawer(opp.id); }
      });
    });
  },

  openModal(id) {
    const o = id ? this.opportunities.find(x => x.id === id) : null;
    document.getElementById('opp-modal-title').textContent = o ? 'Edit Opportunity' : 'Add Opportunity';
    if (o) {
      document.getElementById('of-name').value = o.name;
      document.getElementById('of-contact').value = o.contact;
      document.getElementById('of-value').value = o.value;
      document.getElementById('of-stage').value = o.stage;
      document.getElementById('of-probability').value = o.probability;
      document.getElementById('of-source').value = o.source;
      document.getElementById('of-assignee').value = o.assignedTo;
      document.getElementById('of-notes').value = o.notes;
    } else {
      ['of-name','of-contact','of-value','of-probability','of-notes'].forEach(f => { const el=document.getElementById(f); if(el) el.value=''; });
    }
    document.getElementById('opp-modal').classList.remove('hidden');
    this._editingId = id || null;
  },

  bindEvents() {
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.view = btn.dataset.view;
        document.querySelectorAll('.view-btn').forEach(b => {
          b.className = `view-btn px-3 py-2 text-sm ${b.dataset.view!==this.view?'bg-white text-gray-600 hover:bg-gray-50':'bg-blue-600 text-white'}` + (b.dataset.view==='list'?' border-l border-gray-300':'');
        });
        this.renderBoard();
      });
    });

    document.getElementById('pipeline-selector')?.addEventListener('change', e => {
      this.activePipeline = e.target.value;
    });

    document.getElementById('opp-search')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      // Visual filter only for simplicity
    });

    document.getElementById('add-opp-btn')?.addEventListener('click', () => this.openModal(null));
    document.getElementById('close-opp-modal')?.addEventListener('click', () => document.getElementById('opp-modal').classList.add('hidden'));
    document.getElementById('cancel-opp-modal')?.addEventListener('click', () => document.getElementById('opp-modal').classList.add('hidden'));

    document.getElementById('save-opp-btn')?.addEventListener('click', () => {
      const name = document.getElementById('of-name').value.trim();
      if (!name) { alert('Please enter opportunity name'); return; }
      const opp = {
        id: this._editingId || Date.now(),
        name, contact: document.getElementById('of-contact').value,
        value: parseFloat(document.getElementById('of-value').value)||0,
        stage: document.getElementById('of-stage').value,
        probability: parseInt(document.getElementById('of-probability').value)||50,
        source: document.getElementById('of-source').value,
        assignedTo: document.getElementById('of-assignee').value,
        notes: document.getElementById('of-notes').value,
        priority:'medium', daysInStage:0,
        closeDate: document.getElementById('of-closeDate')?.value || 'TBD',
        created: new Date().toLocaleDateString()
      };
      if (this._editingId) {
        const idx = this.opportunities.findIndex(o => o.id === this._editingId);
        if (idx >= 0) this.opportunities[idx] = opp;
      } else {
        this.opportunities.unshift(opp);
      }
      document.getElementById('opp-modal').classList.add('hidden');
      this.renderBoard();
    });
  }
};
