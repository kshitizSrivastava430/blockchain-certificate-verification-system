"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Search, ShieldAlert, CheckCircle2, Terminal } from "lucide-react";
import { issueCertificate, getCertificates, revokeCertificate } from "@/lib/api";
import IssueResultCard from "@/components/IssueResultCard";
import Loader from "@/components/Loader";
import StatusBadge from "@/components/StatusBadge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatDate } from "@/lib/helpers";

const COURSE_OPTIONS = [
  "B.Tech Computer Science Engineering (CSE)",
  "B.Tech Information Technology (IT)",
  "B.Tech Electronics and Communication Engineering (ECE)",
  "B.Tech Electrical Engineering (EE)",
  "B.Tech Mechanical Engineering (ME)",
  "B.Tech Civil Engineering (CE)",
  "B.Tech Artificial Intelligence & Data Science (AI/DS)",
  "B.Tech Artificial Intelligence & Machine Learning (AI/ML)",
  "B.Tech Cyber Security",
  "B.Tech Data Science",
  "BCA",
  "MCA",
  "BBA",
  "MBA",
  "B.Com",
  "M.Com",
  "B.Sc Computer Science",
  "B.Sc Information Technology",
  "BA",
  "MA",
  "Diploma in Computer Science",
  "Diploma in Mechanical Engineering",
  "Diploma in Civil Engineering",
  "Other"
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("issue"); // 'issue' | 'list'
  
  // Issue Form State
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    course: "",
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: `CERT-${Math.floor(Math.random() * 100000)}`,
  });
  const [customCourse, setCustomCourse] = useState("");
  const [file, setFile] = useState(null);
  const [issuing, setIssuing] = useState(false);
  const [issueResult, setIssueResult] = useState(null);
  const [error, setError] = useState("");

  // List State
  const [certificates, setCertificates] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  useEffect(() => {
    if (activeTab === "list") {
      fetchCertificates();
    }
  }, [activeTab]);

  const fetchCertificates = async () => {
    try {
      setLoadingList(true);
      const res = await getCertificates();
      setCertificates(res.data || []);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course) {
      setError("Please select a Program Designation");
      return;
    }
    if (formData.course === "Other" && !customCourse.trim()) {
      setError("Please specify the custom course name");
      return;
    }
    if (!file) {
      setError("Payload missing: PDF file required");
      return;
    }
    
    setError("");
    setIssuing(true);
    setIssueResult(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "course" && formData.course === "Other") {
          data.append(key, customCourse);
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append("certificate", file);

      const res = await issueCertificate(data);
      if (res.success) {
        setIssueResult(res);
        setFormData({
          ...formData,
          studentName: "",
          rollNo: "",
          course: "",
          certificateId: `CERT-${Math.floor(Math.random() * 100000)}`
        });
        setCustomCourse("");
        setFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Transaction reverted: Ensure node is synced and contract is active.");
    } finally {
      setIssuing(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("WARNING: Irreversible Action. Confirm revocation of certificate hash on mainnet?")) {
      return;
    }

    try {
      setRevokingId(id);
      await revokeCertificate(id);
      await fetchCertificates(); // Refresh list
    } catch (err) {
      alert("Revocation Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setRevokingId(null);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-[#050816]/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 font-mono text-sm shadow-inner";

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-12 w-full relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              Issuer Terminal
            </h1>
            <p className="text-cyan-400/80 font-mono text-sm uppercase tracking-widest">Secure Admin Interface // Node Active</p>
          </div>
          <div className="flex bg-slate-900/80 p-1.5 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <button
              onClick={() => setActiveTab("issue")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "issue" ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"
              }`}
            >
              Mint Certificate
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === "list" ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.4)]" : "text-slate-400 hover:text-white"
              }`}
            >
              Ledger History
            </button>
          </div>
        </div>

        {activeTab === "issue" && (
          <div className="space-y-8 max-w-4xl relative z-10">
            {error && (
              <div className="bg-red-950/50 text-red-400 p-4 rounded-lg flex items-center gap-3 border border-red-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(248,113,113,0.2)]">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p className="font-mono text-sm">{error}</p>
              </div>
            )}

            {issueResult && (
              <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                <IssueResultCard result={issueResult} />
              </div>
            )}

            <div className="glass-panel p-8 rounded-2xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 tracking-wide">
                <UploadCloud className="w-6 h-6 text-cyan-400" />
                Payload Ingestion Module
              </h2>

              <form onSubmit={handleIssueSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Subject Name</label>
                    <input
                      type="text"
                      required
                      className={inputClasses}
                      placeholder="Enter full name"
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Identifier / Roll No.</label>
                    <input
                      type="text"
                      required
                      className={inputClasses}
                      placeholder="e.g. CS2024-001"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Program Designation</label>
                    <select
                      required
                      className={`${inputClasses} cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white`}
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                    >
                      <option value="" disabled>Select Course / Program</option>
                      {COURSE_OPTIONS.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                  {formData.course === "Other" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Custom Course / Program</label>
                      <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="Enter custom course name"
                        value={customCourse}
                        onChange={(e) => setCustomCourse(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Timestamp</label>
                    <input
                      type="date"
                      required
                      className={inputClasses}
                      style={{ colorScheme: 'dark' }}
                      value={formData.issueDate}
                      onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex justify-between">
                      <span>Unique Hash ID</span>
                      <span className="text-slate-500">Auto-Generated</span>
                    </label>
                    <input
                      type="text"
                      required
                      className={`${inputClasses} bg-slate-900/50 text-cyan-300 font-bold`}
                      value={formData.certificateId}
                      onChange={(e) => setFormData({...formData, certificateId: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Source Document (PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-white/20 rounded-xl hover:border-cyan-400/50 hover:bg-cyan-950/10 transition-all group">
                    <div className="space-y-3 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-500 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      <div className="flex text-sm justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none">
                          <span>Select Payload File</span>
                          <input 
                            type="file" 
                            accept="application/pdf"
                            required 
                            className="sr-only" 
                            onChange={(e) => setFile(e.target.files[0])}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        {file ? <span className="font-semibold text-cyan-300">{file.name}</span> : "Strictly PDF (Max 10MB)"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={issuing}
                    className="bg-cyan-500 text-slate-950 px-8 py-3.5 rounded-lg font-bold hover:bg-cyan-400 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                  >
                    {issuing ? (
                      <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></span> Committing to Chain...</>
                    ) : (
                      <>Sign & Mint Certificate</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="glass-panel rounded-2xl overflow-hidden relative z-10">
            {loadingList ? (
              <div className="p-16 flex justify-center">
                <Loader text="Syncing Blockchain Ledger..." />
              </div>
            ) : certificates.length === 0 ? (
              <div className="p-16 text-center text-slate-500 font-mono flex flex-col items-center">
                <Terminal className="w-16 h-16 mb-4 opacity-20 text-cyan-500" />
                <p className="text-lg">No entries found in local state.</p>
                <p className="text-sm opacity-60 mt-2">Mint a new certificate to populate the ledger.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-white/10 text-xs uppercase tracking-wider text-cyan-500">
                      <th className="p-5 font-semibold">Certificate ID</th>
                      <th className="p-5 font-semibold">Subject</th>
                      <th className="p-5 font-semibold">Program</th>
                      <th className="p-5 font-semibold">Timestamp</th>
                      <th className="p-5 font-semibold">State</th>
                      <th className="p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {certificates.map((cert) => (
                      <tr key={cert.certificateId} className="hover:bg-white/5 transition-colors">
                        <td className="p-5 font-mono text-sm text-cyan-100">{cert.certificateId}</td>
                        <td className="p-5 text-white font-medium">{cert.studentName}</td>
                        <td className="p-5 text-slate-400 text-sm">{cert.course}</td>
                        <td className="p-5 text-slate-400 text-sm font-mono">{cert.issueDate}</td>
                        <td className="p-5">
                          <StatusBadge status={cert.revoked ? 'REVOKED' : 'VALID'} />
                        </td>
                        <td className="p-5 text-right">
                          {!cert.revoked ? (
                            <button
                              onClick={() => handleRevoke(cert.certificateId)}
                              disabled={revokingId === cert.certificateId}
                              className="text-sm px-4 py-1.5 rounded bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 font-medium border border-red-500/20 disabled:opacity-50 transition-colors"
                            >
                              {revokingId === cert.certificateId ? "Revoking..." : "Revoke"}
                            </button>
                          ) : (
                            <span className="text-sm text-slate-600 font-mono">Burned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
