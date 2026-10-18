-- Run in the Supabase SQL editor or through `supabase db push`.
create table public.businesses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint profile_object check (jsonb_typeof(profile) = 'object' and octet_length(profile::text) <= 20000)
);
alter table public.businesses enable row level security;
create policy "Own business select" on public.businesses for select to authenticated using (auth.uid() = user_id);
create policy "Own business insert" on public.businesses for insert to authenticated with check (auth.uid() = user_id);
create policy "Own business update" on public.businesses for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own business delete" on public.businesses for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.businesses to authenticated;
revoke all on public.businesses from anon;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('creative-assets','creative-assets',false,20971520,array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
create policy "Read own assets" on storage.objects for select to authenticated using (bucket_id = 'creative-assets' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "Upload own assets" on storage.objects for insert to authenticated with check (bucket_id = 'creative-assets' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "Delete own assets" on storage.objects for delete to authenticated using (bucket_id = 'creative-assets' and (storage.foldername(name))[1] = (select auth.uid()::text));

-- Atomic per-account quotas limit paid API use across all server instances.
create table public.ai_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('chat','image')),
 window_start timestamptz not null,
 requests integer not null default 0,
 primary key (user_id,kind,window_start)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon,authenticated;
create or replace function public.consume_ai_quota(request_kind text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid(); current_window timestamptz := date_trunc('hour',now()); used integer; allowed integer;
begin
 if current_user_id is null or request_kind not in ('chat','image') then return false; end if;
 allowed := case when request_kind = 'image' then 5 else 40 end;
 insert into public.ai_usage(user_id,kind,window_start,requests) values(current_user_id,request_kind,current_window,1)
 on conflict(user_id,kind,window_start) do update set requests=public.ai_usage.requests+1 where public.ai_usage.requests < allowed
 returning requests into used;
 return used is not null;
end;
$$;
revoke all on function public.consume_ai_quota(text) from public,anon;
grant execute on function public.consume_ai_quota(text) to authenticated;
