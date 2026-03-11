"use client";

type HeaderProps = {
  name:        string;
  description?: string;
};

const Header = ({ name, description }: HeaderProps) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          color:      "hsl(var(--foreground))",
          margin:      0,
          lineHeight:  1.2,
        }}
      >
        {name}
      </h2>
      {description && (
        <p
          className="body-3"
          style={{
            color:     "hsl(var(--text-muted))",
            margin:    "4px 0 0",
            fontSize:   13,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default Header;