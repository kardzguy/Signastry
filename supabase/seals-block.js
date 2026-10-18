/* Print seals: matching item and certificate seals at label size */
var sealView=null;
function sealLabel(i,kind){return '<div class="seallbl"><div class="sealtop"><img src="/signastry-logo.png" alt="" width="18" height="18"><span>Signastry</span><em>'+kind+'</em></div><div class="sealqr" data-qr="'+esc(scanUrl(i))+'" role="img" aria-label="QR seal for '+esc(i.id)+'"></div><b>'+esc(i.id)+'</b><small>'+esc(i.name)+'</small><small>Scan to check its record</small></div>'}
function sealSheet(){var all=sealView==="ALL",list=all?mine():mine().filter(function(x){return x.id===sealView});
return '<div class="insbar"><button class="btn ghost" data-sealclose="1">Back to my vault</button><button class="btn" data-insprint="1">Print seals</button>'+(all?'':'<button class="btn ghost" data-seal="ALL">Seals for all my items</button>')+'</div>'+
'<div class="sealhelp"><h2>'+(all?'Seals for all your items':'Seals for '+esc(list[0]?list[0].name:""))+'</h2><p class="meta">Each item gets two matching seals: one for the item and one for its certificate. Print on adhesive label paper at 100% scale, then cut along the dashed lines. For the strongest protection, use tamper-evident (void) label stock that leaves a mark if someone peels it off.</p></div>'+
'<div class="sealgrid">'+list.map(function(i){return sealLabel(i,"Item")+sealLabel(i,"Certificate")}).join("")+'</div>'}
var _qrBlockS=qrBlock;qrBlock=function(i){var h=_qrBlockS(i);return role==="member"&&i.owner===ME?h+'<button class="btn ghost" data-seal="'+i.id+'" style="margin:0 0 10px">Print seals</button>':h};
var _vaultS=vault;vault=function(){return sealView&&role==="member"?sealSheet():_vaultS()};
var _vaultS2=vault;vault=function(){var h=_vaultS2();if(sealView||insView||role!=="member"||!mine().length)return h;var r='<div class="insrow"><div><b>QR seals</b><span>Print matching seals for each item and its certificate. Stick them on, and anyone can scan to check the record.</span></div><button class="btn" data-seal="ALL">Print seals</button></div>',k=h.indexOf('<div class="insrow">');return k>-1?h.slice(0,k)+r+h.slice(k):r+h};
var _renderS=render;render=function(){if(tab!=="vault"||role!=="member")sealView=null;document.body.classList.toggle("printseal",!!sealView);_renderS()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.seal&&role==="member"){sealView=d.seal;tab="vault";render();scrollTo(0,0);return}
if(d.sealclose){sealView=null;render();return}});
