/**
 * calendar.js — Full Calendar / Appointments Module
 * Exports: { init(container) }
 * Dependencies: Tailwind CSS CDN loaded by host page
 */

const CalendarModule = (() => {
  /* ─── Static Data ────────────────────────────────────────────── */
  const CALENDAR_TYPES = [
    { id: 1, name: 'Discovery Call',   duration: 30, color: '#3B82F6' },
    { id: 2, name: 'Strategy Session', duration: 60, color: '#10B981' },
    { id: 3, name: 'Follow Up',        duration: 15, color: '#F59E0B' },
  ];

  const CONTACTS = [
    { id: 1, name: 'Alice Johnson',  email: 'alice@example.com'  },
    { id: 2, name: 'Bob Martinez',   email: 'bob@example.com'    },
    { id: 3, name: 'Carol White',    email: 'carol@example.com'  },
    { id: 4, name: 'David Kim',      email: 'david@example.com'  },
    { id: 5, name: 'Eva Torres',     email: 'eva@example.com'    },
    { id: 6, name: 'Frank Lee',      email: 'frank@example.com'  },
    { id: 7, name: 'Grace Patel',    email: 'grace@example.com'  },
    { id: 8, name: 'Henry Brown',    email: 'henry@example.com'  },
  ];

  /* ─── Mock Appointments (15 spread across current month) ─────── */
  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth();

  function mkA(id, cid, tid, day, hr, mn, loc, notes) {
    const type    = CALENDAR_TYPES.find(t => t.id === tid);
    const contact = CONTACTS.find(c => c.id === cid);
    const start   = new Date(Y, M, day, hr, mn);
    const end     = new Date(start.getTime() + type.duration * 60000);
    return { id, contact, type, start, end, location: loc, notes, reminder: '15min', confirmation: true };
  }

  let appointments = [
    mkA(1,  1, 1,  2, 10,  0, 'Zoom',      'Intro call'),
    mkA(2,  2, 2,  3, 14,  0, 'Phone',     'Quarterly review'),
    mkA(3,  3, 3,  5,  9, 30, 'In Person', ''),
    mkA(4,  4, 1,  7, 11,  0, 'Zoom',      'New project discussion'),
    mkA(5,  5, 2,  9, 15,  0, 'Zoom',      ''),
    mkA(6,  6, 3, 11,  8, 30, 'Phone',     'Quick check-in'),
    mkA(7,  7, 1, 12, 13,  0, 'Zoom',      ''),
    mkA(8,  8, 2, 14, 10,  0, 'In Person', 'Demo walkthrough'),
    mkA(9,  1, 3, 15, 16,  0, 'Zoom',      ''),
    mkA(10, 2, 1, 17,  9,  0, 'Zoom',      ''),
    mkA(11, 3, 2, 19, 14,  0, 'Phone',     'Strategy call'),
    mkA(12, 4, 3, 21, 11, 30, 'Zoom',      ''),
    mkA(13, 5, 1, 23, 10,  0, 'Zoom',      ''),
    mkA(14, 6, 2, 25, 15,  0, 'In Person', 'Closing session'),
    mkA(15, 7, 3, 27,  8,  0, 'Phone',     ''),
  ];

  let nextId = 16;

  /* ─── State ──────────────────────────────────────────────────── */
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  let state = {
    view:         'month',
    currentDate:  new Date(Y, M, 1),
    showModal:    false,
    editingAppt:  null,
    showSettings: false,
    calendarSel:  'My Calendar',
    workingHours: {
      Mon: { on: true,  start: '09:00', end: '17:00' },
      Tue: { on: true,  start: '09:00', end: '17:00' },
      Wed: { on: true,  start: '09:00', end: '17:00' },
      Thu: { on: true,  start: '09:00', end: '17:00' },
      Fri: { on: true,  start: '09:00', end: '17:00' },
      Sat: { on: false, start: '10:00', end: '14:00' },
      Sun: { on: false, start: '10:00', end: '14:00' },
    },
    bufferTime: 15,
    maxPerDay:   8,
  };

  let root = null; // container element

  /* ─── Utility ────────────────────────────────────────────────── */
  const fmt     = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const fmtDate = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() &&
                            a.getMonth()    === b.getMonth()    &&
                            a.getDate()     === b.getDate();

  const byDay = d => appointments.filter(a => sameDay(a.start, d));

  const upcoming = (n = 5) =>
    appointments.filter(a => a.start >= now)
                .sort((a, b) => a.start - b.start)
                .slice(0, n);

  /* ─── Render ─────────────────────────────────────────────────── */
  function render() {
    root.innerHTML = html();
    bind();
  }

  function html() {
    return `
<div class="flex flex-col h-full bg-gray-50 text-gray-800" id="cal-wrap">
  ${topBar()}
  <div class="flex flex-1 overflow-hidden">
    ${sidebar()}
    <div class="flex-1 flex flex-col overflow-hidden">
      ${ state.view === 'month'  ? monthView()  : '' }
      ${ state.view === 'week'   ? weekView()   : '' }
      ${ state.view === 'day'    ? dayView()    : '' }
      ${ state.view === 'agenda' ? agendaView() : '' }
    </div>
    ${upcomingWidget()}
  </div>
  ${ state.showModal    ? apptModal()    : '' }
  ${ state.showSettings ? settingsPanel(): '' }
</div>`;
  }

  /* ── Top Bar ── */
  function topBar() {
    const lbl = navLabel();
    const views = ['month','week','day','agenda'];
    return `
<div class="flex flex-wrap items-center gap-2 px-4 py-3 bg-white border-b border-gray-200">
  <select id="cal-sel" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white">
    ${['My Calendar','Team Calendar','All'].map(o =>
      `<option${state.calendarSel===o?' selected':''}>${o}</option>`).join('')}
  </select>

  <div class="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
    ${views.map(v => `
    <button data-view="${v}" class="px-3 py-1.5 ${state.view===v
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50'}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}
  </div>

  <button id="cal-today" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50">Today</button>

  <div class="flex items-center gap-1">
    <button id="cal-prev" class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-lg">&#8249;</button>
    <span class="text-sm font-semibold w-44 text-center">${lbl}</span>
    <button id="cal-next" class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-lg">&#8250;</button>
  </div>

  <div class="flex-1"></div>

  <button id="cal-google" class="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
    <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    Sync Google Calendar
  </button>

  <button id="cal-add" class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    + Add Appointment
  </button>

  <button id="cal-cfg" class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500" title="Availability settings">
    &#9881;
  </button>
</div>`;
  }

  function navLabel() {
    const d = state.currentDate;
    if (state.view === 'month' || state.view === 'agenda')
      return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (state.view === 'week') {
      const sun = new Date(d); sun.setDate(d.getDate() - d.getDay());
      const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
      return `${MONTHS[sun.getMonth()].slice(0,3)} ${sun.getDate()} – ${MONTHS[sat.getMonth()].slice(0,3)} ${sat.getDate()}`;
    }
    return fmtDate(d);
  }

  /* ── Sidebar ── */
  function sidebar() {
    return `
<div class="w-52 bg-white border-r border-gray-200 flex flex-col p-3 gap-1 overflow-y-auto">
  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Calendar Types</p>
  ${CALENDAR_TYPES.map(ct => `
  <div class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
    <span class="w-3 h-3 rounded-full flex-shrink-0" style="background:${ct.color}"></span>
    <span class="flex-1 truncate">${ct.name}</span>
    <span class="text-xs text-gray-400">${ct.duration}m</span>
  </div>`).join('')}

  <button id="add-type-btn" class="mt-1 flex items-center gap-1 px-2 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
    + Add Calendar Type
  </button>

  <div class="mt-4 border-t pt-3">
    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mini Calendar</p>
    ${miniCal()}
  </div>
</div>`;
  }

  function miniCal() {
    const d    = state.currentDate;
    const last = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
    const pad  = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    let cells  = '';
    for (let i = 0; i < pad; i++) cells += '<div></div>';
    for (let day = 1; day <= last; day++) {
      const thisDay = new Date(d.getFullYear(), d.getMonth(), day);
      const isToday = sameDay(thisDay, now);
      const has     = byDay(thisDay).length > 0;
      cells += `<div data-md="${day}" class="text-center text-xs py-0.5 rounded cursor-pointer
        ${isToday ? 'bg-blue-600 text-white font-bold'
         : has    ? 'text-blue-600 font-semibold hover:bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-100'}">${day}</div>`;
    }
    return `
<div class="text-xs font-semibold text-center text-gray-500 mb-1">${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}</div>
<div class="grid grid-cols-7 gap-px text-xs text-center text-gray-400 mb-1">${DAYS.map(x=>`<div>${x[0]}</div>`).join('')}</div>
<div class="grid grid-cols-7 gap-px">${cells}</div>`;
  }

  /* ── Month View ── */
  function monthView() {
    const d    = state.currentDate;
    const last = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
    const pad  = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    let cells  = '';

    for (let i = 0; i < pad; i++)
      cells += `<div class="min-h-24 bg-gray-50 border border-gray-100 p-1"></div>`;

    for (let day = 1; day <= last; day++) {
      const thisDay  = new Date(d.getFullYear(), d.getMonth(), day);
      const appts    = byDay(thisDay);
      const isToday  = sameDay(thisDay, now);
      cells += `
<div data-mday="${day}" class="min-h-24 border border-gray-200 p-1 bg-white hover:bg-blue-50/30 cursor-pointer ${isToday?'ring-2 ring-inset ring-blue-500':''}">
  <span class="text-xs font-semibold ${isToday?'inline-flex w-5 h-5 items-center justify-center bg-blue-600 text-white rounded-full':'text-gray-500'}">${day}</span>
  ${appts.slice(0,3).map(a=>`
  <div data-aid="${a.id}" class="mt-0.5 text-xs px-1 py-0.5 rounded truncate text-white cursor-pointer" style="background:${a.type.color}">
    ${fmt(a.start)} ${a.contact.name.split(' ')[0]}
  </div>`).join('')}
  ${appts.length > 3 ? `<div class="text-xs text-gray-400 mt-0.5">+${appts.length-3} more</div>` : ''}
</div>`;
    }

    const filled = pad + last;
    const tail   = (7 - filled % 7) % 7;
    for (let i = 0; i < tail; i++)
      cells += `<div class="min-h-24 bg-gray-50 border border-gray-100 p-1"></div>`;

    return `
<div class="flex-1 overflow-auto p-0">
  <div class="grid grid-cols-7">
    ${DAYS.map(x=>`<div class="text-center text-xs font-semibold text-gray-500 py-2 bg-gray-50 border border-gray-200">${x}</div>`).join('')}
  </div>
  <div class="grid grid-cols-7">${cells}</div>
</div>`;
  }

  /* ── Week View ── */
  function weekView() {
    const d    = state.currentDate;
    const sun  = new Date(d); sun.setDate(d.getDate() - d.getDay());
    const week = Array.from({length:7}, (_,i) => { const x=new Date(sun); x.setDate(sun.getDate()+i); return x; });
    const hrs  = Array.from({length:13}, (_,i) => i+8); // 8 AM – 8 PM

    return `
<div class="flex-1 overflow-auto">
  <!-- header row -->
  <div class="flex sticky top-0 z-10 bg-white border-b border-gray-200">
    <div class="w-14 flex-shrink-0"></div>
    ${week.map(wd => {
      const isT = sameDay(wd, now);
      return `<div class="flex-1 text-center py-2 border-l border-gray-200 ${isT?'bg-blue-50':''}">
        <div class="text-xs text-gray-500">${DAYS[wd.getDay()]}</div>
        <div class="text-lg font-bold ${isT?'text-blue-600':'text-gray-700'}">${wd.getDate()}</div>
      </div>`;
    }).join('')}
  </div>
  <!-- body -->
  <div class="flex">
    <div class="w-14 flex-shrink-0">
      ${hrs.map(h=>`<div class="h-14 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
        <span class="text-xs text-gray-400">${h<=12?h:''}${h<12?'am':h===12?'pm':(h-12)+'pm'}</span>
      </div>`).join('')}
    </div>
    ${week.map(wd => {
      const dAppts = byDay(wd);
      return `<div class="flex-1 border-l border-gray-200 relative" style="min-height:${hrs.length*56}px">
        ${hrs.map(h=>`<div class="h-14 border-b border-gray-100 hover:bg-blue-50/40 cursor-pointer" data-wslot="${h}" data-wdate="${wd.toISOString()}"></div>`).join('')}
        ${dAppts.map(a => {
          const top = (a.start.getHours() + a.start.getMinutes()/60 - 8) * 56;
          const hgt = Math.max((a.type.duration/60)*56, 22);
          return `<div data-aid="${a.id}" class="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-white text-xs cursor-pointer overflow-hidden z-10 shadow-sm"
            style="top:${top}px;height:${hgt}px;background:${a.type.color}">
            <div class="font-semibold truncate">${a.contact.name.split(' ')[0]}</div>
            <div class="opacity-80 truncate">${fmt(a.start)}</div>
          </div>`;
        }).join('')}
      </div>`;
    }).join('')}
  </div>
</div>`;
  }

  /* ── Day View ── */
  function dayView() {
    const d     = state.currentDate;
    const dAppts= byDay(d);
    const hrs   = Array.from({length:13}, (_,i) => i+8);

    return `
<div class="flex-1 overflow-auto bg-white">
  <div class="text-center py-3 font-semibold text-gray-700 border-b">${fmtDate(d)}</div>
  <div class="flex">
    <div class="w-14 flex-shrink-0">
      ${hrs.map(h=>`<div class="h-14 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
        <span class="text-xs text-gray-400">${h<=12?h:''}${h<12?'am':h===12?'pm':(h-12)+'pm'}</span>
      </div>`).join('')}
    </div>
    <div class="flex-1 border-l border-gray-200 relative" style="min-height:${hrs.length*56}px">
      ${hrs.map(h=>`<div class="h-14 border-b border-gray-100 hover:bg-blue-50/40 cursor-pointer" data-dhour="${h}"></div>`).join('')}
      ${dAppts.map(a => {
        const top = (a.start.getHours() + a.start.getMinutes()/60 - 8) * 56;
        const hgt = Math.max((a.type.duration/60)*56, 28);
        return `<div data-aid="${a.id}" class="absolute left-1 right-1 rounded px-2 py-1 text-white cursor-pointer shadow"
          style="top:${top}px;height:${hgt}px;background:${a.type.color}">
          <div class="font-semibold text-sm">${a.contact.name}</div>
          <div class="text-xs opacity-80">${fmt(a.start)} · ${a.type.name}</div>
        </div>`;
      }).join('')}
    </div>
  </div>
</div>`;
  }

  /* ── Agenda View ── */
  function agendaView() {
    const sorted = [...appointments].sort((a,b)=>a.start-b.start);
    const groups = {};
    sorted.forEach(a => {
      const k = a.start.toDateString();
      (groups[k] = groups[k]||[]).push(a);
    });
    return `
<div class="flex-1 overflow-auto p-4 bg-white">
  <div class="max-w-2xl mx-auto space-y-5">
    ${Object.entries(groups).map(([k,appts])=>`
    <div>
      <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">${k}</div>
      ${appts.map(a=>`
      <div data-aid="${a.id}" class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-400 cursor-pointer mb-2">
        <div class="w-1 self-stretch rounded-full" style="background:${a.type.color}"></div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm">${a.contact.name}</div>
          <div class="text-xs text-gray-500">${a.type.name} · ${fmt(a.start)} – ${fmt(a.end)}</div>
          ${a.notes ? `<div class="text-xs text-gray-400 truncate">${a.notes}</div>` : ''}
        </div>
        <span class="text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0" style="background:${a.type.color}">${a.location}</span>
      </div>`).join('')}
    </div>`).join('')}
  </div>
</div>`;
  }

  /* ── Upcoming Widget ── */
  function upcomingWidget() {
    const list = upcoming();
    return `
<div class="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
  <div class="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Upcoming Appointments</div>
  <div class="flex-1 overflow-y-auto p-3 space-y-2">
    ${list.length ? list.map(a=>`
    <div data-aid="${a.id}" class="p-2.5 rounded-xl border border-gray-200 hover:border-blue-400 cursor-pointer">
      <div class="flex items-center gap-1.5 mb-1">
        <span class="w-2 h-2 rounded-full" style="background:${a.type.color}"></span>
        <span class="text-xs font-semibold truncate">${a.contact.name}</span>
      </div>
      <div class="text-xs text-gray-500">${a.type.name}</div>
      <div class="text-xs text-gray-400">${fmtDate(a.start)} ${fmt(a.start)}</div>
      <div class="flex gap-1 mt-1.5">
        <button data-eid="${a.id}" class="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
        <button data-did="${a.id}" class="px-2 py-0.5 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">Delete</button>
      </div>
    </div>`).join('')
    : `<p class="text-sm text-gray-400 text-center pt-6">No upcoming appointments</p>`}
  </div>
</div>`;
  }

  /* ── Appointment Modal ── */
  function apptModal() {
    const a = state.editingAppt || {};
    const dateVal = a.start ? a.start.toISOString().slice(0,10) : '';
    const timeVal = a.start ? a.start.toTimeString().slice(0,5)  : '';
    return `
<div id="am-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <h3 class="text-lg font-semibold">${a.id ? 'Edit Appointment' : 'New Appointment'}</h3>
      <button id="am-x" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="p-6 space-y-4 overflow-y-auto max-h-[65vh]">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
        <select id="am-contact" class="w-full border rounded-lg px-3 py-2 text-sm">
          ${CONTACTS.map(c=>`<option value="${c.id}"${a.contact&&a.contact.id===c.id?' selected':''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Calendar Type</label>
        <select id="am-type" class="w-full border rounded-lg px-3 py-2 text-sm">
          ${CALENDAR_TYPES.map(t=>`<option value="${t.id}"${a.type&&a.type.id===t.id?' selected':''}>${t.name} (${t.duration} min)</option>`).join('')}
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input id="am-date" type="date" value="${dateVal}" class="w-full border rounded-lg px-3 py-2 text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input id="am-time" type="time" value="${timeVal}" class="w-full border rounded-lg px-3 py-2 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <select id="am-loc" class="w-full border rounded-lg px-3 py-2 text-sm">
          ${['Zoom','Phone','In Person'].map(l=>`<option${a.location===l?' selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea id="am-notes" rows="3" class="w-full border rounded-lg px-3 py-2 text-sm resize-none">${a.notes||''}</textarea>
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input id="am-confirm" type="checkbox"${a.confirmation?' checked':''} class="rounded">
          Send confirmation email
        </label>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Reminder</label>
        <select id="am-reminder" class="w-full border rounded-lg px-3 py-2 text-sm">
          ${['15min','1hr','1day'].map(r=>`<option${a.reminder===r?' selected':''}>${r} before</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="flex justify-end gap-3 px-6 py-4 border-t">
      <button id="am-cancel" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
      <button id="am-save" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Appointment</button>
    </div>
  </div>
</div>`;
  }

  /* ── Settings Panel ── */
  function settingsPanel() {
    const wh = state.workingHours;
    return `
<div id="sp-overlay" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <h3 class="text-lg font-semibold">Availability & Booking Settings</h3>
      <button id="sp-x" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
    </div>
    <div class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
      <div>
        <p class="text-sm font-medium text-gray-700 mb-3">Working Hours</p>
        <div class="space-y-2">
          ${Object.entries(wh).map(([day,val])=>`
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 w-20 cursor-pointer select-none">
              <input type="checkbox" data-wday="${day}"${val.on?' checked':''} class="rounded">
              <span class="text-sm">${day}</span>
            </label>
            <input type="time" data-wstart="${day}" value="${val.start}"${!val.on?' disabled':''} class="border rounded px-2 py-1 text-sm${!val.on?' opacity-40':''}">
            <span class="text-gray-400 text-sm">–</span>
            <input type="time" data-wend="${day}" value="${val.end}"${!val.on?' disabled':''} class="border rounded px-2 py-1 text-sm${!val.on?' opacity-40':''}">
          </div>`).join('')}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buffer Between Appts (min)</label>
          <input id="sp-buffer" type="number" min="0" max="60" value="${state.bufferTime}" class="w-full border rounded-lg px-3 py-2 text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Appointments / Day</label>
          <input id="sp-max" type="number" min="1" max="20" value="${state.maxPerDay}" class="w-full border rounded-lg px-3 py-2 text-sm">
        </div>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-700 mb-1">Booking Link</p>
        <div class="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2 text-sm">
          <span class="flex-1 text-blue-600">yoursite.com/book/your-name</span>
          <button onclick="navigator.clipboard&&navigator.clipboard.writeText('yoursite.com/book/your-name')"
            class="text-xs text-gray-500 hover:text-gray-800 px-2 py-0.5 border rounded">Copy</button>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-3 px-6 py-4 border-t">
      <button id="sp-cancel" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
      <button id="sp-save" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Settings</button>
    </div>
  </div>
</div>`;
  }

  /* ─── Event Binding ──────────────────────────────────────────── */
  function bind() {
    const wrap = root.querySelector('#cal-wrap');
    if (!wrap) return;

    wrap.addEventListener('click', e => {
      const t = e.target;

      // view switcher
      const vb = t.closest('[data-view]');
      if (vb) { state.view = vb.dataset.view; render(); return; }

      // navigation
      if (t.id === 'cal-today') { state.currentDate = new Date(Y, M, 1); render(); return; }
      if (t.id === 'cal-prev')  { nav(-1); return; }
      if (t.id === 'cal-next')  { nav(+1); return; }

      // add appointment
      if (t.id === 'cal-add') { openModal(null); return; }

      // settings button
      if (t.id === 'cal-cfg') { state.showSettings = true; render(); return; }

      // click on appointment chip
      const chip = t.closest('[data-aid]');
      if (chip) {
        const appt = appointments.find(a => a.id === +chip.dataset.aid);
        if (appt) { openModal(appt); return; }
      }

      // month day cell click (not on chip)
      const dayCell = t.closest('[data-mday]');
      if (dayCell && !t.closest('[data-aid]')) {
        const day = +dayCell.dataset.mday;
        const d   = state.currentDate;
        openModal({ start: new Date(d.getFullYear(), d.getMonth(), day, 9, 0) });
        return;
      }

      // week slot click
      const wslot = t.closest('[data-wslot]');
      if (wslot) {
        const dt = new Date(wslot.dataset.wdate);
        dt.setHours(+wslot.dataset.wslot, 0, 0, 0);
        openModal({ start: dt });
        return;
      }

      // day hour click
      const dhour = t.closest('[data-dhour]');
      if (dhour) {
        const dt = new Date(state.currentDate);
        dt.setHours(+dhour.dataset.dhour, 0, 0, 0);
        openModal({ start: dt });
        return;
      }

      // upcoming widget: edit / delete
      if (t.dataset.eid) {
        const appt = appointments.find(a => a.id === +t.dataset.eid);
        if (appt) openModal(appt);
        return;
      }
      if (t.dataset.did) {
        appointments = appointments.filter(a => a.id !== +t.dataset.did);
        render();
        return;
      }

      // modal dismiss / close
      if (['am-overlay','am-x','am-cancel'].includes(t.id)) { closeModal(); return; }
      if (t.id === 'am-save') { saveAppt(); return; }

      // settings dismiss
      if (['sp-overlay','sp-x','sp-cancel'].includes(t.id)) { state.showSettings = false; render(); return; }
      if (t.id === 'sp-save') { saveSettings(); return; }
    });

    // calendar selector
    const sel = wrap.querySelector('#cal-sel');
    if (sel) sel.addEventListener('change', e => { state.calendarSel = e.target.value; });
  }

  function nav(dir) {
    const d = state.currentDate;
    if (state.view === 'month' || state.view === 'agenda')
      state.currentDate = new Date(d.getFullYear(), d.getMonth() + dir, 1);
    else if (state.view === 'week') {
      const n = new Date(d); n.setDate(d.getDate() + dir * 7); state.currentDate = n;
    } else {
      const n = new Date(d); n.setDate(d.getDate() + dir); state.currentDate = n;
    }
    render();
  }

  function openModal(appt) {
    state.editingAppt = appt
      ? { ...appt }
      : { contact: CONTACTS[0], type: CALENDAR_TYPES[0],
          start: new Date(), location: 'Zoom', notes: '', reminder: '15min', confirmation: true };
    state.showModal = true;
    render();
  }

  function closeModal() {
    state.showModal = false;
    state.editingAppt = null;
    render();
  }

  function saveAppt() {
    const g = id => root.querySelector(id);
    const dateVal = g('#am-date').value;
    const timeVal = g('#am-time').value;
    if (!dateVal || !timeVal) { alert('Please enter date and time.'); return; }
    const [yy,mm,dd] = dateVal.split('-').map(Number);
    const [hh,mn]    = timeVal.split(':').map(Number);
    const start   = new Date(yy, mm-1, dd, hh, mn);
    const type    = CALENDAR_TYPES.find(t => t.id === +g('#am-type').value);
    const contact = CONTACTS.find(c => c.id === +g('#am-contact').value);
    const end     = new Date(start.getTime() + type.duration * 60000);
    const ea      = state.editingAppt;

    const updated = {
      ...ea, contact, type, start, end,
      location:     g('#am-loc').value,
      notes:        g('#am-notes').value,
      confirmation: g('#am-confirm').checked,
      reminder:     g('#am-reminder').value.replace(' before',''),
    };

    if (ea.id) {
      const i = appointments.findIndex(a => a.id === ea.id);
      appointments[i] = updated;
    } else {
      appointments.push({ ...updated, id: nextId++ });
    }
    closeModal();
  }

  function saveSettings() {
    Object.keys(state.workingHours).forEach(day => {
      const cb = root.querySelector(`[data-wday="${day}"]`);
      const st = root.querySelector(`[data-wstart="${day}"]`);
      const en = root.querySelector(`[data-wend="${day}"]`);
      if (cb) state.workingHours[day].on    = cb.checked;
      if (st) state.workingHours[day].start = st.value;
      if (en) state.workingHours[day].end   = en.value;
    });
    const buf = root.querySelector('#sp-buffer');
    const mx  = root.querySelector('#sp-max');
    if (buf) state.bufferTime = +buf.value;
    if (mx)  state.maxPerDay  = +mx.value;
    state.showSettings = false;
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

export default CalendarModule;
