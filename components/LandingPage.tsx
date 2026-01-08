'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight,
  HeartPulse,
  Sparkles,
  Stethoscope,
  X
} from 'lucide-react';
import BookingForm from './BookingForm';

const LandingPage = () => {
  // --- 1. STATE MANAGEMENT ---
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const toggleModal = () => setIsBookingOpen(!isBookingOpen);

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">
      
      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
              <Sparkles size={16} /> Now accepting new patients in Vancouver
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
              Modern Dentistry <br />
              <span className="text-blue-600">With a Human Touch.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Experience dental care powered by AI-driven precision and a team that genuinely cares.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* --- 3. TRIGGER BUTTON --- */}
              <button 
                onClick={toggleModal}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 group"
              >
                Book Appointment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Our Services
              </button>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070" 
                alt="Modern Dental Office" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. BOOKING MODAL --- */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={toggleModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <button 
              onClick={toggleModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 z-10"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <BookingForm onSuccess={toggleModal} />
            </div>
          </div>
        </div>
      )}

      {/* 5. ADDITIONAL SECTIONS (Simplified) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <HeartPulse className="text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Emergency Care</h3>
            <p className="text-slate-500 text-sm">Same-day appointments for urgent dental needs.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <Clock className="text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Flexible Hours</h3>
            <p className="text-slate-500 text-sm">Open late and on Saturdays for your convenience.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <MapPin className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Central Location</h3>
            <p className="text-slate-500 text-sm">Located in the heart of Downtown Vancouver.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;