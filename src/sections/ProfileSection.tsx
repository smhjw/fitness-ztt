import { useState, useRef } from 'react';
import { User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/sonner';
import useAuth from '@/hooks/useAuth';

export function ProfileSection() {
  const { toast } = useToast();
  const { user, updateProfile, updateAvatar, updatePreferences } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
    unitSystem: 'metric' | 'imperial';
    defaultView: 'dashboard' | 'calendar' | 'records';
  }>({
    name: user?.name || '',
    email: user?.email || '',
    dateFormat: user?.preferences.dateFormat || 'YYYY-MM-DD',
    unitSystem: user?.preferences.unitSystem || 'metric',
    defaultView: user?.preferences.defaultView || 'dashboard',
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('头像大小不能超过 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        setIsLoading(true);
        await updateAvatar(base64);
        toast.success('保存成功');
      } catch (error) {
        toast.error('操作失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({ name: formData.name });
      await updatePreferences({
        dateFormat: formData.dateFormat,
        unitSystem: formData.unitSystem,
        defaultView: formData.defaultView,
      });
      toast.success('保存成功');
    } catch (error) {
      toast.error('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#718096]">请先登录</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">个人资料</h1>
          <p className="text-[#718096] mt-1">管理你的基本信息与偏好</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">头像</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-[#E6F7F6]">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-[#E6F7F6] text-[#38B2AC] text-2xl">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#38B2AC] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2C9B95] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="text-sm text-[#718096]">
                  <p>建议尺寸 400x400，大小不超过 2MB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarClick}
                    className="mt-2 w-full sm:w-auto"
                  >
                    更换头像
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">昵称</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12"
                    placeholder="请输入昵称"
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
                    value={formData.email}
                    disabled
                    className="pl-10 h-12 bg-gray-50"
                  />
                </div>
                <p className="text-xs text-[#718096]">邮箱不可修改</p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">偏好设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>日期格式</Label>
                <Select
                  value={formData.dateFormat}
                  onValueChange={(value) => setFormData({ ...formData, dateFormat: value as any })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">2024-01-15</SelectItem>
                    <SelectItem value="DD/MM/YYYY">15/01/2024</SelectItem>
                    <SelectItem value="MM/DD/YYYY">01/15/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>单位系统</Label>
                <Select
                  value={formData.unitSystem}
                  onValueChange={(value) => setFormData({ ...formData, unitSystem: value as any })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">公制</SelectItem>
                    <SelectItem value="imperial">英制</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>默认页面</Label>
                <Select
                  value={formData.defaultView}
                  onValueChange={(value) => setFormData({ ...formData, defaultView: value as any })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">概览</SelectItem>
                    <SelectItem value="records">运动记录</SelectItem>
                    <SelectItem value="calendar">日历</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full px-8 h-12 gap-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  保存修改
                </>
              )}
            </Button>
          </div>
        </form>

        <Separator className="my-8" />

        {/* Account Info */}
        <Card>
          <CardHeader>
          <CardTitle className="text-lg">账号信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-[#718096]">注册时间</span>
              <span className="text-[#333333]">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#718096]">用户 ID</span>
              <span className="text-[#333333] font-mono text-sm">{user.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProfileSection;
