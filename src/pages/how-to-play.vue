<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import GameButton from '@/components/game-button.vue'
import howToPlayZh from '@/contents/game-info/how-to-play.md?raw'
import howToPlayEn from '@/contents/game-info/how-to-play.en.md?raw'
import { useLocale } from '@/composables'

const route = useRoute()
const router = useRouter()
const { lang } = useLocale()

const fromStart = computed(() => route.query.from === 'start')
const pageTitle = computed(() => lang.value === 'en' ? 'How to Play' : '玩法介绍')
const actionLabel = computed(() => {
  if (fromStart.value) return lang.value === 'en' ? 'Start Game' : '开始游戏'
  return lang.value === 'en' ? 'Back to Home' : '返回主页'
})

const contentHtml = ref('')
async function renderMd() {
  const src = lang.value === 'en' ? howToPlayEn : howToPlayZh
  contentHtml.value = await marked.parse(src)
}
watch(lang, renderMd, { immediate: true })

function handleAction() {
  if (fromStart.value) {
    router.push({ name: 'game' })
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="how-to-play">
    <!-- 可滚动内容区 -->
    <div class="how-to-play__scroll">
      <h2 class="how-to-play__title">{{ pageTitle }}</h2>
      <div class="how-to-play__content prose" v-html="contentHtml" />
    </div>

    <!-- 固定在底部的按钮 -->
    <footer class="how-to-play__footer">
      <GameButton :label="actionLabel" @click="handleAction" />
    </footer>
  </div>
</template>

<style lang="css" scoped>
@reference "@/style.css";

/* 页面容器：占满视口，不自身滚动 */
.how-to-play {
  @apply flex h-screen flex-col items-center;
}

/* 内容区：撑满剩余高度，可滚动，隐藏滚动条 */
.how-to-play__scroll {
  @apply flex-1 w-full overflow-y-auto flex flex-col items-center gap-8 px-6 pt-14 pb-6;
  scrollbar-width: none; /* Firefox */
}
.how-to-play__scroll::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}

/* 固定底部按钮区 */
.how-to-play__footer {
  @apply w-full flex justify-center px-6 py-5
         bg-bg-page/80 backdrop-blur-sm
         shadow-[0_-8px_24px_rgba(0,0,0,0.4)];
}

.how-to-play__title {
  @apply text-4xl font-bold text-accent-light;
}

.how-to-play__content {
  @apply w-full max-w-lg text-text-secondary;
}


/* markdown 渲染样式 */
.how-to-play__content :deep(h1) {
  @apply text-2xl font-bold text-accent-light mb-4;
}
.how-to-play__content :deep(h2) {
  @apply text-lg font-semibold text-accent-light mt-6 mb-2;
}
.how-to-play__content :deep(h3) {
  @apply text-base font-semibold text-text-primary mt-4 mb-1;
}
.how-to-play__content :deep(p) {
  @apply leading-relaxed mb-3;
}
.how-to-play__content :deep(ul) {
  @apply list-disc pl-5 space-y-1 mb-3;
}
.how-to-play__content :deep(ol) {
  @apply list-decimal pl-5 space-y-1 mb-3;
}
.how-to-play__content :deep(blockquote) {
  @apply border-l-4 border-accent/50 pl-4 text-text-secondary italic mb-3;
}
.how-to-play__content :deep(table) {
  @apply w-full text-sm border-collapse mb-3;
}
.how-to-play__content :deep(th) {
  @apply border border-game-border bg-border-subtle/50 px-3 py-1.5 text-left text-text-primary;
}
.how-to-play__content :deep(td) {
  @apply border border-border-subtle px-3 py-1.5;
}
.how-to-play__content :deep(code) {
  @apply rounded bg-border-subtle/60 px-1 py-0.5 text-xs text-accent-light font-mono;
}
</style>
