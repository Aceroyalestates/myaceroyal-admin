import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwUserComponent } from './veiw-user.component';

describe('VeiwUserComponent', () => {
  let component: VeiwUserComponent;
  let fixture: ComponentFixture<VeiwUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeiwUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiwUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
