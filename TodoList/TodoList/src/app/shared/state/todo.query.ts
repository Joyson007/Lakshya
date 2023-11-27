import {QueryEntity} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ToDoState, ToDoStore} from './todo.store';
import {IToDo} from '../models';

@Injectable({providedIn: 'root'})
export class ToDoQuery extends QueryEntity<ToDoState> {
  constructor(protected override store: ToDoStore) {
    super(store);
  }

  entriesByTerm(term?: string): Observable<Array<IToDo>> {
    return (!term || term.length === 0)
      ? this.selectAll()
      : this.selectAll({
        filterBy: (entity: IToDo) => entity.title.toLowerCase().includes(term.toLowerCase())
      })
  }

  entryById(id: string): Observable<IToDo | undefined> {
    return this.selectEntity((e: IToDo): boolean => e.id === id);
  }
}
