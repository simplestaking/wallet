import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletDialogAppUpdateComponent } from './tezos-wallet-dialog-app-update.component';

describe('TezosWalletDialogAppUpdateComponent', () => {
  let component: TezosWalletDialogAppUpdateComponent;
  let fixture: ComponentFixture<TezosWalletDialogAppUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletDialogAppUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletDialogAppUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
