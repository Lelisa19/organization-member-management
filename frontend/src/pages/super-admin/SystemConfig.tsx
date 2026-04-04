import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Save } from 'lucide-react';

type SystemConfig = {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
};

const SystemConfigPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['system-config'],
    queryFn: async () => api.get<SystemConfig>('/admin/system-config').then((r) => r.data),
  });

  const [platformName, setPlatformName] = useState('OMMS');
  const [supportEmail, setSupportEmail] = useState('support@example.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setPlatformName(data.platformName);
    setSupportEmail(data.supportEmail);
    setMaintenanceMode(data.maintenanceMode);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: SystemConfig) =>
      api.put<SystemConfig>('/admin/system-config', payload).then((r) => r.data),
    onSuccess: (saved) => {
      setPlatformName(saved.platformName);
      setSupportEmail(saved.supportEmail);
      setMaintenanceMode(saved.maintenanceMode);
      setMessage('Saved successfully.');
      window.setTimeout(() => setMessage(null), 2500);
    },
    onError: () => {
      setMessage('Failed to save changes.');
      window.setTimeout(() => setMessage(null), 2500);
    },
  });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System configuration</h1>
        <p className="text-sm text-slate-500">Global platform settings</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
        {isLoading ? <p className="text-sm text-slate-500">Loading configuration…</p> : null}
        {isError ? <p className="text-sm text-red-600">Could not load configuration.</p> : null}

        <label className="block text-sm font-bold text-slate-700">Platform name</label>
        <input
          type="text"
          value={platformName}
          onChange={(e) => setPlatformName(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

        <label className="block text-sm font-bold text-slate-700">Support email</label>
        <input
          type="email"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />

        <label className="block text-sm font-bold text-slate-700">Maintenance mode</label>
        <select
        title='maintenance mode'
          value={maintenanceMode ? 'on' : 'off'}
          onChange={(e) => setMaintenanceMode(e.target.value === 'on')}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>

        {message ? <p className="text-sm font-bold text-slate-700">{message}</p> : null}

        <button
          type="button"
          onClick={() =>
            saveMutation.mutate({
              platformName,
              supportEmail,
              maintenanceMode,
            })
          }
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-bold hover:bg-sky-500 disabled:opacity-50"
        >
          <Save size={18} />
          {saveMutation.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

export default SystemConfigPage;
