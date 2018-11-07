import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezorTrezorDebugComponent } from './tezor-trezor-debug.component';

describe('TezorTrezorDebugComponent', () => {
  let component: TezorTrezorDebugComponent;
  let fixture: ComponentFixture<TezorTrezorDebugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezorTrezorDebugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezorTrezorDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
