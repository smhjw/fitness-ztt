import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Camera, Save, Loader2, Globe } from 'lucide-react';
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
import { supportedLanguages, type LanguageCode } from '@/i18n';

export function ProfileSection() {
  const { t, i18n } = useTranslation();
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
    language: LanguageCode;
  }>({
    name: user?.name || '',
    email: user?.email || '',
    dateFormat: user?.preferences.dateFormat || 'YYYY-MM-DD',
    unitSystem: user?.preferences.unitSystem || 'metric',
    defaultView: user?.preferences.defaultView || 'dashboard',
    language: (user?.preferences.language as LanguageCode) || 'zh-CN',
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('profile.avatarHint'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        setIsLoading(true);
        await updateAvatar(base64);
        toast.success(t('profile.saveSuccess'));
      } catch (error) {
        toast.error(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setFormData(prev => ({ ...prev, language: lang }));
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
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
        language: formData.language,
      });
      toast.success(t('profile.saveSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#718096]">{t('auth.loginTitle')}</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">{t('profile.title')}</h1>
          <p className="text-[#718096] mt-1">{t('profile.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('profile.avatar')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
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
                <div>
                  <p className="text-sm text-[#718096]">{t('profile.avatarHint')}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarClick}
                    className="mt-2"
                  >
                    {t('profile.changeAvatar')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('profile.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12"
                    placeholder={t('auth.name')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
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
                <p className="text-xs text-[#718096]">{t('auth.email')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('profile.preferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('profile.language')}
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleLanguageChange(value as LanguageCode)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('profile.dateFormat')}</Label>
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
                <Label>{t('profile.unitSystem')}</Label>
                <Select
                  value={formData.unitSystem}
                  onValueChange={(value) => setFormData({ ...formData, unitSystem: value as any })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">{t('profile.metric')}</SelectItem>
                    <SelectItem value="imperial">{t('profile.imperial')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('profile.defaultView')}</Label>
                <Select
                  value={formData.defaultView}
                  onValueChange={(value) => setFormData({ ...formData, defaultView: value as any })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">{t('profile.dashboard')}</SelectItem>
                    <SelectItem value="records">{t('nav.records')}</SelectItem>
                    <SelectItem value="calendar">{t('nav.calendar')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full px-8 h-12 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('profile.saving')}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t('profile.saveChanges')}
                </>
              )}
            </Button>
          </div>
        </form>

        <Separator className="my-8" />

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('profile.accountInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-[#718096]">{t('profile.registerDate')}</span>
              <span className="text-[#333333]">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#718096]">{t('profile.userId')}</span>
              <span className="text-[#333333] font-mono text-sm">{user.id}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProfileSection;
