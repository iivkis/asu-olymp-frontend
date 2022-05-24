<template>
	<div class="auth_wrap">
		<form class="form">
			<h2 class="pb-4 text-4xl text-gray-600 font-medium">
				&lt;АГУ OLYMP/&gt;
			</h2>
			<div v-if="type == 'sign in'">
				<div class="form__row">
					<input
						type="text"
						name="email"
						placeholder="Е-мейл"
						v-model="email"
					/>
				</div>
				<div class="form__row">
					<input
						type="password"
						name="password"
						placeholder="Пароль"
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
					<span class="text-red-500 px-1">Регистрируйся!</span>
				</div>
			</div>

			<!-- регистрация -->
			<div v-else-if="type == 'sign up'">
				<div class="form__row">
					<input
						type="text"
						name="name"
						placeholder="Ф.И.О."
						v-model="name"
					/>
				</div>
				<div class="form__row">
					<input
						type="text"
						name="email"
						placeholder="Е-мейл"
						v-model="email"
					/>
				</div>
				<div class="form__row">
					<input
						type="password"
						name="password"
						placeholder="Пароль"
						v-model="password"
					/>
				</div>
				<div class="form__row">
					<button class="btn-red w-full" @click.prevent>
						Зарегистрироваться
					</button>
				</div>
				<div class="form__row cursor-pointer" @click="toggleForm">
					Уже есть аккаунт?
					<span class="text-red-500 px-1">Авторизируйся!</span>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	import client from "../client";

	export default {
		name: "Auth",
		data() {
			return {
				type: "sign in",
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
				try {
					var s = await (
						await client
					).apis.auth.SignIn({
						body: {
							email: this.$data.email,
							password: this.$data.password,
						},
					});
				} catch (e) {
					console.log(e.response.body.data.code);
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