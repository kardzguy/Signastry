/* Signer legacy: name a beneficiary and estate representative */
if(!S.legacy)S.legacy={};
var lgEdit=false,estArm=null;
function legacyOf(n){return S.legacy[n]||null}
function legacyView(){var L=legacyOf(signer),show=lgEdit||!L;
var h='<h2>Your legacy</h2><p class="sub">Choose who receives your Signastry earnings if you pass away. Your royalties and referral income can keep paying them for as long as your account stays open.</p>';
if(L&&L.transferred)h+='<div class="banner idvb"><b>This account was transferred to your estate</b> on '+esc(L.transferred)+'. Earnings now go to '+esc(L.ben.name)+'.</div>';
if(!show){h+='<div class="card"><div class="pay"><div>Beneficiary<div class="meta">'+esc(L.ben.rel)+' · '+esc(L.ben.contact)+'</div></div><b>'+esc(L.ben.name)+'</b></div>'+
(L.rep&&L.rep.name?'<div class="pay"><div>Estate representative<div class="meta">Can confirm items you signed and manage the account · '+esc(L.rep.contact)+'</div></div><b>'+esc(L.rep.name)+'</b></div>':'<div class="pay"><div>Estate representative<div class="meta">Not named. Your beneficiary would manage the account.</div></div><b>None</b></div>')+
'<p class="meta">Signed by '+esc(L.sig)+' on '+esc(L.date)+'. You can change this at any time.</p><button class="btn ghost" data-lgedit="1">Change</button></div>';
return h+legacyNote()}
h+='<div class="card"><h3 style="margin-top:0">Beneficiary</h3><p class="meta">The person who receives your earnings.</p>'+
'<label for="lb-n">Full legal name</label><input id="lb-n" autocomplete="off" value="'+esc(L?L.ben.name:"")+'">'+
'<label for="lb-r">Relationship to you</label><select id="lb-r">'+["","Spouse or partner","Child","Parent","Sibling","Other family","Trust","Other"].map(function(o){return '<option'+(L&&L.ben.rel===o?' selected':'')+'>'+o+'</option>'}).join("")+'</select>'+
'<label for="lb-c">Email or phone</label><input id="lb-c" autocomplete="off" value="'+esc(L?L.ben.contact:"")+'">'+
'<h3>Estate representative (optional)</h3><p class="meta">Someone who can confirm or reject items you signed and manage the account on your beneficiary\'s behalf, such as an agent, attorney or executor.</p>'+
'<label for="lr-n">Full name</label><input id="lr-n" autocomplete="off" value="'+esc(L&&L.rep?L.rep.name:"")+'">'+
'<label for="lr-c">Email or phone</label><input id="lr-c" autocomplete="off" value="'+esc(L&&L.rep?L.rep.contact:"")+'">'+
'<label class="chk" style="margin-top:16px"><input type="checkbox" id="lg-ok"><span>I want my Signastry earnings to go to the beneficiary above if I pass away, and I understand Signastry will ask for proof, such as a death certificate and documents showing who represents my estate, before transferring the account.</span></label>'+
'<label for="lg-sig">Type your full name to sign</label><input id="lg-sig" autocomplete="off">'+
'<div id="lgerr" class="err"></div><button class="btn" id="lggo">Save my legacy</button>'+(L?' <button class="btn ghost" data-lgedit="0">Cancel</button>':'')+'</div>';
return h+legacyNote()}
function legacyNote(){return '<p class="meta" style="margin-top:14px">Keep this consistent with your will or estate plan. If they disagree, Signastry may ask your estate\'s legal representative to confirm who should receive your earnings.</p>'}
function legacyAdmin(){var all=allSigners(),set=all.filter(function(n){return S.legacy[n]});
return '<h3>Signer beneficiaries</h3><div class="card" style="margin:8px 0"><p class="meta" style="margin-top:0">'+set.length+' of '+all.length+' signers have named a beneficiary.</p>'+
(set.length?set.map(function(n){var L=S.legacy[n];return '<div class="pay"><div>'+esc(n)+'<div class="meta">Beneficiary '+esc(L.ben.name)+' ('+esc(L.ben.rel)+')'+(L.rep&&L.rep.name?' · representative '+esc(L.rep.name):'')+' · '+esc(L.date)+'</div></div>'+(L.transferred?'<span class="badge ok">Transferred '+esc(L.transferred)+'</span>':'<button class="btn ghost" data-estate="'+esc(n)+'" style="margin-top:0">Record estate transfer</button>')+'</div>'}).join(""):'')+
'<p class="meta">Record a transfer only after you receive and verify a death certificate and proof of who represents the estate.</p></div>'}
var _signerViewL=signerView;signerView=function(){var h=_signerViewL();if(!signer)return h;
h=h.replace('data-sub="legal" aria-pressed','data-sub="legacy" aria-pressed="'+(sgSub==="legacy")+'">Legacy</button><button class="chip" data-sub="legal" aria-pressed');
if(sgSub==="legacy"){var a=h.indexOf('<div class="chips"'),b=h.indexOf('</div>',a)+6;return h.slice(0,b)+legacyView()}
if(sgSub==="home"&&!legacyOf(signer))h=h.replace('<div class="chips" style="margin:0 0 14px">','<div class="card lgnudge"><div><b>Protect your earnings for your family</b><span>Name who receives your royalties and referral income if you pass away.</span></div><button class="btn ghost" data-sub="legacy">Name a beneficiary</button></div><div class="chips" style="margin:0 0 14px">');
return h};
var _adminViewL=adminView;adminView=function(){return _adminViewL()+legacyAdmin()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(d.lgedit!==undefined){lgEdit=d.lgedit==="1";render();return}
if(t.id==="lggo"&&signer){var bn=gv("lb-n"),br=gv("lb-r"),bc=gv("lb-c"),rn=gv("lr-n"),rc=gv("lr-c"),sig=gv("lg-sig"),er=document.getElementById("lgerr");
if(!bn||!br||!bc){er.textContent="Enter your beneficiary's full name, relationship and how to reach them.";return}
if(rn&&!rc){er.textContent="Enter how to reach your estate representative.";return}
if(!document.getElementById("lg-ok").checked){er.textContent="Tick the box to confirm your choice.";return}
if(sig.replace(/\s+/g," ").toLowerCase()!==signer.toLowerCase()){er.textContent="Type your full name exactly as it appears on your account: "+signer+".";return}
var prev=S.legacy[signer];S.legacy[signer]={ben:{name:bn,rel:br,contact:bc},rep:rn?{name:rn,contact:rc}:null,sig:sig,date:today(),transferred:prev&&prev.transferred||null};lgEdit=false;save();toast("Your legacy is saved.");render();return}
if(d.estate&&role==="admin"){var L=S.legacy[d.estate];if(!L)return;if(estArm!==d.estate){estArm=d.estate;t.textContent="Tap again to confirm transfer";return}estArm=null;L.transferred=today();save();toast("Estate transfer recorded for "+d.estate+".");render();return}});
