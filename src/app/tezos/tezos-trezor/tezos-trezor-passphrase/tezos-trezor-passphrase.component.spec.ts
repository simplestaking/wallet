import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosTrezorPassphraseComponent } from './tezos-trezor-passphrase.component';

describe('TezosTrezorPassphraseComponent', () => {
  let component: TezosTrezorPassphraseComponent;
  let fixture: ComponentFixture<TezosTrezorPassphraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosTrezorPassphraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosTrezorPassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
