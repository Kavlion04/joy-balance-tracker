export type Lang = "ru" | "uz" | "en";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "uz", label: "UZ", flag: "🇺🇿" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

type Dict = Record<string, { ru: string; uz: string; en: string }>;

export const t: Dict = {
  // Common
  app_name: { ru: "Финансы", uz: "Moliya", en: "Finance" },
  hello: { ru: "Привет 👋", uz: "Salom 👋", en: "Hello 👋" },
  my_finances: { ru: "Мои финансы", uz: "Mening moliyam", en: "My finances" },
  today: { ru: "Сегодня", uz: "Bugun", en: "Today" },
  balance_day: { ru: "Баланс за день", uz: "Kunlik balans", en: "Daily balance" },
  income: { ru: "Доходы", uz: "Daromad", en: "Income" },
  expense: { ru: "Расходы", uz: "Xarajat", en: "Expense" },
  income_short: { ru: "Доход", uz: "Daromad", en: "Income" },
  expense_short: { ru: "Расход", uz: "Xarajat", en: "Expense" },
  all: { ru: "Все", uz: "Hammasi", en: "All" },
  no_ops_today: { ru: "Нет операций. Нажмите + чтобы добавить.", uz: "Operatsiyalar yo‘q. Qo‘shish uchun + bosing.", en: "No transactions. Tap + to add." },
  no_ops_period: { ru: "Нет операций за выбранный период", uz: "Tanlangan davrda operatsiyalar yo‘q", en: "No transactions for the selected period" },
  no_data: { ru: "Нет данных за период", uz: "Davr uchun ma’lumot yo‘q", en: "No data for the period" },
  total: { ru: "Всего", uz: "Jami", en: "Total" },

  // Modal
  new_op: { ru: "Новая операция", uz: "Yangi operatsiya", en: "New transaction" },
  amount: { ru: "Сумма", uz: "Summa", en: "Amount" },
  category: { ru: "Категория", uz: "Kategoriya", en: "Category" },
  pick_category: { ru: "Выберите категорию", uz: "Kategoriyani tanlang", en: "Pick a category" },
  date: { ru: "Дата", uz: "Sana", en: "Date" },
  comment: { ru: "Комментарий", uz: "Izoh", en: "Comment" },
  optional: { ru: "Необязательно", uz: "Ixtiyoriy", en: "Optional" },
  save: { ru: "Сохранить", uz: "Saqlash", en: "Save" },
  saving: { ru: "Сохранение…", uz: "Saqlanmoqda…", en: "Saving…" },
  enter_amount: { ru: "Введите сумму", uz: "Summani kiriting", en: "Enter amount" },
  pick_cat_err: { ru: "Выберите категорию", uz: "Kategoriyani tanlang", en: "Pick a category" },
  added_income: { ru: "Доход добавлен", uz: "Daromad qo‘shildi", en: "Income added" },
  added_expense: { ru: "Расход добавлен", uz: "Xarajat qo‘shildi", en: "Expense added" },
  deleted: { ru: "Удалено", uz: "O‘chirildi", en: "Deleted" },
  delete_failed: { ru: "Не удалось удалить", uz: "O‘chirib bo‘lmadi", en: "Could not delete" },

  // Stats
  statistics: { ru: "Статистика", uz: "Statistika", en: "Statistics" },
  by_category: { ru: "Распределение по категориям", uz: "Kategoriyalar bo‘yicha taqsimot", en: "Breakdown by category" },
  day: { ru: "День", uz: "Kun", en: "Day" },
  week: { ru: "Неделя", uz: "Hafta", en: "Week" },
  month: { ru: "Месяц", uz: "Oy", en: "Month" },

  // Filter
  filter: { ru: "Фильтр", uz: "Filtr", en: "Filter" },
  filter_sub: { ru: "Статистика за выбранные дни", uz: "Tanlangan kunlar statistikasi", en: "Stats for selected days" },
  pick_period: { ru: "Выберите период", uz: "Davrni tanlang", en: "Pick a period" },
  range_2d: { ru: "2 дня", uz: "2 kun", en: "2 days" },
  range_3d: { ru: "3 дня", uz: "3 kun", en: "3 days" },
  range_7d: { ru: "7 дней", uz: "7 kun", en: "7 days" },
  custom: { ru: "Свой", uz: "O‘zim", en: "Custom" },

  // Auth
  login: { ru: "Вход", uz: "Kirish", en: "Sign in" },
  register: { ru: "Регистрация", uz: "Ro‘yxatdan o‘tish", en: "Register" },
  login_account: { ru: "Войдите в аккаунт", uz: "Hisobga kiring", en: "Sign in to your account" },
  create_account: { ru: "Создайте аккаунт", uz: "Hisob yarating", en: "Create an account" },
  phone: { ru: "Номер телефона", uz: "Telefon raqami", en: "Phone number" },
  password: { ru: "Пароль", uz: "Parol", en: "Password" },
  password_min: { ru: "Минимум 6 символов", uz: "Kamida 6 ta belgi", en: "At least 6 characters" },
  enter: { ru: "Войти", uz: "Kirish", en: "Sign in" },
  create: { ru: "Создать аккаунт", uz: "Hisob yaratish", en: "Create account" },
  invalid_phone: { ru: "Введите корректный номер", uz: "To‘g‘ri raqam kiriting", en: "Enter a valid number" },
  password_short: { ru: "Пароль минимум 6 символов", uz: "Parol kamida 6 ta belgi", en: "Password must be 6+ characters" },
  already_registered: { ru: "Этот номер уже зарегистрирован", uz: "Bu raqam allaqachon ro‘yxatdan o‘tgan", en: "This number is already registered" },
  registered_ok: { ru: "Регистрация успешна!", uz: "Ro‘yxatdan o‘tdingiz!", en: "Registration successful!" },
  invalid_creds: { ru: "Неверный номер или пароль", uz: "Raqam yoki parol noto‘g‘ri", en: "Invalid number or password" },
  data_safe: { ru: "Ваши данные защищены. Доступ только по вашему паролю.", uz: "Ma’lumotlaringiz himoyalangan. Kirish faqat parol orqali.", en: "Your data is secure. Access only with your password." },

  // Nav
  nav_home: { ru: "Главная", uz: "Asosiy", en: "Home" },
  nav_stats: { ru: "Статистика", uz: "Statistika", en: "Stats" },
  nav_filter: { ru: "Фильтр", uz: "Filtr", en: "Filter" },

  // Currency
  currency: { ru: "сум", uz: "so‘m", en: "UZS" },

  // Settings
  nav_settings: { ru: "Настройки", uz: "Sozlamalar", en: "Settings" },
  settings: { ru: "Настройки", uz: "Sozlamalar", en: "Settings" },
  profile: { ru: "Профиль", uz: "Profil", en: "Profile" },
  display_name: { ru: "Имя", uz: "Ism", en: "Display name" },
  your_name: { ru: "Ваше имя", uz: "Ismingiz", en: "Your name" },
  upload_avatar: { ru: "Загрузить фото", uz: "Rasm yuklash", en: "Upload photo" },
  remove_avatar: { ru: "Удалить", uz: "O‘chirish", en: "Remove" },
  saved: { ru: "Сохранено", uz: "Saqlandi", en: "Saved" },
  trash: { ru: "Корзина", uz: "Savatcha", en: "Trash" },
  trash_empty: { ru: "Корзина пуста", uz: "Savatcha bo‘sh", en: "Trash is empty" },
  restore: { ru: "Восстановить", uz: "Tiklash", en: "Restore" },
  delete_forever: { ru: "Удалить навсегда", uz: "Butunlay o‘chirish", en: "Delete forever" },
  empty_trash: { ru: "Очистить корзину", uz: "Savatchani tozalash", en: "Empty trash" },
  restored: { ru: "Восстановлено", uz: "Tiklandi", en: "Restored" },
  account: { ru: "Аккаунт", uz: "Hisob", en: "Account" },
  logout: { ru: "Выйти", uz: "Chiqish", en: "Sign out" },
  logout_confirm_title: { ru: "Выйти из аккаунта?", uz: "Hisobdan chiqasizmi?", en: "Sign out?" },
  logout_confirm_desc: { ru: "Вы сможете снова войти, используя свой номер и пароль.", uz: "Raqam va parolingiz bilan qayta kirishingiz mumkin.", en: "You can sign back in with your phone and password." },
  cancel: { ru: "Отмена", uz: "Bekor qilish", en: "Cancel" },

  // Welcome modal
  welcome: { ru: "Добро пожаловать!", uz: "Xush kelibsiz!", en: "Welcome!" },
  welcome_sub: { ru: "Расскажите немного о себе", uz: "O‘zingiz haqingizda biroz ma’lumot bering", en: "Tell us a little about you" },
  skip: { ru: "Пропустить", uz: "O‘tkazib yuborish", en: "Skip" },
  continue: { ru: "Продолжить", uz: "Davom etish", en: "Continue" },

  // Auth states
  loading: { ru: "Загрузка…", uz: "Yuklanmoqda…", en: "Loading…" },
  signing_in: { ru: "Вход…", uz: "Kirilmoqda…", en: "Signing in…" },
  registering: { ru: "Регистрация…", uz: "Ro‘yxatdan o‘tilmoqda…", en: "Registering…" },
  network_error: { ru: "Ошибка сети. Проверьте подключение.", uz: "Tarmoq xatosi. Internetni tekshiring.", en: "Network error. Check your connection." },
  upload_failed: { ru: "Не удалось загрузить", uz: "Yuklab bo‘lmadi", en: "Upload failed" },
  save_failed: { ru: "Не удалось сохранить", uz: "Saqlab bo‘lmadi", en: "Could not save" },
  registration_failed: { ru: "Регистрация не удалась. Попробуйте позже.", uz: "Ro‘yxatdan o‘tib bo‘lmadi. Keyinroq urinib ko‘ring.", en: "Registration failed. Please try again." },

  // Appearance
  appearance: { ru: "Оформление", uz: "Ko‘rinish", en: "Appearance" },
  background: { ru: "Фон", uz: "Fon", en: "Background" },
  upload_background: { ru: "Загрузить фон", uz: "Fon yuklash", en: "Upload background" },
  no_background: { ru: "Фон не выбран", uz: "Fon tanlanmagan", en: "No background set" },
  accent_color: { ru: "Акцентный цвет", uz: "Asosiy rang", en: "Accent color" },
  text_size: { ru: "Размер текста", uz: "Matn hajmi", en: "Text size" },
  reset: { ru: "Сброс", uz: "Tiklash", en: "Reset" },

  // Install
  install_app: { ru: "Установить приложение", uz: "Ilovani o‘rnatish", en: "Install app" },
  install_hint_ios: { ru: "На iPhone: «Поделиться» → «На экран «Домой»»", uz: "iPhone’da: «Ulashish» → «Bosh ekranga»", en: "On iPhone: Share → Add to Home Screen" },
  install_unavailable: { ru: "Установка недоступна в этом браузере", uz: "Ushbu brauzerda o‘rnatish mavjud emas", en: "Install not available in this browser" },
  installed: { ru: "Установлено!", uz: "O‘rnatildi!", en: "Installed!" },
  install_ios_title: { ru: "Установить на iPhone", uz: "iPhone’ga o‘rnatish", en: "Install on iPhone" },
  install_ios_step1: { ru: "Нажмите кнопку «Поделиться» внизу Safari", uz: "Safari pastidagi «Ulashish» tugmasini bosing", en: "Tap the Share button at the bottom of Safari" },
  install_ios_step2: { ru: "Выберите «На экран «Домой»» в меню", uz: "Menyudan «Bosh ekranga» ni tanlang", en: "Choose “Add to Home Screen” in the menu" },
  install_ios_step3: { ru: "Нажмите «Добавить» в правом верхнем углу", uz: "O‘ng yuqori burchakdagi «Qo‘shish» ni bosing", en: "Tap “Add” in the top-right corner" },
  install_ios_safari_only: { ru: "Откройте этот сайт в Safari, чтобы установить приложение. В Chrome на iPhone установка недоступна.", uz: "Ilovani o‘rnatish uchun ushbu saytni Safari’da oching. iPhone’dagi Chrome’da o‘rnatish mavjud emas.", en: "Open this site in Safari to install the app. Installing isn’t available in Chrome on iPhone." },
  got_it: { ru: "Понятно", uz: "Tushunarli", en: "Got it" },

  // Network
  you_are_offline: { ru: "Нет подключения к интернету", uz: "Internetga ulanish yo‘q", en: "You are offline" },
  back_online: { ru: "Снова в сети", uz: "Yana onlayn", en: "Back online" },
  offline_modal_desc: { ru: "Проверьте подключение и подождите. Приложение продолжит работу автоматически.", uz: "Ulanishni tekshiring va kuting. Ilova avtomatik davom etadi.", en: "Check your connection and wait. The app will resume automatically." },

  // Sound
  sound: { ru: "Звук", uz: "Ovoz", en: "Sound" },
  welcome_chime: { ru: "Приветственный звук", uz: "Salomlashuv ohangi", en: "Welcome chime" },
  welcome_chime_desc: { ru: "Тихий звон при входе в приложение", uz: "Ilovaga kirganda yumshoq ohang", en: "A soft tone when you open the app" },

  // PIN lock
  pin_create_title: { ru: "Создайте PIN-код", uz: "PIN-kod yarating", en: "Create a PIN" },
  pin_create_sub: { ru: "4 цифры. Не все одинаковые.", uz: "4 raqam. Barchasi bir xil bo‘lmasin.", en: "4 digits. Not all the same." },
  pin_confirm_title: { ru: "Повторите PIN-код", uz: "PIN-kodni takrorlang", en: "Confirm your PIN" },
  pin_confirm_sub: { ru: "Введите тот же PIN ещё раз", uz: "Xuddi shu PIN-kodni qayta kiriting", en: "Enter the same PIN again" },
  pin_unlock_title: { ru: "Введите PIN-код", uz: "PIN-kodni kiriting", en: "Enter your PIN" },
  pin_unlock_sub: { ru: "Разблокируйте приложение", uz: "Ilovani qulfdan chiqaring", en: "Unlock the app" },
  pin_invalid: { ru: "Все 4 цифры не должны совпадать", uz: "4 ta raqam bir xil bo‘lmasligi kerak", en: "All 4 digits cannot be the same" },
  pin_mismatch: { ru: "PIN-коды не совпадают", uz: "PIN-kodlar mos kelmadi", en: "PINs don’t match" },
  pin_wrong: { ru: "Неверный PIN-код", uz: "PIN-kod noto‘g‘ri", en: "Wrong PIN" },
  pin_set: { ru: "PIN-код установлен", uz: "PIN-kod o‘rnatildi", en: "PIN set" },
  biometric_enabled: { ru: "Отпечаток пальца включён", uz: "Barmoq izi yoqildi", en: "Fingerprint enabled" },
  biometric_unlock: { ru: "Разблокировать отпечатком", uz: "Barmoq izi bilan ochish", en: "Unlock with fingerprint" },
  biometric_failed: { ru: "Не удалось распознать", uz: "Tanib bo‘lmadi", en: "Biometric failed" },
  pin_change: { ru: "Изменить PIN-код", uz: "PIN-kodni o‘zgartirish", en: "Change PIN" },
  biometric: { ru: "Отпечаток пальца / Face ID", uz: "Barmoq izi / Face ID", en: "Fingerprint / Face ID" },
  biometric_desc: { ru: "Быстрая разблокировка биометрией", uz: "Biometriya bilan tezkor ochish", en: "Quick unlock with biometrics" },
  security: { ru: "Безопасность", uz: "Xavfsizlik", en: "Security" },
  biometric_enable_now: { ru: "Включить Face ID / отпечаток", uz: "Face ID / barmoq izini yoqish", en: "Enable Face ID / fingerprint" },

  // Edit / categories
  edit_op: { ru: "Изменить операцию", uz: "Operatsiyani tahrirlash", en: "Edit transaction" },
  new_category: { ru: "Новая категория", uz: "Yangi kategoriya", en: "New category" },
  name: { ru: "Название", uz: "Nomi", en: "Name" },
  emoji: { ru: "Эмодзи", uz: "Emoji", en: "Emoji" },
  enter_name: { ru: "Введите название", uz: "Nomini kiriting", en: "Enter a name" },
  categories_section: { ru: "Категории", uz: "Kategoriyalar", en: "Categories" },
  no_custom_cats: { ru: "Своих категорий пока нет", uz: "Hali shaxsiy kategoriyalar yo‘q", en: "No custom categories yet" },

  // Theme
  theme: { ru: "Тема", uz: "Mavzu", en: "Theme" },
  theme_light: { ru: "Светлая", uz: "Yorug‘", en: "Light" },
  theme_dark: { ru: "Тёмная", uz: "Tungi", en: "Dark" },
  theme_system: { ru: "Системная", uz: "Tizim", en: "System" },

  // Device
  device: { ru: "Устройство", uz: "Qurilma", en: "Device" },
  current_device: { ru: "Текущее устройство", uz: "Joriy qurilma", en: "Current device" },
  browser: { ru: "Браузер", uz: "Brauzer", en: "Browser" },
  screen: { ru: "Экран", uz: "Ekran", en: "Screen" },
  online: { ru: "В сети", uz: "Onlayn", en: "Online" },
  offline: { ru: "Не в сети", uz: "Oflayn", en: "Offline" },
  other_sessions_desc: { ru: "Завершить все другие сессии этого аккаунта.", uz: "Hisobning boshqa barcha sessiyalarini yakunlang.", en: "Sign out of all other sessions for this account." },
  sign_out_others: { ru: "Выйти на других устройствах", uz: "Boshqa qurilmalardan chiqish", en: "Sign out other devices" },
  other_sessions_signed_out: { ru: "Другие сессии завершены", uz: "Boshqa sessiyalar yakunlandi", en: "Other sessions ended" },
};
