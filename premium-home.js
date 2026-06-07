
function goHomeSearch(){
  const q=document.getElementById("homeSearchQ")?.value||"";
  const cat=document.getElementById("homeSearchCategory")?.value||"";
  const region=document.getElementById("homeSearchRegion")?.value||"";
  const p=new URLSearchParams();
  if(q)p.set("q",q); if(cat)p.set("category",cat); if(region)p.set("region",region);
  location.href="listings.html?"+p.toString();
}
