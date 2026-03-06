import { BACKEND_API_URL } from "@/env";

import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import {
  Accordion,
  Cell,
  List,
  Placeholder,
  Section,
  Snackbar,
  Spinner,
  Text,
} from "@telegram-apps/telegram-ui";
import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/pages/Page.tsx';

const IndexPage: React.FC = () => {
  const [openSurvey, setOpenSurvey] = useState<number | null>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isLoaderSpinning, setIsLoaderSpinning] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    if (!initDataRaw || initDataRaw.length === 0) {
      return;
    }

    fetch(BACKEND_API_URL + '/api/surveys', {
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

        setSurveys(data.surveys);

      })
      .catch((error) => {
        Sentry.captureMessage("Network error fetching surveys, error: " + error.message, "error");
        Sentry.captureSession();

        setIsLoaderSpinning(false);
        setShowError(true);
      });
  }, []);

  useEffect(() => {
    const { initDataRaw } = retrieveLaunchParams();
    if (!initDataRaw || initDataRaw.length === 0) {
      return;
    }

    fetch(BACKEND_API_URL + '/api/is-admin', {
      method: 'GET',
      headers: {
        Authorization: `tma ${initDataRaw}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.description) {
          Sentry.captureMessage("Error fetching surveys, data: " + JSON.stringify(data), "error");
          Sentry.captureSession();
          setShowError(true);
          return;
        }

        if (data.is_admin) {
          setIsAdmin(true);
        }
      })
      .catch((error) => {
        Sentry.captureMessage("Network error fetching surveys, error: " + error.message, "error");
        Sentry.captureSession();

        setShowError(true);
      }
      )
  }, []);

  const toggleResults = (id: number) => {
    setOpenSurvey(openSurvey === id ? null : id);
  };

  return (
    <Page back={false}>
      {showError && <Snackbar description="Произошла ошибка" duration={10000} onClose={() => setShowError(false)} />}
      <List>
        {isAdmin && (
          <Section>
            <Link to="/admin-page" style={{ textDecoration: 'none' }}>
              <Cell after={<span style={{ color: 'var(--tg-theme-link-color)' }}>→</span>}>
                Панель администратора
              </Cell>
            </Link>
          </Section>
        )}
        <Section header={<Section.Header large>Пройденные опросы</Section.Header>}>
          {isLoaderSpinning ? (
            <Placeholder>
              <Spinner size="l" />
            </Placeholder>
          ) : (
            surveys.map((survey) => (
              <Accordion
                key={survey.id}
                expanded={openSurvey === survey.id}
                onChange={() => toggleResults(survey.id)}
              >
                <Accordion.Summary subtitle={survey.description}>
                  {survey.name}
                </Accordion.Summary>
                <Accordion.Content>
                  <div style={{ padding: '12px 16px' }}>
                    <Text>{survey.results}</Text>
                  </div>
                </Accordion.Content>
              </Accordion>
            ))
          )}
        </Section>
      </List>
    </Page>
  );
};

export default IndexPage;