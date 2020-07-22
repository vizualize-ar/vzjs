// resxclsa.js v5.7 Copyright 2004-2016 Certona Corporation www.certona.com. All rights reserved.
var certonaResx = (function(){"use strict";var e,n="certonaResx.showResponse",r="",t,i,s=false,c,o,f,a,l,u;function d(e){try{return parseInt(e,10)}catch(n){}}function x(e){try{var n;if(e!==undefined&&e!==null&&e!=="null"&&e!==""){n=true;return n}}catch(r){}return false}function p(){try{return resx.rrelem}catch(e){}return""}function m(e){try{var n=null,r,t;if(x(e)){n=[];if(x(document.getElementById(e))){n[0]=e}else{t=e.replace(/[,;]/g,".").split(".");for(r=0;r<t.length;r+=1){if(t[r]!==""&&x(document.getElementById(t[r]))){n[r]=t[r]}else{n[r]=""}}}}return n}catch(i){}return null}function h(){try{var e,n,r;if(resx.rrelem!==undefined){r=m(p());if(r!==undefined&&r!==null){for(e=0;e<r.length;e+=1){if(r[e]!==""){n=document.getElementById(r[e])}else{n=null}if(x(n)){n.style.visibility="visible"}}}}}catch(t){}}function g(e,n){try{if(!s){s=true;r=e+"|"+(n.number!==undefined?n.number:"undefined")+"|"+(n.name!==undefined?n.name:"undefined")+"|"+(n.description!==undefined?n.description:"undefined")}}catch(t){}finally{h()}}function y(e){try{var n,r,t;if(document.cookie.length>0){n=document.cookie;r=n.indexOf(e+"=");if(r!==-1){r+=e.length+1;t=n.indexOf(";",r);if(t===-1){t=n.length}return decodeURIComponent(n.slice(r,t))}}}catch(i){g("",i)}return null}function R(e,n,r,t){try{var i=new Date;if(r!==null){i.setTime(i.getTime()+r*3600*1e3)}document.cookie=e+"="+encodeURIComponent(n)+(r!==null?"; expires="+i.toGMTString():"")+"; path=/"+(x(t)?"; domain="+t:"")}catch(s){g("",s)}}function v(){try{var e,n,r,t,c;n=resx.rrec!==undefined&&(resx.rrec===true||resx.rrec==="true")&&a==="1"&&resx.rrelem!==undefined&&resx.rrelem!==null&&!s;if(n){if(!i){n=false;c=m(p());if(c!==undefined&&c!==null){for(e=0;e<c.length;e+=1){if(x(c[e])){n=true;break}}}}if(n){if(!x(resx.useitems)){n=false;if(resx.rrnum!==undefined){r=resx.rrnum;r+="";r=r.replace(/,/g,";");t=r.split(";");for(e=0;e<t.length;e+=1){if(!isNaN(t[e])&&d(t[e])>0){n=true;break}}}}}}return n}catch(o){}return false}function w(e){try{var n,r="";e+="";for(n=e.length-1;n>=0;n-=1){r+=e.charAt(n)}return r}catch(t){}return""}function k(){try{var e,n,r,t,i;if(navigator.userAgent.toLowerCase().indexOf("mac")===-1){i=Math.floor(Math.random()*1e15);i+=""}else{r=Math.floor(Math.random()*1e6);e=new Date;n=e.getTime();n+="";t=w(n);r+="";i=r+t.slice(0,11)}return i}catch(s){g("guid",s)}return""}function N(e){try{t=true;var n,r,s,c;if(!i){for(n=0;n<e.Resonance.Response.length;n+=1){r=false;s=e.Resonance.Response[n].scheme;if(e.Resonance.Response[n].display==="yes"){r=true;c=document.getElementById(s);if(x(c)){c.innerHTML=e.Resonance.Response[n].output}}if(typeof resonanceResponseLoaded==="function"){resonanceResponseLoaded(s,r)}}if(typeof resonanceResponseLoadedAll==="function"){resonanceResponseLoadedAll()}}}catch(o){}finally{h()}}function b(){try{if(!t&&!i){if(e<2e3){e=e+10;window.setTimeout(certonaResx.checkCallback,10)}else{i=true;h()}}}catch(n){h()}}function I(e){try{var r="",t="",i;if(typeof e==="boolean"&&e===true){if(x(resx.rrcall)){r=resx.rrcall}else{r=n}}else if(typeof e==="string"){r=e}if(r.length>0){if(r===n){t="&cb="}else{t="&ccb="}t+=r}i=(x(resx.useitems)?"&ui="+resx.useitems:"&no="+resx.rrnum)+(x(resx.exitemid)?"&ex="+resx.exitemid:"")+(x(resx.rrqs)?"&"+resx.rrqs:"")+t;return i}catch(s){}return""}function C(){try{var e,n,r=window.location.hostname;if(x(r)){if(!r.match(/(\d{1,3}\.){3}\d{1,3}/)){e=r.split(".");if(e.length>1){r="."+e[e.length-2]+"."+e[e.length-1];n=/\.co\.\w{2}$|\.com\.\w{2}$|\.\w{2}\.com$/;if(r.toLowerCase().match(n)&&e.length>2){r="."+e[e.length-3]+r}}}return r}}catch(t){g("gsd",t)}return null}function S(e){try{return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+encodeURI(e).replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"))}catch(n){}return null}function E(){try{var e,n="",r;for(e=0;e<51;e+=1){if(resx["cv"+e]!==undefined){r=resx["cv"+e];r+="";r=r.replace(/\+/g,"%2B");n+="&cv"+e+"="+encodeURIComponent(r)}}return n}catch(t){g("gcv",t)}return""}function L(p){try{var m={callback:false},w,N,b,I,E,L,T,U,B,M,$,q;if(p===undefined){p=m}else{for(I=0;I<m.length;I+=1){if(p[I]===undefined){p[I]=m[I]}}}s=false;r="";u="";l="";a="";o="";f="";c=false;t=false;i=false;e=0;w=C();T="RES_TRACKINGID";L="RES_SESSIONID";E="ResonanceSegment";u=S("resxtrack");if(x(u)){resx.sessionid="";resx.segment="";R(L,"",-1,w)}else if(x(resx.trackingid)){u=String(resx.trackingid)}else{u=y(T);if(!x(u)){u=k()}}l=x(resx.sessionid)?String(resx.sessionid):"";if(!x(l)){l=y(L);if(!x(l)){l=k()}}a=x(resx.segment)?String(resx.segment):"";if(!x(a)){q=d(u);if(!isNaN(q)&&q>0){q=String(q);q=q.slice(1,6);q=d(q);U=d(resx.top1);B=d(resx.top2);M=d(resx.top3);$=1e5;if(!(isNaN(U)&&isNaN(B)&&isNaN(M))){if(isNaN(U)){U=0}if(isNaN(B)){B=U}if(isNaN(M)){M=B}if(q<U){a="1"}else if(q<B){a="2"}else if(q<M){a="3"}else if(q<$){a="4"}}}}if(!x(a)){a=y(E)}if(isNaN(d(a))){a="1"}R(T,u,17520,w);if(!x(y(T))){R(T,u,null,w)}R(L,l,.5,w);if(!x(y(L))){R(L,l,null,w)}R(E,a,1440,w);if(!x(y(E))){R(E,a,null,w)}if(x(resx.pageid)){o=resx.pageid}else{o=k()}N=resx.links!==undefined?String(resx.links):"";if(x(N)){b=N.replace(/\,/g,";").replace(/\|/g,"%7C").split(";",50);for(I=0;I<b.length;I+=1){f+=b[I]+";"}}if(typeof p.callback==="string"&&p.callback!==n||p.callback===false||x(resx.rrcall)&&resx.rrcall!==n){i=true}c=v()&&x(u)&&x(o);if(!c){h()}}catch(A){g("pv",A)}}function T(e){try{var n,t,i,d,m,h,g,y="5.7a";if(a==="1"||a==="2"||a==="3"){if(c){window.setTimeout(certonaResx.checkCallback,50)}t=window.location.protocol.toLowerCase()==="https:"?"https://":"http://";m="www.res-x.com";if(x(resx.host)){m=resx.host}i="appid="+(resx.appid!==undefined?resx.appid:"")+"&tk="+(x(u)?u:"")+"&ss="+(x(l)?l:"")+"&sg="+(x(a)?a:"")+"&pg="+(x(o)?o:"")+"&vr="+y+"&bx="+c;g="";if(resx.rrelem!==undefined&&resx.rrelem!==null){h=p().replace(/[,;]/g,".").split(".");if(h!==null){for(n=0;n<h.length;n+=1){g+="&sc="+h[n]}}}i+=g+(resx.event!==undefined?"&ev="+resx.event:"")+(resx.itemid!==undefined?"&ei="+resx.itemid:"")+(resx.qty!==undefined?"&qty="+resx.qty:"")+(resx.price!==undefined?"&pr="+resx.price:"")+(resx.shipping!==undefined?"&sh="+resx.shipping:"")+(resx.total!==undefined?"&tt="+resx.total:"")+(resx.currencycode!==undefined?"&cc="+resx.currencycode:"")+(resx.customerid!==undefined?"&cu="+resx.customerid:"")+(resx.transactionid!==undefined?"&tr="+resx.transactionid:"");i+=(c?I(e):"")+E()+"&ur="+encodeURIComponent(window.location.href.slice(0,400))+"&plk="+(x(f)?f:"")+"&rf="+encodeURIComponent(document.referrer)+(s===true?"&er="+s+"&em="+encodeURIComponent(r):"");d=t+m+"/ws/r2/Resonance.aspx"+"?"+i;return d.slice(0,2013)}}catch(R){}return""}function U(e){try{if(e!==""){var n=document.createElement("script"),r=document.getElementsByTagName("script")[0];n.type="text/javascript";n.async=true;n.src=e;r.parentNode.insertBefore(n,r)}}catch(t){}}function B(e){var n={callback:false},r;if(e===undefined){e=n}else{for(r=0;r<n.length;r+=1){if(e[r]===undefined){e[r]=n[r]}}}return T(e.callback)}function M(){L({callback:true});var e=T(true);U(e)}return{checkCallback:function(){b()},showResponse:function(e){N(e)},getURL:function(e){L(e);return B(e)},run:function(){M()}}}()); certonaResx.run();
