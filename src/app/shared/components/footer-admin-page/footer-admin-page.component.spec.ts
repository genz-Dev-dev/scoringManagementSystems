import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAdminPageComponent } from './footer-admin-page.component';

describe('FooterAdminPageComponent', () => {
  let component: FooterAdminPageComponent;
  let fixture: ComponentFixture<FooterAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterAdminPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
