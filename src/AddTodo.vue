<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Todo } from './types.ts';

const emit = defineEmits<{
  (e: 'add', todo: Todo): void;
}>();

const todos = defineModel<Todo[]>({ required: true });

const todoText = ref('');

const lastId = computed(() => {
  const maxId = Math.max(...todos.value.map(todo => todo.id));
  return isFinite(maxId) ? maxId : 0;
});

function addTodo() {
  if (todoText.value === '') return;
  const todo = {
    id: lastId.value + 1,
    text: todoText.value,
    isDone: false,
    createdAt: Date.now(),
  };
  todos.value = [...todos.value, todo];
  todoText.value = '';
  emit('add', todo);
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
