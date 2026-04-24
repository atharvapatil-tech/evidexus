import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import logo from "@/assets/logo.webp";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created. Check your email to verify.");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="" className="h-10 w-10 object-contain mb-2 opacity-90" />
          <h1 className="font-serif text-[32px] font-bold tracking-tight text-foreground">
            Evidexus<sup className="text-[10px] text-primary ml-0.5 font-sans align-super">®</sup>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {isLogin ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-full border-border"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-12 rounded-full border-border"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium text-[14px] hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                {isLogin ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[13px] text-muted-foreground hover:text-foreground"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary">{isLogin ? "Sign up" : "Sign in"}</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-10">
          For clinical decision support only. Not a substitute for professional medical judgment.
        </p>
      </div>
    </div>
  );
};

export default Auth;
