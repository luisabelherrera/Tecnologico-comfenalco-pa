import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGestionComponent } from './chat-gestion.component';

describe('ChatGestionComponent', () => {
  let component: ChatGestionComponent;
  let fixture: ComponentFixture<ChatGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
