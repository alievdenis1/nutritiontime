<template>
	<div class="tabs-container">
		<div class="tabs-wrapper">
			<div
				v-for="(tab) in tabs"
				:key="tab.id"
				class="tab-column rounded-[100px] px-[16px] py-[12px]"
				:class="{ 'active-tab': tab.id === selectedTab.id, 'draggable-tab': tab.id === draggableTabId, 'highlight-draggable': tab.id === draggableTabId }"
				:draggable="tab.id === draggableTabId"
				@dragstart="onDragStart(tab, $event)"
				@dragover.prevent="onDragOver($event, tab)"
				@dragleave="onDragLeave($event, tab)"
				@drop="onDrop($event, tab)"
				@click="onTabClick(tab)"
			>
				<IconKebab
					v-if="tab.isActiveEdit && tab.id === selectedTab.id"
					class="mr-[6px] cursor-pointer"
					@click.stop="showContextMenu($event, tab)"
				/>
				<div
					v-if="tab.isActiveEdit && tab.id !== selectedTab.id"
					class="w-[22px]"
				/>
				<div>{{ tab.label }}</div>
				<div class="ml-[6px]">
					{{ tab.count }}
				</div>
			</div>
		</div>
		<v-button class="cursor-pointer px-[13px] py-[13px] rounded-[100px] bg-[#F3F3F3] ml-[8px]">
			<IconPlus :icon-color="'#319A6E'" />
		</v-button>
		<div
			v-if="contextMenu.visible"
			class="context-menu"
			:style="{ top: contextMenu.top + 'px', left: contextMenu.left + 'px' }"
		>
			<button
				class="menu-item"
				@click="editAction(contextMenu.tabId)"
			>
				<IconEdit class="icon" />
				Редактировать
			</button>
			<div class="span" />
			<button
				class="menu-item"
				@click="enableDrag(contextMenu.tabId)"
			>
				<IconMove class="icon" />
				Переместить
			</button>
			<div class="span" />
			<button
				class="menu-item text-red"
				@click="deleteAction(contextMenu.tabId)"
			>
				<IconBin class="icon" />
				Удалить
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconKebab, IconBin, IconMove, IconEdit } from 'shared/components/Icon'

interface Tab {
    id: number
    label: string
    isActiveEdit: boolean
    count: number
}

const tabs = ref<Tab[]>([
    { id: 1, label: 'Мне понравилось', isActiveEdit: false, count: 5 },
    { id: 2, label: 'Вкусняшки', isActiveEdit: true, count: 5 },
    { id: 3, label: 'Красивое', isActiveEdit: true, count: 5 },
    { id: 4, label: 'Категория 1', isActiveEdit: true, count: 5 },
    { id: 5, label: 'Категория 2', isActiveEdit: true, count: 5 },
    { id: 6, label: 'Категория 3', isActiveEdit: true, count: 5 },
])

const selectedTab = ref<Tab>(tabs.value[0])
const draggedTab = ref<Tab | null>(null)
const draggedOverTab = ref<Tab | null>(null)
const contextMenu = ref<{ visible: boolean, top: number, left: number, tabId: number | null }>({ visible: false, top: 0, left: 0, tabId: null })
const draggableTabId = ref<number | null>(null)

const onDragStart = (tab: Tab, event: DragEvent) => {
    if (tab.id === draggableTabId.value) {
        draggedTab.value = tab
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('tab-id', tab.id.toString())
    }
}

const onDragOver = (event: DragEvent, tab: Tab) => {
    event.preventDefault()
    draggedOverTab.value = tab
}

const onDragLeave = () => {
    draggedOverTab.value = null
}

const onDrop = (event: DragEvent, tab: Tab) => {
    event.preventDefault()
    const draggedTabId = parseInt(event.dataTransfer.getData('tab-id'))
    const draggedTabIndex = tabs.value.findIndex(t => t.id === draggedTabId)
    const targetTabIndex = tabs.value.findIndex(t => t.id === tab.id)

    if (draggedTabIndex !== -1 && targetTabIndex !== -1) {
        const [movedTab] = tabs.value.splice(draggedTabIndex, 1)
        tabs.value.splice(targetTabIndex, 0, movedTab)
    }

    draggedTab.value = null
    draggedOverTab.value = null
    draggableTabId.value = null
}

const showContextMenu = (event: MouseEvent, tab: Tab) => {
    contextMenu.value.visible = true
    contextMenu.value.top = event.clientY + 20
    contextMenu.value.left = event.clientX - 100
    contextMenu.value.tabId = tab.id

    const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.context-menu')) {
            contextMenu.value.visible = false
            window.removeEventListener('click', handleClickOutside)
        }
    }

    window.addEventListener('click', handleClickOutside)
}

const onTabClick = (tab: Tab) => {
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
    overflow-x: auto;
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    align-items: center;
    -ms-overflow-style: none;
    scrollbar-width: none;
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
    box-shadow: 0px 0px 34px 0px #00000014;
    border: 1px solid #1C1C1C0D;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: absolute;
}

.menu-item {
    display: flex;
    align-items: center;
    width: 100%;
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