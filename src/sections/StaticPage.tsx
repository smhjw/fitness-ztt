import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StaticSection {
  title: string;
  content?: string;
  items?: string[];
}

interface StaticPageProps {
  title: string;
  description?: string;
  sections?: StaticSection[];
  backTo?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function StaticPage({ title, description, sections = [], backTo, cta }: StaticPageProps) {
  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          {backTo && (
            <Button asChild variant="ghost" className="mb-4 gap-2">
              <Link to={backTo}>
                <ArrowLeft className="w-4 h-4" />
                返回
              </Link>
            </Button>
          )}
          <h1 className="text-3xl font-bold text-[#333333]">{title}</h1>
          {description && <p className="text-[#718096] mt-2">{description}</p>}
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={`${section.title}-${index}`}>
              <CardContent className="p-5 space-y-3">
                <h2 className="text-lg font-semibold text-[#333333]">{section.title}</h2>
                {section.content && (
                  <p className="text-sm text-[#718096] leading-relaxed">{section.content}</p>
                )}
                {section.items && (
                  <ul className="text-sm text-[#718096] space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6A3D]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {cta && (
          <div className="mt-6">
            <Button asChild className="w-full sm:w-auto rounded-full bg-[#FF6A3D] hover:bg-[#F4511E] text-white">
              <Link to={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default StaticPage;
