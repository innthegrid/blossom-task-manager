import { 
  Tag, Sprout, Book, Briefcase, Home, ShoppingCart, 
  Dumbbell, Palette, Music, Plane, GraduationCap,
  Laptop, Phone, Coffee, Utensils, Heart,
  PawPrint, Target, Calendar, Star, Leaf 
} from 'lucide-react'

export const ICON_MAP = {
  Sprout, Book, Briefcase, Home, ShoppingCart,
  Dumbbell, Palette, Music, Plane, GraduationCap,
  Laptop, Phone, Coffee, Utensils, Heart,
  PawPrint, Target, Calendar, Star, Leaf
}

const CategoryIcon = ({ name, className = "w-4 h-4" }) => {
  const LucideIcon = ICON_MAP[name] || Tag
  return <LucideIcon className={className} />
}

export default CategoryIcon