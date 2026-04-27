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
};
