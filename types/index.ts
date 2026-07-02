export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: ProductCategory
  featured?: boolean
  tags?: string[]
}

export type ProductCategory =
  | 'ensaladas'
  | 'jugos'
  | 'licuados'
  | 'yogurt'
  | 'snacks'
  | 'smoothies'

export interface CategoryInfo {
  id: ProductCategory
  label: string
  emoji: string
  description: string
}

export interface Benefit {
  id: string
  icon: string
  title: string
  description: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
}

export interface BusinessInfo {
  name: string
  tagline: string
  phone: string
  whatsapp: string
  email: string
  address: string
  city: string
  schedule: ScheduleDay[]
  socialMedia: SocialMedia
}

export interface ScheduleDay {
  days: string
  hours: string
}

export interface SocialMedia {
  instagram?: string
  facebook?: string
  tiktok?: string
}

export interface NavItem {
  label: string
  href: string
}

export interface SaladSize {
  id: string
  label: string
  price: number
  maxToppings: number
}

export interface SaladSpecialTopping {
  id: string
  label: string
  price: number
}
