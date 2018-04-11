import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrezorComponent } from './trezor.component';

describe('TrezorComponent', () => {
  let component: TrezorComponent;
  let fixture: ComponentFixture<TrezorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrezorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrezorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
