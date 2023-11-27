import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {IToDo} from '../models';

export interface ToDoState extends EntityState<IToDo, string> {
  isLoading: boolean;
}

export const createInitialState = (): ToDoState => {
  return {
    isLoading: true,
  }
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'todo'})
export class ToDoStore extends EntityStore<ToDoState> {
  constructor() {
    super(createInitialState());
  }
}
