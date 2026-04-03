import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Users, Calendar, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrgAdminPageHeader from '../components/org-admin/OrgAdminPageHeader';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then((res) => res.data),
  });

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: () => api.get('/members').then((res) => res.data),
    enabled: user?.role === 'orgAdmin' || user?.role === 'SuperAdmin',
  });

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/events').then((res) => res.data),
    enabled: user?.role === 'orgAdmin' || user?.role === 'member',
  });

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => api.get('/blogs').then((res) => res.data),
    enabled: user?.role === 'orgAdmin',
  });

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: () => api.get('/payments').then((res) => res.data),
    enabled: user?.role === 'orgAdmin',
  });

  const statsCards = useMemo(() => {
    const stats = dashboardData?.stats ?? [];
    const find = (needle: string) =>
      stats.find((s: { label: string }) => s.label?.toLowerCase().includes(needle.toLowerCase()));
    const memberVal = find('member')?.value ?? members?.length ?? '—';
    const eventVal = find('event')?.value ?? events?.length ?? '—';
    const blogVal = find('blog')?.value ?? blogs?.length ?? '—';
    const paidSum =
      payments?.reduce((a: number, p: { amount?: number }) => a + (p.amount || 0), 0) ?? 0;

    return [
      {
        label: 'Total Members',
        value: String(memberVal),
        sub: <span className="text-emerald-600 font-semibold">↑ +12 this month</span>,
        icon: Users,
      },
      {
        label: 'Active Events',
        value: String(eventVal),
        sub: <span className="text-gray-500">upcoming this week</span>,
        icon: Calendar,
      },
      {
        label: 'Total blogs',
        value: String(blogVal),
        sub: <span className="text-rose-600 font-semibold">+12 Blogs</span>,
        icon: FileText,
      },
      {
        label: 'Total Paid Payments',
        value: `ETB ${paidSum.toLocaleString()}`,
        sub: <span className="text-rose-600 font-semibold">Total paid this week</span>,
        icon: CreditCard,
      },
    ];
  }, [dashboardData, members, events, blogs, payments]);

  const upcoming = events?.slice(0, 3) ?? [];
  const firstEvent = upcoming[0];

  return (
    <div className="space-y-8 font-poppins">
      <OrgAdminPageHeader title="Dashboard" />

      {user?.role !== 'SuperAdmin' && dashboardData?.expiry && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-indigo-600 shrink-0" size={22} />
            <p className="text-sm text-gray-800 font-semibold">
              Your{' '}
              <span className="text-indigo-600">{dashboardData.plan?.name}</span> plan expires on{' '}
              {new Date(dashboardData.expiry).toLocaleDateString()}
            </p>
          </div>
          <Link
            to="/org-admin/upgrade"
            className="inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{card.value}</p>
                  <div className="text-xs mt-2">{card.sub}</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <Icon size={22} strokeWidth={2} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/org-admin/events" className="text-sm font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            You have {events?.length ?? 0} event{(events?.length ?? 0) === 1 ? '' : 's'} scheduled this
            week:
          </p>
          {firstEvent ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
              <p className="text-sm text-gray-600">
                Tomorrow {new Date(firstEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                — <span className="font-bold text-gray-900">{firstEvent.title}</span>
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  type="button"
                  className="rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Details
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  Confirm Venue
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming events.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">Reminders</h2>
            <span className="rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5">
              5
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-6">Items requiring your attention</p>
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                b
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900">Blog Post Review</p>
                <p className="text-sm text-gray-500 mt-1">Review and publish quarterly update post</p>
                <button
                  type="button"
                  className="mt-4 w-full sm:w-auto rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500"
                >
                  Review Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
