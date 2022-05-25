import { createStore } from 'vuex'

function loadAnswersInputCache() {
    const livetime = 2 * 24 * 60 * 60 * 1000; //жизнь кеша 2 дня в миллисекундах
    const cache = localStorage.getItem('answers_cache') ? JSON.parse(localStorage.getItem('answers_cache')) : {}

    var edited = false;
    for (var key in cache) {
        if (Date.now() - cache[key].d >= livetime) {
            edited = true;
            delete cache[key];
        }
    }

    if (edited)
        localStorage.setItem('answers_cache', JSON.stringify(cache))

    return cache;
}

// Create a new store instance.
const store = createStore({
    state: {
        ApiKey: null,
        Notifies: [],
        AnswersInputCache: loadAnswersInputCache(),
    },
    mutations: {
        SetApiKey(state, { token }) {
            return state.ApiKey = token
        },
        PushNotify(state, { type, title, text }) {
            setTimeout(() => {
                this.state.Notifies.shift();
            }, 5000)
            return state.Notifies.push({ type, title, text })
        },
        AddToAnswersCache(state, { question_id, value, date }) {
            return state.AnswersInputCache[question_id] = { v: value, d: date };
        },
        RemoveFromAnswersCache(state, { question_id }) {
            return delete state.AnswersInputCache[question_id]
        }
    },
    actions: {
        NotifyErr({ commit }, { text }) {
            commit('PushNotify', { type: 'err', title: 'Ошибка', text })
        },
        NotifyInfo({ commit }, { text }) {
            commit('PushNotify', { type: 'info', title: 'Успех', text })
        },
        AddToAnswersCache({ commit }, { question_id, value }) {
            commit('AddToAnswersCache', { question_id, value, date: Date.now() })
            localStorage.setItem('answers_cache', JSON.stringify(this.state.AnswersInputCache))
        },
        RemoveFromAnswerCache({ commit }, { question_id }) {
            commit('RemoveFromAnswersCache', { question_id })
            localStorage.setItem('answers_cache', JSON.stringify(this.state.AnswersInputCache))
        }
    }
})

export default store;