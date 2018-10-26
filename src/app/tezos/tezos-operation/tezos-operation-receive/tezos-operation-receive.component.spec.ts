import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationReceiveComponent } from './tezos-operation-receive.component';

describe('TezosOperationReceiveComponent', () => {
  let component: TezosOperationReceiveComponent;
  let fixture: ComponentFixture<TezosOperationReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
