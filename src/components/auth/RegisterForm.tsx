import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import useAuth from '@/hooks/useAuth';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const validateForm = (): boolean => {
    if (formData.password.length < 6) {
      setError('密码至少 6 位');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次密码不一致');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('请同意服务条款与隐私政策');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#333333] mb-2">创建账号</h1>
        <p className="text-[#718096]">开始你的健身记录之旅</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">昵称</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              id="name"
              type="text"
              placeholder="请输入昵称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#38B2AC] focus:ring-[#38B2AC]"
              autoComplete="name"
              required
            />
          </div>
        </div>

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
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#38B2AC] focus:ring-[#38B2AC]"
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
              placeholder="请输入密码（至少 6 位）"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#38B2AC] focus:ring-[#38B2AC]"
              autoComplete="new-password"
              required
              minLength={6}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">确认密码</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="再次输入密码"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#38B2AC] focus:ring-[#38B2AC]"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#333333]"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, agreeTerms: checked as boolean })
            }
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm text-[#718096] cursor-pointer leading-relaxed">
            我已阅读并同意{' '}
            <Link to="/terms" className="text-[#38B2AC] hover:text-[#2C9B95]">
              服务条款
            </Link>
            {' '}与{' '}
            <Link to="/privacy" className="text-[#38B2AC] hover:text-[#2C9B95]">
              隐私政策
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-xl font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              注册中...
            </>
          ) : (
            '注册'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#718096]">
        已有账号？{' '}
        <Link to="/login" className="text-[#38B2AC] hover:text-[#2C9B95] font-medium">
          去登录
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
