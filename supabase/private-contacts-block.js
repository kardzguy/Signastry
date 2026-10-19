/* Private contacts: invitation contacts, signer request contacts, beneficiary details and payout accounts go to a locked table. The open data keeps only a masked hint */
var PCKEY="signastry-my-contacts";
function pcLocal(){try{return JSON.parse(localStorage.getItem(PCKEY)||"{}")||{}}catch(e){return{}}}
function pcKeep(id,c){try{var o=pcLocal();o[id]=c;localStorage.setItem(PCKEY,JSON.stringify(o))}catch(e){}}
function pcMask(c){c=String(c||"").trim();if(!c||/\*/.test(c))return c;var m=c.match(/^([^@\s])[^@\s]*(@.+)$/);if(m)return m[1]+"***"+m[2];var d=c.replace(/\D/g,"");if(d.length>=4)return (/^\+?[\d\s().-]+$/.test(c)?"phone ":"")+"ending "+d.slice(-4);return c.length>2?c.charAt(0)+"***":"***"}
function pcAdd(row,cb){var sb=privClient();if(!sb){cb(false);return}sb.from("private_contacts").insert(row).then(function(r){cb(!r.error||r.error.code==="23505")},function(){cb(false)})}
var pcBusy={};
function pcJob(ref,row,apply){if(pcBusy[ref])return;pcBusy[ref]=1;row.ref=ref;pcAdd(row,function(ok){pcBusy[ref]=0;if(ok){apply();try{save()}catch(e){}}})}
function pcScrub(){if(!TEST_PHASE||!S)return;
(S.invlog||[]).forEach(function(x){if(!x.contact||/\*/.test(x.contact))return;var c=x.contact;if(x.from===userName)pcKeep(x.id,c);pcJob("inv:"+x.id,{kind:"invitation",owner:x.from,name:x.name,contact:c,details:x.method+" · "+x.kind+" · "+x.date},function(){if(x.contact===c)x.contact=pcMask(c)})});
(S.signerApps||[]).forEach(function(a){if(!a.contact||/\*/.test(a.contact))return;var c=a.contact;pcJob("app:"+a.id,{kind:"signer request",owner:a.name,name:a.name,contact:c,details:(a.what||"")+(a.agent?" · agent: "+a.agent:"")},function(){if(a.contact===c)a.contact=pcMask(c)})});
Object.keys(S.legacy||{}).forEach(function(n){var L=S.legacy[n];if(!L)return;[["ben",L.ben],["rep",L.rep]].forEach(function(p){var o=p[1];if(!o||!o.contact||/\*/.test(o.contact))return;var c=o.contact;pcJob(p[0]+":"+n+":"+(L.date||""),{kind:p[0]==="ben"?"beneficiary":"estate representative",owner:n,name:o.name,contact:c,details:p[0]==="ben"?(o.rel||""):""},function(){if(o.contact===c)o.contact=pcMask(c)})})});
Object.keys(S.accts||{}).forEach(function(n){var a=S.accts[n];if(!a||!a.bank||/\*|ending \d{4}$/.test(a.bank))return;var c=a.bank;pcJob("pay:"+n+":"+c.length+c.slice(-2),{kind:"payout account",owner:n,name:n,contact:c,details:""},function(){if(a.bank===c)a.bank="Account "+pcMask(c)})})}
var _renderPC=render;render=function(){try{pcScrub()}catch(e){}_renderPC()};
var _openSendPC=openSend;openSend=function(x,fu){var full=pcLocal()[x.id];if(full&&/\*|ending/.test(x.contact||"")){var y={};for(var k in x)y[k]=x[k];y.contact=full;return _openSendPC(y,fu)}return _openSendPC(x,fu)};
