<script setup lang="ts">
import { format } from 'date-fns';
import type { Todo } from './types.ts';
import { nextTick, ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'edit', id: number, text: string): void;
  (e: 'done', id: number, done: boolean): void;
}>();

const editingId = defineModel<number>({ required: true });

const todoText = ref(props.todo.text);
const isDone = ref(props.todo.isDone);

const editInput = useTemplateRef('editInput');

watch(isDone, function(value) {
  setDone(value);
});

function cancelEditTodo() {
  editingId.value = 0;
  todoText.value = '';
}

function deleteTodo() {
  emit('delete', props.todo.id);
}

function editTodo() {
  if (props.todo.isDone) return;
  todoText.value = props.todo.text;
  editingId.value = props.todo.id;
  nextTick(() => editInput.value?.focus());
}

function saveTodo() {
  emit('edit', props.todo.id, todoText.value);
  cancelEditTodo();
}

function setDone(isDone: boolean) {
  emit('done', props.todo.id, isDone);
  if (editingId.value === props.todo.id) {
    cancelEditTodo();
  }
}
</script>

<template>
  <section>
    <div class="content">
      <input type="checkbox" v-model="isDone">
      <template v-if="editingId === todo.id">
        <input type="text" ref="editInput" v-model="todoText" @keydown.enter="saveTodo" :disabled="isDone">
        <button type="button" @click="saveTodo" :disabled="isDone">Save</button>
      </template>
      <template v-else>
        <span class="todo-text" :class="{ strike: isDone }" @dblclick="editTodo">{{ todo.text }}</span>
        <small :class="{ strike: isDone }">({{ format(new Date(todo.createdAt), 'yyy/MM/dd hh:mm:ss') }})</small>
      </template>
    </div>
    <div class="actions">
      <button type="button" v-if="editingId === todo.id" @click="cancelEditTodo">Cancel</button>
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
.todo-text {
  cursor: default;
}
</style>
