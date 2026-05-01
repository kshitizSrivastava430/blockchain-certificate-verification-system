import Link from "next/link";
import { ArrowRight, FileCheck, Shield, UploadCloud, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4 relative">
      {/* Background ambient glow */}
      <div className="ambient-glow top-0 left-1/4 -translate-y-1/2"></div>

      <div className="max-w-5xl w-full text-center space-y-8 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-4">
          <Terminal className="w-3.5 h-3.5" />
          System Active // Status: Secure
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
          Immutable. Verifiable. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-glow">
            Next-Gen Architecture.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
          Cryptographically secure academic and professional certificates powered by <strong className="text-cyan-400 font-normal">Polygon Blockchain</strong> and <strong className="text-cyan-400 font-normal">IPFS</strong>. Zero-trust verification in milliseconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link 
            href="/verify" 
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-lg text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
          >
            Verify Certificate
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/admin" 
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg text-white glass-panel hover:bg-white/10 hover:border-cyan-400/50 transition-all shadow-lg"
          >
            Admin Portal
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 relative z-10">
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 border-white/5 hover:border-cyan-500/30 group">
          <div className="bg-slate-900 border border-white/10 p-4 rounded-xl mb-6 shadow-inner group-hover:border-cyan-500/50 transition-colors">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Immutable State</h3>
          <p className="text-slate-400 leading-relaxed font-light">Cryptographic hashes are permanently committed to the blockchain, rendering tampering or forgery mathematically impossible.</p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 border-white/5 hover:border-cyan-500/30 group">
          <div className="bg-slate-900 border border-white/10 p-4 rounded-xl mb-6 shadow-inner group-hover:border-cyan-500/50 transition-colors">
            <UploadCloud className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Decentralized Storage</h3>
          <p className="text-slate-400 leading-relaxed font-light">Payloads are pinned to the InterPlanetary File System (IPFS), ensuring perpetual availability independent of central servers.</p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl flex flex-col items-start text-left hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 border-white/5 hover:border-cyan-500/30 group">
          <div className="bg-slate-900 border border-white/10 p-4 rounded-xl mb-6 shadow-inner group-hover:border-cyan-500/50 transition-colors">
            <FileCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white tracking-wide">Zero-Trust Verification</h3>
          <p className="text-slate-400 leading-relaxed font-light">End-users can instantly validate authenticity by decrypting the cryptographic signature via the public verification portal.</p>
        </div>
      </div>

      <p className="mt-10 text-sm text-slate-500">Created by Team Eternal ❤️</p>
    </div>
  );
}
