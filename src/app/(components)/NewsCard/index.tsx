"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Article } from "@/types/news";
import { Calendar, User, ExternalLink } from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const FALLBACK_IMAGE = "/fallback-news.png";

function formatDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function slugify(title: string, index: number): string {
    return encodeURIComponent(`${index}-${title.slice(0, 60).replace(/\s+/g, "-").toLowerCase()}`);
}

/* ─────────────────────────────────────────────
   NewsCard
───────────────────────────────────────────── */
interface NewsCardProps {
    article: Article;
    index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
    const router = useRouter();
    const [imgError, setImgError] = useState(false);
    const [hovered, setHovered] = useState(false);

    const id = slugify(article.title, index);

    const handleClick = () => {
        // store article data in sessionStorage so the detail page can retrieve it
        try {
            sessionStorage.setItem(`news-${id}`, JSON.stringify({ ...article, index }));
        } catch {
            /* ignore */
        }
        router.push(`/news/${id}`);
    };

    const imageSrc =
        !imgError && article.urlToImage ? article.urlToImage : FALLBACK_IMAGE;

    return (
        <article
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s ease",
                transform: hovered ? "translateY(-6px) scale(1.012)" : "translateY(0) scale(1)",
                boxShadow: hovered
                    ? "0 20px 48px hsl(var(--primary) / 0.14), 0 4px 16px hsl(220 18% 5% / 0.10)"
                    : "0 2px 12px hsl(220 18% 5% / 0.06)",
                borderColor: hovered ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
            }}
        >
            {/* ── Image ── */}
            <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.45s ease",
                        transform: hovered ? "scale(1.07)" : "scale(1)",
                    }}
                    onError={() => setImgError(true)}
                    unoptimized={!!article.urlToImage} // external URLs
                />
                {/* Source badge */}
                <span
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "hsl(var(--card) / 0.88)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 999,
                        padding: "2px 10px",
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        color: "hsl(var(--foreground))",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                        maxWidth: "70%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {article.source.name}
                </span>
            </div>

            {/* ── Content ── */}
            <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Title */}
                <h3
                    style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: 16,
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: "hsl(var(--foreground))",
                        margin: "0 0 8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                    <p
                        className="body-3"
                        style={{
                            color: "hsl(var(--text-muted))",
                            margin: "0 0 14px",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1,
                        }}
                    >
                        {article.description}
                    </p>
                )}

                {/* Meta row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: "auto",
                        paddingTop: 12,
                        borderTop: "1px solid hsl(var(--divider))",
                    }}
                >
                    {/* Author */}
                    {article.author && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: 12,
                                color: "hsl(var(--text-secondary))",
                                fontFamily: "var(--font-body)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "55%",
                            }}
                        >
                            <User size={12} />
                            {article.author.split(",")[0]}
                        </span>
                    )}

                    {/* Date */}
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            color: "hsl(var(--text-muted))",
                            fontFamily: "var(--font-mono)",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Calendar size={12} />
                        {formatDate(article.publishedAt)}
                    </span>
                </div>

                {/* Read more hint */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "hsl(var(--primary))",
                        fontFamily: "var(--font-mono)",
                        opacity: hovered ? 1 : 0,
                        transform: hovered ? "translateX(0)" : "translateX(-6px)",
                        transition: "opacity 0.22s ease, transform 0.22s ease",
                    }}
                >
                    <ExternalLink size={12} />
                    Read full story
                </div>
            </div>
        </article>
    );
};

export default NewsCard;
