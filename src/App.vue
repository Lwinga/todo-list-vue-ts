<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from './types.ts';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';

const todos = ref<Todo[]>([]);
</script>

<template>
  <main>
    <AddTodo v-model="todos" />
    <TodoList v-model="todos" />
  </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin-right: auto;
  margin-left: auto;
}
</style>
