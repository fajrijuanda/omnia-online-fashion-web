"use client";

import { SocialCommerceOverviewPage, SocialCommerceFeaturePage } from "../social-commerce-intelligence/SocialCommercePortal";
import type { PortalPage, PortalRole } from "../../../../portalTypes";
import type { HrisTier } from "../../../professional-services/hris/HrisPortal";

export function D2cBrandPortal({
  activePage,
  role,
  currentTier,
  setActivePage,
  onLockedModule
}: {
  activePage: PortalPage;
  role: PortalRole;
  currentTier: HrisTier;
  setActivePage: (page: PortalPage) => void;
  onLockedModule: () => void;
}) {
  const isFeaturePage = activePage !== "social-commerce-intelligence" && activePage !== "d2c-brand";
  
  if (isFeaturePage) {
    return <SocialCommerceFeaturePage activePage={activePage} role={role} currentTier={currentTier} onLockedModule={onLockedModule} />;
  }
  
  return <SocialCommerceOverviewPage role={role} tier={currentTier} setActivePage={setActivePage} onLockedModule={onLockedModule} />;
}
