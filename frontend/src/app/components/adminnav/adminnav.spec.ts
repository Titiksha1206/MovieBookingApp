import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminnav } from './adminnav';

describe('Adminnav', () => {
  let component: Adminnav;
  let fixture: ComponentFixture<Adminnav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminnav],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminnav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
