import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { listAllCategories, searchMealsByCategories, searchAllMeals } from '../api/mealApi'
import type { Meal } from '../types/meal'

function GalleryPage() {
  const location = useLocation()
  const savedState = location.state as {
    selectedCategories?: string[]
  } | null

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(savedState?.selectedCategories ?? [])
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCategories() {
      try {
        const results = await listAllCategories()
        setCategories(results)
      } catch {
        setError('Failed to load categories.')
      }
    }

    loadCategories()
  }, [])

  useEffect(()=>{
    async function loadMeals() {
      try{
        setLoading(true)
        setError('')

        if (selectedCategories.length === 0) {
          const results = await searchAllMeals()
          setMeals(results)
        }
        else {
          const results = await searchMealsByCategories(selectedCategories)
          setMeals(results)
        }
      } catch {
        setError('Failed to load meals.')
      } finally {
        setLoading(false)
      }
    }

    loadMeals()
  }, [selectedCategories])

  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter(
          (selectedCategory) => selectedCategory !== category
        )
      )
    } else {
      setSelectedCategories([
        ...selectedCategories,
        category,
      ])
    }
  }

  return (
    <main>
      <section className="categoryGrid">
        {categories.map((category) => (
          <button key={category} //key because map needs to know which button is this
            className={selectedCategories.includes(category)? 'categoryButton active':'categoryButton'} 
            onClick={()=>toggleCategory(category)}>
            {category}
          </button>
        ))}
      </section>

      {loading && <p className="message">Loading...</p>}

      {error && <p className="message">{error}</p>}

      <section className="mealGrid">
        {meals.map((meal, index) => (
          <Link
            key={meal.idMeal}
            to={`/meal/${meal.idMeal}`}
            state={{
              mealIds: meals.map((item) => item.idMeal),
              currentIndex: index,
              from: '/gallery',
              selectedCategories: selectedCategories,
            }}
            className="mealCardLink"
          >
            <article className="mealCard">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />

              <h2>{meal.strMeal}</h2>
            </article>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default GalleryPage