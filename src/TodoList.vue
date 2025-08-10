<script setup lang="ts">
import type { Filter, Todo } from './types.ts';
import TodoItem from './TodoItem.vue';
import { computed } from 'vue';
import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns';

const props = defineProps<{
  filter: Filter;
}>();

const todos = defineModel<Todo[]>({ required: true });

const filteredTodos = computed(() => todos.value.filter(todo => {
  const date = new Date(todo.createdAt);
  switch(props.filter) {
    case 'today':
      return isToday(date);
    case 'yesterday':
      return isYesterday(date);
    case 'this_week':
      return isThisWeek(date);
    case 'this_month':
      return isThisMonth(date);
    case 'all':
      return true
    default:
      const _exhaustiveCheck: never = props.filter;
      _exhaustiveCheck;
  }
}));

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

defineExpose({ filteredTodos });
</script>

<template>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
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
