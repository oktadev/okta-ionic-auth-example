import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public oauthService: OAuthService) {
  }

  logout() {
    this.oauthService.logOut();
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
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
