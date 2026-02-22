import { Link } from 'react-router-dom';
import { Activity, Heart, Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: '功能介绍', href: '/features' },
      { label: '训练计划', href: '/plans' },
      { label: '训练记录', href: '/records' },
      { label: '社区动态', href: '/community' },
      { label: '饮食管理', href: '/diet' },
      { label: '健身知识', href: '/knowledge' },
    ],
    support: [
      { label: '帮助中心', href: '/help' },
      { label: '联系我们', href: '/contact' },
      { label: '反馈建议', href: '/feedback' },
    ],
    legal: [
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-[calc(88px+env(safe-area-inset-bottom))] sm:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#F4511E] flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[#333333]">FitTrack</span>
            </Link>
            <p className="text-sm text-[#718096] mb-4">
              记录你的健身日常，科学规划训练与饮食，稳步达成目标。
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/smhjw/fitness-ztt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#718096] hover:bg-[#FFF1EA] hover:text-[#FF6A3D] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#718096] hover:bg-[#FFF1EA] hover:text-[#FF6A3D] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] mb-4">产品</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#718096] hover:text-[#FF6A3D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] mb-4">支持</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#718096] hover:text-[#FF6A3D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] mb-4">法律</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#718096] hover:text-[#FF6A3D] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-[#718096]">© {currentYear} FitTrack. 保留所有权利。</p>
          <p className="text-sm text-[#718096] flex items-center gap-1">
            用
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            打造
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
