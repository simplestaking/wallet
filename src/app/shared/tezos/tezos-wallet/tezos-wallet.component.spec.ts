import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletComponent } from './tezos-wallet.component';

describe('TezosWalletComponent', () => {
  let component: TezosWalletComponent;
  let fixture: ComponentFixture<TezosWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
