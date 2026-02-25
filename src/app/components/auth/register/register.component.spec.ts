import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ActivatedRoute } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, UserPlus, User, Mail, Lock, CheckCircle, Check } from 'lucide-angular';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        importProvidersFrom(LucideAngularModule.pick({ UserPlus, User, Mail, Lock, CheckCircle, Check }))
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
