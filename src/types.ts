interface Todo {
  id: number;
  text: string;
  isDone: boolean;
  createdAt: number;
}

type Filter =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'all';

type Sort =
  | 'date_asc'
  | 'date_desc'
  | 'name_asc'
  | 'name_desc'

export type { Todo, Filter, Sort };
