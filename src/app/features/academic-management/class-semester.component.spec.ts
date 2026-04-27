import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSemesterComponent } from './class-semester.component';

describe('ClassSemesterComponent', () => {
  let component: ClassSemesterComponent;
  let fixture: ComponentFixture<ClassSemesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSemesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
