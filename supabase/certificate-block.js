/* Certificate of Registration: a one-page printout that points to the live record. Every print is logged in the item's history */
var certView=null;
function certVerified(i){if(isCard(i))return i.signer&&i.status==="verified"?i.signer:"";return (!i.reg&&i.signer&&i.status==="verified")?i.signer:""}
function certVerDate(i){var h=(i.hist||[]).find(function(x){return /verified by|Verified by/.test(x[1])});return h?h[0]:""}
function certStatus(i){if(i.mismatch)return ["bad","Certificate doesn't match this item"];if(i.review)return ["pend","Under review by Signastry"];if(i.stolen)return ["bad","Reported stolen"];var v=certVerified(i);if(v)return ["gold","Signer verified by "+v+(certVerDate(i)?" on "+certVerDate(i):"")];if(isCard(i))return ["ok","Registered graded card, QR sealed"];if(i.status==="pending")return ["pend","Registered, awaiting signer verification"];return ["ok","Registered and QR sealed"]}
function certPage(){var i=mine().find(function(x){return x.id===certView});if(!i)return '<div class="empty">Item not found.</div>';
var st=certStatus(i),reg=(i.hist[0]||[])[0]||"",ph=(i.photos||[])[0],cs=(i.seal&&i.seal.cur||[]).filter(function(c){return c.k==="Certificate"})[0],out=isCard(i)?(i.grader+" "+i.cert+(i.grade?" · grade "+i.grade:"")):(i.auth?i.auth.co+" "+i.auth.cert:"");
var row=function(k,v){return v?'<div class="crow"><span>'+k+'</span><b>'+v+'</b></div>':''};
return '<div class="insbar"><button class="btn ghost" data-certclose="1">Back to my vault</button><button class="btn" data-certprint="1">Print or save as PDF</button></div>'+
'<div class="certpg">'+(TEST_PHASE?'<div class="certtest" aria-hidden="true">TEST</div>':'')+'<div class="certhd"><img src="/signastry-logo.png" alt="" width="56" height="56"><div><div class="certbrand">Signastry</div><div class="certtitle">Certificate of Registration</div></div></div>'+
'<div class="certbody">'+(ph?'<img class="certph" src="'+esc(ph)+'" alt="Photo of '+esc(i.name)+'">':'<div class="certph certnoph">No photo on record</div>')+
'<div class="certinfo"><div class="certname">'+esc(i.name)+'</div><div class="certid">'+esc(i.id)+'</div><div class="certst cs-'+st[0]+'">'+(st[0]==="gold"?'<span class="certgold">Gold Ironclad Seal</span>':'')+esc(st[1])+'</div>'+
row("Signed by",esc(i.signer||i.signedBy||""))+row("Signed at",i.origin&&i.origin[0]?esc(i.origin[0])+(i.origin[1]?", "+esc(i.origin[1]):""):"")+row("Category",esc(i.cat||""))+row("Outside certificate",esc(out))+row("Registered",esc(reg))+row("Owner ID",ownerId(i.owner))+row("Located in",esc(i.loc||""))+'</div></div>'+
'<div class="certfoot"><div class="certsealbox"><div>Place the certificate seal here</div><small>'+(cs?'Seal #'+esc(cs.n):'Print your seals first, then stick the certificate seal in this box')+'</small></div><div class="certqr"><div class="certqrc" data-qr="'+esc(scanUrl(i))+'" role="img" aria-label="QR code to the live record"></div><small>Scan to see the live record</small></div></div>'+
'<p class="certnote">This certificate points to the live record at '+esc(location.host)+'. The online record, its history and its seals are the final word, not this paper. Owner names and exact addresses are never shown. Printed '+esc(today())+'.</p></div>'}
var _qrBlockC=qrBlock;qrBlock=function(i){var h=_qrBlockC(i);return role==="member"&&i.owner===ME?h+'<button class="btn ghost" data-cert="'+i.id+'" style="margin:0 0 10px 8px">Certificate</button>':h};
var _vaultC=vault;vault=function(){return certView&&role==="member"?certPage():_vaultC()};
var _renderC=render;render=function(){if(tab!=="vault"||role!=="member")certView=null;document.body.classList.toggle("printcert",!!certView);_renderC()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.cert&&role==="member"){certView=d.cert;tab="vault";render();scrollTo(0,0);return}
if(d.certclose){certView=null;render();return}
if(d.certprint&&certView){var i=mine().find(function(x){return x.id===certView});doPrint();if(i){i.hist.push([today(),"Certificate of Registration printed by the owner","Owner",i.loc]);setTimeout(function(){save()},300)}return}});
