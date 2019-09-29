import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {PreloaderComponent} from './components/preloader/preloader.component';
import {SearchComponent} from './components/search/search.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {SignUpFormComponent} from './components/sign-up/sign-up-form/sign-up-form.component';
import {AccountMenuComponent} from './components/account-menu/account-menu.component';
import {SocialLoginModule} from 'angularx-social-login';
import {JwtInterceptorService} from './services/authentication/jwt-interceptor.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ActivationFormComponent} from './components/sign-up/activation-form/activation-form.component';
import {HomeViewComponent} from './views/home/home-view.component';
import {PostEditorComponent} from './components/post/post-editor/post-editor.component';
import {PostComponent} from './components/post/post/post.component';
import {TextEditorComponent} from './components/editor/text-editor/text-editor.component';
import {MediaUploaderComponent} from './components/editor/media-uploader/media-uploader.component';
import {LinkResolverComponent} from './components/editor/link-resolver/link-resolver.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {PopularViewComponent} from './views/popular/popular-view.component';
import {AllViewComponent} from './views/all/all-view.component';
import {CommunityViewComponent} from './views/community/community-view.component';
import {UserViewComponent} from './views/user/user-view.component';
import {LoginViewComponent} from './views/login/login-view.component';
import {SignUpViewComponent} from './views/sign-up/sign-up-view.component';
import {PostViewComponent} from './views/post/post-view.component';
import {PasswordResetViewComponent} from './views/password-reset/password-reset-view.component';
import {CreateCommunityDialogComponent} from './components/community/create-community-dialog/create-community-dialog.component';
import {CreatePostDialogComponent} from './components/post/create-post-dialog/create-post-dialog.component';
import {OverviewComponent} from './components/overview/overview.component';
import {CommunityComponent} from './components/community/community/community.component';
import {CommunityEditorComponent} from './components/community/community-editor/community-editor.component';
import {AuthenticationGuardService} from './services/authentication/authentication-guard.service';
import {IndexViewComponent} from './views/index/index-view.component';
import {NotFoundViewComponent} from './views/not-found/not-found-view.component';
import {TopCommunitiesViewComponent} from './views/top-communities/top-communities-view.component';
import {UserMenuItemComponent} from './components/user-menu-item/user-menu-item.component';
import { LoginSignUpMenuItemComponent } from './components/login-sign-up-menu-item/login-sign-up-menu-item.component';
import { CommentEditorComponent } from './components/comment/comment-editor/comment-editor.component';
import { CommentComponent } from './components/comment/comment/comment.component';
import { ReplyEditorComponent } from './components/comment/reply-editor/reply-editor.component';
import { PostEditEditorComponent } from './components/post/post-edit-editor/post-edit-editor.component';
import {AppEditorModule} from './modules/editor/app-editor.module';
import { SignUpStepperComponent } from './components/sign-up/sign-up-stepper/sign-up-stepper.component';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    SearchComponent,
    LoginFormComponent,
    SignUpFormComponent,
    AccountMenuComponent,
    ActivationFormComponent,
    HomeViewComponent,
    PostEditorComponent,
    PostComponent,
    TextEditorComponent,
    MediaUploaderComponent,
    LinkResolverComponent,
    NavigationComponent,
    PopularViewComponent,
    AllViewComponent,
    CommunityViewComponent,
    UserViewComponent,
    LoginViewComponent,
    SignUpViewComponent,
    PostViewComponent,
    PasswordResetViewComponent,
    CreateCommunityDialogComponent,
    CreatePostDialogComponent,
    OverviewComponent,
    CommunityComponent,
    CommunityEditorComponent,
    IndexViewComponent,
    NotFoundViewComponent,
    TopCommunitiesViewComponent,
    UserMenuItemComponent,
    LoginSignUpMenuItemComponent,
    CommentEditorComponent,
    CommentComponent,
    ReplyEditorComponent,
    PostEditEditorComponent,
    SignUpStepperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppEditorModule,
    FlexLayoutModule,
    MatGridListModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatListModule,
    SocialLoginModule,
    MatTabsModule,
    MatRippleModule,
    MatSelectModule,
    MatStepperModule,
    MatAutocompleteModule
  ],
  providers: [
    AuthenticationGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  entryComponents: [
    CreatePostDialogComponent,
    CreateCommunityDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
