
const GEORGIA_CENTER = [42.3154, 43.3569];

function loadLeafletAssets(callback) {
  if (window.L) { callback(); return; }

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = callback;
  document.body.appendChild(script);
}

async function initGeoBazarMap() {
  const el = document.getElementById('gbMap');
  if (!el) return;

  loadLeafletAssets(async () => {
    const map = L.map('gbMap').setView(GEORGIA_CENTER, 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    if (!window.supabaseClient) return;

    const { data, error } = await supabaseClient
      .from('listings')
      .select('id,title,price,currency,city,latitude,longitude,category,status')
      .eq('status', 'active')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .limit(300);

    if (error) {
      console.error(error);
      return;
    }

    (data || []).forEach(item => {
      const marker = L.marker([item.latitude, item.longitude]).addTo(map);
      marker.bindPopup(`
        <b>${item.title || 'Объявление'}</b><br>
        ${item.city || ''}<br>
        ${item.price || ''} ${item.currency || 'GEL'}<br>
        <a href="listing.html?id=${item.id}">Открыть</a>
      `);
    });
  });
}

async function initListingMap(lat, lng) {
  const el = document.getElementById('listingMap');
  if (!el) return;
  const position = [Number(lat) || 41.7151, Number(lng) || 44.8271];

  loadLeafletAssets(() => {
    const map = L.map('listingMap').setView(position, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    L.marker(position).addTo(map);
  });
}

function initCreateListingMap() {
  const el = document.getElementById('createMap');
  if (!el) return;

  loadLeafletAssets(() => {
    const map = L.map('createMap').setView([41.7151, 44.8271], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
    let marker = null;

    map.on('click', (e) => {
      if (marker) marker.remove();
      marker = L.marker(e.latlng).addTo(map);
      const lat = document.getElementById('listingLatitude');
      const lng = document.getElementById('listingLongitude');
      if (lat) lat.value = e.latlng.lat;
      if (lng) lng.value = e.latlng.lng;
    });
  });
}
