const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[#050816]/90 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-sm text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} BlockCert Protocol. Immutable Verification.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            System Operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
