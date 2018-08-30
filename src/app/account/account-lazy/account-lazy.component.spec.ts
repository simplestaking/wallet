import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLazyComponent } from './account-lazy.component';

describe('AccountLazyComponent', () => {
  let component: AccountLazyComponent;
  let fixture: ComponentFixture<AccountLazyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLazyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLazyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
