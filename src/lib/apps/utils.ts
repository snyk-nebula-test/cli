/**
 * Collection of utility function for the
 * $snyk apps commands
 */
import {
  EAppsURL,
  IApiV3Headers,
  ICreateAppRes,
  IGetAppsURLOpts,
  IV3ErrorResponse,
  SNYK_APP_DEBUG,
} from '.';
import { getAuthHeader } from '../api-token';
import chalk from 'chalk';
import { AuthFailedError } from '../errors';
import * as Debug from 'debug';
import config from '../config';

const debug = Debug(SNYK_APP_DEBUG);

export function getAppsURL(
  selection: EAppsURL,
  opts: IGetAppsURLOpts = {},
): string {
  // Get the V3 URL from user config
  const baseURL = config.API_V3;

  debug(`Base URL => ${baseURL}`);

  switch (selection) {
    case EAppsURL.CREATE_APP:
      return `${baseURL}/orgs/${opts.orgId}/apps`;
    case EAppsURL.DELETE_APP:
      return `${baseURL}/orgs/${opts.orgId}/apps/${opts.clientId}`;
    default:
      return baseURL;
  }
}

export function getV3Headers(): IApiV3Headers {
  return {
    'Content-Type': 'application/vnd.api+json',
    authorization: getAuthHeader(),
  };
}

export function handleV3Error(error: any): void {
  if (error.code) {
    if (error.code === 400) {
      // Bad request
      const responseJSON: IV3ErrorResponse = JSON.parse(error.body);
      const errString = errorsToDisplayString(responseJSON);
      throw new Error(errString);
    } else if (error.code === 401) {
      // Unauthorized
      throw AuthFailedError(
        'Unauthorized: the request requires an authentication token or a token with more permissions.',
      );
    } else if (error.code === 403) {
      throw new Error(
        'Forbidden: the authentication token does not have access to the resource.',
      );
    } else if (error.code === 404) {
      const responseJSON: IV3ErrorResponse = JSON.parse(error.body);
      const errString = errorsToDisplayString(responseJSON);
      throw new Error(errString);
    } else {
      throw new Error(error.message);
    }
  } else {
    throw error;
  }
}

/**
 *
 * @param errRes V3Error response
 * @returns {String} Iterates over error and
 * converts them into a readible string
 */
function errorsToDisplayString(errRes: IV3ErrorResponse): string {
  let resString = `
  Uh oh! something went wrong\n`;
  if (!errRes.errors) return resString;
  errRes.errors.forEach((e) => {
    let metaString = '',
      sourceString = '';
    if (e.meta) {
      for (const [key, value] of Object.entries(e.meta)) {
        metaString += `\n\t\t${key}: ${value}\t\t`;
      }
    }
    if (e.source) {
      for (const [key, value] of Object.entries(e.source)) {
        sourceString += `\n\t\t${key}: ${value}\t\t`;
      }
    }

    const meta = metaString || '-';
    const source = sourceString || '-';
    resString += `
        Details: ${e.detail}
        Request Status: ${e.status}
        Source: ${source}
        Meta: ${meta}
        `;
  });
  return resString;
}

export function handleCreateAppRes(res: ICreateAppRes): string {
  const {
    name,
    clientId,
    redirectUris,
    scopes,
    isPublic,
    clientSecret,
  } = res.data.attributes;
  return `
  Snyk App created successfully!

  Please ensure you save the following details:

  1. App Name: ${chalk.greenBright(name)}
  2. Client ID: ${chalk.greenBright(clientId)}
  3. Redirect URIs: ${chalk.greenBright(redirectUris.toString())}
  4. Scopes: ${chalk.greenBright(scopes.toString())}
  5. Is App Public: ${chalk.greenBright(`${isPublic}`)}
  6. Client Secret(${chalk.redBright(
    'keep it safe and protected',
  )}): ${chalk.greenBright(clientSecret)}
  `;
}

export function handleDeleteAppRes(orgId: string, clientId: string): string {
  return `
    Snyk App with org id: ${orgId} and client id: ${clientId} delete successfully!
    `;
}
