<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

const show = ref(false);

function buttonClick(isConfirmed: boolean) {
  if (isConfirmed) {
    emit('confirm');
  }
  show.value = false;
}
</script>

<template>
  <button @click="show = true">
    <slot></slot>
    <teleport to="body">
      <div class="modal" v-show="show">
        <div class="modal-content">
          <p>
            <slot name="description"></slot>
          </p>
          <button class="yes-btn" @click="buttonClick(true)">Yes</button>
          <button class="no-btn" @click="buttonClick(false)">No</button>
        </div>
      </div>
    </teleport>
  </button>
</template>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  text-align: center;
}

.modal-content button {
  margin: 10px 5px 0;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.yes-btn {
  background: #d63031;
  color: white;
}

.no-btn {
  background: #b2bec3;
  color: white;
}
</style>
