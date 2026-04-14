import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usernav } from './usernav';

describe('Usernav', () => {
  let component: Usernav;
  let fixture: ComponentFixture<Usernav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Usernav],
    }).compileComponents();

    fixture = TestBed.createComponent(Usernav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
