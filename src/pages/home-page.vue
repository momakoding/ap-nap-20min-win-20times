<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GameButton from '@/components/game-button.vue'
import { GAME_META } from '@/contents/game-info'
import { useLocale } from '@/composables'

interface MenuItem {
	label: string
	variant: 'primary' | 'secondary'
	colSpan: number
	onClick: () => void
}

const router = useRouter()
const { lang } = useLocale()

const menuItems = computed<MenuItem[]>(() => {
	const isEn = lang.value === 'en'
	return [
		{
			label: isEn ? 'Start Game' : '开始游戏',
			variant: 'primary',
			colSpan: 3,
			onClick: () => router.push({ name: 'how-to-play', query: { from: 'start' } }),
		},
		{
			label: isEn ? 'How to Play' : '玩法介绍',
			variant: 'secondary',
			colSpan: 3,
			onClick: () => router.push({ name: 'how-to-play', query: { from: 'menu' } }),
		},
		{
			label: isEn ? 'Settings' : '设置',
			variant: 'secondary',
			colSpan: 2,
			onClick: () => router.push({ name: 'settings' }),
		},
		{
			label: isEn ? 'About Us' : '关于我们',
			variant: 'secondary',
			colSpan: 2,
			onClick: () => router.push({ name: 'about-us' }),
		},
		{
			label: isEn ? 'Quit' : '退出游戏',
			variant: 'secondary',
			colSpan: 2,
			onClick: () => {
				window.close()
				window.location.href = 'about:blank'
			},
		},
	]
})
</script>

<template>
	<div class="home-page">
		<div class="home-page-scene">
			<div class="home-page-ui">
				<div class="text-center">
					<h1 class="home-page__title">{{ GAME_META.title }}</h1>
					<p v-if="GAME_META.subtitle && GAME_META.subtitle !== ''" class="home-page__subtitle">
						{{ GAME_META.subtitle }}
					</p>
				</div>

				<div class="w-full h-px bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>

				<nav class="home-page__nav">
					<GameButton
						v-for="item in menuItems"
						:key="item.label"
						:label="item.label"
						:variant="item.variant"
						:style="{ gridColumn: `span ${item.colSpan}` }"
						@click="item.onClick"
					/>
				</nav>
			</div>
		</div>
	</div>
</template>

<style lang="css" scoped>
@reference "@/style.css";

/* 外层铺满屏幕，居中放置固定比例的游戏场景 */
.home-page {
	@apply select-none h-screen flex items-center justify-center bg-black;
}

/* 固定 1376:768 比例的场景容器，背景图始终 1:1 对应 */
.home-page-scene {
	position: relative;
	aspect-ratio: 1376 / 768;
	max-height: 100vh;
	width: min(100vw, calc(100vh * 1376 / 768));
	background-image: url('/img/game-title.png');
	background-size: 100% 100%;
}

/* 白色对话框区域：left=52.5% top=8.1% width=41.2% height=47.7% */
.home-page-ui {
	@apply flex flex-col items-center justify-center gap-6 absolute;
	left: 52.5%;
	top: 8.1%;
	width: 41.2%;
	height: 47.7%;
	padding: 2% 3%;
}

.home-page__title {
	@apply text-5xl font-bold tracking-widest text-accent-light;
}

.home-page__title::after {
	content: '';
	@apply block w-10 h-0.5 bg-accent mx-auto mt-3 rounded-full;
}

.home-page__subtitle {
	@apply text-base uppercase tracking-widest text-slate-400 mt-2;
}

.home-page__nav {
	@apply grid grid-cols-6 gap-3 w-full;
}

/* 主按钮加高，视觉权重更突出 */
.home-page__nav :deep(.game-button--primary) {
	@apply py-4 text-xl;
}

/* grid 上下文中让按钮撑满格子，覆盖 game-button 的 min-w-48 */
.home-page__nav :deep(.game-button) {
	@apply min-w-0 w-full;
}

/* 开始游戏（primary）hover 时字体变白，与 amber 背景形成对比 */
.home-page__nav :deep(.game-button--primary:hover) {
	@apply text-white;
}

/* 次要按钮在白底上：默认深色文字/边框，hover 加深而非变白 */
.home-page__nav :deep(.game-button--secondary) {
	@apply text-slate-600 border-slate-300 bg-transparent;
}

.home-page__nav :deep(.game-button--secondary:hover) {
	@apply text-slate-800 border-slate-500 bg-slate-100;
}

.home-page__nav :deep(.game-button--secondary:active) {
	@apply bg-slate-200;
}
</style>
