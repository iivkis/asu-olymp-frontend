<template>
	<div class="auth_wrap">
		<form class="form">
			<logo class="pb-3" />
			<!-- SIGN IN -->
			<div v-if="type == 'sign in'">
				<div class="form__row">
					<input
						type="text"
						name="email"
						placeholder="Е-мейл"
						required
						v-model="email"
					/>
				</div>
				<div class="form__row">
					<input
						type="password"
						name="password"
						placeholder="Пароль"
						required
						v-model="password"
					/>
				</div>
				<div class="form__row">
					<button class="btn-red w-full" @click.prevent="signIn">
						Вход
					</button>
				</div>
				<div class="form__row cursor-pointer" @click="toggleForm">
					Еще нет аккаунта?
					<span class="text-blue-500 px-1">Регистрируйся!</span>
				</div>
			</div>
			<!-- /SIGN IN -->

			<!-- SIGN UP -->
			<div v-else-if="type == 'sign up'">
				<div class="form__row">
					<input
						type="text"
						name="name"
						placeholder="Ф.И.О."
						required
						v-model="full_name"
					/>
				</div>
				<div class="form__row">
					<input
						type="text"
						name="email"
						placeholder="Е-мейл"
						required
						v-model="email"
					/>
				</div>
				<div class="form__row">
					<input
						type="password"
						name="password"
						placeholder="Пароль"
						required
						v-model="password"
					/>
				</div>
				<div class="form__row">
					<button class="btn-red w-full" @click.prevent="signUp">
						Зарегистрироваться
					</button>
				</div>
				<div class="form__row cursor-pointer" @click="toggleForm">
					Уже есть аккаунт?
					<span class="text-blue-500 px-1">Авторизируйся!</span>
				</div>
			</div>
			<!-- /SIGN UP -->
		</form>
	</div>
</template>

<script>
	import client from "../client";
	import Logo from "../components/Logo.vue";

	export default {
		name: "Auth",
		components: { Logo },
		data() {
			return {
				type: "sign in",
				full_name: "",
				email: "",
				password: "",
			};
		},

		methods: {
			toggleForm() {
				if (this.$data.type === "sign in") this.$data.type = "sign up";
				else this.$data.type = "sign in";
			},

			async signIn() {
				if (this.$data.email == "" || this.$data.password == "") {
					this.$store.dispatch("NotifyErr", {
						text: "Все поля должны быть заполнены!",
					});
					return;
				}

				try {
					const { data } = await client({
						url: "/signIn",
						method: "post",
						data: {
							email: this.$data.email,
							password: this.$data.password,
						},
						withCredentials: true,
					});

					this.$store.dispatch("SetApiKey", { token: data.data.token });
					this.$store.dispatch("NotifyInfo", {
						text: "Авторизация прошла успешно",
					});
					this.$router.push({ name: "home" });
				} catch (e) {
					switch (e.response.data.data.code) {
						case 2:
							this.$store.dispatch("NotifyErr", {
								text: "Неверный е-мейл или пароль. Пожалуйста, убедитесь в коррекности введенных данных.",
							});
							break;
						default:
							this.$store.dispatch("NotifyErr", {
								text: e.response.data.data.description,
							});
					}
				}
			},

			async signUp() {
				if (
					this.$data.full_name == "" ||
					this.$data.email == "" ||
					this.$data.password == ""
				) {
					return this.$store.dispatch("NotifyErr", {
						text: "Все поля должны быть заполнены!",
					});
				}

				try {
					await client({
						url: "/signUp",
						method: "post",
						data: {
							email: this.$data.email,
							full_name: this.$data.full_name,
							password: this.$data.password,
						},
					});
					this.$store.dispatch("NotifyInfo", {
						text: "Ура! Регситрация на нашем сервисе прошла успешно, теперь вам доступен весь наш функционал",
					});
				} catch (e) {
					switch (e.response.data.data.code) {
						case 2:
							this.$store.dispatch("NotifyErr", {
								text: "Пожалуйста, убедитесь в коррекности введенных данных",
							});
							break;
						case 3:
							this.$store.dispatch("NotifyErr", {
								text: "Упс.. такой email уже зарегистрирован",
							});
							break;
						default:
							this.$store.dispatch("NotifyErr", {
								text: e.response.data.data.description,
							});
					}
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	.auth_wrap {
		@apply w-full flex justify-center mt-36;
	}

	.form {
		@apply flex flex-col items-center bg-white p-6 rounded-md shadow-sm;

		&__row {
			@apply w-full py-3 flex justify-center;
		}

		input {
			@apply p-3 w-80 text-xl;
			@apply bg-slate-100;
		}
	}
</style>