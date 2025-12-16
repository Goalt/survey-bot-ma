import type { ComponentType, JSX } from 'react';

import SurveyListPage from '@/pages/SurveyList/SurveyListPage.tsx';
import UserList from '@/pages/AdminPage/AdminPage.tsx';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: SurveyListPage },
  { path: '/admin-page', Component: UserList },
];
