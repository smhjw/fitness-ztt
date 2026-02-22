import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import MobileTabBar from '@/components/navigation/MobileTabBar';
import useAuth from '@/hooks/useAuth';

const HeroSection = lazy(() => import('@/sections/HeroSection'));
const RecordsSection = lazy(() => import('@/sections/RecordsSection'));
const StatisticsSection = lazy(() => import('@/sections/StatisticsSection'));
const KnowledgeSection = lazy(() => import('@/sections/KnowledgeSection'));
const DietSection = lazy(() => import('@/sections/DietSection'));
const BodySection = lazy(() => import('@/sections/BodySection'));
const AISection = lazy(() => import('@/sections/AISection'));
const ProfileSection = lazy(() => import('@/sections/ProfileSection'));
const LoginSection = lazy(() => import('@/sections/LoginSection'));
const RegisterSection = lazy(() => import('@/sections/RegisterSection'));
const StaticPage = lazy(() => import('@/sections/StaticPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B2AC]" />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B2AC]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38B2AC]" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Layout with Navbar and Footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <main className="pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(88px+env(safe-area-inset-bottom))] md:pt-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}

// Layout without Navbar (for auth pages)
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginSection />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <RegisterSection />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Main Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HeroSection />
            </MainLayout>
          }
        />
        <Route
          path="/records"
          element={
            <MainLayout>
              <ProtectedRoute>
                <RecordsSection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/statistics"
          element={
            <MainLayout>
              <ProtectedRoute>
                <StatisticsSection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/calendar"
          element={
            <MainLayout>
              <ProtectedRoute>
                <RecordsSection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/knowledge"
          element={
            <MainLayout>
              <KnowledgeSection />
            </MainLayout>
          }
        />
        <Route
          path="/knowledge/:articleId"
          element={
            <MainLayout>
              <KnowledgeSection />
            </MainLayout>
          }
        />
        <Route
          path="/diet"
          element={
            <MainLayout>
              <DietSection />
            </MainLayout>
          }
        />
        <Route
          path="/diet/:recipeId"
          element={
            <MainLayout>
              <DietSection />
            </MainLayout>
          }
        />
        <Route
          path="/body"
          element={
            <MainLayout>
              <ProtectedRoute>
                <BodySection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/ai"
          element={
            <MainLayout>
              <ProtectedRoute>
                <AISection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProtectedRoute>
                <ProfileSection />
              </ProtectedRoute>
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <ProtectedRoute>
                <ProfileSection />
              </ProtectedRoute>
            </MainLayout>
          }
        />

        {/* Static Pages */}
        <Route
          path="/features"
          element={
            <MainLayout>
              <StaticPage
                title="功能介绍"
                description="FitTrack 用更轻量的方式帮你记录训练、管理饮食并持续进步。"
                sections={[
                  {
                    title: '运动记录',
                    content: '快速录入每一次训练，自动生成统计图表。',
                    items: ['多类型运动支持', '日历视图回顾', '训练强度与心情记录'],
                  },
                  {
                    title: '饮食管理',
                    content: '收藏高质量菜谱，打造适合自己的饮食方案。',
                    items: ['菜谱分类筛选', '我的收藏与自建菜谱', '营养搭配建议'],
                  },
                  {
                    title: 'AI 助手',
                    content: '随时获取训练、饮食、恢复建议。',
                    items: ['训练计划灵感', '饮食搭配问答', '恢复与睡眠建议'],
                  },
                ]}
                cta={{ label: '开始记录', href: '/records' }}
              />
            </MainLayout>
          }
        />
        <Route
          path="/help"
          element={
            <MainLayout>
              <StaticPage
                title="帮助中心"
                description="常见问题与使用指引，帮你快速上手。"
                sections={[
                  {
                    title: '常见问题',
                    items: ['如何新增训练记录？', '如何收藏菜谱？', 'AI 助手能回答哪些问题？'],
                  },
                  {
                    title: '使用建议',
                    content: '建议每天记录训练与饮食，持续 2-4 周即可看到趋势变化。',
                  },
                ]}
                cta={{ label: '联系客服', href: '/contact' }}
              />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <StaticPage
                title="联系我们"
                description="有任何建议或合作意向，欢迎联系。"
                sections={[
                  {
                    title: '邮箱',
                    content: 'support@fittrack.com（工作日 24 小时内回复）',
                  },
                  {
                    title: '商务合作',
                    content: 'biz@fittrack.com',
                  },
                ]}
                cta={{ label: '反馈建议', href: '/feedback' }}
              />
            </MainLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <MainLayout>
              <StaticPage
                title="反馈建议"
                description="你的想法会直接影响我们下一次更新。"
                sections={[
                  {
                    title: '反馈方式',
                    items: ['应用内意见反馈', '发送邮件至 feedback@fittrack.com'],
                  },
                  {
                    title: '我们会做什么',
                    content: '收到反馈后 3 个工作日内回复，并在更新日志中同步进展。',
                  },
                ]}
                cta={{ label: '查看功能介绍', href: '/features' }}
              />
            </MainLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <MainLayout>
              <StaticPage
                title="隐私政策"
                description="我们重视你的数据安全与隐私保护。"
                sections={[
                  {
                    title: '数据收集',
                    content: '仅用于提供训练记录、统计分析与个性化建议。',
                  },
                  {
                    title: '数据保护',
                    content: '所有数据均本地存储或经加密处理，未经授权不会分享。',
                  },
                ]}
              />
            </MainLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <MainLayout>
              <StaticPage
                title="服务条款"
                description="使用 FitTrack 即表示你同意以下条款。"
                sections={[
                  {
                    title: '使用范围',
                    content: '仅供个人健康管理使用，不作为医疗建议。',
                  },
                  {
                    title: '责任说明',
                    content: '请在专业人士指导下进行训练与饮食调整。',
                  },
                ]}
              />
            </MainLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <StaticPage
                title="找回密码"
                description="找回功能正在完善中。"
                sections={[
                  {
                    title: '临时方案',
                    content: '请发送邮件至 support@fittrack.com，我们将协助重置。',
                  },
                ]}
                backTo="/login"
              />
            </AuthLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
