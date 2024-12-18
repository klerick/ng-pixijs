import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/installation',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/create-stage-component',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'docs/create-scene',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
