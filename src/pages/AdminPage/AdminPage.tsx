import { BACKEND_API_URL } from "@/env";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";

import {
  Button,
  Caption,
  Cell,
  Input,
  List,
  Placeholder,
  Section,
  Snackbar,
  Spinner,
  Text,
} from "@telegram-apps/telegram-ui";
import { retrieveLaunchParams } from '@telegram-apps/sdk';

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
            {showError && <Snackbar description="Some Error Happened" duration={10000} onClose={() => setShowError(false)} />}
            <List>
                <Section header={<Section.Header large>Users ({totalUsers})</Section.Header>}>
                    <Input
                        header="Search"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e)}
                    />
                </Section>
                {isLoaderSpinning ? (
                    <Placeholder>
                        <Spinner size="l" />
                    </Placeholder>
                ) : (
                    <Section>
                        {users.map((user) => (
                            <Cell
                                key={user.guid}
                                subtitle={
                                    <>
                                        <Text Component="a" href={`https://t.me/${user.nick_name}`} style={{ color: 'var(--tg-theme-link-color)' }}>
                                            @{user.nick_name}
                                        </Text>
                                    </>
                                }
                                description={
                                    <div>
                                        <Caption>Completed Tests: {user.completed_tests}</Caption>
                                        <Caption>Answered Questions: {user.answered_questions}</Caption>
                                        <Caption>Registered: {user.registered_at}</Caption>
                                        <Caption>Last Activity: {user.last_activity}</Caption>
                                    </div>
                                }
                                multiline
                            >
                                {user.nick_name}
                            </Cell>
                        ))}
                        {users.length < totalUsers && (
                            <div style={{ display: "flex", justifyContent: "center", padding: '12px' }}>
                                {isLoadMoreLoaderSpinning ? (
                                    <Spinner size="s" />
                                ) : (
                                    <Button mode="plain" onClick={() => setOffset(offset + limit)}>Load More</Button>
                                )}
                            </div>
                        )}
                    </Section>
                )}
            </List>
        </Page>
    );
}
