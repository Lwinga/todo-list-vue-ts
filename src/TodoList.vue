<script setup lang="ts">
import type { Filter, Sort, Todo } from './types.ts';
import TodoItem from './TodoItem.vue';
import { computed, ref } from 'vue';
import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns';

const props = defineProps<{
  filter: Filter;
  sort: Sort;
}>();

const todos = defineModel<Todo[]>({ required: true });

const editingId = ref(0);

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

const sortedTodos = computed(() => [...filteredTodos.value].sort((a, b) => {
  switch(props.sort) {
    case 'date_asc':
      return a.createdAt - b.createdAt;
    case 'date_desc':
      return b.createdAt - a.createdAt;
    case 'name_asc':
      return a.text > b.text ? 1 : a.text === b.text ? 0 : -1;
    case 'name_desc':
      return a.text > b.text ? -1 : a.text === b.text ? 0 : 1;
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
    <li v-for="todo in sortedTodos" :key="todo.id">
      <TodoItem :todo @delete="deleteTodo" @edit="editTodo" @done="setTodoDone" v-model="editingId" />
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
