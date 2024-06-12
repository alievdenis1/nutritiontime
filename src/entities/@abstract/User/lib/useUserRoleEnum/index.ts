import Localization from './localization.json'
import { useTranslation } from 'shared/lib/i18n'
import { computed } from 'vue'
import { UserRoleEnum } from '../../config'

export const useUserRoleEnum = () => {
    const { t } = useTranslation(Localization)

    const userRoleNames = computed<Record<UserRoleEnum, string>>(() => {
        return {
            [UserRoleEnum.Patient]: t('patient'),
            [UserRoleEnum.Doctor]: t('doctor')
        }
    })

    return {
        userRoleNames
    }
}