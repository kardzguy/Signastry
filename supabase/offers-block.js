/* Vault browsing, anonymous offers and Keep private */
if(!S.offers)S.offers=[];
var vxOpen=null,vxQ="",wantMarket=false;
function ofList(){return S.offers||(S.offers=[])}
function ofDays(n){var d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function ofLive(o){return (o.status==="open"||o.status==="countered")&&o.expires>=today()}
function ofOwnerName(k){return k==="You"?"Demo member":k}
function ofItem(id){return S.items.find(function(x){return x.id===id})}
function ofValid(o){var i=ofItem(o.item);return ofLive(o)&&i&&i.owner===o.owner&&!i.private}
function ofIncoming(){return ofList().filter(function(o){return ofValid(o)&&o.owner===ME})}
function ofMine(){return ofList().filter(function(o){return o.buyer===userName})}
function ofCount(){if(role!=="member")return 0;return ofIncoming().filter(function(o){return o.status==="open"}).length+ofMine().filter(function(o){return ofValid(o)&&o.status==="countered"}).length}
function vbLine(i){return isCard(i)?'Graded card · '+esc(i.grader)+' '+esc(i.grade)+(i.signer?' · signed by '+esc(i.signer):''):'Signed by '+esc(i.signer)}
function vaultPublic(){return S.items.filter(function(i){return !i.private&&sellable(i)&&!activeListing(i.id)})}
function mTeaser(){var pub=vaultPublic(),sale=S.listings.filter(function(l){return l.status==="active"}).length,peek=pub.filter(function(i){return i.photos&&i.photos.length}).concat(pub.filter(function(i){return !(i.photos&&i.photos.length)})).slice(0,6);
return '<div class="hero mteaser"><h1>Signastry Market</h1><p class="sub">Buy and sell signer-verified autographs, memorabilia and graded cards. Members can also make offers on items in other members\' vaults, even ones that aren\'t for sale.</p><div class="mstats"><div><b>'+sale+'</b><span>for sale now</span></div><div><b>'+pub.length+'</b><span>in members\' vaults</span></div></div>'+(peek.length?'<div class="mpeek" aria-hidden="true">'+peek.map(function(i){var p=i.photos&&i.photos[0];return p?'<div class="mtile"><img src="'+esc(p)+'" alt=""></div>':'<div class="mtile noimg"><span>'+esc(i.cat)+'</span></div>'}).join("")+'</div>':'')+'<p class="meta">The market is for members only. Sign in or join free to see every item and make offers.</p><div class="row" style="gap:10px;flex-wrap:wrap"><button class="btn" data-role="member" data-mwant="1">Member sign in</button><button class="btn ghost" data-land="up" data-mwant="1" style="margin-top:16px">Join free</button></div></div>'}
function vaultBrowse(){var q=vxQ.toLowerCase().split(/\s+/).filter(Boolean),L=vaultPublic().filter(function(i){return i.owner!==ME&&q.every(function(w){return [i.name,i.signer,i.signedBy,i.cat,i.grader,i.grade].join(" ").toLowerCase().indexOf(w)>-1})}).reverse();
var h='<div class="card"><p class="meta" style="margin-top:0">Items stored in other members\' vaults that aren\'t listed for sale. See one you want? Make an offer. Offers are anonymous both ways: owners never see your name, and you never see theirs.</p><label for="vxq">Search the vault</label><input id="vxq" value="'+esc(vxQ)+'" placeholder="e.g. rookie card, Dana Okafor"><button class="btn" id="vxqb">Search</button></div>';
h+='<div class="meta" style="margin:12px 0 8px">'+L.length+(L.length===1?" item":" items")+'</div>';
if(!L.length)return h+'<div class="empty">No vaulted items match yet. As members register items, they appear here unless the owner keeps them private.</div>';
return h+L.map(vxCard).join("")}
function vxCard(i){var o=vxOpen===i.id,v=valInfo(i);
return '<div class="item"><button data-vx="'+i.id+'" aria-expanded="'+o+'"><div class="row">'+thumb(i)+'<div style="flex:1;min-width:0"><div class="name">'+esc(i.name)+'</div><div class="meta">'+vbLine(i)+' · '+esc(i.cat)+'</div><div class="meta">'+(v?'Current value '+money(v.val)+' · last sold '+money(v.last):'No sales yet')+'</div></div><div style="text-align:right"><span class="badge vxb">Not for sale</span>'+badge(i)+'</div></div></button>'+
(o?'<div class="detail" style="padding-top:12px">'+hero(i)+((i.photos||[]).length>1?gallery(i):'')+valBlock(i)+offerBox(i)+'</div>':'')+'</div>'}
function offerBox(i){var mineO=ofMine().filter(function(o){return o.item===i.id&&ofValid(o)})[0];
if(mineO&&mineO.status==="open")return '<div class="card ofcard"><b>Your offer: '+money(mineO.amount)+'</b><div class="meta">Waiting for the owner to answer. Expires '+esc(mineO.expires)+'.</div><button class="btn ghost" data-ofwd="'+mineO.id+'">Withdraw offer</button></div>';
if(mineO&&mineO.status==="countered")return '<div class="card ofcard"><b>The owner countered at '+money(mineO.counter)+'</b><div class="meta">Your offer was '+money(mineO.amount)+'. Respond by '+esc(mineO.expires)+'.</div><button class="btn" data-ofacc="'+mineO.id+'">Accept '+money(mineO.counter)+'</button> <button class="btn ghost" data-ofdec="'+mineO.id+'">Decline</button></div>';
return '<div class="card ofcard"><b>Make an offer</b><label for="ofa-'+i.id+'">Your offer ($)</label><input id="ofa-'+i.id+'" type="number" inputmode="decimal" min="1" step="1" placeholder="e.g. 500"><label for="ofl-'+i.id+'">Where it will be kept if accepted</label><input id="ofl-'+i.id+'" placeholder="City, State"><label for="ofn-'+i.id+'">Note to the owner (optional)</label><input id="ofn-'+i.id+'" maxlength="200" placeholder="e.g. Been looking for this one for years"><div id="ofe-'+i.id+'" class="err"></div><button class="btn" data-ofsend="'+i.id+'">Send offer</button><p class="meta">The owner has 7 days to accept, counter or decline. If accepted, you pay the offer amount and the item moves to your vault. Demo only, no card is charged.</p></div>'}
function offersView(){var inc=ofIncoming(),mine=ofMine().slice().reverse().slice(0,25);
var h='<h3 style="margin-top:4px">Offers on your items</h3>';
h+=inc.length?inc.map(function(o){var i=ofItem(o.item),f=fees(o.status==="countered"?o.counter:o.amount,i),amt=o.status==="countered"?o.counter:o.amount;
return '<div class="card ofcard"><div class="row">'+thumb(i)+'<div style="flex:1;min-width:0"><div class="name">'+esc(i.name)+'</div><div class="meta">'+esc(i.id)+' · from a Signastry member · '+esc(o.date)+'</div></div><div class="pricetag">'+money(o.amount)+'</div></div>'+(o.note?'<p>“'+esc(o.note)+'”</p>':'')+
(o.status==="countered"?'<p class="meta">You countered at <b>'+money(o.counter)+'</b>. Waiting for the buyer. Expires '+esc(o.expires)+'.</p>':'<p class="meta">If you accept, you receive <b>'+money(amt-f.f)+'</b> after '+money(f.f)+' in fees. Expires '+esc(o.expires)+'.</p><button class="btn" data-ofacc="'+o.id+'">Accept '+money(o.amount)+'</button><div class="row" style="align-items:flex-end;gap:8px;margin-top:6px"><div style="flex:1"><label for="ofc-'+o.id+'">Counter offer ($)</label><input id="ofc-'+o.id+'" type="number" inputmode="decimal" min="1" step="1" placeholder="Your price"></div><button class="btn ghost" data-ofctr="'+o.id+'" style="margin-top:0">Counter</button></div><div id="ofce-'+o.id+'" class="err"></div><button class="btn ghost" data-ofdec="'+o.id+'">Decline</button>')+'</div>'}).join(""):'<div class="empty">No offers right now. Members can make offers on items in your vault unless you tick Keep private on the item.</div>';
h+='<h3>Offers you made</h3>';
h+=mine.length?mine.map(function(o){var i=ofItem(o.item),st=!ofValid(o)&&(o.status==="open"||o.status==="countered")?(o.expires<today()?"Expired":"No longer available"):{open:"Waiting for the owner",countered:"Owner countered at "+money(o.counter||0),accepted:"Accepted · bought for "+money(o.price||o.amount),declined:"Declined",withdrawn:"Withdrawn",closed:"No longer available",expired:"Expired"}[o.status]||o.status;
return '<div class="pay"><div>'+esc(o.itemName)+'<div class="meta">Offered '+money(o.amount)+' · '+esc(o.date)+' · '+esc(st)+'</div>'+(ofValid(o)&&o.status==="countered"?'<button class="btn" data-ofacc="'+o.id+'">Accept '+money(o.counter)+'</button> <button class="btn ghost" data-ofdec="'+o.id+'">Decline</button>':ofValid(o)&&o.status==="open"?'<button class="btn ghost" data-ofwd="'+o.id+'">Withdraw</button>':'')+'</div></div>'}).join(""):'<div class="empty">You haven\'t made any offers yet. Browse <button class="chip" data-mk="vault">In the vault</button> to find one.</div>';
return h}
function privBox(i){if(i.owner!==ME||!sellable(i))return "";return '<div class="card privcard"><label class="privrow"><input type="checkbox" data-priv="'+i.id+'"'+(i.private?' checked':'')+'> <b>Keep private</b></label><div class="meta">'+(i.private?'Hidden from members browsing the vault. No one can send you offers on it.':'Members can see this item\'s photos and description in the vault and make anonymous offers. Your name and location are never shown.')+'</div></div>'}
function offerBanner(){var n=ofCount();return n?'<div class="banner ofban"><b>You have '+n+' offer'+(n>1?'s':'')+' waiting.</b> <button class="btn ghost" data-goof="1" style="margin-top:6px">Review offers</button></div>':''}
function ofSale(i,price,seller,buyer,loc){var f=fees(price,i);i.owner=ownerKey(buyer);i.loc=loc;i.hist.push([today(),"Sold to a new owner through a Signastry offer for "+money(price),"Private owner",loc]);(i.sales=i.sales||[]).push([today(),price]);
if(noSigner(i)){chargeFor(seller,"Card seller fee",i.id+" "+i.name,f.p);chargeFor(seller,"Card resale fee",i.id+" "+i.name,f.r)}else{addLedger({date:today(),item:i.id,fee:f.f,signer:i.signer,pay:f.s,type:"Resale fee"});chargeFor(seller,"Seller fee",i.id+" "+i.name,f.p);chargeFor(seller,"Resale fee",i.id+" "+i.name,f.r)}
S.listings.forEach(function(l){if(l.item===i.id&&l.status==="active")l.status="closed"});award(seller,"sale",i.id+" "+i.name);award(buyer,"buy",i.id+" "+i.name);
S.orders.push({date:today(),item:i.id,itemName:i.name,price:price,seller:seller,buyer:buyer,fee:f.f,net:Math.round((price-f.f)*100)/100,signerPay:f.s,via:"offer"});return f}
var _tabsFor=tabsFor;tabsFor=function(){var t=_tabsFor(),n=ofCount();return t.map(function(x){return x[0]==="market"&&n?[x[0],x[1]+" ("+n+")"]:x})};
var _vault=vault;vault=function(){return offerBanner()+_vault()};
var _render=render;render=function(){if(role==="member"&&wantMarket){wantMarket=false;tab="market";mkSub="vault"}_render()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.land&&!d.mwant)wantMarket=false;if(d.mwant)wantMarket=true;
if(d.vx){vxOpen=vxOpen===d.vx?null:d.vx;render();return}
if(t.id==="vxqb"){vxQ=gv("vxq");render();return}
if(d.goof){tab="market";mkSub="offers";render();return}
if(role!=="member")return;
if(d.ofsend){var i=ofItem(d.ofsend),er=document.getElementById("ofe-"+d.ofsend),a=Math.round((parseFloat(gv("ofa-"+d.ofsend))||0)*100)/100,l=gv("ofl-"+d.ofsend),n=gv("ofn-"+d.ofsend);
if(!i||i.private||i.owner===ME||!sellable(i)||activeListing(i.id)){toast("This item is no longer open to offers.");render();return}
if(!(a>0)){er.textContent="Enter an offer above $0.";return}if(!l){er.textContent="Enter where the item will be kept if your offer is accepted.";return}
var ex=ofMine().filter(function(o){return o.item===i.id&&ofValid(o)})[0];if(ex){ex.amount=a;ex.loc=l;ex.note=n;ex.status="open";ex.counter=null;ex.date=today();ex.expires=ofDays(7)}
else{var oid;do{oid="OF-"+(1000+Math.floor(Math.random()*9000))}while(ofList().some(function(o){return o.id===oid}));ofList().push({id:oid,item:i.id,itemName:i.name,owner:i.owner,buyer:userName,amount:a,loc:l,note:n,date:today(),expires:ofDays(7),status:"open"})}
save();toast("Offer of "+money(a)+" sent. The owner has 7 days to answer.");render();return}
var o=(d.ofacc||d.ofdec||d.ofctr||d.ofwd)&&ofList().find(function(x){return x.id===(d.ofacc||d.ofdec||d.ofctr||d.ofwd)});if(!o)return;
if(!ofValid(o)){toast("This offer is no longer active.");render();return}var it=ofItem(o.item),isOwner=o.owner===ME,isBuyer=o.buyer===userName;
if(d.ofacc){var price;if(o.status==="open"&&isOwner)price=o.amount;else if(o.status==="countered"&&isBuyer)price=o.counter;else return;
var f=ofSale(it,price,ofOwnerName(o.owner),o.buyer,o.loc);o.status="accepted";o.price=price;o.done=today();
ofList().forEach(function(x){if(x!==o&&x.item===it.id&&(x.status==="open"||x.status==="countered"))x.status="closed"});
if(isBuyer){tab="vault";open[it.id]=true;vxOpen=null;save();toast("You bought "+it.name+" for "+money(price)+". It is now in your vault.")}else{save();toast("Offer accepted. "+it.name+" sold for "+money(price)+". You receive "+money(price-f.f)+".")}render();return}
if(d.ofctr&&isOwner&&o.status==="open"){var c=Math.round((parseFloat(gv("ofc-"+o.id))||0)*100)/100,ce=document.getElementById("ofce-"+o.id);if(!(c>0)){ce.textContent="Enter your counter price.";return}o.status="countered";o.counter=c;o.expires=ofDays(7);save();toast("Counter of "+money(c)+" sent.");render();return}
if(d.ofdec&&((isOwner&&o.status==="open")||(isBuyer&&o.status==="countered"))){o.status="declined";o.by=isOwner?"owner":"buyer";save();toast("Offer declined.");render();return}
if(d.ofwd&&isBuyer&&o.status==="open"){o.status="withdrawn";save();toast("Offer withdrawn.");render();return}});
document.getElementById("view").addEventListener("change",function(e){var c=e.target;if(!c.dataset||!c.dataset.priv)return;var i=ofItem(c.dataset.priv);if(!i||i.owner!==ME)return;i.private=c.checked;
if(i.private)ofList().forEach(function(o){if(o.item===i.id&&(o.status==="open"||o.status==="countered"))o.status="closed"});save();toast(i.private?"Kept private. Hidden from the vault.":"Visible in the vault. Members can make offers.");render()});
