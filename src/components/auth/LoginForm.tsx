import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, Phone, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuth from '@/hooks/useAuth';

type LoginMethod = 'email' | 'phone' | 'wechat';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, demoLogin, guestLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    verificationCode: '',
    rememberMe: false,
  });

  const handleSendCode = async () => {
    if (!formData.phone || countdown > 0) return;

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (loginMethod === 'email') {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else if (loginMethod === 'phone') {
        await login({
          phone: formData.phone,
          verificationCode: formData.verificationCode,
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await demoLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await guestLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWechatLogin = () => {
    setError('微信登录暂未开放');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">欢迎回来</h1>
        <p className="text-[#718096]">继续你的训练记录与健康管理</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as LoginMethod)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            邮箱
          </TabsTrigger>
          <TabsTrigger value="phone" className="gap-2">
            <Phone className="w-4 h-4" />
            手机号
          </TabsTrigger>
          <TabsTrigger value="wechat" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            微信
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#FF6A3D] focus:ring-[#FF6A3D]"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#FF6A3D] focus:ring-[#FF6A3D]"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#333333]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="remember" className="text-sm text-[#718096] cursor-pointer">
                  记住我
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#FF6A3D] hover:text-[#F4511E]"
              >
                忘记密码
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-xl font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="13800138000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#FF6A3D] focus:ring-[#FF6A3D]"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  className="h-12 rounded-xl border-gray-200 focus:border-[#FF6A3D] focus:ring-[#FF6A3D]"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || !formData.phone}
                  className="h-12 px-4 whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : '发送验证码'}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-xl font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="wechat">
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-[#07C160] rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-16 h-16 text-white" />
            </div>
            <p className="text-[#718096] mb-4">微信登录功能即将上线</p>
            <Button
              onClick={handleWechatLogin}
              className="w-full h-12 bg-[#07C160] hover:bg-[#06AD56] text-white rounded-xl font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              微信登录
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="h-12 rounded-xl border-[#FF6A3D] text-[#FF6A3D] hover:bg-[#FFF1EA]"
          >
            体验账号
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="h-12 rounded-xl"
          >
            <User className="w-4 h-4 mr-2" />
            游客登录
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-[#718096]">
        还没有账号？{' '}
        <Link to="/register" className="text-[#FF6A3D] hover:text-[#F4511E] font-medium">
          立即注册
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
