import Link from 'next/link';

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-slate-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.href}-${item.name}`} className="flex items-center gap-2">
            {isLast ? (
              <span className="text-slate-600">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-slate-600 transition-colors">
                {item.name}
              </Link>
            )}
            {!isLast && <span className="text-slate-300">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
