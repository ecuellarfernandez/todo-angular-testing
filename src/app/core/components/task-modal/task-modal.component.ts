import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../../tasks/domain/models/task.model';
import { noWhitespaceValidator, futureDateValidator, minWordsValidator } from '../../utils/validators';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html'
})
export class TaskModalComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() projectId = '';
  @Input() todoListId = '';
  @Input() task: Task | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{projectId: string, todoListId: string, taskId?: string, task: Partial<Task>}>();
  
  form: FormGroup;
  submitting = false;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        noWhitespaceValidator
      ]],
      description: ['', [
        Validators.maxLength(500),
        minWordsValidator(2)
      ]],
      dueDate: [null, futureDateValidator],
      completed: [false]
    });
  }
  
  ngOnChanges(): void {
    // Resetear el estado de envío cada vez que cambian las propiedades
    this.submitting = false;
    
    if (this.task && this.isEditMode) {
      // Modo edición: cargar datos de la tarea existente
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate ? this.formatDateForInput(new Date(this.task.dueDate)) : null,
        completed: this.task.completed
      });
    } else {
      // Modo creación: resetear completamente el formulario
      this.form.reset({
        title: '',
        description: '',
        dueDate: null,
        completed: false
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
    
    const taskData: Partial<Task> = {
      title: formValue.title,
      description: formValue.description,
      dueDate: formValue.dueDate,
      completed: false // Siempre establecer como false para nuevas tareas
    };
    
    this.save.emit({
      projectId: this.projectId,
      todoListId: this.todoListId,
      taskId: this.isEditMode ? this.task?.id : undefined,
      task: taskData
    });
    
    // Resetear el estado de envío después de emitir el evento
    setTimeout(() => {
      this.submitting = false;
    }, 0);
  }
  
  onClose(): void {
    // Resetear completamente el formulario
    this.form.reset({
      title: '',
      description: '',
      dueDate: null,
      completed: false
    });
    
    // Resetear el estado de envío
    this.submitting = false;
    
    // Emitir evento de cierre
    this.close.emit();
  }
  
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}