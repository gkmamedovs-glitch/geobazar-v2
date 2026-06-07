Как загрузить все сёла:
1) Получить CSV с полями region/sub_region/city/type/lat/lng из выбранного источника.
2) Привести к формату locations_import_template.csv:
   region_ru, municipality_ru, settlement_ru, type, lat, lng
3) В Supabase → Table Editor можно импортировать CSV сначала во временную таблицу, потом перенести в regions/municipalities/settlements.
4) Вручную все сёла лучше не вводить — высокая вероятность ошибок.
