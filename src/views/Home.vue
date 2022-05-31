<template>
	<Header />
	<div class="content_wrap">
		<div v-if="!$store.state.ApiKey">
			<banner-auth />
		</div>

		<!-- taskList -->
		<div class="tasks_list">
			<div
				class="task_list__item"
				v-for="(task, index) in tasks"
				:key="index"
			>
				<router-link :to="`/tasks/${task.id}`">
					<div class="task_list_item__title">
						<h4>
							{{ task.title }}
						</h4>
					</div>
					<div class="task_list_item__content">
						<p>
							{{ task.content.slice(0, 200) }}
						</p>
					</div>
				</router-link>
				<div class="task_list_item__footer">
					<div>
						Автор:
						<router-link :to="`/profile/${task.author_id}`">
							{{ task.author_name }}
						</router-link>
					</div>
					<div>
						Решений: <span>{{ task.solutions_count }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- /taskList -->
	</div>
</template>

<script>
	import Header from "../components/Header.vue";
	import BannerAuth from "../components/BannerAuth.vue";
	import client from "../client";

	export default {
		name: "Home",
		components: { Header, BannerAuth },
		data() {
			return {
				tasks: [
					{
						title: "loading...",
						content: "loading...",
						author_id: 0,
						author_name: "loading...",
						solutions_count: 0,
					},
				],
			};
		},

		async mounted() {
			await this.LoadTasks();
		},

		methods: {
			async LoadTasks() {
				try {
					const { data } = await client({
						url: "/t/tasks",
						method: "get",
					});

					const maxlen = 200;
					data.data.forEach((task) => {
						if (task.content.length > maxlen)
							task.content = task.content.slice(0, maxlen) + "...";
					});
					this.$data.tasks = data.data;
				} catch (e) {
					console.log(e);
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	.tasks_list {
		@apply flex flex-col py-2;

		.task_list__item {
			@apply p-5 sm:my-2 transition-all;
			@apply shadow-md bg-white sm:rounded;
			@apply hover:shadow-xl;
			@apply border-b-2 sm:border-none;
		}

		.task_list_item {
			&__title {
				h4 {
					@apply text-xl sm:text-2xl font-medium;
				}
			}

			&__content {
				@apply py-3;
				@apply text-sm sm:text-lg sm:font-normal tracking-tight;
			}

			&__footer {
				@apply w-full flex justify-between;
				@apply sm:text-lg font-medium;

				div:nth-child(1) {
					a {
						@apply text-blue-600 text-base;
					}
				}

				div:nth-child(2) {
					span {
						@apply text-green-600;
					}
				}
			}
		}
	}
</style>

