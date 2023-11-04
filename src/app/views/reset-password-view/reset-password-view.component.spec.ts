import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordViewComponent } from './reset-password-view.component';

describe('ResetPasswordViewComponent', () => {
  let component: ResetPasswordViewComponent;
  let fixture: ComponentFixture<ResetPasswordViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordViewComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
