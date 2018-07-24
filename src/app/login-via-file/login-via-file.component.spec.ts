import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginViaFileComponent } from './login-via-file.component';

describe('LoginViaFileComponent', () => {
  let component: LoginViaFileComponent;
  let fixture: ComponentFixture<LoginViaFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginViaFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginViaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
