// src/shared/lib/api/use-api.ts
import { MaybeRefOrGetter, ref, Ref, toRaw, toValue } from 'vue'
import axios, {
	AxiosResponse,
	InternalAxiosRequestConfig,
	AxiosInstance,
	CancelTokenSource
} from 'axios'
import { twa } from './twa'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://nutritiontime.xyz/api'

export const api: AxiosInstance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	}
})

const isLocal = import.meta.env.VITE_USE_TWA_MOCK

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
			// Здесь можно добавить логику для обработки ошибки аутентификации
		}
		return Promise.reject(error)
	}
)

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function useApi<T, PayloadType = any>(
	method: ApiMethod,
	url: MaybeRefOrGetter<string>,
	payload?: MaybeRefOrGetter<PayloadType>
) {
	const data: Ref<T | null> = ref(null)
	const error: Ref<string | null> = ref(null)
	const loading: Ref<boolean> = ref(false)
	let cancelTokenSource: CancelTokenSource | null = null

	const execute = async (resetData = true): Promise<void> => {
		loading.value = true
		error.value = null

		if (resetData) {
			data.value = null
		}

		if (cancelTokenSource) {
			cancelTokenSource.cancel('Operation canceled by the user.')
		}

		const normalizedPayload = toRaw(toValue(payload))
		const normalizedUrl = toRaw(toValue(url))

		cancelTokenSource = axios.CancelToken.source()
		try {
			const response: AxiosResponse<T> = await api.request<T>({
				method,
				url: normalizedUrl,
				data: method !== 'get' ? normalizedPayload : undefined,
				params: method === 'get' ? normalizedPayload : undefined,
				cancelToken: cancelTokenSource.token,
			})
			data.value = response.data
		} catch (e) {
			if (axios.isCancel(e)) {
				console.log('Request canceled:', e.message)
			} else {
				error.value = e instanceof Error ? e.message : String(e)
				console.error(`API Error (${method.toUpperCase()} ${url}):`, e)
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

export default useApi
