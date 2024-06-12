import Localization from './localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { computed } from 'vue'
import { UserGenderEnum } from '../../config'

export type UserGenderOption = {
    label: string,
<<<<<<< HEAD
    value:   UserGenderEnum
=======
    value: UserGenderEnum
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
}

export const useUserGenderEnum = () => {
    const { t } = useTranslation(Localization)

    const userGenderNames = computed<Record<UserGenderEnum, string>>(() => {
        return {
            [UserGenderEnum.Male]: t('male'),
            [UserGenderEnum.Female]: t('female')
        }
    })

    const userGenderNamesAdjective = computed<Record<UserGenderEnum, string>>(() => {
        return {
            [UserGenderEnum.Male]: t('maleAdjective'),
            [UserGenderEnum.Female]: t('femaleAdjective')
        }
    })

    const userGenderOptions = computed<UserGenderOption[]>(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Object.entries(UserGenderEnum).map(([_, value]) => {
            if (value === UserGenderEnum.Male) return { label: t('male'), value }
            return { label: t('female'), value }
        })
    })

    return {
        userGenderNames,
        userGenderNamesAdjective,
        userGenderOptions
    }
}