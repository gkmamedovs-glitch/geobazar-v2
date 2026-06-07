
const I18N = {
  ru: {
    nav_categories:"Категории", nav_listings:"Объявления", nav_cargo:"GeoCargo", nav_travel:"GeoTravel",
    nav_business:"Бизнес", nav_verification:"Верификация", nav_packages:"Пакеты", nav_post:"+ Подать объявление",
    login:"Войти", register:"Регистрация", cabinet:"Кабинет", logout:"Выйти",
    favorites:"Избранное", messages:"Сообщения", notifications:"Уведомления", reviews:"Отзывы",
    edit_listing:"Редактировать объявление", save:"Сохранить", archive:"Архивировать", restore:"Восстановить",
    delete:"Удалить", duplicate:"Дублировать", boost:"Поднять", vip:"VIP", stats:"Статистика",
    title:"Заголовок", price:"Цена", city:"Город", description:"Описание", category:"Категория"
  },
  ka: {
    nav_categories:"კატეგორიები", nav_listings:"განცხადებები", nav_cargo:"GeoCargo", nav_travel:"GeoTravel",
    nav_business:"ბიზნესი", nav_verification:"ვერიფიკაცია", nav_packages:"პაკეტები", nav_post:"+ განცხადების დამატება",
    login:"შესვლა", register:"რეგისტრაცია", cabinet:"კაბინეტი", logout:"გასვლა",
    favorites:"რჩეულები", messages:"შეტყობინებები", notifications:"ცნობები", reviews:"შეფასებები",
    edit_listing:"განცხადების რედაქტირება", save:"შენახვა", archive:"არქივი", restore:"აღდგენა",
    delete:"წაშლა", duplicate:"დუბლირება", boost:"აწევა", vip:"VIP", stats:"სტატისტიკა",
    title:"სათაური", price:"ფასი", city:"ქალაქი", description:"აღწერა", category:"კატეგორია"
  },
  az: {
    nav_categories:"Kateqoriyalar", nav_listings:"Elanlar", nav_cargo:"GeoCargo", nav_travel:"GeoTravel",
    nav_business:"Biznes", nav_verification:"Təsdiqləmə", nav_packages:"Paketlər", nav_post:"+ Elan yerləşdir",
    login:"Daxil ol", register:"Qeydiyyat", cabinet:"Kabinet", logout:"Çıxış",
    favorites:"Seçilmişlər", messages:"Mesajlar", notifications:"Bildirişlər", reviews:"Rəylər",
    edit_listing:"Elanı redaktə et", save:"Yadda saxla", archive:"Arxivlə", restore:"Bərpa et",
    delete:"Sil", duplicate:"Kopyala", boost:"Yuxarı qaldır", vip:"VIP", stats:"Statistika",
    title:"Başlıq", price:"Qiymət", city:"Şəhər", description:"Təsvir", category:"Kateqoriya"
  },
  en: {
    nav_categories:"Categories", nav_listings:"Listings", nav_cargo:"GeoCargo", nav_travel:"GeoTravel",
    nav_business:"Business", nav_verification:"Verification", nav_packages:"Packages", nav_post:"+ Post listing",
    login:"Login", register:"Register", cabinet:"Dashboard", logout:"Logout",
    favorites:"Favorites", messages:"Messages", notifications:"Notifications", reviews:"Reviews",
    edit_listing:"Edit listing", save:"Save", archive:"Archive", restore:"Restore",
    delete:"Delete", duplicate:"Duplicate", boost:"Boost", vip:"VIP", stats:"Stats",
    title:"Title", price:"Price", city:"City", description:"Description", category:"Category"
  },
  am: {
    nav_categories:"Կատեգորիաներ", nav_listings:"Հայտարարություններ", nav_cargo:"GeoCargo", nav_travel:"GeoTravel",
    nav_business:"Բիզնես", nav_verification:"Ստուգում", nav_packages:"Փաթեթներ", nav_post:"+ Ավելացնել հայտարարություն",
    login:"Մուտք", register:"Գրանցում", cabinet:"Կաբինետ", logout:"Ելք",
    favorites:"Ընտրյալներ", messages:"Հաղորդագրություններ", notifications:"Ծանուցումներ", reviews:"Կարծիքներ",
    edit_listing:"Խմբագրել հայտարարությունը", save:"Պահպանել", archive:"Արխիվ", restore:"Վերականգնել",
    delete:"Ջնջել", duplicate:"Կրկնօրինակել", boost:"Բարձրացնել", vip:"VIP", stats:"Վիճակագրություն",
    title:"Վերնագիր", price:"Գին", city:"Քաղաք", description:"Նկարագրություն", category:"Կատեգորիա"
  }
};

function tr(key) {
  const lang = getLang ? getLang() : (localStorage.getItem("gb_lang") || "ru");
  return (I18N[lang] && I18N[lang][key]) || I18N.ru[key] || key;
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerText = tr(el.getAttribute("data-i18n"));
  });
}
document.addEventListener("DOMContentLoaded", applyStaticTranslations);
