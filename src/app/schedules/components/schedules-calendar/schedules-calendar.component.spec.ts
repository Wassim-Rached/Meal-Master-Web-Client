import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesCalendarComponent } from './schedules-calendar.component';

describe('SchedulesCalendarComponent', () => {
  let component: SchedulesCalendarComponent;
  let fixture: ComponentFixture<SchedulesCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulesCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulesCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
