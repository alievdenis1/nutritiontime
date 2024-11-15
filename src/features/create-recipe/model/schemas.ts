import { string, object } from 'yup'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './schema.localization.json'

const { t } = useTranslation(Localization)
const NUMBER_REGEX = /[0-9,.]+/g

export const createRecipeBasicInfoSchema = object({
    title: string().required(t('required')).default('').max(100, `${t('max')} - 100`),
    description: string().required(t('required')).default('').max(500, `${t('max')} - 500`),
    image: string().default(''),
    dishCategory: string().required(t('required')).default(''),
    cuisine: string().required(t('required')).default(''),
    diet: string().required(t('required')).default(''),
})

export const createRecipeIngredients = object({
    title: string().default('').max(100, `${t('max')} - 100`),
    quantity: string().default('').optional().matches(NUMBER_REGEX, t('number')).max(10, `${t('max')} - 10`)
})