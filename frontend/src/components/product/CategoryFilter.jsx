import { cn } from '../../utils/cn'
import { titleCase } from '../../utils/helpers'

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap',
            active === cat
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          )}
        >
          {cat === 'all' ? 'All Products' : titleCase(cat)}
        </button>
      ))}
    </div>
  )
}
