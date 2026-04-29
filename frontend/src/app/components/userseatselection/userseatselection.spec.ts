import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userseatselection } from './userseatselection';

describe('Userseatselection', () => {
  let component: Userseatselection;
  let fixture: ComponentFixture<Userseatselection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Userseatselection],
    }).compileComponents();

    fixture = TestBed.createComponent(Userseatselection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
