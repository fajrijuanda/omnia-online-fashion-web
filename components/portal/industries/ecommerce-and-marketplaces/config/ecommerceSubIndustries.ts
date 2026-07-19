import type { PortalCatalogSubIndustry } from "../../../portalCatalog";
import { socialCommerceModules } from "../social-commerce-intelligence/socialCommerceData";

// Only D2C Brand sub-industry is available in this repository
export const ecommerceSubIndustries: Record<string, any> = {
  "d2c-brand": {
    id: "d2c-brand",
    name: "D2C Brand & Principle",
    caption: "Tingkatkan profit margin dari TikTok Shop & Shopee dengan market intelligence dan live campaign.",
    iconKey: "store",
    colorKey: "pink",
    isComingSoon: false,
    modules: socialCommerceModules.map((m) => ({
      id: m.route,
      name: m.name,
      caption: m.caption,
      iconKey: "line-chart",
      isComingSoon: false
    }))
  }
};
