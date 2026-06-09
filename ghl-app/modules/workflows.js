/**
 * workflows.js — Visual Automation Workflow Builder Module
 * Exports: { init(container) }
 * Dependencies: Tailwind CSS CDN loaded by host page
 */

const WorkflowsModule = (() => {

  /* ─── Node Definitions ───────────────────────────────────────── */
  const TRIGGER_NODES = [
    { type: 'trigger', kind: 'contact_created',        label: 'Contact Created'        },
    { type: 'trigger', kind: 'form_submitted',          label: 'Form Submitted'          },
    { type: 'trigger', kind: 'tag_added',               label: 'Tag Added'               },
    { type: 'trigger', kind: 'appointment_booked',      label: 'Appointment Booked'      },
    { type: 'trigger', kind: 'pipeline_stage_changed',  label: 'Pipeline Stage Changed'  },
    { type: 'trigger', kind: 'sms_received',            label: 'SMS Received'            },
    { type: 'trigger', kind: 'email_opened',            label: 'Email Opened'            },
  ];

  const ACTION_NODES = [
    { type: 'action', kind: 'send_email',           label: 'Send Email'            },
    { type: 'action', kind: 'send_sms',             label: 'Send SMS'              },
    { type: 'action', kind: 'add_tag',              label: 'Add Tag'               },
    { type: 'action', kind: 'remove_tag',           label: 'Remove Tag'            },
    { type: 'action', kind: 'wait',                 label: 'Wait'                  },
    { type: 'action', kind: 'move_pipeline',        label: 'Move to Pipeline Stage'},
    { type: 'action', kind: 'assign_user',          label: 'Assign to User'        },
    { type: 'action', kind: 'create_task',          label: 'Create Task'           },
    { type: 'action', kind: 'add_campaign',         label: 'Add to Campaign'       },
    { type: 'action', kind: 'webhook',              label: 'Webhook'               },
  ];

  const CONDITION_NODES = [
    { type: 'condition', kind: 'if_else',      label: 'If / Else'         },
    { type: 'condition', kind: 'time_check',   label: 'Time Condition'    },
    { type: 'condition', kind: 'tag_exists',   label: 'Tag Exists Check'  },
  ];

  const ALL_NODES = [...TRIGGER_NODES, ...ACTION_NODES, ...CONDITION_NODES];

  /* ─── Mock Workflows ─────────────────────────────────────────── */
  function mkNode(id, kind, x, y, config = {}) {
    const def = ALL_NODES.find(n => n.kind === kind) || { type: 'action', kind, label: kind };
    return { id, type: def.type, kind, label: def.label, x, y, config };
  }

  function mkEdge(from, to) { return { from, to }; }

  const MOCK_WORKFLOWS = [
    {
      id: 1,
      name: 'New Lead Nurture',
      status: 'Active',
      triggerType: 'Contact Created',
      enrolled: 142,
      lastModified: '2026-06-01',
      nodes: [
        mkNode('n1','contact_created', 200, 80,  {}),
        mkNode('n2','send_email',      200, 220, { subject: 'Welcome!', body: 'Hi {{name}}, thanks for joining.' }),
        mkNode('n3','wait',            200, 360, { delay: 1, unit: 'day' }),
        mkNode('n4','send_sms',        200, 500, { message: 'Hey {{name}}, just checking in!' }),
        mkNode('n5','wait',            200, 640, { delay: 2, unit: 'days' }),
        mkNode('n6','add_tag',         200, 780, { tag: 'Nurtured' }),
      ],
      edges: [mkEdge('n1','n2'),mkEdge('n2','n3'),mkEdge('n3','n4'),mkEdge('n4','n5'),mkEdge('n5','n6')],
    },
    {
      id: 2,
      name: 'Appointment Reminder',
      status: 'Active',
      triggerType: 'Appointment Booked',
      enrolled: 87,
      lastModified: '2026-05-28',
      nodes: [
        mkNode('n1','appointment_booked',200, 80,  {}),
        mkNode('n2','wait',              200, 220, { delay: 1, unit: 'hour' }),
        mkNode('n3','send_sms',          200, 360, { message: 'Reminder: you have an appointment tomorrow at {{time}}.' }),
      ],
      edges: [mkEdge('n1','n2'),mkEdge('n2','n3')],
    },
    {
      id: 3,
      name: 'Post-Sale Onboarding',
      status: 'Active',
      triggerType: 'Tag Added',
      enrolled: 63,
      lastModified: '2026-05-20',
      nodes: [
        mkNode('n1','tag_added',   200, 80,  { tag: 'Customer' }),
        mkNode('n2','send_email',  200, 220, { subject: 'Welcome aboard!', body: 'Thanks for becoming a customer.' }),
        mkNode('n3','create_task', 200, 360, { title: 'Onboard new customer', dueIn: '3 days' }),
      ],
      edges: [mkEdge('n1','n2'),mkEdge('n2','n3')],
    },
    {
      id: 4,
      name: 'Re-engagement',
      status: 'Paused',
      triggerType: 'Email Opened',
      enrolled: 31,
      lastModified: '2026-04-14',
      nodes: [
        mkNode('n1','email_opened',200, 80,  {}),
        mkNode('n2','send_email',  200, 220, { subject: 'We miss you!', body: 'It\'s been 30 days…' }),
        mkNode('n3','if_else',     200, 360, { field: 'email_opened', operator: 'is', value: 'true' }),
        mkNode('n4','add_tag',     80,  500, { tag: 'Re-engaged' }),
        mkNode('n5','add_tag',     340, 500, { tag: 'Cold Lead' }),
      ],
      edges: [mkEdge('n1','n2'),mkEdge('n2','n3'),mkEdge('n3','n4'),mkEdge('n3','n5')],
    },
    {
      id: 5,
      name: 'Lead Qualification',
      status: 'Draft',
      triggerType: 'Form Submitted',
      enrolled: 0,
      lastModified: '2026-06-05',
      nodes: [
        mkNode('n1','form_submitted', 200, 80,  {}),
        mkNode('n2','send_sms',       200, 220, { message: 'Thanks for your inquiry! We\'ll be in touch.' }),
        mkNode('n3','move_pipeline',  200, 360, { stage: 'Qualified Lead' }),
      ],
      edges: [mkEdge('n1','n2'),mkEdge('n2','n3')],
    },
  ];

  /* ─── State ──────────────────────────────────────────────────── */
  let workflows   = MOCK_WORKFLOWS.map(w => ({ ...w, nodes: w.nodes.map(n=>({...n})), edges: [...w.edges] }));
  let nextWfId    = 6;
  let nextNodeId  = 100;

  let state = {
    view:           'list',    // 'list' | 'builder'
    activeWfId:     null,
    filterStatus:   'All',
    nodeSearch:     '',
    selectedNodeId: null,
    canvas:         { offsetX: 0, offsetY: 0, scale: 1 },
    dragging:       null,      // { nodeId, startX, startY, origX, origY }
    panning:        null,      // { startX, startY, origOX, origOY }
  };

  let root = null;

  /* ─── Helpers ────────────────────────────────────────────────── */
  const activeWf = () => workflows.find(w => w.id === state.activeWfId);
  const typeColor = t => t==='trigger'?'#10B981':t==='condition'?'#F59E0B':'#3B82F6';
  const typeBg    = t => t==='trigger'?'bg-emerald-500':t==='condition'?'bg-amber-500':'bg-blue-500';

  const statusBadge = s => {
    const map = { Active:'bg-green-100 text-green-700', Draft:'bg-gray-100 text-gray-600', Paused:'bg-yellow-100 text-yellow-700' };
    return `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${map[s]||''}">${s}</span>`;
  };

  /* ─── Render ─────────────────────────────────────────────────── */
  function render() {
    root.innerHTML = state.view === 'list' ? listHTML() : builderHTML();
    if (state.view === 'list') bindList();
    else                       bindBuilder();
  }

  /* ═══════════════════════════════════════════════════════════════
     LIST VIEW
  ═══════════════════════════════════════════════════════════════ */
  function listHTML() {
    const statuses = ['All','Active','Draft','Paused'];
    const visible  = workflows.filter(w => state.filterStatus==='All' || w.status===state.filterStatus);
    return `
<div class="flex flex-col h-full bg-gray-50" id="wf-list-root">
  <!-- header -->
  <div class="flex flex-wrap items-center gap-3 px-6 py-4 bg-white border-b border-gray-200">
    <h2 class="text-lg font-semibold text-gray-800">Automations</h2>
    <div class="flex-1"></div>
    <div class="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
      ${statuses.map(s=>`<button data-filter="${s}" class="px-3 py-1.5 ${state.filterStatus===s?'bg-blue-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}">${s}</button>`).join('')}
    </div>
    <button id="wf-add" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      + New Workflow
    </button>
  </div>

  <!-- table -->
  <div class="flex-1 overflow-auto p-6">
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Trigger</th>
            <th class="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
            <th class="text-center px-4 py-3 font-semibold text-gray-600">Enrolled</th>
            <th class="text-left px-4 py-3 font-semibold text-gray-600">Modified</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          ${visible.length ? visible.map(w => `
          <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" data-wf-row="${w.id}">
            <td class="px-4 py-3 font-medium text-gray-800">${w.name}</td>
            <td class="px-4 py-3">${statusBadge(w.status)}</td>
            <td class="px-4 py-3 text-gray-600">${w.triggerType}</td>
            <td class="px-4 py-3 text-center text-gray-600">${w.nodes.filter(n=>n.type==='action').length}</td>
            <td class="px-4 py-3 text-center text-gray-600">${w.enrolled}</td>
            <td class="px-4 py-3 text-gray-500">${w.lastModified}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 justify-end">
                <button data-edit-wf="${w.id}"   class="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Edit">&#9998;</button>
                <button data-dup-wf="${w.id}"    class="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Duplicate">&#10697;</button>
                <button data-toggle-wf="${w.id}" class="p-1.5 ${w.status==='Active'?'text-yellow-500 hover:bg-yellow-50':'text-green-500 hover:bg-green-50'} rounded"
                  title="${w.status==='Active'?'Pause':'Activate'}">${w.status==='Active'?'⏸':'▶'}</button>
                <button data-del-wf="${w.id}"    class="p-1.5 text-red-400 hover:bg-red-50 rounded" title="Delete">&#128465;</button>
              </div>
            </td>
          </tr>`).join('')
          : `<tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">No workflows found.</td></tr>`}
        </tbody>
      </table>
    </div>
  </div>
</div>`;
  }

  function bindList() {
    const el = root.querySelector('#wf-list-root');
    if (!el) return;

    el.addEventListener('click', e => {
      const t = e.target;

      // filter buttons
      const fb = t.closest('[data-filter]');
      if (fb) { state.filterStatus = fb.dataset.filter; render(); return; }

      // add new
      if (t.id === 'wf-add') { createWorkflow(); return; }

      // row click → edit
      const row = t.closest('[data-wf-row]');
      if (row && !t.closest('[data-edit-wf],[data-dup-wf],[data-toggle-wf],[data-del-wf]')) {
        openBuilder(+row.dataset.wfRow); return;
      }

      // edit
      if (t.dataset.editWf) { openBuilder(+t.dataset.editWf); return; }

      // duplicate
      if (t.dataset.dupWf) { duplicateWf(+t.dataset.dupWf); return; }

      // toggle active
      if (t.dataset.toggleWf) {
        const wf = workflows.find(w => w.id === +t.dataset.toggleWf);
        if (wf) { wf.status = wf.status === 'Active' ? 'Paused' : 'Active'; render(); }
        return;
      }

      // delete
      if (t.dataset.delWf) {
        if (confirm('Delete this workflow?')) {
          workflows = workflows.filter(w => w.id !== +t.dataset.delWf);
          render();
        }
        return;
      }
    });
  }

  function createWorkflow() {
    const wf = {
      id: nextWfId++,
      name: 'New Workflow',
      status: 'Draft',
      triggerType: 'Contact Created',
      enrolled: 0,
      lastModified: new Date().toISOString().slice(0,10),
      nodes: [ mkNode('n1', 'contact_created', 200, 80, {}) ],
      edges: [],
    };
    workflows.unshift(wf);
    openBuilder(wf.id);
  }

  function duplicateWf(id) {
    const src = workflows.find(w => w.id === id);
    if (!src) return;
    const copy = {
      ...src,
      id: nextWfId++,
      name: src.name + ' (Copy)',
      status: 'Draft',
      enrolled: 0,
      nodes: src.nodes.map(n=>({...n})),
      edges: [...src.edges],
    };
    const idx = workflows.findIndex(w => w.id === id);
    workflows.splice(idx+1, 0, copy);
    render();
  }

  function openBuilder(id) {
    state.activeWfId     = id;
    state.view           = 'builder';
    state.selectedNodeId = null;
    state.canvas         = { offsetX: 0, offsetY: 0, scale: 1 };
    render();
  }

  /* ═══════════════════════════════════════════════════════════════
     BUILDER VIEW
  ═══════════════════════════════════════════════════════════════ */
  function builderHTML() {
    const wf = activeWf();
    if (!wf) return `<div class="p-8 text-gray-400">Workflow not found.</div>`;

    const filteredNodes = ALL_NODES.filter(n =>
      !state.nodeSearch || n.label.toLowerCase().includes(state.nodeSearch.toLowerCase())
    );

    return `
<div class="flex flex-col h-full bg-gray-100" id="wf-builder-root">
  <!-- top bar -->
  <div class="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0">
    <button id="wfb-back" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Back to list">
      &#8592;
    </button>
    <input id="wfb-name" type="text" value="${wf.name}"
      class="text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-52">
    <span class="text-xs">${statusBadge(wf.status)}</span>
    <div class="flex-1"></div>
    <button id="wfb-test" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Test Workflow</button>
    <button id="wfb-toggle" class="px-3 py-1.5 text-sm border rounded-lg
      ${wf.status==='Active'?'border-yellow-300 text-yellow-600 hover:bg-yellow-50':'border-green-300 text-green-600 hover:bg-green-50'}">
      ${wf.status==='Active'?'⏸ Pause':'▶ Publish'}
    </button>
    <button id="wfb-save" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- left panel: node palette -->
    <div class="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div class="p-3 border-b">
        <input id="node-search" type="text" placeholder="Search nodes…" value="${state.nodeSearch}"
          class="w-full text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-3">
        ${['trigger','action','condition'].map(type => {
          const list = filteredNodes.filter(n => n.type === type);
          if (!list.length) return '';
          const labels = { trigger:'Triggers', action:'Actions', condition:'Conditions' };
          return `
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 px-2 mb-1">${labels[type]}</p>
            ${list.map(n=>`
            <div draggable="true" data-palette-kind="${n.kind}" data-palette-type="${n.type}"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-grab text-sm select-none">
              <span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:${typeColor(n.type)}"></span>
              ${n.label}
            </div>`).join('')}
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- canvas -->
    <div class="flex-1 overflow-hidden relative bg-gray-100" id="wf-canvas-wrap">
      <svg id="wf-canvas" width="100%" height="100%"
        style="cursor:grab; background-size:20px 20px;
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);">
        <g id="wf-stage" transform="translate(${state.canvas.offsetX},${state.canvas.offsetY}) scale(${state.canvas.scale})">
          <!-- edges -->
          ${wf.edges.map(e => {
            const from = wf.nodes.find(n=>n.id===e.from);
            const to   = wf.nodes.find(n=>n.id===e.to);
            if (!from||!to) return '';
            const x1=from.x+100, y1=from.y+40, x2=to.x+100, y2=to.y;
            const cy=(y1+y2)/2;
            return `<path d="M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}"
              fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrowhead)"/>`;
          }).join('')}

          <!-- nodes -->
          ${wf.nodes.map(n => nodeEl(n, state.selectedNodeId===n.id)).join('')}

          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/>
            </marker>
          </defs>
        </g>
      </svg>

      <!-- zoom controls -->
      <div class="absolute bottom-4 right-4 flex flex-col gap-1">
        <button id="wf-zoom-in"  class="w-8 h-8 bg-white border rounded shadow flex items-center justify-center hover:bg-gray-50 text-lg font-bold">+</button>
        <button id="wf-zoom-out" class="w-8 h-8 bg-white border rounded shadow flex items-center justify-center hover:bg-gray-50 text-lg font-bold">−</button>
        <button id="wf-zoom-fit" class="w-8 h-8 bg-white border rounded shadow flex items-center justify-center hover:bg-gray-50 text-xs">⊞</button>
      </div>
    </div>

    <!-- right panel: node config -->
    <div class="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
      ${configPanel(wf)}
    </div>
  </div>
</div>`;
  }

  function nodeEl(n, selected) {
    const isCondition = n.type === 'condition';
    const w = 200, h = 70;
    const bg = typeColor(n.type);
    const shadow = selected ? 'filter:drop-shadow(0 0 6px rgba(59,130,246,0.7))' : 'filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
    const border = selected ? `stroke="#3b82f6" stroke-width="3"` : `stroke="${bg}" stroke-width="1.5"`;

    if (isCondition) {
      // diamond shape
      const cx=n.x+100, cy=n.y+40;
      return `
<g data-node-id="${n.id}" class="cursor-pointer" style="${shadow}" transform="translate(0,0)">
  <polygon points="${cx},${cy-40} ${cx+100},${cy} ${cx},${cy+40} ${cx-100},${cy}"
    fill="white" ${border} rx="4"/>
  <rect x="${cx-30}" y="${cy-10}" width="60" height="20" fill="${bg}" rx="3"/>
  <text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="10" fill="white" font-weight="bold">${n.label}</text>
  ${selected ? `<circle cx="${n.x+100}" cy="${n.y}" r="5" fill="#ef4444" class="cursor-pointer" data-del-node="${n.id}"/>` : ''}
</g>`;
    }

    return `
<g data-node-id="${n.id}" class="cursor-pointer" style="${shadow}">
  <rect x="${n.x}" y="${n.y}" width="${w}" height="${h}" rx="10" fill="white" ${border}/>
  <rect x="${n.x}" y="${n.y}" width="${w}" height="28" rx="10" fill="${bg}"/>
  <rect x="${n.x}" y="${n.y+18}" width="${w}" height="10" fill="${bg}"/>
  <text x="${n.x+16}" y="${n.y+18}" font-size="11" fill="white" font-weight="600">${n.label}</text>
  <text x="${n.x+16}" y="${n.y+50}" font-size="10" fill="#6b7280">${nodeSubtitle(n)}</text>
  ${selected ? `<text x="${n.x+190}" y="${n.y+10}" font-size="14" fill="white" text-anchor="middle" class="cursor-pointer" data-del-node="${n.id}">✕</text>` : ''}
</g>`;
  }

  function nodeSubtitle(n) {
    const c = n.config || {};
    if (n.kind==='send_email')    return c.subject ? c.subject.slice(0,22)+'…'   : 'Configure email';
    if (n.kind==='send_sms')      return c.message ? c.message.slice(0,22)+'…'   : 'Configure message';
    if (n.kind==='wait')          return c.delay   ? `${c.delay} ${c.unit}`       : 'Set delay';
    if (n.kind==='add_tag')       return c.tag     ? `Tag: ${c.tag}`              : 'Select tag';
    if (n.kind==='remove_tag')    return c.tag     ? `Remove: ${c.tag}`           : 'Select tag';
    if (n.kind==='move_pipeline') return c.stage   ? c.stage                      : 'Select stage';
    if (n.kind==='webhook')       return c.url     ? c.url.slice(0,22)+'…'        : 'Enter URL';
    if (n.kind==='create_task')   return c.title   ? c.title.slice(0,22)          : 'Task title';
    return '';
  }

  function configPanel(wf) {
    if (!state.selectedNodeId)
      return `<div class="p-4 text-sm text-gray-400 text-center mt-12">Click a node to configure it.</div>`;

    const node = wf.nodes.find(n => n.id === state.selectedNodeId);
    if (!node) return `<div class="p-4 text-sm text-gray-400">Node not found.</div>`;

    const c = node.config || {};

    let fields = '';

    if (node.kind === 'send_email') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">From Name</label>
        <input data-cfg="fromName" value="${c.fromName||''}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Subject</label>
        <input data-cfg="subject" value="${c.subject||''}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Body</label>
        <textarea data-cfg="body" rows="5" class="w-full border rounded-lg px-3 py-1.5 text-sm resize-none">${c.body||''}</textarea>
      </div>`;
    } else if (node.kind === 'send_sms') {
      const msg = c.message||'';
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Message</label>
        <textarea id="sms-msg" data-cfg="message" rows="4" maxlength="160"
          class="w-full border rounded-lg px-3 py-1.5 text-sm resize-none">${msg}</textarea>
        <div class="text-right text-xs text-gray-400 mt-0.5">${msg.length}/160</div>
      </div>`;
    } else if (node.kind === 'wait') {
      fields = `
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Delay</label>
          <input data-cfg="delay" type="number" min="1" value="${c.delay||1}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Unit</label>
          <select data-cfg="unit" class="w-full border rounded-lg px-3 py-1.5 text-sm">
            ${['minutes','hours','days','weeks'].map(u=>`<option${c.unit===u?' selected':''}>${u}</option>`).join('')}
          </select>
        </div>
      </div>`;
    } else if (node.kind === 'add_tag' || node.kind === 'remove_tag') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Tag</label>
        <input data-cfg="tag" value="${c.tag||''}" placeholder="e.g. Customer" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    } else if (node.kind === 'if_else' || node.kind === 'tag_exists') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Field</label>
        <input data-cfg="field" value="${c.field||''}" placeholder="e.g. email_opened" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Operator</label>
        <select data-cfg="operator" class="w-full border rounded-lg px-3 py-1.5 text-sm">
          ${['is','is not','contains','greater than','less than'].map(op=>`<option${c.operator===op?' selected':''}>${op}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Value</label>
        <input data-cfg="value" value="${c.value||''}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    } else if (node.kind === 'move_pipeline') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Pipeline Stage</label>
        <select data-cfg="stage" class="w-full border rounded-lg px-3 py-1.5 text-sm">
          ${['New Lead','Contacted','Qualified Lead','Proposal Sent','Closed Won','Closed Lost']
            .map(s=>`<option${c.stage===s?' selected':''}>${s}</option>`).join('')}
        </select>
      </div>`;
    } else if (node.kind === 'webhook') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">URL</label>
        <input data-cfg="url" value="${c.url||''}" placeholder="https://" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    } else if (node.kind === 'create_task') {
      fields = `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Task Title</label>
        <input data-cfg="title" value="${c.title||''}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Due In</label>
        <input data-cfg="dueIn" value="${c.dueIn||''}" placeholder="e.g. 3 days" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    }

    return `
<div class="p-4 space-y-3">
  <div class="flex items-center gap-2 mb-1">
    <span class="w-3 h-3 rounded-sm" style="background:${typeColor(node.type)}"></span>
    <span class="text-sm font-semibold text-gray-800">${node.label}</span>
  </div>
  <hr class="border-gray-200">
  ${fields || `<p class="text-sm text-gray-400">No configuration needed.</p>`}
  <div class="pt-2 flex gap-2">
    <button id="cfg-apply" class="flex-1 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
    <button id="cfg-del-node" class="py-1.5 px-3 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50">Delete</button>
  </div>
</div>`;
  }

  /* ── Builder Bindings ── */
  function bindBuilder() {
    const broot = root.querySelector('#wf-builder-root');
    if (!broot) return;
    const wf = activeWf();

    broot.addEventListener('click', e => {
      const t = e.target;

      if (t.id === 'wfb-back')  { state.view = 'list'; render(); return; }
      if (t.id === 'wfb-save')  { saveBuilder(wf, broot); return; }
      if (t.id === 'wfb-test')  { alert('Workflow test started (mock).'); return; }
      if (t.id === 'wfb-toggle') {
        wf.status = wf.status === 'Active' ? 'Paused' : 'Active'; render(); return;
      }

      if (t.id === 'wf-zoom-in')  { state.canvas.scale = Math.min(2, state.canvas.scale + 0.1); render(); return; }
      if (t.id === 'wf-zoom-out') { state.canvas.scale = Math.max(0.3, state.canvas.scale - 0.1); render(); return; }
      if (t.id === 'wf-zoom-fit') { state.canvas = { offsetX: 0, offsetY: 0, scale: 1 }; render(); return; }

      if (t.id === 'cfg-apply')    { applyCfg(wf, broot); return; }
      if (t.id === 'cfg-del-node') { deleteSelectedNode(wf); return; }

      // click on SVG node
      const ng = t.closest('[data-node-id]');
      if (ng) {
        state.selectedNodeId = ng.dataset.nodeId;
        render();
        return;
      }

      // click canvas background → deselect
      if (t.id === 'wf-canvas') {
        state.selectedNodeId = null; render(); return;
      }
    });

    // node search
    const ns = broot.querySelector('#node-search');
    if (ns) ns.addEventListener('input', e => { state.nodeSearch = e.target.value; render(); });

    // workflow name
    const wn = broot.querySelector('#wfb-name');
    if (wn) wn.addEventListener('change', e => { wf.name = e.target.value; });

    // SMS character counter
    const smsTa = broot.querySelector('[data-cfg="message"]');
    if (smsTa) smsTa.addEventListener('input', e => {
      const ctr = broot.querySelector('#sms-char');
      if (ctr) ctr.textContent = `${e.target.value.length}/160`;
    });

    // canvas pan (mousedown/mousemove/mouseup on SVG)
    const canvas = broot.querySelector('#wf-canvas');
    if (!canvas) return;

    canvas.addEventListener('mousedown', e => {
      if (e.target.closest('[data-node-id]')) {
        // start node drag
        const ng = e.target.closest('[data-node-id]');
        const node = wf.nodes.find(n => n.id === ng.dataset.nodeId);
        if (!node) return;
        state.dragging = { nodeId: node.id, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y };
        e.stopPropagation();
      } else {
        state.panning = { startX: e.clientX, startY: e.clientY, origOX: state.canvas.offsetX, origOY: state.canvas.offsetY };
        canvas.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);

    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      state.canvas.scale = Math.min(2, Math.max(0.3, state.canvas.scale + delta));
      render();
    }, { passive: false });

    // palette drag-drop onto canvas
    const palette = broot.querySelectorAll('[data-palette-kind]');
    palette.forEach(el => {
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('kind', el.dataset.paletteKind);
        e.dataTransfer.setData('type', el.dataset.paletteType);
      });
    });

    canvas.addEventListener('dragover', e => e.preventDefault());
    canvas.addEventListener('drop', e => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('kind');
      if (!kind) return;
      const rect  = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - state.canvas.offsetX) / state.canvas.scale - 100;
      const y = (e.clientY - rect.top  - state.canvas.offsetY) / state.canvas.scale;
      const nid = 'n' + (nextNodeId++);
      wf.nodes.push(mkNode(nid, kind, Math.max(0,x), Math.max(0,y), {}));
      render();
    });
  }

  function onMouseMove(e) {
    if (state.dragging) {
      const { nodeId, startX, startY, origX, origY } = state.dragging;
      const wf   = activeWf();
      if (!wf) return;
      const node = wf.nodes.find(n => n.id === nodeId);
      if (!node) return;
      const scale = state.canvas.scale;
      node.x = origX + (e.clientX - startX) / scale;
      node.y = origY + (e.clientY - startY) / scale;
      // update SVG without full re-render
      const g = root.querySelector(`[data-node-id="${nodeId}"]`);
      if (g) {
        const isCondition = node.type === 'condition';
        if (!isCondition) {
          const r = g.querySelector('rect');
          if (r) { r.setAttribute('x', node.x); r.setAttribute('y', node.y); }
        }
        g.setAttribute('transform', `translate(${node.x-(isCondition?node.x:0)},0)`);
      }
    }
    if (state.panning) {
      const { startX, startY, origOX, origOY } = state.panning;
      state.canvas.offsetX = origOX + (e.clientX - startX);
      state.canvas.offsetY = origOY + (e.clientY - startY);
      const stage = root.querySelector('#wf-stage');
      if (stage) stage.setAttribute('transform',`translate(${state.canvas.offsetX},${state.canvas.offsetY}) scale(${state.canvas.scale})`);
    }
  }

  function onMouseUp() {
    if (state.dragging) { state.dragging = null; render(); }
    if (state.panning) {
      state.panning = null;
      const canvas = root.querySelector('#wf-canvas');
      if (canvas) canvas.style.cursor = 'grab';
    }
  }

  function applyCfg(wf, broot) {
    const node = wf.nodes.find(n => n.id === state.selectedNodeId);
    if (!node) return;
    const inputs = broot.querySelectorAll('[data-cfg]');
    inputs.forEach(inp => {
      node.config[inp.dataset.cfg] = inp.value;
    });
    render();
  }

  function deleteSelectedNode(wf) {
    if (!state.selectedNodeId) return;
    wf.nodes  = wf.nodes.filter(n => n.id !== state.selectedNodeId);
    wf.edges  = wf.edges.filter(e => e.from !== state.selectedNodeId && e.to !== state.selectedNodeId);
    state.selectedNodeId = null;
    render();
  }

  function saveBuilder(wf, broot) {
    const nameEl = broot.querySelector('#wfb-name');
    if (nameEl) wf.name = nameEl.value;
    wf.lastModified = new Date().toISOString().slice(0,10);
    // update trigger type from first trigger node
    const trig = wf.nodes.find(n => n.type === 'trigger');
    if (trig) wf.triggerType = trig.label;
    wf.nodes.filter(n=>n.type==='action').length;
    alert(`Workflow "${wf.name}" saved!`);
    render();
  }

  /* ─── Public ─────────────────────────────────────────────────── */
  return {
    init(container) {
      root = container;
      render();
    }
  };
})();

export default WorkflowsModule;
