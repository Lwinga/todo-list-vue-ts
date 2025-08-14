<script setup lang="ts">
import { computed, nextTick } from 'vue';
import type { Filter, Todo } from './types.ts';
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList.vue';
import ConfirmModal from './ConfirmModal.vue';
import { snakeToTitle } from './utils.ts';
import { useTodosStore } from './stores/todos.ts';
import { storeToRefs } from 'pinia';

const todosStore = useTodosStore();
const { filter, filteredTodos } = storeToRefs(todosStore);
const { clearTodos } = todosStore;

const doneTodos = computed(() => {
  return filteredTodos.value.filter(todo => todo.isDone).length;
});

const filters = new Set<Filter>([
  'today',
  'yesterday',
  'this_week',
  'this_month',
  'all'
]);

async function processAddTodo(todo: Todo) {
  await nextTick(); // Wait until filteredTodos has been updated
  const filteredIds = new Set(filteredTodos.value.map(todo => todo.id));
  if (!filteredIds.has(todo.id)) {
    // Avoid frustration to users when they can't see the added todo
    filter.value = 'today';
  }
}
</script>

<template>
  <div class="container">
    <h1>TODO LIST</h1>
    <AddTodo @add="processAddTodo" />
    <div class="controls">
      <label class="filter-select">
        <span>Filter</span>
        <select v-model="filter">
          <option v-for="value in filters" :value="value">{{ snakeToTitle(value) }}</option>
        </select>
        <i class="fa fa-angle-down"></i>
      </label>
      <ConfirmModal class="clear-btn" @confirm="clearTodos">
        <i class="fa fa-trash"></i> Clear
        <template #description>
          Are you sure you want to clear all todos of {{ snakeToTitle(filter).toLowerCase() }}?
        </template>
      </ConfirmModal>
    </div>
    <TodoList />
    <div class="stats">
      <span>Total: {{ filteredTodos.length }}</span> | <span>Done: {{ doneTodos }}</span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
}

.container {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.controls {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-select, .clear-btn {
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.filter-select {
  position: relative;
  display: flex;
  align-items: baseline;
  background-color: #f3f3f3;
}

.filter-select span {
  padding: 0 8px;
  border-right: 1px solid #ccc;
}

.filter-select select {
  position: relative;
  height: 100%;
  padding: 8px 24px 8px 8px;
  border-radius: 8px;
  border: none;
  appearance: none;
  background-color: transparent;
  z-index: 1;
}

.filter-select i {
  position: absolute;
  right: 8px;
  top: 12px;
  font-size: 12px;
  z-index: 0; /* Allow select to open when clicked */
}

.clear-btn {
  padding: 10px 15px;
  background: #d63031;
  color: white;
}

.clear-btn:hover {
  background: #c0392b;
}

.stats {
  margin-top: 10px;
  font-size: 14px;
}

@media (min-width: 524px) {
  .container {
    padding: 20px;
  }
}
</style>
