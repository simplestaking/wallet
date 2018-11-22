import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletDialogComponent } from './tezos-wallet-dialog.component';

describe('TezosWalletDialogComponent', () => {
  let component: TezosWalletDialogComponent;
  let fixture: ComponentFixture<TezosWalletDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
