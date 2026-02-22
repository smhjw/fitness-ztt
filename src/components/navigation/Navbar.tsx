import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAuth from '@/hooks/useAuth';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const navLinks = [
    { label: '首页', href: '/' },
    { label: '社区', href: '/community' },
    { label: '计划', href: '/plans' },
    { label: '商城', href: '/shop' },
    { label: '饮食', href: '/diet' },
    { label: '知识', href: '/knowledge' },
  ];

  const localizedUserName = useMemo(() => {
    if (!user) {
      return '';
    }

    if (user.loginType === 'guest') {
      return '游客';
    }

    if (user.id === 'demo-user-001' || user.email === 'demo@fittrack.com') {
      return '演示用户';
    }

    if (user.loginType === 'phone' && user.phone) {
      const suffix = user.phone.slice(-4);
      const phoneName = `手机尾号${suffix}`;
      const legacyPhoneNames = new Set([`User${suffix}`, `手机尾号${suffix}`, `用户${suffix}`, phoneName]);
      if (!user.name || legacyPhoneNames.has(user.name)) {
        return phoneName;
      }
    }

    return user.name || user.email?.split('@')[0] || '用户';
  }, [user]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 custom-expo ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 custom-expo ${
          isScrolled ? 'max-w-4xl px-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'glass rounded-full px-6 py-2 shadow-lg' : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#F4511E] flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span
              className={`font-bold text-xl text-[#333333] transition-opacity duration-300 ${
                isScrolled ? 'hidden lg:block' : 'block'
              }`}
            >
              FitTrack
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-[#FF6A3D]'
                    : 'text-[#718096] hover:text-[#333333]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#FF6A3D] rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'w-6' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-1 h-auto hover:bg-[#FFF1EA] rounded-full transition-colors"
                  >
                    <Avatar className="w-8 h-8 border-2 border-[#FF6A3D]">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-[#FFF1EA] text-[#FF6A3D] text-sm">
                        {localizedUserName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-[#333333]">
                      {localizedUserName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#718096]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    个人资料
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex text-[#718096] hover:text-[#333333] hover:bg-[#FFF1EA]"
                >
                  登录
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-full px-4"
                >
                  注册
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="切换菜单"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="flex flex-col p-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#FFF1EA] text-[#FF6A3D]'
                      : 'text-[#718096] hover:text-[#333333]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
