<template>
  <div>
    <div style="padding: 0 20px 10px 20px" class="date-timeline-items">
      <n-tag class="card-item" round type="default">
        {{
          props.item.type === "date"
            ? new Date(props.item.date)
                .toLocaleDateString("ru", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")
            : "PIN"
        }}
      </n-tag>
    </div>
    <transition-group name="activity-list" tag="div">
      <div v-for="(item, index) in props.item.data" :key="item.id">
        <activity
          :item="item"
          :is-last="index === props.item.data.length - 1 && props.isLast"
        ></activity>
      </div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import type { GetAllActivityDataAttr } from "@/api/main/actions/dealActivityApi";
import { NDivider, NTag } from "naive-ui";
import activity from "./activity.vue";

type Props = {
  item: GetAllActivityDataAttr;
  isLast: boolean;
};

const props = defineProps<Props>();
</script>
<style scoped lang="scss">
.date-timeline-items {
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  // &::after {
  //   content: "";
  //   position: absolute;
  //   bottom: 0;
  //   left: 20px;
  //   width: 1px;
  //   height: calc(50% + 5px);
  //   background-color: var(--timeline-line-color);
  //   z-index: -1;
  // }
}
.activity-list-enter-active,
.activity-list-leave-active {
  transition: all 0.35s ease;
  transform-origin: top left;
}
.activity-list-enter-from,
.activity-list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
