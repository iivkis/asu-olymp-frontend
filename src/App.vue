<template>
	<Notifies />
	<router-view />
</template>

<script>
	import client from "./client";
	import Notifies from "./components/Notifies.vue";
	export default {
		components: { Notifies },
		async mounted() {
			try {
				const { data } = await client({
					url: "/cookie",
					method: "post",
					withCredentials: true,
				});
				this.$store.dispatch("SetApiKey", { token: data.data.token });
				this.$store.dispatch("NotifyInfo", {
					text: "Вход в аккаунт выполнен",
				});
			} catch (e) {
				console.log(e);
			}
		},
	};
</script>

<style lang="scss">
</style>