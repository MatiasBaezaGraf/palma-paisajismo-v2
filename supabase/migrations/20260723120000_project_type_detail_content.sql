alter table public.project_types
  add column if not exists detail_intro text not null default '',
  add column if not exists detail_steps jsonb not null default '[]'::jsonb;
