<template>
	<div class="bg-[#ffffff] rounded-[16px] max-h-[426px] overflow-auto relative scroll-hide">
		<div
			class="p-5 cursor-pointer"
			:class="{ 'sticky top-0 bg-white z-30 rounded-b-none': isCollapsed }"
			@click="onCollapseTriggerClicked"
		>
			<slot>
				<div
					v-show="!isCollapsed"
					class="flex row justify-between items-center"
				>
					<v-button>
						<icon-arrow-rounded />
					</v-button>
					<div class="collection-title">
						<span>
							{{ title }}
						</span>
						<span>
							{{ descriptionText }}
						</span>
					</div>
					<v-button @click.stop="$emit('generate')">
						<icon-plus-rounded />
					</v-button>
				</div>

				<div
					v-show="isCollapsed"
					class="flex row justify-between items-center"
				>
					<v-button class="rotate-90">
						<icon-arrow-rounded />
					</v-button>
					<div class="collection-title">
						<span>
							{{ title }}
						</span>

						<span>
							{{ descriptionText }}
						</span>
					</div>
					<button
						class="cursor-pointer"
						@click.stop="$emit('generate')"
					>
						<v-button>
							<icon-plus-rounded />
						</v-button>
					</button>
				</div>
			</slot>
		</div>
		<transition name="slide-fade">
			<div
				v-show="isCollapsed"
				class="flex flex-col px-[10px] rounded-[40px]"
			>
				<v-input
					v-model="modelValue"
					input-text="Поиск"
				/>
				<div class="collection bg-[#FFA767]  justify-between">
					<div class="flex gap-[15px] items-center text-[#FFEFD8]">
						<icon-favorite />
						<span class="text-[15px] font-medium leading-[94.95%]">
							{{ t('liked') }}
						</span>
					</div>
					<IconArrow icon-color="#ffffff" />
				</div>
				<div class="collection bg-[#F5F5F5]  justify-between">
					<div class="flex gap-[15px] items-center text-[#363636]">
						<span class="text-[15px] font-medium leading-[94.95%]">
							{{ t('MyRecipes') }}
						</span>
					</div>
					<IconArrow icon-color="#363636" />
				</div>
				<ul>
					<liк
						v-for="item in data"
						:key="item.id"
					>
						<div class="collection bg-[#F5F5F5] text-[#363636]">
							<slot
								name="item"
								v-bind="{ item }"
							>
								{{ item[titleKey] }}
							</slot>
						</div>
					</liк>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import Localization from './VCollapse.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
import { Collection } from 'entities/Сollection/types/typesCollection.ts'
import VInput from '../Input/VInput.vue'
import IconArrow from '../Icon/IconArrow.vue'
import { IconArrowRounded, IconPlusRounded } from '../Icon'
const modelValue = ref('')

const { t } = useTranslation(Localization)

defineEmits<{
	(event: 'change'): void;
	(event: 'generate'): void;
}>()

const props = withDefaults(defineProps<{
	data: Collection[],
	title: string,
	titleKey?: string,
	idKey?: string
	description?: string
}>(), {
	titleKey: 'name',
	idKey: 'id',
	description: undefined
})

const { data, titleKey, description, title } = toRefs(props)

const descriptionText = computed<string>(() => {
	if (description.value !== undefined) return description.value

	let text = `(${data.value.length}${t('count')}.)`

	return text
})

const isCollapsed = ref<boolean>(false)

const onCollapseTriggerClicked = () => {
	isCollapsed.value = !isCollapsed.value
}

</script>

<style lang="scss" scoped>
.collection-title {
	@apply flex min-w-0 gap-1 text-[#9D8F6B] font-medium text-[15px] leading-[14px];
}

.collection {
	@apply pl-8 pr-4 py-[16px] mb-2 rounded-[14px] flex
}

.scroll-hide::-webkit-scrollbar {
	display: none;
}

.scroll-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
