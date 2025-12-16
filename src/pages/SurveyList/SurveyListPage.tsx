import { BACKEND_API_URL } from "@/env";

import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { Snackbar } from "@telegram-apps/telegram-ui";
import { Button as AdminButton, Spinner } from "@telegram-apps/telegram-ui";
import { Card, CardContent } from "@/components/ui/card.tsx";
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
      <div className="p-6 max-w-2xl mx-auto relative">
        {showError && <Snackbar description="Some Error Happened" duration={10000} onClose={() => console.log("")}></Snackbar>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", justifyItems: "center" }}>
          <div
            style={{ display: "flex", justifyContent: "center", alignContent: "center", justifyItems: "center", alignItems: "center" }}
            className="text-2xl font-bold mb-1 text-black">Completed Surveys</div>
          {isAdmin && (
            <Link to="/admin-page">
              <AdminButton mode="plain">Admin</AdminButton>
            </Link>
          )}
        </div>
        {isLoaderSpinning ? (
          <div style={{ display: "flex", justifyContent: "center", alignContent: "center", justifyItems: "center", alignItems: "center", height: "50vh" }}>
            <Spinner size="l" />
          </div>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <Card key={survey.id} className="p-4">
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div onClick={() => toggleResults(survey.id)}>
                      <h2 className="text-lg font-semibold">{survey.name}</h2>
                      <p className="text-md text-gray-600">{survey.description}</p>
                    </div>
                  </div>
                  {openSurvey === survey.id && (
                    <div className="text-sm mt-2 p-2 border-t text-gray-800">
                      {survey.results}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default IndexPage;