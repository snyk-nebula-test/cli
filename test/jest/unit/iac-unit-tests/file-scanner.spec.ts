import * as path from 'path';
import {
  scanFiles,
  clearPolicyEngineCache,
} from '../../../../src/cli/commands/test/iac-local-execution/file-scanner';
import { LOCAL_POLICY_ENGINE_DIR } from '../../../../src/cli/commands/test/iac-local-execution/local-cache';
import {
  EngineType,
  IacFileParsed,
} from '../../../../src/cli/commands/test/iac-local-execution/types';

import {
  paresdKubernetesFileStub,
  parsedTerraformFileStub,
  parsedArmFileStub,
  expectedViolatedPoliciesForK8s,
  expectedViolatedPoliciesForTerraform,
  expectedViolatedPoliciesForArm,
} from './file-scanner.fixtures';
import * as localCacheModule from '../../../../src/cli/commands/test/iac-local-execution/local-cache';

describe('scanFiles', () => {
  const parsedFiles: Array<IacFileParsed> = [
    paresdKubernetesFileStub,
    parsedTerraformFileStub,
    parsedArmFileStub,
  ];
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(localCacheModule, 'getLocalCachePath');
  });

  afterEach(() => {
    spy.mockReset();
    clearPolicyEngineCache();
  });

  describe('with parsed files', () => {
    it('returns the expected violated policies', async () => {
      const policyEngineCoreDataPath = path.resolve(
        __dirname,
        path.join('../../../smoke', LOCAL_POLICY_ENGINE_DIR),
      );
      const policyEngineMetaDataPath = path.resolve(
        __dirname,
        path.join('../../../smoke', LOCAL_POLICY_ENGINE_DIR),
      );

      spy.mockImplementation((engineType: EngineType) => {
        switch (engineType) {
          case EngineType.Kubernetes:
            return [
              `${policyEngineCoreDataPath}/k8s_policy.wasm`,
              `${policyEngineMetaDataPath}/k8s_data.json`,
            ];
          case EngineType.Terraform:
            return [
              `${policyEngineCoreDataPath}/tf_policy.wasm`,
              `${policyEngineMetaDataPath}/tf_data.json`,
            ];
          case EngineType.CloudFormation:
            return [
              `${policyEngineCoreDataPath}/cloudformation_policy.wasm`,
              `${policyEngineMetaDataPath}/cloudformation_data.json`,
            ];
          case EngineType.ARM:
            return [
              `${policyEngineCoreDataPath}/arm_policy.wasm`,
              `${policyEngineMetaDataPath}/arm_data.json`,
            ];
          default:
            return [];
        }
      });

      const scanResults = await scanFiles(parsedFiles);
      expect(scanResults[0].violatedPolicies).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedViolatedPoliciesForK8s[0]),
        ]),
      );
      expect(scanResults[1].violatedPolicies).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedViolatedPoliciesForTerraform[0]),
        ]),
      );
      expect(scanResults[2].violatedPolicies).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedViolatedPoliciesForArm[0]),
        ]),
      );
    });
    // TODO: Extract policy engine & the cache mechanism, test them separately.
  });

  describe('missing policy engine wasm files', () => {
    it('throws an error', async () => {
      spy.mockImplementation(() => {
        return ['invalid.wasm', 'invalid.json'];
      });
      await expect(scanFiles(parsedFiles)).rejects.toThrow();
    });
  });
});
