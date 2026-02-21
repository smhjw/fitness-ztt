import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  ChevronDown 
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
    { label: '运动记录', href: '/records' },
    { label: '数据统计', href: '/statistics' },
    { label: '日历', href: '/calendar' },
    { label: '知识库', href: '/knowledge' },
    { label: '饮食', href: '/diet' },
    { label: '身体数据', href: '/body' },
    { label: 'AI 助手', href: '/ai' },
  ];

  const localizedUserName = useMemo(() => {
    if (!user) {
      return '';
    }

    if (user.loginType === 'guest') {
      return '游客用户';
    }

    if (user.id === 'demo-user-001' || user.email === 'demo@fittrack.com') {
      return '演示用户';
    }

    if (user.loginType === 'phone' && user.phone) {
      const suffix = user.phone.slice(-4);
      const phoneName = `用户${suffix}`;
      const legacyPhoneNames = new Set([`User${suffix}`, `用户${suffix}`, phoneName]);
      if (!user.name || legacyPhoneNames.has(user.name)) {
        return phoneName;
      }
    }

    return user.name || user.email?.split('@')[0] || '用户';
  }, [user]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 custom-expo ${
        isScrolled
          ? 'py-2'
          : 'py-4'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 custom-expo ${
          isScrolled
            ? 'max-w-4xl px-4'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled
              ? 'glass rounded-full px-6 py-2 shadow-lg'
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B2AC] to-[#2C9B95] flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl text-[#333333] transition-opacity duration-300 ${
              isScrolled ? 'hidden lg:block' : 'block'
            }`}>
              FitTrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-[#38B2AC]'
                    : 'text-[#718096] hover:text-[#333333]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#38B2AC] rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'w-6' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-1 h-auto hover:bg-[#E6F7F6] rounded-full transition-colors"
                  >
                    <Avatar className="w-8 h-8 border-2 border-[#38B2AC]">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-[#E6F7F6] text-[#38B2AC] text-sm">
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
                  className="hidden sm:flex text-[#718096] hover:text-[#333333] hover:bg-[#E6F7F6]"
                >
                  登录
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full px-4"
                >
                  注册
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] sm:top-[72px] bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-[#E6F7F6] text-[#38B2AC]'
                  : 'text-[#718096] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-[#718096] hover:bg-gray-50"
              >
                登录
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
