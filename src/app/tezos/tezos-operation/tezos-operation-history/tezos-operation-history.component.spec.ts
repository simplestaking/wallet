import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationHistoryComponent } from './tezos-operation-history.component';

describe('TezosOperationHistoryComponent', () => {
  let component: TezosOperationHistoryComponent;
  let fixture: ComponentFixture<TezosOperationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
