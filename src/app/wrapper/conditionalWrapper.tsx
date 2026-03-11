"use client";

import { usePathname } from "next/navigation";
import DashboardWrapper from "./dashboardWrapper";

export default function ConditionalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes that should NOT be wrapped with DashboardWrapper
  const noWrapperRoutes = ["/landing", "/login"];

  const shouldWrap = !noWrapperRoutes.includes(pathname);

  return shouldWrap ? (
    <DashboardWrapper>{children}</DashboardWrapper>
  ) : (
    <>{children}</>
  );
}
