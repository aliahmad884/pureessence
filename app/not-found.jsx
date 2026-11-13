"use client";

import Link from "next/link";
import { useDataContext } from "@/context";

export default function NotFound() {
  const { loggedUser } = useDataContext();

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        background: "#ffffff",
      }}
    >
      <div style={{ fontSize: "120px", fontWeight: "bold", color: "#dfb434", lineHeight: "1" }}>
        404
      </div>
      <h1
        style={{
          marginTop: "20px",
          marginBottom: "10px",
          fontSize: "32px",
          color: "#111",
          fontWeight: "600",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          marginBottom: "30px",
          fontSize: "16px",
          color: "#555",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Sorry, we couldn&rsquo;t find the page you are looking for. It may have been moved or
        deleted.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#ffffff",
          backgroundColor: "#dfb434",
          borderRadius: "6px",
          textDecoration: "none",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c49a2e")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dfb434")}
      >
        &larr; Back to Home
      </Link>
    </div>
  );
}
