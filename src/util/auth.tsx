import * as auth0 from 'auth0-js';
import { Auth0DecodedHash } from 'auth0-js';

const auth = new auth0.WebAuth({
  domain: 'if-eth.auth0.com',
  clientID: '6HXoI5ljFO6IMsMttUAQbcjn7JGtDg9T',
  redirectUri: `${window.location.protocol}//${window.location.host}/`,
  audience: 'https://if-eth.auth0.com/userinfo',
  responseType: 'id_token',
  scope: 'openid'
});

const AUTH_RESULT = 'auth_result';

function setSession(authResult: Auth0DecodedHash | null) {
  localStorage.setItem(AUTH_RESULT, JSON.stringify(authResult));
}

function removeSession(): void {
  localStorage.removeItem(AUTH_RESULT);
}

function getSession(): Auth0DecodedHash | null {
  const sessionText = localStorage.getItem(AUTH_RESULT);
  if (sessionText) {
    return JSON.parse(sessionText);
  }
  return null;
}

export default class Auth {
  static login() {
    auth.authorize();
  }

  static logout() {
    removeSession();
  }

  static async handleAuthentication(): Promise<Auth0DecodedHash> {
    const existingSession = getSession();

    return new Promise((resolve, reject) => {
      auth.parseHash(
        (err, authResult) => {
          if (authResult && authResult.idToken) {
            setSession(authResult);
            resolve(authResult);
          } else {
            if (err) {
              removeSession();
              console.error(err);
              reject();
            } else {
              // if there's a valid existing session, use it
              if (existingSession) {
                resolve(existingSession);
              } else {
                reject();
              }
            }
          }
        }
      );
    });
  }

  static getIdToken(): string | null {
    const storedAuth = getSession();
    if (!storedAuth) {
      return null;
    }

    const { idToken } = storedAuth;
    return idToken || null;
  };
}
