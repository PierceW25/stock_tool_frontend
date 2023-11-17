import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountViewComponent } from './delete-account-view.component';

describe('DeleteAccountViewComponent', () => {
  let component: DeleteAccountViewComponent;
  let fixture: ComponentFixture<DeleteAccountViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteAccountViewComponent]
    });
    fixture = TestBed.createComponent(DeleteAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
