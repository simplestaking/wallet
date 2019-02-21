import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletNewRestoreComponent } from './tezos-wallet-new-restore.component';

describe('TezosWalletNewRestoreComponent', () => {
  let component: TezosWalletNewRestoreComponent;
  let fixture: ComponentFixture<TezosWalletNewRestoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletNewRestoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletNewRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
