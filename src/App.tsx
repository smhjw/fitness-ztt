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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A3D]" />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A3D]" />
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6A3D]" />
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
                    items: ['多类型运动支持', '日历视图回看', '训练强度与心情记录'],
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
                description="常见问题与使用指南，帮你快速上手。"
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
                cta={{ label: '联系客户', href: '/contact' }}
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
                description="有任何问题或合作意向，欢迎随时联系。"
                sections={[
                  {
                    title: '邮箱',
                    content: 'support@fittrack.app',
                  },
                  {
                    title: '社交媒体',
                    content: '关注 FitTrack 获取最新动态。',
                  },
                ]}
                cta={{ label: '返回首页', href: '/' }}
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
                description="你的意见对我们很重要。"
                sections={[
                  {
                    title: '提交方式',
                    content: '发送邮件至 feedback@fittrack.app 或在 AI 助手中留言。',
                  },
                  {
                    title: '处理时间',
                    content: '我们会在 2 个工作日内回复。',
                  },
                ]}
                cta={{ label: '去 AI 助手', href: '/ai' }}
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
                description="我们非常重视你的隐私安全。"
                sections={[
                  {
                    title: '数据存储',
                    content: '训练与饮食数据保存在本地浏览器，不会上传到服务器。',
                  },
                  {
                    title: '第三方服务',
                    content: '仅在必要时使用统计与分析服务，用于优化体验。',
                  },
                ]}
                cta={{ label: '返回首页', href: '/' }}
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
                description="使用 FitTrack 前请阅读以下条款。"
                sections={[
                  {
                    title: '使用范围',
                    content: '本产品仅用于健身记录与健康管理，不构成医疗建议。',
                  },
                  {
                    title: '责任限制',
                    content: '请在专业人士指导下进行训练，注意运动安全。',
                  },
                ]}
                cta={{ label: '返回首页', href: '/' }}
              />
            </MainLayout>
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
