import { useState, useEffect } from 'react';
import {
  Bird,
  Skull,
  Wheat,
  Droplets,
  Egg,
  Wallet,
  TrendingUp,
  Syringe,
  AlertTriangle,
  Bot,
  Send,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function OwnerDashboard() {
  const { activeFarm, hasPermission } = useFarm();
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Smart Farm Assistant Drawer state
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! Ask me anything about your live bird count, mortality rate, weekly feed intake, egg production, or upcoming vaccinations.',
    },
  ]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!activeFarm?._id) return;
    setLoading(true);
    api
      .get(`/finance/dashboard?range=${range}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [activeFarm?._id, range]);

  const handleAskAssistant = async (e) => {
    e.preventDefault();
    if (!question.trim() || asking) return;
    const userQ = question.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userQ }]);
    setQuestion('');
    setAsking(true);

    try {
      const res = await api.post('/assistant/ask', { question: userQ });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: err.response?.data?.message || 'Unable to query farm records right now.' },
      ]);
    } finally {
      setAsking(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white p-5 shadow-sm" />
        ))}
      </div>
    );
  }

  const { summary, charts, widgets } = data;
  const canSeeFinance = hasPermission('viewFinancials');

  const kpiCards = [
    { label: 'Total Live Birds', value: summary.totalBirds.toLocaleString(), sub: `${summary.activeBatchesCount} Active Batches`, icon: Bird, color: 'text-brand-primary bg-brand-light' },
    { label: "Today's Mortality", value: summary.todaysMortality.toLocaleString(), sub: 'Birds lost today', icon: Skull, color: 'text-red-600 bg-red-50' },
    { label: "Today's Feed Intake", value: `${summary.todaysFeedKg} kg`, sub: 'Deducted from stock', icon: Wheat, color: 'text-amber-700 bg-amber-50' },
    { label: "Today's Water", value: `${summary.todaysWaterLitres} L`, sub: 'Daily consumption', icon: Droplets, color: 'text-blue-600 bg-blue-50' },
    { label: "Today's Eggs", value: summary.todaysEggs.toLocaleString(), sub: `${Math.floor(summary.todaysEggs / 30)} Crates`, icon: Egg, color: 'text-orange-600 bg-orange-50' },
    { label: 'Upcoming Vaccines', value: summary.upcomingVaccinationsCount, sub: 'Next 7 days', icon: Syringe, color: 'text-purple-600 bg-purple-50' },
    ...(canSeeFinance
      ? [
          { label: 'Period Revenue', value: `₦${summary.totalRevenue.toLocaleString()}`, sub: `₦${summary.cashReceived.toLocaleString()} Cash Collected`, icon: Wallet, color: 'text-brand-primary bg-brand-light' },
          { label: 'Estimated Net Profit', value: `₦${summary.netProfit.toLocaleString()}`, sub: `Expenses: ₦${summary.totalExpenses.toLocaleString()}`, icon: TrendingUp, color: summary.netProfit >= 0 ? 'text-brand-dark bg-brand-light' : 'text-red-600 bg-red-50' },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header & Date Filter */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">{activeFarm?.name} Overview</h1>
          <p className="text-sm text-gray-500">{activeFarm?.location} • Live Operational Telemetry</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '3 Months' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setRange(btn.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                range === btn.id ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-brand-light'
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={() => setAssistantOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-dark px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-primary"
          >
            <Bot className="h-4 w-4" /> Smart Farm Assistant
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">{card.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-brand-dark">Daily Feed Consumption (kg) & Mortality</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.dailyOperations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="feedKg" name="Feed (kg)" stroke="#198754" fill="#EAF7EF" strokeWidth={2} />
                <Area type="monotone" dataKey="mortality" name="Mortality" stroke="#dc2626" fill="#fee2e2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-brand-dark">Batch Population Comparison</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.batchComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="population" name="Live Birds" fill="#198754" radius={[6, 6, 0, 0]} />
                <Bar dataKey="mortality" name="Total Lost" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts & Activity Panels */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Low Feed Stock Alerts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Inventory Alerts
          </h3>
          {widgets.lowStockFeeds.length === 0 ? (
            <p className="mt-4 text-xs text-gray-500">All feed stocks are above minimum thresholds.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {widgets.lowStockFeeds.map((feed) => (
                <li key={feed._id} className="flex items-center justify-between rounded-xl bg-amber-50 p-3 text-xs">
                  <span className="font-semibold text-amber-900">{feed.productName}</span>
                  <span className="font-bold text-red-600">{feed.currentStockKg} kg left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Vaccinations */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
            <Syringe className="h-4 w-4 text-brand-primary" /> Upcoming Vaccinations
          </h3>
          {widgets.upcomingVaccinations.length === 0 ? (
            <p className="mt-4 text-xs text-gray-500">No vaccinations scheduled in the next 7 days.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {widgets.upcomingVaccinations.map((v) => (
                <li key={v._id} className="rounded-xl bg-brand-light/70 p-3 text-xs">
                  <p className="font-bold text-brand-dark">{v.vaccineName}</p>
                  <p className="text-gray-600">
                    {v.batch?.batchName} • {new Date(v.scheduledDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Farm Activities */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-brand-dark">Recent Farm Activities</h3>
          <ul className="mt-3 space-y-2.5">
            {widgets.recentActivities.slice(0, 5).map((act) => (
              <li key={act._id} className="border-b border-gray-100 pb-2 text-xs last:border-none">
                <p className="font-semibold capitalize text-gray-800">
                  {act.recordType} — {act.batch?.batchName}
                </p>
                <p className="text-gray-500">
                  By {act.recordedBy?.fullName} • {new Date(act.recordDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Smart Farm Assistant Slide-Over Drawer */}
      {assistantOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b bg-brand-dark px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-bold">PoultryPro Smart Assistant</span>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="rounded-lg p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-brand-primary text-white'
                      : 'bg-brand-bg text-gray-800 border border-gray-200'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {asking && <p className="text-xs text-gray-400">Analyzing live farm records...</p>}
            </div>

            <form onSubmit={handleAskAssistant} className="flex gap-2 border-t p-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How many birds do I have?"
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-brand-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={asking}
                className="rounded-xl bg-brand-primary px-4 py-2 text-white hover:bg-brand-dark"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}