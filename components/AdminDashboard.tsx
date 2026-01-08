'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, Calendar, AlertCircle, CheckCircle, 
  TrendingUp, Clock, MessageSquare, MoreVertical 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingConfirmations: 0,
    noShowRate: 0,
    recentReviews: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Set up Realtime listener for appointment changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Appointments' }, () => {
        fetchDashboardData(); // Refresh data on any change
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: appts, error } = await supabase
        .from('Appointments')
        .select(`
          *,
          Patients (fullname, phoneNumber)
        `)
        .eq('appointmentDate', today)
        .order('appointmentTime', { ascending: true });

      if (appts) {
        setAppointments(appts);
        
        // Calculate dynamic stats
        const pending = appts.filter(a => a.status === 'pending').length;
        const total = appts.length;
        const noShows = appts.filter(a => a.status === 'no-show').length;

        setStats({
          todayAppointments: total,
          pendingConfirmations: pending,
          noShowRate: total > 0 ? (noShows / total) * 100 : 0,
          recentReviews: 12 // Dummy stat for demo
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    await supabase.from('Appointments').update({ status: newStatus }).eq('id', id);
    // Realtime listener will handle UI update
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Clinic Overview</h1>
          <p className="text-slate-500">Real-time practice management for Canuck Dentist</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={<Calendar className="text-blue-600" />} />
          <StatCard title="Pending Confirmation" value={stats.pendingConfirmations} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
          <StatCard title="No-Show Rate" value={`${stats.noShowRate.toFixed(1)}%`} icon={<AlertCircle className="text-red-600" />} color="bg-red-50" />
          <StatCard title="Patient Reviews" value={stats.recentReviews} icon={<Star className="text-green-600" />} color="bg-green-50" />
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Schedule - {new Date().toLocaleDateString()}</h2>
            <button className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-700">{appt.appointmentTime}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{appt.Patients.fullname}</div>
                      <div className="text-xs text-slate-500">{appt.Patients.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{appt.service_type}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        onChange={(e) => updateStatus(appt.id, e.target.value)}
                        className="text-sm border-slate-200 rounded-lg p-1"
                        value={appt.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="no-show">No-Show</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, color = "bg-blue-50" }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    "no-show": "bg-slate-100 text-slate-700"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};

const Star = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export default AdminDashboard;