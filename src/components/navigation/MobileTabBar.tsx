import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, BookOpen, ChefHat, Sparkles } from 'lucide-react';

const tabs = [
  { label: '首页', href: '/', icon: Home },
  { label: '记录', href: '/records', icon: Dumbbell },
  { label: '知识', href: '/knowledge', icon: BookOpen },
  { label: '饮食', href: '/diet', icon: ChefHat },
  { label: 'AI', href: '/ai', icon: Sparkles },
];

export function MobileTabBar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      aria-label="移动端主导航"
    >
      <div className="mx-auto max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
        <div className="rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {tabs.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium transition-colors ${
                    active
                      ? 'text-[#38B2AC] bg-[#E6F7F6]'
                      : 'text-[#718096] hover:text-[#333333]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
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
