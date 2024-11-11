import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchedulesComponent } from './list-schedules.component';

describe('ListSchedulesComponent', () => {
  let component: ListSchedulesComponent;
  let fixture: ComponentFixture<ListSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
