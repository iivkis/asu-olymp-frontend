<template>
	<Header />
	<div class="content_wrap">
		<div v-if="!$store.state.ApiKey">
			<banner-auth />
		</div>

		<div class="task_wrap">
			<div class="task_block">
				<div class="task_block__title">
					<h2>{{ task.title }}</h2>
				</div>
				<div class="task_block__content">
					<pre>{{ task.content }}</pre>
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
					v-for="(question, index) in questions"
					class="question"
					:class="
						question.isCorrect
							? `question-${question.isCorrect}`
							: ''
					"
					:key="index"
				>
					<div class="question__text">
						<pre>{{ question.text }}</pre>
					</div>
					<div class="question__input">
						<input
							:disabled="disableInputs"
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
	</div>
</template>

<script>
	import Header from "../components/Header.vue";
	import BannerAuth from "../components/BannerAuth.vue";
	import client from "../client";

	export default {
		name: "Task",
		components: { Header, BannerAuth },

		data() {
			return {
				disableInputs: false,

				task: {
					title: "loading...",
					content: "loading...",
					author_name: "loading...",
					author_id: 0,
					solutions_count: 0,
				},

				questions: [
					{ id: 0, text: "loading...", input: "", isCorrect: "" },
				],
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
				// const { apis } = await this.$store.state.Client;
				try {
					const { data } = await client({
						url: `/t/tasks/${this.$route.params.id}`,
						methods: "get",
					});
					this.$data.task = data.data;
				} catch (e) {
					switch (e.response.data.data.code) {
						case 1:
							this.$store.dispatch("NotifyErr", {
								text: "Увы, задача не найдена",
							});
							this.$router.push({ name: "home" });
							break;
						default:
							this.$store.dispatch("NotifyErr", {
								text: e.response.data.data.description,
							});
					}
				}
			},

			async LoadQuestions() {
				try {
					const { data } = await client({
						url: "/t/questions",
						params: {
							task_id: this.$route.params.id,
						},
					});
					this.$data.questions = data.data;
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
				}
			},

			async BtnCheck() {
				let answers = [];

				this.$data.questions.forEach((question) => {
					answers.push({
						question_id: question.id,
						value: question.input,
					});
				});

				let dt;
				try {
					let { data } = await client({
						url: "/t/check",
						method: "post",
						data: {
							task_id: Number(this.$route.params.id),
							answers,
						},
					});
					dt = data.data;
					this.ClearCacheAnswers();
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
					return;
				}

				this.$data.disableInputs = true;
				this.$data.questions.forEach((question) => {
					if (dt.show_correct) {
						question.isCorrect = String(dt.results[question.id]);
					} else {
						question.isCorrect = "checked";
					}
				});
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
		.task_block {
			@apply flex flex-col bg-white p-5 mt-5;

			&__title {
				@apply text-2xl font-medium;
			}

			&__content {
				@apply py-4 text-lg whitespace-pre-wrap;
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
			@apply flex flex-col bg-white;

			.question {
				@apply flex flex-wrap py-4 px-5 border-x-4 border-transparent;

				&__text {
					pre {
						@apply basis-full text-xl whitespace-pre-wrap;
					}
				}

				&__input {
					@apply basis-full;

					input {
						@apply w-full text-lg tracking-tight mt-3;
						@apply bg-slate-100 p-2.5 border-2 focus:outline-blue-400;
					}
				}

				&-true {
					@apply bg-green-200 border-green-400;
					input {
						@apply bg-white border-transparent;
					}
				}

				&-false {
					@apply bg-red-200 border-red-400;
					input {
						@apply bg-white border-transparent;
					}
				}

				&-checked {
					@apply bg-slate-200 border-slate-400;
					input {
						@apply bg-white border-transparent;
					}
				}
			}
		}

		.task_footer {
			@apply flex justify-center bg-white p-5;
		}
	}
</style>