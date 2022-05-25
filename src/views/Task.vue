<template>
	<Header />
	<div class="task_wrap">
		<div class="task_block">
			<div class="task_block__title">
				<h2>{{ task.title }}</h2>
			</div>
			<div class="task_block__content">
				<p>{{ task.content }}</p>
			</div>
			<div class="task_block__footer">
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
		<hr />
		<div class="questions_block">
			<div
				class="question"
				v-for="(question, index) in questions"
				:key="index"
			>
				<div class="question__text">{{ question.text }}</div>
				<div class="question__input">
					<input
						type="text"
						placeholder="Ваш ответ"
						v-model.lazy.trim="question.input"
						@change="CacheAnswers"
					/>
				</div>
			</div>
		</div>
		<div class="task_footer">
			<button class="btn-blue p-3 w-full" @click="BtnCheck">
				Проверить
			</button>
		</div>
	</div>
</template>

<script>
	import client from "../client";
	import Header from "../components/Header.vue";

	export default {
		name: "Task",
		components: { Header },

		data() {
			return {
				task: {
					title: "loading...",
					content: "loading...",
					author_name: "loading...",
					author_id: 0,
					solutions_count: 0,
				},

				questions: [{ id: 0, text: "loading...", input: "" }],
			};
		},

		async mounted() {
			await this.LoadTask();
			await this.LoadQuestions();

			for (let i = 0; i < this.$data.questions.length; i++) {
				let question = this.$data.questions[i];
				let val = this.$store.state.AnswersInputCache[question.id]?.v;
				if (val) this.$data.questions[i].input = val;
			}
		},

		methods: {
			async LoadTask() {
				const { apis } = await client;
				try {
					const { body } = await apis.tasks.GetOneTask({
						id: this.$route.params.id,
					});
					this.$data.task = body.data;
				} catch (e) {
					switch (e.response.body.data.code) {
						case 1:
							this.$store.dispatch("NotifyErr", {
								text: "Увы, задача не найдена",
							});
							this.$router.push({ name: "home" });
							break;
						default:
							this.$store.dispatch("NotifyErr", {
								text: e.response.body.data.description,
							});
					}
				}
			},

			async LoadQuestions() {
				const { apis } = await client;
				try {
					const { body } = await apis.questions.GetQuestions({
						task_id: this.$route.params.id,
					});
					this.$data.questions = body.data;
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.body.data.description,
					});
				}
			},

			async BtnCheck() {
				this.ClearCacheAnswers();
			},

			async CacheAnswers() {
				this.$data.questions.forEach((el) => {
					if (!el.input)
						this.$store.dispatch("RemoveFromAnswerCache", {
							question_id: el.id,
						});
					else
						this.$store.dispatch("AddToAnswersCache", {
							question_id: el.id,
							value: el.input,
						});
				});
			},

			async ClearCacheAnswers() {
				this.$data.questions.forEach((el) => {
					this.$store.dispatch("RemoveFromAnswerCache", {
						question_id: el.id,
					});
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	.task_wrap {
		@apply w-3/4 lg:w-1/2 mx-auto my-10 flex justify-center flex-col;

		.task_block {
			@apply flex flex-col bg-white p-5;

			&__title {
				@apply text-2xl font-medium;
			}

			&__content {
				@apply py-4 text-lg tracking-tight;
			}

			&__footer {
				@apply flex justify-between text-lg font-medium tracking-tight;

				a {
					@apply text-blue-500 text-base;
				}

				span {
					@apply text-green-600;
				}
			}
		}

		.questions_block {
			@apply flex flex-col px-5 pt-5 bg-white;

			.question {
				@apply flex flex-wrap my-3;

				&__text {
					@apply basis-full text-xl tracking-tight;
				}

				&__input {
					@apply basis-full;

					input {
						@apply w-full text-lg tracking-tight mt-3;
						@apply bg-slate-100 p-2.5 border-2 focus:outline-blue-400;
					}
				}
			}
		}

		.task_footer {
			@apply flex justify-center bg-white p-5;
		}
	}
</style>