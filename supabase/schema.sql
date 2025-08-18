
-- Minimal schema to get started
create extension if not exists pgcrypto;

create table if not exists wearable_daily(
  id bigserial primary key,
  user_id uuid not null,
  date date not null,
  rhr int,
  hrv int,
  sleep_score int,
  steps int,
  payload jsonb
);
create unique index if not exists wearable_daily_uid_date on wearable_daily(user_id, date);

create table if not exists labs(
  id bigserial primary key,
  user_id uuid not null,
  collected_at date,
  markers jsonb
);

create table if not exists meals(
  id bigserial primary key,
  user_id uuid not null,
  ts timestamptz default now(),
  photo_url text,
  items jsonb
);

create table if not exists data_progress(
  user_id uuid primary key,
  score int,
  breakdown jsonb,
  updated_at timestamptz default now()
);

alter table wearable_daily enable row level security;
alter table labs enable row level security;
alter table meals enable row level security;
alter table data_progress enable row level security;

create policy "owner_wearable" on wearable_daily for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "owner_labs" on labs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "owner_meals" on meals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "owner_prog" on data_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
