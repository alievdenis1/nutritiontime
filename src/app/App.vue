<template>
	<component :is="layout">
		<router-view />
	</component>
</template>

<script setup lang="ts">
import { shallowRef, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { DefaultLayout } from './layouts'

const route = useRoute()

const layout = shallowRef<Component>(DefaultLayout)

watch(() => route?.meta?.layout, (newLayoutComponent) => {
	layout.value = newLayoutComponent || DefaultLayout
})
</script>

<style lang="scss" src="shared/styles/index.scss" />
