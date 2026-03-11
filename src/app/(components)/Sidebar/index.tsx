"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import Image from "next/image";
import {
  LucideIcon,
  ChevronLeft,
  TruckElectric,
  Home,
  Newspaper,
  MapPin,
  Globe,
  TrendingUp,
  Trophy,
  Tv,
  Camera,
  BookOpen,
  Sparkles,
  Star,
  Calendar,
  Moon,
  Flower,
  Users,
  MessageSquare,
  Map
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface SidebarLinkProps {
  href:        string;
  icon:        LucideIcon;
  label:       string;
  isCollapsed: boolean;
  badge?:      number;
}

interface NavGroup {
  label: string;
  items: Omit<SidebarLinkProps, "isCollapsed">[];
}

/* ─────────────────────────────────────────────
   Nav structure
───────────────────────────────────────────── */

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", icon: Home, label: "Home" },
    ],
  },

  {
    label: "News",
    items: [
      { href: "/news/current", icon: Newspaper, label: "Current News" },
      { href: "/news/tamilnadu", icon: MapPin, label: "Tamil Nadu" },
      { href: "/news/india", icon: Map, label: "India" },
      { href: "/news/world", icon: Globe, label: "World" },
      { href: "/news/trending", icon: TrendingUp, label: "Trending" },
      { href: "/news/sports", icon: Trophy, label: "Sports" },
    ],
  },

  {
    label: "Media & Specials",
    items: [
      { href: "/media/tv", icon: Tv, label: "Dinamalar TV" },
      { href: "/media/photos", icon: Camera, label: "Photo" },
      { href: "/media/magazine", icon: BookOpen, label: "Educational Magazine" },
      { href: "/media/special", icon: Star, label: "Special" },
    ],
  },

  {
    label: "Lifestyle",
    items: [
      { href: "/lifestyle/astrology", icon: Moon, label: "Astrology" },
      { href: "/lifestyle/calendar", icon: Calendar, label: "Calendar" },
      { href: "/lifestyle/spirituality", icon: Sparkles, label: "Spirituality" },
      { href: "/lifestyle/weekly", icon: Flower, label: "Weekly" },
    ],
  },

  {
    label: "Community",
    items: [
      { href: "/community/local-news", icon: MapPin, label: "Local News" },
      { href: "/community/tamils-world", icon: Users, label: "Tamils of the World" },
      { href: "/community/tea-shop", icon: MessageSquare, label: "Tea Shop Bench" },
    ],
  },
];

/* ═══════════════════════════════════════════
   SIDEBAR LINK
═══════════════════════════════════════════ */
const SidebarLink = ({ href, icon: Icon, label, isCollapsed, badge }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} title={isCollapsed ? label : undefined}>
      <div
        className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
        style={{
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding:        isCollapsed ? "13px 10px" : "11px 16px",
          position:       "relative",
          gap:            isCollapsed ? 0 : 13,
          borderRadius:   "calc(var(--radius) * 0.65)",
          marginBottom:    1,
        }}
      >
        {/* Active pill bar */}
        {isActive && (
          <span
            style={{
              position:     "absolute",
              left:          0,
              top:          "50%",
              transform:    "translateY(-50%)",
              width:         3,
              height:       "52%",
              borderRadius:  "0 4px 4px 0",
              background:   "hsl(var(--primary))",
            }}
          />
        )}

        {/* Icon */}
        <span style={{ flexShrink: 0, position: "relative", display: "flex" }}>
          <Icon size={18} />
          {badge && isCollapsed && (
            <span
              style={{
                position:       "absolute",
                top:            -5,
                right:          -6,
                minWidth:       15,
                height:         15,
                padding:        "0 3px",
                borderRadius:   99,
                background:     "hsl(var(--primary))",
                color:          "hsl(var(--primary-foreground))",
                fontSize:       8,
                fontWeight:     700,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                lineHeight:     1,
                fontFamily:     "var(--font-mono)",
              }}
            >
              {badge}
            </span>
          )}
        </span>

        {/* Label */}
        {!isCollapsed && (
          <span
            className="body-3"
            style={{
              flex:         1,
              fontSize:     13.5,
              fontWeight:   isActive ? 600 : 500,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
            }}
          >
            {label}
          </span>
        )}

        {/* Badge pill — expanded */}
        {badge && !isCollapsed && (
          <span
            style={{
              minWidth:       20,
              height:         20,
              padding:        "0 6px",
              borderRadius:   99,
              background:     isActive
                ? "hsl(var(--primary-foreground) / 0.18)"
                : "hsl(var(--secondary))",
              color:          isActive
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--text-muted))",
              fontSize:       10,
              fontWeight:     600,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     "var(--font-mono)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

/* ═══════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════ */
const Sidebar = () => {
  const dispatch    = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const toggle      = () => dispatch(setIsSidebarCollapsed(!isCollapsed));

  return (
    <aside
      style={{
        /* ── Floating: inset from all edges ── */
        position:   "fixed",
        top:         12,
        left:        12,
        bottom:      12,
        height:     "calc(100vh - 24px)",
        width:      isCollapsed ? 76 : 256,
        transition: "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex:      50,

        /* ── Glass appearance ── */
        background:           "hsl(var(--sidebar) / 0.90)",
        backdropFilter:       "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border:               "1px solid hsl(var(--border))",
        borderRadius:         "calc(var(--radius) * 1.1)",
        boxShadow: [
          "0 2px 4px  hsl(220 18% 5% / 0.06)",
          "0 8px 24px hsl(220 18% 5% / 0.10)",
          "0 0  0 0.5px hsl(var(--border) / 0.6) inset",
        ].join(", "),

        /* ── Layout ── */
        display:       "flex",
        flexDirection: "column",
        overflow:      "hidden",
      }}
    >
      {/* ══ LOGO ROW ══════════════════════════ */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          padding:        isCollapsed ? "22px 14px 18px" : "22px 18px 18px",
          borderBottom:   "1px solid hsl(var(--divider))",
          flexShrink:     0,
          gap:             8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, overflow: "hidden", minWidth: 0 }}>

          {/* Wordmark */}
          {!isCollapsed && (
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <div
                style={{
                  background: "#ffffff",
                  padding: "6px 10px",
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/logo/dinamalar-logo.png"
                  alt="Dinamalar"
                  width={140}
                  height={40}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            <div className="mt-3"></div>

            <p
              className="btn-label-xs mt-10"
              style={{
                color: "hsl(var(--text-muted))",
                margin: 0,
                whiteSpace: "nowrap",
                letterSpacing: "0.07em",
              }}
            >
              News Portal
            </p>
          </div>
          )}
        </div>

        {/* Collapse chevron */}
        {!isCollapsed && (
          <button
            onClick={toggle}
            className="icon-button"
            aria-label="Collapse sidebar"
            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8 }}
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Expand chevron — collapsed state */}
      {isCollapsed && (
        <button
          onClick={toggle}
          className="icon-button"
          aria-label="Expand sidebar"
          style={{
            margin:       "12px auto 6px",
            width:         34,
            height:        34,
            borderRadius:   9,
            flexShrink:    0,
          }}
        >
          <ChevronLeft
            size={15}
            style={{ transform: "rotate(180deg)", transition: "transform 0.25s ease" }}
          />
        </button>
      )}

      {/* ══ NAV GROUPS ════════════════════════ */}
      <nav
        style={{
          flex:           1,
          overflowY:     "auto",
          overflowX:     "hidden",
          padding:       isCollapsed ? "10px 10px" : "14px 12px",
          display:       "flex",
          flexDirection: "column",
          gap:            0,
          scrollbarWidth: "none",
        }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <div
            key={group.label}
            style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 14 : 0 }}
          >
            {/* Section label — expanded */}
            {!isCollapsed ? (
              <p
                className="btn-label-xs"
                style={{
                  color:         "hsl(var(--text-muted))",
                  padding:       "2px 16px 7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                  fontSize:       10,
                  fontWeight:     600,
                  margin:         0,
                }}
              >
                {group.label}
              </p>
            ) : (
              /* Short divider between groups — collapsed */
              gi > 0 && (
                <div
                  style={{
                    display:        "flex",
                    justifyContent: "center",
                    margin:         "8px 0 12px",
                  }}
                >
                  <div
                    style={{
                      width:      22,
                      height:      1,
                      background: "hsl(var(--divider))",
                      borderRadius: 1,
                    }}
                  />
                </div>
              )
            )}

            {group.items.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* ══ FOOTER ════════════════════════════ */}
      <div
        style={{
          padding:        isCollapsed ? "14px 10px" : "14px 20px",
          borderTop:      "1px solid hsl(var(--divider))",
          flexShrink:      0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        {!isCollapsed ? (
          <p
            className="btn-label-xs"
            style={{ color: "hsl(var(--text-muted))", margin: 0, fontSize: 11 }}
          >
            © 2026 Dinamalar
          </p>
        ) : (
          <div
            style={{
              width:        7,
              height:       7,
              borderRadius: 9999,
              background:   "hsl(var(--primary) / 0.45)",
            }}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;