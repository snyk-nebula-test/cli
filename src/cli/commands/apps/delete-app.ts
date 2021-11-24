import {
  EAppsURL,
  getAppsURL,
  getV3Headers,
  handleDeleteAppRes,
  handleV3Error,
} from '../../../lib/apps';
import { makeRequestV3 } from '../../../lib/request/promise';
import { spinner } from '../../../lib/spinner';

export async function deleteApp(
  orgId: string,
  clientId: string,
): Promise<string | undefined> {
  const payload = {
    method: 'DELETE',
    url: getAppsURL(EAppsURL.DELETE_APP, { clientId, orgId }),
    headers: getV3Headers(),
    qs: {
      version: '2021-08-11~experimental',
    },
  };

  try {
    await spinner('Deleting your app');
    await makeRequestV3(payload);
    return handleDeleteAppRes(orgId, clientId);
  } catch (error) {
    spinner.clearAll();
    handleV3Error(error);
  }
}
