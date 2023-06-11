<template>
	<div class="bg-white shadow rounded px-[31px]">
		<div
			class="py-[25px] cursor-pointer"
			@click="onCollapseTriggerClicked"
		>
			<slot>
				<div
					v-show="!isCollapsed"
					class="flex row justify-between items-center"
				>
					<div class="flex flex-col min-w-0">
						<span class="text-green font-medium">
							{{ title }}
						</span>

						<span class="text-brown font-light text-ellipsis overflow-hidden whitespace-nowrap">
							{{ descriptionText }}
						</span>
					</div>

					<el-icon
						size="9"
						class="ml-[15px]"
					>
						<el-icon-arrow-right-bold class="text-green" />
					</el-icon>
				</div>

				<div
					v-show="isCollapsed"
					class="flex row justify-between items-center"
				>
					<el-icon
						size="16"
						class="mr-[30px]"
					>
						<el-icon-arrow-left-bold class="text-green" />
					</el-icon>

					<span class="text-lg text-brown grow">
						{{ title }}
					</span>
				</div>
			</slot>
		</div>

		<el-collapse-transition>
			<div
				v-show="isCollapsed"
				class="flex flex-col"
			>
				<ul>
					<li
						v-for="item in data"
						:key="item[idKey]"
					>
						<div class="bg-beige h-[1px] mb-[17px]" />

						<div class="mb-[17px]">
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

const emit = defineEmits<{
	(event: 'change', value: string | number)
}>()

const props = withDefaults(defineProps<{
	data: Record<string, T>[],
	title: string,
	titleKey?: string,
	idKey?: string
	description?: string
}>(), {
	titleKey: 'name',
	idKey: 'id',
	description: undefined
})

const { data, titleKey, idKey, description, title } = toRefs(props)

const descriptionText = computed<string>(() => {
	if (description.value !== undefined) return description.value

	let text = `${data.value.length} шт. `

	if (data.value) {
		text += '(' +
			data.value.map((item, index) => {
				let itemName: T['name'] = item[titleKey.value]

				if (index !== 0) {
					itemName = ' ' + itemName
				}

				return itemName
			})
			+ ')'
	}

	return text
})

const isCollapsed = ref<boolean>(false)

const onCollapseTriggerClicked = () => {
	isCollapsed.value = !isCollapsed.value
}
</script>
