import { PortalAppShell } from "@/components/portal/layout/PortalAppShell";
import { resolvePortalRoute } from "@/components/portal/portalRoutes";

export default async function PortalNestedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = resolvePortalRoute(slug);
  const isCatalogPage = page === "industry" || page === "sub-industry";

  return (
    <PortalAppShell
      initialPage={page}
      routeIndustrySlug={isCatalogPage ? slug[0] : null}
      routeSubIndustrySlug={page === "sub-industry" ? slug[1] : null}
    />
  );
}


import { portalRouteMap } from "@/components/portal/portalRoutes";
import { portalPagePaths } from "@/components/portal/portalTypes";
import { ecommerceSubIndustries } from "@/components/portal/industries/ecommerce-and-marketplaces/config/ecommerceSubIndustries";

export function generateStaticParams() {
  const slugs = new Set<string>();
  slugs.add("dashboard");
  for (const route of Object.keys(portalRouteMap)) {
    slugs.add(route);
  }
  for (const path of Object.values(portalPagePaths)) {
    if (path.startsWith("/portal/")) slugs.add(path.slice("/portal/".length));
  }

  for (const subIndustry of Object.values(ecommerceSubIndustries)) {
    for (const moduleConfig of (subIndustry as any).modules || []) {
      slugs.add(`ecommerce-and-marketplaces/${subIndustry.id}/${moduleConfig.id}`);
    }
  }

  const extraPaths = [
    "ecommerce-and-marketplaces", "ecommerce",
    "ecommerce-and-marketplaces/social-commerce-intelligence"
  ];
  
  for (const path of extraPaths) {
    slugs.add(path);
  }
  
  return Array.from(slugs).map((route) => ({ slug: route.split("/") }));
}
