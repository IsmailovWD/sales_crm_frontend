<template>
  <div>
    <div class="scroll-wrapper" ref="scrollWrapperRef" @scroll="handleScroll">
      <div ref="slotContainerRef" class="scroll-inner">
        <slot></slot>
      </div>
    </div>
    <div
      class="right indicator"
      v-if="showRight && isScroll"
      @mouseenter="startScrolling('right')"
      @mouseleave="stopScrolling"
    ></div>
    <div
      class="left indicator"
      v-if="showLeft && isScroll"
      @mouseenter="startScrolling('left')"
      @mouseleave="stopScrolling"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useEventBus } from "@/eventBus";

const eventBus = useEventBus();

const scrollWrapperRef = ref<HTMLDivElement | null>(null);
const slotContainerRef = ref<HTMLDivElement | null>(null);

const showLeft = ref(false);
const showRight = ref(false);
const isScroll = ref(true);
const scrollInterval = ref<number | null>(null);
const lastScroll = ref<"left" | "right">("right");

eventBus.$on("changeDragScroll", (value: boolean) => {
  isScroll.value = !value;
});

eventBus.$on("changeScrollPosition", (value: number) => {
  if (scrollWrapperRef.value) {
    scrollWrapperRef.value.scrollBy({
      left: value,
      behavior: "auto",
    });
  }
});

const updateScrollIndicators = () => {
  const el = scrollWrapperRef.value;
  if (!el) return;

  showLeft.value = el.scrollLeft > 0;
  showRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth;
  if (!showLeft.value || !showRight.value) {
    stopScrolling();
  }
};

const handleScroll = () => {
  updateScrollIndicators();
};

const startScrolling = (direction: "left" | "right") => {
  if (scrollInterval.value !== null) return;

  scrollInterval.value = setInterval(() => {
    const el = scrollWrapperRef.value;
    if (!el) return;
    el.scrollBy({
      left: direction === "right" ? 5 : -5,
      behavior: "auto",
    });
    lastScroll.value = direction;
  }, 10);
};

const stopScrolling = () => {
  if (scrollInterval.value !== null) {
    clearInterval(scrollInterval.value);
    scrollInterval.value = null;
  }
};
let resizeObserver;
onMounted(() => {
  nextTick(() => {
    resizeObserver = new ResizeObserver((entries) => {
      updateScrollIndicators();
    });

    if (slotContainerRef.value) {
      resizeObserver.observe(slotContainerRef.value);
    }
  });
});
</script>

<style scoped>
.scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  position: relative;
  white-space: nowrap;
}

.scroll-inner {
  display: inline-block;
  min-width: 100%;
}

.indicator {
  position: absolute;
  top: 0;
  width: 80px;
  height: 100%;
  z-index: 10;
  /* background-color: #000; */
}

.right {
  right: 0;
}

.left {
  left: 0;
}
</style>
