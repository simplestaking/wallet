import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosTrezorConnectComponent } from './tezos-trezor-connect.component';

describe('TezosTrezorConnectComponent', () => {
  let component: TezosTrezorConnectComponent;
  let fixture: ComponentFixture<TezosTrezorConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosTrezorConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosTrezorConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
