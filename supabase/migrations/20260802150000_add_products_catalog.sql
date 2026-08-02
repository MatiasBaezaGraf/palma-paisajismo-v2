create table if not exists public.site_sections (
  slug text primary key,
  label text not null,
  is_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  subtitle text not null,
  price text not null,
  description text not null,
  sort_order integer not null,
  image_path text not null default '',
  image_alt text not null default '',
  image_width integer not null default 1200 check (image_width > 0),
  image_height integer not null default 980 check (image_height > 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists products_active_sort_order_idx
  on public.products (sort_order)
  where is_active;

grant select on public.site_sections to anon, authenticated;
grant insert, update, delete on public.site_sections to authenticated;
grant all privileges on table public.site_sections to service_role;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all privileges on table public.products to service_role;
grant usage, select on sequence public.products_id_seq to authenticated, service_role;

alter table public.site_sections enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read site sections" on public.site_sections;
create policy "Public can read site sections"
  on public.site_sections
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage site sections" on public.site_sections;
create policy "Admins can manage site sections"
  on public.site_sections
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );

insert into public.site_sections (slug, label, is_enabled)
values ('productos', 'Productos', true)
on conflict (slug) do update
set
  label = excluded.label,
  updated_at = now();

insert into public.products (
  slug,
  title,
  subtitle,
  price,
  description,
  sort_order,
  image_path,
  image_alt,
  image_width,
  image_height,
  is_active
)
values
  (
    'maceta-de-terracota-artesanal',
    'Maceta de terracota artesanal',
    'Pieza torneada a mano, ideal para especies de mediana escala.',
    '$ 45.000 ARS',
    'Maceta de terracota torneada a mano por artesanos locales. Su porosidad favorece la aireación de la raíz y su pátina natural se profundiza con el tiempo y la intemperie. Disponible en distintos diámetros según el proyecto.',
    1,
    '',
    'Maceta de terracota artesanal',
    1200,
    980,
    true
  ),
  (
    'banco-de-jardin-en-madera-de-teca',
    'Banco de jardín en madera de teca',
    'Mobiliario exterior resistente a la intemperie.',
    '$ 128.000 ARS',
    'Banco macizo de teca, pensado para permanecer a la intemperie durante todo el año. Su diseño simple acompaña tanto jardines contemporáneos como paisajes más silvestres.',
    2,
    '',
    'Banco de jardín en madera de teca',
    1200,
    980,
    true
  ),
  (
    'set-de-herramientas-de-jardineria',
    'Set de herramientas de jardinería',
    'Herramientas manuales de uso cotidiano en obra.',
    '$ 38.500 ARS',
    'Conjunto de herramientas manuales — pala de mano, tijera de podar y rastrillo — con mango de madera y cabezal de acero. Las mismas que usamos en el mantenimiento diario de nuestros proyectos.',
    3,
    '',
    'Set de herramientas de jardinería',
    1200,
    980,
    true
  ),
  (
    'luminaria-solar-de-exterior',
    'Luminaria solar de exterior',
    'Iluminación de bajo consumo para senderos y canteros.',
    '$ 22.000 ARS',
    'Luminaria solar de bajo perfil, pensada para marcar recorridos y resaltar canteros durante la noche sin necesidad de instalación eléctrica.',
    4,
    '',
    'Luminaria solar de exterior',
    1200,
    980,
    true
  ),
  (
    'sustrato-premium-organico-20kg',
    'Sustrato premium orgánico 20kg',
    'Mezcla balanceada para plantación y trasplante.',
    '$ 9.800 ARS',
    'Sustrato orgánico balanceado, formulado para favorecer el enraizamiento en plantación y trasplante. Es el mismo que utilizamos en la preparación de canteros en obra.',
    5,
    '',
    'Sustrato premium orgánico 20kg',
    1200,
    980,
    true
  ),
  (
    'aspersor-de-riego-automatico',
    'Aspersor de riego automático',
    'Riego programable para jardines de mediana escala.',
    '$ 54.000 ARS',
    'Aspersor con temporizador programable, pensado para automatizar el riego en jardines residenciales de mediana escala y reducir el consumo de agua.',
    6,
    '',
    'Aspersor de riego automático',
    1200,
    980,
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  price = excluded.price,
  description = excluded.description,
  sort_order = excluded.sort_order,
  image_alt = excluded.image_alt,
  image_width = excluded.image_width,
  image_height = excluded.image_height,
  is_active = excluded.is_active,
  updated_at = now();
