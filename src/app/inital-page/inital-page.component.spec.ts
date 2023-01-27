import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitalPageComponent } from './inital-page.component';

describe('InitalPageComponent', () => {
  let component: InitalPageComponent;
  let fixture: ComponentFixture<InitalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitalPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
