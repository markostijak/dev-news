import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PopularViewComponent} from './views/popular/popular-view.component';
import {LoginViewComponent} from './views/login/login-view.component';
import {SignUpViewComponent} from './views/sign-up/sign-up-view.component';
import {AllViewComponent} from './views/all/all-view.component';
import {CommunityViewComponent} from './views/community/community-view.component';
import {PostViewComponent} from './views/post/post-view.component';
import {HomeViewComponent} from './views/home/home-view.component';
import {ALL, HOME, LOGIN, POPULAR, SIGN_UP} from './components/navigation/navigation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    data: HOME
  },
  {
    path: 'login',
    component: LoginViewComponent,
    data: LOGIN
  },
  {
    path: 'sign-up',
    component: SignUpViewComponent,
    data: SIGN_UP
  },
  {
    path: 'c/home',
    component: HomeViewComponent,
    data: HOME
  },
  {
    path: 'c/all',
    component: AllViewComponent,
    data: ALL
  },
  {
    path: 'c/popular',
    component: PopularViewComponent,
    data: POPULAR
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
