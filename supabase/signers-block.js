/* Signer recruiting page, signer identity checks, and "I didn't sign this" */
if(!S.signerApps)S.signerApps=[];
var appSent=false,sgNoArm=null;
function idvOf(n){var a=S.accts[n];return a?(a.idv||{status:"pending",method:a.idm||""}):null}
function idvOk(n){if(SIGNERS[n])return true;var v=idvOf(n);return !!(v&&v.status==="verified")}
function waitingCount(){return S.items.filter(function(i){return i.status==="pending"}).length}
function signerStrip(){return '<div class="sgstrip"><div><b>Do you sign autographs?</b><span>See how Signastry protects your name.</span></div><button class="btn ghost" data-land="signers">For signers</button></div>'}
function signersPage(){var w=waitingCount(),F=S.fees,ex=1000,R=Math.round(ex*F.resale)/100,roy=Math.round(R*F.share)/100;
var h='<div class="hero sgpage"><h1>Get paid for the autographs you\'ve already signed.</h1><p class="sub">Collectors on Signastry pay to have their items confirmed by the person who signed them. Confirm the ones that are yours and earn on each one, then earn again every time they resell.</p>'+
'<div class="mstats"><div><b>'+money(authPay())+'</b><span>for each item you confirm</span></div><div><b>'+F.share+'%</b><span>of the resale fee, every time it resells</span></div>'+(w?'<div><b>'+w+'</b><span>item'+(w===1?'':'s')+' waiting for signers now</span></div>':'')+'</div>'+
'<button class="btn" data-sg="join">I have an invite code</button>';
h+='<nav class="sgjump" aria-label="On this page"><a href="#sg-pay">Compensation</a><a href="#sg-req">Requirements</a><a href="#sg-how">The process</a><a href="#sg-faq">Questions</a><a href="#sg-apply">Request an invite</a></nav>';
h+='<h2 id="sg-pay">Compensation</h2><div class="sgpay">'+
'<div><b>Confirmation pay</b><span class="big">'+money(authPay())+'</span><p>For every item you confirm. That\'s '+F.authShare+'% of the '+money(F.auth)+' authentication fee the collector pays.</p></div>'+
'<div><b>Resale royalty</b><span class="big">'+F.share+'%</span><p>Of the '+F.resale+'% resale fee, every time an item you confirmed changes hands on Signastry, for as long as it keeps selling. A $1,000 resale earns you '+money(roy)+'.</p></div>'+
'<div><b>Referral bonus</b><span class="big">'+REF_PCT+'%</span><p>Of everything each signer you recruit earns, for as long as they stay active. No limit on referrals.</p></div></div>'+
'<p class="meta">Graded cards registered without an autograph don\'t involve a signer, so their fees go to Signastry. You\'re paid only on items you personally confirm.</p>';
h+='<h3>Getting paid</h3><ul class="sgl"><li>Earnings post to your account the moment you confirm an item, and again with each resale.</li><li>Withdraw any time your balance is $10 or more. Payouts arrive in 2 to 3 business days.</li><li>Submit your tax information once before your first withdrawal. You\'re responsible for your own taxes, and we report payments as the law requires.</li><li>It\'s free to join. Signers never pay a fee.</li></ul>';
h+='<h2 id="sg-req">Requirements</h2><ul class="feats">'+
'<li><b>You\'re really you</b><span>Confirm your identity once, with a photo ID and live selfie, through your agent or estate representative, or in person at a signing. Until then you can\'t confirm items.</span></li>'+
'<li><b>Signer agreement and authorization</b><span>Sign both in your account before your first confirmation. They let us show your name on items you confirm and nothing more.</span></li>'+
'<li><b>Only items you personally signed</b><span>Confirm an item only if you signed it and recognize it from the photos and details. If you\'re unsure, don\'t confirm it, and tell us.</span></li>'+
'<li><b>A payout account and tax information</b><span>Add the account you want paid to when you join. Tax information is needed before you withdraw.</span></li>'+
'<li><b>Honesty, always</b><span>Every confirmation is recorded permanently. We may suspend an account or hold payouts if a confirmation looks false, or if someone else used your account.</span></li>'+
'<li><b>Agents and estates welcome</b><span>Someone can confirm on your behalf if they complete the agent or estate authorization form.</span></li></ul>';
h+='<h2 id="sg-how">The process</h2><ol class="sgsteps">'+
'<li><b>Get invited, or request an invite.</b> We reach out when collectors register items you signed. You can also request an invite at the bottom of this page.</li>'+
'<li><b>Create your account.</b> Your name, a payout account, and a PIN. It takes about two minutes.</li>'+
'<li><b>Confirm your identity.</b> One time only. We review it, usually within one business day.</li>'+
'<li><b>Sign your agreement and authorization.</b> Both are in your account under Legal.</li>'+
'<li><b>Review requests.</b> Each one shows the collector\'s photos, where and when they say it was signed, and how they got it.</li>'+
'<li><b>Answer in seconds.</b> Tap Confirm I signed this, or I didn\'t sign this. Confirmed items get QR seals on the item and certificate. Rejected items are flagged as not authentic on their record and can\'t be sold on Signastry.</li>'+
'<li><b>Get paid.</b> Your confirmation pay posts right away, and royalties follow every resale. Withdraw whenever you like.</li></ol>';
h+='<h2 id="sg-faq">Questions</h2>'+[
["What if I'm not sure I signed it?","Don't confirm it. You're never required to confirm anything, and you can tell us why you're unsure. Only confirm items you recognize."],
["Do collectors see what I earn?","No. Collectors only see that their item was confirmed by you. Your earnings are visible only in your account."],
["Where does my name appear?","On the records of items you confirm, which signed-in collectors can look up. We don't use your name for anything else."],
["Can my agent or family manage this for me?","Yes. They complete the agent or estate authorization form, then can review and confirm items for you."],
["What happens when I reject an item?","It's marked as not authentic on its permanent record, any listing or offer on it closes, and it can't be sold on Signastry."],
["Does it cost anything?","No. Joining and confirming items is free for signers."]
].map(function(q){return '<details class="sgq"><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>'}).join("");
h+='<h2 id="sg-apply">Request an invite</h2>'+(appSent?'<div class="banner ofban"><b>Request sent.</b> We\'ll contact you to set up your account.</div>':
'<p class="meta">Tell us who you are and we\'ll set up your account.</p><label for="apnm">Your name</label><input id="apnm" autocomplete="name"><label for="apct">Email or phone</label><input id="apct" autocomplete="email"><label for="apwhat">What do you sign?</label><input id="apwhat" placeholder="e.g. Former MLB pitcher, 2009 to 2016"><label for="apag">Agent or manager contact (optional)</label><input id="apag"><div id="aperr" class="err"></div><button class="btn" id="apgo">Request an invite</button>')+'</div>';
return h}
function idvBanner(){var v=idvOf(signer);if(!v||idvOk(signer))return "";
if(v.status==="review")return '<div class="banner idvb"><b>Identity check in review.</b> We usually confirm within one business day. You can verify items as soon as you\'re approved.</div>';
return '<div class="card idvcard"><h3 style="margin-top:0">Confirm your identity</h3><p class="meta">Before you can verify items, we confirm you\'re really '+esc(signer)+'. You only do this once, and it means no one else can verify items in your name.'+(v.status==="rejected"?' <b>We couldn\'t confirm your last check. Please try again or contact us.</b>':'')+'</p>'+
'<div class="idvopt"><b>Photo ID and selfie</b><p class="meta">A secure ID service matches your photo ID to a live selfie. Signastry never stores a copy of your ID.</p><button class="btn" data-idv="id">Start ID check (test)</button></div>'+
'<div class="idvopt"><b>Through your agent or representative</b><label for="idvan">Their name</label><input id="idvan"><label for="idvac">Their email or phone</label><input id="idvac"><div id="idverr" class="err"></div><button class="btn ghost" data-idv="agent">Send for confirmation</button></div>'+
'<div class="idvopt"><b>In person at a signing</b><p class="meta">A Signastry representative confirms you at your next signing event.</p><button class="btn ghost" data-idv="person">Confirm in person</button></div></div>'}
function idvAdmin(){var rv=Object.keys(S.accts).filter(function(n){var v=idvOf(n);return v&&v.status==="review"}),np=Object.keys(S.accts).filter(function(n){var v=idvOf(n);return v&&(v.status==="pending"||v.status==="rejected")}),apps=S.signerApps.filter(function(a){return a.status==="new"}),rej=S.items.filter(function(i){return i.status==="rejected"});
var h='<h3>Signer identity checks</h3>';
h+=rv.length?rv.map(function(n){var v=idvOf(n);return '<div class="card" style="margin:8px 0"><b>'+esc(n)+'</b><div class="meta">'+esc({id:"Photo ID and selfie",agent:"Agent or representative",person:"In person at a signing"}[v.via]||v.via||"")+' · submitted '+esc(v.date||"")+'</div>'+(v.detail?'<div class="meta">'+esc(v.detail)+'</div>':'')+'<button class="btn" data-idvok="'+esc(n)+'">Approve signer</button> <button class="btn ghost" data-idvno="'+esc(n)+'">Reject</button></div>'}).join(""):'<p class="meta">No identity checks waiting for review.</p>';
if(np.length)h+='<p class="meta">'+np.length+' signer'+(np.length>1?'s have':' has')+' not finished the identity check: '+np.map(esc).join(", ")+'.</p>';
h+='<h3>Signer invite requests</h3>'+(apps.length?apps.map(function(a){return '<div class="card" style="margin:8px 0"><b>'+esc(a.name)+'</b><div class="meta">'+esc(a.what)+'</div><div class="meta">'+esc(a.contact)+(a.agent?' · agent: '+esc(a.agent):'')+' · '+esc(a.date)+'</div><button class="btn ghost" data-appdone="'+esc(a.id)+'">Mark contacted</button></div>'}).join(""):'<p class="meta">No new requests.</p>');
if(rej.length)h+='<h3>Signatures rejected by signers</h3>'+rej.map(function(i){return '<div class="pay"><div>'+esc(i.name)+'<div class="meta">'+esc(i.id)+' · signer '+esc(i.signer)+' · owner '+esc(i.owner==="You"?"Demo member":i.owner)+'</div></div></div>'}).join("");
return h}
var _badgeS=badge;badge=function(i){return i.status==="rejected"?'<span class="badge bad">Rejected by signer</span>':_badgeS(i)};
var _sellableS=sellable;sellable=function(i){return i.status!=="rejected"&&_sellableS(i)};
var _signerView=signerView;signerView=function(){var h=_signerView();return signer&&sgSub==="home"?idvBanner()+h:h};
var _adminView=adminView;adminView=function(){return _adminView()+idvAdmin()};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t)return;var d=t.dataset;
if(t.id==="apgo"){var nm=gv("apnm"),ct=gv("apct"),wh=gv("apwhat"),er=document.getElementById("aperr");if(!nm||!ct||!wh){er.textContent="Enter your name, how to reach you, and what you sign.";return}S.signerApps.push({id:"AP-"+Date.now().toString(36),date:today(),name:nm,contact:ct,what:wh,agent:gv("apag"),status:"new"});appSent=true;save();toast("Request sent. We'll contact you to set up your account.");render();return}
if(d.idv&&signer&&S.accts[signer]){var v={status:"review",via:d.idv,date:today()};if(d.idv==="agent"){var an=gv("idvan"),ac=gv("idvac");if(!an||!ac){document.getElementById("idverr").textContent="Enter your agent's name and how to reach them.";return}v.detail="Agent: "+an+", "+ac}else if(d.idv==="id")v.detail="Test check: ID and selfie matched";else v.detail="Confirm at next signing";S.accts[signer].idv=v;save();toast("Sent for review. You can verify items once you're approved.");render();return}
if(d.sgno){var it=S.items.find(function(x){return x.id===d.sgno});if(!signer||!it||it.signer!==signer||it.status!=="pending"){toast("Only the signer can do this.");return}
if(sgNoArm!==it.id){sgNoArm=it.id;t.textContent="Tap again to confirm: not my signature";return}sgNoArm=null;
it.status="rejected";it.hist.push([today(),"The signer did not recognize this signature. Flagged as not authentic","Signer",it.loc]);S.listings.forEach(function(l){if(l.item===it.id&&l.status==="active")l.status="closed"});(S.offers||[]).forEach(function(o){if(o.item===it.id&&(o.status==="open"||o.status==="countered"))o.status="closed"});save();toast("Marked as not your signature. The item is flagged on its record.");render();return}
if(role!=="admin")return;
if(d.idvok&&S.accts[d.idvok]){var a=S.accts[d.idvok];a.idv=Object.assign({},idvOf(d.idvok),{status:"verified",approved:today()});save();toast(d.idvok+" is now a verified signer.");render();return}
if(d.idvno&&S.accts[d.idvno]){S.accts[d.idvno].idv=Object.assign({},idvOf(d.idvno),{status:"rejected"});save();toast("Identity check rejected.");render();return}
if(d.appdone){var ap=S.signerApps.find(function(x){return x.id===d.appdone});if(ap){ap.status="contacted";save();render()}return}});
/* Private signer entrance: only at /signers/ (or ?signers). Nothing on the main site leads here. */
var PORTAL=false;try{PORTAL=new URLSearchParams(location.search).has("signers")||location.hash==="#signers"}catch(e){}
function portalView(){return '<div class="card portalin"><div><b>Signastry for signers</b><span>Already set up? Sign in to review items waiting for you.</span></div><button class="btn" data-role="signer">Signer sign in</button></div>'+signersPage()}
var _startViewP=startView;startView=function(){if(PORTAL&&!loginRole&&sgMode!=="join")return portalView();return _startViewP()};
var _signupViewP=signupView;signupView=function(){if(PORTAL)return _signupViewP();suRole="member";return _signupViewP().replace(/<div class="chips" style="margin:0 0 4px">[\s\S]*?<\/div>/,"")};
