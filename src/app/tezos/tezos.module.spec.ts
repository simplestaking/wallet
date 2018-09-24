import { TezosModule } from './tezos.module';

describe('TezosModule', () => {
  let tezosModule: TezosModule;

  beforeEach(() => {
    tezosModule = new TezosModule();
  });

  it('should create an instance', () => {
    expect(tezosModule).toBeTruthy();
  });
});
