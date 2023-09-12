import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDisplaysComponent } from './index-displays.component';

describe('IndexDisplaysComponent', () => {
  let component: IndexDisplaysComponent;
  let fixture: ComponentFixture<IndexDisplaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDisplaysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexDisplaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
