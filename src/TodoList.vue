<script setup lang="ts">
import type { Filter, Sort, SortBy, Todo } from './types.ts';
import TodoItem from './TodoItem.vue';
import { computed, ref } from 'vue';
import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns';

const props = defineProps<{
  filter: Filter;
}>();

const todos = defineModel<Todo[]>({ required: true });
const sort = defineModel<Sort>('sort', { required: true });

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
      return true;
    default:
      const _exhaustiveCheck: never = props.filter;
      _exhaustiveCheck;
  }
}));

const sortedTodos = computed(() => [...filteredTodos.value].sort((a, b) => {
  switch(sort.value.by) {
    case 'creation_date':
      return sort.value.order === 'asc' ? a.createdAt - b.createdAt
        : b.createdAt - a.createdAt;
    case 'done_date':
      return sort.value.order === 'asc' ? (a.doneAt ?? 0) - (b.doneAt ?? 0)
        : (b.doneAt ?? 0) - (a.doneAt ?? 0);
    case 'todo_text':
      return sort.value.order === 'asc' ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text);
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
      return { ...todo, isDone, doneAt: isDone ? Date.now() : undefined };
    }
    return todo;
  });
}

function sortClass(by: SortBy) {
  return {
    'asc': sort.value.by === by && sort.value.order === 'asc',
    'desc': sort.value.by === by && sort.value.order === 'desc',
  }
};

function updateSort(by: SortBy) {
  if (sort.value.by !== by) {
    sort.value = { by, order: 'asc' };
  } else {
    sort.value = { by, order: sort.value.order === 'asc' ? 'desc' : 'asc' };
  }
}

defineExpose({ filteredTodos });
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
        <TodoItem v-for="todo in sortedTodos" :key="todo.id" :todo @delete="deleteTodo"
          @edit="editTodo" @done="setTodoDone" v-model="editingId" />
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

th.asc i:first-child, th.desc i:last-child {
  opacity: 1;
}
</style>
