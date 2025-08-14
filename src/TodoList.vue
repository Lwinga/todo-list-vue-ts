<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useTodosStore } from './stores/todos.ts';
import TodoItem from './TodoItem.vue';
import type { SortBy } from './types.ts';

const todosStore = useTodosStore();
const { sort, sortedTodos } = storeToRefs(todosStore);
const { updateSort } = todosStore;

const editingId = ref(0);

function sortClass(by: SortBy) {
  return {
    asc: sort.value.by === by && sort.value.order === 'asc',
    desc: sort.value.by === by && sort.value.order === 'desc',
  };
}
</script>

<template>
  <div class="responsive-table">
    <table>
      <thead>
        <tr>
          <th>Done</th>
          <th :class="sortClass('todo_text')" @click="updateSort('todo_text')">
            Todo <i class="fa fa-arrow-up-long"></i><i class="fa fa-arrow-down-long"></i>
          </th>
          <th :class="sortClass('creation_date')" @click="updateSort('creation_date')">
            Creation Date <i class="fa fa-arrow-up-long"></i><i class="fa fa-arrow-down-long"></i>
          </th>
          <th :class="sortClass('done_date')" @click="updateSort('done_date')">
            Done Date <i class="fa fa-arrow-up-long"></i><i class="fa fa-arrow-down-long"></i>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <TodoItem v-for="todo in sortedTodos" :key="todo.id" :todo v-model="editingId" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.responsive-table {
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  color: black;
  border-radius: 8px;
  overflow: hidden;
}

th {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  background: #00b894;
  color: white;
  cursor: pointer;
  position: relative;
}

th i {
  font-size: 12px;
  opacity: 0.5;
}

th.asc i:first-child,
th.desc i:last-child {
  opacity: 1;
}
</style>
