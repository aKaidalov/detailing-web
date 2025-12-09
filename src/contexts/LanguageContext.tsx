import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'et' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'app.name': 'ADetailing',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.logout': 'Logout',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.status': 'Status',
    'common.actions': 'Actions',

    // Landing
    'landing.hero.title': 'Professional Car Detailing Services',
    'landing.hero.subtitle': 'Premium care for your vehicle with convenient online booking',
    'landing.hero.cta': 'Book Now',
    'landing.services.title': 'Our Services',
    'landing.contact.title': 'Contact Us',
    'landing.contact.phone': 'Phone',
    'landing.contact.email': 'Email',
    'landing.contact.address': 'Address',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.login.title': 'Login to Your Account',
    'auth.register.title': 'Create an Account',
    'auth.continueAsGuest': 'Continue as Guest',

    // Services
    'service.fullWash': 'Full Wash',
    'service.exteriorWash': 'Exterior Wash',
    'service.interiorCleaning': 'Interior Cleaning',
    'service.fullWash.desc': 'Interior + Exterior',
    'service.exteriorWash.desc': 'Pre-soak, tar removal, hand wash with shampoo, wheel wash, hand drying, door jamb cleaning, tire shine',
    'service.interiorCleaning.desc': 'Floor mat cleaning, window cleaning, surface cleaning, air vent cleaning, vacuuming of the cabin and trunk',

    // Vehicle types
    'vehicle.motorcycle': 'Motorcycle',
    'vehicle.car': 'Car',
    'vehicle.van': 'Van',

    // Add-ons
    'addon.rustRemoval': 'Rust spot removal',
    'addon.quickCeramic': 'Quick ceramic coating',
    'addon.bodyWaxing': 'Body waxing – lasts up to 6 months',
    'addon.polishing': 'Polishing',
    'addon.carCeramic': 'Car ceramic coating',
    'addon.textileSeats': 'Textile seat cleaning',
    'addon.leatherCare': 'Leather seat care',
    'addon.ozoneOdor': 'Odor removal with ozone',
    'addon.leatherCeramic': 'Leather ceramic coating',
    'addon.extraDirty': 'Extra dirty vehicle surcharge',

    // Delivery
    'delivery.pickup': 'We pick up the car',
    'delivery.myself': 'I bring it myself',

    // Booking
    'booking.title': 'New Booking',
    'booking.step.vehicle': 'Vehicle Type',
    'booking.step.service': 'Select Service',
    'booking.step.addons': 'Add-ons',
    'booking.step.delivery': 'Delivery Option',
    'booking.step.time': 'Choose Time',
    'booking.step.details': 'Your Details',
    'booking.step.confirm': 'Confirmation',
    'booking.myBookings': 'My Bookings',
    'booking.status.pending': 'Pending',
    'booking.status.confirmed': 'Confirmed',
    'booking.status.inProgress': 'In Progress',
    'booking.status.completed': 'Completed',
    'booking.status.cancelled': 'Cancelled',

    // Client Dashboard
    'client.dashboard': 'Dashboard',
    'client.profile': 'Profile',
    'client.bookings': 'My Bookings',
    'client.newBooking': 'New Booking',

    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.services': 'Services',
    'admin.bookings': 'Bookings',
    'admin.timeslots': 'Time Slots',
    'admin.users': 'Users',
    'admin.notifications': 'Notifications',
    'admin.statistics': 'Statistics',
    'admin.settings': 'Settings',
    'admin.kpi.totalBookings': 'Total Bookings',
    'admin.kpi.revenue': 'Revenue',
    'admin.kpi.pendingApprovals': 'Pending Approvals',
    'admin.kpi.activeClients': 'Active Clients',
  },
  et: {
    // Common
    'app.name': 'ADetailing',
    'common.login': 'Logi sisse',
    'common.register': 'Registreeri',
    'common.logout': 'Logi välja',
    'common.save': 'Salvesta',
    'common.cancel': 'Tühista',
    'common.delete': 'Kustuta',
    'common.edit': 'Muuda',
    'common.add': 'Lisa',
    'common.submit': 'Esita',
    'common.back': 'Tagasi',
    'common.next': 'Edasi',
    'common.search': 'Otsi',
    'common.filter': 'Filtreeri',
    'common.status': 'Staatus',
    'common.actions': 'Tegevused',

    // Landing
    'landing.hero.title': 'Professionaalne Autopesula Teenus',
    'landing.hero.subtitle': 'Kvaliteetne hooldus teie sõidukile mugava veebibroneerimisel',
    'landing.hero.cta': 'Broneeri Kohe',
    'landing.services.title': 'Meie Teenused',
    'landing.contact.title': 'Kontakt',
    'landing.contact.phone': 'Telefon',
    'landing.contact.email': 'E-post',
    'landing.contact.address': 'Aadress',

    // Auth
    'auth.email': 'E-post',
    'auth.password': 'Salasõna',
    'auth.confirmPassword': 'Kinnita salasõna',
    'auth.name': 'Täisnimi',
    'auth.phone': 'Telefoninumber',
    'auth.login.title': 'Logi sisse oma kontole',
    'auth.register.title': 'Loo konto',
    'auth.continueAsGuest': 'Jätka külalisena',

    // Services
    'service.fullWash': 'Täispesu',
    'service.exteriorWash': 'Välispesu',
    'service.interiorCleaning': 'Sisepuhastus',
    'service.fullWash.desc': 'Sise + Välis',
    'service.exteriorWash.desc': 'Eelleotus, tõrva eemaldamine, käsipesu šampooniga, rataste pesu, käsikuivatamine, uste piirde puhastamine, rehvide läige',
    'service.interiorCleaning.desc': 'Põrandamatide puhastamine, akende puhastamine, pindade puhastamine, õhuavade puhastamine, saloongi ja pagasiruumi tolmuimeja',

    // Vehicle types
    'vehicle.motorcycle': 'Mootorratas',
    'vehicle.car': 'Auto',
    'vehicle.van': 'Kaubik',

    // Add-ons
    'addon.rustRemoval': 'Roostetäppide eemaldamine',
    'addon.quickCeramic': 'Kiire keraamiline kate',
    'addon.bodyWaxing': 'Kere vahatamine – kestab kuni 6 kuud',
    'addon.polishing': 'Poleerimine',
    'addon.carCeramic': 'Auto keraamiline kate',
    'addon.textileSeats': 'Tekstiilist istmete puhastus',
    'addon.leatherCare': 'Nahkistmete hooldus',
    'addon.ozoneOdor': 'Lõhna eemaldamine osooniga',
    'addon.leatherCeramic': 'Naha keraamiline kate',
    'addon.extraDirty': 'Eriti määrdunud sõiduki lisatasu',

    // Delivery
    'delivery.pickup': 'Me võtame auto vastu',
    'delivery.myself': 'Toon ise',

    // Booking
    'booking.title': 'Uus Broneering',
    'booking.step.vehicle': 'Sõiduki tüüp',
    'booking.step.service': 'Vali teenus',
    'booking.step.addons': 'Lisateenused',
    'booking.step.delivery': 'Kohaletoimetamine',
    'booking.step.time': 'Vali aeg',
    'booking.step.details': 'Teie andmed',
    'booking.step.confirm': 'Kinnitus',
    'booking.myBookings': 'Minu broneeringud',
    'booking.status.pending': 'Ootel',
    'booking.status.confirmed': 'Kinnitatud',
    'booking.status.inProgress': 'Töös',
    'booking.status.completed': 'Lõpetatud',
    'booking.status.cancelled': 'Tühistatud',

    // Client Dashboard
    'client.dashboard': 'Töölaud',
    'client.profile': 'Profiil',
    'client.bookings': 'Minu broneeringud',
    'client.newBooking': 'Uus broneering',

    // Admin
    'admin.dashboard': 'Admini Töölaud',
    'admin.services': 'Teenused',
    'admin.bookings': 'Broneeringud',
    'admin.timeslots': 'Ajaslotid',
    'admin.users': 'Kasutajad',
    'admin.notifications': 'Teavitused',
    'admin.statistics': 'Statistika',
    'admin.settings': 'Seaded',
    'admin.kpi.totalBookings': 'Kokku broneeringuid',
    'admin.kpi.revenue': 'Tulu',
    'admin.kpi.pendingApprovals': 'Ootel kinnitused',
    'admin.kpi.activeClients': 'Aktiivsed kliendid',
  },
  ru: {
    // Common
    'app.name': 'ADetailing',
    'common.login': 'Войти',
    'common.register': 'Регистрация',
    'common.logout': 'Выйти',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Изменить',
    'common.add': 'Добавить',
    'common.submit': 'Отправить',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.status': 'Статус',
    'common.actions': 'Действия',

    // Landing
    'landing.hero.title': 'Профессиональная детейлинг услуга',
    'landing.hero.subtitle': 'Качественный уход за вашим автомобилем с удобным онлайн-бронированием',
    'landing.hero.cta': 'Забронировать',
    'landing.services.title': 'Наши услуги',
    'landing.contact.title': 'Контакты',
    'landing.contact.phone': 'Телефон',
    'landing.contact.email': 'Email',
    'landing.contact.address': 'Адрес',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.name': 'Полное имя',
    'auth.phone': 'Номер телефона',
    'auth.login.title': 'Войти в аккаунт',
    'auth.register.title': 'Создать аккаунт',
    'auth.continueAsGuest': 'Продолжить как гость',

    // Services
    'service.fullWash': 'Полная мойка',
    'service.exteriorWash': 'Внешняя мойка',
    'service.interiorCleaning': 'Внутренняя уборка',
    'service.fullWash.desc': 'Салон + Кузов',
    'service.exteriorWash.desc': 'Предварительное замачивание, удаление битума, ручная мойка шампунем, мойка колес, ручная сушка, чистка дверных проемов, блеск шин',
    'service.interiorCleaning.desc': 'Чистка ковриков, мойка окон, чистка поверхностей, чистка вентиляционных отверстий, пылесос салона и багажника',

    // Vehicle types
    'vehicle.motorcycle': 'Мотоцикл',
    'vehicle.car': 'Автомобиль',
    'vehicle.van': 'Фургон',

    // Add-ons
    'addon.rustRemoval': 'Удаление пятен ржавчины',
    'addon.quickCeramic': 'Быстрое керамическое покрытие',
    'addon.bodyWaxing': 'Восковое покрытие кузова – держится до 6 месяцев',
    'addon.polishing': 'Полировка',
    'addon.carCeramic': 'Керамическое покрытие автомобиля',
    'addon.textileSeats': 'Чистка тканевых сидений',
    'addon.leatherCare': 'Уход за кожаными сиденьями',
    'addon.ozoneOdor': 'Удаление запаха озоном',
    'addon.leatherCeramic': 'Керамическое покрытие кожи',
    'addon.extraDirty': 'Доплата за сильно загрязненный автомобиль',

    // Delivery
    'delivery.pickup': 'Мы заберем машину',
    'delivery.myself': 'Привезу сам',

    // Booking
    'booking.title': 'Новое бронирование',
    'booking.step.vehicle': 'Тип транспорта',
    'booking.step.service': 'Выберите услугу',
    'booking.step.addons': 'Дополнительные услуги',
    'booking.step.delivery': 'Способ доставки',
    'booking.step.time': 'Выберите время',
    'booking.step.details': 'Ваши данные',
    'booking.step.confirm': 'Подтверждение',
    'booking.myBookings': 'Мои бронирования',
    'booking.status.pending': 'Ожидает',
    'booking.status.confirmed': 'Подтверждено',
    'booking.status.inProgress': 'В работе',
    'booking.status.completed': 'Завершено',
    'booking.status.cancelled': 'Отменено',

    // Client Dashboard
    'client.dashboard': 'Панель',
    'client.profile': 'Профиль',
    'client.bookings': 'Мои бронирования',
    'client.newBooking': 'Новое бронирование',

    // Admin
    'admin.dashboard': 'Админ панель',
    'admin.services': 'Услуги',
    'admin.bookings': 'Бронирования',
    'admin.timeslots': 'Временные слоты',
    'admin.users': 'Пользователи',
    'admin.notifications': 'Уведомления',
    'admin.statistics': 'Статистика',
    'admin.settings': 'Настройки',
    'admin.kpi.totalBookings': 'Всего бронирований',
    'admin.kpi.revenue': 'Доход',
    'admin.kpi.pendingApprovals': 'Ожидают подтверждения',
    'admin.kpi.activeClients': 'Активные клиенты',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
