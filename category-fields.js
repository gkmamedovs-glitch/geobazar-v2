
const CATEGORY_FIELD_SCHEMAS = {
  "Авто": [
    { id:"auto_brand", label:"Марка", type:"select", options:["BMW","Mercedes-Benz","Toyota","Lexus","Honda","Hyundai","Kia","Nissan","Ford","Chevrolet","Volkswagen","Audi","Porsche","Tesla","Mazda","Mitsubishi","Subaru","Opel","Renault","Peugeot","Fiat","Skoda","Volvo","Land Rover","Jeep","Dodge","Infiniti","Acura","Suzuki","Lada","ГАЗ","УАЗ","Другое"] },
    { id:"auto_model", label:"Модель", type:"text", placeholder:"Например: X5, Camry, Prius" },
    { id:"auto_year", label:"Год", type:"number" },
    { id:"auto_generation", label:"Поколение", type:"text" },
    { id:"auto_body", label:"Кузов", type:"select", options:["Седан","Хэтчбек","Универсал","Купе","Кабриолет","Внедорожник","Кроссовер","Минивэн","Пикап","Фургон","Другое"] },
    { id:"auto_engine", label:"Двигатель", type:"text", placeholder:"Например: 4.4, 2.0, 3.0" },
    { id:"auto_fuel", label:"Топливо", type:"select", options:["Бензин","Дизель","Гибрид","Электро","Газ","Plug-in Hybrid"] },
    { id:"auto_transmission", label:"Коробка", type:"select", options:["Автомат","Механика","Робот","Вариатор"] },
    { id:"auto_drive", label:"Привод", type:"select", options:["Передний","Задний","Полный"] },
    { id:"auto_mileage", label:"Пробег", type:"number" },
    { id:"auto_color", label:"Цвет", type:"select", options:["Белый","Чёрный","Серебристый","Серый","Синий","Красный","Зелёный","Коричневый","Бежевый","Жёлтый","Оранжевый","Другой"] },
    { id:"auto_steering", label:"Руль", type:"select", options:["Левый","Правый"] },
    { id:"auto_customs", label:"Таможня", type:"select", options:["Растаможен","Не растаможен","Транзит","Не указано"] },
    { id:"auto_condition", label:"Состояние", type:"select", options:["Отличное","Хорошее","Требует ремонта","После ДТП","На запчасти"] },
    { id:"auto_vin", label:"VIN", type:"text" }
  ],

  "Недвижимость": [
    { id:"real_estate_deal", label:"Тип сделки", type:"select", options:["Продажа","Аренда","Посуточно","Ипотека/рассрочка"] },
    { id:"real_estate_type", label:"Тип объекта", type:"select", options:["Квартира","Дом","Коммерческая","Земля","Новостройка","Офис","Склад","Гостиница","Апартаменты"] },
    { id:"real_estate_area", label:"Площадь м²", type:"number" },
    { id:"real_estate_rooms", label:"Комнаты", type:"number" },
    { id:"real_estate_bedrooms", label:"Спальни", type:"number" },
    { id:"real_estate_floor", label:"Этаж", type:"number" },
    { id:"real_estate_total_floors", label:"Этажность дома", type:"number" },
    { id:"real_estate_year", label:"Год постройки", type:"number" },
    { id:"real_estate_repair", label:"Ремонт", type:"select", options:["Новый ремонт","Хороший ремонт","Средний","Без ремонта","Черный каркас","Белый каркас","Зелёный каркас"] },
    { id:"real_estate_layout", label:"Планировка", type:"select", options:["Студия","Изолированная","Смежная","Свободная","Дуплекс","Другое"] },
    { id:"real_estate_balcony", label:"Балкон", type:"select", options:["Есть","Нет","Лоджия","Терраса"] },
    { id:"real_estate_elevator", label:"Лифт", type:"select", options:["Есть","Нет"] },
    { id:"real_estate_parking", label:"Парковка", type:"select", options:["Есть","Нет","Подземная","Во дворе","Гараж"] },
    { id:"real_estate_heating", label:"Отопление", type:"select", options:["Центральное","Газовое","Электрическое","Кондиционер","Нет"] },
    { id:"real_estate_gas", label:"Газ", type:"select", options:["Есть","Нет"] },
    { id:"real_estate_documents", label:"Документы", type:"select", options:["В порядке","В процессе","Не указано"] }
  ],

  "Электроника": [
    { id:"electronics_type", label:"Тип", type:"select", options:["Телефон","Ноутбук","Компьютер","Планшет","Телевизор","Игровая приставка","Бытовая техника","Фото/Видео","Аксессуар","Другое"] },
    { id:"electronics_brand", label:"Бренд", type:"select", options:["Apple","Samsung","Xiaomi","Huawei","Lenovo","HP","Dell","Asus","Acer","Sony","LG","Bosch","Panasonic","Canon","Nikon","Другое"] },
    { id:"electronics_model", label:"Модель", type:"text" },
    { id:"electronics_memory", label:"Память", type:"text", placeholder:"Например: 128GB / 8GB RAM" },
    { id:"electronics_color", label:"Цвет", type:"text" },
    { id:"electronics_condition", label:"Состояние", type:"select", options:["Новое","Как новое","Хорошее","Есть дефекты","На запчасти"] },
    { id:"electronics_warranty", label:"Гарантия", type:"select", options:["Есть","Нет","Магазинная","Официальная"] },
    { id:"electronics_original", label:"Оригинал", type:"select", options:["Оригинал","Копия","Не знаю"] },
    { id:"electronics_set", label:"Комплект", type:"text", placeholder:"Коробка, зарядка, чек..." },
    { id:"phone_battery", label:"Battery Health / аккумулятор", type:"text" },
    { id:"phone_sim", label:"SIM/eSIM", type:"select", options:["1 SIM","2 SIM","eSIM","SIM + eSIM"] }
  ],

  "Автозапчасти": [
    { id:"part_car_brand", label:"Марка авто", type:"select", options:["BMW","Mercedes-Benz","Toyota","Lexus","Honda","Hyundai","Kia","Nissan","Ford","Volkswagen","Audi","Opel","Renault","Другое"] },
    { id:"part_car_model", label:"Модель авто", type:"text" },
    { id:"part_year_from", label:"Год от", type:"number" },
    { id:"part_year_to", label:"Год до", type:"number" },
    { id:"part_category", label:"Раздел запчасти", type:"select", options:["Двигатель","Коробка","Ходовая","Кузов","Оптика","Электрика","Салон","Шины и диски","Масла","Аксессуары","Разборка"] },
    { id:"part_oem", label:"OEM / артикул", type:"text" },
    { id:"part_condition", label:"Состояние", type:"select", options:["Новая","Б/у","Восстановленная","На разборке"] },
    { id:"part_original", label:"Тип", type:"select", options:["Оригинал","Аналог","Не указано"] },
    { id:"part_manufacturer", label:"Производитель", type:"text" },
    { id:"part_warranty", label:"Гарантия", type:"select", options:["Есть","Нет"] },
    { id:"part_delivery", label:"Доставка", type:"select", options:["Есть","Нет","По договорённости"] }
  ],

  "Животные": [
    { id:"animal_type", label:"Вид", type:"select", options:["Собака","Кошка","Птица","Рыбы","Сельхоз животные","Грызуны","Рептилии","Корма","Аксессуары","Вет услуги"] },
    { id:"animal_breed", label:"Порода", type:"text" },
    { id:"animal_age", label:"Возраст", type:"text" },
    { id:"animal_gender", label:"Пол", type:"select", options:["Мальчик","Девочка","Не указано"] },
    { id:"animal_documents", label:"Документы", type:"select", options:["Есть","Нет"] },
    { id:"animal_vaccine", label:"Вакцинация", type:"select", options:["Есть","Нет","Частично"] },
    { id:"animal_chip", label:"Чип", type:"select", options:["Есть","Нет"] },
    { id:"animal_delivery", label:"Доставка", type:"select", options:["Есть","Нет","По договорённости"] }
  ],

  "Работа": [
    { id:"job_type", label:"Тип", type:"select", options:["Вакансия","Резюме","Подработка","Удалённая работа"] },
    { id:"job_position", label:"Должность", type:"text" },
    { id:"job_salary_from", label:"Зарплата от", type:"number" },
    { id:"job_salary_to", label:"Зарплата до", type:"number" },
    { id:"job_schedule", label:"График", type:"select", options:["Полный день","Сменный","Гибкий","Удалённо","Вахта","Подработка"] },
    { id:"job_experience", label:"Опыт", type:"select", options:["Без опыта","1-3 года","3-5 лет","5+ лет"] },
    { id:"job_employment", label:"Занятость", type:"select", options:["Полная","Частичная","Проектная","Стажировка"] },
    { id:"job_company", label:"Компания", type:"text" }
  ],

  "Услуги": [
    { id:"service_type", label:"Тип услуги", type:"select", options:["Строительство","Ремонт","Электрик","Сантехник","Сварщик","Грузчики","Красота","Обучение","IT","Фото/Видео","Реклама","Другое"] },
    { id:"service_visit", label:"Выезд на место", type:"select", options:["Да","Нет","По договорённости"] },
    { id:"service_experience", label:"Опыт", type:"text" },
    { id:"service_price_from", label:"Цена от", type:"number" },
    { id:"service_warranty", label:"Гарантия", type:"select", options:["Есть","Нет","По договорённости"] },
    { id:"service_schedule", label:"График работы", type:"text" }
  ],

  "Грузоперевозки": [
    { id:"cargo_type", label:"Тип услуги", type:"select", options:["Грузовое такси","Межгород","Международные","Курьер","Эвакуатор","Сборный груз","Грузчики"] },
    { id:"cargo_from", label:"Откуда", type:"text" },
    { id:"cargo_to", label:"Куда", type:"text" },
    { id:"cargo_vehicle", label:"Транспорт", type:"select", options:["Легковой","Минивэн","Пикап","Фургон","Газель","Грузовик","Фура","Эвакуатор"] },
    { id:"cargo_weight", label:"Вес", type:"text" },
    { id:"cargo_volume", label:"Объём", type:"text" },
    { id:"cargo_date", label:"Дата", type:"date" },
    { id:"cargo_loaders", label:"Грузчики", type:"select", options:["Нужны","Не нужны","По договорённости"] }
  ],

  "Туризм": [
    { id:"travel_type", label:"Тип", type:"select", options:["Тур","Отель","Апартаменты","Трансфер","Гид","Экскурсия","eSIM","Страховка"] },
    { id:"travel_direction", label:"Направление", type:"text" },
    { id:"travel_date", label:"Дата", type:"date" },
    { id:"travel_people", label:"Количество людей", type:"number" },
    { id:"travel_language", label:"Язык", type:"select", options:["Русский","Грузинский","Английский","Азербайджанский","Армянский","Турецкий"] },
    { id:"travel_transport", label:"Транспорт включён", type:"select", options:["Да","Нет","По договорённости"] }
  ]
};

function renderSmartCategoryFields(category) {
  const box = document.getElementById("smartCategoryFields") || document.getElementById("extraFields");
  if (!box) return;

  const fields = CATEGORY_FIELD_SCHEMAS[category] || [];
  if (!fields.length) {
    box.innerHTML = "";
    return;
  }

  box.innerHTML = fields.map(field => {
    if (field.type === "select") {
      return `
        <div class="field">
          <label>${field.label}</label>
          <select id="${field.id}" data-smart-field="true">
            <option value="">Выберите</option>
            ${field.options.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select>
        </div>
      `;
    }

    return `
      <div class="field">
        <label>${field.label}</label>
        <input id="${field.id}" data-smart-field="true" type="${field.type}" placeholder="${field.placeholder || ""}">
      </div>
    `;
  }).join("");
}

function collectSmartCategoryData() {
  const result = {};
  document.querySelectorAll("[data-smart-field='true']").forEach(el => {
    result[el.id] = el.value || "";
  });
  return result;
}

function smartDataToText(data) {
  if (!data || typeof data !== "object") return "";
  const labels = {};
  Object.values(CATEGORY_FIELD_SCHEMAS).flat().forEach(f => labels[f.id] = f.label);

  return Object.entries(data)
    .filter(([k, v]) => v)
    .map(([k, v]) => `${labels[k] || k}: ${v}`)
    .join("\\n");
}
