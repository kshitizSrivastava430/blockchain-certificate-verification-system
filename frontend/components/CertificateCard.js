import StatusBadge from "./StatusBadge";
import { truncateAddress, formatDate } from "@/lib/helpers";
import { ExternalLink, Hash, User, Calendar, ShieldCheck } from "lucide-react";

export default function CertificateCard({ certificate }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 border border-white/10 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="bg-slate-900/50 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <h3 className="font-bold text-white flex items-center gap-2 text-lg">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-cyan-50">ID: {certificate.certificateId}</span>
        </h3>
        <StatusBadge status={certificate.status} />
      </div>
      
      <div className="p-6 space-y-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#050816]/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <User className="w-3.5 h-3.5 text-cyan-500" /> Issuer Node
            </p>
            <p className="font-mono text-sm text-cyan-100 break-all">
              {certificate.issuer}
            </p>
          </div>
          <div className="bg-[#050816]/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Calendar className="w-3.5 h-3.5 text-cyan-500" /> Minted On
            </p>
            <p className="text-sm text-cyan-100 font-mono">
              {formatDate(certificate.issueTimestamp)}
            </p>
          </div>
        </div>

        <div className="bg-[#050816]/50 p-4 rounded-xl border border-white/5">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
            <Hash className="w-3.5 h-3.5 text-cyan-500" /> Cryptographic Proof (SHA-256)
          </p>
          <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">
            {certificate.documentHash}
          </p>
        </div>

        {certificate.ipfsCid && (
          <div className="pt-2">
            <a 
              href={`https://ipfs.io/ipfs/${certificate.ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/50 rounded-lg border border-cyan-500/20 text-sm font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Immutable Payload on IPFS
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
