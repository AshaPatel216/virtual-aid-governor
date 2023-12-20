import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThailandComponent } from './thailand.component';

describe('ThailandComponent', () => {
  let component: ThailandComponent;
  let fixture: ComponentFixture<ThailandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThailandComponent]
    });
    fixture = TestBed.createComponent(ThailandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
