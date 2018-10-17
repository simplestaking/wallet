import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletNewTrezorComponent } from './tezos-wallet-new-trezor.component';

describe('TezosWalletNewTrezorComponent', () => {
  let component: TezosWalletNewTrezorComponent;
  let fixture: ComponentFixture<TezosWalletNewTrezorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletNewTrezorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletNewTrezorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
