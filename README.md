# Ionic App with Okta Authentication

> An Ionic application that uses Cordova's in-app browser to log in with Okta.

To run this application, you will need to install [Node.js](https://nodejs.org/). Then run the following command to install Ionic and Cordova.

```
npm install -g cordova ionic
```

You'll need be able to run the application:

```
npm install
ionic serve
```

To integrate Okta's Identity Platform for user authentication, you'll first need to:

* [Register](https://www.okta.com/developer/signup/) and create an OIDC application
* Log in to your Okta account and navigate to **Applications > Add Application** 
* Select **SPA** and click **Next**
* Give your application a name (e.g. "Ionic OIDC")
* Change the **Base URI** and **Login redirect URI** to `http://localhost:8100` and click **Done**. You should see settings like the following:

![Okta OIDC Settings](https://developer.okta.com/assets/blog/ionic-authentication/oidc-settings-46747e5e9af164cf56d05f055a659520252558872d9319cadd831d5e7104b990.png)
