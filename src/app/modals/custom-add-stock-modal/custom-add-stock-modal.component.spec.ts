import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAddStockModalComponent } from './custom-add-stock-modal.component';

describe('CustomAddStockModalComponent', () => {
  let component: CustomAddStockModalComponent;
  let fixture: ComponentFixture<CustomAddStockModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomAddStockModalComponent]
    });
    fixture = TestBed.createComponent(CustomAddStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
