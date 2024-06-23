<template>
	<div
		class="tabs-container"
		:class="{ 'visible': contextMenu.visible}"
	>
		<div class="tabs-wrapper">
			<div
				v-for="(tab) in items"
				ref="target"
				:key="tab.id"
				class="tab-column rounded-[100px] px-[16px] py-[12px]"
				:class="{ 'active-tab': tab.id === selectedTab.id, 'draggable-tab': tab.id === draggableTabId, 'highlight-draggable': tab.id === draggableTabId }"
				:draggable="tab.id === draggableTabId"
				@dragstart="onDragStart(tab, $event)"
				@dragover.prevent="onDragOver($event, tab)"
				@dragleave="onDragLeave"
				@drop="onDrop($event, tab)"
				@click="onTabClick(tab)"
			>
				<IconKebab
					v-if="tab.isActiveEdit && tab.id === selectedTab.id"
					class="mr-[6px] cursor-pointer"
					@click.stop="showContextMenu(tab.id, $event)"
				/>
				<div
					v-if="tab.isActiveEdit && tab.id !== selectedTab.id"
					class="w-[22px]"
				/>
				<div>{{ tab.label }}</div>
				<div class="ml-[6px]">
					{{ tab.count }}
				</div>
				<div class="context">
					<div
						v-if="contextMenu.visible && contextMenu.tabId === tab.id"
						class="context-menu"
						:style="{ top: contextMenu.top + 'px', left: contextMenu.left + 'px' }"
					>
						<button
							class="menu-item"
							@click="editAction(contextMenu.tabId)"
						>
							<IconEdit class="icon" />
							{{ t('edit') }}
						</button>
						<div class="span" />
						<button
							class="menu-item"
							@click="enableDrag(contextMenu.tabId)"
						>
							<IconMove class="icon" />
							{{ t('move') }}
						</button>
						<div class="span" />
						<button
							class="menu-item text-red"
							@click="deleteAction(contextMenu.tabId)"
						>
							<IconBin class="icon" />
							{{ t('delete') }}
						</button>
					</div>
				</div>
			</div>
		</div>
		<v-button class="cursor-pointer px-[13px] py-[13px] rounded-[100px] bg-[#F3F3F3] ml-[8px]">
			<IconPlus :icon-color="'#319A6E'" />
		</v-button>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { IconPlus, IconKebab, IconBin, IconMove, IconEdit } from 'shared/components/Icon'
import { DragTypes } from './types'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './DragAndDrop.localization.json'

const { t } = useTranslation(Localization)

const props = defineProps({
    items: {
        type: Array as () => DragTypes[],
        required: true
    }
})

const { items } = toRefs(props)

const selectedTab = ref<DragTypes>(items.value[0])
const draggedTab = ref<DragTypes | null>(null)
const draggedOverTab = ref<DragTypes | null>(null)
const contextMenu = ref<{ visible: boolean, top: number, left: number, tabId: number | null }>({ visible: false, top: 0, left: 0, tabId: null })
const draggableTabId = ref<number | null>(null)

const target = ref(null)

onClickOutside(target, () => {
    contextMenu.value.visible = false
})

const onDragStart = (tab: DragTypes, event: DragEvent) => {
    if (tab.id === draggableTabId.value) {
        draggedTab.value = tab
        const dataTransfer = event.dataTransfer
        if (dataTransfer) {
            dataTransfer.effectAllowed = 'move'
            dataTransfer.setData('tab-id', tab.id.toString())
        } else {
            console.error('DragEvent\'s dataTransfer is null.')
        }
    }
}

const onDragOver = (event: DragEvent, tab: DragTypes) => {
    event.preventDefault()
    draggedOverTab.value = tab
}

const onDragLeave = () => {
    draggedOverTab.value = null
}

const onDrop = (event: DragEvent, tab: DragTypes) => {
    event.preventDefault()

    const dataTransfer = event.dataTransfer
    if (!dataTransfer) {
        console.error('DragEvent\'s dataTransfer is null.')
        return
    }

    const draggedTabId = parseInt(dataTransfer.getData('tab-id'))
    if (isNaN(draggedTabId)) {
        console.error('Failed to parse tab-id.')
        return
    }

    const draggedTabIndex = items.value.findIndex(t => t.id === draggedTabId)
    const targetTabIndex = items.value.findIndex(t => t.id === tab.id)

    if (draggedTabIndex !== -1 && targetTabIndex !== -1) {
        const [movedTab] = items.value.splice(draggedTabIndex, 1)
        items.value.splice(targetTabIndex, 0, movedTab)
    }

    draggedTab.value = null
    draggedOverTab.value = null
    draggableTabId.value = null
}

const showContextMenu = (tabId: number | null, event: MouseEvent) => {
    const menuWidth = 160
    const menuHeight = 180
    const { clientX, clientY } = event

    const { innerWidth, innerHeight } = window

    const left = clientX + menuWidth > innerWidth ? clientX - menuWidth : clientX
    const top = clientY + menuHeight > innerHeight ? clientY - menuHeight : clientY

    contextMenu.value = {
        visible: true,
        tabId: tabId,
        top: top + 'px',
        left: left + 'px'
    }
}

const onTabClick = (tab: DragTypes) => {
    selectedTab.value = tab
    if (draggableTabId.value !== tab.id) {
        draggableTabId.value = null
    }
}

const editAction = (tabId: number | null) => {
    console.log('Редактировать', tabId)
}

const enableDrag = (tabId: number | null) => {
    draggableTabId.value = tabId
    contextMenu.value.visible = false
}

const deleteAction = (tabId: number | null) => {
    console.log('Удалить', tabId)
}
</script>

<style scoped lang="scss">

.tabs-container {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: auto;
}
.tabs-container.visible {
    overflow-y: visible;
}

.tabs-container::-webkit-scrollbar {
    display: none;
}

.tabs-wrapper {
    display: flex;
    gap: 8px;
}

.tab-column {
    display: inline-flex;
    justify-content: center;
    position: relative;
    z-index: 2;
    align-items: center;
}

.draggable-tab {
    width: 100%;
    cursor: pointer;
}

.active-tab {
    background-color: #319A6E1A;
    color: #319A6E;
}

.highlight-draggable {
    outline: 2px dashed #319A6E;
    outline-offset: -4px;
}

.context-menu {
    background-color: white;
    border-radius: 8px;
    padding: 14px 16px;
    width: 160px;
    border: 1px solid #1C1C1C0D;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: absolute;
    top: 40px;
    left: -80px;
    z-index: 1000;
}

.menu-item {
    display: flex;
    align-items: center;
    text-align: left;
    background-color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
}

.menu-item .icon {
    margin-right: 8px;
}

.icon {
    width: 15px;
    height: 15px;
}

.span {
    border: 0.2px solid #9F9FA0;
}
</style>