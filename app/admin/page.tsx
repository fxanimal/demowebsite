'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, Calendar, AlertCircle, Clock, 
  TrendingUp, CheckCircle, Activity, Star 
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingConfirmations: 0,
    noShowRate: 0,
    reviewsThisWeek: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Realtime subscription: Updates the UI automatically when a patient books or confirms via SMS
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Appointments' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's appointments with patient details
      const { data: appts, error } = await supabase
        .from('Appointments')
        .select(`
          *,
          Patients (fullname, phoneNumber, email)
        `)
        .eq('appointmentDate', today)
        .order('appointmentTime', { ascending: true });

      if (appts) {
        setAppointments(appts);
        
        // Calculate real-time stats
        const total = appts.length;
        const pending = appts.filter(a => a.status === 'pending').length;
        const noShows = appts.filter(a => a.status === 'no-show').length;

        setStats({
          todayAppointments: total,
          pendingConfirmations: pending,
          noShowRate: total > 0 ? (noShows / total) * 100 : 0,
          reviewsThisWeek: 8 // Simulated stat
        });
      }
    } catch (err) {
      console.error('Dashboard Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (apptId, newStatus) => {
    const { error } = await supabase
      .from('Appointments')
      .update({ status: newStatus })
      .eq('id', apptId);
    
    if (error) alert("Failed to update status");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Clinic Admin Dashboard</h1>
          <p className="text-gray-500">Practice insights and real-time operations for Canuck Dentist</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Today's Appts" value={stats.todayAppointments} icon={<Calendar className="text-blue-600" />} />
          <StatCard title="Pending Confirmation" value={stats.pendingConfirmations} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
          <StatCard title="No-Show Rate" value={`${stats.noShowRate.toFixed(1)}%`} icon={<TrendingUp className="text-red-600" />} color="bg-red-50" />
          <StatCard title="Weekly Reviews" value={stats.reviewsThisWeek} icon={<Star className="text-green-600" />} color="bg-green-50" />
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-gray-800">Daily Schedule</h2>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Live Updates Active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Automation</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700">{appt.appointmentTime}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{appt.Patients.fullname}</div>
                      <div className="text-xs text-gray-500">{appt.service_type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <ActivityIcon active={appt.status === 'confirmed'} label="SMS Sent" />
                        <ActivityIcon active={appt.status === 'completed'} label="Review Sent" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                        className="text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="no-show">No-Show</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Automation Logs Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="text-blue-600" /> No-Show Prevention Status
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <LogItem label="24h SMS Reminders" status="Active" />
            <LogItem label="Insurance Verification AI" status="Running" />
            <LogItem label="Post-Visit Aftercare" status="Active" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const StatCard = ({ title, value, icon, color = "bg-blue-50" }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const themes = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    "no-show": "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${themes[status]}`}>
      {status}
    </span>
  );
};

const ActivityIcon = ({ active, label }) => (
  <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-gray-200'}`} title={label} />
);

const LogItem = ({ label, status }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
      <CheckCircle size={12} /> {status}
    </span>
  </div>
);