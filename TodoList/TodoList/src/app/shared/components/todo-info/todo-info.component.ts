import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToDoStore} from '../../state';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

import {IToDo} from '../../models';

@Component({
  selector: 'app-todo-info',
  templateUrl: './todo-info.component.html',
  styleUrls: ['./todo-info.component.scss'],
  providers: [DatePipe]
})
export class TodoInfoComponent implements OnInit, OnDestroy {
  // Store
  private todoStore: ToDoStore = inject(ToDoStore);

  // Inputs
  @Input() todo: IToDo;

  // Properties
  private router: Router = inject(Router);
  public todoForm: FormGroup;
  public currentDate: string = new Date().toISOString();
  private subs: Subscription = new Subscription();

  // State
  public isEditMode: boolean;

  constructor(
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.todoForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      date: new FormControl(this.currentDate, [Validators.required]),
      formattedDate: new FormControl('')
    });

    if (this.todo) {
      this.isEditMode = true;

      this.todoForm.patchValue({
        title: this.todo.title,
        date: this.todo.date,
        formattedDate: this.datePipe.transform(this.todo.date, 'mediumDate') || ''
      });
    }

    this.subs.add(
      this.todoForm.get('date')?.valueChanges.subscribe((value: string): void => {
        if (value) {
          this.todoForm.get('formattedDate')?.setValue(this.datePipe.transform(value, 'mediumDate') || '');
        }
      })
    );
  }

  public onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    const title: string = this.todoForm.get('title')?.value?.trim();
    const date: string = this.todoForm.get('date')?.value?.trim();

    const todo: IToDo = {
      id: Date.now().toString(),
      title,
      isCompleted: false,
      date
    };

    if (this.isEditMode) {
      this.todoStore.update(this.todo.id, {...this.todo, title: title, date: date});
    } else {
      this.todoStore.add(todo, {prepend: true});
    }

    this.router.navigate(['/home']).then();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
