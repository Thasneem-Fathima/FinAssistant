import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatBoxComponent } from './chat-box.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ChatBoxComponent', () => {
  let component: ChatBoxComponent;
  let fixture: ComponentFixture<ChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBoxComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render four mode buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const modeButtons = buttons.filter((btn) => btn.nativeElement.textContent.trim() !== 'Send');
    expect(modeButtons.length).toBe(4);
  });

  it('should emit modeChanged when a mode is selected', () => {
    spyOn(component.modeChanged, 'emit');
    component.selectMode('budgeting');
    expect(component.modeChanged.emit).toHaveBeenCalledWith('budgeting');
    expect(component.selectedMode).toBe('budgeting');
  });

  it('should emit messageSent when send button is clicked with a non-empty message', () => {
    component.message = 'Hello, world!';
    spyOn(component.messageSent, 'emit');
    component.sendMessage();
    expect(component.messageSent.emit).toHaveBeenCalledWith('Hello, world!');
    expect(component.message).toBe('');
  });

  it('should not emit messageSent when message is empty', () => {
    component.message = '   ';
    spyOn(component.messageSent, 'emit');
    component.sendMessage();
    expect(component.messageSent.emit).not.toHaveBeenCalled();
  });
});