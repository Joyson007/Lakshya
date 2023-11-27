import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

import {IToDo} from '../shared/models';
import {ToDoQuery, ToDoStore} from '../shared/state';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // Store
  private todoStore: ToDoStore = inject(ToDoStore);
  private todoQuery: ToDoQuery = inject(ToDoQuery);

  // Properties
  private router: Router = inject(Router);
  public todoList: Array<IToDo> = [];
  public filteredTodos: Array<IToDo> = [];
  public themeToggle = false;
  public searchControl = new FormControl('');
  private subs: Subscription = new Subscription();

  constructor() {
  }

  ngOnInit(): void {
    const prefersDark: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkTheme(prefersDark.matches);
    prefersDark.addEventListener(
      'change',
      (mediaQuery: MediaQueryListEvent) => this.initializeDarkTheme(mediaQuery.matches)
    );

    this.subs.add(
      this.todoQuery.entriesByTerm().subscribe((todos: IToDo[]): void => {
        this.todoList = todos || [];
        this.filteredTodos = [...this.todoList];
      })
    );

    this.subs.add(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe((value: string | null): void => {
          this.todoQuery.entriesByTerm(value || '').subscribe(
            (todos: IToDo[]): void => {
              this.filteredTodos = [...todos];
            }
          );
        })
    );
  }

  onNewEntry(): void {
    this.router.navigate(['/todo']).then();
  }

  onRemoveEntry(id: string): void {
    this.todoStore.remove(id);
  }

  onViewEntry(id: string): void {
    this.router.navigate(['/todo/edit', id]).then();
  }

  onChangeEntryStatus(todo: IToDo): void {
    this.todoStore.update(todo.id, {...todo, isCompleted: !todo.isCompleted});
  }

  changeTheme(): void {
    this.themeToggle = !this.themeToggle;
    this.toggleDarkTheme(this.themeToggle);
  }


  private initializeDarkTheme(isDark: boolean): void {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  private toggleDarkTheme(shouldAdd: boolean): void {
    document.body.classList.toggle('dark', shouldAdd);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
