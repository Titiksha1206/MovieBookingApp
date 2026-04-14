import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userviewbooking } from './userviewbooking';

describe('Userviewbooking', () => {
  let component: Userviewbooking;
  let fixture: ComponentFixture<Userviewbooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Userviewbooking],
    }).compileComponents();

    fixture = TestBed.createComponent(Userviewbooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
