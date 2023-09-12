import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNewsViewComponent } from './custom-news-view.component';

describe('CustomNewsViewComponent', () => {
  let component: CustomNewsViewComponent;
  let fixture: ComponentFixture<CustomNewsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomNewsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomNewsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
