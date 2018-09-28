import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationDelegationComponent } from './tezos-operation-delegation.component';

describe('TezosOperationDelegationComponent', () => {
  let component: TezosOperationDelegationComponent;
  let fixture: ComponentFixture<TezosOperationDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationDelegationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
