"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LogOut } from 'lucide-react';
import { adminLogout } from '@/lib/api';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isAdminArea = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/admin/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="border-b border-white/10 bg-[#050816]/90 backdrop-blur-sm sticky top-0 z-50" style={{ contain: 'layout style', willChange: 'transform' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <ShieldCheck className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-50 transition-colors">
                Block<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Cert</span>
              </span>
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link 
              href="/verify" 
              className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            >
              Verify
            </Link>
            
            {isAdminArea && !isLoginPage ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link 
                href="/admin" 
                className="relative inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-cyan-500/20 via-cyan-400/40 to-cyan-500/20 p-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 transition-transform hover:scale-105 active:scale-95"
              >
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-slate-900">
                  Admin Portal
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
