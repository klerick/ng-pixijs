import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./main/routes'),
    data: { hideSidebar: true },
  },
  {
    path: 'docs',
    loadChildren: () => import('./docs/docs.routes'),
  },
  {
    path: '**',
    redirectTo: 'docs/installation',
    pathMatch: 'full',
  },
];


