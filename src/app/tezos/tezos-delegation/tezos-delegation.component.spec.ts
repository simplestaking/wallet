import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosDelegationComponent } from './tezos-delegation.component';

describe('TezosDelegationComponent', () => {
  let component: TezosDelegationComponent;
  let fixture: ComponentFixture<TezosDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosDelegationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
