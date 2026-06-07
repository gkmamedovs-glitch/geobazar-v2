
function qs(name){ return new URLSearchParams(location.search).get(name); }

async function getSessionUser(){
  if (!window.supabaseClient) return null;
  const { data } = await supabaseClient.auth.getUser();
  return data?.user || null;
}

async function createListing(){
  const user = await getSessionUser();
  if (!user) { alert('Сначала войдите в аккаунт'); return; }

  const payload = {
    user_id: user.id,
    created_by: user.id,
    title: document.getElementById('listingTitle')?.value || '',
    category: document.getElementById('listingCategory')?.value || '',
    price: Number(document.getElementById('listingPrice')?.value || 0),
    currency: document.getElementById('listingCurrency')?.value || 'GEL',
    city: document.getElementById('listingCity')?.value || '',
    address: document.getElementById('listingAddress')?.value || '',
    latitude: Number(document.getElementById('listingLatitude')?.value || 0) || null,
    longitude: Number(document.getElementById('listingLongitude')?.value || 0) || null,
    description: document.getElementById('listingDescription')?.value || '',
    status: 'active',
    parameters: collectSmartCategoryData ? collectSmartCategoryData() : {}
  };

  const { data, error } = await supabaseClient.from('listings').insert(payload).select().single();
  if (error) { alert(error.message); return; }
  alert('Объявление опубликовано ✅');
  location.href = 'listing.html?id=' + data.id;
}

async function loadListingDetail(){
  const id = qs('id');
  if (!id || !window.supabaseClient) return;

  const { data, error } = await supabaseClient.from('listings').select('*').eq('id', id).maybeSingle();
  if (error || !data) return;

  document.querySelectorAll('[data-listing-title]').forEach(el => el.textContent = data.title || 'Объявление');
  document.querySelectorAll('[data-listing-price]').forEach(el => el.textContent = `${data.price || ''} ${data.currency || 'GEL'}`);
  document.querySelectorAll('[data-listing-city]').forEach(el => el.textContent = data.city || '');
  document.querySelectorAll('[data-listing-description]').forEach(el => el.textContent = data.description || '');

  if (data.latitude && data.longitude) initListingMap(data.latitude, data.longitude);
}

async function toggleFavorite(listingId){
  const user = await getSessionUser();
  if (!user) { alert('Сначала войдите'); return; }
  await supabaseClient.from('favorites').upsert({ user_id:user.id, listing_id:listingId });
  alert('Добавлено в избранное ✅');
}

async function createPayment(type, amount, description, listingId=null){
  const user = await getSessionUser();
  if (!user) { alert('Сначала войдите'); return; }
  const { error } = await supabaseClient.from('payments').insert({
    user_id:user.id, listing_id:listingId, type, amount, currency:'GEL', status:'pending', description
  });
  if (error) alert(error.message); else alert('Заявка на оплату создана ✅');
}

function createLead(status='new'){
  alert('Заявка клиента будет сохранена в CRM после подключения Supabase прав доступа.');
}

async function loadMyListings(){
  const box=document.getElementById('myListingsBox'); if(!box||!window.supabaseClient)return;
  const user=await getSessionUser(); if(!user){box.innerHTML='Войдите в аккаунт';return;}
  const {data,error}=await supabaseClient.from('listings').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
  if(error){box.innerHTML=error.message;return;}
  box.innerHTML=(data||[]).map(x=>`<div class="listing-card"><h3>${x.title||'Без названия'}</h3><p>${x.city||''}</p><b>${x.price||''} ${x.currency||'GEL'}</b><a class="btn btn-light" href="listing.html?id=${x.id}">Открыть</a></div>`).join('')||'Объявлений пока нет';
}
async function loadFavorites(){
  const box=document.getElementById('favoritesBox'); if(!box||!window.supabaseClient)return;
  const user=await getSessionUser(); if(!user){box.innerHTML='Войдите в аккаунт';return;}
  const {data,error}=await supabaseClient.from('favorites').select('listing_id, listings(*)').eq('user_id',user.id);
  if(error){box.innerHTML=error.message;return;}
  box.innerHTML=(data||[]).map(f=>{const x=f.listings||{}; return `<div class="listing-card"><h3>${x.title||'Объявление'}</h3><p>${x.city||''}</p><b>${x.price||''} ${x.currency||'GEL'}</b><a class="btn btn-light" href="listing.html?id=${x.id}">Открыть</a></div>`}).join('')||'Избранного пока нет';
}
async function loadPayments(){
  const box=document.getElementById('paymentsBox'); if(!box||!window.supabaseClient)return;
  const user=await getSessionUser(); if(!user){box.innerHTML='Войдите в аккаунт';return;}
  const {data,error}=await supabaseClient.from('payments').select('*').eq('user_id',user.id).order('created_at',{ascending:false});
  if(error){box.innerHTML=error.message;return;}
  box.innerHTML=(data||[]).map(p=>`<div class="panel"><b>${p.description||p.type}</b><p>${p.amount||0} ${p.currency||'GEL'} · ${p.status}</p></div>`).join('')||'Операций пока нет';
}
async function submitVerification(){
  const user=await getSessionUser(); if(!user){alert('Войдите');return;}
  const comment=document.getElementById('verificationComment')?.value||'';
  const {error}=await supabaseClient.from('verification_requests').insert({user_id:user.id,comment,status:'pending'});
  alert(error?error.message:'Заявка на верификацию отправлена ✅');
}
async function loadReviews(){
  const box=document.getElementById('reviewsBox'); if(!box||!window.supabaseClient)return;
  const {data,error}=await supabaseClient.from('reviews').select('*').order('created_at',{ascending:false}).limit(50);
  if(error){box.innerHTML=error.message;return;}
  box.innerHTML=(data||[]).map(r=>`<div class="panel"><b>${'⭐'.repeat(r.rating||5)}</b><p>${r.comment||''}</p></div>`).join('')||'Отзывов пока нет';
}
async function submitReview(){
  const user=await getSessionUser(); if(!user){alert('Войдите');return;}
  const rating=Number(document.getElementById('reviewRating')?.value||5);
  const comment=document.getElementById('reviewComment')?.value||'';
  const {error}=await supabaseClient.from('reviews').insert({reviewer_id:user.id,rating,comment,status:'active'});
  alert(error?error.message:'Отзыв добавлен ✅'); loadReviews();
}
async function createCargoOrder(){
  const user=await getSessionUser(); if(!user){alert('Войдите');return;}
  const payload={user_id:user.id,from_location:document.getElementById('cargoFrom')?.value||'',to_location:document.getElementById('cargoTo')?.value||'',cargo_type:document.getElementById('cargoType')?.value||'',weight:document.getElementById('cargoWeight')?.value||'',price:Number(document.getElementById('cargoPrice')?.value||0),status:'active'};
  const {error}=await supabaseClient.from('cargo_orders').insert(payload);
  alert(error?error.message:'Заявка GeoCargo опубликована ✅');
}
async function createTravelRequest(){
  const user=await getSessionUser();
  const payload={user_id:user?.id||null,service_type:document.getElementById('travelType')?.value||'',destination:document.getElementById('travelDestination')?.value||'',people_count:Number(document.getElementById('travelPeople')?.value||1),phone:document.getElementById('travelPhone')?.value||'',comment:document.getElementById('travelComment')?.value||'',status:'new'};
  const {error}=await supabaseClient.from('travel_requests').insert(payload);
  alert(error?error.message:'Заявка GeoTravel отправлена ✅');
}
async function createReport(){
  const user=await getSessionUser();
  const reason=document.getElementById('reportReason')?.value||'';
  const {error}=await supabaseClient.from('reports').insert({reporter_id:user?.id||null,target_type:'general',target_id:'site',reason,status:'new'});
  alert(error?error.message:'Жалоба отправлена ✅');
}
async function loadAdminTable(table, boxId){
  const box=document.getElementById(boxId); if(!box||!window.supabaseClient)return;
  const {data,error}=await supabaseClient.from(table).select('*').limit(100);
  if(error){box.innerHTML=error.message;return;}
  box.innerHTML=(data||[]).map(x=>`<div class="panel"><pre style="white-space:pre-wrap">${JSON.stringify(x,null,2)}</pre></div>`).join('')||'Нет данных';
}
