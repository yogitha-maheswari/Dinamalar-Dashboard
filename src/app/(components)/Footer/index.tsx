"use client";

import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa6";

const footerLinks = {
  News: [
    { label: "Top Headlines", href: "/dashboard" },
    { label: "India", href: "/dashboard" },
    { label: "World", href: "/dashboard" },
    { label: "Sports", href: "/dashboard" },
    { label: "Technology", href: "/dashboard" },
    { label: "Business", href: "/dashboard" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Advertise", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid hsl(var(--border))",
        background: "hsl(var(--background))",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Top Section ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px) clamp(32px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "clamp(40px, 6vw, 100px)",
          }}
        >
          {/* ── LEFT: Brand ── */}
          <div style={{ maxWidth: 250, flex: "0 0 auto" }}>
            {/* Logo */}
            <div
              style={{
                background: "#ffffff",
                padding: "6px 10px",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Image
                src="/logo/dinamalar-logo.png"
                alt="Dinamalar"
                width={140}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </div>

            <p
              style={{
                fontSize: "clamp(13px, 2vw, 14px)",
                lineHeight: 1.75,
                color: "hsl(var(--text-muted))",
                margin: "0 0 20px",
              }}
            >
              Dinamalar - your trusted source for breaking news, in-depth analysis, and real-time updates from India and around the world.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: <FaXTwitter size={15} />, label: "Twitter", href: "#" },
                { icon: <FaFacebookF size={15} />, label: "Facebook", href: "#" },
                { icon: <FaInstagram size={15} />, label: "Instagram", href: "#" },
                { icon: <FaYoutube size={15} />, label: "YouTube", href: "#" },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    background: "hsl(var(--secondary))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--text-muted))",
                    transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "hsl(var(--primary))";
                    e.currentTarget.style.color = "hsl(var(--primary-foreground))";
                    e.currentTarget.style.borderColor = "hsl(var(--primary))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "hsl(var(--secondary))";
                    e.currentTarget.style.color = "hsl(var(--text-muted))";
                    e.currentTarget.style.borderColor = "hsl(var(--border))";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="mr-50"></div>

          {/* ── RIGHT: Link columns ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "clamp(24px, 4vw, 48px)",
              flex: "2 1 400px",
            }}
          >
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "hsl(var(--text-muted))",
                    marginBottom: 14,
                  }}
                >
                  {title}
                </h4>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        style={{
                          fontSize: "clamp(13px, 2vw, 14px)",
                          color: "hsl(var(--text-secondary))",
                          textDecoration: "none",
                          transition: "color 0.18s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "hsl(var(--primary))";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "hsl(var(--text-secondary))";
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        style={{
          borderTop: "1px solid hsl(var(--border))",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "clamp(14px, 2vw, 20px) clamp(16px, 4vw, 40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p
            style={{
              fontSize: "clamp(11px, 1.8vw, 12px)",
              fontFamily: "var(--font-mono)",
              color: "hsl(var(--text-muted))",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            © {new Date().getFullYear()} Dinamalar. All rights reserved.
          </p>

          <p
            style={{
              fontSize: "clamp(11px, 1.8vw, 12px)",
              fontFamily: "var(--font-mono)",
              color: "hsl(var(--text-muted))",
              margin: 0,
              letterSpacing: "0.04em",
            }}
          >
            Powered by{" "}
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "hsl(var(--primary))", textDecoration: "none" }}
            >
              NewsAPI.org
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};