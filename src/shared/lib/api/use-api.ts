import { ref, Ref } from 'vue'
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
  CancelTokenSource
} from 'axios'
import { twa } from './twa'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://nutritiontime.xyz/'

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const isLocal = import.meta.env.VITE_USE_TWA_MOCK === 'true'

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token')
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (twa && config.headers) {
    config.headers['Telegram-Init-Data'] = twa.initData
  }

  if (isLocal) {
    config.headers['Env-Mode'] = 'dev'
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Authentication error')
      // Здесь можно добавить логику для выхода пользователя или перенаправления на страницу входа
    }
    return Promise.reject(error)
  }
)

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function useApi<T>(method: ApiMethod, url: string, payload?: any) {
  const data: Ref<T | null> = ref(null)
  const error: Ref<string | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  let cancelTokenSource: CancelTokenSource | null = null

  const execute = async (): Promise<void> => {
    loading.value = true
    error.value = null
    data.value = null
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by the user.')
    }
    cancelTokenSource = axios.CancelToken.source()

    try {
      const response: AxiosResponse<T> = await api[method](
        url,
        method === 'get' ? { params: payload, cancelToken: cancelTokenSource.token } : payload,
        method !== 'get' ? { cancelToken: cancelTokenSource.token } : undefined
      )
      data.value = response.data
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('Request canceled:', e.message)
      } else {
        error.value = e instanceof Error ? e.message : String(e)
        console.error(`API Error (${method} ${url}):`, e)
      }
    } finally {
      loading.value = false
    }
  }

  const cancel = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by the user.')
    }
  }

  return { data, error, loading, execute, cancel }
}

export const apiInstance = api

export default useApi