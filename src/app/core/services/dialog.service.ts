import { Injectable, ComponentRef, createComponent, ApplicationRef, EnvironmentInjector, inject } from '@angular/core';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private appRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);
  private dialogComponentRef: ComponentRef<ConfirmationDialogComponent> | null = null;

  /**
   * Muestra un diálogo de confirmación
   * @param options Opciones del diálogo
   * @returns Promesa que se resuelve con true si el usuario confirma, false si cancela
   */
  confirm(options: {
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // Si ya hay un diálogo abierto, lo cerramos
      this.closeDialog();

      // Creamos el componente de diálogo
      this.dialogComponentRef = createComponent(ConfirmationDialogComponent, {
        environmentInjector: this.environmentInjector
      });

      // Configuramos las propiedades del diálogo
      const instance = this.dialogComponentRef.instance;
      instance.title = options.title || 'Confirmar';
      instance.message = options.message || '¿Está seguro de que desea realizar esta acción?';
      instance.confirmButtonText = options.confirmButtonText || 'Confirmar';
      instance.cancelButtonText = options.cancelButtonText || 'Cancelar';
      instance.isOpen = true;

      // Manejamos los eventos
      instance.confirm.subscribe(() => {
        this.closeDialog();
        resolve(true);
      });

      instance.cancel.subscribe(() => {
        this.closeDialog();
        resolve(false);
      });

      // Añadimos el componente al DOM
      document.body.appendChild(this.dialogComponentRef.location.nativeElement);
      this.appRef.attachView(this.dialogComponentRef.hostView);
    });
  }

  private closeDialog(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.location.nativeElement.remove();
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}