import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletListComponent } from './tezos-wallet-list.component';

describe('TezosWalletListComponent', () => {
  let component: TezosWalletListComponent;
  let fixture: ComponentFixture<TezosWalletListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
