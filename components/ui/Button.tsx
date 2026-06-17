'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  asChild?: boolean
  href?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-lime-400 hover:bg-lime-500 text-gray-900 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
  ghost: 'text-green-600 hover:bg-green-50',
  whatsapp:
    'bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-md hover:shadow-lg',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} role="button">
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
