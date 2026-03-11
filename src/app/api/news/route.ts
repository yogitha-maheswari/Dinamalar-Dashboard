import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "general";
  const query = searchParams.get("query");
  const pageSize = searchParams.get("pageSize") || "12";
  const language = searchParams.get("language") || "en";
  const country = searchParams.get("country") || "us";

  // Note: We use the key from environment variables on the server.
  // It doesn't NEED to be NEXT_PUBLIC_ if only used in this file,
  // but we'll check both for compatibility.
  const apiKey = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.error("NewsAPI Proxy: API key is missing from environment variables.");
    return NextResponse.json(
      { status: "error", message: "Server configuration error: API key missing" },
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

    // NewsAPI sometimes requires a User-Agent header when called from server environments
    const { data } = await axios.get(url, { 
      params,
      headers: {
        "User-Agent": "Dinamalar-Dashboard/1.0",
        "Accept": "application/json"
      }
    });

    if (data.status !== "ok") {
        console.warn("NewsAPI returned non-ok status:", data);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || error.message || "Unknown error";
    const errorStatus = error.response?.status || 500;

    console.error("NewsAPI Proxy Error:", {
      status: errorStatus,
      message: errorMessage,
      data: errorData
    });

    return NextResponse.json(
      { 
        status: "error", 
        message: `NewsAPI Error: ${errorMessage}`
      },
      { status: errorStatus }
    );
  }
}
