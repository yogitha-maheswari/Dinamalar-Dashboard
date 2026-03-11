"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Article } from "@/types/news";
import {
    ArrowLeft,
    Calendar,
    User,
    ExternalLink,
    Globe,
    Clock,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const FALLBACK_IMAGE = "/fallback-news.png";

function formatDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function formatTime(iso: string): string {
    try {
        return new Intl.DateTimeFormat("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(iso));
    } catch {
        return "";
    }
}

function cleanContent(content: string | null): string {
    if (!content) return "";
    // NewsAPI truncates content with " [+XXXX chars]" – strip it
    return content.replace(/\s*\[.*?\]\s*$/, "").trim();
}

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
const Skeleton = ({ h, w = "100%" }: { h: number; w?: string }) => (
    <div className="skeleton" style={{ height: h, width: w, borderRadius: 8 }} />
);

const DetailSkeleton = () => (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
        <Skeleton h={24} w="120px" />
        <div style={{ height: 360, marginTop: 28, borderRadius: 18 }} className="skeleton" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 28 }}>
            <Skeleton h={36} w="90%" />
            <Skeleton h={36} w="70%" />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <Skeleton h={16} w="120px" />
                <Skeleton h={16} w="100px" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} h={14} w={i % 3 === 2 ? "70%" : "100%"} />
                ))}
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   NewsDetail
───────────────────────────────────────────── */
export default function NewsDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = decodeURIComponent(params.id ?? "");

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    /* ── 1. Try sessionStorage first (populated by NewsCard) ── */
    useEffect(() => {
        const cached = sessionStorage.getItem(`news-${params.id}`);
        if (cached) {
            try {
                setArticle(JSON.parse(cached));
                setLoading(false);
                return;
            } catch {
                /* fall through to API */
            }
        }

        /* ── 2. Fallback: re-fetch from API and find by index ── */
        (async () => {
            try {
                const indexPart = id.split("-")[0];
                const index = parseInt(indexPart, 10);
                const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
                const { data } = await axios.get("/api/news", {
                    params: { pageSize: 20, language: "en", category: "general", country: "us" },
                });
                const articles: Article[] = data.articles ?? [];
                const found = articles[index] ?? articles[0] ?? null;
                setArticle(found);
            } catch {
                setArticle(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, params.id]);

    if (loading) return <DetailSkeleton />;

    if (!article) {
        return (
            <div
                style={{
                    maxWidth: 600,
                    margin: "60px auto",
                    textAlign: "center",
                    padding: "0 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <span style={{ fontSize: 56 }}>📰</span>
                <h2 style={{ color: "hsl(var(--foreground))" }}>Article not found</h2>
                <p className="body-3" style={{ color: "hsl(var(--text-muted))" }}>
                    This article may have been removed or the link is no longer valid.
                </p>
                <button
                    onClick={() => router.back()}
                    className="btn-primary"
                    style={{ padding: "10px 28px", fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600 }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const imageSrc = !imgError && article.urlToImage ? article.urlToImage : FALLBACK_IMAGE;
    const content = cleanContent(article.content);

    return (
        <main
            style={{
                maxWidth: 860,
                margin: "0 auto",
                padding: "0 24px 80px",
                fontFamily: "var(--font-body)",
            }}
        >
            {/* ── Back button ── */}
            <button
                onClick={() => router.back()}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 28,
                    background: "hsl(var(--secondary))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 999,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    color: "hsl(var(--text-secondary))",
                    cursor: "pointer",
                    transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "hsl(var(--primary))";
                    e.currentTarget.style.color = "hsl(var(--primary-foreground))";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "hsl(var(--secondary))";
                    e.currentTarget.style.color = "hsl(var(--text-secondary))";
                }}
            >
                <ArrowLeft size={15} />
                Back to News
            </button>

            {/* ── Hero image ── */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(220px, 45vw, 440px)",
                    borderRadius: 18,
                    overflow: "hidden",
                    marginBottom: 36,
                    boxShadow: "0 12px 40px hsl(220 18% 5% / 0.14)",
                }}
            >
                <Image
                    src={imageSrc}
                    alt={article.title}
                    fill
                    sizes="(max-width: 860px) 100vw, 860px"
                    style={{ objectFit: "cover" }}
                    onError={() => setImgError(true)}
                    unoptimized={!!article.urlToImage}
                    priority
                />
                {/* Source overlay */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, hsl(220 18% 5% / 0.72) 0%, transparent 100%)",
                        padding: "32px 20px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: "hsl(var(--card) / 0.88)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 999,
                            padding: "4px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: "var(--font-mono)",
                            color: "hsl(var(--primary))",
                        }}
                    >
                        <Globe size={12} />
                        {article.source.name}
                    </span>
                </div>
            </div>

            {/* ── Article header ── */}
            <header style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        fontSize: "clamp(18px, 4vw, 32px)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: "hsl(var(--foreground))",
                        marginBottom: 18,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {article.title}
                </h1>

                {/* Meta row */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 16,
                        alignItems: "center",
                        paddingBottom: 18,
                        borderBottom: "1px solid hsl(var(--divider))",
                    }}
                >
                    {article.author && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 7,
                                fontSize: "clamp(11px, 2vw, 13px)",
                                color: "hsl(var(--text-secondary))",
                                fontWeight: 600,
                            }}
                        >
                            <User size={14} style={{ color: "hsl(var(--primary))" }} />
                            {article.author.split(",")[0]}
                        </span>
                    )}

                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: "clamp(11px, 2vw, 13px)",
                            color: "hsl(var(--text-muted))",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        <Calendar size={14} style={{ color: "hsl(var(--primary))" }} />
                        {formatDate(article.publishedAt)}
                    </span>

                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: "clamp(11px, 2vw, 13px)",
                            color: "hsl(var(--text-muted))",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        <Clock size={14} style={{ color: "hsl(var(--primary))" }} />
                        {formatTime(article.publishedAt)}
                    </span>
                </div>
            </header>

            {/* ── Body ── */}
            <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Description (lead paragraph) */}
                {article.description && (
                    <p
                        style={{
                            fontSize: "clamp(14px, 3vw, 18px)",
                            fontWeight: 500,
                            lineHeight: 1.7,
                            color: "hsl(var(--foreground))",
                            borderLeft: "3px solid hsl(var(--primary))",
                            paddingLeft: 18,
                            margin: 0,
                        }}
                    >
                        {article.description}
                    </p>
                )}

                {/* Main content */}
                {content ? (
                    content.split(". ").reduce<string[][]>((acc, sentence, i) => {
                        const pIdx = Math.floor(i / 4);
                        if (!acc[pIdx]) acc[pIdx] = [];
                        acc[pIdx].push(sentence);
                        return acc;
                    }, []).map((sentences, pi) => (
                        <p
                            key={pi}
                            style={{
                                fontSize: "clamp(13px, 2.5vw, 16px)",
                                lineHeight: 1.8,
                                color: "hsl(var(--text-secondary))",
                                margin: 0,
                            }}
                        >
                            {sentences.join(". ").trim()}
                            {!sentences[sentences.length - 1].endsWith(".") ? "." : ""}
                        </p>
                    ))
                ) : (
                    <p
                        style={{
                            fontSize: "clamp(13px, 2.5vw, 16px)",
                            lineHeight: 1.8,
                            color: "hsl(var(--text-muted))",
                            fontStyle: "italic",
                            margin: 0,
                        }}
                    >
                        The full article content is available at the source. Click the button below to read more.
                    </p>
                )}
            </section>

            {/* ── Read full article button ── */}
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid hsl(var(--divider))" }}>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "clamp(10px, 2vw, 13px) clamp(16px, 4vw, 28px)",
                        background: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        borderRadius: 12,
                        fontSize: "clamp(12px, 2vw, 14px)",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        textDecoration: "none",
                        transition: "background 0.2s ease, transform 0.18s ease, box-shadow 0.2s ease",
                        boxShadow: "0 4px 16px hsl(var(--primary) / 0.25)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "hsl(var(--primary-hover))";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px hsl(var(--primary) / 0.35)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "hsl(var(--primary))";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px hsl(var(--primary) / 0.25)";
                    }}
                >
                    <ExternalLink size={16} />
                    Read Full Article on {article.source.name}
                </a>
            </div>
        </main>
    );
}
