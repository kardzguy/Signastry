/* Public record panel (owner ID, city and state, status) and suspected-copy reports */
if(!S.copyReports)S.copyReports=[];
var cpOpen=null,cpSent={};
function ownerId(n){var k=n==="You"?"Demo member":n;return "M-"+("0000"+(+pid("own:"+k)%100000)).slice(-5)}
function itemStatus(i){var l=activeListing(i.id);
if(i.stolen)return ["bad","Reported stolen","Reported by the owner on "+i.stolen.date+". Don't buy it, and contact Signastry."];
if(i.status==="rejected")return ["bad","Rejected by the signer","The signer said this signature isn't theirs."];
if(l)return ["sale","For sale on Signastry Market",role==="member"?"Listed at "+money(l.price)+".":"Sign in to see the listing."];
if(i.private)return ["vault","Privately vaulted","Kept private by its owner. Not for sale."];
return ["vault","Vaulted, not for sale","Held in its owner's vault. Members can make an offer."]}
function recordPanel(r){var st=itemStatus(r),mine=r.owner===ME&&role==="member";
var h='<div class="recp"><div class="recst rs-'+st[0]+'"><b>'+esc(st[1])+'</b><span>'+esc(st[2])+'</span></div><dl class="recdl">'+
'<dt>Registry ID</dt><dd>'+esc(r.id)+'</dd>'+
(isCard(r)?'<dt>Certificate</dt><dd>'+esc(r.grader)+' '+esc(r.cert)+'</dd>':'')+
'<dt>Owner ID</dt><dd>'+ownerId(r.owner)+(mine?' (you)':'')+'</dd>'+
'<dt>Located in</dt><dd>'+esc(r.loc||"Not recorded")+'</dd>'+
'<dt>Owners on record</dt><dd>'+(1+r.hist.filter(function(x){return /Sold to|Transferred to/.test(x[1])}).length)+'</dd></dl>'+
'<p class="meta" style="margin:8px 0 0">Owner names and exact addresses are never shown. The owner ID stays the same while one owner holds the item.</p></div>';
if(!mine)h+=copyBox(r);
return h}
function copyBox(r){if(cpSent[r.id])return '<div class="banner ofban" style="margin-top:10px"><b>Report sent.</b> Thank you. Signastry will look into it and alert the owner.</div>';
if(cpOpen!==r.id)return '<button class="btn ghost" data-cpopen="'+r.id+'">Report a suspected copy</button>';
if(role!=="member")return '<div class="card" style="margin-top:10px"><p class="meta" style="margin:0">Sign in as a member to report a suspected copy.</p></div>';
return '<div class="card cpcard"><b>Report a suspected copy</b><p class="meta">Seen this item for sale somewhere that doesn\'t match this record? Tell us where.</p><label for="cp-w">Where did you see it?</label><input id="cp-w" placeholder="e.g. eBay, a card show in Dallas"><label for="cp-l">Link (optional)</label><input id="cp-l" type="url" placeholder="https://"><label for="cp-n">What doesn\'t match?</label><input id="cp-n" placeholder="e.g. different photos, no QR seal, seller says they own it"><div id="cp-err" class="err"></div><button class="btn" data-cpsend="'+r.id+'">Send report</button> <button class="btn ghost" data-cpopen="">Cancel</button></div>'}
function findItem(q){q=String(q||"").trim();var u=q.toUpperCase(),d=q.replace(/\s+/g,"");return S.items.find(function(x){return x.id===u})||S.items.find(function(x){return isCard(x)&&String(x.cert).replace(/\s+/g,"")===d&&d!==""})||false}
function copyAlerts(){var rs=S.copyReports.filter(function(c){var i=S.items.find(function(x){return x.id===c.item});return c.status==="open"&&i&&i.owner===ME});
return rs.length?'<div class="banner stolenb"><b>Possible copy reported.</b> '+rs.map(function(c){var i=S.items.find(function(x){return x.id===c.item});return esc(i.id+" "+i.name)+' ('+esc(c.date)+', seen at '+esc(c.where)+')'}).join("; ")+'. Signastry is looking into it.</div>':''}
function copyAdmin(){var rs=S.copyReports.slice().reverse();
return '<h3>Suspected copies reported</h3>'+(rs.length?rs.map(function(c){var i=S.items.find(function(x){return x.id===c.item});return '<div class="card" style="margin:8px 0"><b>'+esc(c.item)+(i?' '+esc(i.name):'')+'</b><div class="meta">'+esc(c.date)+' · reported by '+esc(c.by)+' · seen at '+esc(c.where)+'</div>'+(c.link?'<div class="meta" style="word-break:break-all">'+esc(c.link)+'</div>':'')+'<p style="margin:6px 0">'+esc(c.note)+'</p>'+(c.status==="open"?'<button class="btn ghost" data-cpdone="'+c.id+'">Mark resolved</button>':'<span class="badge ok">Resolved</span>')+'</div>'}).join(""):'<p class="meta">No reports yet.</p>')}
var _vaultR=vault;vault=function(){var h=_vaultR();return insView?h:copyAlerts()+h};
var _adminViewR=adminView;adminView=function(){return _adminViewR()+copyAdmin()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.cpopen!==undefined){cpOpen=d.cpopen||null;render();var el=document.getElementById("cp-w");if(el)el.focus();return}
if(d.cpsend&&role==="member"){var w=gv("cp-w"),n=gv("cp-n"),er=document.getElementById("cp-err");if(!w||!n){er.textContent="Tell us where you saw it and what doesn't match.";return}
S.copyReports.push({id:"CP-"+Date.now().toString(36),item:d.cpsend,date:today(),by:userName,where:w,link:gv("cp-l"),note:n,status:"open"});cpSent[d.cpsend]=true;cpOpen=null;save();toast("Report sent. Thank you.");render();return}
if(d.cpdone&&role==="admin"){var c=S.copyReports.find(function(x){return x.id===d.cpdone});if(c){c.status="resolved";c.resolved=today();save();render()}return}});
