import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className="flex items-center flex-wrap gap-1 text-sm text-gray-500"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link href="/" className="hover:text-[#D7242A] transition-colors" itemProp="item">
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[#D7242A] transition-colors" itemProp="item">
                <span itemProp="name">{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-gray-800 font-medium" itemProp="name">{crumb.label}</span>
            )}
            <meta itemProp="position" content={String(i + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
