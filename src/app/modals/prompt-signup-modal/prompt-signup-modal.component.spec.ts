import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSignupModalComponent } from './prompt-signup-modal.component';

describe('PromptSignupModalComponent', () => {
  let component: PromptSignupModalComponent;
  let fixture: ComponentFixture<PromptSignupModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptSignupModalComponent]
    });
    fixture = TestBed.createComponent(PromptSignupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
