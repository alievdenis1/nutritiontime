import { string, object, number, array, InferType, mixed } from 'yup'
import { useTranslation } from '@/shared/lib/i18n'
import Localization from './schema.localization.json'
import { useForm } from 'shared/utils/useForm.ts'

// const NUMBER_REGEX = /[0-9,.]+/g
type TranslationFn = ReturnType<typeof useTranslation<typeof Localization>>['t']

export const createRecipeIngredientsSchema = (t: TranslationFn) => object({
	id: number().required(),
	unit: string().required().oneOf(['g', 'ml', 'pcs']).default('g'),
	amount: number().required().min(1, `${t('minNumber')} - 1`).when('unit', {
		is: 'g',
		otherwise: (schema) => schema.max(10, `${t('maxNumber')} - 10`)
	}),
	name: string().required().default('')
})

export const createRecipeStepSchema = (t: TranslationFn) => object({
	description: string().required(t('required')).default(''),
	image: mixed().optional()
})

export const createRecipeKitchenwareSchema = (t: TranslationFn) => object({
	id: number().required(t('required')),
	quantity: number().required(t('required')).min(1, `${t('minNumber')} - 1`).default(1),
	name: string().required(t('required'))
})

export const createRecipeSchema = (t: TranslationFn) => object({
	image: mixed().required('Image file is required').default(null),
	title: string().required(t('required')).default('').max(255, `${t('max')} - 100`),
	description: string().required(t('required')).default('').max(500, `${t('max')} - 500`),

	category_id: number().required(t('required')).default(null).nullable(),
	cuisine_id: number().required(t('required')).default(null).nullable(),
	diet_type_id: number().required(t('required')).default(null).nullable(),

	difficulty: number().oneOf([1,2,3,4,5]).required(t('required')).default(1),
	spiciness: number().oneOf([1,2,3,4,5]).required(t('required')).default(1),

	time_in_kitchen: number().required(t('required')).default(null).nullable(),
	cooking_time: number().required(t('required')).default(null).nullable(),

	ingredients: array(createRecipeIngredientsSchema(t)).default([]),

	calories: number().nullable().default(null),
	proteins: number().nullable().default(null),
	carbohydrates: number().nullable().default(null),
	fats: number().nullable().default(null),

	steps: array().default([]),
	kitchenware: array().default([]),
	tags: array(number().required()).default([])
})

export type CreateBaseRecipeModel = InferType<ReturnType<typeof createRecipeSchema>>
export type CreateRecipeIngredientModel = InferType<ReturnType<typeof createRecipeIngredientsSchema>>
export type CreateRecipeKitchenwareModel = InferType<ReturnType<typeof createRecipeKitchenwareSchema>>
export type CreateRecipeStepModel = InferType<ReturnType<typeof createRecipeStepSchema>>

export const useBaseRecipeCreationValidation = (defaultValues: CreateBaseRecipeModel) => {
	const { t } = useTranslation(Localization)

	return useForm(
		createRecipeSchema(t),
		{
			defaultValues
		},
	)
}

export const useIngredientCreationValidation = () => {
	const { t } = useTranslation(Localization)

	return useForm(
		createRecipeIngredientsSchema(t),
		{
			defaultValues: {
				id: null,
				amount: undefined,
				unit: 'g',
				name: ''
			}
		}
	)
}

export const useKitchenwareCreationValidation = () => {
	const { t } = useTranslation(Localization)

	return useForm(
		createRecipeKitchenwareSchema(t),
		{
			defaultValues: {
				id: null,
				name: '',
				quantity: 1
			}
		}
	)
}
