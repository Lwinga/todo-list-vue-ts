interface Todo {
  id: number;
  text: string;
  isDone: boolean;
  createdAt: number;
  doneAt?: number;
}

interface Sort {
  by: SortBy;
  order: SortOrder;
}

type Filter =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'all';

type SortBy =
  | 'creation_date'
  | 'done_date'
  | 'todo_text'

type SortOrder =
  | 'asc'
  | 'desc'

export type { Todo, Sort, Filter, SortBy, SortOrder };
