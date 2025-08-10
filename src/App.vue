<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { Filter, Todo } from './types.ts';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';
import { useLocalStorage } from './composables.ts';

const todos = useLocalStorage<Todo[]>('todos', []);
const filter = useLocalStorage<Filter>('todos-filter', 'today');

const todoList = useTemplateRef<InstanceType<typeof TodoList>>('todo-list');

const doneTodos = computed(() => {
  return todoList.value?.filteredTodos.filter(todo => todo.isDone).length ?? 0;
});

const filters = new Map<Filter, String>([
  ['today', 'Today'],
  ['yesterday', 'Yesterday'],
  ['this_week', 'This Week'],
  ['this_month', 'This Month'],
  ['all', 'All'],
]);
</script>

<template>
  <header>
    <h1>TODO LIST</h1>
    <select v-model="filter">
      <option v-for="[key, value] in filters" :value="key">{{ value }}</option>
    </select>
    <button type="button" @click="todos = []">Clear</button>
  </header>
  <main>
    <div>
      <AddTodo v-model="todos" />
      <TodoList v-model="todos" :filter ref="todo-list" />
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
