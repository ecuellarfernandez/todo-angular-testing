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
        Validators.maxLength(100),
        noWhitespaceValidator,
        minWordsValidator(2)
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
    this.submitting = false;
    
    if (this.task && this.isEditMode) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate || null,
        completed: this.task.completed
      });
    } else {
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
      completed: this.isEditMode ? formValue.completed : false
    };
    
    this.save.emit({
      projectId: this.projectId,
      todoListId: this.todoListId,
      taskId: this.isEditMode ? this.task?.id : undefined,
      task: taskData
    });
    
    setTimeout(() => {
      this.submitting = false;
    }, 0);
  }
  
  onClose(): void {
    this.form.reset({
      title: '',
      description: '',
      dueDate: null,
      completed: false
    });
    
    this.submitting = false;
    this.close.emit();
  }
  
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}