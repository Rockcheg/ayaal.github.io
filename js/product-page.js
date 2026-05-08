(() => {
  const siteLinks = window.SITE_LINKS || {};
  const products = Array.isArray(window.products) ? window.products : [];

  const formatPrice = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const getIdFromQuery = () => new URLSearchParams(window.location.search).get('id');

  const renderNotFound = () => {
    const page = document.getElementById('productPage');
    const crumbs = document.getElementById('breadcrumbs');
    if (!page) return;
    if (crumbs) crumbs.innerHTML = '<a href="index.html">Главная</a> <span>→</span> <a href="catalog.html">Каталог</a> <span>→</span> <span>Товар не найден</span>';
    page.innerHTML = `
      <article class="feature-card">
        <h1>Товар не найден</h1>
        <p class="lead narrow">Возможно, ссылка устарела или товар был удалён из каталога.</p>
        <a class="btn btn-primary" href="catalog.html">Вернуться в каталог</a>
      </article>
    `;
  };

  const createGallery = (product) => {
    const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
    return { images, main: images[0] };
  };

  const renderProduct = (product) => {
    const page = document.getElementById('productPage');
    const crumbs = document.getElementById('breadcrumbs');
    if (!page) return;

    const { images, main } = createGallery(product);
    const msg = encodeURIComponent(`Здравствуйте! Интересует товар: ${product.name} (${product.sku}).`);

    if (crumbs) {
      crumbs.innerHTML = `<a href="index.html">Главная</a> <span>→</span> <a href="catalog.html">Каталог</a> <span>→</span> <span>${product.name}</span>`;
    }

    document.title = `${product.name} — JINAUTO14`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', `${product.name}. ${product.description}`);

    page.innerHTML = `
      <div class="product-page-layout">
        <div>
          <div class="product-page-main-image"><img id="mainProductImage" src="${main}" alt="${product.name}"></div>
          <div class="product-page-thumbs">
            ${images.map((src, idx) => `<button class="thumb-btn ${idx===0?'active':''}" data-src="${src}"><img src="${src}" alt="${product.name} фото ${idx+1}"></button>`).join('')}
          </div>
        </div>
        <aside class="product-page-info">
          <span class="product-badge">${product.category}</span>
          <h1>${product.name}</h1>
          <p class="product-subcategory">${product.subcategory}</p>
          <ul class="product-meta product-page-meta">
            <li><strong>Артикул:</strong> ${product.sku}</li>
            <li><strong>Наличие:</strong> ${product.availability}</li>
            <li><strong>Вес:</strong> ${product.weight}</li>
          </ul>
          <div class="product-prices">
            <div class="price-box"><span class="price-label">Цена товара</span><strong class="price-value">${formatPrice(product.price)}</strong></div>
            <div class="price-box price-box-delivery"><span class="price-label">Ориентировочно с доставкой</span><strong class="price-value">${formatPrice(product.deliveryPrice)}</strong></div>
          </div>
          <div class="product-page-actions">
            <a class="btn btn-primary" target="_blank" rel="noopener" href="${siteLinks.telegramProfile}?text=${msg}">Заказать в Telegram</a>
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="${siteLinks.maxProfile}?text=${msg}">Написать в MAX</a>
            <a class="btn btn-secondary" target="_blank" rel="noopener" href="${siteLinks.whatsapp}?text=${msg}">WhatsApp</a>
            <a class="btn btn-secondary" href="catalog.html">Назад в каталог</a>
          </div>
        </aside>
      </div>
      <section class="section section-tight">
        <div class="grid grid-2">
          <article class="feature-card"><h2>Описание</h2><p>${product.description}</p></article>
          <article class="feature-card"><h2>Характеристики товара</h2><ul class="list-clean"><li>${product.category}</li><li>${product.subcategory}</li><li>Артикул: ${product.sku}</li><li>Вес: ${product.weight}</li></ul></article>
          <article class="feature-card"><h2>Условия заказа и доставки</h2><p>Финальная стоимость и срок подтверждаются перед оплатой. Мы уточняем наличие у поставщика и согласовываем все детали.</p></article>
          <article class="feature-card"><h2>Подходит для Haval Dargo / Big Dog 1 поколения</h2><p>Товар добавлен в профильный каталог для Haval Dargo / Big Dog 1 поколения.</p></article>
          <article class="feature-card"><h2>Как оформить заказ</h2><ol class="steps-list"><li>Откройте удобный мессенджер</li><li>Отправьте сообщение по кнопке выше</li><li>Подтвердите наличие, цену и срок доставки</li></ol></article>
          <article class="feature-card"><h2>Похожие товары</h2><div class="related-links" id="relatedProducts"></div></article>
        </div>
      </section>
    `;

    const related = products.filter((p) => p.id !== product.id && (p.subcategory === product.subcategory || p.category === product.category)).slice(0, 4);
    const relatedEl = document.getElementById('relatedProducts');
    if (relatedEl) {
      relatedEl.innerHTML = related.length
        ? related.map((p) => `<a class="text-link" href="product.html?id=${p.id}">${p.name}</a>`).join('<br>')
        : '<span class="empty-state">Пока нет похожих товаров.</span>';
    }

    const mainImg = document.getElementById('mainProductImage');
    page.querySelectorAll('.thumb-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        page.querySelectorAll('.thumb-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (mainImg) mainImg.src = btn.dataset.src;
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const id = Number(getIdFromQuery());
    const product = products.find((p) => p.id === id);
    if (!product) {
      renderNotFound();
      return;
    }
    renderProduct(product);
  });
})();
