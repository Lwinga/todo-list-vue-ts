<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from './types.ts';

const todos = defineModel<Todo[]>();

const todoText = ref('');
const lastId = ref(0);

function addTodo() {
  todos.value?.push({
    id: ++lastId.value,
    text: todoText.value,
    isDone: false,
    createdAt: Date.now(),
  });
  todoText.value = '';
}
</script>

<template>
  <section>
    <input type="text" v-model="todoText" @keydown.enter="addTodo">
    <button type="button" @click="addTodo">Add</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  padding: 8px;
}
input {
  flex-grow: 1;
}
button {
  flex-shrink: 0;
}
</style>
