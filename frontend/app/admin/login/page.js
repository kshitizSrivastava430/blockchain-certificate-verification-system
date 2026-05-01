"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { ShieldCheck, ShieldAlert, KeyRound, User } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminLogin({ username, password });
      if (res.success) {
        // Redirect to admin dashboard
        router.push("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4 relative z-10">
      <div className="ambient-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-cyan-950/40 p-4 rounded-full border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <ShieldCheck className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Issuer Terminal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-glow">Login</span>
        </h1>
        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
          Restricted Access Area
        </p>
      </div>

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-xl border-white/10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl"></div>
        
        {error && (
          <div className="bg-red-950/50 text-red-400 p-4 rounded-lg flex items-center gap-3 border border-red-500/30 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(248,113,113,0.1)]">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Admin Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3.5 bg-[#050816]/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 shadow-inner"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Passcode
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3.5 bg-[#050816]/80 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 shadow-inner tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] mt-4"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></span>
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
