# GeoBazar Release 1.0 Master Pack

Этот архив объединяет оставшиеся этапы:

1. Карта Leaflet / OpenStreetMap
- map.html показывает реальные точки объявлений
- listing.html показывает карту объявления
- create-listing.html позволяет выбрать точку на карте

2. Объявления
- поля latitude/longitude/address/images/video/status/vip/boost
- создание объявления через Supabase
- база для редактирования/архива/продано

3. Кабинет
- структура профиля, избранного, сообщений, платежей

4. CRM компаний
- company_leads
- company_team
- статусы заявок

5. Платежи
- wallets
- payments
- статусы pending до подключения банка

6. GeoCargo
- cargo_orders

7. GeoTravel
- travel_requests

8. GeoAI
- кнопка-заглушка остаётся
- финальное подключение OpenAI позже

Как загрузить:
1. Выполнить GEOBazar_RELEASE_1_0_MASTER_SQL.sql в Supabase.
2. Загрузить все файлы архива в geobazar-v2 с заменой.
3. В Cloudflare нажать Deploy / Redeploy.
4. Проверить:
   - index.html
   - map.html
   - create-listing.html
   - listing.html
   - dashboard.html
   - company-dashboard.html
   - crm.html
   - payments.html
