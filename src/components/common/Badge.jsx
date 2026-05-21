// src/components/common/Badge.jsx
import { cn } from '../../utils/helpers'

const colors = {
  indigo:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  green:   'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  amber:   'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300',
  red:     'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
  slate:   'bg-slate-100  text-slate-600  dark:bg-slate-800     dark:text-slate-300',
}

export default function Badge({ children, color = 'slate', className }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      colors[color], className
    )}>
      {children}
    </span>
  )
}
