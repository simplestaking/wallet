import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosActivationComponent } from './tezos-activation.component';

describe('TezosActivationComponent', () => {
  let component: TezosActivationComponent;
  let fixture: ComponentFixture<TezosActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
