import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineNavComponent } from './chart-line-nav.component';

describe('ChartLineNavComponent', () => {
  let component: ChartLineNavComponent;
  let fixture: ComponentFixture<ChartLineNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartLineNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
