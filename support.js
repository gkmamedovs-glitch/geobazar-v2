
async function createSupportTicket(){
  const subject=document.getElementById('supportSubject')?.value||'Обращение';
  const body=document.getElementById('supportBody')?.value||'';
  const msg=document.getElementById('supportMsg');
  if(!body){msg.textContent='Напишите сообщение';return;}
  let user=null;
  if(window.supabaseClient){
    const r=await supabaseClient.auth.getUser(); user=r.data?.user||null;
    const {error}=await supabaseClient.from('support_tickets').insert({
      user_id:user?.id||null, subject, message:body, status:'new'
    });
    msg.textContent=error?error.message:'Заявка отправлена ✅';
  } else msg.textContent='Supabase не подключён';
}
