import { useLocalStorage } from '@/composables/local-storage';
import type { Filter, Sort, SortBy, Todo } from '@/types';
import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useTodosStore = defineStore('todos', () => {
  const todos = useLocalStorage<Todo[]>('todos', []);
  const filter = useLocalStorage<Filter>('todos-filter', 'today');
  const sort = useLocalStorage<Sort>('todos-sort', {
    by: 'creation_date',
    order: 'asc',
  });

  const filteredTodos = computed(() =>
    todos.value.filter((todo) => {
      const date = new Date(todo.createdAt);
      switch (filter.value) {
        case 'today':
          return isToday(date);
        case 'yesterday':
          return isYesterday(date);
        case 'this_week':
          return isThisWeek(date);
        case 'this_month':
          return isThisMonth(date);
        case 'all':
          return true;
        default:
          const _exhaustiveCheck: never = filter.value;
          _exhaustiveCheck;
      }
    }),
  );

  const sortedTodos = computed(() =>
    [...filteredTodos.value].sort((a, b) => {
      switch (sort.value.by) {
        case 'creation_date':
          return sort.value.order === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
        case 'done_date':
          return sort.value.order === 'asc'
            ? (a.doneAt ?? 0) - (b.doneAt ?? 0)
            : (b.doneAt ?? 0) - (a.doneAt ?? 0);
        case 'todo_text':
          return sort.value.order === 'asc'
            ? a.text.localeCompare(b.text)
            : b.text.localeCompare(a.text);
      }
    }),
  );

  const lastId = computed(() => {
    const maxId = Math.max(...todos.value.map((todo) => todo.id));
    return isFinite(maxId) ? maxId : 0;
  });

  function addTodo(text: string): Todo | null {
    if (text === '') return null;
    const todo = {
      id: lastId.value + 1,
      text: text,
      isDone: false,
      createdAt: Date.now(),
    };
    todos.value = [...todos.value, todo];
    return todo;
  }

  function clearTodos() {
    const filteredIds = new Set(filteredTodos.value.map((todo) => todo.id));
    todos.value = todos.value.filter((todo) => !filteredIds.has(todo.id));
  }

  function deleteTodo(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  }

  function editTodo(id: number, value: Partial<Todo>) {
    todos.value = todos.value.map((todo) => {
      if (todo.id === id) {
        return { ...todo, ...value };
      }
      return todo;
    });
  }

  function updateSort(by: SortBy) {
    if (sort.value.by !== by) {
      sort.value = { by, order: 'asc' };
    } else {
      sort.value = { by, order: sort.value.order === 'asc' ? 'desc' : 'asc' };
    }
  }

  return {
    todos,
    filter,
    sort,
    filteredTodos,
    sortedTodos,
    lastId,
    addTodo,
    clearTodos,
    deleteTodo,
    editTodo,
    updateSort,
  };
});
