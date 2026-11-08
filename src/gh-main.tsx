import { StrictMode, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "./styles.css";
import { getRouter } from "./router";

// Normalize trailing slash when visiting base path without slash: e.g. /faiz-sanctuary -> /faiz-sanctuary/
try {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  if (base && window.location.pathname === base) {
    window.history.replaceState(
      null,
      "",
      base + "/" + window.location.search + window.location.hash
    );
  }
} catch {
  /* ignore */
}

class RootErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: unknown) {
    console.error("Critical Root Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "3rem 1.5rem", fontFamily: "system-ui, sans-serif", textAlign: "center", color: "#1f2f57" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Shareek · شَرِيك</h1>
          <p style={{ marginTop: "0.5rem", color: "#64748b" }}>
            Updating your prayer station...
          </p>
          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch {
                /* ignore */
              }
              window.location.href = import.meta.env.BASE_URL || "/";
            }}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "9999px",
              backgroundColor: "#2ca57b",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Client-only entry used for the GitHub Pages build (vite.config.gh.ts).
const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <RootErrorBoundary>
        <RouterProvider router={getRouter()} />
      </RootErrorBoundary>
    </StrictMode>,
  );
}
