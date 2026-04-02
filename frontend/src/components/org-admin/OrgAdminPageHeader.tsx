import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, HelpCircle, ChevronDown, User, Settings, LogOut, ExternalLink, Inbox, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { relativeTime } from '../../lib/relativeTime';

type Props = {
  title: string;
  subtitle?: string;
  /** Primary actions, e.g. “+ Add Member”, shown before notification icons */
  actions?: React.ReactNode;
};

type Panel = 'notifications' | 'help' | 'user' | null;

type ApiNotification = { id: number; title: string; read: boolean; createdAt: string };

type HelpResources = {
  intro: string;
  links: { label: string; path: string }[];
};

/**
 * Top bar for Organization Admin routes. Notifications and help content load from the API.
 */
const OrgAdminPageHeader: React.FC<Props> = ({ title, subtitle, actions }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<Panel>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const { data: notifications = [], isLoading: notifsLoading, isError: notifsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get<ApiNotification[]>('/notifications');
      return data;
    },
  });

  const {
    data: helpResources,
    isLoading: helpLoading,
    isError: helpError,
  } = useQuery({
    queryKey: ['help-resources'],
    queryFn: async () => {
      const { data } = await api.get<HelpResources>('/help/resources');
      return data;
    },
    enabled: open === 'help',
  });

  const markReadMut = useMutation({
    mutationFn: (id: number) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMut = useMutation({
    mutationFn: () => api.post('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notifications.filter((n) => !n.read).length;

  const close = useCallback(() => setOpen(null), []);
  const toggle = useCallback((panel: Exclude<Panel, null>) => {
    setOpen((prev) => (prev === panel ? null : panel));
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const handleLogout = () => {
    close();
    logout();
    navigate('/', { replace: true });
  };

  const iconBtn =
    'inline-flex shrink-0 items-center justify-center min-h-[44px] min-w-[44px] rounded-xl text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200 sm:min-h-[40px] sm:min-w-[40px] sm:rounded-lg';

  const panelClass =
    'absolute right-0 z-50 mt-1 max-h-[min(70vh,24rem)] w-[min(calc(100vw-1.5rem),20rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 sm:max-h-[min(80vh,22rem)] sm:w-80';

  const notifId = `${baseId}-notifications`;
  const helpId = `${baseId}-help`;
  const userId = `${baseId}-user`;

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 pr-0 lg:pr-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        </div>

        <div
          ref={containerRef}
          className="flex w-full min-w-0 flex-wrap items-center justify-start gap-1 sm:w-auto sm:justify-end sm:gap-2 lg:shrink-0"
        >
          {actions ? <div className="mr-auto flex min-w-0 flex-wrap items-center gap-2 sm:mr-0">{actions}</div> : null}

          <div className="relative ml-auto flex flex-wrap items-center justify-end gap-0.5 sm:gap-1">
            <div className="relative">
              <button
                type="button"
                className={`${iconBtn} relative`}
                aria-label="Notifications"
                aria-expanded={open === 'notifications'}
                aria-haspopup="true"
                aria-controls={notifId}
                id={`${notifId}-trigger`}
                onClick={() => toggle('notifications')}
              >
                <Bell className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden />
                {unread > 0 ? (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white sm:right-1.5 sm:top-1.5">
                    {unread > 9 ? '9+' : unread}
                  </span>
                ) : null}
              </button>
              {open === 'notifications' ? (
                <div
                  id={notifId}
                  role="region"
                  aria-labelledby={`${notifId}-trigger`}
                  className={panelClass}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    {unread > 0 && !notifsLoading ? (
                      <button
                        type="button"
                        onClick={() => markAllMut.mutate()}
                        disabled={markAllMut.isPending}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                      >
                        {markAllMut.isPending ? '…' : 'Mark all read'}
                      </button>
                    ) : null}
                  </div>
                  <ul className="max-h-[min(50vh,18rem)] divide-y divide-gray-50 overflow-y-auto overscroll-contain">
                    {notifsLoading ? (
                      <li className="flex justify-center px-4 py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" aria-label="Loading" />
                      </li>
                    ) : notifsError ? (
                      <li className="px-4 py-8 text-center text-sm text-red-600">Could not load notifications.</li>
                    ) : notifications.length === 0 ? (
                      <li className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-gray-500">
                        <Inbox className="h-8 w-8 text-gray-300" aria-hidden />
                        No notifications
                      </li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!n.read) markReadMut.mutate(n.id);
                            }}
                            disabled={markReadMut.isPending}
                            className={`flex w-full gap-3 px-3 py-3 text-left text-sm transition hover:bg-gray-50 disabled:opacity-60 ${
                              n.read ? 'opacity-75' : 'bg-indigo-50/40'
                            }`}
                          >
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-gray-300' : 'bg-indigo-500'}`}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="font-medium text-slate-800">{n.title}</span>
                              <span className="mt-0.5 block text-xs text-gray-500">
                                {relativeTime(n.createdAt)}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                className={iconBtn}
                aria-label="Help"
                aria-expanded={open === 'help'}
                aria-haspopup="true"
                aria-controls={helpId}
                id={`${helpId}-trigger`}
                onClick={() => toggle('help')}
              >
                <HelpCircle className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden />
              </button>
              {open === 'help' ? (
                <div id={helpId} role="dialog" aria-labelledby={`${helpId}-title`} className={panelClass}>
                  <div className="border-b border-gray-100 px-3 py-2.5">
                    <h2 id={`${helpId}-title`} className="text-sm font-bold text-slate-800">
                      Help &amp; resources
                    </h2>
                  </div>
                  <div className="space-y-3 px-3 py-3 text-sm text-gray-600">
                    {helpLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" aria-label="Loading" />
                      </div>
                    ) : helpError ? (
                      <p className="text-center text-red-600">Could not load help.</p>
                    ) : helpResources ? (
                      <>
                        <p>{helpResources.intro}</p>
                        <div className="flex flex-col gap-2">
                          {helpResources.links.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={close}
                              className="inline-flex items-center gap-2 rounded-lg px-2 py-2 font-semibold text-indigo-600 hover:bg-indigo-50"
                            >
                              {link.label}
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex max-w-[min(100%,12rem)] min-h-[44px] items-center gap-1 rounded-xl py-1.5 pl-2 pr-1 text-sm font-bold text-gray-800 transition hover:bg-gray-50 sm:min-h-[40px] sm:rounded-lg"
                aria-expanded={open === 'user'}
                aria-haspopup="true"
                aria-controls={userId}
                id={`${userId}-trigger`}
                onClick={() => toggle('user')}
              >
                <span className="truncate">{user?.name}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open === 'user' ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {open === 'user' ? (
                <div
                  id={userId}
                  role="menu"
                  aria-labelledby={`${userId}-trigger`}
                  className={`${panelClass} max-h-none`}
                >
                  <div className="border-b border-gray-100 px-3 py-2.5">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <nav className="py-1">
                    <Link
                      to="/org-admin/profile"
                      role="menuitem"
                      onClick={close}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      <User className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                      Profile
                    </Link>
                    <Link
                      to="/org-admin/settings"
                      role="menuitem"
                      onClick={close}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                      Organization settings
                    </Link>
                  </nav>
                  <div className="border-t border-gray-100 p-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                      Log out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminPageHeader;
