export const STORAGE_KEYS = {
  TOKEN: 'eventhub_token',
  USER: 'eventhub_user'
}

const IMAGE_MAX_MB = 5

export const LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  FULL_NAME_MAX: 100,
  BIO_MAX: 255,
  TITLE_MAX: 150,
  DESCRIPTION_MAX: 2000,
  COMMENT_MAX: 500,
  COLLECTION_TITLE_MIN: 3,
  COLLECTION_TITLE_MAX: 100,
  COLLECTION_DESCRIPTION_MAX: 500,
  IMAGE_MAX_MB,
  IMAGE_MAX_BYTES: IMAGE_MAX_MB * 1024 * 1024
}

export const SEARCH = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 100,
  DEBOUNCE_MS: 400
}

export const NOTIFICATIONS = {
  POLL_MS: 30000
}

export const NOTIFICATION_TEXT = {
  like: 'curtiu o seu evento',
  comment: 'comentou no seu evento',
  follow: 'começou a seguir você'
}

export const REPORT_REASONS = [
  { value: 'inappropriate_content', label: 'Conteúdo impróprio' },
  { value: 'harassment', label: 'Assédio ou discurso de ódio' },
  { value: 'spam', label: 'Spam ou golpes' },
  { value: 'copyright', label: 'Violação de direitos autorais' },
  { value: 'other', label: 'Outro' }
]

export const REPORT_FILTERS = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'reviewed', label: 'Revisadas' },
  { value: 'all', label: 'Todas' }
]

export const PAGE_SIZE = 12

export const TOAST_DURATION = {
  SUCCESS: 3000,
  INFO: 4000,
  ERROR: 6000
}

export const MESSAGES = {
  NETWORK_ERROR:
    'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente.',
  REQUEST_ERROR: 'Ocorreu um erro na requisição.',
  UNEXPECTED_ERROR: 'Erro inesperado ao preparar a requisição.',
  LOAD_ERROR: 'Não foi possível carregar os dados.'
}
