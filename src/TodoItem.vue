<script setup lang="ts">
import { format } from 'date-fns';
import type { Todo } from './types.ts';
import { ref } from 'vue';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'edit', id: number, text: string): void;
}>();

const isEditing = ref(false);
const todoText = ref(props.todo.text);

function deleteTodo(id: number) {
  emit('delete', id);
}

function editTodo() {
  todoText.value = props.todo.text;
  isEditing.value = true;
}

function saveTodo(id: number) {
  emit('edit', id, todoText.value);
  isEditing.value = false;
}
</script>

<template>
  <section>
    <div>
      <input type="text" v-model="todoText" v-if="isEditing" @keydown.enter="saveTodo(todo.id)">
      <button type="button" v-if="isEditing" @click="saveTodo(todo.id)">Save</button>
      <span v-else>{{ todo.text }}</span>
      <small>({{ format(new Date(todo.createdAt), 'yyy/MM/dd hh:mm:ss') }})</small>
    </div>
    <div>
      <button type="button" v-if="!isEditing" @click="editTodo">Edit</button>
      <button type="button" @click="deleteTodo(todo.id)">Delete</button>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
}
section:hover {
  background-color: lightgray;
}
small {
  color: gray;
  margin-left: 8px;
}
</style>
