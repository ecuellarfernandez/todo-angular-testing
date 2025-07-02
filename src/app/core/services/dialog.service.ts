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
   * @param titleOrOptions Título del diálogo o un objeto con las opciones
   * @param message Mensaje del diálogo (opcional si se pasa un objeto de opciones)
   * @param confirmButtonText Texto del botón de confirmación (opcional si se pasa un objeto de opciones)
   * @param cancelButtonText Texto del botón de cancelación (opcional)
   * @returns Promesa que se resuelve con true si el usuario confirma, false si cancela
   */
  confirm(
    titleOrOptions: string | {
      title?: string;
      message?: string;
      confirmButtonText?: string;
      cancelButtonText?: string;
    },
    message?: string,
    confirmButtonText?: string,
    cancelButtonText?: string
  ): Promise<boolean> {
    // Determinar los valores a usar basados en el tipo de parámetros recibidos
    let title: string;
    let msg: string;
    let confirmText: string;
    let cancelText: string | undefined;
    
    if (typeof titleOrOptions === 'object') {
      // Caso: se pasó un objeto de opciones
      const options = titleOrOptions;
      title = options.title || 'Confirmar';
      msg = options.message || '¿Está seguro de que desea realizar esta acción?';
      confirmText = options.confirmButtonText || 'Confirmar';
      cancelText = options.cancelButtonText || 'Cancelar';
    } else {
      // Caso: se pasaron parámetros individuales
      title = titleOrOptions;
      msg = message || '¿Está seguro de que desea realizar esta acción?';
      confirmText = confirmButtonText || 'Confirmar';
      cancelText = cancelButtonText || 'Cancelar';
    }
    
    return new Promise<boolean>((resolve) => {
      // Si ya hay un diálogo abierto, lo cerramos
      this.closeDialog();

      // Creamos el componente de diálogo
      this.dialogComponentRef = createComponent(ConfirmationDialogComponent, {
        environmentInjector: this.environmentInjector
      });

      // Configuramos las propiedades del diálogo
      const instance = this.dialogComponentRef.instance;
      instance.title = title;
      instance.message = msg;
      instance.confirmButtonText = confirmText;
      instance.cancelButtonText = cancelText;
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