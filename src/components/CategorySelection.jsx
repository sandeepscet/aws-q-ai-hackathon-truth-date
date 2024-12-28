import Card from './Card'
import { categories } from '../data/categories'

const CategorySelection = ({ onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="w-full text-left focus:outline-none"
        >
          <div className={`game-card cursor-pointer transform transition hover:scale-105 active:scale-95`}>
            <div className={`p-6 ${category.color} text-white`}>
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm opacity-90">{category.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default CategorySelection
