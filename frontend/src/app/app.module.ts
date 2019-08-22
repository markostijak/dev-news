import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import {
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
  MatSidenavModule,
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
import {NewPostComponent} from './components/post/new-post/new-post.component';
import {SocialLoginModule} from 'angularx-social-login';
import {JwtInterceptorService} from './services/authentication/jwt-interceptor.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ActivationFormComponent} from './components/sign-up/activation-form/activation-form.component';
import {HomeComponent} from './views/home/home.component';
import {PostEditorComponent} from './components/post/post-editor/post-editor.component';
import {PostComponent} from './components/post/post/post.component';
import {TextEditorComponent} from './components/editor/text-editor/text-editor.component';
import {MediaUploaderComponent} from './components/editor/media-uploader/media-uploader.component';
import {LinkResolverComponent} from './components/editor/link-resolver/link-resolver.component';

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    SearchComponent,
    LoginFormComponent,
    SignUpFormComponent,
    AccountMenuComponent,
    NewPostComponent,
    ActivationFormComponent,
    HomeComponent,
    PostEditorComponent,
    PostComponent,
    TextEditorComponent,
    MediaUploaderComponent,
    LinkResolverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    QuillModule.forRoot(),
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
    MatRippleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
