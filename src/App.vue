<template>
	<Notifies />
	<router-view />
</template>

<script>
	import Notifies from "./components/Notifies.vue";
	export default {
		components: { Notifies },
	};
</script>

<style lang="scss">
</style>