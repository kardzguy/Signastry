/* Founder invite code for outreach letters: REF-FOUNDER lets a signer join directly. It has no paid referrer */
var FOUNDER_REF="REF-FOUNDER",FOUNDER_BY="Doug Harris, founder of Signastry";
var _refOwnerF=refOwner;refOwner=function(c){return String(c||"").toUpperCase()===FOUNDER_REF?FOUNDER_BY:_refOwnerF(c)};
try{var _fq=(new URLSearchParams(location.search).get("ref")||"").toUpperCase();if(_fq===FOUNDER_REF&&!joinInv){sgMode="join";joinInv={ref:FOUNDER_BY}}}catch(e){}
var _renderFC=render;render=function(){try{var ch=false;Object.keys(S.accts||{}).forEach(function(n){var a=S.accts[n];if(a&&a.referredBy===FOUNDER_BY){delete a.referredBy;a.founderInvite=a.joined||today();ch=true}});if(S.bucks&&S.bucks[FOUNDER_BY]){delete S.bucks[FOUNDER_BY];ch=true}if(ch)save()}catch(e){}_renderFC()};
