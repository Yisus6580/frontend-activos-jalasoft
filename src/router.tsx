import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';

import BaseLayout from 'src/layouts/BaseLayout';
import SidebarLayout from 'src/layouts/SidebarLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import ProtectedRoute from './components/ProtectedRoute';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
const Home = Loader(lazy(() => import('src/pages/Home')));
const UserProfile = Loader(lazy(() => import('src/pages/User/Profile')));
const UserSettings = Loader(lazy(() => import('src/pages/User/Settings')));
const Login = Loader(lazy(() => import('src/pages/User/Login')));

const User = Loader(lazy(() => import('src/pages/User/List')));
const License = Loader(lazy(() => import('src/pages/License/List')));
const Employee = Loader(lazy(() => import('src/pages/Employee/List')));
const Assignment = Loader(lazy(() => import('src/pages/Assignment/List')));

// Status

const Status404 = Loader(lazy(() => import('src/pages/Status/Status404')));
const Status500 = Loader(lazy(() => import('src/pages/Status/Status500')));
const StatusComingSoon = Loader(
  lazy(() => import('src/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: (
      <ProtectedRoute roles={['admin', 'grosser']}>
        <SidebarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <Home />
          </ProtectedRoute>
        )
      },
      {
        path: 'perfil',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: 'licencias',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <License />
          </ProtectedRoute>
        )
      },
      {
        path: 'empleados',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <Employee />
          </ProtectedRoute>
        )
      },
      {
        path: 'asignaciones',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <Assignment />
          </ProtectedRoute>
        )
      },
      {
        path: 'configuraciones',
        element: (
          <ProtectedRoute roles={['admin', 'grosser']}>
            <UserSettings />
          </ProtectedRoute>
        )
      },
      ,
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute roles={['admin']}>
            <User />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  }
];

export default routes;
