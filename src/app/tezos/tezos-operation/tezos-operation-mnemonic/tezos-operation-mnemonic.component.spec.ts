import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationMnemonicComponent } from './tezos-operation-mnemonic.component';

describe('TezosOperationMnemonicComponent', () => {
  let component: TezosOperationMnemonicComponent;
  let fixture: ComponentFixture<TezosOperationMnemonicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationMnemonicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
