<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import type { Sort, Filter, Todo } from './types.ts';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';
import { useLocalStorage } from './composables.ts';

const todos = useLocalStorage<Todo[]>('todos', []);
const filter = useLocalStorage<Filter>('todos-filter', 'today');
const sort = useLocalStorage<Sort>('todos-sort', 'date_desc');

const todoList = useTemplateRef<InstanceType<typeof TodoList>>('todo-list');

const doneTodos = computed(() => {
  return todoList.value?.filteredTodos.filter(todo => todo.isDone).length ?? 0;
});

const filters = new Map<Filter, string>([
  ['today', 'Today'],
  ['yesterday', 'Yesterday'],
  ['this_week', 'This Week'],
  ['this_month', 'This Month'],
  ['all', 'All'],
]);

const sorts = new Map<Sort, string>([
  ['date_asc', 'Date Asc'],
  ['date_desc', 'Date Desc'],
  ['name_asc', 'Name Asc'],
  ['name_desc', 'Name Desc'],
]);

function clearTodos() {
  const filteredIds = getFilteredIds();
  todos.value = todos.value.filter(todo => !filteredIds.has(todo.id));
}

function getFilteredIds(): Set<number> {
  return new Set(todoList.value?.filteredTodos.map(todo => {
    return todo.id
  }) ?? [] as number[]);
}

async function processAddTodo(todo: Todo) {
  await nextTick(); // Wait until filteredTodos has been updated
  const filteredIds = getFilteredIds();
  if (!filteredIds.has(todo.id)) {
    // Avoid frustration to users when they can't see the added todo
    filter.value = 'today';
  }
}
</script>

<template>
  <header>
    <h1>TODO LIST</h1>
    <div>
      <select v-model="filter" style="margin-right: 4px;">
        <option v-for="[key, value] in filters" :value="key">{{ value }}</option>
      </select>
      <select v-model="sort">
        <option v-for="[key, value] in sorts" :value="key">{{ value }}</option>
      </select>
    </div>
    <button type="button" @click="clearTodos">Clear</button>
  </header>
  <main>
    <div>
      <AddTodo v-model="todos" @add="processAddTodo" />
      <TodoList v-model="todos" :filter :sort ref="todo-list" />
    </div>
  </main>
  <footer>
    <span>Total: {{ todoList?.filteredTodos.length ?? 0 }}</span>
    <span>Done: {{ doneTodos }}</span>
  </footer>
</template>

<style scoped>
main > div {
  max-width: 640px;
  margin-right: auto;
  margin-left: auto;
}
</style>
