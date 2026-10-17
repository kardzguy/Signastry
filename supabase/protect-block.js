/* Insurance report and Report stolen */
var insView=false,stoleArm=null;
function insReport(){var m=mine(),tot=0,who=userName||"Member";
var rows=m.map(function(i){var v=valInfo(i);if(v)tot+=v.val;var p=i.photos&&i.photos[0];
return '<article class="insitem">'+(p?'<img src="'+esc(p)+'" alt="Photo of '+esc(i.name)+'">':'<div class="insnoph">No photo on file</div>')+'<div><h3>'+esc(i.name)+'</h3><dl>'+
'<dt>Registry ID</dt><dd>'+esc(i.id)+'</dd>'+
'<dt>Category</dt><dd>'+esc(i.cat||"")+'</dd>'+
(isCard(i)?'<dt>Grading</dt><dd>'+esc(i.grader)+' '+esc(i.grade)+', cert '+esc(i.cert)+'</dd>':'')+
(i.signer||i.signedBy?'<dt>Signed by</dt><dd>'+esc(i.signer||i.signedBy)+'</dd>':'')+
'<dt>Verification</dt><dd>'+(i.stolen?'Reported stolen '+esc(i.stolen.date)+'. ':'')+(i.status==="verified"?(i.signer?'Verified by the signer':'QR sealed'):i.status==="rejected"?'Rejected by the signer':'Awaiting signer verification')+'</dd>'+
(i.origin?'<dt>Where signed</dt><dd>'+esc(i.origin[0])+(i.origin[1]?', '+esc(i.origin[1]):'')+'</dd>':'')+
(i.acq?'<dt>How acquired</dt><dd>'+esc(i.acq[0])+(i.acq[1]?'. '+esc(i.acq[1]):'')+'</dd>':'')+
'<dt>Kept at</dt><dd>'+esc(i.loc||"")+'</dd>'+
'<dt>Recorded value</dt><dd>'+(v?money(v.val)+' (last sold '+money(v.last)+' on '+esc(v.date)+')':'No sales recorded yet')+'</dd>'+
'<dt>History</dt><dd>'+i.hist.length+' entr'+(i.hist.length===1?'y':'ies')+', first '+esc(i.hist[0]?i.hist[0][0]:"")+'</dd></dl></div></article>'}).join("");
return '<div class="insbar"><button class="btn ghost" data-insclose="1">Back to my vault</button><button class="btn" data-insprint="1">Print or save as PDF</button></div>'+
'<div class="insr"><div class="inshead"><div><h2>Collection record</h2><p>Prepared for '+esc(who)+' on '+esc(today())+' from the Signastry registry</p></div><div class="instot"><span>'+m.length+' item'+(m.length===1?'':'s')+'</span><b>'+money(tot)+'</b><span>total recorded value</span></div></div>'+
(m.length?rows:'<p>No items in this vault yet.</p>')+
'<p class="insnote">Recorded values are based on sales recorded on Signastry and are estimates, not appraisals. Each item can be checked by its registry ID or QR seal. Keep a copy with your insurance documents and share it with your agent when you add or update coverage.</p></div>'}
function theftBox(i){if(i.owner!==ME)return "";
if(i.stolen)return '<div class="card stolencard"><b>Reported stolen on '+esc(i.stolen.date)+'</b><p class="meta">Anyone who looks up '+esc(i.id)+' or scans its QR seal sees that it was reported stolen, and it can\'t be listed or sold on Signastry.</p><button class="btn ghost" data-recov="'+i.id+'">Mark as recovered</button></div>';
return '<div class="card stolencard"><b>Lost or stolen?</b><p class="meta">Report it, and anyone who looks up or scans this item will see it was reported stolen. It can\'t be sold on Signastry until you mark it recovered.</p><button class="btn ghost" data-stole="'+i.id+'">Report stolen</button></div>'}
var _badgeT=badge;badge=function(i){return i.stolen?'<span class="badge bad">Reported stolen</span>':_badgeT(i)};
var _sellableT=sellable;sellable=function(i){return !i.stolen&&_sellableT(i)};
var _privBoxT=privBox;privBox=function(i){return _privBoxT(i)+theftBox(i)};
var _vaultT=vault;vault=function(){if(insView)return insReport();return '<div class="insrow"><div><b>Ready for the unexpected</b><span>If fire, flood or theft strikes, your record survives. Print a report of your collection for your insurance agent.</span></div><button class="btn ghost" data-insopen="1">Insurance report</button></div>'+_vaultT()};
var _lookupT=lookup;lookup=function(){var h=_lookupT();return lastLookup&&lastLookup.stolen?'<div class="banner stolenb"><b>This item was reported stolen</b> on '+esc(lastLookup.stolen.date)+'. If someone is offering it to you, don\'t buy it, and contact Signastry.</div>'+h:h};
var _renderT=render;render=function(){if(tab!=="vault"||role!=="member")insView=false;document.body.classList.toggle("printins",!!insView);_renderT()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.insopen){insView=true;render();scrollTo(0,0);return}
if(d.insclose){insView=false;render();return}
if(d.insprint){window.print();return}
if(d.stole){var it=S.items.find(function(x){return x.id===d.stole});if(!it||it.owner!==ME)return;if(stoleArm!==it.id){stoleArm=it.id;t.textContent="Tap again to report it stolen";return}stoleArm=null;
it.stolen={date:today()};it.hist.push([today(),"Reported stolen by the owner","Private owner",it.loc]);S.listings.forEach(function(l){if(l.item===it.id&&l.status==="active")l.status="closed"});(S.offers||[]).forEach(function(o){if(o.item===it.id&&(o.status==="open"||o.status==="countered"))o.status="closed"});save();toast(it.id+" reported stolen. Lookups and QR scans now show it.");render();return}
if(d.recov){var r=S.items.find(function(x){return x.id===d.recov});if(!r||r.owner!==ME)return;delete r.stolen;r.hist.push([today(),"Recovered by the owner","Private owner",r.loc]);save();toast(r.id+" marked as recovered.");render();return}});
