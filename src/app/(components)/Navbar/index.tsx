"use client";

import { useAppDispatch, useAppSelector } from "../../redux";
import { setIsDarkMode } from "@/state";
import {
  Bell,
  Moon,
  Sun,
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  PackageX,
  UserCircle,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "destructive";
}

/* ─────────────────────────────────────────────
   Mock data
───────────────────────────────────────────── */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Breaking News",
    message: "Tamil Nadu budget announcement released",
    time: "10m ago",
    read: false,
    type: "warning",
  },
  {
    id: 2,
    title: "Sports Update",
    message: "India wins the ODI series against Australia",
    time: "1h ago",
    read: false,
    type: "success",
  },
  {
    id: 3,
    title: "World News",
    message: "Global tech summit begins in Singapore",
    time: "3h ago",
    read: false,
    type: "info",
  },
];

const MOCK_USER = { name: "Yogitha", role: "", avatar: "/1.jpg" };

/* ─────────────────────────────────────────────
   Notification config
───────────────────────────────────────────── */
const NOTIF_CONFIG: Record<Notification["type"], { icon: React.ReactNode; color: string; bg: string }> = {
  info: { icon: <Info size={13} />, color: "hsl(var(--info))", bg: "hsl(var(--info) / 0.12)" },
  success: { icon: <CheckCircle2 size={13} />, color: "hsl(var(--success))", bg: "hsl(var(--success) / 0.12)" },
  warning: { icon: <AlertTriangle size={13} />, color: "hsl(var(--warning))", bg: "hsl(var(--warning) / 0.12)" },
  destructive: { icon: <PackageX size={13} />, color: "hsl(var(--destructive))", bg: "hsl(var(--destructive) / 0.12)" },
};

const PROFILE_ITEMS = [
  { label: "My Profile", href: "/profile", icon: <UserCircle size={15} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={15} /> },
];

/* ─────────────────────────────────────────────
   Timing constants — tweak here only
───────────────────────────────────────────── */
const LEAVE_DELAY_MS = 1400;  // how long after cursor leaves to collapse
const DROPDOWN_LINGER_MS = 2500;  // how long after closing a dropdown before collapsing

/* ═══════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════ */
const Avatar = ({ src, name, size = 30 }: { src: string; name: string; size?: number }) => {
  const [errored, setErrored] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 9999,
        background: "hsl(var(--primary) / 0.18)",
        border: "1.5px solid hsl(var(--primary) / 0.28)",
        overflow: "hidden", display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}
    >
      {!errored ? (
        <img
          src={src} alt={name}
          onError={() => setErrored(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: size * 0.36, color: "hsl(var(--primary))", lineHeight: 1 }}>
          {initials}
        </span>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
const Navbar = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((s) => s.global.isDarkMode);

  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  /* locked = user clicked an icon, navbar stays open until explicit leave */
  const [locked, setLocked] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  /* navbar is "busy" when a dropdown or search is actively open */
  const isBusy = notifOpen || profileOpen || searchOpen;
  const isMobile = (viewportWidth ?? 1024) < 640;
  const isTablet = (viewportWidth ?? 1024) < 1024;
  const searchWidth = isMobile ? "100%" : searchOpen ? (isTablet ? 220 : 268) : (isTablet ? 160 : 210);

  const clearLeave = () => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
  };

  const scheduleCollapse = useCallback((delay: number) => {
    clearLeave();
    leaveTimer.current = setTimeout(() => {
      setExpanded(false);
      setLocked(false);
      setSearchOpen(false);
      setSearchValue("");
      setNotifOpen(false);
      setProfileOpen(false);
    }, delay);
  }, []);

  /* Scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Outside click → close dropdowns */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* After dropdowns close, schedule collapse (unless locked) */
  useEffect(() => {
    if (expanded && !isBusy && !locked) {
      scheduleCollapse(DROPDOWN_LINGER_MS);
    } else {
      clearLeave();
    }
    return clearLeave;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBusy, locked, expanded]);

  const handleMouseEnter = () => clearLeave();

  const handleMouseLeave = () => {
    if (!isBusy) scheduleCollapse(LEAVE_DELAY_MS);
  };

  /* Expand + lock (clicking an icon means user wants to interact) */
  const expandAndLock = () => {
    setExpanded(true);
    setLocked(true);
    clearLeave();
  };

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));

  /* Shared glass pill/nav style */
  const glass: React.CSSProperties = {
    background: "hsl(var(--card) / 0.88)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid hsl(var(--border))",
    boxShadow: scrolled
      ? "0 8px 32px hsl(220 18% 5% / 0.16), 0 1px 0 hsl(var(--border) / 0.5)"
      : "0 4px 24px hsl(220 18% 5% / 0.10), 0 1px 0 hsl(var(--border) / 0.35)",
    transition: "box-shadow 0.3s ease",
  };

  /* ═══════════════════════════════════════
     COLLAPSED  — centered icon pill
  ═══════════════════════════════════════ */
  if (!expanded) {
    return (
      <div
        style={{
          position: "sticky", top: 12, zIndex: 40,
          margin: isMobile ? "0 0 16px" : "0 16px 20px",
          display: "flex", justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          onMouseEnter={() => { setExpanded(true); }}   /* hover = preview only, no lock */
          onMouseLeave={() => scheduleCollapse(LEAVE_DELAY_MS)}
          style={{
            ...glass,
            display: "flex", alignItems: "center", gap: 4,
            padding: isMobile ? "6px 8px" : "6px 10px", borderRadius: 9999,
            maxWidth: "100%",
            pointerEvents: "auto", cursor: "default",
            animation: "fadeIn 0.3s ease both",
          }}
        >
          {/* Search */}
          <button
            onClick={() => { expandAndLock(); setTimeout(() => searchRef.current?.focus(), 80); }}
            className="icon-button" aria-label="Search"
            style={{ width: 34, height: 34, borderRadius: 9999 }}
          >
            <Search size={15} />
          </button>

          <div style={{ width: 1, height: 16, background: "hsl(var(--divider))" }} />

          {/* Dark mode — works directly, no lock needed */}
          <button
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="icon-button" aria-label="Toggle theme"
            style={{ width: 34, height: 34, borderRadius: 9999 }}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Bell */}
          <button
            onClick={expandAndLock}
            className="icon-button" aria-label="Notifications"
            style={{ width: 34, height: 34, borderRadius: 9999, position: "relative" }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, borderRadius: 9999, background: "hsl(var(--destructive))", border: "1.5px solid hsl(var(--card))" }} />
            )}
          </button>

          <div style={{ width: 1, height: 16, background: "hsl(var(--divider))" }} />

          {/* Avatar */}
          <button
            onClick={expandAndLock}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 9999, display: "flex", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              <Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size={26} />
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 7, height: 7, borderRadius: 9999, background: "hsl(var(--success))", border: "1.5px solid hsl(var(--card))" }} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     EXPANDED  — full floating navbar
  ═══════════════════════════════════════ */
  return (
    <nav
      ref={navRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...glass,
        position: "sticky", top: 12, zIndex: 40,
        margin: isMobile ? "0 0 16px" : "0 16px 20px",
        borderRadius: "var(--radius)",
        display: "flex", alignItems: isMobile ? "stretch" : "center",
        justifyContent: "space-between",
        flexWrap: isMobile ? "wrap" : "nowrap",
        width: isMobile ? "100%" : "calc(100% - 32px)",
        maxWidth: "100%",
        padding: isMobile ? "10px 12px" : isTablet ? "7px 12px" : "7px 14px",
        gap: isMobile ? 10 : isTablet ? 8 : 12,
        animation: "fadeIn 0.22s ease both",
      }}
    >
      {/* ══ LEFT ══ */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, flex: isMobile ? "1 1 100%" : "1 1 auto", minWidth: 0 }}>
        <div style={{ width: 1, height: 20, background: "hsl(var(--divider))", flexShrink: 0 }} />

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "hsl(var(--text-muted))", pointerEvents: "none" }} />
          <input
            ref={searchRef}
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => { setSearchOpen(true); setLocked(true); }}
            onBlur={() => { setSearchOpen(false); }}
            placeholder="Search Trending News..."
            className="input-elegant body-3"
            style={{ paddingLeft: 33, paddingRight: searchValue ? 30 : 13, paddingTop: 7, paddingBottom: 7, width: searchWidth, maxWidth: "100%", transition: "width 0.3s ease", fontSize: 13 }}
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")} className="icon-button"
              style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%" }}>
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* ══ RIGHT ══ */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: isMobile ? "100%" : "auto", minWidth: 0, gap: isMobile ? 12 : 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0 }}>
          {/* Dark mode */}
          <button onClick={() => dispatch(setIsDarkMode(!isDarkMode))} className="icon-button" aria-label="Toggle dark mode">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* ── Notifications ── */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); setLocked(true); }}
              className="icon-button" aria-label="Notifications"
              style={{ position: "relative" }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, minWidth: 15, height: 15, padding: "0 3px", borderRadius: 9999, background: "hsl(var(--destructive))", color: "hsl(var(--primary-foreground))", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="dropdown-glass"
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: isMobile ? 0 : "auto",
                  right: isMobile ? "auto" : 0,
                  width: isMobile ? "min(340px, calc(100vw - 132px))" : "min(340px, calc(100vw - 32px))",
                  maxWidth: isMobile ? "calc(100vw - 132px)" : "calc(100vw - 24px)",
                  animation: "dropdownIn 0.2s ease-out both",
                }}
              >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="body-3" style={{ fontWeight: 600, color: "hsl(var(--foreground))", fontSize: 13 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(var(--primary))", fontSize: 12, fontWeight: 500, fontFamily: "var(--font-body)", padding: "2px 6px", borderRadius: 6, transition: "background 0.15s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--primary) / 0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="dropdown-separator" />

              <div style={{ maxHeight: 280, overflowY: "auto", scrollbarWidth: "none" }}>
                {notifications.map((n) => {
                  const cfg = NOTIF_CONFIG[n.type];
                  return (
                    <div key={n.id} onClick={() => markRead(n.id)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 10px", cursor: "pointer", background: n.read ? "transparent" : "hsl(var(--primary) / 0.04)", transition: "background 0.15s ease", borderRadius: 8, margin: "1px 4px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--secondary))")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : "hsl(var(--primary) / 0.04)")}>
                      <span style={{ flexShrink: 0, marginTop: 2, width: 28, height: 28, borderRadius: 8, background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", opacity: n.read ? 0.45 : 1 }}>
                        {cfg.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="body-3" style={{ fontWeight: n.read ? 400 : 600, color: "hsl(var(--foreground))", margin: "0 0 2px", fontSize: 13 }}>{n.title}</p>
                        <p className="body-3" style={{ color: "hsl(var(--text-muted))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0, fontSize: 12 }}>{n.message}</p>
                      </div>
                      <span style={{ color: "hsl(var(--text-muted))", flexShrink: 0, marginTop: 2, fontSize: 11, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{n.time}</span>
                    </div>
                  );
                })}
              </div>

              <div className="dropdown-separator" />

              <Link href="/notifications"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "9px 14px", color: "hsl(var(--primary))", fontWeight: 500, fontSize: 13, fontFamily: "var(--font-body)", borderRadius: 8, margin: "2px 4px", transition: "background 0.15s ease", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--primary) / 0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                View all notifications →
              </Link>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link href="/settings" className="icon-button" aria-label="Settings">
            <Settings size={16} />
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <div style={{ width: 1, height: 20, background: "hsl(var(--divider))", margin: "0 3px", flexShrink: 0 }} />

          {/* ── Profile ── */}
          <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); setLocked(true); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "5px 8px", borderRadius: "calc(var(--radius) * 0.65)", transition: "background 0.2s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--secondary))")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size={30} />
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: 9999, background: "hsl(var(--success))", border: "1.5px solid hsl(var(--card))" }} />
            </div>
            <div className="hidden md:block" style={{ textAlign: "left", lineHeight: 1.3, minWidth: 0 }}>
              <p className="body-3" style={{ fontWeight: 600, color: "hsl(var(--foreground))", margin: 0, fontSize: 13, whiteSpace: "nowrap" }}>{MOCK_USER.name}</p>
              <p style={{ color: "hsl(var(--text-muted))", margin: 0, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{MOCK_USER.role}</p>
            </div>
            <ChevronDown size={12} style={{ color: "hsl(var(--text-muted))", transition: "transform 0.25s ease", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
          </button>

            {profileOpen && (
              <div className="dropdown-glass" style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: isMobile ? "min(220px, calc(100vw - 24px))" : 220, maxWidth: "calc(100vw - 24px)", animation: "dropdownIn 0.2s ease-out both" }}>
              <div style={{ padding: "12px 14px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar src={MOCK_USER.avatar} name={MOCK_USER.name} size={38} />
                <div style={{ minWidth: 0 }}>
                  <p className="body-3" style={{ fontWeight: 600, color: "hsl(var(--foreground))", margin: 0, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{MOCK_USER.name}</p>
                  <p style={{ color: "hsl(var(--text-muted))", margin: 0, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{MOCK_USER.role}</p>
                </div>
              </div>
              <div className="dropdown-separator" />
              {PROFILE_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, margin: "1px 4px", color: "hsl(var(--text-secondary))", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500, textDecoration: "none", transition: "background 0.15s ease, color 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(var(--secondary))"; e.currentTarget.style.color = "hsl(var(--primary))"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(var(--text-secondary))"; }}>
                  <span style={{ color: "inherit", display: "flex", flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="dropdown-separator" />
              <button
                style={{ display: "flex", alignItems: "center", gap: 10, width: "calc(100% - 8px)", margin: "1px 4px", padding: "9px 14px", borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "hsl(var(--destructive))", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500, textAlign: "left", transition: "background 0.15s ease", boxSizing: "border-box" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--destructive) / 0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <LogOut size={15} style={{ flexShrink: 0 }} />
                Sign out
              </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
