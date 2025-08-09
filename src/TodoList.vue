<script setup lang="ts">
import type { Todo } from './types.ts';
import TodoItem from './TodoItem.vue';

const todos = defineModel<Todo[]>({ required: true });

function deleteTodo(id: number) {
  todos.value = todos.value.filter(todo => todo.id !== id);
}

function editTodo(id: number, text: string) {
  todos.value = todos.value.map(todo => {
    if (todo.id === id) {
      return { ...todo, text };
    }
    return todo;
  });
}

function setTodoDone(id: number, isDone: boolean) {
  todos.value = todos.value.map(todo => {
    if (todo.id === id) {
      return { ...todo, isDone };
    }
    return todo;
  });
}
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <TodoItem :todo @delete="deleteTodo" @edit="editTodo" @done="setTodoDone" />
    </li>
  </ul>
</template>

<style scoped>
ul {
  padding: 8px 0;
  margin: 0;
  list-style-type: none;
}
</style>
