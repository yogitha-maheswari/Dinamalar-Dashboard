import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "general";
  const query = searchParams.get("query");
  const pageSize = searchParams.get("pageSize") || "12";
  const language = searchParams.get("language") || "en";
  const country = searchParams.get("country") || "us";

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { status: "error", message: "API key is missing" },
      { status: 500 }
    );
  }

  try {
    let url: string;
    const params: Record<string, string | number> = {
      apiKey,
      pageSize,
      language,
    };

    if (query) {
      url = "https://newsapi.org/v2/everything";
      params.q = query;
      params.sortBy = "publishedAt";
    } else {
      url = "https://newsapi.org/v2/top-headlines";
      params.category = category;
      params.country = country;
    }

    const { data } = await axios.get(url, { params });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("NewsAPI Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        status: "error", 
        message: error.response?.data?.message || "Failed to fetch news from NewsAPI" 
      },
      { status: error.response?.status || 500 }
    );
  }
}
