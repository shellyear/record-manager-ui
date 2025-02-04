// Taken from https://github.com/datagov-cz/assembly-line-shared but using a different config processing mechanism

import {getEnv} from "../../config";
import Routes from "../constants/RoutesConstants";
import {UserManager} from "oidc-client";

// Singleton UserManager instance
let userManager;
export const getUserManager = () => {
  if (!userManager) {
    userManager = new UserManager(getOidcConfig());
  }
  return userManager;
};

/**
 * Base64 encoding helper
 */
const encodeBase64 = (uri) => {
  return window.btoa(uri);
};

/**
 * Forward URI encoding helper
 */
const encodeForwardUri = (uri) => {
  // Since base64 produces equal signs on the end, it needs to be further encoded
  return encodeURI(encodeBase64(uri));
};

export const getOidcConfig = () => {
  const clientId = getEnv("AUTH_CLIENT_ID");
  const baseUrl = resolveUrl();
  return {
    authority: getEnv("AUTH_SERVER_URL"),
    client_id: clientId,
    redirect_uri: `${baseUrl}/oidc-signin-callback?forward_uri=${encodeForwardUri(
      baseUrl
    )}`,
    silent_redirect_uri: `${baseUrl}/oidc-silent-callback`,
    post_logout_redirect_uri: `${baseUrl}/${Routes.dashboard.path}`,
    response_type: "code",
    loadUserInfo: true,
    automaticSilentRenew: true,
    revokeAccessTokenOnSignout: true,
  };
};

function resolveUrl() {
  const loc = window.location;
  let url = loc.protocol + "//" + loc.host;
  const basename = getEnv("BASENAME");
  if (basename !== "/" && basename !== "./") {
    url += basename;
  }
  return url;
}

export const userProfileLink = () => {
  return `${getEnv("AUTH_SERVER_URL")}/account`;
}

/**
 * Helper to generate redirect Uri
 */
export const generateRedirectUri = (forwardUri) => {
  return `${resolveUrl()}/oidc-signin-callback?forward_uri=${encodeForwardUri(
    forwardUri
  )}`;
};

/**
 * OIDC Session storage key name
 */
export const getOidcIdentityStorageKey = () => {
  const oidcConfig = getOidcConfig();
  return `oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`;
};

export function isUsingOidcAuth() {
  return getEnv("AUTHENTICATION", "") === "oidc";
}
