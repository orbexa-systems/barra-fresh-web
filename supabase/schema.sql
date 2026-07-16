-- ============================================================
-- BarraFresh — Schema completo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  nombre      varchar not null,
  orden       integer default 0,
  activo      boolean default true,
  created_at  timestamp with time zone default now()
);

create table if not exists public.productos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nombre       varchar not null,
  descripcion  text,
  precio       decimal(10,2) not null,
  imagen_url   text,
  disponible   boolean default true,
  destacado    boolean default false,
  orden        integer default 0,
  created_at   timestamp with time zone default now()
);

create table if not exists public.tamanos_ensalada (
  id           uuid primary key default gen_random_uuid(),
  nombre       varchar not null,
  precio       decimal(10,2) not null,
  max_toppings integer default 5,
  activo       boolean default true,
  orden        integer default 0
);

create table if not exists public.toppings (
  id          uuid primary key default gen_random_uuid(),
  nombre      varchar not null,
  tipo        varchar not null check (tipo in ('base', 'especial')),
  precio_extra decimal(10,2) default 0,
  disponible  boolean default true,
  orden       integer default 0
);

create table if not exists public.aderezos (
  id         uuid primary key default gen_random_uuid(),
  nombre     varchar not null,
  disponible boolean default true,
  orden      integer default 0
);

create table if not exists public.pedidos (
  id             uuid primary key default gen_random_uuid(),
  origen         varchar not null check (origen in ('whatsapp', 'pos')),
  nombre_cliente varchar,
  estado         varchar default 'pendiente' check (estado in ('pendiente', 'confirmado', 'entregado', 'cancelado')),
  items          jsonb not null,
  total          decimal(10,2) not null,
  notas          text,
  created_at     timestamp with time zone default now(),
  updated_at     timestamp with time zone default now()
);

-- Trigger para updated_at en pedidos
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pedidos_updated_at on public.pedidos;
create trigger set_pedidos_updated_at
  before update on public.pedidos
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.categorias       enable row level security;
alter table public.productos        enable row level security;
alter table public.tamanos_ensalada enable row level security;
alter table public.toppings         enable row level security;
alter table public.aderezos         enable row level security;
alter table public.pedidos          enable row level security;

-- Lectura pública (menú y configurador) — solo registros activos/disponibles
create policy "lectura publica categorias"
  on public.categorias for select using (activo = true);

create policy "lectura publica productos"
  on public.productos for select using (disponible = true);

create policy "lectura publica tamanos"
  on public.tamanos_ensalada for select using (activo = true);

create policy "lectura publica toppings"
  on public.toppings for select using (disponible = true);

create policy "lectura publica aderezos"
  on public.aderezos for select using (disponible = true);

-- Escritura solo autenticados (admin y POS)
create policy "escritura autenticados categorias"
  on public.categorias for all using (auth.role() = 'authenticated');

create policy "escritura autenticados productos"
  on public.productos for all using (auth.role() = 'authenticated');

create policy "escritura autenticados tamanos"
  on public.tamanos_ensalada for all using (auth.role() = 'authenticated');

create policy "escritura autenticados toppings"
  on public.toppings for all using (auth.role() = 'authenticated');

create policy "escritura autenticados aderezos"
  on public.aderezos for all using (auth.role() = 'authenticated');

-- Pedidos: solo autenticados pueden leer y escribir
-- INSERT desde sitio público va por Server Actions con service role key (bypasea RLS)
create policy "pedidos solo autenticados"
  on public.pedidos for all using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Categorías
-- ============================================================

insert into public.categorias (nombre, orden) values
  ('Ensaladas',       1),
  ('Jugos',           2),
  ('Licuados',        3),
  ('Yogurt Preparado',4),
  ('Smoothies',       5),
  ('Snacks',          6);

-- ============================================================
-- SEED DATA — Productos
-- ============================================================

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Verde Detox', 'Pepino, apio, espinaca, manzana verde, jengibre y limón', 65,
  'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80', true, true, 1
from public.categorias where nombre = 'Jugos';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Naranja & Zanahoria', 'Naranja fresca, zanahoria, jengibre y cúrcuma', 55,
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80', true, false, 2
from public.categorias where nombre = 'Jugos';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Remolacha Power', 'Betabel, manzana, zanahoria, naranja y jengibre', 65,
  'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&q=80', true, false, 3
from public.categorias where nombre = 'Jugos';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Tropical Fresh', 'Piña, mango, maracuyá y un toque de menta', 60,
  'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', true, true, 4
from public.categorias where nombre = 'Jugos';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Licuado de Fresa', 'Fresas frescas, leche, plátano y miel de abeja', 70,
  'https://images.unsplash.com/photo-1553530666-ba11a90a3dcc?w=400&q=80', true, true, 1
from public.categorias where nombre = 'Licuados';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Licuado Verde', 'Espinaca, plátano, leche de almendra, chía y miel', 80,
  'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80', true, false, 2
from public.categorias where nombre = 'Licuados';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Chocolate Proteico', 'Cacao puro, plátano, leche, proteína vegetal y mantequilla de almendra', 90,
  'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', true, false, 3
from public.categorias where nombre = 'Licuados';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Parfait de Frutos Rojos', 'Yogurt griego, fresas, arándanos, frambuesas, granola artesanal y miel', 80,
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', true, true, 1
from public.categorias where nombre = 'Yogurt Preparado';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Yogurt Tropical', 'Yogurt natural, mango, piña, coco rallado y granola', 80,
  'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80', true, false, 2
from public.categorias where nombre = 'Yogurt Preparado';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Yogurt Fitness', 'Yogurt griego, plátano, nueces, semillas de chía y proteína', 95,
  'https://images.unsplash.com/photo-1571212515416-fca988083f0e?w=400&q=80', true, false, 3
from public.categorias where nombre = 'Yogurt Preparado';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Smoothie Açaí', 'Açaí, arándanos, plátano, leche de almendra y granola', 110,
  'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', true, true, 1
from public.categorias where nombre = 'Smoothies';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Green Smoothie', 'Espinaca, aguacate, pepino, limón, manzana verde y menta', 95,
  'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80', true, false, 2
from public.categorias where nombre = 'Smoothies';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Bowl de Fruta', 'Selección de fruta de temporada con chile, limón y chamoy opcional', 55,
  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80', true, false, 1
from public.categorias where nombre = 'Snacks';

insert into public.productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, orden)
select id, 'Mix de Nueces', 'Almendras, nueces, pistaches, arándanos y coco', 65,
  'https://images.unsplash.com/photo-1604210614637-99d697b20c0a?w=400&q=80', true, false, 2
from public.categorias where nombre = 'Snacks';

-- ============================================================
-- SEED DATA — Tamaños de ensalada
-- ============================================================

insert into public.tamanos_ensalada (nombre, precio, max_toppings, orden) values
  ('Chica',   65,  5, 1),
  ('Mediana', 85,  7, 2),
  ('Grande',  105, 9, 3);

-- ============================================================
-- SEED DATA — Toppings base
-- ============================================================

insert into public.toppings (nombre, tipo, precio_extra, orden) values
  ('Espinaca baby',    'base', 0,  1),
  ('Jitomate cherry',  'base', 0,  2),
  ('Pepino',           'base', 0,  3),
  ('Zanahoria rallada','base', 0,  4),
  ('Cebolla morada',   'base', 0,  5),
  ('Pimiento',         'base', 0,  6),
  ('Maíz',             'base', 0,  7),
  ('Betabel',          'base', 0,  8),
  ('Brócoli',          'base', 0,  9),
  ('Champiñones',      'base', 0, 10),
  ('Germinados',       'base', 0, 11);

-- ============================================================
-- SEED DATA — Toppings especiales
-- ============================================================

insert into public.toppings (nombre, tipo, precio_extra, orden) values
  ('Nuez',              'especial', 10, 1),
  ('Queso Feta',        'especial', 10, 2),
  ('Aguacate',          'especial', 15, 3),
  ('Pollo a la plancha','especial', 20, 4),
  ('Almendras',         'especial', 10, 5);

-- ============================================================
-- SEED DATA — Aderezos
-- ============================================================

insert into public.aderezos (nombre, orden) values
  ('César',           1),
  ('Vinagreta',       2),
  ('Ranch',           3),
  ('Miel Mostaza',    4),
  ('Queso Parmesano', 5);
