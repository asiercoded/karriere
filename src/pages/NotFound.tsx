import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-display text-7xl font-bold tracking-tight text-saffron md:text-8xl">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">This page isn&rsquo;t in the file.</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground leading-relaxed">
            The index, the match, and the compare desk are all still open.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate("/")} className="rounded-full px-6">
              Back to the front page
            </Button>
            <Button variant="outline" onClick={() => navigate("/careers")} className="rounded-full px-6">
              Browse careers
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
