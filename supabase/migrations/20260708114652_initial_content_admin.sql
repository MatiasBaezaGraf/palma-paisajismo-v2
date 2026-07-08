create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.home_images (
  slot text primary key check (slot in ('hero', 'studio')),
  label text not null,
  image_path text not null,
  image_alt text not null,
  image_width integer not null check (image_width > 0),
  image_height integer not null check (image_height > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.project_types (
  slug text primary key,
  title text not null,
  description text not null,
  sort_order integer not null,
  image_path text not null,
  image_alt text not null,
  image_width integer not null check (image_width > 0),
  image_height integer not null check (image_height > 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists project_types_sort_order_idx
  on public.project_types (sort_order)
  where is_active;

grant select on public.home_images to anon, authenticated;
grant select on public.project_types to anon, authenticated;
grant select on public.admin_users to authenticated;

grant select, insert, update, delete on public.home_images to authenticated, service_role;
grant select, insert, update, delete on public.project_types to authenticated, service_role;
grant select, insert, update, delete on public.admin_users to service_role;

alter table public.admin_users enable row level security;
alter table public.home_images enable row level security;
alter table public.project_types enable row level security;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Public can read home images" on public.home_images;
create policy "Public can read home images"
  on public.home_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage home images" on public.home_images;
create policy "Admins can manage home images"
  on public.home_images
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

drop policy if exists "Public can read active project types" on public.project_types;
create policy "Public can read active project types"
  on public.project_types
  for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Admins can manage project types" on public.project_types;
create policy "Admins can manage project types"
  on public.project_types
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'palma-images',
  'palma-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read palma images" on storage.objects;
create policy "Public can read palma images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'palma-images');

drop policy if exists "Admins can upload palma images" on storage.objects;
create policy "Admins can upload palma images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'palma-images'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update palma images" on storage.objects;
create policy "Admins can update palma images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'palma-images'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'palma-images'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can delete palma images" on storage.objects;
create policy "Admins can delete palma images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'palma-images'
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    )
  );
