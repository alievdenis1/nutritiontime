<template>
	<div class="gap-5 grid">
		<header class="flex items-center justify-between w-full">
			<img
				alt="logo"
				height="30"
				src="/image/logo/logo-small.webp"
				width="152"
			>

			<img
				alt="Profile"
				height="25"
				src="/image/icons/icon-profile.svg"
				width="25"
			>
		</header>
		<div id="ton-connect-button-root" />
	</div>
</template>

<script lang="ts" setup>
import { TonConnectUI } from '@tonconnect/ui'
import { onMounted } from 'vue'

onMounted(() => {
  new TonConnectUI({ //connect application
    manifestUrl: 'https://alievdenis1.github.io/nutritiolntime/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-button-root',
  })
})

</script>

<style lang="scss" scoped></style>
