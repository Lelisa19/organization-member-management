import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Save,
  Building2,
  Globe,
  Bell,
  Palette,
  CreditCard,
  AlertTriangle,
  Mail,
  Users,
  Calendar,
} from 'lucide-react';
import OrgAdminPageHeader from '../../components/org-admin/OrgAdminPageHeader';
import { useAuth } from '../../context/AuthContext';

const OrgSettings: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('Africa/Addis_Ababa');
  const [locale, setLocale] = useState('en');
  const [emailDigest, setEmailDigest] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [memberJoinAlerts, setMemberJoinAlerts] = useState(false);
  const [publicTagline, setPublicTagline] = useState('');
  const [accentNote, setAccentNote] = useState('');

  useEffect(() => {
    setDisplayName(user?.organization_name ?? '');
  }, [user?.organization_name]);

  const card = 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8';
  const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500';
  const input =
    'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30';
  const sectionTitle = 'mb-4 flex items-center gap-2 text-sm font-bold text-slate-800';

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8 font-poppins">
      <OrgAdminPageHeader
        title="Settings"
        subtitle="Organization preferences, notifications, and defaults"
      />

      <section className={card}>
        <h2 className={sectionTitle}>
          <Building2 className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
          General
        </h2>
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="org-display-name">
              Public display name
            </label>
            <input
              id="org-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={input}
              placeholder="Organization name"
              autoComplete="organization"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="org-tz">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" aria-hidden />
                  Default timezone
                </span>
              </label>
              <select
                id="org-tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={input}
              >
                <option value="UTC">UTC</option>
                <option value="Africa/Addis_Ababa">Africa/Addis_Ababa</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="org-locale">
                Language
              </label>
              <select id="org-locale" value={locale} onChange={(e) => setLocale(e.target.value)} className={input}>
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className={sectionTitle}>
          <Bell className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
          Notifications
        </h2>
        <p className="mb-4 text-sm text-gray-600">Choose what we email admins about. (Saved locally in this demo.)</p>
        <ul className="space-y-3">
          <li className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
              <Mail className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
              Weekly digest
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={emailDigest}
              onClick={() => setEmailDigest((v) => !v)}
              className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
                emailDigest ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 translate-y-0.5 rounded-full bg-white shadow transition ${
                  emailDigest ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </li>
          <li className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
              <Calendar className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
              Event reminders
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={eventReminders}
              onClick={() => setEventReminders((v) => !v)}
              className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
                eventReminders ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 translate-y-0.5 rounded-full bg-white shadow transition ${
                  eventReminders ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </li>
          <li className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
              <Users className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
              New member joins
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={memberJoinAlerts}
              onClick={() => setMemberJoinAlerts((v) => !v)}
              className={`relative inline-flex h-8 w-14 shrink-0 rounded-full transition-colors ${
                memberJoinAlerts ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 translate-y-0.5 rounded-full bg-white shadow transition ${
                  memberJoinAlerts ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
          </li>
        </ul>
      </section>

      <section className={card}>
        <h2 className={sectionTitle}>
          <Palette className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
          Branding
        </h2>
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="org-tagline">
              Public tagline
            </label>
            <textarea
              id="org-tagline"
              value={publicTagline}
              onChange={(e) => setPublicTagline(e.target.value)}
              rows={3}
              className={`${input} resize-y min-h-[5rem]`}
              placeholder="Short line shown on your public pages"
            />
          </div>
          <div>
            <label className={label} htmlFor="org-accent">
              Notes for your team
            </label>
            <input
              id="org-accent"
              type="text"
              value={accentNote}
              onChange={(e) => setAccentNote(e.target.value)}
              className={input}
              placeholder="Internal note (optional)"
            />
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className={sectionTitle}>
          <CreditCard className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
          Plan &amp; billing
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Upgrade limits, view invoices, and manage payment methods on the upgrade page.
        </p>
        <Link
          to="/org-admin/upgrade"
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-sm font-bold text-indigo-800 transition hover:bg-indigo-100 sm:w-auto"
        >
          Open upgrade &amp; billing
        </Link>
      </section>

      <section className={`${card} border-red-100 bg-red-50/40`}>
        <h2 className={`${sectionTitle} text-red-900`}>
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" aria-hidden />
          Danger zone
        </h2>
        <p className="text-sm text-red-900/80">
          Transfer ownership or delete the organization from the platform is not wired in this demo. Contact support
          when you implement destructive actions.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500">Changes below are kept in the browser session until you add API persistence.</p>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500 sm:w-auto min-h-[48px]"
        >
          <Save className="h-[1.1rem] w-[1.1rem] shrink-0 sm:h-[1.15rem] sm:w-[1.15rem]" aria-hidden />
          Save settings
        </button>
      </div>
    </div>
  );
};

export default OrgSettings;
