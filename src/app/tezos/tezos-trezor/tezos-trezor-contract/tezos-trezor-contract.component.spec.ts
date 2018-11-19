import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosTrezorContractComponent } from './tezos-trezor-contract.component';

describe('TezosTrezorContractComponent', () => {
  let component: TezosTrezorContractComponent;
  let fixture: ComponentFixture<TezosTrezorContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosTrezorContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosTrezorContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
