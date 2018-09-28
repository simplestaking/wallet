import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOperationOriginationComponent } from './tezos-operation-origination.component';

describe('TezosOperationOriginationComponent', () => {
  let component: TezosOperationOriginationComponent;
  let fixture: ComponentFixture<TezosOperationOriginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOperationOriginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOperationOriginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
