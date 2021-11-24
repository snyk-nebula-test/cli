import chalk from 'chalk';

export enum EValidSubCommands {
  CREATE = 'create',
  GET = 'get',
  EDIT = 'edit',
  DELETE = 'delete',
}

export enum EAppsURL {
  CREATE_APP,
  GET_APP,
  UPDATE_APP,
  DELETE_APP,
  BASE_URL,
}

export const validAppsSubCommands = Object.values<string>(EValidSubCommands);

export const HelpMessages = {
  availableCommands: `
    Missing a subcommand or invalid sub-command for Snyk Apps!

    The available sub-commands are:

    1. ${chalk.greenBright('create')}: ${chalk.yellow('$ snyk apps create')}
    2. ${chalk.greenBright('get')}: ${chalk.yellow('$ snyk apps get')}
    3. ${chalk.greenBright('edit')}: ${chalk.yellow('$ snyk apps edit')}
    4. ${chalk.greenBright('delete')}: ${chalk.yellow('$ snyk apps delete')}
    `,
};

export const SNYK_APP_NAME = 'snykAppName';
export const SNYK_APP_REDIRECT_URIS = 'snykAppRedirectUris';
export const SNYK_APP_SCOPES = 'snykAppScopes';
export const SNYK_APP_CLIENT_ID = 'snykAppClientId';
export const SNYK_APP_ORG_ID = 'snykAppOrgId';
export const SNYK_APP_DELETE = 'snykAppDelete';
export const SNYK_APP_DEBUG = 'snyk-apps';

export const CreateAppPromptData = {
  SNYK_APP_NAME: {
    name: SNYK_APP_NAME,
    message: `Name of the Snyk App (visible to users when they install the Snyk App)?`,
  },
  SNYK_APP_REDIRECT_URIS: {
    name: SNYK_APP_REDIRECT_URIS,
    message: `Your Snyk App's redirect URIs (space seprated list. ${chalk.yellowBright(
      ' Ex: https://example1.com https://example2.com',
    )})?: `,
  },
  SNYK_APP_SCOPES: {
    name: SNYK_APP_SCOPES,
    message: `Your Snyk App's permission scopes (space separated list. ${chalk.yellowBright(
      ' Ex: apps:beta project:read',
    )})?: `,
  },
  SNYK_APP_ORG_ID: {
    name: SNYK_APP_ORG_ID,
    message:
      'Please provide the org id under which you want to create your Snyk App: ',
  },
};

export const ErrorMessages = {
  orgRequired: `
    Option ${chalk.red('--org')} is required!

    Other required options for this command are
    --name, --redirect-uris (comma-separated), 
    --scopes (comma-separated)
  `,
  nameRequired: `
    Option ${chalk.red('--name')} is required!

    Other required options for this command are
    --org, --redirect-uris (comma-separated), 
    --scopes (comma-separated)
  `,
  redirectUrisRequired: `
    Option ${chalk.red('--redirect-uris')} (comma-separated) is required!

    Other required options for this command are
    --org, --name, --scopes (comma-separated)
  `,
  scopesRequired: `
    Option ${chalk.red('--scopes')} (comma-separated) is required!

    Other required options for this command are
    --org, --redirect-uris (comma-separated), --name
  `,
};
