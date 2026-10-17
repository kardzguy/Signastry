/* Branded QR seals: blue corner markers and the Signastry logo in the middle */
function brandQR(text){if(!window.qrcode)return "";var q;try{q=qrcode(0,"H");q.addData(text);q.make()}catch(e){return ""}
var n=q.getModuleCount(),m=2,N=n+2*m,L=Math.ceil(n*0.26);if(L%2!==n%2)L++;var ls=(n-L)/2;
function inF(r,k){return (r<8&&k<8)||(r<8&&k>=n-8)||(r>=n-8&&k<8)}
function inL(r,k){return r>=ls-0.5&&r<ls+L+0.5&&k>=ls-0.5&&k<ls+L+0.5}
var d="";for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(q.isDark(r,k)&&!inF(r,k)&&!inL(r,k))d+="M"+(k+m)+" "+(r+m)+"h1v1h-1z";
function fin(x,y){x+=m;y+=m;return '<rect x="'+x+'" y="'+y+'" width="7" height="7" fill="#2AA7E0"/><rect x="'+(x+1)+'" y="'+(y+1)+'" width="5" height="5" fill="#fff"/><rect x="'+(x+2)+'" y="'+(y+2)+'" width="3" height="3" fill="#2AA7E0"/>'}
var lx=ls+m,pad=L*0.08;
return '<svg viewBox="0 0 '+N+' '+N+'" width="100%" height="100%" shape-rendering="crispEdges" role="img" aria-label="Signastry QR seal"><rect width="'+N+'" height="'+N+'" fill="#fff"/><path d="'+d+'" fill="#000"/>'+fin(0,0)+fin(n-7,0)+fin(0,n-7)+'<rect x="'+lx+'" y="'+lx+'" width="'+L+'" height="'+L+'" fill="#fff"/><image href="/signastry-logo.png" x="'+(lx+pad)+'" y="'+(lx+pad)+'" width="'+(L-2*pad)+'" height="'+(L-2*pad)+'" preserveAspectRatio="xMidYMid meet"/></svg>'}
drawQRs=function(){document.querySelectorAll("[data-qr]").forEach(function(el){if(el.firstChild)return;var s=brandQR(el.getAttribute("data-qr"));if(s)el.innerHTML=s})};
