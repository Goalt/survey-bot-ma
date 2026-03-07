import { BACKEND_API_URL } from "@/env";

import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { Snackbar, Spinner } from "@telegram-apps/telegram-ui";
import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/pages/Page.tsx';
import { ClipboardList, ChevronDown, ChevronUp, Settings } from "lucide-react";

const tg = {
  bg: 'var(--tg-theme-bg-color, #ffffff)',
  text: 'var(--tg-theme-text-color, #000000)',
  hint: 'var(--tg-theme-hint-color, #999999)',
  secondaryBg: 'var(--tg-theme-secondary-bg-color, #f4f4f4)',
  button: 'var(--tg-theme-button-color, #3390ec)',
  buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
};

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
      });
  }, []);

  const toggleResults = (id: number) => {
    setOpenSurvey(openSurvey === id ? null : id);
  };

  return (
    <Page back={false}>
      <div style={{ minHeight: '100vh', backgroundColor: tg.bg }}>
        {showError && (
          <Snackbar description="Failed to load surveys" duration={10000} onClose={() => setShowError(false)} />
        )}

        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: tg.bg, borderBottom: `1px solid ${tg.secondaryBg}` }}
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={22} style={{ color: tg.button }} />
            <h1 className="text-xl font-bold" style={{ color: tg.text }}>
              Surveys
            </h1>
          </div>
          {isAdmin && (
            <Link to="/admin-page">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ backgroundColor: tg.button, color: tg.buttonText }}
              >
                <Settings size={13} />
                Admin
              </button>
            </Link>
          )}
        </div>

        <div className="p-4 max-w-2xl mx-auto">
          {isLoaderSpinning ? (
            <div className="flex items-center justify-center" style={{ height: '50vh' }}>
              <Spinner size="l" />
            </div>
          ) : surveys.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-20"
              style={{ color: tg.hint }}
            >
              <ClipboardList size={52} strokeWidth={1.25} />
              <p className="text-base font-medium">No surveys yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: tg.secondaryBg }}
                >
                  <button
                    className="w-full text-left flex items-center justify-between gap-3 px-4 py-4"
                    onClick={() => toggleResults(survey.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold truncate" style={{ color: tg.text }}>
                        {survey.name}
                      </p>
                      {survey.description && (
                        <p className="text-sm mt-0.5 truncate" style={{ color: tg.hint }}>
                          {survey.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0" style={{ color: tg.hint }}>
                      {openSurvey === survey.id
                        ? <ChevronUp size={18} />
                        : <ChevronDown size={18} />
                      }
                    </div>
                  </button>

                  {openSurvey === survey.id && (
                    <div
                      className="px-4 pb-4 pt-1 text-sm"
                      style={{ borderTop: `1px solid ${tg.bg}`, color: tg.text }}
                    >
                      {survey.results}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default IndexPage;