import axios from 'axios'
import type { Meal } from '../types/meal'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

interface SearchMealsResponse {
  meals: Meal[] | null
}

interface CategoryListResponse {
  meals: {strCategory: string}[] | null
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const response = await axios.get<SearchMealsResponse>(
    `${BASE_URL}/search.php?s=${query}`
  )

  return response.data.meals ?? []
}

export async function getMealById(id: string): Promise<Meal | null> {
  const response = await axios.get<SearchMealsResponse>(
    `${BASE_URL}/lookup.php?i=${id}`
  )

  return response.data.meals?.[0] ?? null //? means only get [0] when meals is not null/undefined
}

export async function listAllCategories(): Promise<string[]> {
  const response = await axios.get<CategoryListResponse>(
    `${BASE_URL}/list.php?c=list`
  )

  return response.data.meals?.map((item) => item.strCategory) ?? []
}

export async function searchMealsByCategories(categories: string[]): Promise<Meal[]> {
  const responses = await Promise.all(
    categories.map((category) => axios.get<SearchMealsResponse>(
    `${BASE_URL}/filter.php?c=${category}`))
  )

  const allMeals = responses.flatMap(
    (response) => response.data.meals ?? []
  )

  const uniqueMeals = Array.from(
    new Map(allMeals.map((meal) => [meal.idMeal, meal])).values() // delete duplicate
  )

  return uniqueMeals
}

export async function searchAllMeals(): Promise<Meal[]> {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

  const responses = await Promise.all(
    letters.map((letter) =>
      axios.get<SearchMealsResponse>(
        `${BASE_URL}/search.php?f=${letter}`
      )
    )
  )

  const allMeals = responses.flatMap(
    (response) => response.data.meals ?? []
  )

  const uniqueMeals = Array.from(
    new Map(allMeals.map((meal) => [meal.idMeal, meal])).values() // delete duplicate
  )

  return uniqueMeals
}