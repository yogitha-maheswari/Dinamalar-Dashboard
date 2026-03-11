"use client";

import NewsList from "@/app/(components)/NewsList";

const Dashboard = () => {
  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            marginBottom: 6,
          }}
        >
          Top Headlines
        </h1>
        <p className="body-3" style={{ color: "hsl(var(--text-muted))" }}>
          Latest news from around the world
        </p>
      </div>

      {/* News Grid */}
      <NewsList category="general" pageSize={12} />
    </div>
  );
};

export default Dashboard;