-- ============================================================
-- BarraFresh — Fix RLS Fase 4
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================
-- Cambios:
-- 1. Lectura pública filtrada por disponible/activo (antes era USING (true))
-- 2. Elimina "insertar pedido publico" — todo INSERT va por Server Actions con service role
-- ============================================================

-- ── 1. Categorías ────────────────────────────────────────────
drop policy if exists "lectura publica categorias" on public.categorias;
create policy "lectura publica categorias"
  on public.categorias for select
  using (activo = true);

-- ── 2. Productos ─────────────────────────────────────────────
drop policy if exists "lectura publica productos" on public.productos;
create policy "lectura publica productos"
  on public.productos for select
  using (disponible = true);

-- ── 3. Tamaños de ensalada ───────────────────────────────────
drop policy if exists "lectura publica tamanos" on public.tamanos_ensalada;
create policy "lectura publica tamanos"
  on public.tamanos_ensalada for select
  using (activo = true);

-- ── 4. Toppings ──────────────────────────────────────────────
drop policy if exists "lectura publica toppings" on public.toppings;
create policy "lectura publica toppings"
  on public.toppings for select
  using (disponible = true);

-- ── 5. Aderezos ──────────────────────────────────────────────
drop policy if exists "lectura publica aderezos" on public.aderezos;
create policy "lectura publica aderezos"
  on public.aderezos for select
  using (disponible = true);

-- ── 6. Eliminar policy de inserción pública en pedidos ───────
-- Los INSERT de pedidos van por Server Actions con service role key (bypasea RLS).
-- Esta policy era innecesaria y abría un vector de abuso via API directa.
drop policy if exists "insertar pedido publico" on public.pedidos;
