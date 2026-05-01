import { Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function IssueResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
      <div className="bg-cyan-950/40 px-6 py-4 flex items-center gap-3 border-b border-cyan-500/20">
        <CheckCircle2 className="w-6 h-6 text-cyan-400" />
        <h3 className="font-bold text-cyan-50 text-lg tracking-wide">Certificate Minted Successfully</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1 font-mono flex items-center justify-between">
                <span>Certificate ID</span>
                {copied && <span className="text-xs text-cyan-400 animate-pulse">Copied!</span>}
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm bg-[#050816] border border-white/10 px-3 py-2 rounded-md flex-1 text-cyan-300">
                  {result.certificateId}
                </p>
                <button 
                  onClick={() => copyToClipboard(result.certificateId)}
                  className="p-2 bg-[#050816] border border-white/10 rounded-md text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1 font-mono">Transaction Hash</p>
              <p className="font-mono text-xs bg-[#050816] border border-white/10 px-3 py-2 rounded-md break-all text-slate-300">
                {result.transactionHash}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1 font-mono">Document Hash</p>
              <p className="font-mono text-xs bg-[#050816] border border-white/10 px-3 py-2 rounded-md break-all text-slate-300">
                {result.documentHash}
              </p>
            </div>

            <div className="pt-2">
              <a 
                href={result.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-medium hover:underline underline-offset-4 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open Public Verification Portal
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3 bg-[#050816]/60 p-6 rounded-xl border border-white/10">
            <p className="text-sm font-medium text-cyan-400 tracking-wider uppercase">Verification Matrix</p>
            <div className="bg-white p-2 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Image 
                src={result.qrData} 
                alt="Verification QR Code" 
                width={150} 
                height={150}
                className="rounded-md"
              />
            </div>
            <p className="text-xs text-slate-400 text-center max-w-[150px] font-mono">
              Scan to decrypt & verify
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
