'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import AdminDashboard from '@/components/AdminDashboard';
import ChatBot from '@/components/ChatBot';
import { ShieldCheck, UserCircle } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'public' | 'admin'>('public');

  return (
    <main className="min-h-screen relative">
      {/* View Switcher (For Demo Purposes) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white/80 backdrop-blur-md border border-slate-200 p-1 rounded-full shadow-lg flex gap-1">
        <button
          onClick={() => setView('public')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            view === 'public' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCircle size={14} /> Patient View
          </div>
        </button>
        <button
          onClick={() => setView('admin')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
            view === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} /> Admin Panel
          </div>
        </button>
      </div>

      {/* Conditional Rendering based on view */}
      {view === 'public' ? (
        <>
          <LandingPage />
          <ChatBot />
        </>
      ) : (
        <AdminDashboard />
      )}

      {/* Global Footer (Visible on Public View) */}
      {view === 'public' && (
        <footer className="bg-slate-900 text-slate-400 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold mb-4">Canuck Dentist</h3>
              <p className="text-sm">Main Intersection: Bay & Dundas</p>
              <p className="text-sm">Toronto, ON M5G 1Z8</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li>Invisalign Consult</li>
                <li>Emergency Care</li>
                <li>Parking Information</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Clinic Hours</h4>
              <p className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-sm">Sat: 9:00 AM - 2:00 PM</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs">
            © 2026 Canuck Dentist Demo. Built with Next.js 15 & Supabase.
          </div>
        </footer>
      )}
    </main>
  );
}