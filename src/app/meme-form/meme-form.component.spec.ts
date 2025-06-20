import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeFormComponent } from './meme-form.component';

describe('MemeFormComponent', () => {
  let component: MemeFormComponent;
  let fixture: ComponentFixture<MemeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
