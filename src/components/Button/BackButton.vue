<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps({
  isRemoveRouteQuery: Boolean,
});

const router = useRouter();

const onClickBackBtn = async () => {
  if (props.isRemoveRouteQuery) await router.replace({ query: {} });
  else router.go(-1);
};
</script>
<template>
  <q-btn
    no-caps
    :label="$q.screen.lt.sm ? '' : 'Kembali'"
    icon="arrow_back"
    outline
    @click="onClickBackBtn"
  />
</template>
