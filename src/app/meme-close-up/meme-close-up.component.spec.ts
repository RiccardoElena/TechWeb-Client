import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeCloseUpComponent } from './meme-close-up.component';

describe('MemeCloseUpComponent', () => {
  let component: MemeCloseUpComponent;
  let fixture: ComponentFixture<MemeCloseUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeCloseUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeCloseUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
