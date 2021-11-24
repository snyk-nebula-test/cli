import * as Debug from 'debug';
import {
  EAppsURL,
  getAppsURL,
  getV3Headers,
  handleCreateAppRes,
  handleV3Error,
  ICreateAppData,
  ICreateAppRes,
  SNYK_APP_DEBUG,
} from '../../../lib/apps';
import { makeRequestV3 } from '../../../lib/request/promise';
import { spinner } from '../../../lib/spinner';

const debug = Debug(SNYK_APP_DEBUG);

export async function createApp(
  data: ICreateAppData,
): Promise<string | undefined> {
  const {
    orgId,
    snykAppName: name,
    snykAppRedirectUris: redirectUris,
    snykAppScopes: scopes,
  } = data;
  const payload = {
    method: 'POST',
    url: getAppsURL(EAppsURL.CREATE_APP, { orgId }),
    json: true,
    headers: getV3Headers(),
    body: {
      name,
      redirectUris,
      scopes,
    },
    qs: {
      version: '2021-08-11~experimental',
    },
  };

  try {
    await spinner('Creating your Snyk App');
    const response = await makeRequestV3(payload);
    const responseJSON = JSON.parse(response as any) as ICreateAppRes;
    debug(responseJSON);
    return handleCreateAppRes(responseJSON);
  } catch (error) {
    spinner.clearAll();
    handleV3Error(error);
  }
}
