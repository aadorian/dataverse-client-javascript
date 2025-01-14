import { GetPrivateUrlDatasetCitation } from '../../../src/datasets/domain/useCases/GetPrivateUrlDatasetCitation';
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testPrivateUrlToken = 'token';

  afterEach(() => {
    sandbox.restore();
  });

  test('should return successful result with citation on repository success', async () => {
    const testCitation = 'test citation';
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const getPrivateUrlDatasetCitationStub = sandbox.stub().returns(testCitation);
    datasetsRepositoryStub.getPrivateUrlDatasetCitation = getPrivateUrlDatasetCitationStub;

    const sut = new GetPrivateUrlDatasetCitation(datasetsRepositoryStub);

    const actual = await sut.execute(testPrivateUrlToken);

    assert.match(actual, testCitation);
    assert.calledWithExactly(getPrivateUrlDatasetCitationStub, testPrivateUrlToken);
  });

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{};
    const testReadError = new ReadError();
    datasetsRepositoryStub.getPrivateUrlDatasetCitation = sandbox.stub().throwsException(testReadError);
    const sut = new GetPrivateUrlDatasetCitation(datasetsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testPrivateUrlToken).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
