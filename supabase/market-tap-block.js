/* Make market and vault items obviously tappable, and let members act straight from a looked-up record */
var _vxCardT=vxCard;vxCard=function(i){var h=_vxCardT(i);if(vxOpen===i.id)return h;return h.replace('</div></div></button>','</div></div><div class="tapcta">View photos and make an offer ›</div></button>')};
var _listCardT=listCard;listCard=function(l){var h=_listCardT(l);if(mkOpen===l.id)return h;return h.replace('</div></div></button>','</div></div><div class="tapcta">View photos and buy ›</div></button>')};
function actBox(r){if(role!=="member"||r.owner===ME)return "";var l=S.listings.find(function(x){return x.item===r.id&&x.status==="active"&&x.seller!==userName});
if(l)return '<div class="card actbox"><b>For sale at '+money(l.price)+'</b><p class="meta">Listed on the Signastry Market by a verified member.</p><button class="btn" data-goact="buy|'+l.id+'">View listing and buy</button></div>';
if(vaultPublic().some(function(x){return x.id===r.id}))return '<div class="card actbox"><b>Not for sale, but you can make an offer</b><p class="meta">The owner stays anonymous, and so do you.</p><button class="btn" data-goact="offer|'+r.id+'">Make an offer</button></div>';
return ""}
var _recordPanelT=recordPanel;recordPanel=function(r){return actBox(r)+_recordPanelT(r)};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t||!t.dataset.goact||role!=="member")return;var p=t.dataset.goact.split("|");tab="market";if(p[0]==="buy"){mkSub="browse";mkQ="";mkOpen=p[1]}else{mkSub="vault";vxQ="";vxOpen=p[1]}render();setTimeout(function(){var el=document.querySelector(p[0]==="buy"?'[data-mkopen="'+p[1]+'"]':'[data-vx="'+p[1]+'"]');if(el)el.scrollIntoView({block:"start"})},50)});
