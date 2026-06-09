const ReportingModule = {
  activeReport: 'overview',
  dateRange: 'month',
  charts: {},

  init(container) {
    container.innerHTML = this.render();
    this.renderReport();
    this.bindEvents();
  },

  render() {
    return `
<div class="flex h-full">
  <!-- Left Sidebar -->
  <div class="w-52 bg-gray-50 border-r border-gray-200 p-3 flex-shrink-0">
    <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Reports</div>
    ${[
      ['overview','fas fa-chart-line','Overview'],
      ['appointments','fas fa-calendar-check','Appointments'],
      ['calls','fas fa-phone','Calls'],
      ['conversions','fas fa-funnel-dollar','Conversions'],
      ['revenue','fas fa-dollar-sign','Revenue'],
      ['leaderboard','fas fa-trophy','Leaderboard'],
      ['attribution','fas fa-share-alt','Attribution'],
    ].map(([k,i,l])=>`
    <button data-report="${k}" class="report-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${k===this.activeReport?'bg-blue-50 text-blue-700 font-medium':''}">
      <i class="${i} w-4 text-center text-xs"></i>${l}
    </button>`).join('')}
  </div>

  <!-- Main Report Area -->
  <div class="flex-1 overflow-auto">
    <!-- Date Range Bar -->
    <div class="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
      <h2 id="report-title" class="text-lg font-semibold text-gray-900 flex-1">Overview</h2>
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
        ${['week','month','3months','6months','year'].map((r,i)=>`
        <button data-range="${r}" class="range-btn px-3 py-1 text-xs rounded-md font-medium ${r==='month'?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}">${['Week','Month','3 Mo','6 Mo','Year'][i]}</button>`).join('')}
      </div>
      <label class="flex items-center gap-2 text-xs text-gray-600">
        <input type="checkbox" class="rounded" id="compare-toggle"> Compare to previous
      </label>
      <button class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
        <i class="fas fa-download text-gray-500"></i> Export
      </button>
    </div>
    <div id="report-content" class="p-5"></div>
  </div>
</div>`;
  },

  renderReport() {
    const content = document.getElementById('report-content');
    if (!content) return;
    const r = this.activeReport;
    if (r === 'overview') this.renderOverview(content);
    else if (r === 'appointments') this.renderAppointments(content);
    else if (r === 'calls') this.renderCalls(content);
    else if (r === 'conversions') this.renderConversions(content);
    else if (r === 'revenue') this.renderRevenue(content);
    else if (r === 'leaderboard') this.renderLeaderboard(content);
    else if (r === 'attribution') this.renderAttribution(content);
    document.getElementById('report-title').textContent = {overview:'Overview',appointments:'Appointments',calls:'Calls',conversions:'Conversions',revenue:'Revenue',leaderboard:'Agent Leaderboard',attribution:'Attribution'}[r] || r;
  },

  renderOverview(container) {
    container.innerHTML = `
    <div class="grid grid-cols-5 gap-4 mb-6">
      ${[['Total Revenue','$47,230','green','fas fa-dollar-sign'],['Total Leads','142','blue','fas fa-user-plus'],['Appointments','38','purple','fas fa-calendar'],['Deals Won','24','green','fas fa-trophy'],['Avg Response','4.2h','orange','fas fa-clock']].map(([l,v,c,i])=>`
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-500">${l}</span>
          <i class="${i} text-${c}-400 text-xs"></i>
        </div>
        <div class="text-2xl font-bold text-gray-900">${v}</div>
      </div>`).join('')}
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
        <canvas id="r-revenue-chart" height="120"></canvas>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Leads by Source</h3>
        <canvas id="r-source-chart" height="120"></canvas>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div class="space-y-3">
          ${[['Leads Generated','142','100%','blue'],['Contacted','98','69%','indigo'],['Proposal Sent','52','37%','purple'],['Negotiation','31','22%','orange'],['Won','24','17%','green']].map(([l,v,pct,c])=>`
          <div class="flex items-center gap-3">
            <div class="w-28 text-xs text-gray-600 flex-shrink-0">${l}</div>
            <div class="flex-1 bg-gray-100 rounded-full h-5 relative">
              <div class="absolute inset-y-0 left-0 bg-${c}-500 rounded-full flex items-center justify-end pr-2" style="width:${pct}">
                <span class="text-white text-xs font-medium">${v}</span>
              </div>
            </div>
            <span class="text-xs text-gray-500 w-10 text-right">${pct}</span>
          </div>`).join('')}
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Appointments by Type</h3>
        <canvas id="r-appt-chart" height="160"></canvas>
      </div>
    </div>`;
    setTimeout(() => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const ctx1 = document.getElementById('r-revenue-chart');
      if (ctx1) new Chart(ctx1, { type:'line', data:{ labels:months, datasets:[{ data:[28000,32000,27000,35000,38000,42000,39000,44000,41000,47000,45000,47230], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.05)', fill:true, tension:0.4, borderWidth:2, pointRadius:3 }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:false,grid:{color:'#f3f4f6'},ticks:{callback:v=>'$'+v/1000+'k'}}, x:{grid:{display:false}} } } });
      const ctx2 = document.getElementById('r-source-chart');
      if (ctx2) new Chart(ctx2, { type:'doughnut', data:{ labels:['Facebook Ad','Google','Referral','Website','Other'], datasets:[{ data:[35,28,18,12,7], backgroundColor:['#3b82f6','#22c55e','#a855f7','#f97316','#94a3b8'], borderWidth:0 }] }, options:{ responsive:true, cutout:'60%', plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:12}}} } });
      const ctx3 = document.getElementById('r-appt-chart');
      if (ctx3) new Chart(ctx3, { type:'bar', data:{ labels:['Discovery Call','Strategy Session','Follow Up','Demo','Onboarding'], datasets:[{ data:[15,8,10,3,2], backgroundColor:['#3b82f6','#22c55e','#f97316','#a855f7','#06b6d4'], borderRadius:6, borderWidth:0 }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:true,grid:{color:'#f3f4f6'}}, x:{grid:{display:false}} } } });
    }, 50);
  },

  renderAppointments(container) {
    container.innerHTML = `
    <div class="grid grid-cols-4 gap-4 mb-6">
      ${[['Booked','38','blue'],['Showed','32','green'],['No-Show','4','red'],['Cancelled','2','gray']].map(([l,v,c])=>`
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-3xl font-bold text-${c}-600 mb-1">${v}</div>
        <div class="text-sm text-gray-500">${l}</div>
      </div>`).join('')}
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h3 class="font-semibold text-gray-900 mb-4">Appointments Over Time</h3>
      <canvas id="r-appt-time-chart" height="80"></canvas>
    </div>
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <h3 class="font-semibold text-gray-900 flex-1">Appointment Log</h3>
        <select class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"><option>All Types</option><option>Discovery Call</option><option>Strategy Session</option></select>
        <select class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"><option>All Status</option><option>Showed</option><option>No-Show</option><option>Cancelled</option></select>
      </div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50"><tr>${['Date','Contact','Type','Status','Assigned','Duration'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
        <tbody class="divide-y divide-gray-100">
          ${[['Jun 9','James Wilson','Discovery Call','Showed','Alice M.','32 min'],['Jun 9','Emma Rodriguez','Strategy Session','Showed','Bob K.','58 min'],['Jun 8','Michael Chen','Follow Up','No-Show','Carol T.','—'],['Jun 8','Sarah Johnson','Discovery Call','Showed','David R.','28 min'],['Jun 7','David Martinez','Demo','Cancelled','Alice M.','—'],].map(r=>`
          <tr class="hover:bg-gray-50">${r.map((v,i)=>`<td class="px-4 py-3 text-gray-700 ${i===3?`<span class="px-2 py-0.5 rounded-full text-xs font-medium ${v==='Showed'?'bg-green-100 text-green-700':v==='No-Show'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}">${v}</span>`:v}${i!==3?'</td>':''}`).join(i=>i===3?'':'')}</tr>`).join('')}
          ${[['Jun 9','James Wilson','Discovery Call','Showed','Alice M.','32 min'],['Jun 9','Emma Rodriguez','Strategy Session','Showed','Bob K.','58 min'],['Jun 8','Michael Chen','Follow Up','No-Show','Carol T.','—'],['Jun 8','Sarah Johnson','Discovery Call','Showed','David R.','28 min'],['Jun 7','David Martinez','Demo','Cancelled','Alice M.','—']].map(r=>`
          <tr class="hover:bg-gray-50">
            ${r.map((v,i)=>`<td class="px-4 py-3">${i===3?`<span class="px-2 py-0.5 rounded-full text-xs font-medium ${v==='Showed'?'bg-green-100 text-green-700':v==='No-Show'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}">${v}</span>`:v}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
    setTimeout(() => {
      const ctx = document.getElementById('r-appt-time-chart');
      if (ctx) new Chart(ctx, { type:'bar', data:{ labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets:[{ data:[4,7,5,8,9,3,2], backgroundColor:'#a855f7', borderRadius:6, borderWidth:0 }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:true,grid:{color:'#f3f4f6'}}, x:{grid:{display:false}} } } });
    }, 50);
  },

  renderCalls(container) {
    container.innerHTML = `
    <div class="grid grid-cols-4 gap-4 mb-6">
      ${[['Total Calls','247','blue'],['Answered','198','green'],['Missed','49','red'],['Avg Duration','4m 32s','purple']].map(([l,v,c])=>`
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-3xl font-bold text-${c}-600 mb-1">${v}</div>
        <div class="text-sm text-gray-500">${l}</div>
      </div>`).join('')}
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h3 class="font-semibold text-gray-900 mb-4">Calls Over Time</h3>
      <canvas id="r-calls-chart" height="80"></canvas>
    </div>`;
    setTimeout(() => {
      const ctx = document.getElementById('r-calls-chart');
      if (ctx) new Chart(ctx, { type:'line', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets:[{ label:'Answered', data:[180,210,195,230,215,240,225,250,235,260,245,247], borderColor:'#22c55e', tension:0.4, fill:false, borderWidth:2, pointRadius:3 },{ label:'Missed', data:[40,52,38,48,42,55,45,60,50,48,52,49], borderColor:'#ef4444', tension:0.4, fill:false, borderWidth:2, pointRadius:3 }] }, options:{ responsive:true, plugins:{legend:{position:'top'}}, scales:{ y:{beginAtZero:true,grid:{color:'#f3f4f6'}}, x:{grid:{display:false}} } } });
    }, 50);
  },

  renderConversions(container) {
    container.innerHTML = `
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        ${[['Leads','142','100%','#3b82f6'],['Contacted','98','69%','#6366f1'],['Proposal','52','37%','#a855f7'],['Negotiation','31','22%','#f97316'],['Won','24','17%','#22c55e'],['Lost','8','6%','#ef4444']].map(([l,v,pct,clr])=>`
        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1"><span class="text-gray-600">${l}</span><span class="font-semibold">${v} <span class="text-gray-400 font-normal">(${pct})</span></span></div>
          <div class="bg-gray-100 rounded-full h-3"><div class="h-3 rounded-full" style="width:${pct};background:${clr}"></div></div>
        </div>`).join('')}
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Conversion by Source</h3>
        <canvas id="r-conv-source-chart" height="200"></canvas>
      </div>
    </div>`;
    setTimeout(() => {
      const ctx = document.getElementById('r-conv-source-chart');
      if (ctx) new Chart(ctx, { type:'bar', data:{ labels:['Facebook Ad','Google','Referral','Website','Cold Outreach'], datasets:[{ label:'Leads', data:[50,40,25,17,10], backgroundColor:'rgba(59,130,246,0.5)', borderRadius:4 },{ label:'Won', data:[12,8,6,5,3], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:4 }] }, options:{ responsive:true, plugins:{legend:{position:'top'}}, scales:{ y:{beginAtZero:true,grid:{color:'#f3f4f6'}}, x:{grid:{display:false}} } } });
    }, 50);
  },

  renderRevenue(container) {
    container.innerHTML = `
    <div class="grid grid-cols-3 gap-4 mb-6">
      ${[['Total Revenue','$47,230','green'],['MRR','$9,450','blue'],['Avg Deal Size','$4,230','purple']].map(([l,v,c])=>`
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-3xl font-bold text-${c}-600 mb-1">${v}</div>
        <div class="text-sm text-gray-500">${l}</div>
      </div>`).join('')}
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <h3 class="font-semibold text-gray-900 mb-4">Revenue by Month</h3>
      <canvas id="r-rev-chart" height="80"></canvas>
    </div>
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="px-5 py-3 border-b border-gray-200"><h3 class="font-semibold text-gray-900">Top Deals</h3></div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50"><tr>${['Contact','Value','Stage','Close Date','Assigned'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">${h}</th>`).join('')}</tr></thead>
        <tbody class="divide-y divide-gray-100">
          ${[['Acme Corp','$48,500','Won','May 28','Alice M.'],['Global Inc','$32,000','Negotiation','Jun 15','Bob K.'],['StartupCo','$28,000','Proposal Sent','Jun 20','Carol T.'],['TechFirm','$25,500','Won','Jun 1','David R.'],['BigCorp','$22,000','Negotiation','Jun 25','Alice M.']].map(r=>`
          <tr class="hover:bg-gray-50">${r.map((v,i)=>`<td class="px-4 py-3 ${i===1?'font-bold text-green-700':i===2?'':'text-gray-700'}">${i===2?`<span class="px-2 py-0.5 rounded-full text-xs font-medium ${v==='Won'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}">${v}</span>`:v}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>`;
    setTimeout(() => {
      const ctx = document.getElementById('r-rev-chart');
      if (ctx) new Chart(ctx, { type:'bar', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets:[{ data:[28000,32000,27000,35000,38000,42000,39000,44000,41000,47000,45000,47230], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:6, borderWidth:0 }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ y:{beginAtZero:true,grid:{color:'#f3f4f6'},ticks:{callback:v=>'$'+v/1000+'k'}}, x:{grid:{display:false}} } } });
    }, 50);
  },

  renderLeaderboard(container) {
    container.innerHTML = `
    <div class="bg-white rounded-xl border border-gray-200">
      <div class="px-5 py-3 border-b border-gray-200"><h3 class="font-semibold text-gray-900">Agent Performance</h3></div>
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr><th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>${['Agent','Leads','Calls','Appointments','Deals Won','Revenue'].map(h=>`<th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-800">${h} <i class="fas fa-sort text-gray-300 text-xs"></i></th>`).join('')}</tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${[
            [1,'Alice M.',['blue','AM'],48,82,18,12,'$28,400'],
            [2,'Bob K.',['green','BK'],42,71,15,9,'$21,600'],
            [3,'Carol T.',['purple','CT'],36,65,12,7,'$18,200'],
            [4,'David R.',['orange','DR'],31,58,9,5,'$12,800'],
          ].map(([rank,name,[c,initials],...stats])=>`
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3"><span class="w-6 h-6 flex items-center justify-center rounded-full ${rank===1?'bg-yellow-100 text-yellow-700 font-bold':rank===2?'bg-gray-200 text-gray-600':'bg-gray-100 text-gray-500'} text-xs">${rank}</span></td>
            <td class="px-4 py-3"><div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-${c}-100 text-${c}-700 flex items-center justify-center text-xs font-bold">${initials}</div><span class="font-medium text-gray-800">${name}</span></div></td>
            ${stats.map(v=>`<td class="px-4 py-3 text-gray-700">${v}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  },

  renderAttribution(container) {
    container.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Revenue by Source</h3>
        <canvas id="r-attr-chart" height="200"></canvas>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <h3 class="font-semibold text-gray-900 mb-4">Source Performance</h3>
        <table class="w-full text-sm">
          <thead class="bg-gray-50 rounded"><tr>${['Source','Leads','Revenue','Conv Rate'].map(h=>`<th class="px-3 py-2 text-left text-xs font-semibold text-gray-500">${h}</th>`).join('')}</tr></thead>
          <tbody class="divide-y divide-gray-100">
            ${[['Facebook Ad','50','$19,800','24%'],['Google Ad','40','$15,200','20%'],['Referral','25','$10,500','28%'],['Website','17','$6,400','29%'],['Cold Outreach','10','$2,800','15%']].map(r=>`
            <tr class="hover:bg-gray-50">${r.map((v,i)=>`<td class="px-3 py-2 ${i===1||i===0?'text-gray-700':''}${i===2?'font-semibold text-green-700':''}${i===3?'text-blue-600 font-medium':''}">${v}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
    setTimeout(() => {
      const ctx = document.getElementById('r-attr-chart');
      if (ctx) new Chart(ctx, { type:'doughnut', data:{ labels:['Facebook Ad','Google Ad','Referral','Website','Cold Outreach'], datasets:[{ data:[19800,15200,10500,6400,2800], backgroundColor:['#3b82f6','#22c55e','#a855f7','#f97316','#94a3b8'], borderWidth:0 }] }, options:{ responsive:true, cutout:'55%', plugins:{legend:{position:'right',labels:{font:{size:11},boxWidth:12,formatter:(v,ctx)=>v+': $'+(ctx.chart.data.datasets[0].data[ctx.dataIndex]/1000).toFixed(0)+'k'}}} } });
    }, 50);
  },

  bindEvents() {
    document.querySelectorAll('.report-sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeReport = btn.dataset.report;
        document.querySelectorAll('.report-sidebar-btn').forEach(b => {
          b.className = `report-sidebar-btn w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 text-gray-700 ${b.dataset.report===this.activeReport?'bg-blue-50 text-blue-700 font-medium':''}`;
        });
        this.renderReport();
      });
    });

    document.querySelectorAll('.range-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.dateRange = btn.dataset.range;
        document.querySelectorAll('.range-btn').forEach(b => {
          b.className = `range-btn px-3 py-1 text-xs rounded-md font-medium ${b.dataset.range===this.dateRange?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`;
        });
        this.renderReport();
      });
    });
  }
};
