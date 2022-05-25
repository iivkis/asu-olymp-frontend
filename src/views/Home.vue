<template>
	<Header />
	<div class="flex justify-center">
		<div class="tasks_list">
			<div class="list__item" v-for="(task, index) in tasks" :key="index">
				<router-link :to="`/tasks/${task.id}`">
					<div class="list_item__title">
						<h4>
							{{ task.title }}
						</h4>
					</div>
					<div class="list_item__content">
						<p>
							{{ task.content }}
						</p>
					</div>
				</router-link>
				<div class="list_item__footer">
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
	</div>
</template>

<script>
	import client from "../client";
	import Header from "../components/Header.vue";

	export default {
		name: "Tasks",
		components: { Header },
		data() {
			return {
				tasks: [
					{
						title: "",
						content: "Hi",
						author_id: 0,
						author_name: "",
						solutions_count: 0,
					},
				],
			};
		},

		mounted() {
			client.then(({ apis }) => {
				apis.tasks.GetTasks().then((res) => {
					this.$data.tasks = res.body.data;
				});
			});
		},
	};
</script>

<style scoped lang="scss">
	.tasks_list {
		@apply flex flex-wrap py-2;
		@apply w-full md:w-4/5 lg:w-1/2;

		.list__item {
			@apply w-full p-5 my-2.5;
			@apply shadow-md transition-shadow bg-white rounded;
			@apply hover:shadow-xl;
		}

		.list_item {
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

