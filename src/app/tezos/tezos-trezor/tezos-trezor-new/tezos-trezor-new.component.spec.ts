import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosTrezorNewComponent } from './tezos-trezor-new.component';

describe('TezosTrezorNewComponent', () => {
  let component: TezosTrezorNewComponent;
  let fixture: ComponentFixture<TezosTrezorNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosTrezorNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosTrezorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
