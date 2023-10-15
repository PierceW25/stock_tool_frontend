import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGrowthMetricsComponent } from './stock-growth-metrics.component';

describe('StockGrowthMetricsComponent', () => {
  let component: StockGrowthMetricsComponent;
  let fixture: ComponentFixture<StockGrowthMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockGrowthMetricsComponent]
    });
    fixture = TestBed.createComponent(StockGrowthMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
