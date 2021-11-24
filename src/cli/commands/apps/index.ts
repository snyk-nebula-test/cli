import * as Debug from 'debug';
import { MethodArgs } from '../../args';
import { processCommandArgs } from '../process-command-args';
import {
  EValidSubCommands,
  HelpMessages,
  validAppsSubCommands,
  createAppPrompts,
  SNYK_APP_NAME,
  SNYK_APP_REDIRECT_URIS,
  SNYK_APP_SCOPES,
  SNYK_APP_ORG_ID,
  SNYK_APP_DEBUG,
  ICreateAppOptions,
  ICreateAppData,
  ErrorMessages,
} from '../../../lib/apps';
import * as inquirer from '@snyk/inquirer';
import config from '../../../lib/config';
import { createApp } from './create-app';
import { args as argsLib } from '../../args';

const debug = Debug(SNYK_APP_DEBUG);

export default async function apps(
  ...args0: MethodArgs
): Promise<string | undefined | any> {
  debug('Snyk apps CLI called');

  const { options, paths } = processCommandArgs<ICreateAppOptions>(...args0);
  debug(options, paths);

  const commandVerb1 = paths[0];
  const validCommandVerb =
    commandVerb1 && validAppsSubCommands.includes(commandVerb1);

  if (!validCommandVerb) {
    // Display what is available
    debug(`Not a valid sub command ${commandVerb1}`);
    return HelpMessages.availableCommands;
  }

  const rawOptions = argsLib(process.argv).options as ICreateAppOptions;
  debug(`Raw options: `, rawOptions);

  const configOrg = config.org ? decodeURIComponent(config.org) : undefined;

  if (commandVerb1 === EValidSubCommands.CREATE) {
    if (rawOptions.interactive) {
      // Proceed with interactive
      const answers = await inquirer.prompt(createAppPrompts);
      // Process answers
      const snykAppName = answers[SNYK_APP_NAME].trim() as string;
      const snykAppRedirectUris = answers[SNYK_APP_REDIRECT_URIS].trim().split(
        ',',
      ) as string[];
      const snykAppScopes = answers[SNYK_APP_SCOPES].trim().split(
        ',',
      ) as string[];
      const orgId = answers[SNYK_APP_ORG_ID] || configOrg;
      // POST: to create an app
      const res = await createApp({
        orgId,
        snykAppName,
        snykAppRedirectUris,
        snykAppScopes,
      });
      if (res) return res;
    } else {
      // Required options are name, redirectUris, scopes, and org
      const createAppData = validateProcessCreateAppOpts(rawOptions);
      const res = await createApp(createAppData);
      if (res) return res;
    }
  } else {
    debug(`Not a valid sub command ${commandVerb1}`);
    return HelpMessages.availableCommands;
  }
}

function validateProcessCreateAppOpts(
  options: ICreateAppOptions,
): ICreateAppData {
  if (!options.org) {
    throw new Error(ErrorMessages.orgRequired);
  } else if (!options.name) {
    throw new Error(ErrorMessages.nameRequired);
  } else if (!options['redirect-uris']) {
    throw new Error(ErrorMessages.redirectUrisRequired);
  } else if (!options.scopes) {
    throw new Error(ErrorMessages.scopesRequired);
  } else {
    return {
      orgId: options.org,
      snykAppName: options.name,
      snykAppRedirectUris: options['redirect-uris'].split(','),
      snykAppScopes: options.scopes.split(','),
    };
  }
}
