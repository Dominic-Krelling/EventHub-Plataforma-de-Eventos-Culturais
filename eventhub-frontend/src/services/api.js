import axios from 'axios'
import router from '../router'
import { MESSAGES, STORAGE_KEYS } from '../config/constants'
import { useToast } from '../composables/useToast'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        if (config.data instanceof FormData) {
            config.headers.setContentType(undefined)
        } else {
            config.headers.setContentType('application/json')
        }

        return config
    },

    (error) => {
        return Promise.reject(error)
    }
)

function notifyIfNeeded(error, message) {
    const config = error.config || {}
    const status = error.response?.status ?? null
    const method = String(config.method || 'get').toLowerCase()
    const isAction = method !== 'get' && method !== 'head'

    if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)

        const current = router.currentRoute.value

        if (current.name !== 'login') {
            useToast().info('Sua sessão expirou. Entre novamente.')
            router.push({ name: 'login', query: { redirect: current.fullPath } })
        }

        return
    }

    if (isAction && !config.silent) {
        useToast().error(message)
    }
}

api.interceptors.response.use(
    (response) => {
        return response.data
    },

    (error) => {
        if (error.response) {
            const apiError = error.response.data || {}
            const message = apiError.message || MESSAGES.REQUEST_ERROR

            notifyIfNeeded(error, message)

            return Promise.reject({
                message,
                errors: apiError.errors || [],
                status: error.response.status
            })
        }

        if (error.request) {
            notifyIfNeeded(error, MESSAGES.NETWORK_ERROR)

            return Promise.reject({
                message: MESSAGES.NETWORK_ERROR,
                errors: [],
                status: null
            })
        }

        return Promise.reject({
            message: MESSAGES.UNEXPECTED_ERROR,
            errors: [],
            status: null
        })
    }
)

export default api