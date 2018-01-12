import { Component } from '@angular/core';
import { App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public app: App, public oauthService: OAuthService) {
  }

  logout() {
    this.oauthService.logOut(true);
    this.app.getRootNavs()[0].setRoot(LoginPage);
  }

  get givenName() {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims.name;
  }

  get claims() {
    return this.oauthService.getIdentityClaims();
  }
}
