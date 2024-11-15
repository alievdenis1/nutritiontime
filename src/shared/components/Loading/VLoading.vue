<template>
	<div class="spinner-container">
		<div>
			<div class="spinner">
				<div
					v-for="n in 8"
					:key="n"
					class="spinner-segment"
				/>
			</div>
		</div>
		<div class="flex gap-[8px] items-center">
			<div class="text-white text-lg">
				{{ t('loadingTitle') }}
			</div>
			<IconAi icon-color="#ffffff" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconAi } from 'shared/components/Icon'
import Localization from './VLoading.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
const { t } = useTranslation(Localization)
</script>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #4CAF50;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    gap: 32px;
    z-index: 100;
}

.spinner {
    width: 30px;
    height: 30px;
    position: relative;
    animation: rotate 2s linear infinite;
}

.spinner-segment {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.spinner-segment::before {
    content: '';
    display: block;
    width: 15%;
    height: 40%;
    background-color: white;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    top: -5px;
    transform: translateX(-50%);
    animation: fade 2s linear infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes fade {

    0%,
    100% {
        opacity: 0.1;
    }

    50% {
        opacity: 1;
    }
}

.spinner-segment:nth-child(1) {
    transform: rotate(0deg);
}

.spinner-segment:nth-child(2) {
    transform: rotate(45deg);
}

.spinner-segment:nth-child(3) {
    transform: rotate(90deg);
}

.spinner-segment:nth-child(4) {
    transform: rotate(135deg);
}

.spinner-segment:nth-child(5) {
    transform: rotate(180deg);
}

.spinner-segment:nth-child(6) {
    transform: rotate(225deg);
}

.spinner-segment:nth-child(7) {
    transform: rotate(270deg);
}

.spinner-segment:nth-child(8) {
    transform: rotate(315deg);
}

.spinner-segment:nth-child(1)::before {
    animation-delay: -1.4s;
}

.spinner-segment:nth-child(2)::before {
    animation-delay: -1.2s;
}

.spinner-segment:nth-child(3)::before {
    animation-delay: -1.0s;
}

.spinner-segment:nth-child(4)::before {
    animation-delay: -0.8s;
}

.spinner-segment:nth-child(5)::before {
    animation-delay: -0.6s;
}

.spinner-segment:nth-child(6)::before {
    animation-delay: -0.4s;
}

.spinner-segment:nth-child(7)::before {
    animation-delay: -0.2s;
}

.spinner-segment:nth-child(8)::before {
    animation-delay: 0s;
}
</style>