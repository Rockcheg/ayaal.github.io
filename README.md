# JINAUTO14 — мой сайт на Github Pages

## Что внутри
- Главная страница
- Каталог с поиском и фильтром
- Страница заявки на запчасти
- Доставка и оплата
- Контакты

## Памятка как редактировать товары
Открыть файл `js/products.js`.

Каждый товар — это отдельный объект:

```js
{
  id: 1,
  name: 'Название товара',
  category: 'Коврики',
  price: 4500,
  deliveryPrice: 5300,
  weight: '2.4 кг',
  sku: 'ART-001',
  availability: 'В наличии',
  image: 'images/your-image.jpg',
  description: 'Описание товара'
}
```

## Как подключить уведомления на почту
### Вариант 1: Formspree
1. Создай форму в Formspree.
2. Возьми endpoint вида `https://formspree.io/f/xxxxxxx`.
3. Открой `order-parts.html`.
4. Замени `REPLACE_WITH_YOUR_FORM_ID` на свой ID.

### Вариант 2: EmailJS
Можно подключить EmailJS через JavaScript, если захочешь отправлять заявки без классического HTML action.

## Что обязательно заменить
- Telegram-ссылку в `js/app.js`
- Контакты в `contacts.html`
- Тестовые товары и картинки
