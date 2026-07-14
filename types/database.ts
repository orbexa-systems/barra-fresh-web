export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string
          nombre: string
          orden: number
          activo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          orden?: number
          activo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          orden?: number
          activo?: boolean
          created_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          id: string
          categoria_id: string
          nombre: string
          descripcion: string | null
          precio: number
          imagen_url: string | null
          disponible: boolean
          destacado: boolean
          orden: number
          created_at: string
        }
        Insert: {
          id?: string
          categoria_id: string
          nombre: string
          descripcion?: string | null
          precio: number
          imagen_url?: string | null
          disponible?: boolean
          destacado?: boolean
          orden?: number
          created_at?: string
        }
        Update: {
          id?: string
          categoria_id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          imagen_url?: string | null
          disponible?: boolean
          destacado?: boolean
          orden?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'productos_categoria_id_fkey'
            columns: ['categoria_id']
            isOneToOne: false
            referencedRelation: 'categorias'
            referencedColumns: ['id']
          }
        ]
      }
      tamanos_ensalada: {
        Row: {
          id: string
          nombre: string
          precio: number
          max_toppings: number
          activo: boolean
          orden: number
        }
        Insert: {
          id?: string
          nombre: string
          precio: number
          max_toppings?: number
          activo?: boolean
          orden?: number
        }
        Update: {
          id?: string
          nombre?: string
          precio?: number
          max_toppings?: number
          activo?: boolean
          orden?: number
        }
        Relationships: []
      }
      toppings: {
        Row: {
          id: string
          nombre: string
          tipo: 'base' | 'especial'
          precio_extra: number
          disponible: boolean
          orden: number
        }
        Insert: {
          id?: string
          nombre: string
          tipo: 'base' | 'especial'
          precio_extra?: number
          disponible?: boolean
          orden?: number
        }
        Update: {
          id?: string
          nombre?: string
          tipo?: 'base' | 'especial'
          precio_extra?: number
          disponible?: boolean
          orden?: number
        }
        Relationships: []
      }
      aderezos: {
        Row: {
          id: string
          nombre: string
          disponible: boolean
          orden: number
        }
        Insert: {
          id?: string
          nombre: string
          disponible?: boolean
          orden?: number
        }
        Update: {
          id?: string
          nombre?: string
          disponible?: boolean
          orden?: number
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          id: string
          origen: 'whatsapp' | 'pos'
          nombre_cliente: string | null
          estado: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'
          items: Json
          total: number
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          origen: 'whatsapp' | 'pos'
          nombre_cliente?: string | null
          estado?: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'
          items: Json
          total: number
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          origen?: 'whatsapp' | 'pos'
          nombre_cliente?: string | null
          estado?: 'pendiente' | 'confirmado' | 'entregado' | 'cancelado'
          items?: Json
          total?: number
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
