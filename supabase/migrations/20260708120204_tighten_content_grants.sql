revoke all privileges on table public.admin_users from anon, authenticated;
revoke all privileges on table public.home_images from anon, authenticated;
revoke all privileges on table public.project_types from anon, authenticated;

grant select on public.admin_users to authenticated;

grant select on public.home_images to anon, authenticated;
grant insert, update, delete on public.home_images to authenticated;

grant select on public.project_types to anon, authenticated;
grant insert, update, delete on public.project_types to authenticated;

grant all privileges on table public.admin_users to service_role;
grant all privileges on table public.home_images to service_role;
grant all privileges on table public.project_types to service_role;
