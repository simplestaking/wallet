import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayChartComponent } from './day-chart.component';

describe('DayChartComponent', () => {
  let component: DayChartComponent;
  let fixture: ComponentFixture<DayChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
