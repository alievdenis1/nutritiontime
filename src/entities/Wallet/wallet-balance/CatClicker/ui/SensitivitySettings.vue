<template>
	<div class="sensitivity-settings">
		<TabsMain :default-value="activeTab">
			<TabsList>
				<TabsTrigger value="shake">
					Настройки тряски
				</TabsTrigger>
				<TabsTrigger value="voice">
					Настройки мяу
				</TabsTrigger>
			</TabsList>
			<TabsContent value="shake">
				<div class="settings-grid">
					<SensitivityCell
						v-for="level in shakeLevels"
						:key="level.value"
						:label="level.label"
						:value="level.value"
						:active="shakeLevel === level.value"
						@click="setShakeLevel(level.value)"
					/>
				</div>
			</TabsContent>
			<TabsContent value="voice">
				<div class="settings-grid">
					<SensitivityCell
						v-for="level in voiceLevels"
						:key="level.value"
						:label="level.label"
						:value="level.value"
						:active="voiceLevel === level.value"
						@click="setVoiceLevel(level.value)"
					/>
				</div>
			</TabsContent>
		</TabsMain>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TabsMain, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import SensitivityCell from './SensitivityCell.vue'
import { useCatClickerStore, CLICKER_CONFIG } from 'entities/Wallet/wallet-balance/CatClicker'

const store = useCatClickerStore()

defineProps<{
	shakeLevel: string,
}>()

const emit = defineEmits(['update:level'])

const activeTab = ref('shake')
const voiceLevel = ref(store.shoutLevel || 'medium')

const shakeLevels = [
    { label: 'Низкая', value: 'low', threshold: 33 },
    { label: 'Средняя', value: 'medium', threshold: 40 },
    { label: 'Высокая', value: 'high', threshold: 47 },
]

const voiceLevels = [
    { label: 'Низкая', value: 'low', threshold: 3.4 },
    { label: 'Средняя', value: 'medium', threshold: 3.65 },
    { label: 'Высокая', value: 'high', threshold: 3.9 },
]

const setShakeLevel = (level: string) => {
    emit('update:level', level)
    store.setShakeLevel(level)
    const selectedLevel = shakeLevels.find(l => l.value === level)
    if (selectedLevel) {
        CLICKER_CONFIG.shake.thresholdLow = selectedLevel.threshold
    }
}

const setVoiceLevel = (level: string) => {
    voiceLevel.value = level
    store.setShoutLevel(level)
    const selectedLevel = voiceLevels.find(l => l.value === level)
    if (selectedLevel) {
        CLICKER_CONFIG.sound.thresholdLow = selectedLevel.threshold
    }
}

const initializeLevels = () => {
    const currentShakeLevel = shakeLevels.find(l => l.threshold === CLICKER_CONFIG.shake.thresholdLow)
    if (currentShakeLevel) {
		emit('update:level', currentShakeLevel.value)
    }

    const currentVoiceLevel = voiceLevels.find(l => l.threshold === CLICKER_CONFIG.sound.thresholdLow)
    if (currentVoiceLevel) {
        voiceLevel.value = currentVoiceLevel.value
    }
}

onMounted(() => {
    initializeLevels()
})
</script>

<style scoped lang="scss">
.sensitivity-settings {
    margin-top: 20px;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 20px;
}
</style>