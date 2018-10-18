import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletDelegateComponent } from './tezos-wallet-delegate.component';

describe('TezosWalletDelegateComponent', () => {
  let component: TezosWalletDelegateComponent;
  let fixture: ComponentFixture<TezosWalletDelegateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletDelegateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletDelegateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
