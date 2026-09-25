import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getMealById } from '../api/mealApi'
import type { Meal } from '../types/meal'

function DetailPage() {
  const { id } = useParams()    // get param from url
  const navigate = useNavigate()  // back to previous page
  const location = useLocation()

  const [meal, setMeal] = useState<Meal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const state = location.state as {
    mealIds?: string[]
    currentIndex?: number
    from?: string
    query?: string
    sortBy?: 'area' | 'ingredient' | 'count'
    sortOrder?: 'asc' | 'desc'
    selectedCategories?: string[]
  } | null

  useEffect(() => {
    async function loadMeal() {
      if (!id) {
        return
      }

      try {
        setLoading(true)
        setError('')

        const result = await getMealById(id)

        if (result) {
          setMeal(result)
        } else {
          setError('Meal not found.')
        }
      } catch {
        setError('Failed to load meal.')
      } finally {
        setLoading(false)
      }
    }

    loadMeal()
  }, [id])

  if (loading) {
    return <main>Loading...</main>
  }

  if (error) {
    return <main>{error}</main>
  }

  if (!meal) {
    return <main>Meal not found.</main>
  }

  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof Meal
    const measureKey = `strMeasure${i}` as keyof Meal

    const ingredient = meal[ingredientKey]
    const measure = meal[measureKey]

    if (
        typeof ingredient === 'string' &&
        ingredient.trim() !== ''
    ) {
        ingredients.push({
        ingredient,
        measure: typeof measure === 'string' ? measure : '',
        })
    }
  }

  const mealIds = state?.mealIds ?? []
  const currentIndex = state?.currentIndex ?? -1

  const previousId =
    currentIndex > 0
      ? mealIds[currentIndex - 1]
      : null

  const nextId =
    currentIndex >= 0 && currentIndex < mealIds.length - 1
      ? mealIds[currentIndex + 1]
      : null

  function goToMeal(targetId: string, targetIndex: number) {
    navigate(`/meal/${targetId}`, {
      replace: true,    //clean browser history
      state: {
        mealIds,
        currentIndex: targetIndex,
        from: state?.from,  //if state exists, use its from, else use undefined
        query: state?.query,
        sortBy: state?.sortBy,
        sortOrder: state?.sortOrder,
        selectedCategories: state?.selectedCategories
      },
    })
  }

  return (
    <main className="detailPage">
      <button className="backButton" 
      onClick={() => {
        if (state?.from === '/gallery') {
          navigate('/gallery', {state:{selectedCategories:state?.selectedCategories}})
        }
        else {
          navigate('/list', {state:{query:state?.query,sortBy:state?.sortBy,sortOrder:state?.sortOrder,}})}
        }}>
          ← Back
      </button>

      <section className="detailContent">
        <img
          className="detailImage"
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />

        <div className="detailInfo">
          <h1>{meal.strMeal}</h1>

          <p>
            <strong>Category:</strong> {meal.strCategory}
          </p>

          <p>
            <strong>Area:</strong> {meal.strArea}
          </p>

          <h2>Ingredients</h2>
          <ul className="ingredientList">
            {ingredients.map((item, index) => (
              <li key={index}>
                <span>{item.ingredient}</span>
                <span>{item.measure}</span>
              </li>
            ))}
          </ul>

          <h2>Instructions</h2>
          <p className="instructions">{meal.strInstructions}</p>
        </div>
      </section>

      <div className="detailNavigation">
        <button
          disabled={!previousId}
          onClick={() => {if (previousId) {goToMeal(previousId, currentIndex - 1)}}}
        >
          ← Previous
        </button>

        <button
            disabled={!nextId}
            onClick={() => {if (nextId) {goToMeal(nextId, currentIndex + 1)}}}
        >
          Next →
        </button>
      </div>
    </main>
  )
}

export default DetailPage