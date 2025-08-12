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
  <div class="add-todo">
    <input type="text" placeholder="Add a new todo..." v-model="todoText" @keydown.enter="addTodo">
    <button @click="addTodo"><i class="fa fa-add"></i> Add</button>
  </div>
</template>

<style scoped>
.add-todo {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

button {
  background: #00b894;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #009874;
}
</style>
