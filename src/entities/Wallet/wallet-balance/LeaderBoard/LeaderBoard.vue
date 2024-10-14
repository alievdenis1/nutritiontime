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
		<div class="leaderboard">
			<div class="row sticky top-0 bg-white">
				<div>{{ t('rank') }}</div>
				<div>{{ t('name') }}</div>
				<div class="flex items-center gap-[7px]">
					{{ t('balance') }} <IconGold class="w-[18px] h-[18px]" />
				</div>
			</div>
			<template v-if="leaderData?.leaderboard">
				<template
					v-for="(leader, index) in leaderData.leaderboard"
					:key="leader.id"
				>
					<div class="row">
						<div>{{ index + 1 }}</div>
						<div>{{ leader.name }}</div>
						<div>{{ Number(leader.balance).toFixed(2) }}</div>
					</div>
				</template>
				<template v-if="!isUserInTop">
					...
					<div class="row">
						<div>{{ leaderData.user_rank }}</div>
						<div>{{ leaderData?.current_user.name }}</div>
						<div>{{ Number(leaderData?.current_user.balance).toFixed(2) }}</div>
					</div>
					...
				</template>
			</template>
			<template v-else>
				<VSkeleton class="w-full h-[32px] rounded-[16px] " />
				<VSkeleton class="w-full h-[32px] rounded-[16px] " />
				<VSkeleton class="w-full h-[32px] rounded-[16px] " />
			</template>
		</div>
	</VModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTranslation } from '@/shared/lib/i18n'
import { VButton, ButtonColors } from '@/shared/components/Button'
import { VModal } from '@/shared/components/Modal'
import VSkeleton from '@/shared/components/ui/skeleton/VSkeleton.vue'
import { IconGold } from '@/shared/components/Icon'
import { ILeader } from '../../types'
import { getLeaderboard } from '../../api'
import Localization from './LeaderBoard.localization.json'

const { t } = useTranslation(Localization)

const isShowLeaderboardModal = ref(false)
const leaderData = ref<ILeader | null>(null)
const isUserInTop = ref(false)

const openLeaderboardModal = () => {
    isShowLeaderboardModal.value = true
}

const closeLeaderboardModal = () => {
    isShowLeaderboardModal.value = false
}

const checkUserInTop = (leaderData: ILeader | null) => {
	if (!leaderData) return false

	const leaderboard = leaderData.leaderboard
	const currentUser = leaderData.current_user

	const userInTop = leaderboard.some((leader) => leader.id === currentUser.id)

	return userInTop
}

const fetchLeaderboard = async () => {
	const { execute, data } = getLeaderboard()
	await execute()

	return data.value
}

const fetchAndCalculateLeaderboard = async () => {
	const leaderboard = await fetchLeaderboard()

	const userInTop = checkUserInTop(leaderboard)

	leaderData.value = leaderboard
	isUserInTop.value = userInTop
}

watch(isShowLeaderboardModal, (isOpened) => {
	if (isOpened) {
		fetchAndCalculateLeaderboard()
	} else {
		leaderData.value = null
	}
})
</script>

<style scoped>
.leaderboard {
    max-height: calc(100vh - 80px);
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 16px;

	padding-bottom: 10px;
}

.row {
	@apply grid gap-x-[10px] grid-cols-[60px_1fr_125px]
}
</style>