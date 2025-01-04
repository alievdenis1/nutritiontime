import type { DietType } from './dietType.ts'
import { ref } from 'vue'
import { getDietTypeList } from '../api'

export const useDietTypeList = () => {
 const dietTypeList = ref<DietType[]>([])

 const isLoadingDietTypes = ref(false)

 const loadDietTypeList = async () => {
  isLoadingDietTypes.value = true
  const { execute, data } = getDietTypeList()
  await execute()
  if (data.value) {
   dietTypeList.value = data.value
  }
  isLoadingDietTypes.value = false
 }

 return {
  dietTypeList,
  isLoadingDietTypes,
  loadDietTypeList,
 }
}
