import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosTransactionComponent } from './tezos-transaction.component';

describe('TezosTransactionComponent', () => {
  let component: TezosTransactionComponent;
  let fixture: ComponentFixture<TezosTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
