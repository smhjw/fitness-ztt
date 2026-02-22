import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
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
      <main className="pt-20">
        {children}
      </main>
      <Footer />
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

        {/* Protected Routes */}
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
