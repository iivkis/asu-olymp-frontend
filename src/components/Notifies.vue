<template>
	<div class="notify_wrap">
		<div
			v-for="(item, index) in $store.state.Notifies"
			:key="index"
			:class="`notify__item item item-${item.type}`"
		>
			<div class="item__msg">
				<span class="item__title">{{ item.title }}</span>
				<p class="item__text">{{ item.text }}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Notifies",
	};
</script>

<style scoped lang="scss">
	.notify_wrap {
		@apply fixed bottom-0 right-0;
		@apply flex flex-wrap justify-end;
		@apply max-w-md max-h-screen;

		.item {
			@apply flex justify-end basis-full transition-all;

			&__msg {
				@apply p-4 mr-4 mb-4 rounded-xl bg-white shadow-md;
			}

			&__title {
				@apply text-xl;
			}

			&-err {
				.item__title {
					@apply text-red-500;
				}
			}

			&-info {
				.item__title {
					@apply text-blue-500;
				}
			}
		}
	}
</style>