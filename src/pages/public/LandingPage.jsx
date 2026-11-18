import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  BarChart3,
  ShieldCheck,
  Egg,
  Wheat,
  Syringe,
  Wallet,
  Bot,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Batch & FCR Intelligence',
    desc: 'Track Broilers, Layers, Cockerels, and Turkeys with automated Feed Conversion Ratio (FCR) and survival analytics.',
  },
  {
    icon: Wheat,
    title: 'Real-Time Feed Inventory',
    desc: 'Automatically deduct daily feed rations from stock, monitor weighted-average feed cost, and get low-stock alerts.',
  },
  {
    icon: Egg,
    title: 'Layer & Egg Production',
    desc: 'Compute accurate Hen-Day production percentages, track cracked/broken losses, and manage saleable crate inventory.',
  },
  {
    icon: Syringe,
    title: 'Vaccination & Health Calendar',
    desc: 'Never miss Lasota, Gumboro, or booster schedules with automated In-App, Email, and WhatsApp reminders.',
  },
  {
    icon: Wallet,
    title: 'Farm Accounting & Receipts',
    desc: 'Separate cash collected from credit sales, generate printable receipts, and track true net profit per batch.',
  },
  {
    icon: Bot,
    title: 'Smart Farm Assistant',
    desc: 'Ask natural questions about your flock mortality, weekly feed intake, or profit margins backed by live farm data.',
  },
];

const PLANS = [
  {
    name: 'Free Starter',
    monthly: '₦0',
    annual: '₦0',
    desc: 'For small-scale farms getting digitized.',
    features: ['1 Poultry Farm', 'Up to 2 Active Batches', 'Daily Feeding & Mortality Logs', 'Basic Dashboard'],
  },
  {
    name: 'Starter Farm',
    monthly: '₦5,000',
    annual: '₦50,000',
    desc: 'Complete feed stock & financial ledger.',
    features: ['1 Poultry Farm', 'Up to 6 Active Batches', '2 Farm Worker Accounts', 'Feed Inventory & Financial Ledger'],
  },
  {
    name: 'Professional',
    monthly: '₦15,000',
    annual: '₦150,000',
    popular: true,
    desc: 'Built for commercial poultry operations.',
    features: [
      'Up to 3 Poultry Farms',
      '25 Active Batches per Farm',
      '10 Workers with Role Permissions',
      'PDF & Excel Report Exports',
      'AI Smart Farm Assistant',
    ],
  },
  {
    name: 'Enterprise',
    monthly: '₦45,000',
    annual: '₦450,000',
    desc: 'Multi-location agribusinesses & hatcheries.',
    features: ['Unlimited Farms & Batches', '100 Staff Accounts', 'Advanced Multi-Site Analytics', 'Priority Account Support'],
  },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-brand-text">
      {/* 1. Navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-brand-dark">PoultryPro</span>
              <span className="hidden text-[11px] font-medium text-brand-primary sm:block">
                Smart Farming. Higher Profits.
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#features" className="hover:text-brand-primary">Features</a>
            <a href="#how-it-works" className="hover:text-brand-primary">How It Works</a>
            <a href="#pricing" className="hover:text-brand-primary">Pricing</a>
            <a href="#faq" className="hover:text-brand-primary">FAQ</a>
            <a href="#contact" className="hover:text-brand-primary">Contact</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
            >
              Get Started Free
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <hr />
              <Link to="/login" className="py-1 font-semibold text-brand-dark">Sign In</Link>
              <Link to="/register" className="rounded-lg bg-brand-primary py-2.5 text-center font-semibold text-white">
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section & 7. Live Dashboard Preview */}
      <section className="bg-gradient-to-b from-brand-light/70 via-white to-white pt-14 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1.5 text-xs font-semibold text-brand-dark">
              <ShieldCheck className="h-4 w-4 text-brand-primary" />
              Built for Broiler, Layer, Cockerel & Turkey Farms
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Manage Your Poultry Farm Smarter.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Track your birds, monitor production, manage expenses, and grow your poultry business with one
              intelligent platform.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-7 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-dark"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 hover:bg-gray-50"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard UI Mock Preview */}
          <div className="mt-14 rounded-2xl border border-gray-200 bg-brand-bg p-4 shadow-xl sm:p-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">Active Flock Population</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-dark">12,480 Birds</p>
                <span className="mt-1 inline-block text-xs font-semibold text-brand-primary">98.4% Survival Rate</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">Today&apos;s Egg Collection</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-dark">342 Crates</p>
                <span className="mt-1 inline-block text-xs font-semibold text-brand-primary">86.2% Hen-Day Rate</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">Broiler Batch #B4 FCR</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-dark">1.64</p>
                <span className="mt-1 inline-block text-xs font-semibold text-brand-primary">Optimal Feed Efficiency</span>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-medium text-gray-500">30-Day Net Profit</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-primary">₦2,840,500</p>
                <span className="mt-1 inline-block text-xs text-gray-500">Verified Cash & Receivables</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3, 4 & 6. Product Introduction & Key Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
              Everything You Need to Run a Profitable Poultry Operation
            </h2>
            <p className="mt-3 text-gray-600">
              Replace scattered paper notebooks and spreadsheets with automated flock calculations, worker
              accountability, and instant financial clarity.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-brand-bg/60 p-6 transition hover:border-brand-primary/40 hover:bg-white hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-brand-dark">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="bg-brand-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">How PoultryPro Works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Set Up Your Farm & Batches', desc: 'Create your farm profile, configure poultry houses, and stock your Broiler, Layer, Cockerel, or Turkey batches.' },
              { step: '02', title: 'Log Daily Pen Operations', desc: 'Workers record feed rations, water intake, mortality, and egg crates from any smartphone in seconds.' },
              { step: '03', title: 'Track FCR, Sales & Net Profit', desc: 'Monitor real-time stock levels, vaccination alerts, customer balances, and export PDF/Excel reports.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl bg-white/10 p-6">
                <span className="text-sm font-extrabold text-brand-light">STEP {item.step}</span>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Pricing Plans */}
      <section id="pricing" className="py-20 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">Transparent SaaS Pricing</h2>
            <p className="mt-2 text-gray-600">Start free and upgrade seamlessly via Paystack as your flock grows.</p>
            <div className="mt-6 inline-flex rounded-xl border border-gray-200 bg-white p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${!annual ? 'bg-brand-primary text-white' : 'text-gray-600'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${annual ? 'bg-brand-primary text-white' : 'text-gray-600'}`}
              >
                Annual (2 Months Free)
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ${
                  plan.popular ? 'ring-2 ring-brand-primary' : 'border border-gray-200'
                }`}
              >
                <div>
                  {plan.popular && (
                    <span className="mb-3 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-primary">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-brand-dark">{plan.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{plan.desc}</p>
                  <p className="mt-4 text-3xl font-extrabold text-brand-dark">
                    {annual ? plan.annual : plan.monthly}
                    <span className="text-xs font-normal text-gray-500">/{annual ? 'yr' : 'mo'}</span>
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/register"
                  className={`mt-8 block rounded-xl py-2.5 text-center text-sm font-semibold ${
                    plan.popular
                      ? 'bg-brand-primary text-white hover:bg-brand-dark'
                      : 'bg-brand-light text-brand-dark hover:bg-brand-primary hover:text-white'
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ & 10. Contact */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-brand-dark">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: 'Can I manage both Broilers and Layers on the same farm?',
                a: 'Yes. PoultryPro automatically applies Feed Conversion Ratio (FCR) calculations to meat birds (Broilers, Cockerels, Turkeys) and Hen-Day egg production percentage to Layer batches.',
              },
              {
                q: 'Can my farm attendants record daily data without seeing my financial profit?',
                a: 'Yes. Farm Owners assign granular module permissions to each worker so attendants only see feeding, water, mortality, or egg collection forms.',
              },
              {
                q: 'Does PoultryPro work on mobile phones inside the poultry house?',
                a: 'Yes. PoultryPro is built mobile-first with touch-friendly quick entry modals and responsive tables.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-brand-dark">{item.q}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>

          <div id="contact" className="mt-16 rounded-2xl bg-brand-light p-8 text-center">
            <h3 className="text-2xl font-bold text-brand-dark">Need Enterprise Onboarding or Support?</h3>
            <p className="mt-2 text-sm text-gray-700">
              Reach our agricultural technology team at <strong>support@poultrypro.ng</strong> or call +234 800 POULTRY.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} PoultryPro Technologies. Smart Farming. Better Production. Higher Profits.</p>
      </footer>
    </div>
  );
}