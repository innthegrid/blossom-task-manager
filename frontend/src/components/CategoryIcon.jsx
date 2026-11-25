import { Tag } from 'lucide-react'
import { ICON_MAP } from './categoryIcons'

const CategoryIcon = ({ name, className = "w-4 h-4" }) => {
  const LucideIcon = ICON_MAP[name] || Tag
  return <LucideIcon className={className} />
}

export default CategoryIcon
