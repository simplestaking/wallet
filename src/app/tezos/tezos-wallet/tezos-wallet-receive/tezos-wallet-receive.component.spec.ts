import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletReceiveComponent } from './tezos-wallet-receive.component';

describe('TezosWalletReceiveComponent', () => {
  let component: TezosWalletReceiveComponent;
  let fixture: ComponentFixture<TezosWalletReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
