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
			<div class="p-3 flex justify-center items-center">
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
		@apply w-4/5 lg:w-1/2 flex justify-between bg-white p-4 shadow-md rounded-md;

		&__img {
			@apply flex basis-1/5 items-center;

			img {
				@apply w-20;
			}
		}

		&__content {
			@apply flex flex-col;
			h3 {
				@apply text-lg font-medium tracking-tight;
			}
		}
	}
</style>