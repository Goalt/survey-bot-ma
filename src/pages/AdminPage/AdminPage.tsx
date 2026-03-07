import { BACKEND_API_URL } from "@/env";

import React, { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

import { Snackbar, Spinner } from "@telegram-apps/telegram-ui";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

import { Page } from '@/pages/Page.tsx';
import { Users, Search, ExternalLink, Clock, CheckSquare, MessageSquare } from "lucide-react";

const tg = {
  bg: 'var(--tg-theme-bg-color, #ffffff)',
  text: 'var(--tg-theme-text-color, #000000)',
  hint: 'var(--tg-theme-hint-color, #999999)',
  secondaryBg: 'var(--tg-theme-secondary-bg-color, #f4f4f4)',
  button: 'var(--tg-theme-button-color, #3390ec)',
  buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
  link: 'var(--tg-theme-link-color, #3390ec)',
};

const AVATAR_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399',
  '#38BDF8', '#818CF8', '#A78BFA', '#F472B6',
];

function UserAvatar({ name }: { name: string }) {
  const safeName = name || 'UN';
  const initials = safeName.slice(0, 2).toUpperCase();
  const code = safeName.charCodeAt(0);
  const color = AVATAR_COLORS[Number.isNaN(code) ? 0 : code % AVATAR_COLORS.length];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ color: tg.hint }}>{icon}</span>
      <span className="text-xs" style={{ color: tg.hint }}>{label}:</span>
      <span className="text-xs font-medium" style={{ color: tg.text }}>{value}</span>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default function UserList() {
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoaderSpinning, setIsLoaderSpinning] = useState(false);
    const [isLoadMoreLoaderSpinning, setIsLoadMoreLoaderSpinning] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [showError, setShowError] = useState(false);
    const limit = 5;

    useEffect(() => {
        const { initDataRaw } = retrieveLaunchParams();
        if (!initDataRaw || initDataRaw.length === 0) {
            return;
        }

        setIsLoadMoreLoaderSpinning(true);
        fetch(BACKEND_API_URL + `/api/admin/users?search=${search}&limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoadMoreLoaderSpinning(false);
                if (data.description) {
                    Sentry.captureMessage("Error fetching surveys, data: " + JSON.stringify(data), "error");
                    Sentry.captureSession();

                    setShowError(true);
                    return;
                }

                setUsers(users.concat(data.users));
                setTotalUsers(data.total);
            })
            .catch((error) => {
                Sentry.captureMessage("Network error fetching surveys, error: " + error.message, "error");
                Sentry.captureSession();

                setIsLoadMoreLoaderSpinning(false);
                setShowError(true);
            });
    }, [offset]);

    useEffect(() => {
        const { initDataRaw } = retrieveLaunchParams();
        if (!initDataRaw || initDataRaw.length === 0) {
            return;
        }

        if ((search.length < 3) && (search.length > 0)) {
            return;
        }

        setIsLoaderSpinning(true);
        fetch(BACKEND_API_URL + `/api/admin/users?search=${search}&limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initDataRaw}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoaderSpinning(false);
                if (data.description) {
                    Sentry.captureMessage("Error fetching surveys, data: " + JSON.stringify(data), "error");
                    Sentry.captureSession();

                    setShowError(true);
                    return;
                }

                setUsers(data.users);
                setTotalUsers(data.total);
            })
            .catch((error) => {
                Sentry.captureMessage("Network error fetching surveys, error: " + error.message, "error");
                Sentry.captureSession();

                setIsLoaderSpinning(false);
                setShowError(true);
            });
    }, [search]);

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    }

    return (
        <Page back={true}>
            <div style={{ minHeight: '100vh', backgroundColor: tg.bg }}>
                {showError && (
                    <Snackbar description="Failed to load users" duration={10000} onClose={() => setShowError(false)} />
                )}

                {/* Header */}
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={22} style={{ color: tg.button }} />
                        <div>
                            <h1 className="text-xl font-bold leading-tight" style={{ color: tg.text }}>
                                Users
                            </h1>
                            <p className="text-xs" style={{ color: tg.hint }}>
                                {totalUsers} total
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: tg.hint }}
                        />
                        <input
                            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none"
                            style={{
                                backgroundColor: tg.secondaryBg,
                                color: tg.text,
                                border: 'none',
                            }}
                            placeholder="Search users…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e)}
                        />
                    </div>
                </div>

                <div className="px-4 pb-8">
                    {isLoaderSpinning ? (
                        <div className="flex justify-center items-center" style={{ height: '50vh' }}>
                            <Spinner size="l" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {users.map((user) => (
                                <div
                                    key={user.guid}
                                    className="rounded-2xl p-4"
                                    style={{ backgroundColor: tg.secondaryBg }}
                                >
                                    <div className="flex items-start gap-3">
                                        <UserAvatar name={user.nick_name} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className="font-semibold text-base truncate"
                                                    style={{ color: tg.text }}
                                                >
                                                    @{user.nick_name}
                                                </span>
                                                <a
                                                    href={`https://t.me/${user.nick_name}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink size={13} style={{ color: tg.link }} />
                                                </a>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                                                <StatItem
                                                    icon={<CheckSquare size={11} />}
                                                    label="Tests"
                                                    value={user.completed_tests}
                                                />
                                                <StatItem
                                                    icon={<MessageSquare size={11} />}
                                                    label="Answers"
                                                    value={user.answered_questions}
                                                />
                                                <StatItem
                                                    icon={<Clock size={11} />}
                                                    label="Joined"
                                                    value={formatDate(user.registered_at)}
                                                />
                                                <StatItem
                                                    icon={<Clock size={11} />}
                                                    label="Active"
                                                    value={formatDate(user.last_activity)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {users.length < totalUsers && (
                                <div className="flex justify-center pt-1">
                                    {isLoadMoreLoaderSpinning ? (
                                        <Spinner size="s" />
                                    ) : (
                                        <button
                                            className="px-6 py-2 rounded-full text-sm font-medium"
                                            style={{ backgroundColor: tg.button, color: tg.buttonText }}
                                            onClick={() => setOffset(offset + limit)}
                                        >
                                            Load More
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
}
