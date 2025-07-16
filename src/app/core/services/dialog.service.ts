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
   * Abre un diálogo de confirmación
   * @param titleOrOptions Título o objeto con opciones completas
   * @param message Mensaje del diálogo
   * @param confirmButtonText Texto del botón confirmar
   * @param cancelButtonText Texto del botón cancelar
   * @returns Promise<boolean> - true si confirma, false si cancela
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
    // Extraer valores según el tipo de parámetros
    let title: string;
    let msg: string;
    let confirmText: string;
    let cancelText: string | undefined;
    
    if (typeof titleOrOptions === 'object') {
      const options = titleOrOptions;
      title = options.title || 'Confirmar';
      msg = options.message || '¿Está seguro de que desea realizar esta acción?';
      confirmText = options.confirmButtonText || 'Confirmar';
      cancelText = options.cancelButtonText || 'Cancelar';
    } else {
      title = titleOrOptions;
      msg = message || '¿Está seguro de que desea realizar esta acción?';
      confirmText = confirmButtonText || 'Confirmar';
      cancelText = cancelButtonText || 'Cancelar';
    }
    
    return new Promise<boolean>((resolve) => {
      this.closeDialog();

      this.dialogComponentRef = createComponent(ConfirmationDialogComponent, {
        environmentInjector: this.environmentInjector
      });

      const instance = this.dialogComponentRef.instance;
      instance.title = title;
      instance.message = msg;
      instance.confirmButtonText = confirmText;
      instance.cancelButtonText = cancelText;
      instance.isOpen = true;

      instance.confirm.subscribe(() => {
        this.closeDialog();
        resolve(true);
      });

      instance.cancel.subscribe(() => {
        this.closeDialog();
        resolve(false);
      });

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