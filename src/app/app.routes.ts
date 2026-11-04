import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'library',
        loadComponent: () => import('./pages/library/library.page').then((m) => m.LibraryPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./pages/album/album.page').then((m) => m.AlbumPage),
    canActivate: [authGuard],
  },
  {
    path: 'player',
    loadComponent: () => import('./pages/player/player.page').then((m) => m.PlayerPage),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
