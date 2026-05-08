const siteLinks = window.SITE_LINKS || {};

const formatPrice = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

const createProductCard = (product) => {
  const message = `Здравствуйте! Интересует товар: ${product.name} (${product.sku}).`;
  const telegramMessage = encodeURIComponent(message);
  const maxMessage = encodeURIComponent(message);
  const availabilityClass = product.availability.toLowerCase().includes('в наличии') ? 'is-in-stock' : 'is-by-order';

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-content">
        <span class="product-badge">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-subcategory">${product.subcategory}</p>
        <p class="product-description">${product.description}</p>
        <div class="product-prices">
          <div class="price-box">
            <span class="price-label">Цена товара</span>
            <strong class="price-value">${formatPrice(product.price)}</strong>
          </div>
          <div class="price-box price-box-delivery">
            <span class="price-label">Цена с доставкой</span>
            <strong class="price-value">${formatPrice(product.deliveryPrice)}</strong>
          </div>
        </div>
        <ul class="product-meta">
          <li><strong>Вес:</strong> ${product.weight}</li>
          <li><strong>Артикул:</strong> ${product.sku}</li>
          <li class="availability-pill ${availabilityClass}"><strong>Наличие:</strong> ${product.availability}</li>
        </ul>
        <div class="product-actions">
          <a class="btn btn-primary" href="${siteLinks.telegramProfile}?text=${telegramMessage}" target="_blank" rel="noopener">Telegram</a>
          <a class="btn btn-secondary" href="${siteLinks.maxProfile}?text=${maxMessage}" target="_blank" rel="noopener">MAX</a>
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
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter || !Array.isArray(window.products)) return;

  const categories = [...new Set(window.products.map((p) => p.category))].sort((a, b) => a.localeCompare(b, 'ru'));
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
};

const populateSubcategories = () => {
  const subcategoryFilter = document.getElementById('subcategoryFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  if (!subcategoryFilter || !categoryFilter || !Array.isArray(window.products)) return;

  const selectedCategory = categoryFilter.value || 'all';
  const subcategories = window.products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .map((product) => product.subcategory)
    .filter(Boolean);

  const uniqueSubcategories = [...new Set(subcategories)].sort((a, b) => a.localeCompare(b, 'ru'));
  subcategoryFilter.innerHTML = '<option value="all">Все подкатегории</option>';

  uniqueSubcategories.forEach((subcategory) => {
    const option = document.createElement('option');
    option.value = subcategory;
    option.textContent = subcategory;
    subcategoryFilter.append(option);
  });
};

const renderCatalog = () => {
  const container = document.getElementById('catalog-products');
  if (!container || !Array.isArray(window.products)) return;

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const subcategoryFilter = document.getElementById('subcategoryFilter');
  const emptyState = document.getElementById('emptyState');

  const search = searchInput?.value.trim().toLowerCase() || '';
  const category = categoryFilter?.value || 'all';
  const subcategory = subcategoryFilter?.value || 'all';

  const filteredProducts = window.products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description} ${product.sku} ${product.subcategory || ''}`.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSubcategory = subcategory === 'all' || product.subcategory === subcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  container.innerHTML = filteredProducts.map(createProductCard).join('');
  bindProductCards();
  emptyState?.classList.toggle('hidden', filteredProducts.length > 0);
};

const bindCatalogControls = () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const subcategoryFilter = document.getElementById('subcategoryFilter');

  if (searchInput) searchInput.addEventListener('input', renderCatalog);

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      populateSubcategories();
      renderCatalog();
    });
  }

  if (subcategoryFilter) subcategoryFilter.addEventListener('change', renderCatalog);
};

const bindProductCards = () => {
  document.querySelectorAll('.product-card').forEach((card) => {
    const id = card.getAttribute('data-product-id');
    if (!id) return;

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      window.location.href = `product.html?id=${id}`;
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a, button')) return;
      event.preventDefault();
      window.location.href = `product.html?id=${id}`;
    });

    card.tabIndex = 0;
  });
};

const updateYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const applySiteContacts = () => {
  const telegramHandleEl = document.getElementById('telegramHandle');
  const telegramLinkEl = document.getElementById('telegramLink');
  const maxLinkEl = document.getElementById('maxLink');
  const whatsappLinkEl = document.getElementById('whatsappLink');
  const emailLinkEl = document.getElementById('emailLink');
  const partsForm = document.getElementById('partsForm');

  if (telegramHandleEl) telegramHandleEl.textContent = siteLinks.telegramHandle || '@rockcheg';
  if (telegramLinkEl) telegramLinkEl.href = siteLinks.telegramProfile || 'https://t.me/rockcheg';
  if (maxLinkEl) maxLinkEl.href = siteLinks.maxProfile || '#';

  if (whatsappLinkEl) {
    whatsappLinkEl.href = siteLinks.whatsapp || '#';
    whatsappLinkEl.textContent = '+7 (999) 245-01-28';
  }

  if (emailLinkEl) {
    const emailHref = siteLinks.email || emailLinkEl.getAttribute('href') || '#';
    const fallbackEmailText = emailHref.startsWith('mailto:') ? emailHref.replace('mailto:', '') : emailHref;
    emailLinkEl.href = emailHref;
    emailLinkEl.textContent = siteLinks.emailText || emailLinkEl.textContent.trim() || fallbackEmailText;
  }

  if (partsForm) {
    partsForm.action = siteLinks.partsFormAction || partsForm.action;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateYear();
  applySiteContacts();
  renderFeatured();
  populateCategories();
  populateSubcategories();
  renderCatalog();
  bindCatalogControls();
});
