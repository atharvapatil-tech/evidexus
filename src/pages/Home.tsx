import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TopBar from "@/components/shell/TopBar";
import PHIBanner from "@/components/shell/PHIBanner";
import UnifiedSearch from "@/components/search/UnifiedSearch";
import ModeChips from "@/components/search/ModeChips";
import CapabilityDisclosure from "@/components/search/CapabilityDisclosure";
import { MODE_META, type SearchMode } from "@/lib/searchModes";
import { runQuery } from "@/lib/runQuery";
import { useQueryTracker } from "@/hooks/useQueryTracker";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.webp";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { checkLimit, fetchStats } = useQueryTracker();

  const [mode, setMode] = useState<SearchMode>("qa");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [indiaContext, setIndiaContext] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("evidexus.indiaContext") === "true"
  );
  const [ayurvedicMode, setAyurvedicMode] = useState(false);

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    const q = value.trim();
    if (!q) return;
    const allowed = await checkLimit();
    if (!allowed) return;

    setIsLoading(true);
    try {
      localStorage.setItem("evidexus.indiaContext", String(indiaContext));
      const res = await runQuery(mode, q, { indiaContext, ayurvedicMode });
      if ("error" in res) { toast.error(res.error); return; }
      const id = res.query_id;
      if (!id) { toast.error("Could not save query."); return; }
      await fetchStats();
      navigate(`/answer/${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PHIBanner />
      <TopBar />

      <main className="flex-1 flex flex-col items-center px-5 pt-10 md:pt-20 pb-20">
        <div className="w-full max-w-[720px] flex flex-col items-center">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="" className="h-10 w-10 object-contain mb-2 opacity-90" />
            <h1 className="font-serif text-[36px] md:text-[44px] font-bold tracking-tight text-foreground">
              Evidexus<sup className="text-[12px] text-primary ml-0.5 font-sans align-super">®</sup>
            </h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              AI-powered clinical evidence engine
            </p>
          </div>

          {/* Search */}
          <div className="w-full">
            <UnifiedSearch
              value={value}
              onChange={setValue}
              onSubmit={handleSubmit}
              isLoading={isLoading || authLoading}
              placeholder={MODE_META[mode].placeholder}
              multiline={mode === "verify"}
              autoFocus
            />
          </div>

          {/* Mode chips */}
          <div className="mt-5 w-full">
            <ModeChips active={mode} onChange={(m) => { setMode(m); setValue(""); }} />
          </div>

          {/* Disclosure */}
          <div className="mt-6 w-full">
            <CapabilityDisclosure
              indiaContext={indiaContext}
              onIndiaContextChange={setIndiaContext}
              ayurvedicMode={ayurvedicMode}
              onAyurvedicChange={setAyurvedicMode}
              showIndiaContext={mode === "qa"}
              showAyurvedic={mode === "interactions"}
            />
          </div>

          {/* Example */}
          <button
            type="button"
            onClick={() => setValue(MODE_META[mode].example)}
            className="mt-8 text-[13px] text-muted-foreground hover:text-foreground italic"
          >
            Try: "{MODE_META[mode].example.split("\n")[0]}"
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
