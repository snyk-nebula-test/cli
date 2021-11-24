import { runSnykCLI, runSnykCLIWithUserInputs } from '../../util/runSnykCLI';
import { fakeServer } from '../../../acceptance/fake-server';

// This only works with unix based systems
// const DOWN = '\x1B\x5B\x42';
// const UP = '\x1B\x5B\x41';
const ENTER = '\x0D';
// const SPACE = '\x20';

describe('snyk-apps: create app', () => {
  let server;
  let env: Record<string, string>;

  beforeAll((done) => {
    const port = process.env.PORT || process.env.SNYK_PORT || '12345';
    const baseApi = '/v3';
    env = {
      ...process.env,
      SNYK_API: 'http://localhost:' + port + baseApi,
      SNYK_HOST: 'http://localhost:' + port,
      SNYK_TOKEN: '123456789',
      SNYK_DISABLE_ANALYTICS: '1',
    };
    server = fakeServer(baseApi, env.SNYK_TOKEN);
    server.listen(port, () => {
      done();
    });
  });

  beforeAll(async () => {
    await runSnykCLI(`config set v3endpoint=${env.SNYK_API}`);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    server.restore();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  afterAll(async () => {
    await runSnykCLI(`config clear v3endpoint`);
  });

  const orgId = '4e0828f9-d92a-4f54-b005-6b9d8150b75f';
  const testData = {
    appName: 'Test App',
    redirectURIs: 'https://example.com,https://example1.com',
    scopes: 'apps:beta',
    orgId,
  };

  /**
   * Tests for the interactive mode of the command to create apps
   */
  it('should create app with user provided data (interactive mode)', async () => {
    const res = await runSnykCLIWithUserInputs(
      'apps create --interactive',
      [
        testData.appName,
        ENTER,
        testData.redirectURIs,
        ENTER,
        testData.scopes,
        ENTER,
        testData.orgId,
        ENTER,
      ],
      { env },
    );
    expect(res.code).toBe(0);
    expect(res.stdout).toContain('Snyk App created successfully!');
    expect(res.stdout).toContain(`${testData.appName}`);
    expect(res.stdout).toContain(
      `${testData.redirectURIs.split(' ').join(',')}`,
    );
    expect(res.stdout).toContain(`${testData.scopes.split(' ').join(',')}`);
  });

  it('should create app with user provided data (non-interactive mode)', async () => {
    const res = await runSnykCLI(
      `apps create --org=${testData.orgId} --name="${testData.appName}" --redirect-uris=${testData.redirectURIs} --scopes=${testData.scopes}`,
    );
    expect(res.code).toBe(0);
    expect(res.stdout).toContain('Snyk App created successfully!');
    expect(res.stdout).toContain(`${testData.appName}`);
    expect(res.stdout).toContain(
      `${testData.redirectURIs.split(' ').join(',')}`,
    );
    expect(res.stdout).toContain(`${testData.scopes.split(' ').join(',')}`);
  });
});
