import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PopularViewComponent} from './views/popular/popular-view.component';
import {LoginViewComponent} from './views/login/login-view.component';
import {SignUpViewComponent} from './views/sign-up/sign-up-view.component';
import {AllViewComponent} from './views/all/all-view.component';
import {CommunityViewComponent} from './views/community/community-view.component';
import {PostViewComponent} from './views/post/post-view.component';
import {HomeViewComponent} from './views/home/home-view.component';
import {IndexViewComponent} from './views/index/index-view.component';
import {TopCommunitiesViewComponent} from './views/top-communities/top-communities-view.component';
import {SearchViewComponent} from './views/search/search-view.component';
import {NotFoundViewComponent} from './views/not-found/not-found-view.component';
import {NonAuthenticatedOnlyGuard} from './domain/authorization/non-authenticated-only.guard';
import {AuthenticatedOnlyGuard} from './domain/authorization/authenticated-only.guard';
import {UserViewComponent} from './views/user/user-view.component';
import {UserSettingsViewComponent} from './views/user-settings/user-settings-view.component';

const routes: Routes = [
  {
    path: '',
    component: IndexViewComponent,
  },
  {
    path: 'search',
    component: SearchViewComponent
  },
  {
    path: 'login',
    component: LoginViewComponent,
    canActivate: [NonAuthenticatedOnlyGuard]
  },
  {
    path: 'sign-up',
    component: SignUpViewComponent,
    canActivate: [NonAuthenticatedOnlyGuard]
  },
  {
    path: 'c/home',
    component: HomeViewComponent,
    canActivate: [AuthenticatedOnlyGuard]
  },
  {
    path: 'c/all',
    component: AllViewComponent
  },
  {
    path: 'c/popular',
    component: PopularViewComponent
  },
  {
    path: 'top-communities',
    component: TopCommunitiesViewComponent
  },
  {
    path: 'c/:community',
    component: CommunityViewComponent
  },
  {
    path: 'c/:community/p/:post',
    component: PostViewComponent
  },
  {
    path: 'u/:user',
    component: UserViewComponent
  },
  {
    path: 'u/:user/settings',
    component: UserSettingsViewComponent,
    canActivate: [AuthenticatedOnlyGuard]
  },
  {
    path: 'page-not-found',
    component: NotFoundViewComponent
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
