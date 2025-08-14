<script setup lang="ts">
import { ref } from 'vue';
import { useTodosStore } from './stores/todos.ts';
import type { Todo } from './types.ts';

const emit = defineEmits<{
  (e: 'add', todo: Todo): void;
}>();

const todosStore = useTodosStore();

const todoText = ref('');

function addTodo() {
  const todo = todosStore.addTodo(todoText.value);
  if (todo !== null) {
    todoText.value = '';
    emit('add', todo);
  }
}
</script>

<template>
  <div class="add-todo">
    <input
      type="text"
      placeholder="Add a new todo..."
      v-model="todoText"
      @keydown.enter="addTodo"
    />
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
