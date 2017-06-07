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
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  loginWithPassword(): void {
    this.oauthService.createAndSaveNonce().then(nonce => {
      const authClient = new OktaAuth({
        clientId: this.oauthService.clientId,
        redirectUri: window.location.origin,
        url: this.oauthService.issuer
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
            scopes: ['openid', 'email', 'profile']
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

  // https://docs.ionic.io/services/auth/custom-auth.html - requires server
  // https://www.thepolyglotdeveloper.com/2016/01/using-an-oauth-2-0-service-within-an-ionic-2-mobile-app/
  oktaLogin(): Promise<any> {
    return this.oauthService.createAndSaveNonce().then(nonce => {
      return new Promise(function (resolve, reject) {
        const browserRef = window.cordova.InAppBrowser.open("https://dev-158606.oktapreview.com/oauth2/v1/authorize?client_id=RqjWvpvWO77qMGgDfukY&redirect_uri=http://localhost:8100&response_type=id_token%20token&scope=openid%20email%20profile&state=12345&nonce=" + nonce, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
        browserRef.addEventListener("loadstart", (event) => {
          if ((event.url).indexOf("http://localhost:8100") === 0) {
            browserRef.removeEventListener("exit", () => {});
            browserRef.close();
            const responseParameters = ((event.url).split("#")[1]).split("&");
            const parsedResponse = {};
            for (let i = 0; i < responseParameters.length; i++) {
              parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
            }
            if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
              resolve(parsedResponse);
            } else {
              reject("Problem authenticating with Okta");
            }
          }
        });
        browserRef.addEventListener("exit", function (event) {
          reject("The Okta sign in flow was canceled");
        });
      });
    });
  }

  ionViewDidLoad(): void {
    setTimeout(() => {
      this.email.setFocus();
    }, 500);
  }
}
