<template>
	<VButton
		:color="ButtonColors.Green"
		@click="openLeaderboardModal"
	>
		{{ t('leaderButton') }}
	</VButton>
	<VModal
		:show="isShowLeaderboardModal"
		@close="closeLeaderboardModal"
	>
		<div class="content">
			<div class="grid grid-cols-[70px_repeat(2,_1fr)] sticky top-0 bg-white">
				<div>{{ t('rank') }}</div>
				<div>{{ t('name') }}</div>
				<div class="flex items-center gap-[7px]">
					{{ t('balance') }} <IconGold class="w-[18px] h-[18px]" />
				</div>
			</div>
			<template
				v-for="leader in leaderboard"
				:key="leader"
			>
				<div class="grid grid-cols-[70px_repeat(2,_1fr)]">
					<div>{{ leader.rank }}</div>
					<div>{{ leader.name }}</div>
					<div>{{ leader.balance }}</div>
				</div>
			</template>
			...
			<!-- TODO: тут условие, что нас нет в списке лидеров -->
			<!-- Если мы в лидерах, то не отображаем тут контент -->
			<!-- TODO: вынести в отдельный компонент Leader -->
			<div class="grid grid-cols-[70px_repeat(2,_1fr)]">
				<div>1000</div>
				<div>me</div>
				<div>11</div>
			</div>
			...
		</div>
	</VModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { VModal } from '@/shared/components/Modal'
import { useTranslation } from '@/shared/lib/i18n'
import { IconGold } from 'shared/components/Icon'
import Localization from './LeaderBoard.localization.json'
import { LEADERS } from './mock'

interface ILeader {
    rank: number;
    name: string;
    balance: number;
}

const { t } = useTranslation(Localization)

const isShowLeaderboardModal = ref(false)
const leaderboard = ref<ILeader[]>(LEADERS)

const openLeaderboardModal = () => {
    isShowLeaderboardModal.value = true
}

const closeLeaderboardModal = () => {
    isShowLeaderboardModal.value = false
}
</script>

<style scoped>
.content {
    max-height: calc(100vh - 80px);
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>