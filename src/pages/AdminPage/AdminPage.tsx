import { BACKEND_API_URL } from "@/env";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

import { Snackbar } from "@telegram-apps/telegram-ui";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button, Spinner } from "@telegram-apps/telegram-ui";

import { Page } from '@/pages/Page.tsx';

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
            <div className="p-4 max-w-2xl mx-auto">
                {showError && <Snackbar description="Some Error Happened" duration={10000} onClose={() => console.log("")}></Snackbar>}
                <h1 className="text-xl font-bold mb-4 text-black">Users ({totalUsers})</h1>
                <Input
                    className="mb-4 text-black"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e)}
                />
                {isLoaderSpinning ? (
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", justifyItems: "center", alignItems: "center", height: "50vh" }}>
                        <Spinner size="l" />
                    </div>
                ) : (
                    <div>
                        {users.map((user) => (
                            <Card key={user.guid} className="mb-3">
                                <CardContent className="p-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">{user.nick_name}</h2>
                                        <p className="text-gray-600 text-sm">
                                            Telegram:{" "}
                                            <a
                                                href={`https://t.me/${user.nick_name}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                @{user.nick_name}
                                            </a>
                                        </p>
                                        <p className="text-gray-600 text-sm">Completed Tests: {user.completed_tests}</p>
                                        <p className="text-gray-600 text-sm">Answered Questions: {user.answered_questions}</p>
                                        <p className="text-gray-600 text-sm">Registered: {user.registered_at}</p>
                                        <p className="text-gray-600 text-sm">Last Activity: {user.last_activity}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {users.length < totalUsers ? (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {isLoadMoreLoaderSpinning ? (
                                    <Spinner size="s" />    
                                ): (
                                    <Button mode="plain" onClick={() => setOffset(offset + limit)}>Load More</Button>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
}
