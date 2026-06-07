
const SUPABASE_URL = "https://hexatytkkerqhtsukozp.supabase.co";
const SUPABASE_KEY = "sb_publishable_Rs28uZ0iGl0YLrJm8yfxoA_Ba2sRgHC";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CITIES = ["Тбилиси","Батуми","Кутаиси","Рустави","Марнеули","Гори","Зугдиди","Телави","Поти","Кобулети"];

const CATEGORIES = [
  { ru:"Авто", ka:"ავტომობილები", az:"Avtomobillər", am:"Ավտոմեքենաներ", en:"Cars", icon:"🚗" },
  { ru:"Автозапчасти", ka:"ავტონაწილები", az:"Avto ehtiyat hissələri", am:"Ավտոպահեստամասեր", en:"Auto Parts", icon:"🔧" },
  { ru:"Недвижимость", ka:"უძრავი ქონება", az:"Daşınmaz əmlak", am:"Անշարժ գույք", en:"Real Estate", icon:"🏠" },
  { ru:"Работа", ka:"სამუშაო", az:"İş", am:"Աշխատանք", en:"Jobs", icon:"💼" },
  { ru:"Услуги", ka:"სერვისები", az:"Xidmətlər", am:"Ծառայություններ", en:"Services", icon:"🛠" },
  { ru:"Электроника", ka:"ელექტრონიკა", az:"Elektronika", am:"Էլեկտրոնիկա", en:"Electronics", icon:"📱" },
  { ru:"Строительство", ka:"მშენებლობა", az:"Tikinti", am:"Շինարարություն", en:"Construction", icon:"🏗" },
  { ru:"Сельское хозяйство", ka:"სოფლის მეურნეობა", az:"Kənd təsərrüfatı", am:"Գյուղատնտեսություն", en:"Agriculture", icon:"🚜" },
  { ru:"Животные", ka:"ცხოველები", az:"Heyvanlar", am:"Կենդանիներ", en:"Animals", icon:"🐾" },
  { ru:"Туризм", ka:"ტურიზმი", az:"Turizm", am:"Զբոսաշրջություն", en:"Tourism", icon:"✈️" },
  { ru:"Грузоперевозки", ka:"ტვირთის გადაზიდვა", az:"Yük daşımaları", am:"Բեռնափոխադրումներ", en:"Cargo", icon:"🚚" },
  { ru:"Бизнес", ka:"ბიზნესი", az:"Biznes", am:"Բիզնես", en:"Business", icon:"🏢" }
];

const SUBCATEGORIES = {
  "Авто": ["Легковые","Внедорожники","Грузовые","Мото","Автобусы","Запчасти"],
  "Недвижимость": ["Продажа квартир","Аренда квартир","Дома","Коммерческая","Земля"],
  "Работа": ["Вакансии","Резюме","Подработка"],
  "Услуги": ["Строительство","Ремонт","Электрик","Сантехник","Сварщик","IT"],
  "Грузоперевозки": ["По Грузии","Межгород","Международные","Грузовое такси","Курьер"],
  "Туризм": ["Туры","Трансферы","Гиды","Отели","eSIM","Страховка"]
};

function getLang() {
  return localStorage.getItem("gb_lang") || "ru";
}

function catName(cat) {
  return cat[getLang()] || cat.ru;
}

function setLang(lang) {
  localStorage.setItem("gb_lang", lang);
  location.reload();
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function money(value, currency) {
  return `${value || 0} ${currency || "GEL"}`;
}

const COMPANY_TYPES = [
  "Застройщик",
  "Агентство недвижимости",
  "Автодилер",
  "Магазин",
  "Производитель",
  "Перевозчик",
  "Турфирма",
  "Сервисная компания",
  "Другое"
];

const COMPANY_ROLES = [
  "owner",
  "admin",
  "manager",
  "sales",
  "accountant",
  "viewer"
];
