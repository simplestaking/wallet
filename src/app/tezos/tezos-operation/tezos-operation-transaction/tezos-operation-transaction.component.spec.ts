import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationTransactionComponent } from './tezos-operation-transaction.component';

describe('TezosOperationTransactionComponent', () => {
  let component: TezosOperationTransactionComponent;
  let fixture: ComponentFixture<TezosOperationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
