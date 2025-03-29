import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanderComponent } from './lander.component';

describe('LanderComponent', () => {
  let component: LanderComponent;
  let fixture: ComponentFixture<LanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanderComponent], // Standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(LanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a welcome message', () => {
    expect(component.message).toBe('Welcome to FinMate!');
  });

  it('should scroll to section when scrollToSection is called', () => {
    spyOn(document, 'getElementById').and.returnValue({
      scrollIntoView: jasmine.createSpy('scrollIntoView'),
    } as any);
    component.scrollToSection('overview');
    expect(document.getElementById).toHaveBeenCalledWith('overview');
    expect((document.getElementById('overview') as any).scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});