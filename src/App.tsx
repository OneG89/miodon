import { HashRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { BookOpen, CalendarDays, ClipboardList, ShieldAlert, UserRound } from 'lucide-react';
import { Onboarding } from './pages/Onboarding';
import { CalendarPage } from './pages/CalendarPage';
import { LibraryPage } from './pages/LibraryPage';
import { VaccineDetailPage } from './pages/VaccineDetailPage';
import { ComparePage } from './pages/ComparePage';
import { ComparePlansPage } from './pages/ComparePlansPage';
import { RecordsPage } from './pages/RecordsPage';
import { ProfilePage } from './pages/ProfilePage';
import { PlanPage } from './pages/PlanPage';
import { ConditionsPage } from './pages/ConditionsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { listChildren } from './lib/storage';

const NAV_ITEMS = [
  { to: '/', label: '接种日历', icon: CalendarDays, end: true },
  { to: '/library', label: '疫苗库', icon: BookOpen, end: false },
  { to: '/records', label: '接种记录', icon: ClipboardList, end: false },
  { to: '/me', label: '我的', icon: UserRound, end: false },
];

/** 桌面端左侧固定导航栏（lg 以上显示） */
function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-stone-200 bg-white px-4 py-6 z-40">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xl font-bold">
          苗
        </div>
        <div>
          <p className="font-bold text-lg leading-tight">苗懂</p>
          <p className="text-xs text-stone-400 leading-tight">Miodon · 宝宝疫苗助手</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-600' : 'text-stone-500 hover:bg-stone-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex gap-2 rounded-xl bg-stone-50 p-3 text-[11px] leading-relaxed text-stone-400">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <p>数据仅供参考，不在线问诊、不售卖疫苗，接种以门诊评估和说明书为准。</p>
      </div>
    </aside>
  );
}

/** 移动端底部 Tab 栏（lg 以下显示） */
function TabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-stone-200 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 text-xs ${
                isActive ? 'text-brand-600 font-medium' : 'text-stone-400'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/** 无档案时强制进入建档页 */
function RequireChild({ children }: { children: React.ReactNode }) {
  if (listChildren().length === 0) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Sidebar />
      <main className="min-h-screen lg:pl-60">
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-28 lg:px-10 lg:pt-8 lg:pb-12">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<RequireChild><CalendarPage /></RequireChild>} />
            <Route path="/library" element={<RequireChild><LibraryPage /></RequireChild>} />
            <Route path="/vaccine/:id" element={<RequireChild><VaccineDetailPage /></RequireChild>} />
            <Route path="/compare" element={<RequireChild><ComparePage /></RequireChild>} />
            <Route path="/compare-plans" element={<RequireChild><ComparePlansPage /></RequireChild>} />
            <Route path="/plan" element={<RequireChild><PlanPage /></RequireChild>} />
            <Route path="/conditions" element={<ConditionsPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/records" element={<RequireChild><RecordsPage /></RequireChild>} />
            <Route path="/me" element={<RequireChild><ProfilePage /></RequireChild>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <TabBar />
    </HashRouter>
  );
}
