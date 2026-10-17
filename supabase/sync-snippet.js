/* Shared online saving (Supabase). Everyone on the site sees the same data.
   Falls back to this browser only if the database can't be reached. */
(function(){
var SB_URL="https://himwujrdazwkcvhgnpqj.supabase.co",SB_KEY="sb_publishable_6fFjXAfouauZn7tmdCu94g_p-h1l3u3",SPACE="__SPACE__";
if(window.claude&&window.claude.use)return;
if(!window.supabase||!window.supabase.createClient){toast("Online saving is unavailable right now. Changes stay in this browser.");return}
var sb;try{sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:false,autoRefreshToken:false}})}catch(e){toast("Online saving is unavailable right now. Changes stay in this browser.");return}
var ready=false,seq=0,pending=0,lastJ={},stJ="",pullT=null,warned=false;
function sk(v){if(Array.isArray(v))return v.map(sk);if(v&&typeof v==="object"){var o={};Object.keys(v).sort().forEach(function(k){if(v[k]!==undefined)o[k]=sk(v[k])});return o}return v}
function cj(v){return JSON.stringify(sk(v))}
function stateOnly(){var o={};for(var k in S)if(k!=="items"&&k!=="_order")o[k]=S[k];o._order=S.items.map(function(i){return i.id});return o}
function busy(){var a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&a.type!=="button"}
function fail(e){if(!warned){warned=true;toast("Could not save online"+(e&&e.message?": "+e.message:"")+". Changes are kept in this browser.");setTimeout(function(){warned=false},15000)}}
function push(){if(!ready)return;var rows=[],dels=[],ids=[];
var st=cj(stateOnly());if(st!==stJ){stJ=st;rows.push({space:SPACE,path:"app/state",data:JSON.parse(st)})}
var seen={};S.items.forEach(function(i){seen[i.id]=1;var j=cj(i);if(lastJ[i.id]!==j){lastJ[i.id]=j;ids.push(i.id);rows.push({space:SPACE,path:"items/"+i.id,data:JSON.parse(j)})}});
Object.keys(lastJ).forEach(function(id){if(!seen[id]){delete lastJ[id];dels.push(id)}});
if(!rows.length&&!dels.length)return;seq++;pending++;var ps=[];
if(rows.length)ps.push(sb.from("docs").upsert(rows,{onConflict:"space,path"}));
if(dels.length)ps.push(sb.from("docs").delete().eq("space",SPACE).in("path",dels.map(function(id){return "items/"+id})));
Promise.all(ps).then(function(rs){rs.forEach(function(r){if(r&&r.error)throw r.error})}).catch(function(e){stJ="";ids.forEach(function(id){delete lastJ[id]});dels.forEach(function(id){lastJ[id]=""});fail(e)}).then(function(){pending--})}
var prevSave=save;save=function(){prevSave();push()};
function apply(rows){var st=null,items={},changed=false;rows.forEach(function(r){if(r.path==="app/state")st=r.data;else if(r.path.indexOf("items/")===0&&r.data&&r.data.id)items[r.data.id]=r.data});
if(st){var j=cj(st);if(j!==stJ){stJ=j;var keep=S.items;S=JSON.parse(j);delete S._order;S.items=keep;changed=true}}
var ids=Object.keys(items);if(st&&st._order){var pos={};st._order.forEach(function(id,n){pos[id]=n});ids.sort(function(a,b){return(pos[a]===undefined?1e9:pos[a])-(pos[b]===undefined?1e9:pos[b])})}
var nl={};ids.forEach(function(id){var j=cj(items[id]);nl[id]=j;if(lastJ[id]!==j)changed=true});
if(Object.keys(lastJ).length!==ids.length||S.items.length!==ids.length)changed=true;
lastJ=nl;S.items=ids.map(function(id){return JSON.parse(nl[id])});
if(changed){prevSave();if(!busy())render()}}
function pull(first){var mine=seq;return sb.from("docs").select("path,data").eq("space",SPACE).limit(5000).then(function(r){if(r.error)throw r.error;
if(!first&&(pending>0||seq!==mine)){later();return}
if(first&&!r.data.length){ready=true;push();toast("Shared test data is set up. Everyone now sees the same site.");return}
apply(r.data);ready=true})}
function later(){clearTimeout(pullT);pullT=setTimeout(function(){pull(false).catch(function(){})},700)}
pull(true).then(function(){
try{sb.channel("docs-"+SPACE).on("postgres_changes",{event:"*",schema:"public",table:"docs",filter:"space=eq."+SPACE},later).subscribe()}catch(e){}
setInterval(function(){if(!document.hidden)later()},30000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)later()})
}).catch(function(e){toast("Online saving could not start. Changes stay in this browser.")});
})();
