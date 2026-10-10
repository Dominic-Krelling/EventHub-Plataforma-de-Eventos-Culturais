
import api from './api'

export async function createEvent(formData, onProgress) {
    return api.post('/events', formData, {
        onUploadProgress: (progressEvent) => {
            if (typeof onProgress === 'function') {
                onProgress(progressEvent)
            }
        }
    })
}

export async function getEvents() {
    return api.get('/events')
}

export async function getEventById(id) {
    return api.get(`/events/${id}`)
}
