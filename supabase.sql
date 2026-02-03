-- Supabase schema for WhoKilledBambi site CMS
-- Run in Supabase SQL editor

create extension if not exists pgcrypto;

-- Admin profiles (maps auth.users to username)
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

-- Content pages (JSON payload per page)
create table if not exists public.content_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- News
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  published_at timestamptz not null default now(),
  body text,
  image_url text,
  image_storage_path text,
  created_at timestamptz not null default now()
);

-- Events (concerts)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  event_date timestamptz,
  location text,
  ticket_link text,
  theme text,
  created_at timestamptz not null default now()
);

-- Members
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  instrument text,
  image_url text,
  image_storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Collaborators (marquee list)
create table if not exists public.collaborators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Updated-at triggers for content_pages
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_content_pages_updated_at on public.content_pages;
create trigger trg_content_pages_updated_at
before update on public.content_pages
for each row execute function public.set_updated_at();

-- RLS
alter table public.admin_profiles enable row level security;
alter table public.content_pages enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.members enable row level security;
alter table public.collaborators enable row level security;

-- Public read for site content
drop policy if exists "public read content_pages" on public.content_pages;
create policy "public read content_pages"
  on public.content_pages for select using (true);
drop policy if exists "public read news" on public.news;
create policy "public read news"
  on public.news for select using (true);
drop policy if exists "public read events" on public.events;
create policy "public read events"
  on public.events for select using (true);
drop policy if exists "public read members" on public.members;
create policy "public read members"
  on public.members for select using (true);
drop policy if exists "public read collaborators" on public.collaborators;
create policy "public read collaborators"
  on public.collaborators for select using (true);

-- Authenticated write for admins
drop policy if exists "admin write content_pages" on public.content_pages;
create policy "admin write content_pages"
  on public.content_pages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write news" on public.news;
create policy "admin write news"
  on public.news for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write events" on public.events;
create policy "admin write events"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write members" on public.members;
create policy "admin write members"
  on public.members for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin write collaborators" on public.collaborators;
create policy "admin write collaborators"
  on public.collaborators for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin read own profile" on public.admin_profiles;
create policy "admin read own profile"
  on public.admin_profiles for select
  using (auth.uid() = id);

drop policy if exists "admin write own profile" on public.admin_profiles;
create policy "admin write own profile"
  on public.admin_profiles for insert
  with check (auth.uid() = id);

-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "auth write media" on storage.objects;
create policy "auth write media"
  on storage.objects for all
  using (bucket_id = 'media' and auth.role() = 'authenticated')
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
