import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosOriginationComponent } from './tezos-origination.component';

describe('TezosOriginationComponent', () => {
  let component: TezosOriginationComponent;
  let fixture: ComponentFixture<TezosOriginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosOriginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosOriginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
