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
* Log in to your Okta account and navigate to **Admin > Add Applications** and click **Create New App**
* Select **Single Page App (SPA)** for the Platform and **OpenID Connect** for the sign on method
* Click **Create** and give your application a name (e.g. “Ionic OIDC”)
* On the next screen, add `http://localhost:8100` as a Redirect URI and click **Finish**. You should see settings like the following:

![Okta OIDC Settings](https://cdn.scotch.io/22364/h8AoHSHzTISJE44riOGi_oidc-settings.png)

* Click on the **Assignments** tab and select **Assign** > **Assign to People**
* Assign yourself as a user, or someone else that you have credentials for.

