# GeoBazar Release 1.0 Full No Placeholders

Сделано:
- убрана AI-кнопка-заглушка;
- поддержка стала реальной формой тикета;
- избранное читает favorites;
- мои объявления читает listings;
- платежи читают payments;
- верификация создаёт verification_requests;
- отзывы создают/читают reviews;
- жалобы создают reports;
- GeoCargo создаёт cargo_orders;
- GeoTravel создаёт travel_requests;
- админ-страницы читают реальные таблицы.

Порядок:
1. Выполнить GEOBazar_RELEASE_1_0_MASTER_SQL.sql.
2. Загрузить весь архив в geobazar-v2 с заменой.
3. Redeploy Cloudflare.
4. Проверить страницы.
