import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function StatusBadge({ status }) {
  if (status === "VALID") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/50 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        VALID
      </span>
    );
  }

  if (status === "REVOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/50 text-red-400 border border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.2)]">
        <XCircle className="w-3.5 h-3.5" />
        REVOKED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-600">
      <Clock className="w-3.5 h-3.5" />
      UNKNOWN
    </span>
  );
}
