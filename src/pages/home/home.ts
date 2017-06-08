import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginPage } from '../auth/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public nav: NavController, public oauthService: OAuthService) {
  }

  logout() {
    this.oauthService.logOut();
    this.nav.setRoot(LoginPage);
    this.nav.popToRoot();
  }

  get givenName() {
    const claims = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims.name;
  }

  get claims() {
    return this.oauthService.getIdentityClaims();
  }
}
