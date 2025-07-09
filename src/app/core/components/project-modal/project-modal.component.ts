import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../../projects/domain/models/project.model';
import { noWhitespaceValidator, minWordsValidator } from '../../utils/validators';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-modal.component.html'
})
export class ProjectModalComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() project: Project | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{projectId?: string, project: Partial<Project>}>();
  
  form: FormGroup;
  submitting = false;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        noWhitespaceValidator
      ]],
      description: ['', [
        Validators.maxLength(500),
        minWordsValidator(3)
      ]]
    });
  }
  
  ngOnChanges(): void {
    // Resetear el estado de envío cada vez que cambian las propiedades
    this.submitting = false;
    
    if (this.project && this.isEditMode) {
      // Modo edición: cargar datos del proyecto existente
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description
      });
    } else {
      // Modo creación: resetear completamente el formulario
      this.form.reset({
        name: '',
        description: ''
      });
    }
  }
  
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    const formValue = this.form.value;
    
    const projectData: Partial<Project> = {
      name: formValue.name,
      description: formValue.description
    };
    
    this.save.emit({
      projectId: this.isEditMode ? this.project?.id : undefined,
      project: projectData
    });
    
    // Resetear el estado de envío después de emitir el evento
    setTimeout(() => {
      this.submitting = false;
    }, 0);
  }
  
  onClose(): void {
    // Resetear completamente el formulario
    this.form.reset({
      name: '',
      description: ''
    });
    
    // Resetear el estado de envío
    this.submitting = false;
    
    // Emitir evento de cierre
    this.close.emit();
  }
}