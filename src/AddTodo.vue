<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo } from './types.ts';

const todos = defineModel<Todo[]>({ required: true });

const todoText = ref('');

const lastId = computed(() => {
  // Assumes last todo has the largest id
  return todos.value.length > 0 ? todos.value[todos.value.length - 1].id : 0;
});

function addTodo() {
  if (todoText.value === '') return;
  todos.value = [
    ...todos.value,
    {
      id: lastId.value + 1,
      text: todoText.value,
      isDone: false,
      createdAt: Date.now(),
    },
  ];
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
  gap: 4px;
  padding: 8px;
}
input {
  flex-grow: 1;
}
button {
  flex-shrink: 0;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
