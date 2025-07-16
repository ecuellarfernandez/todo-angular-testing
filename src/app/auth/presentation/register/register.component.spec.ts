import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
        imports: [RegisterComponent, HttpClientModule],
        providers: [
            { provide: Router, useValue: routerSpy }
        ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        //@ts-ignore
        expect(component).toBeTruthy();
    });

    it('debería marcar el formulario como inválido si los campos están vacíos', () => {
        component.form.controls['username'].setValue('');
        component.form.controls['name'].setValue('');
        component.form.controls['email'].setValue('');
        component.form.controls['password'].setValue('');
        component.form.controls['confirmPassword'].setValue('');
        //@ts-ignore
        expect(component.form.invalid).toBeTrue();
    });

    it('debería marcar todos los campos como tocados si el formulario es inválido', () => {
        const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');
        component.form.controls['username'].setValue('');
        component.form.controls['name'].setValue('');
        component.form.controls['email'].setValue('');
        component.form.controls['password'].setValue('');
        component.form.controls['confirmPassword'].setValue('');
        component.onSubmit();
        //@ts-ignore
        expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debería mostrar mensaje de error si registro falla', () => {
        const error = 'Error al registrar el usuario. Por favor, inténtelo de nuevo.';
        spyOn(component['registerUseCase'], 'execute').and.returnValue({
        subscribe: (handlers: any) => {
            handlers.error('error');
        }
        } as any);
        component.form.controls['username'].setValue('testuser');
        component.form.controls['name'].setValue('Test User');
        component.form.controls['email'].setValue('test@email.com');
        component.form.controls['password'].setValue('Password123!');
        component.form.controls['confirmPassword'].setValue('Password123!');
        component.onSubmit();
        //@ts-ignore
        expect(component.errorMessage).toBe(error);
    });

    it('debería guardar el token en localStorage y navegar a /login tras registro exitoso', () => {
        spyOn(localStorage, 'setItem');
        const userMock = { token: 'abc123', email: 'test@email.com' };
        spyOn(component['registerUseCase'], 'execute').and.returnValue({
        subscribe: (handlers: any) => {
            handlers.next(userMock);
        }
        } as any);
        component.form.controls['username'].setValue('testuser');
        component.form.controls['name'].setValue('Test User');
        component.form.controls['email'].setValue('test@email.com');
        component.form.controls['password'].setValue('Password123!');
        component.form.controls['confirmPassword'].setValue('Password123!');
        component.onSubmit();
        //@ts-ignore
        expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'abc123');
        //@ts-ignore
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('debería navegar a /login cuando se llama navigateToLogin', () => {
        component.navigateToLogin();
        //@ts-ignore
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('debería validar que las contraseñas coincidan', () => {
        component.form.controls['username'].setValue('testuser');
        component.form.controls['name'].setValue('Test User');
        component.form.controls['email'].setValue('test@email.com');
        component.form.controls['password'].setValue('Password123!');
        component.form.controls['confirmPassword'].setValue('DifferentPassword123!');
        //@ts-ignore
        expect(component.form.invalid).toBeTrue();
    });

    it('debería validar que el formulario sea válido con datos correctos', () => {
        component.form.controls['username'].setValue('testuser');
        component.form.controls['name'].setValue('Test User');
        component.form.controls['email'].setValue('test@email.com');
        component.form.controls['password'].setValue('Password123!');
        component.form.controls['confirmPassword'].setValue('Password123!');
        //@ts-ignore
        expect(component.form.valid).toBeTrue();
    });

    it('debería validar longitud mínima del username', () => {
        component.form.controls['username'].setValue('ab');
        //@ts-ignore
        expect(component.form.controls['username'].invalid).toBeTrue();
    });

    it('debería validar longitud máxima del username', () => {
        component.form.controls['username'].setValue('a'.repeat(21));
        //@ts-ignore
        expect(component.form.controls['username'].invalid).toBeTrue();
    });

    it('debería validar formato de email', () => {
        component.form.controls['email'].setValue('invalid-email');
        //@ts-ignore
        expect(component.form.controls['email'].invalid).toBeTrue();
    });

    it('debería validar longitud mínima de contraseña', () => {
        component.form.controls['password'].setValue('123');
        //@ts-ignore
        expect(component.form.controls['password'].invalid).toBeTrue();
    });
}); 