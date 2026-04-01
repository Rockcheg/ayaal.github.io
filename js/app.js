const formatPrice = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

const createProductCard = (product) => {
  const telegramText = encodeURIComponent(`Здравствуйте! Интересует товар: ${product.name} (${product.sku}).`);

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-content">
        <span class="product-badge">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-prices">
          <div class="price-box">
            <span class="price-label">Цена товара</span>
            <strong class="price-value">${formatPrice(product.price)}</strong>
          </div>
          <div class="price-box">
            <span class="price-label">Примерно с доставкой</span>
            <strong class="price-value">${formatPrice(product.deliveryPrice)}</strong>
          </div>
        </div>
        <ul class="product-meta">
          <li><strong>Вес:</strong> ${product.weight}</li>
          <li><strong>Артикул:</strong> ${product.sku}</li>
          <li><strong>Наличие:</strong> ${product.availability}</li>
        </ul>
        <div class="product-actions">
          <a class="btn btn-primary" href="https://t.me/rockcheg?text=${telegramText}" target="_blank" rel="noopener">Заказать</a>
          <a class="btn btn-secondary" href="contacts.html">Контакты</a>
        </div>
      </div>
    </article>
  `;
};

const renderFeatured = () => {
  const container = document.getElementById('featured-products');
  if (!container || !Array.isArray(window.products)) return;
  container.innerHTML = window.products.slice(0, 3).map(createProductCard).join('');
};

const populateCategories = () => {
  const filter = document.getElementById('categoryFilter');
  if (!filter || !Array.isArray(window.products)) return;

  const categories = [...new Set(window.products.map((p) => p.category))].sort((a, b) => a.localeCompare(b, 'ru'));
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filter.append(option);
  });
};

const renderCatalog = () => {
  const container = document.getElementById('catalog-products');
  if (!container || !Array.isArray(window.products)) return;

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const emptyState = document.getElementById('emptyState');

  const search = searchInput?.value.trim().toLowerCase() || '';
  const category = categoryFilter?.value || 'all';

  const filteredProducts = window.products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description} ${product.sku}`.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  container.innerHTML = filteredProducts.map(createProductCard).join('');
  emptyState?.classList.toggle('hidden', filteredProducts.length > 0);
};

const bindCatalogControls = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  if (searchInput) searchInput.addEventListener('input', renderCatalog);
  if (categoryFilter) categoryFilter.addEventListener('change', renderCatalog);
};

const updateYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

document.addEventListener('DOMContentLoaded', () => {
  updateYear();
  renderFeatured();
  populateCategories();
  renderCatalog();
  bindCatalogControls();
});
