import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';
import { ErrorLayoutComponent } from '../layout/error';
import { Page404Component } from '../pages/errors/page-404';
import { Page500Component } from '../pages/errors/page-500';
import { Page503Component } from '../pages/errors/page-503';
import { Page505Component } from '../pages/errors/page-505';
import { PageUserProfileComponent } from '../pages/apps/user-pages/user-profile';
import { PageEditAccountComponent } from '../pages/apps/user-pages/edit-account';
import { PageSignInComponent } from '../pages/apps/authentication/sign-in';
import { PageSignUpComponent } from '../pages/apps/authentication/sign-up';
import { PageResetPasswordComponent } from '../pages/apps/authentication/reset-password';
import { PageVerifyAccountComponent } from '../pages/apps/authentication/verify-account';
import { PageWidgetsComponent } from '../pages/widgets';
import { AuthGuard } from '../user/_helpers/auth.guard';
import {
  COMMUNITY_ROUTES,
  COURSES_ROUTES,
} from './project-routing.module';
import {PageResetPasswordConfirmComponent} from '../pages/apps/authentication/reset-password-confirm';
import {SoonComponent} from '../pages/projects/soon';
import {PageEditProfileComponent} from '../pages/apps/user-pages/edit-profile';
import {PageTwoFactorComponent} from '../pages/apps/authentication/two-factor';
import {PageAnalyticsComponent} from '../pages/dashboards/analytics';
import {PageLandingComponent} from '../layout/landing';
import {ProgramListComponent} from '../pages/projects/programs';
import {PageDashboardComponent} from '../pages/dashboards/dashboard';

const CHILD_ROUTES: Routes = [
  { path: 'analytics', component: PageDashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }  },
  { path: 'profile/:id', component: PageUserProfileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'user-profile', component: PageUserProfileComponent },
  { path: 'profile/edit/:id', component: PageEditProfileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'create/profile', component: PageEditProfileComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'edit-account', component: PageEditAccountComponent, canActivate: [AuthGuard] },
  { path: 'edit-account/:id', component: PageEditAccountComponent, canActivate: [AuthGuard] },
  { path: 'widgets', component: PageWidgetsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'subjects', component: ProgramListComponent, canActivate: [AuthGuard] },
  {
    path: 'courses',
    children: COURSES_ROUTES
  },
  {
    path: 'community',
    children: COMMUNITY_ROUTES
  },
  { path: 'coming-soon', component: SoonComponent },
];

const PUBLIC_ROUTES: Routes = [
  { path: 'sign-in', component: PageSignInComponent },
  { path: 'sign-up', component: PageSignUpComponent },
  { path: 'forgot-password', component: PageResetPasswordComponent },
  { path: 'reset-password', component: PageResetPasswordConfirmComponent },
  { path: 'verify-account', component: PageVerifyAccountComponent },
  { path: 'two-factor', component: PageTwoFactorComponent },
  { path: '**', component: Page404Component }
];

const ERROR_ROUTES: Routes = [
  { path: '404', component: Page404Component },
  { path: '500', component: Page500Component },
  { path: '503', component: Page503Component },
  { path: '505', component: Page505Component },
  { path: '**', component: Page404Component }
];

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: CHILD_ROUTES,
    canActivate: [AuthGuard],
    data: { roles: [] }
    // data: { roles: ['ROLE_ADMIN', 'ROLE_STUDENT'] }
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: CHILD_ROUTES,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES,
  },
  {
    path: 'landing',
    component: PageLandingComponent,
  },
  {
    path: 'error',
    component: ErrorLayoutComponent,
    children: ERROR_ROUTES
  },
  {
    path: '**',
    component: ErrorLayoutComponent,
    children: ERROR_ROUTES
  }
];

@NgModule({
  imports: [],
  exports: [RouterModule],
  declarations: [],
})
export class RoutingModule { }
