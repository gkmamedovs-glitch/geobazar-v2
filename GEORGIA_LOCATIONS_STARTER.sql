
-- GeoBazar Georgia Locations Starter Pack
-- Важно: это стартовый пакет регионов/муниципалитетов/основных населённых пунктов.
-- Полную базу всех сёл лучше импортировать CSV-файлом в таблицу settlements.

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name_ru text not null unique,
  name_ka text,
  name_az text,
  name_en text,
  created_at timestamptz default now()
);

create table if not exists public.municipalities (
  id uuid primary key default gen_random_uuid(),
  region_id uuid references public.regions(id) on delete cascade,
  name_ru text not null,
  name_ka text,
  name_az text,
  name_en text,
  created_at timestamptz default now(),
  unique(region_id, name_ru)
);

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references public.municipalities(id) on delete cascade,
  name_ru text not null,
  name_ka text,
  name_az text,
  name_en text,
  type text default 'village',
  lat numeric,
  lng numeric,
  created_at timestamptz default now(),
  unique(municipality_id, name_ru)
);

alter table public.listings
add column if not exists region_id uuid,
add column if not exists municipality_id uuid,
add column if not exists settlement_id uuid,
add column if not exists address text;

insert into public.regions (name_ru, name_en) values
('Тбилиси','Tbilisi'),
('Аджария','Adjara'),
('Гурия','Guria'),
('Имеретия','Imereti'),
('Кахетия','Kakheti'),
('Квемо-Картли','Kvemo Kartli'),
('Мцхета-Мтианети','Mtskheta-Mtianeti'),
('Рача-Лечхуми и Квемо-Сванети','Racha-Lechkhumi and Kvemo Svaneti'),
('Самегрело-Земо-Сванети','Samegrelo-Zemo Svaneti'),
('Самцхе-Джавахети','Samtskhe-Javakheti'),
('Шида-Картли','Shida Kartli')
on conflict (name_ru) do nothing;

-- helper
create or replace function public.gb_insert_municipality(region_name text, municipality_name text)
returns uuid
language plpgsql
as $$
declare
  r_id uuid;
  m_id uuid;
begin
  select id into r_id from public.regions where name_ru = region_name;
  insert into public.municipalities(region_id, name_ru)
  values (r_id, municipality_name)
  on conflict(region_id, name_ru) do update set name_ru = excluded.name_ru
  returning id into m_id;
  return m_id;
end;
$$;

create or replace function public.gb_insert_settlement(region_name text, municipality_name text, settlement_name text, settlement_type text default 'village')
returns void
language plpgsql
as $$
declare
  m_id uuid;
begin
  select m.id into m_id
  from public.municipalities m
  join public.regions r on r.id = m.region_id
  where r.name_ru = region_name and m.name_ru = municipality_name;

  if m_id is null then
    m_id := public.gb_insert_municipality(region_name, municipality_name);
  end if;

  insert into public.settlements(municipality_id, name_ru, type)
  values (m_id, settlement_name, settlement_type)
  on conflict(municipality_id, name_ru) do nothing;
end;
$$;

-- Тбилиси
select public.gb_insert_municipality('Тбилиси','Тбилиси');
select public.gb_insert_settlement('Тбилиси','Тбилиси','Тбилиси','city');

-- Квемо-Картли
select public.gb_insert_municipality('Квемо-Картли','Марнеули');
select public.gb_insert_municipality('Квемо-Картли','Рустави');
select public.gb_insert_municipality('Квемо-Картли','Болниси');
select public.gb_insert_municipality('Квемо-Картли','Гардабани');
select public.gb_insert_municipality('Квемо-Картли','Дманиси');
select public.gb_insert_municipality('Квемо-Картли','Тетрицкаро');
select public.gb_insert_municipality('Квемо-Картли','Цалка');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Марнеули','city');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Садахло','village');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Шулавери','village');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Качагани','village');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Кизиладжло','village');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Церетели','village');
select public.gb_insert_settlement('Квемо-Картли','Марнеули','Ахкерпи','village');
select public.gb_insert_settlement('Квемо-Картли','Рустави','Рустави','city');
select public.gb_insert_settlement('Квемо-Картли','Болниси','Болниси','city');
select public.gb_insert_settlement('Квемо-Картли','Гардабани','Гардабани','city');
select public.gb_insert_settlement('Квемо-Картли','Дманиси','Дманиси','city');

-- Аджария
select public.gb_insert_municipality('Аджария','Батуми');
select public.gb_insert_municipality('Аджария','Кобулети');
select public.gb_insert_municipality('Аджария','Хелвачаури');
select public.gb_insert_municipality('Аджария','Кеда');
select public.gb_insert_municipality('Аджария','Шуахеви');
select public.gb_insert_municipality('Аджария','Хуло');
select public.gb_insert_settlement('Аджария','Батуми','Батуми','city');
select public.gb_insert_settlement('Аджария','Кобулети','Кобулети','city');

-- Имеретия
select public.gb_insert_municipality('Имеретия','Кутаиси');
select public.gb_insert_municipality('Имеретия','Зестафони');
select public.gb_insert_municipality('Имеретия','Самтредиа');
select public.gb_insert_municipality('Имеретия','Цхалтубо');
select public.gb_insert_municipality('Имеретия','Чиатура');
select public.gb_insert_municipality('Имеретия','Сачхере');
select public.gb_insert_municipality('Имеретия','Ткибули');
select public.gb_insert_municipality('Имеретия','Багдати');
select public.gb_insert_municipality('Имеретия','Вани');
select public.gb_insert_settlement('Имеретия','Кутаиси','Кутаиси','city');
select public.gb_insert_settlement('Имеретия','Зестафони','Зестафони','city');

-- Кахетия
select public.gb_insert_municipality('Кахетия','Телави');
select public.gb_insert_municipality('Кахетия','Гурджаани');
select public.gb_insert_municipality('Кахетия','Сигнахи');
select public.gb_insert_municipality('Кахетия','Кварели');
select public.gb_insert_municipality('Кахетия','Лагодехи');
select public.gb_insert_municipality('Кахетия','Ахмета');
select public.gb_insert_municipality('Кахетия','Дедоплисцкаро');
select public.gb_insert_municipality('Кахетия','Сагареджо');
select public.gb_insert_settlement('Кахетия','Телави','Телави','city');
select public.gb_insert_settlement('Кахетия','Гурджаани','Гурджаани','city');

-- Шида-Картли
select public.gb_insert_municipality('Шида-Картли','Гори');
select public.gb_insert_municipality('Шида-Картли','Каспи');
select public.gb_insert_municipality('Шида-Картли','Карели');
select public.gb_insert_municipality('Шида-Картли','Хашури');
select public.gb_insert_settlement('Шида-Картли','Гори','Гори','city');

-- Самегрело-Земо-Сванети
select public.gb_insert_municipality('Самегрело-Земо-Сванети','Зугдиди');
select public.gb_insert_municipality('Самегрело-Земо-Сванети','Поти');
select public.gb_insert_municipality('Самегрело-Земо-Сванети','Сенаки');
select public.gb_insert_municipality('Самегрело-Земо-Сванети','Мартвили');
select public.gb_insert_municipality('Самегрело-Земо-Сванети','Местиа');
select public.gb_insert_settlement('Самегрело-Земо-Сванети','Зугдиди','Зугдиди','city');
select public.gb_insert_settlement('Самегрело-Земо-Сванети','Поти','Поти','city');

-- Самцхе-Джавахети
select public.gb_insert_municipality('Самцхе-Джавахети','Ахалцихе');
select public.gb_insert_municipality('Самцхе-Джавахети','Ахалкалаки');
select public.gb_insert_municipality('Самцхе-Джавахети','Боржоми');
select public.gb_insert_municipality('Самцхе-Джавахети','Ниноцминда');
select public.gb_insert_municipality('Самцхе-Джавахети','Адигени');
select public.gb_insert_municipality('Самцхе-Джавахети','Аспиндза');
select public.gb_insert_settlement('Самцхе-Джавахети','Ахалцихе','Ахалцихе','city');
select public.gb_insert_settlement('Самцхе-Джавахети','Боржоми','Боржоми','city');

-- Мцхета-Мтианети
select public.gb_insert_municipality('Мцхета-Мтианети','Мцхета');
select public.gb_insert_municipality('Мцхета-Мтианети','Душети');
select public.gb_insert_municipality('Мцхета-Мтианети','Тианети');
select public.gb_insert_municipality('Мцхета-Мтианети','Казбеги');
select public.gb_insert_settlement('Мцхета-Мтианети','Мцхета','Мцхета','city');

-- Гурия
select public.gb_insert_municipality('Гурия','Озургети');
select public.gb_insert_municipality('Гурия','Ланчхути');
select public.gb_insert_municipality('Гурия','Чохатаури');
select public.gb_insert_settlement('Гурия','Озургети','Озургети','city');

-- Рача-Лечхуми и Квемо-Сванети
select public.gb_insert_municipality('Рача-Лечхуми и Квемо-Сванети','Амбролаури');
select public.gb_insert_municipality('Рача-Лечхуми и Квемо-Сванети','Они');
select public.gb_insert_municipality('Рача-Лечхуми и Квемо-Сванети','Цагери');
select public.gb_insert_municipality('Рача-Лечхуми и Квемо-Сванети','Лентехи');
select public.gb_insert_settlement('Рача-Лечхуми и Квемо-Сванети','Амбролаури','Амбролаури','city');

drop function if exists public.gb_insert_settlement(text,text,text,text);
drop function if exists public.gb_insert_municipality(text,text);
