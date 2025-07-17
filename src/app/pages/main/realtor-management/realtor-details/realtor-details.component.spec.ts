import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtorDetailsComponent } from './realtor-details.component';

describe('RealtorDetailsComponent', () => {
  let component: RealtorDetailsComponent;
  let fixture: ComponentFixture<RealtorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtorDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
