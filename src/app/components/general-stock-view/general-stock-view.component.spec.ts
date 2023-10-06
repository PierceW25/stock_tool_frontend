import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStockViewComponent } from './general-stock-view.component';

describe('GeneralStockViewComponent', () => {
  let component: GeneralStockViewComponent;
  let fixture: ComponentFixture<GeneralStockViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralStockViewComponent]
    });
    fixture = TestBed.createComponent(GeneralStockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
