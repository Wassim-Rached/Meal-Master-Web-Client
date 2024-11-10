import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMyAccountComponent } from './update-my-account.component';

describe('UpdateMyAccountComponent', () => {
  let component: UpdateMyAccountComponent;
  let fixture: ComponentFixture<UpdateMyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMyAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
