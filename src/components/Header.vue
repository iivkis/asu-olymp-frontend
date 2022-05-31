<template>
	<div class="header">
		<div class="header_wrap">
			<div class="header__logo">
				<router-link to="/">
					<logo />
				</router-link>
			</div>
			<div class="header__dropdown" v-show="$store.state.ApiKey">
				<div
					class="header_dropdown__avatar"
					@click="showDropdown = !showDropdown"
				>
					<img :src="StudentAvanarPNG" alt="" />
				</div>
				<div
					class="header_dropdown__list"
					v-show="showDropdown"
					@mouseleave="showDropdown = false"
					@click="showDropdown = false"
				>
					<ul>
						<li>
							<router-link to="/profile">
								<i class="bi bi-person-circle"></i> Мой профиль
							</router-link>
						</li>
						<li v-show="$store.state.ApiKey">
							<router-link to="/editor/0">
								<i class="bi bi-pen"></i> Редактор
							</router-link>
						</li>
						<hr />
						<li>
							<router-link to="/" @click="BtnLogOut">
								<i class="bi bi-box-arrow-left"></i> Выход
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Logo from "../components/Logo.vue";
	import StudentAvanarPNG from "../assets/student_avatar.png";
	import client from "../client";

	export default {
		name: "Header",
		components: { Logo },
		data() {
			return {
				StudentAvanarPNG,
				showDropdown: false,
			};
		},
		methods: {
			async BtnLogOut() {
				try {
					await client({
						url: "/cookie",
						method: "delete",
						withCredentials: true,
					});
				} catch (e) {
					console.log(e);
				}
				this.$store.dispatch("RemoveApiKey");
			},
		},
	};
</script>

<style scoped lang="scss">
	.header {
		@apply flex justify-center;
		@apply w-full bg-white shadow-md;

		.header_wrap {
			@apply flex justify-between;
			@apply w-screen md:w-4/5 lg:w-1/2 p-2;
		}

		&__logo {
			@apply flex items-center;
		}

		&__dropdown {
			@apply relative;
		}

		.header_dropdown {
			&__avatar {
				@apply border-2 border-red-500 rounded-full overflow-hidden shadow-md;
				@apply w-9 cursor-pointer;
				img {
					width: 100%;
				}
			}

			&__list {
				@apply bg-white right-0 mt-3 overflow-hidden;
				@apply shadow-2xl rounded-md absolute;

				a {
					@apply w-full basis-full hover:bg-slate-100 px-5 py-2 block;
					@apply inline-flex whitespace-nowrap;
					i {
						@apply pr-2;
					}
				}
			}
		}
	}
</style>