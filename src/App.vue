<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo } from './types.ts';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';

const todos = ref<Todo[]>([]);

const doneTodos = computed(() => {
  return todos.value.filter(todo => todo.isDone).length;
});
</script>

<template>
  <header>
    <h1>TODO LIST</h1>
    <button type="button" @click="todos = []">Clear</button>
  </header>
  <main>
    <div>
      <AddTodo v-model="todos" />
      <TodoList v-model="todos" />
    </div>
  </main>
  <footer>
    <span>Total: {{ todos.length }}</span>
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
