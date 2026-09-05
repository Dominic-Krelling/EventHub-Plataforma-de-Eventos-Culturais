<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../services/authServices'

const router = useRouter()

const form = reactive({
    email: '',
    password: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
    errorMessage.value = ''

    if (!form.email || !form.password) {
        errorMessage.value = 'Preencha o e-mail e a senha.'
        return
    }

    isSubmitting.value = true

    try {
        const response = await login({
            email: form.email.trim(),
            password: form.password
        })

        console.log('Login realizado:', response.data)

        router.push({
            name: 'feed'
        })
    } catch (error) {
        errorMessage.value =
            error.message || 'Não foi possível realizar o login.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <h1>Entrar</h1>

        <form @submit.prevent="handleSubmit">

            <div class="field">
                <label for="email">E-mail</label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    v-model="form.email"
                    autocomplete="email"
                />
            </div>

            <div class="field">
                <label for="password">Senha</label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    v-model="form.password"
                    autocomplete="current-password"
                />
            </div>

            <p v-if="errorMessage" class="api-error">
                {{ errorMessage }}
            </p>

            <button
                type="submit"
                :disabled="isSubmitting"
            >
                {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
            </button>

        </form>

        <p>
            Ainda não possui uma conta?
            <router-link to="/register">
                Criar conta
            </router-link>
        </p>
    </div>
</template>