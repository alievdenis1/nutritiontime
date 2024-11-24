export interface ReferralUser {
 id: number;
 name: string;
 telegram_username: string | null;
 has_active_subscription: boolean;
 has_trial: boolean;
 ever_had_subscription: boolean;
 current_streak: number;
 referrals_count: number;
}

export interface Profile {
 gender: string;
 age: number;
 weight: number;
 height: number;
 activity_level: string;
 activity_type: string;
 base_calories: number;
 target_calories: number;
 goal: string;
 bmr_formula: string;
 macro_proteins: number;
 macro_fats: number;
 macro_carbs: number;
 body_fat_percentage: number | null;
 ideal_weight: number | null;
 bmi: number | null;
 bmr: number | null;
 last_updated: string;
 diet_type: string;
 recommended_steps: number;
 water_intake: number;
 server_datetime: string;
}

export interface User {
 id: number;
 name: string;
 telegram_id: number;
 telegram_username: string | null;
 email: string;
 role: string;
 wallet_address: string;
 balance: string;
 created_at: string;
 diary_streak: number;
 is_trial: boolean;
 subscription_days_left: number;
 referrer: ReferralUser | null;
 referrals: ReferralUser[];
}

export interface ProfileResponse {
 user: User;
 profile: Profile;
}
export interface Meal {
 id: number;
 dish_name: string;
 weight: number;
 calories: number;
 proteins: number;
 fats: number;
 carbs: number;
 created_at: string;
}

export interface MealTotals {
 calories: number;
 proteins: number;
 fats: number;
 carbs: number;
 total_weight: number;
}

export interface MealDay {
 meals: Meal[];
 totals: MealTotals;
}

export interface MealsResponse {
 [date: string]: MealDay;
}

export interface MealItem {
 id: number
 dish_name: string
 weight: number
 calories: number
 proteins: number
 fats: number
 carbs: number
 created_at: string
}

// Статистика за день
export interface DayStats {
 date: string
 total_calories: string
 total_proteins: string
 total_fats: string
 total_carbs: string
 total_weight: string
 meals_count: number
 meals: MealItem[] // Добавляем список блюд
}

// Обновленный ответ API статистики
export interface MealStats {
 daily_stats: DayStats[]
 filled_dates: string[]
}

export interface Notification {
 id: number;
 type: string;
 scheduled_for: string;
 message_text: string;
 sent_at: string | null;
 created_at: string;
}

export interface ChartData {
 id?: number
 date: string
 value: number
}

export interface MacrosData {
 proteins: ChartData[]
 fats: ChartData[]
 carbs: ChartData[]
}

export interface ChartsData {
 calories: ChartData[]
 macros: MacrosData
 weight: ChartData[]
}

export interface StatisticsResponse {
 period: {
  start: string
  end: string
 }
 summary: {
  total_meals: number
  days_tracked: number
  average_meals_per_day: number
 }
 averages: {
  calories: number
  proteins: number
  fats: number
  carbs: number
 }
 charts: {
  calories: ChartData[]
  macros: {
   proteins: ChartData[]
   fats: ChartData[]
   carbs: ChartData[]
  }
  weight: ChartData[]
 }
 weight_progress?: {
  start: number
  current: number
  change: number
 } | null
 goals_achievement?: {
  logging_consistency: number
  calories_average: number
  proteins_average: number
  fats_average: number
  carbs_average: number
 } | null
}