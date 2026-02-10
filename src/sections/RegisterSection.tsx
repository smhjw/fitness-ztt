import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';

export function RegisterSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38B2AC] to-[#2C9B95] flex items-center justify-center shadow-glow">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-[#333333]">FitTrack</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[#718096]">
          © 2024 FitTrack. 保留所有权利。
        </p>
      </div>
    </section>
  );
}

export default RegisterSection;
