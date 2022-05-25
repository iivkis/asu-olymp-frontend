<template>
	<div class="header">
		<div class="header__wrap">
			<div class="header__logo">
				<logo />
			</div>
			<div class="header__nav nav">
				<div class="nav__item nav__item-active">тестирование</div>
				<div class="nav__item">рейтинг</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Logo from "../components/Logo.vue";

	export default {
		name: "Header",
		components: { Logo },
	};
</script>

<style scoped lang="scss">
	.header {
		@apply w-full flex justify-center;
		@apply bg-white shadow-md;

		&__wrap {
			@apply flex justify-between;
			@apply w-screen md:w-4/5 lg:w-1/2;
		}

		&__logo {
			@apply flex items-center;
		}

		&__nav {
			@apply flex;
		}
	}

	.nav {
		&__item {
			@apply h-full flex items-center;
			@apply px-5 py-3 cursor-pointer border-b-4 border-transparent;
			@apply text-xl tracking-tight;

			@apply hover:bg-slate-100;

			&-active {
				@apply border-b-orange-600;
			}
		}
	}
</style>