<template>
	<svg
		width="21"
		height="21"
		viewBox="0 0 21 21"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M16.941 0H3.28264C0.77135 0 -0.820365 2.70893 0.443063 4.89886L8.87249 19.5094C9.42256 20.4634 10.8011 20.4634 11.3511 19.5094L19.7823 4.89886C21.044 2.71243 19.4523 0 16.9427 0H16.941ZM8.86564 15.1279L7.02985 11.575L2.60028 3.65264C2.30806 3.14557 2.66899 2.49579 3.28092 2.49579H8.86392V15.1296L8.86564 15.1279ZM17.6199 3.65093L13.1921 11.5767L11.3563 15.1279V2.49407H16.9393C17.5512 2.49407 17.9121 3.14386 17.6199 3.65093Z"
			:fill="iconColor"
		/>
	</svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    iconColor: string,
}>(), {
    iconColor: '#ffffff'
})
</script>

<style scoped>

</style>