import { ElMessage } from 'element-plus'
import { type UseFetchOptions, useFetch } from 'nuxt/app'
import { ACCESS_TOKEN_KEY } from './config'
import { useTranslation } from '../i18n'
import Localization from './api.localization.json'
import type { ResponseDto } from './types'
// import { UnauthenticatedError } from './config'
import { computed } from 'vue'
import { useSessionStore } from 'entities/Session'

/**
 * Дженерики необязательны
 * ResponseT - тип ответа сервера (то что приходит в response.data).
 * MappedResponseT - результат функции transform. Тип ответа будет результатом выполнения transform,
 * 	применится автоматически.
 *
 *
 * 	Когда юзается transform - не надо прокидывать generic!!!
 * */

export function useApi<ResponseT, MappedResponseT = ResponseT>({
  url,
  options,
  auth = false,
}: {
  url: (() => string) | string;
  options?: UseFetchOptions<ResponseDto<ResponseT>, MappedResponseT>;
  auth?: boolean;
}) {
  const { t } = useTranslation(Localization)
  const urlPath = computed<string>(() => {
    const windowLocationOrigin = process.client ? window.location.origin : null
    const urlPath = typeof url === 'function' ? url() : url
    return windowLocationOrigin + urlPath
  })

  return useFetch(urlPath, {
    ...options,
    onRequest({ options }): void {
      if (!auth) {
        const token = process.client
          ? localStorage.getItem(ACCESS_TOKEN_KEY)
          : null
        options.headers = {
          authorization: `Bearer ${token}`,
          ...options.headers,
        }

        options.headers = { ...options.headers, accept: 'application/json' }
      }
    },
    onResponse({ response }) {
      if (response.ok) {
        console.log(response._data.message)
        if (response._data.message != 'OK') {
          ElMessage.success(response._data.message)
        }
      }
    },
    onResponseError({ response }) {
      const responseErrorMessage = response._data?.messageError?.error

      const nativeMessages: Record<number, string> = {
        401: t('authError'),
        404: t('pageNotFound'),
        500: t('serverError'),
      }

      const responseError = {
        message: nativeMessages[response.status],
      }

      const unknownError = t('unknownError')

      if (typeof responseError.message === 'undefined') {
        if (responseErrorMessage) responseError.message = responseErrorMessage
        else responseError.message = unknownError + `: ${response.status}`
      }

      ElMessage.error({ message: responseError.message })

      switch (response.status) {
        case 401: {
          // throw new UnauthenticatedError('Вы не авторизованы')
          //временное решение, разобраться почему не работает  throw new
          const sessionStore = useSessionStore()
          sessionStore.setAuthorized(false)
          window.location.href = '/'
        }
      }
    },
  })
}
