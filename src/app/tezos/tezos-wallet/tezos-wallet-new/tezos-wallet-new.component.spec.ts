import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosWalletNewComponent } from './tezos-wallet-new.component';

describe('TezosWalletNewComponent', () => {
  let component: TezosWalletNewComponent;
  let fixture: ComponentFixture<TezosWalletNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosWalletNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosWalletNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
