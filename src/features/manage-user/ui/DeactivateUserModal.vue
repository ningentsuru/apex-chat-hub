<script setup lang="ts">
import { ref, computed } from 'vue'
import { AButton, AModal, ACombobox } from '@shared/ui'
import { useUserStore } from '@entities/user/model/userStore'
import { AlertTriangle } from '@lucide/vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const userStore = useUserStore()

type User = (typeof userStore.users)[number]

const selectedUser = ref<User | null>(null)
const isSubmitting = ref(false)

const showConfirmation = ref(false)

const userList = computed(() => userStore.users)

function triggerConfirmation() {
  if (!selectedUser.value) return
  showConfirmation.value = true
}

async function handleSubmit() {
  if (!selectedUser.value) return
  isSubmitting.value = true

  try {
    await userStore.deactivateUser(selectedUser.value.id)
    handleResetForm()
  } catch (error) {
    console.error('Modal submission blocked:', error)
  } finally {
    isSubmitting.value = false
    userStore.fetchTalkJsUsers()
  }
}

function handleResetForm() {
  selectedUser.value = null
  showConfirmation.value = false
  emit('close')
}
</script>

<template>
  <AModal :is-open="isOpen" @close="handleResetForm">
    <template #header>
      <h3>{{ showConfirmation ? 'Confirm Deactivation' : 'Deactivate User' }}</h3>
    </template>

    <form
      v-if="!showConfirmation"
      id="deactivate-user-form"
      @submit.prevent="triggerConfirmation"
      class="modal-form-layout"
    >
      <ACombobox
        v-model="selectedUser"
        :options="userList"
        label="Search Channels Directory"
        placeholder="Type name to lookup profiles..."
      />
    </form>

    <div v-else class="confirmation-panel-wrapper">
      <div class="alert-icon-frame">
        <AlertTriangle height="32" width="32" />
      </div>
      <h4>Are you absolutely sure?</h4>
      <p class="warning-description">
        You are about to deactivate <strong> {{ selectedUser?.name }} </strong>. This action will
        safely anonymize their profile identity and clear active email mappings, while preserving
        existing chat history logs for administrative reference records.
      </p>
    </div>

    <template #footer>
      <template v-if="!showConfirmation">
        <AButton variant="outline" @click="handleResetForm">Cancel</AButton>
        <AButton
          type="submit"
          form="deactivate-user-form"
          variant="destructive"
          :disabled="!selectedUser"
        >
          Next
        </AButton>
      </template>

      <template v-else>
        <AButton variant="outline" @click="showConfirmation = false" :disabled="isSubmitting">
          Back
        </AButton>
        <AButton variant="destructive" :loading="isSubmitting" @click="handleSubmit">
          Yes, Deactivate User
        </AButton>
      </template>
    </template>
  </AModal>
</template>

<style lang="less" scoped>
.modal-form-layout {
  display: flex;
  flex-direction: column;
  gap: @spacing-m;
  height: max-content;
  overflow: unset;
}

.confirmation-panel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: @spacing-m 0;
  color: @color-text;

  .alert-icon-frame {
    color: @color-error;
    background-color: fade(#ed3c50, 10%);
    width: 64px;
    height: 64px;
    border-radius: @border-radius-round;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: @spacing-m;
  }

  h4 {
    color: @color-heading;
    font-size: @text-lg;
    font-weight: @weight-bold;
    margin-bottom: @spacing-xs;
  }

  .warning-description {
    font-size: @text-md;
    line-height: @lh-normal;
    max-width: 380px;
    opacity: 0.9;

    strong {
      color: @color-heading;
      font-weight: @weight-bold;
    }
  }
}
</style>
