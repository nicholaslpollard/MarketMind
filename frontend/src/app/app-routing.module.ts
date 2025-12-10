import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/main-layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TickerComponent } from './pages/ticker/ticker.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // When NOT logged in → show HomeComponent
      { path: '', component: HomeComponent },

      // Auth pages
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },

      // Protected pages
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

      // ⭐ NEW: Ticker details page
      { path: 'ticker/:symbol', component: TickerComponent, canActivate: [AuthGuard] }
    ]
  },

  // fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
