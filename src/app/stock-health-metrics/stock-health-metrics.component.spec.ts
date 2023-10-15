import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockHealthMetricsComponent } from './stock-health-metrics.component';

describe('StockHealthMetricsComponent', () => {
  let component: StockHealthMetricsComponent;
  let fixture: ComponentFixture<StockHealthMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockHealthMetricsComponent]
    });
    fixture = TestBed.createComponent(StockHealthMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
