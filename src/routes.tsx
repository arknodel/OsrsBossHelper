import * as React from 'react';
import { Route, Routes } from 'react-router';
const Base = React.lazy(() => import('./components/base/Base'));
const StartPage = React.lazy(() => import('./components/content/Home/Home'));
const CerberusPage = React.lazy(() => import('./components/content/Cerberus/Cerberus'));
const AraxxorPage = React.lazy(() => import('./components/content/Araxxor/Araxxor'));
const NotFound = React.lazy(() => import('./components/content/NotFound/NotFound'));

export const routeUrls = {
  home: "/",
  cerberus: "/cerberus",
  araxxor: "/araxxor"
}

export default () => {
  return (
    <Routes>
      <Route element={<Base />}>
        <Route index Component={StartPage} />
        <Route path={routeUrls.cerberus} Component={CerberusPage} />
        <Route path={routeUrls.araxxor} Component={AraxxorPage} />
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};