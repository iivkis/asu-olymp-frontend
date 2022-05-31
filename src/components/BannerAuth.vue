<template>
	<div class="banner_auth">
		<div class="banner_auth__img">
			<img :src="taskPNG" />
		</div>
		<div class="banner_auth__content">
			<h3>
				Решай задчи, прокачивай свой мозг и соревнуйся с другими за
				место в рейтинге!
			</h3>
			<div class="py-5">
				<router-link class="btn-red-mini" to="/auth">
					Войти
				</router-link>
				<span class="px-4 text-lg">или</span>
				<router-link class="btn-blue-mini" to="/auth">
					Создать аккаунт
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import taskPNG from "../assets/completed-task.png";

	export default {
		name: "BannerAuth",
		data() {
			return {
				taskPNG,
			};
		},
	};
</script>

<style scoped lang="scss">
	.banner_auth {
		@apply flex justify-between bg-white p-4 shadow-md sm:rounded-md;

		&__img {
			@apply flex basis-2/5 lg:basis-1/5 items-center;

			img {
				@apply w-20;
			}
		}

		&__content {
			@apply flex flex-col pl-5;
			h3 {
				@apply font-medium tracking-tighter;
				@apply sm:text-lg;
			}
		}
	}
</style>