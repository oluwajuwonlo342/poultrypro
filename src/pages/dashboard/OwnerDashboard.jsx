import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bird,
  Skull,
  Wheat,
  Egg,
  Wallet,
  TrendingUp,
  Syringe,
  AlertTriangle,
  Plus,
  Bot,
  RefreshCw,
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
  const [error, setError] = useState('');

  // Smart Farm Assistant state
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  const fetchDashboard = () => {
    if (!activeFarm?._id) return;
    setLoading(true);
    setError('');
    api
      .get(`/finance/dashboard?range=${range}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load dashboard telemetry. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, [activeFarm?._id, range]);

  const handleAskAssistant = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    try {
      const res = await api.post('/assistant/ask', { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer(err.response?.data?.message || 'Unable to reach Smart Farm Assistant right now.');
    } finally {
      setAsking(false);
    }
  };

  if (!activeFarm) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-gray-700">No active farm selected.</p>
        <Link
          to="/dashboard/farms"
          className="mt-3 inline-block rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark"
        >
          Manage My Farms
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white p-5 shadow-sm" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-600">{error || 'No dashboard data available.'}</p>
        <button
          onClick={fetchDashboard}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Loading
        </button>
      </div>
    );
  }

  const { kpis, charts, alerts } = data;

  const kpiCards = [
    {
      label: 'Total Live Birds',
      value: (kpis?.totalLiveBirds ?? 0).toLocaleString(),
      sub: `${kpis?.activeBatchesCount ?? 0} active batches`,
      icon: Bird,
      color: 'bg-brand-light text-brand-primary',
      show: true,
    },
    {
      label: 'Period Mortality',
      value: `${(kpis?.periodMortality ?? 0).toLocaleString()} birds`,
      sub: `${kpis?.mortalityRatePct ?? 0}% mortality rate`,
      icon: Skull,
      color: 'bg-red-50 text-red-600',
      show: true,
    },
    {
      label: 'Feed Stock Remaining',
      value: `${(kpis?.totalFeedStockKg ?? 0).toLocaleString()} kg`,
      sub: `${(kpis?.periodFeedUsedKg ?? 0).toLocaleString()} kg used in period`,
      icon: Wheat,
      color: 'bg-amber-50 text-amber-600',
      show: true,
    },
    {
      label: 'Egg Stock Available',
      value: `${(kpis?.cratesAvailable ?? 0).toLocaleString()} crates`,
      sub: `${(kpis?.eggStockAvailable ?? 0).toLocaleString()} individual eggs`,
      icon: Egg,
      color: 'bg-yellow-50 text-yellow-700',
      show: true,
    },
    {
      label: 'Period Revenue',
      value: `₦${(kpis?.totalRevenue ?? 0).toLocaleString()}`,
      sub: `Collected: ₦${(kpis?.collectedRevenue ?? 0).toLocaleString()}`,
      icon: Wallet,
      color: 'bg-emerald-50 text-emerald-700',
      show: hasPermission('viewFinancials'),
    },
    {
      label: 'Period Expenses',
      value: `₦${(kpis?.totalExpenses ?? 0).toLocaleString()}`,
      sub: 'Feed, chicks, meds & labour',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      show: hasPermission('viewFinancials'),
    },
    {
      label: 'Estimated Net Profit',
      value: `₦${(kpis?.netProfit ?? 0).toLocaleString()}`,
      sub: (kpis?.netProfit ?? 0) >= 0 ? 'Positive operating margin' : 'Operating deficit',
      icon: TrendingUp,
      color: (kpis?.netProfit ?? 0) >= 0 ? 'bg-brand-light text-brand-dark' : 'bg-red-50 text-red-600',
      show: hasPermission('viewFinancials'),
    },
    {
      label: 'Upcoming Vaccines',
      value: alerts?.upcomingVaccinations?.length || 0,
      sub: 'Scheduled next 7 days',
      icon: Syringe,
      color: 'bg-blue-50 text-blue-600',
      show: true,
    },
  ].filter((c) => c.show);

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">{activeFarm.name}</h1>
          <p className="text-xs text-gray-500">
            {activeFarm.location} • {activeFarm.farmType} Farm Overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-brand-primary focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <Link
            to="/dashboard/records"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Log Daily Record
          </Link>

          <button
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-dark px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-primary"
          >
            <Bot className="h-4 w-4" /> Smart Farm Assistant
          </button>
        </div>
      </div>

      {/* Smart Farm Assistant Drawer */}
      {assistantOpen && (
        <div className="rounded-2xl border border-brand-primary/30 bg-white p-5 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
              <Bot className="h-5 w-5 text-brand-primary" /> PoultryPro Smart Farm Assistant
            </h2>
            <button onClick={() => setAssistantOpen(false)} className="text-xs text-gray-400 hover:text-gray-700">
              Close
            </button>
          </div>
          <form onSubmit={handleAskAssistant} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask e.g. 'How many birds do I currently have?' or 'Compare my active batches'"
              className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:border-brand-primary focus:outline-none"
            />
            <button
              type="submit"
              disabled={asking}
              className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {asking ? 'Analyzing...' : 'Ask'}
            </button>
          </form>
          {answer && (
            <div className="mt-3 whitespace-pre-line rounded-xl bg-brand-light/70 p-3.5 text-xs leading-relaxed text-brand-dark">
              {answer}
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Grid */}
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-brand-dark">Feed Consumption Trend (kg)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.feedTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="totalFeedKg"
                  stroke="#198754"
                  fill="#EAF7EF"
                  strokeWidth={2}
                  name="Feed (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-brand-dark">Daily Egg Production (Good vs Cracked)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.eggTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="goodEggs" fill="#198754" radius={[4, 4, 0, 0]} name="Good Eggs" />
                <Bar dataKey="crackedEggs" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Cracked Eggs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Alerts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Feed Stock Alerts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Feed Inventory Alerts
          </h3>
          {(alerts?.lowStockFeeds || []).length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">All feed stocks are currently above threshold levels.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {alerts.lowStockFeeds.map((f) => (
                <li key={f._id} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <p className="font-bold text-gray-800">{f.productName}</p>
                    <p className="text-gray-500">Alert threshold: {f.lowStockThresholdKg} kg</p>
                  </div>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 font-bold text-red-600">
                    {f.currentStockKg} kg left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming Vaccinations */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-dark">
            <Syringe className="h-4 w-4 text-blue-600" /> Upcoming Vaccination Schedule
          </h3>
          {(alerts?.upcomingVaccinations || []).length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">No pending vaccinations scheduled in the next 7 days.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {alerts.upcomingVaccinations.map((v) => (
                <li key={v._id} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <p className="font-bold text-gray-800">{v.vaccineName}</p>
                    <p className="text-gray-500">
                      Batch: {v.batch?.batchName} ({v.batch?.batchCode})
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                    {new Date(v.scheduledDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}