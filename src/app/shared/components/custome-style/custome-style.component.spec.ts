import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeStyleComponent } from './custome-style.component';

describe('CustomeStyleComponent', () => {
  let component: CustomeStyleComponent;
  let fixture: ComponentFixture<CustomeStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomeStyleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomeStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
