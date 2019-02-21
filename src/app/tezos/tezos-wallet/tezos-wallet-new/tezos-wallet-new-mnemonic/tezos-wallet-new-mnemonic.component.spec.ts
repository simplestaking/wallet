import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletNewMnemonicComponent } from './tezos-wallet-new-mnemonic.component';

describe('TezosWalletNewMnemonicComponent', () => {
  let component: TezosWalletNewMnemonicComponent;
  let fixture: ComponentFixture<TezosWalletNewMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletNewMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletNewMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
