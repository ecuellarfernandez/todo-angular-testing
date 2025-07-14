import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoList } from '../../../todolists/domain/models/todolist.model';
import { noWhitespaceValidator, minWordsValidator } from '../../utils/validators';

@Component({
  selector: 'app-todolist-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todolist-modal.component.html'
})
export class TodoListModalComponent {
  @Input() isOpen = false;
  @Input() isEditMode = false;
  @Input() projectId = '';
  @Input() todoList: TodoList | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{projectId: string, todoListId?: string, name: string}>();
  
  form: FormGroup;
  submitting = false;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(100),
        noWhitespaceValidator,
        minWordsValidator(2)
      ]]
    });
  }
  
  ngOnChanges(): void {
    // Resetear el estado de envío cada vez que cambian las propiedades
    this.submitting = false;
    
    if (this.todoList && this.isEditMode) {
      this.form.patchValue({
        name: this.todoList.name
      });
    } else {
      this.form.reset();
    }
  }
  
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    const { name } = this.form.value;
    
    this.save.emit({
      projectId: this.projectId,
      todoListId: this.isEditMode ? this.todoList?.id : undefined,
      name
    });
  }
  
  onClose(): void {
    this.form.reset();
    this.submitting = false;
    this.close.emit();
  }
}