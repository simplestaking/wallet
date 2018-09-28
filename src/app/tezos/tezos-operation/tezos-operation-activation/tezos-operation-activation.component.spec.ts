import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationActivationComponent } from './tezos-operation-activation.component';

describe('TezosOperationActivationComponent', () => {
  let component: TezosOperationActivationComponent;
  let fixture: ComponentFixture<TezosOperationActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
