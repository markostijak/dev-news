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

const routes: Routes = [
  {
    path: '',
    component: IndexViewComponent
  },
  {
    path: 'search',
    component: SearchViewComponent
  },
  {
    path: 'login',
    component: LoginViewComponent
  },
  {
    path: 'sign-up',
    component: SignUpViewComponent
  },
  {
    path: 'c/home',
    component: HomeViewComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
