import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletStartComponent } from './tezos-wallet-start.component';

describe('TezosWalletStartComponent', () => {
  let component: TezosWalletStartComponent;
  let fixture: ComponentFixture<TezosWalletStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
