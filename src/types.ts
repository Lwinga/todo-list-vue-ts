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

export type { Todo, Filter };
