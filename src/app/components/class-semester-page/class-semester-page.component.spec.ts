import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSemesterPageComponent } from './class-semester-page.component';

describe('ClassSemesterPageComponent', () => {
  let component: ClassSemesterPageComponent;
  let fixture: ComponentFixture<ClassSemesterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSemesterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSemesterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
