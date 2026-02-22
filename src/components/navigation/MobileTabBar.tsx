import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, ShoppingBag, User } from 'lucide-react';

const tabs = [
  { label: '首页', href: '/', icon: Home },
  { label: '社区', href: '/community', icon: Users },
  { label: '计划', href: '/plans', icon: ClipboardList },
  { label: '商城', href: '/shop', icon: ShoppingBag },
  { label: '我的', href: '/profile', icon: User },
];

const activeGroups: Record<string, string[]> = {
  '/': ['/', '/knowledge', '/diet', '/search', '/features'],
  '/community': ['/community'],
  '/plans': ['/plans', '/records', '/calendar', '/statistics', '/body', '/ai'],
  '/shop': ['/shop'],
  '/profile': ['/profile', '/settings'],
};

export function MobileTabBar() {
  const location = useLocation();

  const isActive = (href: string) => {
    const matches = activeGroups[href] || [href];
    return matches.some((path) => location.pathname === path || location.pathname.startsWith(path + '/'));
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      aria-label="底部导航"
    >
      <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2">
        <div className="rounded-3xl border border-white/60 bg-white/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
          <div className="grid grid-cols-5 gap-1 px-2 py-2.5">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs font-medium transition-all ${
                    active
                      ? 'text-[#FF6A3D] bg-[#FFF1EA]'
                      : 'text-[#8A97A6] hover:text-[#333333]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'scale-105' : ''}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`h-1 w-1 rounded-full transition-opacity ${
                      active ? 'bg-[#FF6A3D] opacity-100' : 'bg-transparent opacity-0'
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MobileTabBar;
