<template>
	<div
		class=" bg-white rounded-[30px] max-h-[426px] overflow-auto relative scroll-hide"
	>
		<div
			class="p-5 cursor-pointer rounded-[40px]"
			:class="{'sticky top-0 bg-white z-10 rounded-b-none': isCollapsed}"
			@click="onCollapseTriggerClicked"
		>
			<slot>
				<div
					v-show="!isCollapsed"
					class="flex row justify-between items-center"
				>
					<v-button>
						<img
							height="19"
							src="/image/icons/icon-arrow-rounded.svg"
							width="19"
						>
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
						<img
							height="19"
							src="/image/icons/icon-plus-rounded.svg"
							width="19"
						>
					</v-button>
				</div>

				<div
					v-show="isCollapsed"
					class="flex row justify-between items-center"
				>
					<v-button class="rotate-90">
						<img
							height="19"
							src="/image/icons/icon-arrow-rounded.svg"
							width="19"
						>
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
							<img
								height="19"
								src="/image/icons/icon-plus-rounded.svg"
								width="19"
							>
						</v-button>
					</button>
				</div>
			</slot>
		</div>

		<el-collapse-transition>
			<div
				v-show="isCollapsed"
				class="flex flex-col px-[10px] rounded-[40px]"
			>
				<div class="collection bg-[#FFA767] gap-[15px]">
					<img
						width="25"
						src="/image/icons/icon-favorite.svg"
						height="27"
					>
					<div class="flex flex-col gap-0 py-0.5 text-[#FFEFD8]">
						<span class="text-[15px] font-medium leading-[94.95%]">
							Favorites
						</span>
						<p class="text-[10px] font-medium opacity-70 leading-[94.95%]">
							text
						</p>
					</div>
				</div>
				<ul>
					<li
						v-for="item in data"
<<<<<<< HEAD
						:key="item.id"
=======
						:key="item[idKey]"
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
					>
						<div class="collection bg-[#F8E1BD]">
							<slot
								name="item"
								v-bind="{ item }"
							>
								{{ item[titleKey] }}
							</slot>
						</div>
					</li>
				</ul>
			</div>
		</el-collapse-transition>
	</div>
</template>

<script setup lang="ts" generic="T extends any">
import { computed, ref, toRefs } from 'vue'
import Localization from './VCollapse.localization.json'
import { useTranslation } from '@/shared/lib/i18n'
<<<<<<< HEAD
import { Plan } from '@/entities/Plan/types'

const { t } = useTranslation(Localization)

defineEmits<{
  (event: 'change'): void;
  (event: 'generate'): void;
}>()

const props = withDefaults(defineProps<{
	data: Plan[],
=======

const { t } = useTranslation(Localization)

const emit = defineEmits<{
	(event: 'change', value: string | number): void,
	(event:'generate'): void
}>()

const props = withDefaults(defineProps<{
	data: Record<string, T>[],
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	title: string,
	titleKey?: string,
	idKey?: string
	description?: string
<<<<<<< HEAD
}>(),  {
=======
}>(), {
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	titleKey: 'name',
	idKey: 'id',
	description: undefined
})

<<<<<<< HEAD
const { data, titleKey,  description, title } = toRefs(props)
=======
const { data, titleKey, idKey, description, title } = toRefs(props)
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584

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
	@apply pl-8 pr-4 py-[25px] mb-2 rounded-[40px] flex
}

.scroll-hide::-webkit-scrollbar {
	display: none;
}

.scroll-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

</style>
