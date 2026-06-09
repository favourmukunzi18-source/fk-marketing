/**
 * funnels.js — Funnel & Sites Builder Module
 * Exports: { init(container) }
 * Dependencies: Tailwind CSS CDN loaded by host page
 */

const FunnelsModule = (() => {

  /* ─── Mock Funnels ───────────────────────────────────────────── */
  const MOCK_FUNNELS = [
    {
      id: 1, name: 'Lead Magnet Funnel',   status: 'Active',
      gradient: 'from-blue-500 to-indigo-600',
      steps: [
        { id:'s1', name:'Landing Page',    visits:1250, uniq:980, optins:288, sales:0  },
        { id:'s2', name:'Thank You',       visits:288,  uniq:288, optins:0,   sales:0  },
        { id:'s3', name:'Upsell',          visits:180,  uniq:180, optins:0,   sales:42 },
      ],
    },
    {
      id: 2, name: 'Webinar Registration', status: 'Active',
      gradient: 'from-purple-500 to-pink-600',
      steps: [
        { id:'s1', name:'Registration',    visits:850,  uniq:720, optins:263, sales:0   },
        { id:'s2', name:'Confirmation',    visits:263,  uniq:263, optins:0,   sales:0   },
      ],
    },
    {
      id: 3, name: 'Product Launch',       status: 'Active',
      gradient: 'from-orange-500 to-red-600',
      steps: [
        { id:'s1', name:'Waitlist',        visits:2100, uniq:1800, optins:378, sales:0   },
        { id:'s2', name:'Sales Page',      visits:378,  uniq:378,  optins:0,   sales:105 },
        { id:'s3', name:'Order Form',      visits:105,  uniq:105,  optins:0,   sales:105 },
        { id:'s4', name:'Upsell',          visits:90,   uniq:90,   optins:0,   sales:45  },
      ],
    },
    {
      id: 4, name: 'Free Consultation',    status: 'Active',
      gradient: 'from-teal-500 to-cyan-600',
      steps: [
        { id:'s1', name:'Booking Page',    visits:650, uniq:590, optins:182, sales:0  },
        { id:'s2', name:'Confirmed',       visits:182, uniq:182, optins:0,   sales:0  },
      ],
    },
    {
      id: 5, name: 'Membership Site',      status: 'Draft',
      gradient: 'from-green-500 to-emerald-600',
      steps: [
        { id:'s1', name:'Sales Page',      visits:420,  uniq:380, optins:63, sales:0  },
        { id:'s2', name:'Checkout',        visits:63,   uniq:63,  optins:0,  sales:63 },
        { id:'s3', name:'Welcome',         visits:60,   uniq:60,  optins:0,  sales:0  },
        { id:'s4', name:'Members Area',    visits:58,   uniq:58,  optins:0,  sales:0  },
        { id:'s5', name:'Upsell',          visits:40,   uniq:40,  optins:0,  sales:18 },
      ],
    },
  ];

  /* ─── Element / Section Defs ────────────────────────────────── */
  const SECTIONS = [
    { id: 'hero',         label: 'Hero',         icon: '⬛' },
    { id: 'features',     label: 'Features',     icon: '⊞'  },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'cta',          label: 'CTA',          icon: '⚡' },
    { id: 'video',        label: 'Video',        icon: '▶'  },
    { id: 'faq',          label: 'FAQ',          icon: '?'  },
    { id: 'pricing',      label: 'Pricing',      icon: '$'  },
    { id: 'form',         label: 'Form',         icon: '✉'  },
    { id: 'footer',       label: 'Footer',       icon: '_'  },
  ];

  const ELEMENTS = [
    { id: 'headline',   label: 'Headline',       icon: 'H'  },
    { id: 'paragraph',  label: 'Paragraph',      icon: 'P'  },
    { id: 'button',     label: 'Button',         icon: '⏎'  },
    { id: 'image',      label: 'Image',          icon: '🖼' },
    { id: 'video_el',   label: 'Video Embed',    icon: '▶'  },
    { id: 'form_el',    label: 'Form',           icon: '✉'  },
    { id: 'divider',    label: 'Divider',        icon: '─'  },
    { id: 'spacer',     label: 'Spacer',         icon: '⠀'  },
    { id: 'countdown',  label: 'Countdown',      icon: '⏱' },
    { id: 'progress',   label: 'Progress Bar',   icon: '▓'  },
    { id: 'icon_el',    label: 'Icon',           icon: '★'  },
    { id: 'bullets',    label: 'Bullet List',    icon: '•'  },
  ];

  const FIELD_TYPES = ['Text','Email','Phone','Select','Checkbox','Radio','Date','File upload'];

  /* ─── State ──────────────────────────────────────────────────── */
  let funnels   = MOCK_FUNNELS.map(f => ({
    ...f,
    steps: f.steps.map(s => ({
      ...s,
      elements: [
        { id: 'e1', type: 'headline', content: 'Welcome!',            props: { size:'2xl', color:'#111827', align:'center', bold:true } },
        { id: 'e2', type: 'paragraph',content: 'Your journey starts here.', props: { size:'base', color:'#6b7280', align:'center' } },
        { id: 'e3', type: 'button',   content: 'Get Started',         props: { color:'#2563eb', size:'lg', link:'#', radius:'8' } },
      ]
    }))
  }));
  let nextFid   = 6;
  let nextEid   = 100;

  let state = {
    tab:              'funnels',   // 'funnels' | 'forms' | 'websites'
    filterStatus:     'All',
    view:             'list',      // 'list' | 'builder' | 'stats'
    activeFunnelId:   null,
    activeStepId:     null,
    selectedElId:     null,
    builderDevice:    'desktop',   // 'desktop' | 'tablet' | 'mobile'
    showStatsModal:   false,
    statsDateRange:   '30d',
    elSearch:         '',
    formFields:       [
      { id:'ff1', type:'Text',  label:'Full Name',    placeholder:'Your name',  required:true  },
      { id:'ff2', type:'Email', label:'Email',         placeholder:'you@example.com', required:true },
      { id:'ff3', type:'Phone', label:'Phone Number',  placeholder:'+1 (555) 000-0000', required:false },
    ],
  };

  let nextFfId = 4;
  let root     = null;

  /* ─── Helpers ────────────────────────────────────────────────── */
  const activeFunnel = () => funnels.find(f => f.id === state.activeFunnelId);
  const activeStep   = () => {
    const f = activeFunnel();
    return f ? f.steps.find(s => s.id === state.activeStepId) || f.steps[0] : null;
  };

  const convRate = f => {
    const top = f.steps[0]?.visits || 0;
    const bot = (f.steps[f.steps.length-1]?.optins || 0) + (f.steps[f.steps.length-1]?.sales || 0);
    return top ? Math.round((bot/top)*100) : 0;
  };

  const totalVisits = f => f.steps[0]?.visits || 0;

  const statusBadge = s => {
    const map = { Active:'bg-green-100 text-green-700', Draft:'bg-gray-100 text-gray-600', Archived:'bg-red-100 text-red-600' };
    return `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${map[s]||''}">${s}</span>`;
  };

  /* ─── Render ─────────────────────────────────────────────────── */
  function render() {
    root.innerHTML = mainHTML();
    bind();
  }

  function mainHTML() {
    return `
<div class="flex flex-col h-full bg-gray-50" id="fn-root">
  <!-- tab bar -->
  <div class="flex items-center gap-0 px-4 pt-3 bg-white border-b border-gray-200">
    ${['funnels','forms','websites'].map(t => `
    <button data-tab="${t}" class="px-5 py-2.5 text-sm font-medium border-b-2 -mb-px ${state.tab===t
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700'}">
      ${t.charAt(0).toUpperCase()+t.slice(1)}
    </button>`).join('')}
  </div>

  ${ state.tab === 'funnels'  && state.view === 'list'    ? funnelListHTML()   : '' }
  ${ state.tab === 'funnels'  && state.view === 'builder' ? builderHTML()      : '' }
  ${ state.tab === 'funnels'  && state.view === 'stats'   ? statsHTML()        : '' }
  ${ state.tab === 'forms'    ? formsHTML()   : '' }
  ${ state.tab === 'websites' ? websitesHTML(): '' }
  ${ state.showStatsModal     ? statsModalHTML() : '' }
</div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     FUNNEL LIST
  ═══════════════════════════════════════════════════════════════ */
  function funnelListHTML() {
    const statuses = ['All','Active','Draft','Archived'];
    const visible  = funnels.filter(f => state.filterStatus==='All' || f.status===state.filterStatus);

    return `
<div class="flex-1 overflow-auto p-6" id="fn-list-wrap">
  <!-- top controls -->
  <div class="flex flex-wrap items-center gap-3 mb-6">
    <h2 class="text-lg font-semibold text-gray-800">Funnels</h2>
    <div class="flex-1"></div>
    <div class="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
      ${statuses.map(s=>`<button data-ffilter="${s}" class="px-3 py-1.5 ${state.filterStatus===s?'bg-blue-600 text-white':'bg-white text-gray-600 hover:bg-gray-50'}">${s}</button>`).join('')}
    </div>
    <button id="fn-create" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      + Create Funnel
    </button>
  </div>

  <!-- grid of funnel cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    ${visible.map(f => funnelCard(f)).join('')}
  </div>
</div>`;
  }

  function funnelCard(f) {
    const cr = convRate(f);
    const tv = totalVisits(f);
    const optins = f.steps.reduce((s,st)=>s+st.optins,0);
    return `
<div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
  <!-- thumbnail gradient -->
  <div class="h-36 bg-gradient-to-br ${f.gradient} flex items-center justify-center cursor-pointer" data-open-fn="${f.id}">
    <span class="text-white text-2xl font-bold opacity-90">${f.name.split(' ').map(w=>w[0]).join('')}</span>
  </div>
  <!-- info -->
  <div class="p-4">
    <div class="flex items-start justify-between mb-2">
      <div>
        <h3 class="font-semibold text-gray-800 text-sm">${f.name}</h3>
        <div class="flex items-center gap-2 mt-1">
          ${statusBadge(f.status)}
          <span class="text-xs text-gray-400">${f.steps.length} steps</span>
        </div>
      </div>
      <div class="text-right">
        <div class="text-xl font-bold text-blue-600">${cr}%</div>
        <div class="text-xs text-gray-400">conversion</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
      <div><span class="font-medium text-gray-700">${tv.toLocaleString()}</span> visits</div>
      <div><span class="font-medium text-gray-700">${optins.toLocaleString()}</span> opt-ins</div>
    </div>
    <!-- actions -->
    <div class="flex gap-1 flex-wrap">
      <button data-edit-fn="${f.id}"    class="flex-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Edit</button>
      <button data-stats-fn="${f.id}"   class="flex-1 px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">Stats</button>
      <button data-clone-fn="${f.id}"   class="px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Clone">⧉</button>
      <button data-archive-fn="${f.id}" class="px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Archive">🗄</button>
      <button data-share-fn="${f.id}"   class="px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100" title="Share">🔗</button>
    </div>
  </div>
</div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     BUILDER
  ═══════════════════════════════════════════════════════════════ */
  function builderHTML() {
    const f    = activeFunnel();
    const step = activeStep();
    if (!f) return `<div class="p-8 text-gray-400">Funnel not found.</div>`;

    const deviceW = state.builderDevice === 'desktop' ? '100%'
                  : state.builderDevice === 'tablet'  ? '768px'
                  : '375px';

    const filteredEls = ELEMENTS.filter(e =>
      !state.elSearch || e.label.toLowerCase().includes(state.elSearch.toLowerCase())
    );

    return `
<div class="flex flex-col h-full" id="fn-builder-root">
  <!-- top bar -->
  <div class="flex items-center gap-2 px-4 py-3 bg-white border-b flex-shrink-0 flex-wrap">
    <button id="fnb-back" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded">&#8592;</button>
    <input id="fnb-page-name" type="text" value="${step ? step.name : f.name}"
      class="text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 w-40">
    <div class="flex-1"></div>
    <!-- device switcher -->
    <div class="flex rounded-lg border border-gray-300 overflow-hidden text-xs">
      ${['desktop','tablet','mobile'].map(d=>`<button data-device="${d}" class="px-2.5 py-1.5 ${state.builderDevice===d?'bg-gray-800 text-white':'bg-white text-gray-600 hover:bg-gray-50'}">
        ${ d==='desktop'?'🖥': d==='tablet'?'📱':'📲' } ${d}
      </button>`).join('')}
    </div>
    <button id="fnb-preview"  class="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">Preview</button>
    <button id="fnb-save"     class="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50">Save</button>
    <button id="fnb-publish"  class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publish</button>
  </div>

  <div class="flex flex-1 overflow-hidden">
    <!-- left panel -->
    <div class="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      <!-- step list -->
      <div class="border-b border-gray-200 p-2">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">Pages</p>
        ${f.steps.map((s,i) => `
        <div data-step-id="${s.id}" class="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm ${step&&step.id===s.id?'bg-blue-50 text-blue-700':'text-gray-700 hover:bg-gray-50'}">
          <span class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${step&&step.id===s.id?'bg-blue-600 text-white':'bg-gray-200 text-gray-600'}">${i+1}</span>
          <span class="flex-1 truncate">${s.name}</span>
        </div>`).join('')}
        <button id="fnb-add-step" class="mt-1 w-full text-left px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">+ Add Page</button>
      </div>

      <!-- sections -->
      <div class="p-2 border-b border-gray-200">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">Sections</p>
        <div class="grid grid-cols-3 gap-1">
          ${SECTIONS.map(s=>`
          <div draggable="true" data-section-id="${s.id}"
            class="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-gray-200 cursor-grab hover:border-blue-400 hover:bg-blue-50 text-xs text-center select-none">
            <span class="text-base">${s.icon}</span>
            <span class="text-gray-600 leading-tight">${s.label}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- elements -->
      <div class="flex-1 overflow-y-auto p-2">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-1">Elements</p>
        <input id="el-search" type="text" placeholder="Search…" value="${state.elSearch}"
          class="w-full text-xs border rounded-lg px-2 py-1 mb-2 focus:outline-none">
        <div class="grid grid-cols-2 gap-1">
          ${filteredEls.map(e=>`
          <div draggable="true" data-el-id="${e.id}"
            class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-200 cursor-grab hover:border-blue-400 hover:bg-blue-50 text-xs select-none">
            <span class="font-bold text-gray-400 w-4 text-center">${e.icon}</span>
            <span class="text-gray-700 truncate">${e.label}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- canvas -->
    <div class="flex-1 overflow-auto bg-gray-200 flex justify-center p-4" id="fnb-canvas-wrap"
      ondragover="event.preventDefault()" ondrop="event.preventDefault()">
      <div style="width:${deviceW};max-width:100%;min-height:600px" class="bg-white shadow-xl transition-all duration-300 relative" id="fnb-canvas">
        ${step ? renderCanvas(step) : '<div class="p-8 text-gray-400 text-center">Select a page</div>'}
      </div>
    </div>

    <!-- right panel: properties -->
    <div class="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
      ${propsPanel(step)}
    </div>
  </div>
</div>`;
  }

  function renderCanvas(step) {
    if (!step || !step.elements || !step.elements.length)
      return `<div class="p-8 text-center text-gray-400 text-sm">Drag sections or elements here.</div>`;

    return step.elements.map(el => {
      const selected = state.selectedElId === el.id;
      const p = el.props || {};
      let inner = '';

      if (el.type === 'headline')
        inner = `<div style="font-size:${p.size||'2xl'==='2xl'?'1.5rem':'1rem'};color:${p.color||'#111'};text-align:${p.align||'left'};font-weight:${p.bold?'700':'400'}">${el.content||'Headline'}</div>`;
      else if (el.type === 'paragraph')
        inner = `<p style="color:${p.color||'#444'};text-align:${p.align||'left'}">${el.content||'Paragraph text here.'}</p>`;
      else if (el.type === 'button')
        inner = `<div style="text-align:center"><button style="background:${p.color||'#2563eb'};color:white;padding:10px 24px;border-radius:${p.radius||8}px;font-size:1rem;border:none;cursor:pointer">${el.content||'Click Here'}</button></div>`;
      else if (el.type === 'image')
        inner = `<div class="bg-gray-100 rounded flex items-center justify-center h-40 text-gray-400 text-sm">🖼 Image Placeholder</div>`;
      else if (el.type === 'video_el')
        inner = `<div class="bg-gray-900 rounded flex items-center justify-center h-48 text-white text-3xl cursor-pointer">▶</div>`;
      else if (el.type === 'form_el')
        inner = `<div class="space-y-2 p-2 border border-dashed border-gray-300 rounded">
          <input class="w-full border px-3 py-2 rounded text-sm" placeholder="Full Name">
          <input class="w-full border px-3 py-2 rounded text-sm" placeholder="Email">
          <button class="w-full bg-blue-600 text-white py-2 rounded text-sm">Submit</button>
        </div>`;
      else if (el.type === 'divider')
        inner = `<hr class="border-gray-300">`;
      else if (el.type === 'spacer')
        inner = `<div style="height:${p.height||40}px"></div>`;
      else if (el.type === 'countdown')
        inner = `<div class="flex gap-2 justify-center text-center">
          ${['00','12','34','56'].map((v,i)=>`<div class="bg-gray-800 text-white rounded px-3 py-2"><div class="text-2xl font-bold">${v}</div><div class="text-xs">${['Days','Hrs','Min','Sec'][i]}</div></div>`).join('')}
        </div>`;
      else if (el.type === 'progress')
        inner = `<div class="w-full bg-gray-200 rounded-full h-4"><div class="bg-blue-600 h-4 rounded-full" style="width:${p.pct||65}%"></div></div>`;
      else if (el.type === 'icon_el')
        inner = `<div style="text-align:${p.align||'center'};font-size:2rem">${p.icon||'★'}</div>`;
      else if (el.type === 'bullets')
        inner = `<ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">${(p.items||['Feature one','Feature two','Feature three']).map(i=>`<li>${i}</li>`).join('')}</ul>`;
      else
        inner = `<div class="text-sm text-gray-400">[${el.type}]</div>`;

      return `
<div data-el-id="${el.id}" class="relative group px-6 py-3 ${selected?'outline outline-2 outline-blue-500 outline-offset-2':'hover:outline hover:outline-1 hover:outline-blue-300'} cursor-pointer">
  <!-- drag handle -->
  <div class="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab text-gray-400 text-xs">⠿</div>
  ${inner}
  ${selected ? `
  <div class="absolute top-0 right-0 flex gap-1 p-0.5 bg-blue-600 rounded-bl z-10">
    <button data-move-up="${el.id}"   class="w-5 h-5 text-white hover:bg-blue-700 rounded text-xs flex items-center justify-center">↑</button>
    <button data-move-dn="${el.id}"   class="w-5 h-5 text-white hover:bg-blue-700 rounded text-xs flex items-center justify-center">↓</button>
    <button data-del-el="${el.id}"    class="w-5 h-5 text-white hover:bg-red-500 rounded text-xs flex items-center justify-center">✕</button>
  </div>` : ''}
</div>`;
    }).join('');
  }

  function propsPanel(step) {
    if (!state.selectedElId || !step) {
      return `<div class="p-4 text-sm text-gray-400 text-center mt-12">Click an element to edit its properties.</div>`;
    }
    const el = step.elements.find(e => e.id === state.selectedElId);
    if (!el) return `<div class="p-4 text-sm text-gray-400">Element not found.</div>`;
    const p = el.props || {};

    let fields = `
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Content</label>
      <input id="pp-content" value="${el.content||''}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
    </div>`;

    if (el.type === 'headline' || el.type === 'paragraph') {
      fields += `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Color</label>
        <input id="pp-color" type="color" value="${p.color||'#111827'}" class="w-full h-8 border rounded cursor-pointer">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Alignment</label>
        <div class="flex gap-1">
          ${['left','center','right'].map(a=>`<button data-align="${a}" class="flex-1 py-1 text-xs border rounded ${p.align===a?'bg-blue-600 text-white border-blue-600':'hover:bg-gray-50'}">${a[0].toUpperCase()+a.slice(1)}</button>`).join('')}
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input id="pp-bold" type="checkbox" ${p.bold?'checked':''} class="rounded"> Bold
      </label>`;
    } else if (el.type === 'button') {
      fields += `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Button Color</label>
        <input id="pp-btn-color" type="color" value="${p.color||'#2563eb'}" class="w-full h-8 border rounded cursor-pointer">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
        <input id="pp-link" value="${p.link||'#'}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Border Radius (px)</label>
        <input id="pp-radius" type="number" min="0" max="50" value="${p.radius||8}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    } else if (el.type === 'spacer') {
      fields += `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Height (px)</label>
        <input id="pp-height" type="number" min="8" max="200" value="${p.height||40}" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>`;
    } else if (el.type === 'progress') {
      fields += `
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Percentage</label>
        <input id="pp-pct" type="range" min="0" max="100" value="${p.pct||65}" class="w-full">
        <div class="text-right text-xs text-gray-400">${p.pct||65}%</div>
      </div>`;
    }

    return `
<div class="p-4 space-y-3">
  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Element Properties</p>
  <p class="text-sm font-medium text-gray-700 capitalize">${el.type.replace('_el','')}</p>
  <hr>
  ${fields}
  <button id="pp-apply" class="w-full py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-2">Apply Changes</button>
</div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     STATS MODAL
  ═══════════════════════════════════════════════════════════════ */
  function statsModalHTML() {
    const f = funnels.find(fn => fn.id === state.activeFunnelId);
    if (!f) return '';
    const maxVisits = Math.max(...f.steps.map(s => s.visits), 1);

    return `
<div id="stats-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <h3 class="font-semibold text-lg">${f.name} — Stats</h3>
      <button id="stats-close" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
    </div>
    <div class="p-6">
      <!-- date range -->
      <div class="flex gap-2 mb-5">
        ${['7d','30d','90d','all'].map(r=>`<button data-dr="${r}" class="px-3 py-1 text-sm rounded-lg border ${state.statsDateRange===r?'bg-blue-600 text-white border-blue-600':'border-gray-300 hover:bg-gray-50'}">${r}</button>`).join('')}
      </div>
      <!-- funnel bars -->
      <div class="space-y-3">
        ${f.steps.map((s,i) => {
          const pct = Math.round((s.visits/maxVisits)*100);
          const cvt = i>0 ? Math.round((s.visits/f.steps[i-1].visits)*100) : 100;
          return `
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700">${i+1}. ${s.name}</span>
              <span class="text-gray-500">${s.visits.toLocaleString()} visits${i>0?` · ${cvt}% from prev`:''}</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-7 relative">
              <div class="h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center pl-3"
                style="width:${pct}%;min-width:2%">
                <span class="text-xs text-white font-semibold">${pct}%</span>
              </div>
            </div>
            <div class="flex gap-4 text-xs text-gray-400 mt-0.5 pl-1">
              <span>${s.uniq} unique</span>
              ${s.optins ? `<span class="text-green-600">${s.optins} opt-ins</span>` : ''}
              ${s.sales  ? `<span class="text-blue-600">${s.sales} sales</span>`    : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>
</div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     FORMS TAB
  ═══════════════════════════════════════════════════════════════ */
  function formsHTML() {
    return `
<div class="flex flex-1 overflow-hidden" id="forms-root">
  <!-- forms list -->
  <div class="w-56 bg-white border-r flex flex-col p-3">
    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Forms</p>
    <div class="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm mb-1">
      <span>Opt-In Form</span>
    </div>
    <div class="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm cursor-pointer mb-1">
      <span>Contact Form</span>
    </div>
    <button id="add-form-btn" class="mt-2 text-xs text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1.5 text-left">+ New Form</button>
  </div>

  <!-- form builder -->
  <div class="flex-1 flex overflow-hidden">
    <!-- field list -->
    <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div class="max-w-md mx-auto">
        <h3 class="font-semibold text-gray-700 mb-3">Form Fields</h3>
        <div id="form-fields-list" class="space-y-2 mb-4">
          ${state.formFields.map(ff => `
          <div data-ff-id="${ff.id}" class="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
            <span class="cursor-grab text-gray-300 text-lg">⠿</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-gray-500 uppercase">${ff.type}</span>
                <input data-ff-label="${ff.id}" value="${ff.label}" class="flex-1 text-sm font-medium border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none">
              </div>
              <input data-ff-ph="${ff.id}" value="${ff.placeholder||''}" placeholder="Placeholder…" class="text-xs text-gray-400 border-b border-transparent hover:border-gray-200 focus:border-blue-400 focus:outline-none w-full">
            </div>
            <label class="flex items-center gap-1 text-xs cursor-pointer">
              <input type="checkbox" data-ff-req="${ff.id}" ${ff.required?'checked':''} class="rounded"> Req
            </label>
            <button data-del-ff="${ff.id}" class="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
          </div>`).join('')}
        </div>
        <!-- add field -->
        <div class="bg-white border border-dashed border-gray-300 rounded-xl p-3">
          <p class="text-xs font-semibold text-gray-500 mb-2">Add Field</p>
          <div class="grid grid-cols-4 gap-1.5">
            ${FIELD_TYPES.map(t=>`<button data-add-field="${t}" class="text-xs px-2 py-1.5 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-600">${t}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- form preview -->
    <div class="w-72 bg-white border-l flex flex-col p-4 overflow-y-auto flex-shrink-0">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm text-gray-700">Form Preview</h3>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Submit Button</label>
          <input id="submit-btn-txt" value="Submit Now" class="text-xs border rounded px-2 py-1 w-28">
        </div>
      </div>
      <div class="border border-gray-200 rounded-xl p-4 space-y-3">
        ${state.formFields.map(ff=>`
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">${ff.label}${ff.required?'*':''}</label>
          ${ff.type==='Checkbox' ? `<input type="checkbox" class="rounded">` :
            ff.type==='Radio'    ? `<input type="radio" class="rounded">` :
            ff.type==='Select'   ? `<select class="w-full border rounded-lg px-3 py-2 text-sm"><option>${ff.placeholder||'Select…'}</option></select>` :
            `<input type="${ff.type==='Email'?'email':ff.type==='Phone'?'tel':ff.type==='Date'?'date':'text'}" placeholder="${ff.placeholder||''}" class="w-full border rounded-lg px-3 py-2 text-sm">`}
        </div>`).join('')}
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Submit Now</button>
      </div>
      <div class="mt-4">
        <label class="block text-xs font-medium text-gray-600 mb-1">Redirect URL after submit</label>
        <input placeholder="https://" class="w-full border rounded-lg px-3 py-1.5 text-sm">
      </div>
    </div>
  </div>
</div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     WEBSITES TAB
  ═══════════════════════════════════════════════════════════════ */
  function websitesHTML() {
    return `
<div class="flex-1 overflow-auto p-6 bg-gray-50">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-lg font-semibold text-gray-800">Websites</h2>
    <button class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Create Website</button>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    ${[
      { name:'Company Website',   pages:6, gradient:'from-slate-500 to-blue-700',   status:'Active'  },
      { name:'Portfolio Site',    pages:4, gradient:'from-violet-500 to-purple-700', status:'Active'  },
      { name:'Blog',              pages:12,gradient:'from-rose-500 to-pink-700',     status:'Draft'   },
    ].map(w=>`
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div class="h-36 bg-gradient-to-br ${w.gradient} flex items-center justify-center">
        <span class="text-white text-2xl font-bold opacity-90">${w.name.split(' ').map(x=>x[0]).join('')}</span>
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-gray-800 text-sm">${w.name}</h3>
          ${statusBadge(w.status)}
        </div>
        <p class="text-xs text-gray-500 mb-3">${w.pages} pages</p>
        <div class="flex gap-2">
          <button class="flex-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Edit</button>
          <button class="flex-1 px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">Preview</button>
        </div>
      </div>
    </div>`).join('')}
  </div>
</div>`;
  }

  /* ─── Bind Events ────────────────────────────────────────────── */
  function bind() {
    const el = root.querySelector('#fn-root');
    if (!el) return;

    el.addEventListener('click', e => {
      const t = e.target;

      // tab switcher
      const tb = t.closest('[data-tab]');
      if (tb) { state.tab = tb.dataset.tab; state.view = 'list'; render(); return; }

      // funnel list: filter
      const ff = t.closest('[data-ffilter]');
      if (ff) { state.filterStatus = ff.dataset.ffilter; render(); return; }

      // create funnel
      if (t.id === 'fn-create') { createFunnel(); return; }

      // funnel card actions
      if (t.dataset.openFn)   { openBuilder(+t.dataset.openFn);  return; }
      if (t.dataset.editFn)   { openBuilder(+t.dataset.editFn);  return; }
      if (t.dataset.statsFn)  { openStats(+t.dataset.statsFn);   return; }
      if (t.dataset.cloneFn)  { cloneFunnel(+t.dataset.cloneFn); return; }
      if (t.dataset.archiveFn){ archiveFunnel(+t.dataset.archiveFn); return; }
      if (t.dataset.shareFn)  {
        const fn = funnels.find(x=>x.id===+t.dataset.shareFn);
        if (fn) { navigator.clipboard&&navigator.clipboard.writeText(`https://yoursite.com/funnel/${fn.id}`);
          alert('Share link copied!'); }
        return;
      }

      // builder: back
      if (t.id === 'fnb-back')    { state.view = 'list'; state.selectedElId = null; render(); return; }
      if (t.id === 'fnb-save')    { alert('Funnel page saved!'); return; }
      if (t.id === 'fnb-publish') { const fn=activeFunnel(); if(fn){fn.status='Active'; alert('Published!'); render();} return; }
      if (t.id === 'fnb-preview') { alert('Preview opens in a new tab (mock).'); return; }

      // device switcher
      const dv = t.closest('[data-device]');
      if (dv) { state.builderDevice = dv.dataset.device; render(); return; }

      // step selector
      const sp = t.closest('[data-step-id]');
      if (sp) { state.activeStepId = sp.dataset.stepId; state.selectedElId = null; render(); return; }

      // add step
      if (t.id === 'fnb-add-step') { addStep(); return; }

      // element click in canvas
      const ec = t.closest('[data-el-id]');
      if (ec && t.closest('#fnb-canvas')) {
        state.selectedElId = ec.dataset.elId; render(); return;
      }

      // element controls
      if (t.dataset.moveUp) { moveEl(t.dataset.moveUp, -1); return; }
      if (t.dataset.moveDn) { moveEl(t.dataset.moveDn,  1); return; }
      if (t.dataset.delEl)  { deleteEl(t.dataset.delEl);    return; }

      // props panel: alignment
      const alignBtn = t.closest('[data-align]');
      if (alignBtn && t.closest('#fn-root')) {
        applyProp('align', alignBtn.dataset.align); return;
      }

      // props apply
      if (t.id === 'pp-apply') { applyPropsPanel(); return; }

      // stats modal controls
      const dr = t.closest('[data-dr]');
      if (dr) { state.statsDateRange = dr.dataset.dr; render(); return; }
      if (t.id === 'stats-close' || t.id === 'stats-overlay') {
        state.showStatsModal = false; render(); return;
      }

      // forms tab
      if (t.dataset.delFf) { deleteFormField(t.dataset.delFf); return; }
      if (t.dataset.addField) { addFormField(t.dataset.addField); return; }
    });

    // drag elements onto canvas
    const canvasWrap = root.querySelector('#fnb-canvas-wrap');
    if (canvasWrap) {
      canvasWrap.addEventListener('dragover', e => e.preventDefault());
      canvasWrap.addEventListener('drop', e => {
        e.preventDefault();
        const elId = e.dataTransfer.getData('el-id');
        const secId = e.dataTransfer.getData('section-id');
        const step = activeStep();
        if (!step) return;
        if (elId) {
          const def = ELEMENTS.find(x => x.id === elId);
          if (!def) return;
          step.elements.push({
            id: 'e'+(nextEid++), type: elId, content: def.label, props: {}
          });
        } else if (secId) {
          const def = SECTIONS.find(x => x.id === secId);
          if (!def) return;
          // add headline + paragraph + button as a block
          step.elements.push({ id:'e'+(nextEid++), type:'headline',  content: def.label+' Section', props:{ align:'center', bold:true, color:'#111827' } });
          step.elements.push({ id:'e'+(nextEid++), type:'paragraph', content: 'Edit this section content.', props:{ align:'center' } });
        }
        state.selectedElId = null;
        render();
      });
    }

    // set draggable data on palette items
    root.querySelectorAll('[data-el-id][draggable]').forEach(d => {
      d.addEventListener('dragstart', e => e.dataTransfer.setData('el-id', d.dataset.elId));
    });
    root.querySelectorAll('[data-section-id][draggable]').forEach(d => {
      d.addEventListener('dragstart', e => e.dataTransfer.setData('section-id', d.dataset.sectionId));
    });

    // element search
    const es = root.querySelector('#el-search');
    if (es) es.addEventListener('input', e => { state.elSearch = e.target.value; render(); });

    // form field inline edits
    root.querySelectorAll('[data-ff-label]').forEach(inp => {
      inp.addEventListener('change', e => {
        const ff = state.formFields.find(f => f.id === inp.dataset.ffLabel);
        if (ff) ff.label = e.target.value;
      });
    });
    root.querySelectorAll('[data-ff-ph]').forEach(inp => {
      inp.addEventListener('change', e => {
        const ff = state.formFields.find(f => f.id === inp.dataset.ffPh);
        if (ff) ff.placeholder = e.target.value;
      });
    });
    root.querySelectorAll('[data-ff-req]').forEach(cb => {
      cb.addEventListener('change', e => {
        const ff = state.formFields.find(f => f.id === cb.dataset.ffReq);
        if (ff) ff.required = cb.checked;
      });
    });
  }

  /* ── Actions ── */
  function createFunnel() {
    const f = {
      id: nextFid++,
      name: 'New Funnel',
      status: 'Draft',
      gradient: 'from-gray-500 to-gray-700',
      steps: [
        { id:'s1', name:'Landing Page', visits:0, uniq:0, optins:0, sales:0,
          elements: [
            { id:'e1', type:'headline', content:'Welcome!', props:{ align:'center', bold:true, color:'#111827' } },
            { id:'e2', type:'button',   content:'Get Started', props:{ color:'#2563eb', radius:8 } },
          ]
        }
      ],
    };
    funnels.unshift(f);
    openBuilder(f.id);
  }

  function openBuilder(id) {
    state.activeFunnelId = id;
    state.activeStepId   = null;
    state.selectedElId   = null;
    state.view           = 'builder';
    render();
  }

  function cloneFunnel(id) {
    const src = funnels.find(f => f.id === id);
    if (!src) return;
    funnels.splice(funnels.findIndex(f=>f.id===id)+1, 0, {
      ...src, id: nextFid++, name: src.name+' (Copy)', status:'Draft',
      steps: src.steps.map(s=>({...s,elements:s.elements.map(e=>({...e}))}))
    });
    render();
  }

  function archiveFunnel(id) {
    const fn = funnels.find(f => f.id === id);
    if (fn) { fn.status = 'Archived'; render(); }
  }

  function openStats(id) {
    state.activeFunnelId = id;
    state.showStatsModal = true;
    render();
  }

  function addStep() {
    const f = activeFunnel();
    if (!f) return;
    const sid = 's' + Date.now();
    f.steps.push({
      id: sid, name: `Page ${f.steps.length+1}`, visits:0, uniq:0, optins:0, sales:0,
      elements: [
        { id:'e'+(nextEid++), type:'headline', content:'New Page', props:{ align:'center', bold:true, color:'#111827' } }
      ]
    });
    state.activeStepId = sid;
    render();
  }

  function moveEl(id, dir) {
    const step = activeStep();
    if (!step) return;
    const idx = step.elements.findIndex(e => e.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= step.elements.length) return;
    [step.elements[idx], step.elements[newIdx]] = [step.elements[newIdx], step.elements[idx]];
    render();
  }

  function deleteEl(id) {
    const step = activeStep();
    if (!step) return;
    step.elements = step.elements.filter(e => e.id !== id);
    if (state.selectedElId === id) state.selectedElId = null;
    render();
  }

  function applyProp(key, val) {
    const step = activeStep();
    if (!step || !state.selectedElId) return;
    const el = step.elements.find(e => e.id === state.selectedElId);
    if (el) { el.props[key] = val; render(); }
  }

  function applyPropsPanel() {
    const step = activeStep();
    if (!step || !state.selectedElId) return;
    const el   = step.elements.find(e => e.id === state.selectedElId);
    if (!el) return;

    const g = id => root.querySelector(id);

    const cnt = g('#pp-content');
    if (cnt) el.content = cnt.value;

    const col = g('#pp-color');
    if (col) el.props.color = col.value;

    const bold = g('#pp-bold');
    if (bold !== null) el.props.bold = bold.checked;

    const btnCol = g('#pp-btn-color');
    if (btnCol) el.props.color = btnCol.value;

    const link = g('#pp-link');
    if (link) el.props.link = link.value;

    const rad = g('#pp-radius');
    if (rad) el.props.radius = +rad.value;

    const ht = g('#pp-height');
    if (ht) el.props.height = +ht.value;

    const pct = g('#pp-pct');
    if (pct) el.props.pct = +pct.value;

    render();
  }

  function deleteFormField(id) {
    state.formFields = state.formFields.filter(f => f.id !== id);
    render();
  }

  function addFormField(type) {
    state.formFields.push({
      id:          'ff' + (nextFfId++),
      type,
      label:        type + ' Field',
      placeholder: '',
      required:    false,
    });
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

export default FunnelsModule;
