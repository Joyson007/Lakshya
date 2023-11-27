import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

import {ToDoQuery} from '../shared/state';
import {IToDo} from '../shared/models';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit, OnDestroy {
  // Store
  private todoQuery: ToDoQuery = inject(ToDoQuery);

  // Properties
  private todoId: string;
  public todo: IToDo;
  private subs: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.todoId = this.route.snapshot.paramMap.get('id')!;

    if (this.todoId) {
      this.subs.add(
        this.todoQuery.entryById(this.todoId).subscribe((value: IToDo | undefined): void => {
          if (value) {
            this.todo = value;
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
