
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// Interceptador de requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('eventhub_token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Uploads devem ser enviados como FormData,
        // sem converter o arquivo em JSON.
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

// Interceptador de respostas
api.interceptors.response.use(
    (response) => {
        return response.data
    },

    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('eventhub_token')
                localStorage.removeItem('eventhub_user')

                if (window.location.pathname !== '/login') {
                    const currentPath =
                        window.location.pathname +
                        window.location.search

                    window.location.href =
                        `/login?redirect=${encodeURIComponent(currentPath)}`
                }
            }

            const apiError = error.response.data || {}

            return Promise.reject({
                message:
                    apiError.message ||
                    'Ocorreu um erro na requisição.',

                errors: apiError.errors || [],
                status: error.response.status
            })
        }

        if (error.request) {
            return Promise.reject({
                message:
                    'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente.',

                errors: [],
                status: null
            })
        }

        return Promise.reject({
            message:
                'Erro inesperado ao preparar a requisição.',

            errors: [],
            status: null
        })
    }
)

export default api
