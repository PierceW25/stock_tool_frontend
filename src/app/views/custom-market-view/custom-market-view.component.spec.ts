import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMarketViewComponent } from './custom-market-view.component';

describe('CustomMarketViewComponent', () => {
  let component: CustomMarketViewComponent;
  let fixture: ComponentFixture<CustomMarketViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomMarketViewComponent]
    });
    fixture = TestBed.createComponent(CustomMarketViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
