'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { generateTimeSlots, isDayClosed } from '@/lib/calendarUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', time: '', reason: 'checkup', isNewPatient: false
  });

  const slots = generateTimeSlots(selectedDate);
  const dayClosed = isDayClosed(new Date(selectedDate + 'T00:00:00'));

  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. If New Patient, create record in Patients table
      if (form.isNewPatient) {
        await supabase.from('patients').insert([{
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          registration_status: 'pending'
        }]);
        // Logic for sending the Registration Link (Dummy link)
        console.log("Email Sent: Please complete your registration at https://docs.google.com/document/d/demo-secured-link");
      }

      // 2. Add record to Appointments table
      const { error: apptError } = await supabase.from('appointments').insert([{
        patient_name: form.name,
        appointment_date: selectedDate,
        appointment_time: form.time,
        reason: form.reason,
        phone_number: form.phone
      }]);

      if (apptError) throw apptError;

      // 3 & 4. SMS and Email Confirmation (Simulated via console/Make.com)
      console.log(`SMS to ${form.phone}: Your appt at Canuck Dentist is confirmed for ${form.time}.`);
      console.log(`Email to ${form.email}: Detailed confirmation sent.`);

      // 5. Show success and hide form
      setIsBooked(true);

    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isBooked) {
    return (
      <div className="p-10 text-center animate-fade-in">
        <div className="flex justify-center mb-4"><CheckCircle2 size={64} className="text-green-500"/></div>
        <h2 className="text-3xl font-bold text-slate-900">Appointment Booked!</h2>
        <p className="text-slate-500 mt-2">Check your phone and email for confirmation details.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {step === 1 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">1. Choose Date & Time</h2>
          <input 
            type="date" 
            className="input-field" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {dayClosed ? (
            <div className="p-4 bg-slate-50 text-slate-500 rounded-xl flex items-center gap-2">
              <AlertCircle size={18}/> Clinic is closed on this day (Sat/Sun).
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map(s => (
                <button key={s} onClick={() => { setForm({...form, time: s}); setStep(2); }} className="p-3 border rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleFinalBooking} className="space-y-4">
          <h2 className="text-xl font-bold">2. Complete Details</h2>
          <input required placeholder="Full Name" className="input-field" onChange={e => setForm({...form, name: e.target.value})}/>
          <input required type="email" placeholder="Email" className="input-field" onChange={e => setForm({...form, email: e.target.value})}/>
          <input required type="tel" placeholder="Phone" className="input-field" onChange={e => setForm({...form, phone: e.target.value})}/>
          
          <select className="input-field" onChange={e => setForm({...form, reason: e.target.value})}>
            <option value="checkup">Checkup</option>
            <option value="emergency">Emergency</option>
            <option value="follow-up">Follow-up</option>
          </select>

          <label className="flex items-center gap-2 p-2 border rounded-xl cursor-pointer hover:bg-slate-50">
            <input type="checkbox" className="w-5 h-5" onChange={e => setForm({...form, isNewPatient: e.target.checked})}/>
            <span className="text-sm font-medium">I'm a new patient</span>
          </label>

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={() => setStep(1)} className="flex-1 p-3 bg-slate-100 rounded-xl font-bold">Back</button>
            <button type="submit" disabled={loading} className="flex-[2] btn-primary">
              {loading ? 'Processing...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}