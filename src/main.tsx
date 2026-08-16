import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Quiz = lazy(() => import("./pages/Quiz.tsx"));
const Results = lazy(() => import("./pages/Results.tsx"));
const CareerExplorer = lazy(() => import("./pages/CareerExplorer.tsx"));
const CareerProfile = lazy(() => import("./pages/CareerProfile.tsx"));
const CareerReport = lazy(() => import("./pages/CareerReport.tsx"));
const Compare = lazy(() => import("./pages/Compare.tsx"));
const CareerVs = lazy(() => import("./pages/CareerVs.tsx"));
const FieldGuide = lazy(() => import("./pages/FieldGuide.tsx"));
const ForParents = lazy(() => import("./pages/ForParents.tsx"));
const Saved = lazy(() => import("./pages/Saved.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



// Reset scroll on route change (pathname only, so in-page #anchors still work)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  // Canonical URL — self-canonicalises every route (origin + clean pathname).
  useEffect(() => {
    const href = `${window.location.origin}${location.pathname}`;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <ScrollToTop />
          <RouteSyncer />
          <MotionConfig reducedMotion="user">
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/saved" />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/careers" element={<CareerExplorer />} />
              <Route path="/careers/:id" element={<CareerProfile />} />
              <Route path="/careers/:id/report" element={<CareerReport />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/vs/:slug" element={<CareerVs />} />
              <Route path="/field-guide" element={<FieldGuide />} />
              <Route path="/for-parents" element={<ForParents />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </MotionConfig>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);
