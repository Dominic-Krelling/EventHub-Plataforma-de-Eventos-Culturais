<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const form = reactive({
    email: '',
    password: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
    errorMessage.value = ''

    if (!form.email || !form.password) {
        errorMessage.value =
            'Preencha o e-mail e a senha.'

        return
    }

    isSubmitting.value = true

    try {
        await authStore.login({
            email: form.email.trim(),
            password: form.password
        })

        console.log(
            'Perfil autenticado OK:',
            authStore.user
        )

        const redirect =
            route.query.redirect

        if (redirect) {
            router.push(redirect)
        } else {
            router.push({
                name: 'feed'
            })
        }
    } catch (error) {
        errorMessage.value =
            error.message ||
            'Não foi possível realizar o login.'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-card">

            <div class="text-center mb-4">
                <h1 class="eventhub-brand fw-bold">
                    EventHub
                </h1>

                <p class="text-muted">
                    Entre na sua conta
                </p>
            </div>

            <form
                @submit.prevent="handleSubmit"
            >

                <div class="mb-3">
                    <label for="email" class="form-label" > E-mail </label>
                    <input
                        id="email" name="email" type="email"
                        class="form-control" v-model="form.email" 
                        autocomplete="email" placeholder="seu@email.com" >
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label" > Senha </label>
                    <input id="password" name="password" type="password" class="form-control" v-model="form.password" autocomplete="current-password" placeholder="Sua senha" >
                </div>
                <div v-if="errorMessage" class="alert alert-danger" >
                    {{ errorMessage }}
                </div>
                <button type="submit" class="btn btn-eventhub w-100" :disabled="isSubmitting"> {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
                </button>
            </form>
            <div class="text-center mt-4">
                <span class="text-muted"> Ainda não possui uma conta?</span>
                <router-link to="/register" class="eventhub-brand text-decoration-none ms-1" > Criar conta</router-link>
            </div>

        </div>
    </div>
</template>