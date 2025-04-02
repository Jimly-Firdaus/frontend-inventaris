<script setup lang="ts">
defineProps({
  copyText: String,
});
const modelValue = defineModel<boolean>({ required: true, default: false });
const emit = defineEmits<{
  (e: "continue"): void;
  (e: "cancel"): void;
}>();

const onConfirm = (confirm = true) => {
  if (confirm) emit("continue");
  else emit("cancel");

  modelValue.value = false;
};
</script>
<template>
  <q-dialog v-model="modelValue">
    <q-card class="tw-w-full tw-p-8 !tw-rounded-3xl">
      <q-card-section class="tw-p-0">
        <p
          class="tw-mb-0 text-center text-grey-10 text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          {{ copyText }}
        </p>
      </q-card-section>
      <q-card-section class="row justify-center tw-gap-x-4">
        <q-btn
          outline
          label="Kembali"
          no-caps
          @click="onConfirm(false)"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10 tw-w-[100px]"
        />
        <q-btn
          no-caps
          label="Ya"
          @click="onConfirm()"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10 tw-w-[100px]"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>
