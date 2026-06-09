const DashboardModule = {
  charts: {},
  init(container) {
    container.innerHTML = this.render();
    this.initCharts();
    this.bindEvents();
  },
  render() {
    return `
<div class="p-6 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
    </div>
    <div class="flex gap-3">
      <select id="dash-range" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="3months">Last 3 Months</option>
        <option value="6months">Last 6 Months</option>
        <option value="year">This Year</option>
      </select>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
        <i class="fas fa-download"></i> Export
      </button>
    </div>
  </div>

  <!-- KPI Cards Row 1 -->
  <div class="grid grid-cols-4 gap-4">
    ${this.kpiCard('Total Revenue','$47,230','+12.5%','up','fas fa-dollar-sign','blue')}
    ${this.kpiCard('New Leads','142','+8.3%','up','fas fa-user-plus','green')}
    ${this.kpiCard('Appointments','38','+5.2%','up','fas fa-calendar-check','purple')}
    ${this.kpiCard('Conversion Rate','24.3%','+2.1%','up','fas fa-chart-line','orange')}
  </div>

  <!-- KPI Cards Row 2 -->
  <div class="grid grid-cols-3 gap-4">
    ${this.kpiCard2('Pipeline Value','$186,500','Across all stages','fas fa-funnel-dollar','indigo')}
    ${this.kpiCard2('Avg Deal Size','$4,230','Per closed deal','fas fa-handshake','teal')}
    ${this.kpiCard2('Active Contacts','1,247','Total in CRM','fas fa-users','pink')}
  </div>

  <!-- Charts Row -->
  <div class="grid grid-cols-3 gap-4">
    <!-- Revenue Chart (2/3 width) -->
    <div class="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900">Revenue Overview</h3>
        <div class="flex gap-2">
          <button data-chart="revenue" class="chart-toggle-btn active-toggle px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">Revenue</button>
          <button data-chart="leads" class="chart-toggle-btn px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Leads</button>
          <button data-chart="appointments" class="chart-toggle-btn px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200">Appointments</button>
        </div>
      </div>
      <canvas id="revenueChart" height="100"></canvas>
    </div>
    <!-- Leads by Source -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="font-semibold text-gray-900 mb-4">Leads by Source</h3>
      <canvas id="sourceChart" height="180"></canvas>
      <div class="mt-3 space-y-1">
        ${[['Facebook Ad','35%','blue'],['Google','28%','green'],['Referral','18%','purple'],['Website','12%','orange'],['Other','7%','gray']].map(([l,v,c])=>`
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-${c}-500"></span><span class="text-gray-600">${l}</span></div>
          <span class="font-medium text-gray-800">${v}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Pipeline + Activity Row -->
  <div class="grid grid-cols-3 gap-4">
    <!-- Pipeline Distribution -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h3 class="font-semibold text-gray-900 mb-4">Pipeline Stages</h3>
      <canvas id="pipelineChart" height="200"></canvas>
    </div>
    <!-- Recent Activity -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900">Recent Activity</h3>
        <a href="#" class="text-blue-600 text-xs hover:underline">View All</a>
      </div>
      <div class="space-y-3">
        ${this.activityItems()}
      </div>
    </div>
    <!-- Upcoming Appointments -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900">Upcoming</h3>
        <button class="text-blue-600 text-xs hover:underline">+ Add</button>
      </div>
      <div class="space-y-3">
        ${this.upcomingAppointments()}
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div class="flex gap-3 flex-wrap">
      ${[['Add Contact','fas fa-user-plus','blue','contacts'],['New Opportunity','fas fa-star','green','pipeline'],['Schedule Appointment','fas fa-calendar-plus','purple','calendar'],['Send Campaign','fas fa-paper-plane','orange','campaigns'],['Create Workflow','fas fa-project-diagram','indigo','workflows']].map(([l,i,c,s])=>`
      <button onclick="window.GHL.navigate('${s}')" class="flex items-center gap-2 px-4 py-2 bg-${c}-50 text-${c}-700 rounded-lg text-sm font-medium hover:bg-${c}-100 border border-${c}-200">
        <i class="${i}"></i>${l}
      </button>`).join('')}
    </div>
  </div>
</div>`;
  },

  kpiCard(title, value, change, dir, icon, color) {
    const up = dir === 'up';
    return `
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-gray-500 text-sm font-medium">${title}</span>
        <div class="w-9 h-9 bg-${color}-100 rounded-lg flex items-center justify-center">
          <i class="${icon} text-${color}-600 text-sm"></i>
        </div>
      </div>
      <div class="text-2xl font-bold text-gray-900">${value}</div>
      <div class="flex items-center gap-1 mt-1">
        <i class="fas fa-arrow-${up?'up':'down'} text-${up?'green':'red'}-500 text-xs"></i>
        <span class="text-${up?'green':'red'}-600 text-xs font-medium">${change}</span>
        <span class="text-gray-400 text-xs">vs last month</span>
      </div>
    </div>`;
  },

  kpiCard2(title, value, sub, icon, color) {
    return `
    <div class="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div class="w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="${icon} text-${color}-600 text-lg"></i>
      </div>
      <div>
        <div class="text-2xl font-bold text-gray-900">${value}</div>
        <div class="text-sm font-medium text-gray-700">${title}</div>
        <div class="text-xs text-gray-400">${sub}</div>
      </div>
    </div>`;
  },

  activityItems() {
    const items = [
      {icon:'fas fa-user-plus',color:'blue',text:'<b>John Smith</b> added as new contact',time:'2m ago'},
      {icon:'fas fa-arrow-right',color:'green',text:'<b>Sarah Johnson</b> moved to Proposal',time:'15m ago'},
      {icon:'fas fa-calendar',color:'purple',text:'<b>Mike Davis</b> booked a Discovery Call',time:'32m ago'},
      {icon:'fas fa-envelope',color:'orange',text:'Campaign "Summer Promo" sent to 234 contacts',time:'1h ago'},
      {icon:'fas fa-trophy',color:'yellow',text:'Deal with <b>Acme Corp</b> marked Won - $8,500',time:'2h ago'},
      {icon:'fas fa-comment',color:'teal',text:'New SMS reply from <b>Lisa Chen</b>',time:'3h ago'},
      {icon:'fas fa-star',color:'pink',text:'<b>Robert Brown</b> tagged as Hot Lead',time:'4h ago'},
    ];
    return items.map(a=>`
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 bg-${a.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <i class="${a.icon} text-${a.color}-600" style="font-size:10px"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-700">${a.text}</p>
        <span class="text-xs text-gray-400">${a.time}</span>
      </div>
    </div>`).join('');
  },

  upcomingAppointments() {
    const appts = [
      {name:'James Wilson',type:'Discovery Call',time:'10:00 AM',color:'blue'},
      {name:'Emma Rodriguez',type:'Strategy Session',time:'11:30 AM',color:'green'},
      {name:'Chris Lee',type:'Follow Up',time:'2:00 PM',color:'orange'},
      {name:'Anna Martinez',type:'Discovery Call',time:'3:30 PM',color:'blue'},
      {name:'Tom Baker',type:'Strategy Session',time:'Tomorrow 9AM',color:'green'},
    ];
    return appts.map(a=>`
    <div class="flex items-center gap-3">
      <div class="w-1 h-10 bg-${a.color}-500 rounded-full flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-800 truncate">${a.name}</p>
        <p class="text-xs text-gray-400">${a.type} · ${a.time}</p>
      </div>
      <button class="text-xs text-blue-600 hover:underline">Join</button>
    </div>`).join('');
  },

  initCharts() {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const revenue = [28000,32000,27000,35000,38000,42000,39000,44000,41000,47000,45000,47230];
    const leads = [85,92,78,105,118,132,124,140,128,145,138,142];
    const appointments = [22,28,19,31,35,40,37,42,39,44,40,38];

    const ctx1 = document.getElementById('revenueChart');
    if (ctx1) {
      this.charts.revenue = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Revenue ($)',
            data: revenue,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4,
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: false, grid: { color: '#f3f4f6' }, ticks: { callback: v => '$'+v.toLocaleString() } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const ctx2 = document.getElementById('sourceChart');
    if (ctx2) {
      this.charts.source = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Facebook Ad','Google','Referral','Website','Other'],
          datasets: [{ data: [35,28,18,12,7], backgroundColor: ['#3b82f6','#22c55e','#a855f7','#f97316','#94a3b8'], borderWidth: 0 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, cutout: '65%' }
      });
    }

    const ctx3 = document.getElementById('pipelineChart');
    if (ctx3) {
      this.charts.pipeline = new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: ['New Lead','Contacted','Proposal','Negotiation','Won'],
          datasets: [{ data: [42000,38000,56000,28000,22500], backgroundColor: ['#dbeafe','#bfdbfe','#93c5fd','#60a5fa','#22c55e'], borderRadius: 6, borderWidth: 0 }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { display: false }, ticks: { callback: v => '$'+v/1000+'k' } },
            y: { grid: { display: false } }
          }
        }
      });
    }
  },

  bindEvents() {
    document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-toggle-btn').forEach(b => {
          b.className = 'chart-toggle-btn px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200';
        });
        btn.className = 'chart-toggle-btn active-toggle px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium';
        const type = btn.dataset.chart;
        const data = {
          revenue: [28000,32000,27000,35000,38000,42000,39000,44000,41000,47000,45000,47230],
          leads: [85,92,78,105,118,132,124,140,128,145,138,142],
          appointments: [22,28,19,31,35,40,37,42,39,44,40,38]
        };
        const colors = { revenue: '#3b82f6', leads: '#22c55e', appointments: '#a855f7' };
        if (this.charts.revenue) {
          this.charts.revenue.data.datasets[0].data = data[type];
          this.charts.revenue.data.datasets[0].borderColor = colors[type];
          this.charts.revenue.data.datasets[0].backgroundColor = colors[type].replace(')',',0.08)').replace('rgb','rgba');
          this.charts.revenue.update();
        }
      });
    });
  }
};
