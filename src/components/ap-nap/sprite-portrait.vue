<template>
  <div class="sprite-portrait" :style="frameStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import spriteUrl from '@/contents/assets/sprite/sprite.png'

// Sprite sheet: 4 columns × 2 rows, each cell 352×384 px (total 1408×768)
// Frame index layout:
//   0: 正常   1: 精神焕发   2: 精神萎靡   3: 苦恼
//   4: 精神萎靡(重)  5: 苦恼(重)  6: 困得不行
const COLS = 4
const ROWS = 2

const props = defineProps<{ index: number }>()

const frameStyle = computed(() => {
  const idx = Math.max(0, Math.min(props.index, COLS * ROWS - 1))
  const col = idx % COLS
  const row = Math.floor(idx / COLS)
  // background-position percentage maps 0→0%, last→100% along each axis
  const xPct = col === 0 ? 0 : (col / (COLS - 1)) * 100
  const yPct = row === 0 ? 0 : (row / (ROWS - 1)) * 100
  return {
    backgroundImage: `url(${spriteUrl})`,
    backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
    backgroundPosition: `${xPct}% ${yPct}%`,
  }
})
</script>

<style scoped>
.sprite-portrait {
  width: 100%;
  aspect-ratio: 352 / 384;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
</style>
