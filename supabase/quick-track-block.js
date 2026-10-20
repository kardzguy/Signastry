/* After copying an invitation, offer to log who it went to so it shows in the tracker */
var invQuick=null;
function quickTrackBox(id){if(invQuick!==id)return "";return '<div class="card qtrack"><b>Copied. Who are you sending it to?</b><p class="meta">Add their name so it shows in your invitation tracker. You can skip this.</p><label for="qt-n">Their name</label><input id="qt-n" placeholder="Full name" autocomplete="off"><label for="qt-m">How you are sending it</label><select id="qt-m"><option>Text message</option><option>Email</option><option>Social media</option><option>In person</option><option>Other</option></select><div id="qt-e" class="err"></div><button class="btn" data-qtgo="1">Track it</button> <button class="btn ghost" data-qtx="1">Skip</button></div>'}
var _memRefHtmlQT=memRefHtml;memRefHtml=function(){var h=_memRefHtmlQT();["mtestmsg","mrefmsg"].forEach(function(id){var k=h.indexOf('data-mcopy="'+id+'"');if(k<0)return;var e=h.indexOf('</div>',k)+6;h=h.slice(0,e)+quickTrackBox(id)+h.slice(e)});return h};
document.getElementById("view").addEventListener("click",function(e){var t=e.target.closest("button");if(!t||role!=="member")return;var d=t.dataset;
if(d.mcopy==="mtestmsg"||d.mcopy==="mrefmsg"){invQuick=d.mcopy;setTimeout(function(){render();var f=document.getElementById("qt-n");if(f)f.scrollIntoView({block:"center"})},350);return}
if(d.qtx){invQuick=null;render();return}
if(d.qtgo){var n=gv("qt-n").trim(),er=document.getElementById("qt-e");if(!n){er.textContent="Enter their name, or tap Skip.";return}
var first=!invLog().some(function(x){return x.from===userName&&x.name.toLowerCase()===n.toLowerCase()});
invLog().push({id:"INV-"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),kind:"member",from:userName,name:n,contact:"",method:gv("qt-m"),date:today(),status:"sent",fu:[],tester:invQuick==="mtestmsg"});if(first)award(userName,"invite",n);invQuick=null;save();toast("Tracking your invitation to "+n);render();return}});
