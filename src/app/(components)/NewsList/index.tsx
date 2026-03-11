"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Article, NewsApiResponse } from "@/types/news";
import NewsCard from "../NewsCard/index";

/* ─────────────────────────────────────────────
   Skeleton card
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div
        style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            overflow: "hidden",
        }}
    >
        {/* Image skeleton */}
        <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
        {/* Content skeleton */}
        <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="skeleton" style={{ height: 18, width: "80%", borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 18, width: "60%", borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 14, width: "100%", borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 14, width: "90%", borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 14, width: "75%", borderRadius: 8 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "30%", borderRadius: 6 }} />
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   Error state
───────────────────────────────────────────── */
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div
        style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
        }}
    >
        <span style={{ fontSize: 48 }}>📰</span>
        <h3 style={{ fontSize: 18, color: "hsl(var(--foreground))" }}>Could not load news</h3>
        <p className="body-3" style={{ color: "hsl(var(--text-muted))", maxWidth: 380 }}>
            {message}
        </p>
        <button
            onClick={onRetry}
            className="btn-primary"
            style={{ padding: "10px 24px", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-mono)" }}
        >
            Try again
        </button>
    </div>
);

/* ─────────────────────────────────────────────
   NewsList
───────────────────────────────────────────── */
interface NewsListProps {
    category?: string;
    query?: string;
    pageSize?: number;
}

const NewsList = ({ category = "general", query, pageSize = 12 }: NewsListProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
            const params: Record<string, string | number> = {
                apiKey: apiKey!,
                pageSize,
                language: "en",
            };

            let url: string;
            if (query) {
                url = "https://newsapi.org/v2/everything";
                params.q = query;
                params.sortBy = "publishedAt";
            } else {
                url = "https://newsapi.org/v2/top-headlines";
                params.category = category;
                params.country = "us";
            }

            const { data } = await axios.get<NewsApiResponse>(url, { params });

            if (data.status !== "ok") throw new Error("News API returned an error.");

            // filter out removed articles
            const clean = data.articles.filter(
                (a) => a.title && a.title !== "[Removed]" && a.url !== "https://removed.com"
            );
            setArticles(clean);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, query, pageSize]);

    /* ── Responsive grid ── */
    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        gap: 24,
    };

    if (loading) {
        return (
            <div style={gridStyle}>
                {Array.from({ length: pageSize > 6 ? 6 : pageSize }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div style={gridStyle}>
                <ErrorState message={error} onRetry={fetchNews} />
            </div>
        );
    }

    if (!articles.length) {
        return (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <p className="body-3" style={{ color: "hsl(var(--text-muted))" }}>
                    No articles found.
                </p>
            </div>
        );
    }

    return (
        <div style={gridStyle}>
            {articles.map((article, i) => (
                <NewsCard key={`${article.url}-${i}`} article={article} index={i} />
            ))}
        </div>
    );
};

export default NewsList;
