<script setup lang="ts">
import { format } from 'date-fns';
import type { Todo } from './types.ts';
import { ref, watch } from 'vue';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'edit', id: number, text: string): void;
  (e: 'done', id: number, done: boolean): void;
}>();

const isEditing = ref(false);
const todoText = ref('');
const isDone = ref(props.todo.isDone);

watch(isDone, function(value) {
  setDone(value);
});

function cancelEditTodo() {
  isEditing.value = false;
  todoText.value = '';
}

function deleteTodo() {
  emit('delete', props.todo.id);
}

function editTodo() {
  todoText.value = props.todo.text;
  isEditing.value = true;
}

function saveTodo() {
  emit('edit', props.todo.id, todoText.value);
  cancelEditTodo();
}

function setDone(isDone: boolean) {
  emit('done', props.todo.id, isDone);
  if (isEditing.value) {
    cancelEditTodo();
  }
}
</script>

<template>
  <section>
    <div class="content">
      <input type="checkbox" v-model="isDone">
      <input type="text" v-model="todoText" v-if="isEditing" @keydown.enter="saveTodo" :disabled="isDone">
      <button type="button" v-if="isEditing" @click="saveTodo" :disabled="isDone">Save</button>
      <span v-else :class="{ strike: isDone }">{{ todo.text }}</span>
      <small :class="{ strike: isDone }">({{ format(new Date(todo.createdAt), 'yyy/MM/dd hh:mm:ss') }})</small>
    </div>
    <div class="actions">
      <button type="button" v-if="isEditing" @click="cancelEditTodo">Cancel</button>
      <button type="button" v-else @click="editTodo" :disabled="isDone">Edit</button>
      <button type="button" @click="deleteTodo">Delete</button>
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
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.actions {
  display: flex;
  gap: 4px;
}
.strike {
  text-decoration: line-through;
}
</style>
