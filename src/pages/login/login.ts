import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { TabsPage } from '../tabs/tabs';
declare const OktaAuth: any;
declare const window: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  @ViewChild('email') email: any;
  private username: string;
  private password: string;
  private error: string;

  constructor(private navCtrl: NavController, private oauthService: OAuthService) {
    oauthService.redirectUri = 'http://localhost:8100';
    oauthService.clientId = 'x93g6YgYUADVWaxrybOr';
    oauthService.scope = 'openid profile email';
    oauthService.issuer = 'https://dev-158606.oktapreview.com/oauth2/default';
  }

  ionViewDidLoad(): void {
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }

  login(): void {
    this.oauthService.createAndSaveNonce().then(nonce => {
      const authClient = new OktaAuth({
        clientId: this.oauthService.clientId,
        redirectUri: this.oauthService.redirectUri,
        url: 'https://dev-158606.oktapreview.com',
        issuer: this.oauthService.issuer
      });
      authClient.signIn({
        username: this.username,
        password: this.password
      }).then((response) => {
        if (response.status === 'SUCCESS') {
          authClient.token.getWithoutPrompt({
            nonce: nonce,
            responseType: ['id_token', 'token'],
            sessionToken: response.sessionToken,
            scopes: this.oauthService.scope.split(' ')
          })
            .then((tokens) => {
              // oauthService.processIdToken doesn't set an access token
              // set it manually so oauthService.authorizationHeader() works
              localStorage.setItem('access_token', tokens[1].accessToken);
              this.oauthService.processIdToken(tokens[0].idToken, tokens[1].accessToken);
              this.navCtrl.push(TabsPage);
            })
            .catch(error => console.error(error));
        } else {
          throw new Error('We cannot handle the ' + response.status + ' status');
        }
      }).fail((error) => {
        console.error(error);
        this.error = error.message;
      });
    });
  }

  redirectLogin() {
    this.oktaLogin().then(success => {
      localStorage.setItem('access_token', success.access_token);
      this.oauthService.processIdToken(success.id_token, success.access_token);
      this.navCtrl.push(TabsPage);
    }, (error) => {
      this.error = error;
    });
  }

  oktaLogin(): Promise<any> {
    return this.oauthService.createAndSaveNonce().then(nonce => {
      let state: string = Math.floor(Math.random() * 1000000000).toString();
      if (window.crypto) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        state = array.join().toString();
      }
      return new Promise((resolve, reject) => {
        const oauthUrl = this.buildOAuthUrl(state, nonce);
        const browser = window.cordova.InAppBrowser.open(oauthUrl, '_blank',
          'location=no,clearsessioncache=yes,clearcache=yes');
        browser.addEventListener('loadstart', (event) => {
          if ((event.url).indexOf('http://localhost:8100') === 0) {
            browser.removeEventListener('exit', () => {});
            browser.close();
            const responseParameters = ((event.url).split('#')[1]).split('&');
            const parsedResponse = {};
            for (let i = 0; i < responseParameters.length; i++) {
              parsedResponse[responseParameters[i].split('=')[0]] =
                responseParameters[i].split('=')[1];
            }
            const defaultError = 'Problem authenticating with Okta';
            if (parsedResponse['state'] !== state) {
              reject(defaultError);
            } else if (parsedResponse['access_token'] !== undefined &&
              parsedResponse['access_token'] !== null) {
              resolve(parsedResponse);
            } else {
              reject(defaultError);
            }
          }
        });
        browser.addEventListener('exit', function (event) {
          reject('The Okta sign in flow was canceled');
        });
      });
    });
  }

  buildOAuthUrl(state, nonce): string {
    return this.oauthService.issuer + '/v1/authorize?' +
      'client_id=' + this.oauthService.clientId + '&' +
      'redirect_uri=' + this.oauthService.redirectUri + '&' +
      'response_type=id_token%20token&' +
      'scope=' + encodeURI(this.oauthService.scope) + '&' +
      'state=' + state + '&nonce=' + nonce;
  }
}
