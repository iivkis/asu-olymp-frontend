<template>
	<Header />
	<div class="content_wrap">
		<!-- Title -->
		<div class="editor_block">
			<div class="editor_block__title">
				<h4>Заголовок задачи</h4>
			</div>
			<div class="editor_block__input">
				<input
					type="text"
					placeholder="Решение систем уравнений методом..."
					v-model.lazy.trim="taskTitle"
				/>
			</div>
		</div>
		<!-- /Title -->

		<!-- Task text -->
		<div class="editor_block">
			<div class="editor_block__title">
				<h4>Текст задачи</h4>
			</div>
			<div class="editor_block__input">
				<textarea
					type="text"
					placeholder="Даны уравнения x + y =..."
					v-model="taskContent"
				/>
			</div>
		</div>
		<!-- Task text -->

		<!-- Questions & answers -->
		<div class="editor_block">
			<div class="editor_block__title">
				<h4>Вопросы и ответы</h4>
			</div>
			<div class="editor_block__input">
				<div v-for="(item, index) in taskQuestions" :key="index">
					<div class="flex flex-col">
						<div class="flex justify-between items-center">
							<span class="text-lg font-medium">
								Вопрос #{{ index + 1 }}:
							</span>
							<button
								class="btn-link text-sm"
								@click="BtnRemoveQuestion(index)"
							>
								удалить вопрос
							</button>
						</div>
						<textarea
							type="text"
							placeholder="Чему равен y (игрик)?"
							v-model="taskQuestions[index].question"
						/>
					</div>
					<div>
						<input
							type="text"
							placeholder="Ответ"
							v-model="taskQuestions[index].answer"
						/>
					</div>
				</div>
			</div>
			<hr />
			<div class="editor_block__footer">
				<button class="btn-link" @click="BtnAddQuestion">
					+ вопрос
				</button>
			</div>
		</div>
		<!-- Questions & answers -->

		<!-- Settings -->
		<div class="editor_block">
			<div class="editor_block__settings">
				<div>
					<input
						type="checkbox"
						id="settings-show_correct"
						v-model="settings.showCorrect"
					/>
					<label for="settings-show_correct">
						Отмечать верные ответы после отправки решения
					</label>
				</div>
				<div>
					<input
						type="checkbox"
						id="settings-isPublic"
						v-model="settings.isPublic"
					/>
					<label for="settings-isPublic"> Опубликовать </label>
				</div>
			</div>
			<hr />
			<div class="editor_block__footer">
				<button class="btn-link" @click="BtnSave">сохранить</button>
				<button class="btn-link">удалить</button>
			</div>
		</div>
		<!-- /Settings -->
	</div>
</template>

<script>
	import client from "../client";
	import Header from "../components/Header.vue";

	export default {
		name: "editor",
		components: { Header },
		data() {
			return {
				settings: {
					showCorrect: true,
					isPublic: false,
				},
				taskTitle: "",
				taskContent: "",
				taskQuestions: [{ question: "", answer: "" }],
			};
		},
		mounted() {
			if (this.$route.params.id != 0) {
				this.LoadData();
			}
		},
		methods: {
			async LoadData() {
				// load task data
				try {
					const { data } = await client({
						url: `/t/tasks/${this.$route.params.id}`,
						method: "get",
					});
					this.$data.taskTitle = data.data.title;
					this.$data.taskContent = data.data.content;

					this.$data.settings.showCorrect = data.data.show_correct;
					this.$data.settings.isPublic = data.data.is_public;
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
				}

				// load questions & answers
				try {
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
				}
			},
			BtnAddQuestion() {
				this.$data.taskQuestions.push({ question: "", answer: "" });
			},
			BtnRemoveQuestion(id) {
				console.log(id);
				this.$data.taskQuestions.splice(id, 1);
			},
			async BtnSave() {
				if (Number(this.$route.params.id) === 0)
					await this.BtnCreateAndSave();
				else await this.BtnUpdateAndSave();
			},
			async BtnUpdateAndSave() {
				try {
					await client({
						url: `/t/tasks/${this.$route.params.id}`,
						method: "put",
						data: {
							title: this.$data.taskTitle,
							content: this.$data.taskContent,
							show_correct: this.$data.settings.showCorrect,
							is_public: this.$data.settings.isPublic,
						},
					});
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
				}
			},
			async BtnCreateAndSave() {
				var taskID;

				//create task
				try {
					const { data } = await client({
						url: "/t/tasks",
						method: "post",
						data: {
							title: this.$data.taskTitle,
							content: this.$data.taskContent,
							show_correct: this.$data.settings.showCorrect,
							is_public: this.$data.settings.isPublic,
						},
					});
					taskID = data.data.id;
				} catch (e) {
					return this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
				}

				//create questions & answers
				try {
					this.$data.taskQuestions.forEach(async (item) => {
						const { data } = await client({
							url: "/t/questions",
							method: "post",
							data: {
								task_id: taskID,
								text: item.question,
							},
						});

						await client({
							url: "/t/answers",
							method: "post",
							data: {
								question_id: data.data.id,
								value: item.answer,
							},
						});
					});
				} catch (e) {
					this.$store.dispatch("NotifyErr", {
						text: e.response.data.data.description,
					});
					return;
				}

				this.$store.dispatch("NotifyInfo", {
					text: "Задача успешно создана",
				});
				this.$router.push({ name: "editor", params: { id: taskID } });
			},
		},
	};
</script>

<style scoped lang="scss">
	.editor_block {
		@apply w-full bg-white  px-5 py-4  shadow-md;
		@apply mb-1 sm:mb-7 sm:rounded-sm;

		&__title {
			@apply text-2xl font-medium tracking-tight;
		}

		&__input {
			@apply w-full my-2;

			input,
			textarea {
				@apply w-full bg-slate-100 p-3 my-1 text-lg;
				@apply focus:outline-blue-400;
			}
		}

		&__settings {
			@apply my-2;
			input {
				@apply mr-2;
			}
		}

		&__footer {
			@apply flex justify-end;
		}
	}
</style>