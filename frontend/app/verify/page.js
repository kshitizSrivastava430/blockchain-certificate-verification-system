"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, UploadCloud, ShieldAlert, FileText, Fingerprint } from "lucide-react";
import { verifyCertificate, verifyFile } from "@/lib/api";
import CertificateCard from "@/components/CertificateCard";
import Loader from "@/components/Loader";
import StatusBadge from "@/components/StatusBadge";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("certificateId");

  const [certificateId, setCertificateId] = useState(initialId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Bonus: File verification
  const [file, setFile] = useState(null);
  const [fileVerifyLoading, setFileVerifyLoading] = useState(false);
  const [fileVerifyResult, setFileVerifyResult] = useState(null);

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  const handleVerify = async (idToVerify) => {
    if (!idToVerify) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    setFileVerifyResult(null);
    setFile(null);

    console.log(`[DEBUG] Verify Page: Starting verification for ID: ${idToVerify}`);
    console.log(`[DEBUG] Verify Page: Fetching from base URL configured in api.js`);

    try {
      const res = await verifyCertificate(idToVerify);
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error("[DEBUG] Verify Page: Verification request failed", err);
      const backendMessage = err.response?.data?.message;

      if (err.response?.status === 404) {
        setError(`Certificate not found: "${idToVerify}" does not exist on the ledger.`);
      } else if (err.response?.status === 500) {
        setError(`Verification node error: ${backendMessage || "The backend failed to query the blockchain."}`);
      } else {
        setError(`Network error: ${backendMessage || "Could not reach the verification API."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileVerify = async () => {
    if (!file || !result) return;
    
    setFileVerifyLoading(true);
    setFileVerifyResult(null);

    try {
      const res = await verifyFile(result.certificateId, file);
      setFileVerifyResult(res);
    } catch (err) {
      alert("Verification Failed: Unable to compute file hash.");
    } finally {
      setFileVerifyLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full relative">
      <div className="ambient-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.2)] mb-6">
          <Fingerprint className="w-3.5 h-3.5" />
          Zero-Knowledge Gateway
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-glow">Certificate</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
          Query the immutable blockchain ledger to authenticate credentials instantly.
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.1)] mb-10 max-w-2xl mx-auto relative z-10 border-white/10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleVerify(certificateId); }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-cyan-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-[#050816]/80 border border-white/10 rounded-xl text-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner font-mono"
              placeholder="Enter Certificate ID (e.g. CERT-12345)"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
          >
            {loading ? "Querying Node..." : "Verify Now"}
          </button>
        </form>
      </div>

      <div className="relative z-10">
        {loading && <Loader text="Awaiting blockchain response..." />}

        {error && (
          <div className="glass-panel text-red-400 p-8 rounded-2xl flex flex-col items-center justify-center text-center border-red-500/30 mt-8 animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_20px_rgba(248,113,113,0.15)]">
            <ShieldAlert className="w-12 h-12 mb-4 text-red-500 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
            <h3 className="text-xl font-bold mb-2 tracking-wide text-white">Verification Failed</h3>
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <CertificateCard certificate={result} />

            {/* Bonus Feature: File Hash Comparison */}
            {result.status === 'VALID' && (
              <div className="glass-panel rounded-2xl p-6 md:p-8 border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-3 tracking-wide">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Cryptographic File Matcher
                </h3>
                <p className="text-slate-400 text-sm mb-8 font-light">
                  Upload the original PDF to run a local SHA-256 hash computation and compare it directly with the on-chain signature.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">Select Source PDF</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-950/50 file:text-indigo-400 hover:file:bg-indigo-900/50 border border-white/10 rounded-lg bg-[#050816]/50 cursor-pointer transition-colors"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <button
                    onClick={handleFileVerify}
                    disabled={!file || fileVerifyLoading}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 w-full sm:w-auto shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                  >
                    {fileVerifyLoading ? "Computing Hash..." : "Compare Hashes"}
                  </button>
                </div>

                {fileVerifyResult && (
                  <div className={`mt-8 p-6 rounded-xl border backdrop-blur-sm ${fileVerifyResult.match ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-950/20 border-red-500/30 shadow-[0_0_20px_rgba(248,113,113,0.1)]'}`}>
                    <h4 className={`font-bold flex items-center gap-2 mb-4 text-lg ${fileVerifyResult.match ? 'text-emerald-400' : 'text-red-400'}`}>
                      {fileVerifyResult.match ? '✓ Cryptographic Match Confirmed!' : '✗ Hash Mismatch Detected!'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-[#050816]/80 p-4 rounded-lg border border-white/5">
                        <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">On-Chain Signature</span>
                        <span className="text-slate-300 font-mono text-xs break-all">{fileVerifyResult.onChainHash}</span>
                      </div>
                      <div className="bg-[#050816]/80 p-4 rounded-lg border border-white/5">
                        <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Computed Local Hash</span>
                        <span className={`font-mono text-xs break-all ${fileVerifyResult.match ? 'text-emerald-300' : 'text-red-400'}`}>{fileVerifyResult.uploadedHash}</span>
                      </div>
                    </div>
                    {!fileVerifyResult.match && (
                      <p className="mt-4 text-sm text-red-400 border-t border-red-500/20 pt-4">
                        ALERT: The uploaded payload does not match the immutable record. It may have been forged or altered after issuance.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loader text="Initializing module..." />}>
      <VerifyContent />
    </Suspense>
  );
}
