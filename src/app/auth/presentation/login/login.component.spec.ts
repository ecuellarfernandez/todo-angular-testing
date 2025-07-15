import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    expect(component.form.invalid).toBeTrue();
  });

  it('debería llamar a loginUseCase.execute si el formulario es válido', () => {
    const loginSpy = spyOn(component['loginUseCase'], 'execute').and.returnValue({ subscribe: () => {} } as any);
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('123456');
    component.onSubmit();
    expect(loginSpy).toHaveBeenCalledWith('test@email.com', '123456');
  });

  it('debería marcar todos los campos como tocados si el formulario es inválido', () => {
    const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('debería mostrar mensaje de error si login falla', () => {
    const error = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
    spyOn(component['loginUseCase'], 'execute').and.returnValue({
      subscribe: (handlers: any) => {
        handlers.error('error');
      }
    } as any);
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('123456');
    component.onSubmit();
    expect(component.errorMessage).toBe(error);
  });
});
