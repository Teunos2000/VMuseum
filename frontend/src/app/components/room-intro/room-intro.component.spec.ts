import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomIntroComponent } from './room-intro.component';

describe('RoomIntroComponent', () => {
  let component: RoomIntroComponent;
  let fixture: ComponentFixture<RoomIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
