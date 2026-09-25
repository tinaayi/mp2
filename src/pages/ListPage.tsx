import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { searchMeals } from '../api/mealApi'
import type { Meal } from '../types/meal'

function getIngredientCount(meal: Meal) {
  let count = 0

  for (let i = 1; i <= 20; i++) {
    const key = `strIngredient${i}` as keyof Meal //keyof Meal means every component declare in Meal Interface
    const ingredient = meal[key]

    if (typeof ingredient === 'string' && ingredient.trim() !== '') {
      count++
    }
  }

  return count
}

function ListPage() {
  const location = useLocation()

  const savedState = location.state as {
    query?: string
    sortBy?: 'area' | 'ingredient' | 'count'
    sortOrder?: 'asc' | 'desc'
  } | null

  // every useState change will run ListPage again (but wont cover useState value to default)
  const [query, setQuery] = useState(savedState?.query ?? '')
  const [meals, setMeals] = useState<Meal[]>([])  // should be Meal type(define in meal.ts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState<'area' | 'ingredient' | 'count'>(savedState?.sortBy ?? 'area')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(savedState?.sortOrder ?? 'asc')

  useEffect(() => {
    async function loadMeals() {
      if (query.trim() === '') {
        setMeals([])
        return
      }

      try{
        setLoading(true)
        setError('')

        const results = await searchMeals(query)
        setMeals(results)
      } catch {
        setError('Failed to load meals.')
      } finally {
        setLoading(false)
      }
    }

    loadMeals()
  }, [query]) //when query change, implement loadMeals

  const sortedMeals = [...meals].sort((a, b) => { //...meals means copy data and sort
    let comparison = 0

    if (sortBy === 'area') {
      comparison = (a.strArea ?? '').localeCompare(b.strArea ?? '') //minus means a then b
    } //if a is null or undefined, use '', || fall back when '', 0, false, null, undefined

    if (sortBy === 'ingredient') {
      comparison = (a.strIngredient1 ?? '').localeCompare(b.strIngredient1 ?? '')
    }

    if (sortBy === 'count') {
      comparison = getIngredientCount(a) - getIngredientCount(b)
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  return (
    <main>
      <section className="listControls">
        <input type="text" placeholder="Search meals..." value={query} onChange={(event) => setQuery(event.target.value)}/>

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'area' | 'ingredient' | 'count')}>
          <option value="area">Area</option>
          <option value="ingredient">Main Ingredient</option>
          <option value="count">Ingredient Count</option>
        </select>

        <div className="sortOrderButtons">
          <button className={sortOrder === 'asc' ? 'sortButton active' : 'sortButton'} onClick={() => setSortOrder('asc')}>
            Ascending
          </button>

          <button className={sortOrder === 'desc' ? 'sortButton active' : 'sortButton'} onClick={() => setSortOrder('desc')}>
            Descending
          </button>
        </div>
      </section>

      {loading && <p className="message">Loading...</p>}

      {error && <p className="message">{error}</p>}

      {!loading && !error && query.trim() !== '' && meals.length === 0 && (
        <p className="message">No meals found.</p>
      )}

      <section className="mealList">
        {sortedMeals.map((meal, index) => (
          <Link to={`/meal/${meal.idMeal}`} 
            state={{
              mealIds: sortedMeals.map((item) => item.idMeal),
              currentIndex: index,
              from: '/list',
              query: query,
              sortBy: sortBy,
              sortOrder: sortOrder,
            }}
            className="mealListLink"
            key={meal.idMeal}
          >
            <article className="mealListItem">
              <img src={meal.strMealThumb} alt={meal.strMeal} />

              <div>
                <h2>{meal.strMeal}</h2>
                <p>Area: {meal.strArea}</p>
                <p>Main Ingredient: {meal.strIngredient1}</p>
                <p>Ingredients: {getIngredientCount(meal)}</p>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default ListPage