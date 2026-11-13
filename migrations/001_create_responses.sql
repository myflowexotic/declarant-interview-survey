create table if not exists responses (
  id text primary key,
  created_at timestamptz not null default now(),
  respondent_label text,
  answers jsonb not null
);

create index if not exists responses_created_at_idx on responses (created_at desc);
