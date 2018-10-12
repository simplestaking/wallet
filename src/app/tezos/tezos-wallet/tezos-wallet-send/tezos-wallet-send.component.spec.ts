import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletSendComponent } from './tezos-wallet-send.component';

describe('TezosWalletSendComponent', () => {
  let component: TezosWalletSendComponent;
  let fixture: ComponentFixture<TezosWalletSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
