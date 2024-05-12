<template>
  <v-dialog v-model="showDialog" width="300" height="500">
    <v-card max-width="300" :text="constVal.DIALOG_TEXT" :title="constVal.DIALOG_TITLE">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn text="はい" @click="hanldleSubmit"></v-btn>
        <v-btn text="いいえ" @click="closeDialog"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { constVal } from '@/const/index.js'

const props = defineProps({
  dialog: {
    type: Boolean
  }
})

console.log('props.dialog :', props.dialog)
const showDialog = ref(props.dialog)
const emitSubmit = ref(false)

// props.dialog の変化を showDialog に反映させる
watch(
  () => props.dialog,
  (newVal) => {
    showDialog.value = newVal
  }
)

const emit = defineEmits(['setHandleSubmit'])

const hanldleSubmit = () => {
  emitSubmit.value = true
  emit('setHandleSubmit', emitSubmit.value)
  showDialog.value = false // ダイアログを閉じる
}
const closeDialog = () => {
  showDialog.value = false
  emit('closeDialog')
}
</script>
