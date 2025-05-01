<script setup lang="ts">
import { DateTime } from "luxon";

const props = defineProps<{
  selectedTimeframe: string;
  useDefault?: boolean;
  monthlyDefault?: boolean;
}>();

const now = DateTime.now().toFormat("yyyy/MM/dd");
const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toFormat("yyyy/MM/dd");
const startOfMonth = DateTime.now().startOf("month").toFormat("yyyy/MM/dd");

const _selectedTimeframe = defineModel<string>("selectedTimeframe");
const timeframe = ref<{ from: string; to: string } | null>(null);

watch(timeframe, (val) => {
  if (!val) return;

  if (typeof val === "string") {
    // Same date selected (val is "2025/03/06")
    const formatted = DateTime.fromFormat(val, "yyyy/MM/dd").toFormat(
      "dd MMM, yyyy",
    );
    _selectedTimeframe.value = `${formatted} - ${formatted}`;
  } else {
    // Normal range object: { from, to }
    const fromFormatted = DateTime.fromFormat(val.from, "yyyy/MM/dd").toFormat(
      "dd MMM, yyyy",
    );
    const toFormatted = DateTime.fromFormat(val.to, "yyyy/MM/dd").toFormat(
      "dd MMM, yyyy",
    );
    _selectedTimeframe.value = `${fromFormatted} - ${toFormatted}`;
  }
});

onMounted(() => {
  if (props.useDefault) {
    timeframe.value = {
      from: props.monthlyDefault ? startOfMonth : sevenDaysAgo,
      to: now,
    };
  }
});
</script>
<template>
  <q-btn-dropdown
    flat
    dropdown-icon="keyboard_arrow_down"
    class="timeframe-selector text-grey-9 text-body-small"
    :class="$q.screen.lt.sm ? 'text-mobile' : ''"
    no-caps
  >
    <template #label>
      <div class="tw-flex tw-flex-col tw-items-start tw-w-full">
        <span
          class="text-grey-7 text-body-small tw-font-normal"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Rentang Waktu</span
        >
        {{ _selectedTimeframe }}
      </div>
    </template>
    <div class="tw-flex tw-py-3">
      <div class="tw-px-3 tw-max-w-[410px]">
        <p style="margin-bottom: 0" class="text-body-2 text-grey-9">
          Custom time
        </p>
        <div class="tw-flex tw-gap-x-4 tw-py-2 text-body-2">
          <span class="tw-px-11 tw-py-2 bg-grey-2 text-grey-9 tw-rounded-lg">{{
            typeof timeframe === "object" && timeframe?.from
              ? DateTime.fromFormat(timeframe.from, "yyyy/MM/dd").toFormat(
                  "dd MMM, yyyy",
                )
              : typeof timeframe === "string"
                ? DateTime.fromFormat(timeframe, "yyyy/MM/dd").toFormat(
                    "dd MMM, yyyy",
                  )
                : "Start date"
          }}</span>
          <span class="tw-px-11 tw-py-2 bg-grey-2 text-grey-9 tw-rounded-lg">{{
            typeof timeframe === "object" && timeframe?.to
              ? DateTime.fromFormat(timeframe.to, "yyyy/MM/dd").toFormat(
                  "dd MMM, yyyy",
                )
              : typeof timeframe === "string"
                ? DateTime.fromFormat(timeframe, "yyyy/MM/dd").toFormat(
                    "dd MMM, yyyy",
                  )
                : "End date"
          }}</span>
        </div>
        <div class="tw-max-w-[390px]">
          <q-date
            flat
            minimal
            range
            v-model="timeframe"
            class="tw-w-full tw-p-0 tw-m-0"
          />
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>
<style scoped lang="scss">
.timeframe-selector {
  border: 1px solid $grey-5;
  padding: 6px 10px;
  border-radius: 6px;
  :deep(.block) {
    color: $grey-10;
  }
}
:deep(.q-date__view) {
  padding: 0 !important;
  min-height: 0 !important;
}
:deep(.q-date__navigation) {
  .q-btn__content {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 125% */
    letter-spacing: 0.24px;
    color: $grey-9;
    @media (max-width: 600px) {
      font-size: 14px;
      line-height: 16px;
    }
  }
}

:deep(.q-date__calendar-weekdays) {
  .q-date__calendar-item {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.24px;
    color: $grey-8;
    opacity: 1 !important;
    @media (max-width: 600px) {
      font-size: 14px;
      line-height: 16px;
    }
  }
}

:deep(.q-date__calendar-days) {
  .q-date__calendar-item {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.24px;
    color: $grey-6;
    @media (max-width: 600px) {
      font-size: 14px;
      line-height: 16px;
    }
  }
}
</style>
