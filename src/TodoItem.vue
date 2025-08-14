<script setup lang="ts">
import { format } from 'date-fns';
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import { useTodosStore } from './stores/todos.ts';
import type { Todo } from './types.ts';

const props = defineProps<{
  todo: Todo;
}>();

const todosStore = useTodosStore();
const { deleteTodo } = todosStore;

const editingId = defineModel<number>({ required: true });

const todoText = ref(props.todo.text);
const isDone = ref(props.todo.isDone);

const editInput = useTemplateRef('editInput');

watch(isDone, function (value) {
  setDone(value);
});

function cancelEditTodo() {
  editingId.value = 0;
  todoText.value = '';
}

function editTodo() {
  if (props.todo.isDone) return;
  todoText.value = props.todo.text;
  editingId.value = props.todo.id;
  nextTick(() => editInput.value?.focus());
}

function saveTodo() {
  todosStore.editTodo(props.todo.id, { text: todoText.value });
  cancelEditTodo();
}

function setDone(isDone: boolean) {
  todosStore.editTodo(props.todo.id, { isDone, doneAt: isDone ? Date.now() : undefined });
  if (editingId.value === props.todo.id) {
    cancelEditTodo();
  }
}
</script>

<template>
  <tr :class="{ done: isDone }">
    <td><input type="checkbox" v-model="isDone" /></td>
    <td>
      <input
        type="text"
        class="editing"
        ref="editInput"
        v-if="editingId === todo.id"
        v-model="todoText"
        @keydown.enter="saveTodo"
        @keydown.escape="cancelEditTodo"
        :disabled="isDone"
      />
      <span v-else @dblclick="editTodo">{{ todo.text }}</span>
    </td>
    <td>{{ format(new Date(todo.createdAt), 'yyy/MM/dd hh:mm:ss') }}</td>
    <td>
      {{ todo.doneAt !== undefined ? format(new Date(todo.doneAt), 'yyy/MM/dd hh:mm:ss') : '-' }}
    </td>
    <td class="actions">
      <template v-if="editingId === todo.id">
        <button class="save-btn" title="Save" @click="saveTodo" :disabled="isDone">
          <i class="fa fa-save"></i>
        </button>
        <button
          class="cancel-btn"
          title="Cancel"
          v-if="editingId === todo.id"
          @click="cancelEditTodo"
        >
          <i class="fa fa-times"></i>
        </button>
      </template>
      <template v-else>
        <button class="edit-btn" title="Edit" @click="editTodo" :disabled="isDone">
          <i class="fa fa-edit"></i>
        </button>
        <button class="delete-btn" title="Delete" @click="deleteTodo(todo.id)">
          <i class="fa fa-trash"></i>
        </button>
      </template>
    </td>
  </tr>
</template>

<style scoped>
tr.done td {
  text-decoration: line-through;
  color: gray;
}

tr.done td:hover {
  text-decoration: none;
}

td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

td:not(:first-child, :last-child) {
  min-width: 100px;
}

td:first-child {
  width: 60px;
  text-align: center;
}

td:last-child {
  width: 110px;
  text-align: right;
  white-space: nowrap;
}

input.editing {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px;
  outline: none;
}

input.editing:focus {
  border: 1px solid #0984e3;
}

.actions button {
  border: none;
  padding: 6px 10px;
  margin: 0 4px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.actions button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.actions button i {
  margin-right: 0;
}

.edit-btn {
  background: #0984e3;
  color: white;
}

.delete-btn {
  background: #d63031;
  color: white;
}

.save-btn {
  background: #00b894;
  color: white;
}

.cancel-btn {
  background: #b2bec3;
  color: white;
}
</style>
