(()=>{var hp=0,z0=1,cp=2;var Na=1,up=2,un=3,qr=0,Gt=1,ri=2,ir=0,fn=1,zi=2,H0=3,V0=4,pp=5;var Pa=100,dp=101,fp=102,mp=103,gp=104,_p=200,vp=201,xp=202,yp=203,tc=204,ic=205,bp=206,Sp=207,Mp=208,Ep=209,Tp=210,wp=211,Ap=212,Rp=213,Cp=214,Zo=0,Jo=1,Ko=2,vn=3,$o=4,Qo=5,el=6,tl=7,Bs=0,Pp=1,Ip=2,Fi=0,rc=1,ac=2,nc=3,sc=4,oc=5,lc=6,hc=7;var cc=300,Xr=301,za=302,co=303,uo=304,zs=306,Yr=1e3,tr=1001,il=1002,Bt=1003,Lp=1004;var Da=1005;var Yt=1006,po=1007;var kr=1008;var hi=1009,uc=1010,pc=1011,xn=1012,Hl=1013,Hi=1014,Mi=1015,Vi=1016,Vl=1017,Gl=1018,yn=1020,dc=35902,fc=35899,mc=1021,gc=1022,Ei=1023,ar=1026,Wr=1027,kl=1028,Wl=1029,Zr=1030,jl=1031;var ql=1033,Ms=33776,Es=33777,Ts=33778,ws=33779,rl=35840,al=35841,nl=35842,sl=35843,ol=36196,ll=37492,hl=37496,cl=37488,ul=37489,Ps=37490,pl=37491,dl=37808,fl=37809,ml=37810,gl=37811,_l=37812,vl=37813,xl=37814,yl=37815,bl=37816,Sl=37817,Ml=37818,El=37819,Tl=37820,wl=37821,Al=36492,Rl=36494,Cl=36495,Pl=36283,Il=36284,Is=36285,Ll=36286;var Ls=2300,Dl=2301,fo=2302,G0=2303,k0=2400,W0=2401,j0=2402;var Dp=3200;var bn=0,Up=1,br="",Nt="srgb",Ds="srgb-linear",Us="linear",ft="srgb";var mo=7680;var Np=519,Op=512,Fp=513,Bp=514,Xl=515,zp=516,Hp=517,Yl=518,Vp=519,_c=35044;var q0="300 es",Ti=2e3,Sn=2001;function Gp(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function kp(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Ns(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function Wp(){let e=Ns("canvas");return e.style.display="block",e}var X0={},Ha=null;function Os(...e){let t="THREE."+e.shift();Ha?Ha("log",t,...e):console.log(t,...e)}function vc(e){let t=e[0];if(typeof t=="string"&&t.startsWith("TSL:")){let i=e[1];i&&i.isStackTrace?e[0]+=" "+i.getLocation():e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function qe(...e){e=vc(e);let t="THREE."+e.shift();if(Ha)Ha("warn",t,...e);else{let i=e[0];i&&i.isStackTrace?console.warn(i.getError(t)):console.warn(t,...e)}}function Ye(...e){e=vc(e);let t="THREE."+e.shift();if(Ha)Ha("error",t,...e);else{let i=e[0];i&&i.isStackTrace?console.error(i.getError(t)):console.error(t,...e)}}function Oa(...e){let t=e.join(" ");t in X0||(X0[t]=!0,qe(...e))}function jp(e,t,i){return new Promise(function(r,a){function n(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(n,i);break;default:r()}}setTimeout(n,i)})}var qp={[Zo]:Jo,[Ko]:el,[$o]:tl,[vn]:Qo,[Jo]:Zo,[el]:Ko,[tl]:$o,[Qo]:vn},Kr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let a=0,n=r.length;a<n;a++)r[a].call(this,e);e.target=null}}},jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Y0=1234567,Fa=Math.PI/180,Mn=180/Math.PI;function Bi(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(jt[e&255]+jt[e>>8&255]+jt[e>>16&255]+jt[e>>24&255]+"-"+jt[t&255]+jt[t>>8&255]+"-"+jt[t>>16&15|64]+jt[t>>24&255]+"-"+jt[i&63|128]+jt[i>>8&255]+"-"+jt[i>>16&255]+jt[i>>24&255]+jt[r&255]+jt[r>>8&255]+jt[r>>16&255]+jt[r>>24&255]).toLowerCase()}function tt(e,t,i){return Math.max(t,Math.min(i,e))}function Zl(e,t){return(e%t+t)%t}function Xp(e,t,i,r,a){return r+(e-t)*(a-r)/(i-t)}function Yp(e,t,i){return e!==t?(i-e)/(t-e):0}function mn(e,t,i){return(1-i)*e+i*t}function Zp(e,t,i,r){return mn(e,t,1-Math.exp(-i*r))}function Jp(e,t=1){return t-Math.abs(Zl(e,t*2)-t)}function Kp(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*(3-2*e))}function $p(e,t,i){return e<=t?0:e>=i?1:(e=(e-t)/(i-t),e*e*e*(e*(e*6-15)+10))}function Qp(e,t){return e+Math.floor(Math.random()*(t-e+1))}function ed(e,t){return e+Math.random()*(t-e)}function td(e){return e*(.5-Math.random())}function id(e){e!==void 0&&(Y0=e);let t=Y0+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function rd(e){return e*Fa}function ad(e){return e*Mn}function nd(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function sd(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))}function od(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function ld(e,t,i,r,a){let n=Math.cos,s=Math.sin,o=n(i/2),l=s(i/2),h=n((t+r)/2),c=s((t+r)/2),p=n((t-r)/2),u=s((t-r)/2),f=n((r-t)/2),_=s((r-t)/2);switch(a){case"XYX":e.set(o*c,l*p,l*u,o*h);break;case"YZY":e.set(l*u,o*c,l*p,o*h);break;case"ZXZ":e.set(l*p,l*u,o*c,o*h);break;case"XZX":e.set(o*c,l*_,l*f,o*h);break;case"YXY":e.set(l*f,o*c,l*_,o*h);break;case"ZYZ":e.set(l*_,l*f,o*c,o*h);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Si(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function mt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var xc={DEG2RAD:Fa,RAD2DEG:Mn,generateUUID:Bi,clamp:tt,euclideanModulo:Zl,mapLinear:Xp,inverseLerp:Yp,lerp:mn,damp:Zp,pingpong:Jp,smoothstep:Kp,smootherstep:$p,randInt:Qp,randFloat:ed,randFloatSpread:td,seededRandom:id,degToRad:rd,radToDeg:ad,isPowerOfTwo:nd,ceilPowerOfTwo:sd,floorPowerOfTwo:od,setQuaternionFromProperEuler:ld,normalize:mt,denormalize:Si},se=class yc{static{yc.prototype.isVector2=!0}constructor(t=0,i=0){this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let i=this.x,r=this.y,a=t.elements;return this.x=a[0]*i+a[3]*r+a[6],this.y=a[1]*i+a[4]*r+a[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=tt(this.x,t.x,i.x),this.y=tt(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=tt(this.x,t,i),this.y=tt(this.y,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tt(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(tt(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y;return i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){let r=Math.cos(i),a=Math.sin(i),n=this.x-t.x,s=this.y-t.y;return this.x=n*r-s*a+t.x,this.y=n*a+s*r+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ti=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,a,n,s){let o=i[r+0],l=i[r+1],h=i[r+2],c=i[r+3],p=a[n+0],u=a[n+1],f=a[n+2],_=a[n+3];if(c!==_||o!==p||l!==u||h!==f){let y=o*p+l*u+h*f+c*_;y<0&&(p=-p,u=-u,f=-f,_=-_,y=-y);let m=1-s;if(y<.9995){let d=Math.acos(y),w=Math.sin(d);m=Math.sin(m*d)/w,s=Math.sin(s*d)/w,o=o*m+p*s,l=l*m+u*s,h=h*m+f*s,c=c*m+_*s}else{o=o*m+p*s,l=l*m+u*s,h=h*m+f*s,c=c*m+_*s;let d=1/Math.sqrt(o*o+l*l+h*h+c*c);o*=d,l*=d,h*=d,c*=d}}e[t]=o,e[t+1]=l,e[t+2]=h,e[t+3]=c}static multiplyQuaternionsFlat(e,t,i,r,a,n){let s=i[r],o=i[r+1],l=i[r+2],h=i[r+3],c=a[n],p=a[n+1],u=a[n+2],f=a[n+3];return e[t]=s*f+h*c+o*u-l*p,e[t+1]=o*f+h*p+l*c-s*u,e[t+2]=l*f+h*u+s*p-o*c,e[t+3]=h*f-s*c-o*p-l*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,a=e._z,n=e._order,s=Math.cos,o=Math.sin,l=s(i/2),h=s(r/2),c=s(a/2),p=o(i/2),u=o(r/2),f=o(a/2);switch(n){case"XYZ":this._x=p*h*c+l*u*f,this._y=l*u*c-p*h*f,this._z=l*h*f+p*u*c,this._w=l*h*c-p*u*f;break;case"YXZ":this._x=p*h*c+l*u*f,this._y=l*u*c-p*h*f,this._z=l*h*f-p*u*c,this._w=l*h*c+p*u*f;break;case"ZXY":this._x=p*h*c-l*u*f,this._y=l*u*c+p*h*f,this._z=l*h*f+p*u*c,this._w=l*h*c-p*u*f;break;case"ZYX":this._x=p*h*c-l*u*f,this._y=l*u*c+p*h*f,this._z=l*h*f-p*u*c,this._w=l*h*c+p*u*f;break;case"YZX":this._x=p*h*c+l*u*f,this._y=l*u*c+p*h*f,this._z=l*h*f-p*u*c,this._w=l*h*c-p*u*f;break;case"XZY":this._x=p*h*c-l*u*f,this._y=l*u*c-p*h*f,this._z=l*h*f+p*u*c,this._w=l*h*c+p*u*f;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+n)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10],p=i+s+c;if(p>0){let u=.5/Math.sqrt(p+1);this._w=.25/u,this._x=(h-o)*u,this._y=(a-l)*u,this._z=(n-r)*u}else if(i>s&&i>c){let u=2*Math.sqrt(1+i-s-c);this._w=(h-o)/u,this._x=.25*u,this._y=(r+n)/u,this._z=(a+l)/u}else if(s>c){let u=2*Math.sqrt(1+s-i-c);this._w=(a-l)/u,this._x=(r+n)/u,this._y=.25*u,this._z=(o+h)/u}else{let u=2*Math.sqrt(1+c-i-s);this._w=(n-r)/u,this._x=(a+l)/u,this._y=(o+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=t._x,o=t._y,l=t._z,h=t._w;return this._x=i*h+n*s+r*l-a*o,this._y=r*h+n*o+a*s-i*l,this._z=a*h+n*l+i*o-r*s,this._w=n*h-i*s-r*o-a*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,a=e._z,n=e._w,s=this.dot(e);s<0&&(i=-i,r=-r,a=-a,n=-n,s=-s);let o=1-t;if(s<.9995){let l=Math.acos(s),h=Math.sin(l);o=Math.sin(o*l)/h,t=Math.sin(t*l)/h,this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this._onChangeCallback()}else this._x=this._x*o+i*t,this._y=this._y*o+r*t,this._z=this._z*o+a*t,this._w=this._w*o+n*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},x=class bc{static{bc.prototype.isVector3=!0}constructor(t=0,i=0,r=0){this.x=t,this.y=i,this.z=r}set(t,i,r){return r===void 0&&(r=this.z),this.x=t,this.y=i,this.z=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(Z0.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(Z0.setFromAxisAngle(t,i))}applyMatrix3(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[3]*r+n[6]*a,this.y=n[1]*i+n[4]*r+n[7]*a,this.z=n[2]*i+n[5]*r+n[8]*a,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=t.elements,s=1/(n[3]*i+n[7]*r+n[11]*a+n[15]);return this.x=(n[0]*i+n[4]*r+n[8]*a+n[12])*s,this.y=(n[1]*i+n[5]*r+n[9]*a+n[13])*s,this.z=(n[2]*i+n[6]*r+n[10]*a+n[14])*s,this}applyQuaternion(t){let i=this.x,r=this.y,a=this.z,n=t.x,s=t.y,o=t.z,l=t.w,h=2*(s*a-o*r),c=2*(o*i-n*a),p=2*(n*r-s*i);return this.x=i+l*h+s*p-o*c,this.y=r+l*c+o*h-n*p,this.z=a+l*p+n*c-s*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let i=this.x,r=this.y,a=this.z,n=t.elements;return this.x=n[0]*i+n[4]*r+n[8]*a,this.y=n[1]*i+n[5]*r+n[9]*a,this.z=n[2]*i+n[6]*r+n[10]*a,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=tt(this.x,t.x,i.x),this.y=tt(this.y,t.y,i.y),this.z=tt(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=tt(this.x,t,i),this.y=tt(this.y,t,i),this.z=tt(this.z,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tt(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){let r=t.x,a=t.y,n=t.z,s=i.x,o=i.y,l=i.z;return this.x=a*l-n*o,this.y=n*s-r*l,this.z=r*o-a*s,this}projectOnVector(t){let i=t.lengthSq();if(i===0)return this.set(0,0,0);let r=t.dot(this)/i;return this.copy(t).multiplyScalar(r)}projectOnPlane(t){return go.copy(this).projectOnVector(t),this.sub(go)}reflect(t){return this.sub(go.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;let r=this.dot(t)/i;return Math.acos(tt(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let i=this.x-t.x,r=this.y-t.y,a=this.z-t.z;return i*i+r*r+a*a}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,r){let a=Math.sin(i)*t;return this.x=a*Math.sin(r),this.y=Math.cos(i)*t,this.z=a*Math.cos(r),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,r){return this.x=t*Math.sin(i),this.y=r,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){let i=this.setFromMatrixColumn(t,0).length(),r=this.setFromMatrixColumn(t,1).length(),a=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=r,this.z=a,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(t),this.y=i,this.z=r*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},go=new x,Z0=new ti,Qe=class Sc{static{Sc.prototype.isMatrix3=!0}constructor(t,i,r,a,n,s,o,l,h){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h)}set(t,i,r,a,n,s,o,l,h){let c=this.elements;return c[0]=t,c[1]=a,c[2]=o,c[3]=i,c[4]=n,c[5]=l,c[6]=r,c[7]=s,c[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(t,i,r){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[3],l=r[6],h=r[1],c=r[4],p=r[7],u=r[2],f=r[5],_=r[8],y=a[0],m=a[3],d=a[6],w=a[1],A=a[4],v=a[7],T=a[2],C=a[5],M=a[8];return n[0]=s*y+o*w+l*T,n[3]=s*m+o*A+l*C,n[6]=s*d+o*v+l*M,n[1]=h*y+c*w+p*T,n[4]=h*m+c*A+p*C,n[7]=h*d+c*v+p*M,n[2]=u*y+f*w+_*T,n[5]=u*m+f*A+_*C,n[8]=u*d+f*v+_*M,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8];return i*s*c-i*o*h-r*n*c+r*o*l+a*n*h-a*s*l}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],p=c*s-o*h,u=o*l-c*n,f=h*n-s*l,_=i*p+r*u+a*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/_;return t[0]=p*y,t[1]=(a*h-c*r)*y,t[2]=(o*r-a*s)*y,t[3]=u*y,t[4]=(c*i-a*l)*y,t[5]=(a*n-o*i)*y,t[6]=f*y,t[7]=(r*l-h*i)*y,t[8]=(s*i-r*n)*y,this}transpose(){let t,i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,r,a,n,s,o){let l=Math.cos(n),h=Math.sin(n);return this.set(r*l,r*h,-r*(l*s+h*o)+s+t,-a*h,a*l,-a*(-h*s+l*o)+o+i,0,0,1),this}scale(t,i){return Oa("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(_o.makeScale(t,i)),this}rotate(t){return Oa("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(_o.makeRotation(-t)),this}translate(t,i){return Oa("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(_o.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<9;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<9;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t}clone(){return new this.constructor().fromArray(this.elements)}},_o=new Qe,J0=new Qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),K0=new Qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hd(){let e={enabled:!0,workingColorSpace:Ds,spaces:{},convert:function(a,n,s){return this.enabled===!1||n===s||!n||!s||(this.spaces[n].transfer===ft&&(a.r=rr(a.r),a.g=rr(a.g),a.b=rr(a.b)),this.spaces[n].primaries!==this.spaces[s].primaries&&(a.applyMatrix3(this.spaces[n].toXYZ),a.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===ft&&(a.r=Ba(a.r),a.g=Ba(a.g),a.b=Ba(a.b))),a},workingToColorSpace:function(a,n){return this.convert(a,this.workingColorSpace,n)},colorSpaceToWorking:function(a,n){return this.convert(a,n,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===br?Us:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,n=this.workingColorSpace){return a.fromArray(this.spaces[n].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,n,s){return a.copy(this.spaces[n].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,n){return Oa("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(a,n)},toWorkingColorSpace:function(a,n){return Oa("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(a,n)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ds]:{primaries:t,whitePoint:r,transfer:Us,toXYZ:J0,fromXYZ:K0,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Nt},outputColorSpaceConfig:{drawingBufferColorSpace:Nt}},[Nt]:{primaries:t,whitePoint:r,transfer:ft,toXYZ:J0,fromXYZ:K0,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Nt}}}),e}var ot=hd();function rr(e){return e<.04045?e*.0773993808:Math.pow(e*.9478672986+.0521327014,2.4)}function Ba(e){return e<.0031308?e*12.92:1.055*Math.pow(e,.41666)-.055}var ua,cd=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ua===void 0&&(ua=Ns("canvas")),ua.width=e.width,ua.height=e.height;let r=ua.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ua}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ns("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let n=0;n<a.length;n++)a[n]=rr(a[n]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(rr(t[i]/255)*255):t[i]=rr(t[i]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},ud=0,Jl=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ud++}),this.uuid=Bi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let n=0,s=r.length;n<s;n++)r[n].isDataTexture?a.push(vo(r[n].image)):a.push(vo(r[n]))}else a=vo(r);i.url=a}return t||(e.images[this.uuid]=i),i}};function vo(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap?cd.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}var pd=0,xo=new x,gi=class As extends Kr{constructor(t=As.DEFAULT_IMAGE,i=As.DEFAULT_MAPPING,r=tr,a=tr,n=Yt,s=kr,o=Ei,l=hi,h=As.DEFAULT_ANISOTROPY,c=br){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=Bi(),this.name="",this.source=new Jl(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=n,this.minFilter=s,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(xo).x}get height(){return this.source.getSize(xo).y}get depth(){return this.source.getSize(xo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let i in t){let r=t[i];if(r===void 0){qe(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}let a=this[i];if(a===void 0){qe(`Texture.setValues(): property '${i}' does not exist.`);continue}a&&r&&a.isVector2&&r.isVector2||a&&r&&a.isVector3&&r.isVector3||a&&r&&a.isMatrix3&&r.isMatrix3?a.copy(r):this[i]=r}}toJSON(t){let i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(t.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Yr:t.x=t.x-Math.floor(t.x);break;case tr:t.x=t.x<0?0:1;break;case il:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Yr:t.y=t.y-Math.floor(t.y);break;case tr:t.y=t.y<0?0:1;break;case il:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};gi.DEFAULT_IMAGE=null;gi.DEFAULT_MAPPING=cc;gi.DEFAULT_ANISOTROPY=1;var Mt=class Mc{static{Mc.prototype.isVector4=!0}constructor(t=0,i=0,r=0,a=1){this.x=t,this.y=i,this.z=r,this.w=a}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,r,a){return this.x=t,this.y=i,this.z=r,this.w=a,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let i=this.x,r=this.y,a=this.z,n=this.w,s=t.elements;return this.x=s[0]*i+s[4]*r+s[8]*a+s[12]*n,this.y=s[1]*i+s[5]*r+s[9]*a+s[13]*n,this.z=s[2]*i+s[6]*r+s[10]*a+s[14]*n,this.w=s[3]*i+s[7]*r+s[11]*a+s[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,r,a,n,s=t.elements,o=s[0],l=s[4],h=s[8],c=s[1],p=s[5],u=s[9],f=s[2],_=s[6],y=s[10];if(Math.abs(l-c)<.01&&Math.abs(h-f)<.01&&Math.abs(u-_)<.01){if(Math.abs(l+c)<.1&&Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(o+p+y-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;let d=(o+1)/2,w=(p+1)/2,A=(y+1)/2,v=(l+c)/4,T=(h+f)/4,C=(u+_)/4;return d>w&&d>A?d<.01?(r=0,a=.707106781,n=.707106781):(r=Math.sqrt(d),a=v/r,n=T/r):w>A?w<.01?(r=.707106781,a=0,n=.707106781):(a=Math.sqrt(w),r=v/a,n=C/a):A<.01?(r=.707106781,a=.707106781,n=0):(n=Math.sqrt(A),r=T/n,a=C/n),this.set(r,a,n,i),this}let m=Math.sqrt((_-u)*(_-u)+(h-f)*(h-f)+(c-l)*(c-l));return Math.abs(m)<.001&&(m=1),this.x=(_-u)/m,this.y=(h-f)/m,this.z=(c-l)/m,this.w=Math.acos((o+p+y-1)/2),this}setFromMatrixPosition(t){let i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=tt(this.x,t.x,i.x),this.y=tt(this.y,t.y,i.y),this.z=tt(this.z,t.z,i.z),this.w=tt(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=tt(this.x,t,i),this.y=tt(this.y,t,i),this.z=tt(this.z,t,i),this.w=tt(this.w,t,i),this}clampLength(t,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tt(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this.w=t.w+(i.w-t.w)*r,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},dd=class extends Kr{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Yt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:i.depth},a=new gi(r),n=i.count;for(let s=0;s<n;s++)this.textures[s]=a.clone(),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Jl(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},wi=class extends dd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Ec=class extends gi{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var fd=class extends gi{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Ke=class Ul{static{Ul.prototype.isMatrix4=!0}constructor(t,i,r,a,n,s,o,l,h,c,p,u,f,_,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,r,a,n,s,o,l,h,c,p,u,f,_,y,m)}set(t,i,r,a,n,s,o,l,h,c,p,u,f,_,y,m){let d=this.elements;return d[0]=t,d[4]=i,d[8]=r,d[12]=a,d[1]=n,d[5]=s,d[9]=o,d[13]=l,d[2]=h,d[6]=c,d[10]=p,d[14]=u,d[3]=f,d[7]=_,d[11]=y,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ul().fromArray(this.elements)}copy(t){let i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(t){let i=this.elements,r=t.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(t){let i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,r){return this.determinantAffine()===0?(t.set(1,0,0),i.set(0,1,0),r.set(0,0,1),this):(t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(t,i,r){return this.set(t.x,i.x,r.x,0,t.y,i.y,r.y,0,t.z,i.z,r.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let i=this.elements,r=t.elements,a=1/pa.setFromMatrixColumn(t,0).length(),n=1/pa.setFromMatrixColumn(t,1).length(),s=1/pa.setFromMatrixColumn(t,2).length();return i[0]=r[0]*a,i[1]=r[1]*a,i[2]=r[2]*a,i[3]=0,i[4]=r[4]*n,i[5]=r[5]*n,i[6]=r[6]*n,i[7]=0,i[8]=r[8]*s,i[9]=r[9]*s,i[10]=r[10]*s,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){let i=this.elements,r=t.x,a=t.y,n=t.z,s=Math.cos(r),o=Math.sin(r),l=Math.cos(a),h=Math.sin(a),c=Math.cos(n),p=Math.sin(n);if(t.order==="XYZ"){let u=s*c,f=s*p,_=o*c,y=o*p;i[0]=l*c,i[4]=-l*p,i[8]=h,i[1]=f+_*h,i[5]=u-y*h,i[9]=-o*l,i[2]=y-u*h,i[6]=_+f*h,i[10]=s*l}else if(t.order==="YXZ"){let u=l*c,f=l*p,_=h*c,y=h*p;i[0]=u+y*o,i[4]=_*o-f,i[8]=s*h,i[1]=s*p,i[5]=s*c,i[9]=-o,i[2]=f*o-_,i[6]=y+u*o,i[10]=s*l}else if(t.order==="ZXY"){let u=l*c,f=l*p,_=h*c,y=h*p;i[0]=u-y*o,i[4]=-s*p,i[8]=_+f*o,i[1]=f+_*o,i[5]=s*c,i[9]=y-u*o,i[2]=-s*h,i[6]=o,i[10]=s*l}else if(t.order==="ZYX"){let u=s*c,f=s*p,_=o*c,y=o*p;i[0]=l*c,i[4]=_*h-f,i[8]=u*h+y,i[1]=l*p,i[5]=y*h+u,i[9]=f*h-_,i[2]=-h,i[6]=o*l,i[10]=s*l}else if(t.order==="YZX"){let u=s*l,f=s*h,_=o*l,y=o*h;i[0]=l*c,i[4]=y-u*p,i[8]=_*p+f,i[1]=p,i[5]=s*c,i[9]=-o*c,i[2]=-h*c,i[6]=f*p+_,i[10]=u-y*p}else if(t.order==="XZY"){let u=s*l,f=s*h,_=o*l,y=o*h;i[0]=l*c,i[4]=-p,i[8]=h*c,i[1]=u*p+y,i[5]=s*c,i[9]=f*p-_,i[2]=_*p-f,i[6]=o*c,i[10]=y*p+u}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(md,t,gd)}lookAt(t,i,r){let a=this.elements;return oi.subVectors(t,i),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),mr.crossVectors(r,oi),mr.lengthSq()===0&&(Math.abs(r.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),mr.crossVectors(r,oi)),mr.normalize(),jn.crossVectors(oi,mr),a[0]=mr.x,a[4]=jn.x,a[8]=oi.x,a[1]=mr.y,a[5]=jn.y,a[9]=oi.y,a[2]=mr.z,a[6]=jn.z,a[10]=oi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){let r=t.elements,a=i.elements,n=this.elements,s=r[0],o=r[4],l=r[8],h=r[12],c=r[1],p=r[5],u=r[9],f=r[13],_=r[2],y=r[6],m=r[10],d=r[14],w=r[3],A=r[7],v=r[11],T=r[15],C=a[0],M=a[4],g=a[8],b=a[12],I=a[1],P=a[5],L=a[9],V=a[13],D=a[2],H=a[6],J=a[10],j=a[14],ue=a[3],Z=a[7],K=a[11],te=a[15];return n[0]=s*C+o*I+l*D+h*ue,n[4]=s*M+o*P+l*H+h*Z,n[8]=s*g+o*L+l*J+h*K,n[12]=s*b+o*V+l*j+h*te,n[1]=c*C+p*I+u*D+f*ue,n[5]=c*M+p*P+u*H+f*Z,n[9]=c*g+p*L+u*J+f*K,n[13]=c*b+p*V+u*j+f*te,n[2]=_*C+y*I+m*D+d*ue,n[6]=_*M+y*P+m*H+d*Z,n[10]=_*g+y*L+m*J+d*K,n[14]=_*b+y*V+m*j+d*te,n[3]=w*C+A*I+v*D+T*ue,n[7]=w*M+A*P+v*H+T*Z,n[11]=w*g+A*L+v*J+T*K,n[15]=w*b+A*V+v*j+T*te,this}multiplyScalar(t){let i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[12],s=t[1],o=t[5],l=t[9],h=t[13],c=t[2],p=t[6],u=t[10],f=t[14],_=t[3],y=t[7],m=t[11],d=t[15],w=l*f-h*u,A=o*f-h*p,v=o*u-l*p,T=s*f-h*c,C=s*u-l*c,M=s*p-o*c;return i*(y*w-m*A+d*v)-r*(_*w-m*T+d*C)+a*(_*A-y*T+d*M)-n*(_*v-y*C+m*M)}determinantAffine(){let t=this.elements,i=t[0],r=t[4],a=t[8],n=t[1],s=t[5],o=t[9],l=t[2],h=t[6],c=t[10];return i*(s*c-o*h)-r*(n*c-o*l)+a*(n*h-s*l)}transpose(){let t=this.elements,i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,r){let a=this.elements;return t.isVector3?(a[12]=t.x,a[13]=t.y,a[14]=t.z):(a[12]=t,a[13]=i,a[14]=r),this}invert(){let t=this.elements,i=t[0],r=t[1],a=t[2],n=t[3],s=t[4],o=t[5],l=t[6],h=t[7],c=t[8],p=t[9],u=t[10],f=t[11],_=t[12],y=t[13],m=t[14],d=t[15],w=i*o-r*s,A=i*l-a*s,v=i*h-n*s,T=r*l-a*o,C=r*h-n*o,M=a*h-n*l,g=c*y-p*_,b=c*m-u*_,I=c*d-f*_,P=p*m-u*y,L=p*d-f*y,V=u*d-f*m,D=w*V-A*L+v*P+T*I-C*b+M*g;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/D;return t[0]=(o*V-l*L+h*P)*H,t[1]=(a*L-r*V-n*P)*H,t[2]=(y*M-m*C+d*T)*H,t[3]=(u*C-p*M-f*T)*H,t[4]=(l*I-s*V-h*b)*H,t[5]=(i*V-a*I+n*b)*H,t[6]=(m*v-_*M-d*A)*H,t[7]=(c*M-u*v+f*A)*H,t[8]=(s*L-o*I+h*g)*H,t[9]=(r*I-i*L-n*g)*H,t[10]=(_*C-y*v+d*w)*H,t[11]=(p*v-c*C-f*w)*H,t[12]=(o*b-s*P-l*g)*H,t[13]=(i*P-r*b+a*g)*H,t[14]=(y*A-_*T-m*w)*H,t[15]=(c*T-p*A+u*w)*H,this}scale(t){let i=this.elements,r=t.x,a=t.y,n=t.z;return i[0]*=r,i[4]*=a,i[8]*=n,i[1]*=r,i[5]*=a,i[9]*=n,i[2]*=r,i[6]*=a,i[10]*=n,i[3]*=r,i[7]*=a,i[11]*=n,this}getMaxScaleOnAxis(){let t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],a=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,r,a))}makeTranslation(t,i,r){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(t){let i=Math.cos(t),r=Math.sin(t);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(t){let i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){let r=Math.cos(i),a=Math.sin(i),n=1-r,s=t.x,o=t.y,l=t.z,h=n*s,c=n*o;return this.set(h*s+r,h*o-a*l,h*l+a*o,0,h*o+a*l,c*o+r,c*l-a*s,0,h*l-a*o,c*l+a*s,n*l*l+r,0,0,0,0,1),this}makeScale(t,i,r){return this.set(t,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(t,i,r,a,n,s){return this.set(1,r,n,0,t,1,s,0,i,a,1,0,0,0,0,1),this}compose(t,i,r){let a=this.elements,n=i._x,s=i._y,o=i._z,l=i._w,h=n+n,c=s+s,p=o+o,u=n*h,f=n*c,_=n*p,y=s*c,m=s*p,d=o*p,w=l*h,A=l*c,v=l*p,T=r.x,C=r.y,M=r.z;return a[0]=(1-(y+d))*T,a[1]=(f+v)*T,a[2]=(_-A)*T,a[3]=0,a[4]=(f-v)*C,a[5]=(1-(u+d))*C,a[6]=(m+w)*C,a[7]=0,a[8]=(_+A)*M,a[9]=(m-w)*M,a[10]=(1-(u+y))*M,a[11]=0,a[12]=t.x,a[13]=t.y,a[14]=t.z,a[15]=1,this}decompose(t,i,r){let a=this.elements;t.x=a[12],t.y=a[13],t.z=a[14];let n=this.determinantAffine();if(n===0)return r.set(1,1,1),i.identity(),this;let s=pa.set(a[0],a[1],a[2]).length(),o=pa.set(a[4],a[5],a[6]).length(),l=pa.set(a[8],a[9],a[10]).length();n<0&&(s=-s),xi.copy(this);let h=1/s,c=1/o,p=1/l;return xi.elements[0]*=h,xi.elements[1]*=h,xi.elements[2]*=h,xi.elements[4]*=c,xi.elements[5]*=c,xi.elements[6]*=c,xi.elements[8]*=p,xi.elements[9]*=p,xi.elements[10]*=p,i.setFromRotationMatrix(xi),r.x=s,r.y=o,r.z=l,this}makePerspective(t,i,r,a,n,s,o=Ti,l=!1){let h=this.elements,c=2*n/(i-t),p=2*n/(r-a),u=(i+t)/(i-t),f=(r+a)/(r-a),_,y;if(l)_=n/(s-n),y=s*n/(s-n);else if(o===Ti)_=-(s+n)/(s-n),y=-2*s*n/(s-n);else if(o===Sn)_=-s/(s-n),y=-s*n/(s-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=u,h[12]=0,h[1]=0,h[5]=p,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=_,h[14]=y,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,i,r,a,n,s,o=Ti,l=!1){let h=this.elements,c=2/(i-t),p=2/(r-a),u=-(i+t)/(i-t),f=-(r+a)/(r-a),_,y;if(l)_=1/(s-n),y=s/(s-n);else if(o===Ti)_=-2/(s-n),y=-(s+n)/(s-n);else if(o===Sn)_=-1/(s-n),y=-n/(s-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return h[0]=c,h[4]=0,h[8]=0,h[12]=u,h[1]=0,h[5]=p,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=_,h[14]=y,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){let i=this.elements,r=t.elements;for(let a=0;a<16;a++)if(i[a]!==r[a])return!1;return!0}fromArray(t,i=0){for(let r=0;r<16;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){let r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t[i+9]=r[9],t[i+10]=r[10],t[i+11]=r[11],t[i+12]=r[12],t[i+13]=r[13],t[i+14]=r[14],t[i+15]=r[15],t}},pa=new x,xi=new Ke,md=new x(0,0,0),gd=new x(1,1,1),mr=new x,jn=new x,oi=new x,$0=new Ke,Q0=new ti,mi=class Tc{constructor(t=0,i=0,r=0,a=Tc.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=r,this._order=a}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,r,a=this._order){return this._x=t,this._y=i,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,r=!0){let a=t.elements,n=a[0],s=a[4],o=a[8],l=a[1],h=a[5],c=a[9],p=a[2],u=a[6],f=a[10];switch(i){case"XYZ":this._y=Math.asin(tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,f),this._z=Math.atan2(-s,n)):(this._x=Math.atan2(u,h),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-p,n),this._z=0);break;case"ZXY":this._x=Math.asin(tt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-p,f),this._z=Math.atan2(-s,h)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-tt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-s,h));break;case"YZX":this._z=Math.asin(tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,h),this._y=Math.atan2(-p,n)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-tt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(u,h),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-c,f),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,r){return $0.makeRotationFromQuaternion(t),this.setFromRotationMatrix($0,i,r)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return Q0.setFromEuler(this),this.setFromQuaternion(Q0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};mi.DEFAULT_ORDER="XYZ";var wc=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},_d=0,eh=new x,da=new ti,Ji=new Ke,qn=new x,Qa=new x,vd=new x,xd=new ti,th=new x(1,0,0),ih=new x(0,1,0),rh=new x(0,0,1),ah={type:"added"},yd={type:"removed"},fa={type:"childadded",child:null},yo={type:"childremoved",child:null},ei=class Rs extends Kr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=Bi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rs.DEFAULT_UP.clone();let t=new x,i=new mi,r=new ti,a=new x(1,1,1);function n(){r.setFromEuler(i,!1)}function s(){i.setFromQuaternion(r,void 0,!1)}i._onChange(n),r._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ke},normalMatrix:{value:new Qe}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=Rs.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rs.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return da.setFromAxisAngle(t,i),this.quaternion.multiply(da),this}rotateOnWorldAxis(t,i){return da.setFromAxisAngle(t,i),this.quaternion.premultiply(da),this}rotateX(t){return this.rotateOnAxis(th,t)}rotateY(t){return this.rotateOnAxis(ih,t)}rotateZ(t){return this.rotateOnAxis(rh,t)}translateOnAxis(t,i){return eh.copy(t).applyQuaternion(this.quaternion),this.position.add(eh.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(th,t)}translateY(t){return this.translateOnAxis(ih,t)}translateZ(t){return this.translateOnAxis(rh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ji.copy(this.matrixWorld).invert())}lookAt(t,i,r){t.isVector3?qn.copy(t):qn.set(t,i,r);let a=this.parent;this.updateWorldMatrix(!0,!1),Qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ji.lookAt(Qa,qn,this.up):Ji.lookAt(qn,Qa,this.up),this.quaternion.setFromRotationMatrix(Ji),a&&(Ji.extractRotation(a.matrixWorld),da.setFromRotationMatrix(Ji),this.quaternion.premultiply(da.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(Ye("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ah),fa.child=t,this.dispatchEvent(fa),fa.child=null):Ye("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}let i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(yd),yo.child=t,this.dispatchEvent(yo),yo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ji.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ji.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ji),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ah),fa.child=t,this.dispatchEvent(fa),fa.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let r=0,a=this.children.length;r<a;r++){let n=this.children[r].getObjectByProperty(t,i);if(n!==void 0)return n}}getObjectsByProperty(t,i,r=[]){this[t]===i&&r.push(this);let a=this.children;for(let n=0,s=a.length;n<s;n++)a[n].getObjectsByProperty(t,i,r);return r}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qa,t,vd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qa,xd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].traverseVisible(t)}traverseAncestors(t){let i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let i=t.x,r=t.y,a=t.z,n=this.matrix.elements;n[12]+=i-n[0]*i-n[4]*r-n[8]*a,n[13]+=r-n[1]*i-n[5]*r-n[9]*a,n[14]+=a-n[2]*i-n[6]*r-n[10]*a}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateMatrixWorld(t)}updateWorldMatrix(t,i,r=!1){let a=this.parent;if(t===!0&&a!==null&&a.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||r)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,r=!0),i===!0){let n=this.children;for(let s=0,o=n.length;s<o;s++)n[s].updateWorldMatrix(!1,!0,r)}}toJSON(t){let i=t===void 0||typeof t=="string",r={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let a={};a.uuid=this.uuid,a.type=this.type,a.name=this.name,a.castShadow=this.castShadow,a.receiveShadow=this.receiveShadow,a.visible=this.visible,a.frustumCulled=this.frustumCulled,a.renderOrder=this.renderOrder,a.static=this.static,a.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.pivot!==null&&(a.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(o=>({...o})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(t),a.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,c=l.length;h<c;h++){let p=l[h];n(t.shapes,p)}else n(t.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(n(t.materials,this.material[l]));a.material=o}else a.material=n(t.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];a.animations.push(n(t.animations,l))}}if(i){let o=s(t.geometries),l=s(t.materials),h=s(t.textures),c=s(t.images),p=s(t.shapes),u=s(t.skeletons),f=s(t.animations),_=s(t.nodes);o.length>0&&(r.geometries=o),l.length>0&&(r.materials=l),h.length>0&&(r.textures=h),c.length>0&&(r.images=c),p.length>0&&(r.shapes=p),u.length>0&&(r.skeletons=u),f.length>0&&(r.animations=f),_.length>0&&(r.nodes=_)}return r.object=a,r;function s(o){let l=[];for(let h in o){let c=o[h];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let r=0;r<t.children.length;r++){let a=t.children[r];this.add(a.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ei.DEFAULT_UP=new x(0,1,0);ei.DEFAULT_MATRIX_AUTO_UPDATE=!0;ei.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Re=class extends ei{constructor(){super(),this.isGroup=!0,this.type="Group"}},bd={type:"move"},bo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new x,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new x),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new x,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new x,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,a=null,n=null,s=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){n=!0;for(let _ of e.hand.values()){let y=t.getJointPose(_,i),m=this._getHandJoint(l,_);y!==null&&(m.matrix.fromArray(y.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=y.radius),m.visible=y!==null}let h=l.joints["index-finger-tip"],c=l.joints["thumb-tip"],p=h.position.distanceTo(c.position),u=.02,f=.005;l.inputState.pinching&&p>u+f?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&p<=u-f&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,o.eventsEnabled&&o.dispatchEvent({type:"gripUpdated",data:e,target:this})));s!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(s.matrix.fromArray(r.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,r.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(r.linearVelocity)):s.hasLinearVelocity=!1,r.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(r.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(bd)))}return s!==null&&(s.visible=r!==null),o!==null&&(o.visible=a!==null),l!==null&&(l.visible=n!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Re;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},Ac={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gr={h:0,s:0,l:0},Xn={h:0,s:0,l:0};function So(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+(t-e)*6*i:i<1/2?t:i<2/3?e+(t-e)*6*(2/3-i):e}var Oe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ot.workingColorSpace){return this.r=e,this.g=t,this.b=i,ot.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ot.workingColorSpace){if(e=Zl(e,1),t=tt(t,0,1),i=tt(i,0,1),t===0)this.r=this.g=this.b=i;else{let a=i<=.5?i*(1+t):i+t-i*t,n=2*i-a;this.r=So(n,a,e+1/3),this.g=So(n,a,e),this.b=So(n,a,e-1/3)}return ot.colorSpaceToWorking(this,r),this}setStyle(e,t=Nt){function i(a){a!==void 0&&parseFloat(a)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,n=r[1],s=r[2];switch(n){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=r[1],n=a.length;if(n===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(n===6)return this.setHex(parseInt(a,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Nt){let i=Ac[e.toLowerCase()];return i!==void 0?this.setHex(i,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=rr(e.r),this.g=rr(e.g),this.b=rr(e.b),this}copyLinearToSRGB(e){return this.r=Ba(e.r),this.g=Ba(e.g),this.b=Ba(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Nt){return ot.workingToColorSpace(qt.copy(this),e),Math.round(tt(qt.r*255,0,255))*65536+Math.round(tt(qt.g*255,0,255))*256+Math.round(tt(qt.b*255,0,255))}getHexString(e=Nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(qt.copy(this),t);let i=qt.r,r=qt.g,a=qt.b,n=Math.max(i,r,a),s=Math.min(i,r,a),o,l,h=(s+n)/2;if(s===n)o=0,l=0;else{let c=n-s;switch(l=h<=.5?c/(n+s):c/(2-n-s),n){case i:o=(r-a)/c+(r<a?6:0);break;case r:o=(a-i)/c+2;break;case a:o=(i-r)/c+4;break}o/=6}return e.h=o,e.s=l,e.l=h,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(qt.copy(this),t),e.r=qt.r,e.g=qt.g,e.b=qt.b,e}getStyle(e=Nt){ot.workingToColorSpace(qt.copy(this),e);let t=qt.r,i=qt.g,r=qt.b;return e!==Nt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(gr),this.setHSL(gr.h+e,gr.s+t,gr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(gr),e.getHSL(Xn);let i=mn(gr.h,Xn.h,t),r=mn(gr.s,Xn.s,t),a=mn(gr.l,Xn.l,t);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*r,this.g=a[1]*t+a[4]*i+a[7]*r,this.b=a[2]*t+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qt=new Oe;Oe.NAMES=Ac;var Rn=class Rc{constructor(t,i=1,r=1e3){this.isFog=!0,this.name="",this.color=new Oe(t),this.near=i,this.far=r}clone(){return new Rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Hs=class extends ei{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mi,this.environmentIntensity=1,this.environmentRotation=new mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},yi=new x,Ki=new x,Mo=new x,$i=new x,ma=new x,ga=new x,nh=new x,Eo=new x,To=new x,wo=new x,Ao=new Mt,Ro=new Mt,Co=new Mt,Gr=class Ia{constructor(t=new x,i=new x,r=new x){this.a=t,this.b=i,this.c=r}static getNormal(t,i,r,a){a.subVectors(r,i),yi.subVectors(t,i),a.cross(yi);let n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(t,i,r,a,n){yi.subVectors(a,i),Ki.subVectors(r,i),Mo.subVectors(t,i);let s=yi.dot(yi),o=yi.dot(Ki),l=yi.dot(Mo),h=Ki.dot(Ki),c=Ki.dot(Mo),p=s*h-o*o;if(p===0)return n.set(0,0,0),null;let u=1/p,f=(h*l-o*c)*u,_=(s*c-o*l)*u;return n.set(1-f-_,_,f)}static containsPoint(t,i,r,a){return this.getBarycoord(t,i,r,a,$i)===null?!1:$i.x>=0&&$i.y>=0&&$i.x+$i.y<=1}static getInterpolation(t,i,r,a,n,s,o,l){return this.getBarycoord(t,i,r,a,$i)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,$i.x),l.addScaledVector(s,$i.y),l.addScaledVector(o,$i.z),l)}static getInterpolatedAttribute(t,i,r,a,n,s){return Ao.setScalar(0),Ro.setScalar(0),Co.setScalar(0),Ao.fromBufferAttribute(t,i),Ro.fromBufferAttribute(t,r),Co.fromBufferAttribute(t,a),s.setScalar(0),s.addScaledVector(Ao,n.x),s.addScaledVector(Ro,n.y),s.addScaledVector(Co,n.z),s}static isFrontFacing(t,i,r,a){return yi.subVectors(r,i),Ki.subVectors(t,i),yi.cross(Ki).dot(a)<0}set(t,i,r){return this.a.copy(t),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(t,i,r,a){return this.a.copy(t[i]),this.b.copy(t[r]),this.c.copy(t[a]),this}setFromAttributeAndIndices(t,i,r,a){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,r),this.c.fromBufferAttribute(t,a),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return yi.subVectors(this.c,this.b),Ki.subVectors(this.a,this.b),yi.cross(Ki).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ia.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Ia.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,r,a,n){return Ia.getInterpolation(t,this.a,this.b,this.c,i,r,a,n)}containsPoint(t){return Ia.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ia.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){let r=this.a,a=this.b,n=this.c,s,o;ma.subVectors(a,r),ga.subVectors(n,r),Eo.subVectors(t,r);let l=ma.dot(Eo),h=ga.dot(Eo);if(l<=0&&h<=0)return i.copy(r);To.subVectors(t,a);let c=ma.dot(To),p=ga.dot(To);if(c>=0&&p<=c)return i.copy(a);let u=l*p-c*h;if(u<=0&&l>=0&&c<=0)return s=l/(l-c),i.copy(r).addScaledVector(ma,s);wo.subVectors(t,n);let f=ma.dot(wo),_=ga.dot(wo);if(_>=0&&f<=_)return i.copy(n);let y=f*h-l*_;if(y<=0&&h>=0&&_<=0)return o=h/(h-_),i.copy(r).addScaledVector(ga,o);let m=c*_-f*p;if(m<=0&&p-c>=0&&f-_>=0)return nh.subVectors(n,a),o=(p-c)/(p-c+(f-_)),i.copy(a).addScaledVector(nh,o);let d=1/(m+y+u);return s=y*d,o=u*d,i.copy(r).addScaledVector(ma,s).addScaledVector(ga,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ui=class{constructor(e=new x(1/0,1/0,1/0),t=new x(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(bi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(bi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=bi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let n=0,s=a.count;n<s;n++)e.isMesh===!0?e.getVertexPosition(n,bi):bi.fromBufferAttribute(a,n),bi.applyMatrix4(e.matrixWorld),this.expandByPoint(bi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yn.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Yn.copy(i.boundingBox)),Yn.applyMatrix4(e.matrixWorld),this.union(Yn)}let r=e.children;for(let a=0,n=r.length;a<n;a++)this.expandByObject(r[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,bi),bi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(en),Zn.subVectors(this.max,en),_a.subVectors(e.a,en),va.subVectors(e.b,en),xa.subVectors(e.c,en),_r.subVectors(va,_a),vr.subVectors(xa,va),Fr.subVectors(_a,xa);let t=[0,-_r.z,_r.y,0,-vr.z,vr.y,0,-Fr.z,Fr.y,_r.z,0,-_r.x,vr.z,0,-vr.x,Fr.z,0,-Fr.x,-_r.y,_r.x,0,-vr.y,vr.x,0,-Fr.y,Fr.x,0];return!Po(t,_a,va,xa,Zn)||(t=[1,0,0,0,1,0,0,0,1],!Po(t,_a,va,xa,Zn))?!1:(Jn.crossVectors(_r,vr),t=[Jn.x,Jn.y,Jn.z],Po(t,_a,va,xa,Zn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,bi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(bi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qi=[new x,new x,new x,new x,new x,new x,new x,new x],bi=new x,Yn=new ui,_a=new x,va=new x,xa=new x,_r=new x,vr=new x,Fr=new x,en=new x,Zn=new x,Jn=new x,Br=new x;function Po(e,t,i,r,a){for(let n=0,s=e.length-3;n<=s;n+=3){Br.fromArray(e,n);let o=a.x*Math.abs(Br.x)+a.y*Math.abs(Br.y)+a.z*Math.abs(Br.z),l=t.dot(Br),h=i.dot(Br),c=r.dot(Br);if(Math.max(-Math.max(l,h,c),Math.min(l,h,c))>o)return!1}return!0}var b_=Sd();function Sd(){let e=new ArrayBuffer(4),t=new Float32Array(e),i=new Uint32Array(e),r=new Uint32Array(512),a=new Uint32Array(512);for(let l=0;l<256;++l){let h=l-127;h<-27?(r[l]=0,r[l|256]=32768,a[l]=24,a[l|256]=24):h<-14?(r[l]=1024>>-h-14,r[l|256]=1024>>-h-14|32768,a[l]=-h-1,a[l|256]=-h-1):h<=15?(r[l]=h+15<<10,r[l|256]=h+15<<10|32768,a[l]=13,a[l|256]=13):h<128?(r[l]=31744,r[l|256]=64512,a[l]=24,a[l|256]=24):(r[l]=31744,r[l|256]=64512,a[l]=13,a[l|256]=13)}let n=new Uint32Array(2048),s=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let h=l<<13,c=0;for(;(h&8388608)===0;)h<<=1,c-=8388608;h&=-8388609,c+=947912704,n[l]=h|c}for(let l=1024;l<2048;++l)n[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)s[l]=l<<23;s[31]=1199570944,s[32]=2147483648;for(let l=33;l<63;++l)s[l]=2147483648+(l-32<<23);s[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:i,baseTable:r,shiftTable:a,mantissaTable:n,exponentTable:s,offsetTable:o}}var Ut=new x,Kn=new se,Md=0,ci=class extends Kr{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Md++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=_c,this.updateRanges=[],this.gpuType=Mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Kn.fromBufferAttribute(this,t),Kn.applyMatrix3(e),this.setXY(t,Kn.x,Kn.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=mt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Si(t,this.array)),t}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Si(t,this.array)),t}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Si(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Si(t,this.array)),t}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),i=mt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),i=mt(i,this.array),r=mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,a){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),i=mt(i,this.array),r=mt(r,this.array),a=mt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Cc=class extends ci{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Pc=class extends ci{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var He=class extends ci{constructor(e,t,i){super(new Float32Array(e),t,i)}},Ed=new ui,tn=new x,Io=new x,nr=class{constructor(e=new x,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Ed.setFromPoints(e).getCenter(i);let r=0;for(let a=0,n=e.length;a<n;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;tn.subVectors(e,this.center);let t=tn.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(tn,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(tn.copy(e.center).add(Io)),this.expandByPoint(tn.copy(e.center).sub(Io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Td=0,fi=new Ke,Lo=new ei,ya=new x,li=new ui,rn=new ui,Vt=new x,yt=class Ic extends Kr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Td++}),this.uuid=Bi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Gp(t)?Pc:Cc)(t,1):this.index=t,this}setIndirect(t,i=0){return this.indirect=t,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,r=0){this.groups.push({start:t,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){let i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);let r=this.attributes.normal;if(r!==void 0){let n=new Qe().getNormalMatrix(t);r.applyNormalMatrix(n),r.needsUpdate=!0}let a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(t),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return fi.makeRotationFromQuaternion(t),this.applyMatrix4(fi),this}rotateX(t){return fi.makeRotationX(t),this.applyMatrix4(fi),this}rotateY(t){return fi.makeRotationY(t),this.applyMatrix4(fi),this}rotateZ(t){return fi.makeRotationZ(t),this.applyMatrix4(fi),this}translate(t,i,r){return fi.makeTranslation(t,i,r),this.applyMatrix4(fi),this}scale(t,i,r){return fi.makeScale(t,i,r),this.applyMatrix4(fi),this}lookAt(t){return Lo.lookAt(t),Lo.updateMatrix(),this.applyMatrix4(Lo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ya).negate(),this.translate(ya.x,ya.y,ya.z),this}setFromPoints(t){let i=this.getAttribute("position");if(i===void 0){let r=[];for(let a=0,n=t.length;a<n;a++){let s=t[a];r.push(s.x,s.y,s.z||0)}this.setAttribute("position",new He(r,3))}else{let r=Math.min(t.length,i.count);for(let a=0;a<r;a++){let n=t[a];i.setXYZ(a,n.x,n.y,n.z||0)}t.length>i.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ui);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new x(-1/0,-1/0,-1/0),new x(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let r=0,a=i.length;r<a;r++){let n=i[r];li.setFromBufferAttribute(n),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ye('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nr);let t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new x,1/0);return}if(t){let r=this.boundingSphere.center;if(li.setFromBufferAttribute(t),i)for(let n=0,s=i.length;n<s;n++){let o=i[n];rn.setFromBufferAttribute(o),this.morphTargetsRelative?(Vt.addVectors(li.min,rn.min),li.expandByPoint(Vt),Vt.addVectors(li.max,rn.max),li.expandByPoint(Vt)):(li.expandByPoint(rn.min),li.expandByPoint(rn.max))}li.getCenter(r);let a=0;for(let n=0,s=t.count;n<s;n++)Vt.fromBufferAttribute(t,n),a=Math.max(a,r.distanceToSquared(Vt));if(i)for(let n=0,s=i.length;n<s;n++){let o=i[n],l=this.morphTargetsRelative;for(let h=0,c=o.count;h<c;h++)Vt.fromBufferAttribute(o,h),l&&(ya.fromBufferAttribute(t,h),Vt.add(ya)),a=Math.max(a,r.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&Ye('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){Ye("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let r=i.position,a=i.normal,n=i.uv,s=this.getAttribute("tangent");(s===void 0||s.count!==r.count)&&(s=new ci(new Float32Array(4*r.count),4),this.setAttribute("tangent",s));let o=[],l=[];for(let g=0;g<r.count;g++)o[g]=new x,l[g]=new x;let h=new x,c=new x,p=new x,u=new se,f=new se,_=new se,y=new x,m=new x;function d(g,b,I){h.fromBufferAttribute(r,g),c.fromBufferAttribute(r,b),p.fromBufferAttribute(r,I),u.fromBufferAttribute(n,g),f.fromBufferAttribute(n,b),_.fromBufferAttribute(n,I),c.sub(h),p.sub(h),f.sub(u),_.sub(u);let P=1/(f.x*_.y-_.x*f.y);isFinite(P)&&(y.copy(c).multiplyScalar(_.y).addScaledVector(p,-f.y).multiplyScalar(P),m.copy(p).multiplyScalar(f.x).addScaledVector(c,-_.x).multiplyScalar(P),o[g].add(y),o[b].add(y),o[I].add(y),l[g].add(m),l[b].add(m),l[I].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let g=0,b=w.length;g<b;++g){let I=w[g],P=I.start,L=I.count;for(let V=P,D=P+L;V<D;V+=3)d(t.getX(V+0),t.getX(V+1),t.getX(V+2))}let A=new x,v=new x,T=new x,C=new x;function M(g){T.fromBufferAttribute(a,g),C.copy(T);let b=o[g];A.copy(b),A.sub(T.multiplyScalar(T.dot(b))).normalize(),v.crossVectors(C,b);let I=v.dot(l[g])<0?-1:1;s.setXYZW(g,A.x,A.y,A.z,I)}for(let g=0,b=w.length;g<b;++g){let I=w[g],P=I.start,L=I.count;for(let V=P,D=P+L;V<D;V+=3)M(t.getX(V+0)),M(t.getX(V+1)),M(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0||r.count!==i.count)r=new ci(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let u=0,f=r.count;u<f;u++)r.setXYZ(u,0,0,0);let a=new x,n=new x,s=new x,o=new x,l=new x,h=new x,c=new x,p=new x;if(t)for(let u=0,f=t.count;u<f;u+=3){let _=t.getX(u+0),y=t.getX(u+1),m=t.getX(u+2);a.fromBufferAttribute(i,_),n.fromBufferAttribute(i,y),s.fromBufferAttribute(i,m),c.subVectors(s,n),p.subVectors(a,n),c.cross(p),o.fromBufferAttribute(r,_),l.fromBufferAttribute(r,y),h.fromBufferAttribute(r,m),o.add(c),l.add(c),h.add(c),r.setXYZ(_,o.x,o.y,o.z),r.setXYZ(y,l.x,l.y,l.z),r.setXYZ(m,h.x,h.y,h.z)}else for(let u=0,f=i.count;u<f;u+=3)a.fromBufferAttribute(i,u+0),n.fromBufferAttribute(i,u+1),s.fromBufferAttribute(i,u+2),c.subVectors(s,n),p.subVectors(a,n),c.cross(p),r.setXYZ(u+0,c.x,c.y,c.z),r.setXYZ(u+1,c.x,c.y,c.z),r.setXYZ(u+2,c.x,c.y,c.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let i=0,r=t.count;i<r;i++)Vt.fromBufferAttribute(t,i),Vt.normalize(),t.setXYZ(i,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function t(o,l){let h=o.array,c=o.itemSize,p=o.normalized,u=new h.constructor(l.length*c),f=0,_=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?f=l[y]*o.data.stride+o.offset:f=l[y]*c;for(let d=0;d<c;d++)u[_++]=h[f++]}return new ci(u,c,p)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let i=new Ic,r=this.index.array,a=this.attributes;for(let o in a){let l=a[o],h=t(l,r);i.setAttribute(o,h)}let n=this.morphAttributes;for(let o in n){let l=[],h=n[o];for(let c=0,p=h.length;c<p;c++){let u=h[c],f=t(u,r);l.push(f)}i.morphAttributes[o]=l}i.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let o=0,l=s.length;o<l;o++){let h=s[o];i.addGroup(h.start,h.count,h.materialIndex)}return i}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});let r=this.attributes;for(let l in r){let h=r[l];t.data.attributes[l]=h.toJSON(t.data)}let a={},n=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],c=[];for(let p=0,u=h.length;p<u;p++){let f=h[p];c.push(f.toJSON(t.data))}c.length>0&&(a[l]=c,n=!0)}n&&(t.data.morphAttributes=a,t.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(t.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let i={};this.name=t.name;let r=t.index;r!==null&&this.setIndex(r.clone());let a=t.attributes;for(let h in a){let c=a[h];this.setAttribute(h,c.clone(i))}let n=t.morphAttributes;for(let h in n){let c=[],p=n[h];for(let u=0,f=p.length;u<f;u++)c.push(p[u].clone(i));this.morphAttributes[h]=c}this.morphTargetsRelative=t.morphTargetsRelative;let s=t.groups;for(let h=0,c=s.length;h<c;h++){let p=s[h];this.addGroup(p.start,p.count,p.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},wd=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_c,this.updateRanges=[],this.version=0,this.uuid=Bi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,a=this.stride;r<a;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},$t=new x,sh=class Lc{constructor(t,i,r,a=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=i,this.offset=r,this.normalized=a}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let i=0,r=this.data.count;i<r;i++)$t.fromBufferAttribute(this,i),$t.applyMatrix4(t),this.setXYZ(i,$t.x,$t.y,$t.z);return this}applyNormalMatrix(t){for(let i=0,r=this.count;i<r;i++)$t.fromBufferAttribute(this,i),$t.applyNormalMatrix(t),this.setXYZ(i,$t.x,$t.y,$t.z);return this}transformDirection(t){for(let i=0,r=this.count;i<r;i++)$t.fromBufferAttribute(this,i),$t.transformDirection(t),this.setXYZ(i,$t.x,$t.y,$t.z);return this}getComponent(t,i){let r=this.array[t*this.data.stride+this.offset+i];return this.normalized&&(r=Si(r,this.array)),r}setComponent(t,i,r){return this.normalized&&(r=mt(r,this.array)),this.data.array[t*this.data.stride+this.offset+i]=r,this}setX(t,i){return this.normalized&&(i=mt(i,this.array)),this.data.array[t*this.data.stride+this.offset]=i,this}setY(t,i){return this.normalized&&(i=mt(i,this.array)),this.data.array[t*this.data.stride+this.offset+1]=i,this}setZ(t,i){return this.normalized&&(i=mt(i,this.array)),this.data.array[t*this.data.stride+this.offset+2]=i,this}setW(t,i){return this.normalized&&(i=mt(i,this.array)),this.data.array[t*this.data.stride+this.offset+3]=i,this}getX(t){let i=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(i=Si(i,this.array)),i}getY(t){let i=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(i=Si(i,this.array)),i}getZ(t){let i=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(i=Si(i,this.array)),i}getW(t){let i=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(i=Si(i,this.array)),i}setXY(t,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(i=mt(i,this.array),r=mt(r,this.array)),this.data.array[t+0]=i,this.data.array[t+1]=r,this}setXYZ(t,i,r,a){return t=t*this.data.stride+this.offset,this.normalized&&(i=mt(i,this.array),r=mt(r,this.array),a=mt(a,this.array)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this}setXYZW(t,i,r,a,n){return t=t*this.data.stride+this.offset,this.normalized&&(i=mt(i,this.array),r=mt(r,this.array),a=mt(a,this.array),n=mt(n,this.array)),this.data.array[t+0]=i,this.data.array[t+1]=r,this.data.array[t+2]=a,this.data.array[t+3]=n,this}clone(t){if(t===void 0){Os("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return new ci(new this.array.constructor(i),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Lc(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){Os("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let i=[];for(let r=0;r<this.count;r++){let a=r*this.data.stride+this.offset;for(let n=0;n<this.itemSize;n++)i.push(this.data.array[a+n])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:i,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Do=new x,Ad=new x,Rd=new Qe,yr=class{constructor(e=new x(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=Do.subVectors(i,t).cross(Ad.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(Do),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let n=-(e.start.dot(this.normal)+this.constant)/a;return i===!0&&(n<0||n>1)?null:t.copy(e.start).addScaledVector(r,n)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Rd.getNormalMatrix(e),r=this.coplanarPoint(Do).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Cd=0,sr=class extends Kr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cd++}),this.uuid=Bi(),this.name="",this.type="Material",this.blending=fn,this.side=qr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tc,this.blendDst=ic,this.blendEquation=Pa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=vn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Np,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mo,this.stencilZFail=mo,this.stencilZPass=mo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){let n=[];for(let s in a){let o=a[s];delete o.metadata,n.push(o)}return n}if(t){let a=r(e.textures),n=r(e.images);a.length>0&&(i.textures=a),n.length>0&&(i.images=n)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Oe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new yr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new se().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new se().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ai=class extends sr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ba,an=new x,Sa=new x,Ma=new x,Ea=new se,nn=new se,Dc=new Ke,$n=new x,sn=new x,Qn=new x,oh=new se,Uo=new se,lh=new se,ki=class extends ei{constructor(e=new Ai){if(super(),this.isSprite=!0,this.type="Sprite",ba===void 0){ba=new yt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new wd(t,5);ba.setIndex([0,1,2,0,2,3]),ba.setAttribute("position",new sh(i,3,0,!1)),ba.setAttribute("uv",new sh(i,2,3,!1))}this.geometry=ba,this.material=e,this.center=new se(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ye('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Sa.setFromMatrixScale(this.matrixWorld),Dc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ma.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Sa.multiplyScalar(-Ma.z);let i=this.material.rotation,r,a;i!==0&&(a=Math.cos(i),r=Math.sin(i));let n=this.center;es($n.set(-.5,-.5,0),Ma,n,Sa,r,a),es(sn.set(.5,-.5,0),Ma,n,Sa,r,a),es(Qn.set(.5,.5,0),Ma,n,Sa,r,a),oh.set(0,0),Uo.set(1,0),lh.set(1,1);let s=e.ray.intersectTriangle($n,sn,Qn,!1,an);if(s===null&&(es(sn.set(-.5,.5,0),Ma,n,Sa,r,a),Uo.set(0,1),s=e.ray.intersectTriangle($n,Qn,sn,!1,an),s===null))return;let o=e.ray.origin.distanceTo(an);o<e.near||o>e.far||t.push({distance:o,point:an.clone(),uv:Gr.getInterpolation(an,$n,sn,Qn,oh,Uo,lh,new se),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function es(e,t,i,r,a,n){Ea.subVectors(e,i).addScalar(.5).multiply(r),a!==void 0?(nn.x=n*Ea.x-a*Ea.y,nn.y=a*Ea.x+n*Ea.y):nn.copy(Ea),e.copy(t),e.x+=nn.x,e.y+=nn.y,e.applyMatrix4(Dc)}var S_=new x,M_=new x;var er=new x,No=new x,ts=new x,is=new x,Vs=class{constructor(e=new x,t=new x(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,er)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=er.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(er.copy(this.origin).addScaledVector(this.direction,t),er.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){No.copy(e).add(t).multiplyScalar(.5),ts.copy(t).sub(e).normalize(),is.copy(this.origin).sub(No);let a=e.distanceTo(t)*.5,n=-this.direction.dot(ts),s=is.dot(this.direction),o=-is.dot(ts),l=is.lengthSq(),h=Math.abs(1-n*n),c,p,u,f;if(h>0)if(c=n*o-s,p=n*s-o,f=a*h,c>=0)if(p>=-f)if(p<=f){let _=1/h;c*=_,p*=_,u=c*(c+n*p+2*s)+p*(n*c+p+2*o)+l}else p=a,c=Math.max(0,-(n*p+s)),u=-c*c+p*(p+2*o)+l;else p=-a,c=Math.max(0,-(n*p+s)),u=-c*c+p*(p+2*o)+l;else p<=-f?(c=Math.max(0,-(-n*a+s)),p=c>0?-a:Math.min(Math.max(-a,-o),a),u=-c*c+p*(p+2*o)+l):p<=f?(c=0,p=Math.min(Math.max(-a,-o),a),u=p*(p+2*o)+l):(c=Math.max(0,-(n*a+s)),p=c>0?a:Math.min(Math.max(-a,-o),a),u=-c*c+p*(p+2*o)+l);else p=n>0?-a:a,c=Math.max(0,-(n*p+s)),u=-c*c+p*(p+2*o)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,c),r&&r.copy(No).addScaledVector(ts,p),u}intersectSphere(e,t){if(e.radius<0)return null;er.subVectors(e.center,this.origin);let i=er.dot(this.direction),r=er.dot(er)-i*i,a=e.radius*e.radius;if(r>a)return null;let n=Math.sqrt(a-r),s=i-n,o=i+n;return o<0?null:s<0?this.at(o,t):this.at(s,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,a,n,s,o,l=1/this.direction.x,h=1/this.direction.y,c=1/this.direction.z,p=this.origin;return l>=0?(i=(e.min.x-p.x)*l,r=(e.max.x-p.x)*l):(i=(e.max.x-p.x)*l,r=(e.min.x-p.x)*l),h>=0?(a=(e.min.y-p.y)*h,n=(e.max.y-p.y)*h):(a=(e.max.y-p.y)*h,n=(e.min.y-p.y)*h),i>n||a>r||((a>i||isNaN(i))&&(i=a),(n<r||isNaN(r))&&(r=n),c>=0?(s=(e.min.z-p.z)*c,o=(e.max.z-p.z)*c):(s=(e.max.z-p.z)*c,o=(e.min.z-p.z)*c),i>o||s>r)||((s>i||i!==i)&&(i=s),(o<r||r!==r)&&(r=o),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,er)!==null}intersectTriangle(e,t,i,r,a){let n=this.origin,s=this.direction,o=s.x,l=s.y,h=s.z,c=e.x-n.x,p=e.y-n.y,u=e.z-n.z,f=t.x-n.x,_=t.y-n.y,y=t.z-n.z,m=i.x-n.x,d=i.y-n.y,w=i.z-n.z,A=Math.abs(o),v=Math.abs(l),T=Math.abs(h),C,M,g,b,I,P,L,V,D,H,J,j;if(A>=v&&A>=T?(g=o,P=c,D=f,j=m,o>=0?(C=l,M=h,b=p,I=u,L=_,V=y,H=d,J=w):(C=h,M=l,b=u,I=p,L=y,V=_,H=w,J=d)):v>=T?(g=l,P=p,D=_,j=d,l>=0?(C=h,M=o,b=u,I=c,L=y,V=f,H=w,J=m):(C=o,M=h,b=c,I=u,L=f,V=y,H=m,J=w)):(g=h,P=u,D=y,j=w,h>=0?(C=o,M=l,b=c,I=p,L=f,V=_,H=m,J=d):(C=l,M=o,b=p,I=c,L=_,V=f,H=d,J=m)),g===0)return null;let ue=C/g,Z=M/g,K=1/g,te=b-ue*P,Ve=I-Z*P,Ce=L-ue*D,ut=V-Z*D,be=H-ue*j,k=J-Z*j,$=be*ut-k*Ce,ne=te*k-Ve*be,Le=Ce*Ve-ut*te;if(r){if($<0||ne<0||Le<0)return null}else if(($<0||ne<0||Le<0)&&($>0||ne>0||Le>0))return null;let We=$+ne+Le;if(We===0)return null;let me=K*($*P+ne*D+Le*j);return(We>0?me<0:me>0)?null:this.at(me/We,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},pi=class extends sr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=Bs,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},hh=new Ke,zr=new Vs,rs=new nr,ch=new x,as=new x,ns=new x,ss=new x,Oo=new x,os=new x,uh=new x,ls=new x,ke=class extends ei{constructor(e=new yt,t=new pi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,n=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let s=this.morphTargetInfluences;if(a&&s){os.set(0,0,0);for(let o=0,l=a.length;o<l;o++){let h=s[o],c=a[o];h!==0&&(Oo.fromBufferAttribute(c,e),n?os.addScaledVector(Oo,h):os.addScaledVector(Oo.sub(t),h))}t.add(os)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),rs.copy(i.boundingSphere),rs.applyMatrix4(a),zr.copy(e.ray).recast(e.near),!(rs.containsPoint(zr.origin)===!1&&(zr.intersectSphere(rs,ch)===null||zr.origin.distanceToSquared(ch)>(e.far-e.near)**2))&&(hh.copy(a).invert(),zr.copy(e.ray).applyMatrix4(hh),!(i.boundingBox!==null&&zr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,zr)))}_computeIntersections(e,t,i){let r,a=this.geometry,n=this.material,s=a.index,o=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,c=a.attributes.normal,p=a.groups,u=a.drawRange;if(s!==null)if(Array.isArray(n))for(let f=0,_=p.length;f<_;f++){let y=p[f],m=n[y.materialIndex],d=Math.max(y.start,u.start),w=Math.min(s.count,Math.min(y.start+y.count,u.start+u.count));for(let A=d,v=w;A<v;A+=3){let T=s.getX(A),C=s.getX(A+1),M=s.getX(A+2);r=hs(this,m,e,i,l,h,c,T,C,M),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=y.materialIndex,t.push(r))}}else{let f=Math.max(0,u.start),_=Math.min(s.count,u.start+u.count);for(let y=f,m=_;y<m;y+=3){let d=s.getX(y),w=s.getX(y+1),A=s.getX(y+2);r=hs(this,n,e,i,l,h,c,d,w,A),r&&(r.faceIndex=Math.floor(y/3),t.push(r))}}else if(o!==void 0)if(Array.isArray(n))for(let f=0,_=p.length;f<_;f++){let y=p[f],m=n[y.materialIndex],d=Math.max(y.start,u.start),w=Math.min(o.count,Math.min(y.start+y.count,u.start+u.count));for(let A=d,v=w;A<v;A+=3){let T=A,C=A+1,M=A+2;r=hs(this,m,e,i,l,h,c,T,C,M),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=y.materialIndex,t.push(r))}}else{let f=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let y=f,m=_;y<m;y+=3){let d=y,w=y+1,A=y+2;r=hs(this,n,e,i,l,h,c,d,w,A),r&&(r.faceIndex=Math.floor(y/3),t.push(r))}}}};function Pd(e,t,i,r,a,n,s,o){let l;if(t.side===Gt?l=r.intersectTriangle(s,n,a,!0,o):l=r.intersectTriangle(a,n,s,t.side===qr,o),l===null)return null;ls.copy(o),ls.applyMatrix4(e.matrixWorld);let h=i.ray.origin.distanceTo(ls);return h<i.near||h>i.far?null:{distance:h,point:ls.clone(),object:e}}function hs(e,t,i,r,a,n,s,o,l,h){e.getVertexPosition(o,as),e.getVertexPosition(l,ns),e.getVertexPosition(h,ss);let c=Pd(e,t,i,r,as,ns,ss,uh);if(c){let p=new x;Gr.getBarycoord(uh,as,ns,ss,p),a&&(c.uv=Gr.getInterpolatedAttribute(a,o,l,h,p,new se)),n&&(c.uv1=Gr.getInterpolatedAttribute(n,o,l,h,p,new se)),s&&(c.normal=Gr.getInterpolatedAttribute(s,o,l,h,p,new x),c.normal.dot(r.direction)>0&&c.normal.multiplyScalar(-1));let u={a:o,b:l,c:h,normal:new x,materialIndex:0};Gr.getNormal(as,ns,ss,u.normal),c.face=u,c.barycoord=p}return c}var E_=new Mt,T_=new Mt,w_=new Mt,A_=new Mt,R_=new Ke,C_=new x,P_=new nr,I_=new Ke,L_=new Vs;var Uc=class extends gi{constructor(e=null,t=1,i=1,r,a,n,s,o,l=Bt,h=Bt,c,p){super(null,n,s,o,l,h,r,a,c,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},D_=new Ke,U_=new Ke;var ph=class extends ci{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ta=new Ke,dh=new Ke,cs=[],fh=new ui,Id=new Ke,on=new ke,ln=new nr,Gs=class extends ke{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ph(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Id)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ta),fh.copy(e.boundingBox).applyMatrix4(Ta),this.boundingBox.union(fh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new nr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ta),ln.copy(e.boundingSphere).applyMatrix4(Ta),this.boundingSphere.union(ln)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,a=i.length+1,n=e*a+1;for(let s=0;s<i.length;s++)i[s]=r[n+s]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(on.geometry=this.geometry,on.material=this.material,on.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ln.copy(this.boundingSphere),ln.applyMatrix4(i),e.ray.intersectsSphere(ln)!==!1))for(let a=0;a<r;a++){this.getMatrixAt(a,Ta),dh.multiplyMatrices(i,Ta),on.matrixWorld=dh,on.raycast(e,cs);for(let n=0,s=cs.length;n<s;n++){let o=cs[n];o.instanceId=a,o.object=this,t.push(o)}cs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ph(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Uc(new Float32Array(r*this.count),r,this.count,kl,Mi));let a=this.morphTexture.source.data.data,n=0;for(let l=0;l<i.length;l++)n+=i[l];let s=this.geometry.morphTargetsRelative?1:1-n,o=r*e;return a[o]=s,a.set(i,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Hr=new nr,Ld=new se(.5,.5),us=new x,Va=class{constructor(e=new yr,t=new yr,i=new yr,r=new yr,a=new yr,n=new yr){this.planes=[e,t,i,r,a,n]}set(e,t,i,r,a,n){let s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(i),s[3].copy(r),s[4].copy(a),s[5].copy(n),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ti,i=!1){let r=this.planes,a=e.elements,n=a[0],s=a[1],o=a[2],l=a[3],h=a[4],c=a[5],p=a[6],u=a[7],f=a[8],_=a[9],y=a[10],m=a[11],d=a[12],w=a[13],A=a[14],v=a[15];if(r[0].setComponents(l-n,u-h,m-f,v-d).normalize(),r[1].setComponents(l+n,u+h,m+f,v+d).normalize(),r[2].setComponents(l+s,u+c,m+_,v+w).normalize(),r[3].setComponents(l-s,u-c,m-_,v-w).normalize(),i)r[4].setComponents(o,p,y,A).normalize(),r[5].setComponents(l-o,u-p,m-y,v-A).normalize();else if(r[4].setComponents(l-o,u-p,m-y,v-A).normalize(),t===Ti)r[5].setComponents(l+o,u+p,m+y,v+A).normalize();else if(t===Sn)r[5].setComponents(o,p,y,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hr)}intersectsSprite(e){Hr.center.set(0,0,0);let t=Ld.distanceTo(e.center);return Hr.radius=.7071067811865476+t,Hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hr)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(us.x=r.normal.x>0?e.max.x:e.min.x,us.y=r.normal.y>0?e.max.y:e.min.y,us.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(us)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},mh=new Ke,Dd=class Nc{constructor(){this.coordinateSystem=Ti,this._frustums=[],this._count=0}setFromArrayCamera(t){let i=t.cameras,r=this._frustums;for(let a=0;a<i.length;a++){let n=i[a];mh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),r[a]===void 0&&(r[a]=new Va),r[a].setFromProjectionMatrix(mh,n.coordinateSystem,n.reversedDepth)}return this._count=i.length,this}intersectsObject(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsObject(t))return!0;return!1}intersectsSprite(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsSphere(t))return!0;return!1}intersectsBox(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].intersectsBox(t))return!0;return!1}containsPoint(t){let i=this._frustums;for(let r=0;r<this._count;r++)if(i[r].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let i=this._frustums,r=t._frustums;for(let a=0;a<t._count;a++)i[a]===void 0&&(i[a]=new Va),i[a].copy(r[a]);return this._count=t._count,this}clone(){return new Nc().copy(this)}};var Ud=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,r){let a=this.pool,n=this.list;this.index>=a.length&&a.push({start:-1,count:-1,z:-1,index:-1});let s=a[this.index];n.push(s),this.index++,s.start=e,s.count=t,s.z=i,s.index=r}reset(){this.list.length=0,this.index=0}},N_=new Ke,O_=new Oe(1,1,1),F_=new Va,B_=new Dd,z_=new ui,H_=new nr,V_=new x,G_=new x,k_=new x,W_=new Ud,j_=new ke;var q_=new x,X_=new x,Y_=new Ke,Z_=new Vs,J_=new nr,K_=new x,$_=new x;var Q_=new x,ev=new x;var Kl=class extends sr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},gh=new Ke,Nl=new Vs,ps=new nr,ds=new x,Oc=class extends ei{constructor(e=new yt,t=new Kl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,n=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ps.copy(i.boundingSphere),ps.applyMatrix4(r),ps.radius+=a,e.ray.intersectsSphere(ps)===!1)return;gh.copy(r).invert(),Nl.copy(e.ray).applyMatrix4(gh);let s=a/((this.scale.x+this.scale.y+this.scale.z)/3),o=s*s,l=i.index,h=i.attributes.position;if(l!==null){let c=Math.max(0,n.start),p=Math.min(l.count,n.start+n.count);for(let u=c,f=p;u<f;u++){let _=l.getX(u);ds.fromBufferAttribute(h,_),_h(ds,_,o,r,e,t,this)}}else{let c=Math.max(0,n.start),p=Math.min(h.count,n.start+n.count);for(let u=c,f=p;u<f;u++)ds.fromBufferAttribute(h,u),_h(ds,u,o,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let n=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[n]=r}}}}};function _h(e,t,i,r,a,n,s){let o=Nl.distanceSqToPoint(e);if(o<i){let l=new x;Nl.closestPointToPoint(e,l),l.applyMatrix4(r);let h=a.ray.origin.distanceTo(l);if(h<a.near||h>a.far)return;n.push({distance:h,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:s})}}var Fc=class extends gi{constructor(e=[],t=Xr,i,r,a,n,s,o,l,h){super(e,t,i,r,a,n,s,o,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Sr=class extends gi{constructor(e,t,i,r,a,n,s,o,l){super(e,t,i,r,a,n,s,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var En=class extends gi{constructor(e,t,i=Hi,r,a,n,s=Bt,o=Bt,l,h=ar,c=1){if(h!==ar&&h!==Wr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let p={width:e,height:t,depth:c};super(p,r,a,n,s,o,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Jl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Nd=class extends En{constructor(e,t=Hi,i=Xr,r,a,n=Bt,s=Bt,o,l=ar){let h={width:e,height:e,depth:1},c=[h,h,h,h,h,h];super(e,e,t,i,r,a,n,s,o,l),this.image=c,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Bc=class extends gi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wt=class zc extends yt{constructor(t=1,i=1,r=1,a=1,n=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:r,widthSegments:a,heightSegments:n,depthSegments:s};let o=this;a=Math.floor(a),n=Math.floor(n),s=Math.floor(s);let l=[],h=[],c=[],p=[],u=0,f=0;_("z","y","x",-1,-1,r,i,t,s,n,0),_("z","y","x",1,-1,r,i,-t,s,n,1),_("x","z","y",1,1,t,r,i,a,s,2),_("x","z","y",1,-1,t,r,-i,a,s,3),_("x","y","z",1,-1,t,i,r,a,n,4),_("x","y","z",-1,-1,t,i,-r,a,n,5),this.setIndex(l),this.setAttribute("position",new He(h,3)),this.setAttribute("normal",new He(c,3)),this.setAttribute("uv",new He(p,2));function _(y,m,d,w,A,v,T,C,M,g,b){let I=v/M,P=T/g,L=v/2,V=T/2,D=C/2,H=M+1,J=g+1,j=0,ue=0,Z=new x;for(let K=0;K<J;K++){let te=K*P-V;for(let Ve=0;Ve<H;Ve++){let Ce=Ve*I-L;Z[y]=Ce*w,Z[m]=te*A,Z[d]=D,h.push(Z.x,Z.y,Z.z),Z[y]=0,Z[m]=0,Z[d]=C>0?1:-1,c.push(Z.x,Z.y,Z.z),p.push(Ve/M),p.push(1-K/g),j+=1}}for(let K=0;K<g;K++)for(let te=0;te<M;te++){let Ve=u+te+H*K,Ce=u+te+H*(K+1),ut=u+(te+1)+H*(K+1),be=u+(te+1)+H*K;l.push(Ve,Ce,be),l.push(Ce,ut,be),ue+=6}o.addGroup(f,ue,b),f+=ue,u+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zc(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Od=class Hc extends yt{constructor(t=1,i=1,r=4,a=8,n=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:i,capSegments:r,radialSegments:a,heightSegments:n},i=Math.max(0,i),r=Math.max(1,Math.floor(r)),a=Math.max(3,Math.floor(a)),n=Math.max(1,Math.floor(n));let s=[],o=[],l=[],h=[],c=i/2,p=Math.PI/2*t,u=i,f=2*p+u,_=r*2+n,y=a+1,m=new x,d=new x;for(let w=0;w<=_;w++){let A=0,v=0,T=0,C=0;if(w<=r){let b=w/r,I=b*Math.PI/2;v=-c-t*Math.cos(I),T=t*Math.sin(I),C=-t*Math.cos(I),A=b*p}else if(w<=r+n){let b=(w-r)/n;v=-c+b*i,T=t,C=0,A=p+b*u}else{let b=(w-r-n)/r,I=b*Math.PI/2;v=c+t*Math.sin(I),T=t*Math.cos(I),C=t*Math.sin(I),A=p+u+b*p}let M=Math.max(0,Math.min(1,A/f)),g=0;w===0?g=.5/a:w===_&&(g=-.5/a);for(let b=0;b<=a;b++){let I=b/a,P=I*Math.PI*2,L=Math.sin(P),V=Math.cos(P);d.x=-T*V,d.y=v,d.z=T*L,o.push(d.x,d.y,d.z),m.set(-T*V,C,T*L),m.normalize(),l.push(m.x,m.y,m.z),h.push(I+g,M)}if(w>0){let b=(w-1)*y;for(let I=0;I<a;I++){let P=b+I,L=b+I+1,V=w*y+I,D=w*y+I+1;s.push(P,L,V),s.push(L,D,V)}}}this.setIndex(s),this.setAttribute("position",new He(o,3)),this.setAttribute("normal",new He(l,3)),this.setAttribute("uv",new He(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hc(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Cn=class Vc extends yt{constructor(t=1,i=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:i,thetaStart:r,thetaLength:a},i=Math.max(3,i);let n=[],s=[],o=[],l=[],h=new x,c=new se;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let p=0,u=3;p<=i;p++,u+=3){let f=r+p/i*a;h.x=t*Math.cos(f),h.y=t*Math.sin(f),s.push(h.x,h.y,h.z),o.push(0,0,1),c.x=(s[u]/t+1)/2,c.y=(s[u+1]/t+1)/2,l.push(c.x,c.y)}for(let p=1;p<=i;p++)n.push(p,p+1,0);this.setIndex(n),this.setAttribute("position",new He(s,3)),this.setAttribute("normal",new He(o,3)),this.setAttribute("uv",new He(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vc(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Mr=class Gc extends yt{constructor(t=1,i=1,r=1,a=32,n=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:i,height:r,radialSegments:a,heightSegments:n,openEnded:s,thetaStart:o,thetaLength:l};let h=this;a=Math.floor(a),n=Math.floor(n);let c=[],p=[],u=[],f=[],_=0,y=[],m=r/2,d=0;w(),s===!1&&(t>0&&A(!0),i>0&&A(!1)),this.setIndex(c),this.setAttribute("position",new He(p,3)),this.setAttribute("normal",new He(u,3)),this.setAttribute("uv",new He(f,2));function w(){let v=new x,T=new x,C=0,M=(i-t)/r;for(let g=0;g<=n;g++){let b=[],I=g/n,P=I*(i-t)+t;for(let L=0;L<=a;L++){let V=L/a,D=V*l+o,H=Math.sin(D),J=Math.cos(D);T.x=P*H,T.y=-I*r+m,T.z=P*J,p.push(T.x,T.y,T.z),v.set(H,M,J).normalize(),u.push(v.x,v.y,v.z),f.push(V,1-I),b.push(_++)}y.push(b)}for(let g=0;g<a;g++)for(let b=0;b<n;b++){let I=y[b][g],P=y[b+1][g],L=y[b+1][g+1],V=y[b][g+1];(t>0||b!==0)&&(c.push(I,P,V),C+=3),(i>0||b!==n-1)&&(c.push(P,L,V),C+=3)}h.addGroup(d,C,0),d+=C}function A(v){let T=_,C=new se,M=new x,g=0,b=v===!0?t:i,I=v===!0?1:-1;for(let L=1;L<=a;L++)p.push(0,m*I,0),u.push(0,I,0),f.push(.5,.5),_++;let P=_;for(let L=0;L<=a;L++){let V=L/a*l+o,D=Math.cos(V),H=Math.sin(V);M.x=b*H,M.y=m*I,M.z=b*D,p.push(M.x,M.y,M.z),u.push(0,I,0),C.x=D*.5+.5,C.y=H*.5*I+.5,f.push(C.x,C.y),_++}for(let L=0;L<a;L++){let V=T+L,D=P+L;v===!0?c.push(D,D+1,V):c.push(D+1,D,V),g+=3}h.addGroup(d,g,v===!0?1:2),d+=g}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gc(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ks=class kc extends Mr{constructor(t=1,i=1,r=32,a=1,n=!1,s=0,o=Math.PI*2){super(0,t,i,r,a,n,s,o),this.type="ConeGeometry",this.parameters={radius:t,height:i,radialSegments:r,heightSegments:a,openEnded:n,thetaStart:s,thetaLength:o}}static fromJSON(t){return new kc(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Pn=class Wc extends yt{constructor(t=[],i=[],r=1,a=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:i,radius:r,detail:a};let n=[],s=[];o(a),h(r),c(),this.setAttribute("position",new He(n,3)),this.setAttribute("normal",new He(n.slice(),3)),this.setAttribute("uv",new He(s,2)),a===0?this.computeVertexNormals():this.normalizeNormals();function o(w){let A=new x,v=new x,T=new x;for(let C=0;C<i.length;C+=3)f(i[C+0],A),f(i[C+1],v),f(i[C+2],T),l(A,v,T,w)}function l(w,A,v,T){let C=T+1,M=[];for(let g=0;g<=C;g++){M[g]=[];let b=w.clone().lerp(v,g/C),I=A.clone().lerp(v,g/C),P=C-g;for(let L=0;L<=P;L++)L===0&&g===C?M[g][L]=b:M[g][L]=b.clone().lerp(I,L/P)}for(let g=0;g<C;g++)for(let b=0;b<2*(C-g)-1;b++){let I=Math.floor(b/2);b%2===0?(u(M[g][I+1]),u(M[g+1][I]),u(M[g][I])):(u(M[g][I+1]),u(M[g+1][I+1]),u(M[g+1][I]))}}function h(w){let A=new x;for(let v=0;v<n.length;v+=3)A.x=n[v+0],A.y=n[v+1],A.z=n[v+2],A.normalize().multiplyScalar(w),n[v+0]=A.x,n[v+1]=A.y,n[v+2]=A.z}function c(){let w=new x;for(let A=0;A<n.length;A+=3){w.x=n[A+0],w.y=n[A+1],w.z=n[A+2];let v=m(w)/2/Math.PI+.5,T=d(w)/Math.PI+.5;s.push(v,1-T)}_(),p()}function p(){for(let w=0;w<s.length;w+=6){let A=s[w+0],v=s[w+2],T=s[w+4],C=Math.max(A,v,T),M=Math.min(A,v,T);C>.9&&M<.1&&(A<.2&&(s[w+0]+=1),v<.2&&(s[w+2]+=1),T<.2&&(s[w+4]+=1))}}function u(w){n.push(w.x,w.y,w.z)}function f(w,A){let v=w*3;A.x=t[v+0],A.y=t[v+1],A.z=t[v+2]}function _(){let w=new x,A=new x,v=new x,T=new x,C=new se,M=new se,g=new se;for(let b=0,I=0;b<n.length;b+=9,I+=6){w.set(n[b+0],n[b+1],n[b+2]),A.set(n[b+3],n[b+4],n[b+5]),v.set(n[b+6],n[b+7],n[b+8]),C.set(s[I+0],s[I+1]),M.set(s[I+2],s[I+3]),g.set(s[I+4],s[I+5]),T.copy(w).add(A).add(v).divideScalar(3);let P=m(T);y(C,I+0,w,P),y(M,I+2,A,P),y(g,I+4,v,P)}}function y(w,A,v,T){T<0&&w.x===1&&(s[A]=w.x-1),v.x===0&&v.z===0&&(s[A]=T/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function d(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wc(t.vertices,t.indices,t.radius,t.detail)}},Fd=class jc extends Pn{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=1/r,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-a,-r,0,-a,r,0,a,-r,0,a,r,-a,-r,0,-a,r,0,a,-r,0,a,r,0,-r,0,-a,r,0,-a,-r,0,a,r,0,a],s=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,s,t,i),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new jc(t.radius,t.detail)}},fs=new x,ms=new x,Fo=new x,gs=new Gr,Bd=class extends yt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),r=Math.cos(Fa*t),a=e.getIndex(),n=e.getAttribute("position"),s=a?a.count:n.count,o=[0,0,0],l=["a","b","c"],h=new Array(3),c={},p=[];for(let u=0;u<s;u+=3){a?(o[0]=a.getX(u),o[1]=a.getX(u+1),o[2]=a.getX(u+2)):(o[0]=u,o[1]=u+1,o[2]=u+2);let{a:f,b:_,c:y}=gs;if(f.fromBufferAttribute(n,o[0]),_.fromBufferAttribute(n,o[1]),y.fromBufferAttribute(n,o[2]),gs.getNormal(Fo),h[0]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,h[1]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,h[2]=`${Math.round(y.x*i)},${Math.round(y.y*i)},${Math.round(y.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let m=0;m<3;m++){let d=(m+1)%3,w=h[m],A=h[d],v=gs[l[m]],T=gs[l[d]],C=`${w}_${A}`,M=`${A}_${w}`;M in c&&c[M]?(Fo.dot(c[M].normal)<=r&&(p.push(v.x,v.y,v.z),p.push(T.x,T.y,T.z)),c[M]=null):C in c||(c[C]={index0:o[m],index1:o[d],normal:Fo.clone()})}}for(let u in c)if(c[u]){let{index0:f,index1:_}=c[u];fs.fromBufferAttribute(n,f),ms.fromBufferAttribute(n,_),p.push(fs.x,fs.y,fs.z),p.push(ms.x,ms.y,ms.z)}this.setAttribute("position",new He(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Wi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),a=0;t.push(0);for(let n=1;n<=e;n++)i=this.getPoint(n/e),a+=i.distanceTo(r),t.push(a),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,a=i.length,n;t?n=t:n=e*i[a-1];let s=0,o=a-1,l;for(;s<=o;)if(r=Math.floor(s+(o-s)/2),l=i[r]-n,l<0)s=r+1;else if(l>0)o=r-1;else{o=r;break}if(r=o,i[r]===n)return r/(a-1);let h=i[r],c=i[r+1]-h,p=(n-h)/c;return(r+p)/(a-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),n=this.getPoint(r),s=t||(a.isVector2?new se:new x);return s.copy(n).sub(a).normalize(),s}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new x,r=[],a=[],n=[],s=new x,o=new Ke;for(let u=0;u<=e;u++){let f=u/e;r[u]=this.getTangentAt(f,new x)}a[0]=new x,n[0]=new x;let l=Number.MAX_VALUE,h=Math.abs(r[0].x),c=Math.abs(r[0].y),p=Math.abs(r[0].z);h<=l&&(l=h,i.set(1,0,0)),c<=l&&(l=c,i.set(0,1,0)),p<=l&&i.set(0,0,1),s.crossVectors(r[0],i).normalize(),a[0].crossVectors(r[0],s),n[0].crossVectors(r[0],a[0]);for(let u=1;u<=e;u++){if(a[u]=a[u-1].clone(),n[u]=n[u-1].clone(),s.crossVectors(r[u-1],r[u]),s.length()>Number.EPSILON){s.normalize();let f=Math.acos(tt(r[u-1].dot(r[u]),-1,1));a[u].applyMatrix4(o.makeRotationAxis(s,f))}n[u].crossVectors(r[u],a[u])}if(t===!0){let u=Math.acos(tt(a[0].dot(a[e]),-1,1));u/=e,r[0].dot(s.crossVectors(a[0],a[e]))>0&&(u=-u);for(let f=1;f<=e;f++)a[f].applyMatrix4(o.makeRotationAxis(r[f],u*f)),n[f].crossVectors(r[f],a[f])}return{tangents:r,normals:a,binormals:n}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},$l=class extends Wi{constructor(e=0,t=0,i=1,r=1,a=0,n=Math.PI*2,s=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=a,this.aEndAngle=n,this.aClockwise=s,this.aRotation=o}getPoint(e,t=new se){let i=t,r=Math.PI*2,a=this.aEndAngle-this.aStartAngle,n=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=r;for(;a>r;)a-=r;a<Number.EPSILON&&(n?a=0:a=r),this.aClockwise===!0&&!n&&(a===r?a=-r:a=a-r);let s=this.aStartAngle+e*a,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(this.aRotation!==0){let h=Math.cos(this.aRotation),c=Math.sin(this.aRotation),p=o-this.aX,u=l-this.aY;o=p*h-u*c+this.aX,l=p*c+u*h+this.aY}return i.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},zd=class extends $l{constructor(e,t,i,r,a,n){super(e,t,i,i,r,a,n),this.isArcCurve=!0,this.type="ArcCurve"}};function Ql(){let e=0,t=0,i=0,r=0;function a(n,s,o,l){e=n,t=o,i=-3*n+3*s-2*o-l,r=2*n-2*s+o+l}return{initCatmullRom:function(n,s,o,l,h){a(s,o,h*(o-n),h*(l-s))},initNonuniformCatmullRom:function(n,s,o,l,h,c,p){let u=(s-n)/h-(o-n)/(h+c)+(o-s)/c,f=(o-s)/c-(l-s)/(c+p)+(l-o)/p;u*=c,f*=c,a(s,o,u,f)},calc:function(n){let s=n*n,o=s*n;return e+t*n+i*s+r*o}}}var vh=new x,xh=new x,Bo=new Ql,zo=new Ql,Ho=new Ql,Hd=class extends Wi{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new x){let i=t,r=this.points,a=r.length,n=(a-(this.closed?0:1))*e,s=Math.floor(n),o=n-s;this.closed?s+=s>0?0:(Math.floor(Math.abs(s)/a)+1)*a:o===0&&s===a-1&&(s=a-2,o=1);let l,h;this.closed||s>0?l=r[(s-1)%a]:(xh.subVectors(r[0],r[1]).add(r[0]),l=xh);let c=r[s%a],p=r[(s+1)%a];if(this.closed||s+2<a?h=r[(s+2)%a]:(vh.subVectors(r[a-1],r[a-2]).add(r[a-1]),h=vh),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,f=Math.pow(l.distanceToSquared(c),u),_=Math.pow(c.distanceToSquared(p),u),y=Math.pow(p.distanceToSquared(h),u);_<1e-4&&(_=1),f<1e-4&&(f=_),y<1e-4&&(y=_),Bo.initNonuniformCatmullRom(l.x,c.x,p.x,h.x,f,_,y),zo.initNonuniformCatmullRom(l.y,c.y,p.y,h.y,f,_,y),Ho.initNonuniformCatmullRom(l.z,c.z,p.z,h.z,f,_,y)}else this.curveType==="catmullrom"&&(Bo.initCatmullRom(l.x,c.x,p.x,h.x,this.tension),zo.initCatmullRom(l.y,c.y,p.y,h.y,this.tension),Ho.initCatmullRom(l.z,c.z,p.z,h.z,this.tension));return i.set(Bo.calc(o),zo.calc(o),Ho.calc(o)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new x().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function yh(e,t,i,r,a){let n=(r-t)*.5,s=(a-i)*.5,o=e*e,l=e*o;return(2*i-2*r+n+s)*l+(-3*i+3*r-2*n-s)*o+n*e+i}function Vd(e,t){let i=1-e;return i*i*t}function Gd(e,t){return 2*(1-e)*e*t}function kd(e,t){return e*e*t}function gn(e,t,i,r){return Vd(e,t)+Gd(e,i)+kd(e,r)}function Wd(e,t){let i=1-e;return i*i*i*t}function jd(e,t){let i=1-e;return 3*i*i*e*t}function qd(e,t){return 3*(1-e)*e*e*t}function Xd(e,t){return e*e*e*t}function _n(e,t,i,r,a){return Wd(e,t)+jd(e,i)+qd(e,r)+Xd(e,a)}var qc=class extends Wi{constructor(e=new se,t=new se,i=new se,r=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new se){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(_n(e,r.x,a.x,n.x,s.x),_n(e,r.y,a.y,n.y,s.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Yd=class extends Wi{constructor(e=new x,t=new x,i=new x,r=new x){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new x){let i=t,r=this.v0,a=this.v1,n=this.v2,s=this.v3;return i.set(_n(e,r.x,a.x,n.x,s.x),_n(e,r.y,a.y,n.y,s.y),_n(e,r.z,a.z,n.z,s.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xc=class extends Wi{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zd=class extends Wi{constructor(e=new x,t=new x){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new x){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new x){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yc=class extends Wi{constructor(e=new se,t=new se,i=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new se){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(gn(e,r.x,a.x,n.x),gn(e,r.y,a.y,n.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zc=class extends Wi{constructor(e=new x,t=new x,i=new x){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new x){let i=t,r=this.v0,a=this.v1,n=this.v2;return i.set(gn(e,r.x,a.x,n.x),gn(e,r.y,a.y,n.y),gn(e,r.z,a.z,n.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jc=class extends Wi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){let i=t,r=this.points,a=(r.length-1)*e,n=Math.floor(a),s=a-n,o=r[n===0?n:n-1],l=r[n],h=r[n>r.length-2?r.length-1:n+1],c=r[n>r.length-3?r.length-1:n+2];return i.set(yh(s,o.x,l.x,h.x,c.x),yh(s,o.y,l.y,h.y,c.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new se().fromArray(r))}return this}},Fs=Object.freeze({__proto__:null,ArcCurve:zd,CatmullRomCurve3:Hd,CubicBezierCurve:qc,CubicBezierCurve3:Yd,EllipseCurve:$l,LineCurve:Xc,LineCurve3:Zd,QuadraticBezierCurve:Yc,QuadraticBezierCurve3:Zc,SplineCurve:Jc}),Jd=class extends Wi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fs[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),r=this.getCurveLengths(),a=0;for(;a<r.length;){if(r[a]>=i){let n=r[a]-i,s=this.curves[a],o=s.getLength(),l=o===0?0:1-n/o;return s.getPointAt(l,t)}a++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let r=0,a=this.curves;r<a.length;r++){let n=a[r],s=n.isEllipseCurve?e*2:n.isLineCurve||n.isLineCurve3?1:n.isSplineCurve?e*n.points.length:e,o=n.getPoints(s);for(let l=0;l<o.length;l++){let h=o[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(new Fs[r.type]().fromJSON(r))}return this}},bh=class extends Jd{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Xc(this.currentPoint.clone(),new se(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){let a=new Yc(this.currentPoint.clone(),new se(e,t),new se(i,r));return this.curves.push(a),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,a,n){let s=new qc(this.currentPoint.clone(),new se(e,t),new se(i,r),new se(a,n));return this.curves.push(s),this.currentPoint.set(a,n),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Jc(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,a,n){let s=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+s,t+o,i,r,a,n),this}absarc(e,t,i,r,a,n){return this.absellipse(e,t,i,i,r,a,n),this}ellipse(e,t,i,r,a,n,s,o){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,r,a,n,s,o),this}absellipse(e,t,i,r,a,n,s,o){let l=new $l(e,t,i,r,a,n,s,o);if(this.curves.length>0){let c=l.getPoint(0);c.equals(this.currentPoint)||this.lineTo(c.x,c.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Kc=class extends bh{constructor(e){super(e),this.uuid=Bi(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(new bh().fromJSON(r))}return this}};function Kd(e,t,i=2){let r=t&&t.length,a=r?t[0]*i:e.length,n=$c(e,0,a,i,!0),s=[];if(!n||n.next===n.prev)return s;let o,l,h;if(r&&(n=i1(e,t,n,i)),e.length>80*i){o=e[0],l=e[1];let c=o,p=l;for(let u=i;u<a;u+=i){let f=e[u],_=e[u+1];f<o&&(o=f),_<l&&(l=_),f>c&&(c=f),_>p&&(p=_)}h=Math.max(c-o,p-l),h=h!==0?32767/h:0}return Tn(n,s,i,o,l,h,0),s}function $c(e,t,i,r,a){let n;if(a===d1(e,t,i,r)>0)for(let s=t;s<i;s+=r)n=Sh(s/r|0,e[s],e[s+1],n);else for(let s=i-r;s>=t;s-=r)n=Sh(s/r|0,e[s],e[s+1],n);return n&&Ga(n,n.next)&&(An(n),n=n.next),n}function Jr(e,t){if(!e)return e;t||(t=e);let i=e,r;do if(r=!1,!i.steiner&&(Ga(i,i.next)||Tt(i.prev,i,i.next)===0)){if(An(i),i=t=i.prev,i===i.next)break;r=!0}else i=i.next;while(r||i!==t);return t}function Tn(e,t,i,r,a,n,s){if(!e)return;!s&&n&&o1(e,r,a,n);let o=e;for(;e.prev!==e.next;){let l=e.prev,h=e.next;if(n?Qd(e,r,a,n):$d(e)){t.push(l.i,e.i,h.i),An(e),e=h.next,o=h.next;continue}if(e=h,e===o){s?s===1?(e=e1(Jr(e),t),Tn(e,t,i,r,a,n,2)):s===2&&t1(e,t,i,r,a,n):Tn(Jr(e),t,i,r,a,n,1);break}}}function $d(e){let t=e.prev,i=e,r=e.next;if(Tt(t,i,r)>=0)return!1;let a=t.x,n=i.x,s=r.x,o=t.y,l=i.y,h=r.y,c=Math.min(a,n,s),p=Math.min(o,l,h),u=Math.max(a,n,s),f=Math.max(o,l,h),_=r.next;for(;_!==t;){if(_.x>=c&&_.x<=u&&_.y>=p&&_.y<=f&&pn(a,o,n,l,s,h,_.x,_.y)&&Tt(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Qd(e,t,i,r){let a=e.prev,n=e,s=e.next;if(Tt(a,n,s)>=0)return!1;let o=a.x,l=n.x,h=s.x,c=a.y,p=n.y,u=s.y,f=Math.min(o,l,h),_=Math.min(c,p,u),y=Math.max(o,l,h),m=Math.max(c,p,u),d=Ol(f,_,t,i,r),w=Ol(y,m,t,i,r),A=e.prevZ,v=e.nextZ;for(;A&&A.z>=d&&v&&v.z<=w;){if(A.x>=f&&A.x<=y&&A.y>=_&&A.y<=m&&A!==a&&A!==s&&pn(o,c,l,p,h,u,A.x,A.y)&&Tt(A.prev,A,A.next)>=0||(A=A.prevZ,v.x>=f&&v.x<=y&&v.y>=_&&v.y<=m&&v!==a&&v!==s&&pn(o,c,l,p,h,u,v.x,v.y)&&Tt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;A&&A.z>=d;){if(A.x>=f&&A.x<=y&&A.y>=_&&A.y<=m&&A!==a&&A!==s&&pn(o,c,l,p,h,u,A.x,A.y)&&Tt(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;v&&v.z<=w;){if(v.x>=f&&v.x<=y&&v.y>=_&&v.y<=m&&v!==a&&v!==s&&pn(o,c,l,p,h,u,v.x,v.y)&&Tt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function e1(e,t){let i=e;do{let r=i.prev,a=i.next.next;!Ga(r,a)&&eu(r,i,i.next,a)&&wn(r,a)&&wn(a,r)&&(t.push(r.i,i.i,a.i),An(i),An(i.next),i=e=a),i=i.next}while(i!==e);return Jr(i)}function t1(e,t,i,r,a,n){let s=e;do{let o=s.next.next;for(;o!==s.prev;){if(s.i!==o.i&&c1(s,o)){let l=tu(s,o);s=Jr(s,s.next),l=Jr(l,l.next),Tn(s,t,i,r,a,n,0),Tn(l,t,i,r,a,n,0);return}o=o.next}s=s.next}while(s!==e)}function i1(e,t,i,r){let a=[];for(let n=0,s=t.length;n<s;n++){let o=t[n]*r,l=n<s-1?t[n+1]*r:e.length,h=$c(e,o,l,r,!1);h===h.next&&(h.steiner=!0),a.push(h1(h))}a.sort(r1);for(let n=0;n<a.length;n++)i=a1(a[n],i);return i}function r1(e,t){let i=e.x-t.x;if(i===0&&(i=e.y-t.y,i===0)){let r=(e.next.y-e.y)/(e.next.x-e.x),a=(t.next.y-t.y)/(t.next.x-t.x);i=r-a}return i}function a1(e,t){let i=n1(e,t);if(!i)return t;let r=tu(i,e);return Jr(r,r.next),Jr(i,i.next)}function n1(e,t){let i=t,r=e.x,a=e.y,n=-1/0,s;if(Ga(e,i))return i;do{if(Ga(e,i.next))return i.next;if(a<=i.y&&a>=i.next.y&&i.next.y!==i.y){let p=i.x+(a-i.y)*(i.next.x-i.x)/(i.next.y-i.y);if(p<=r&&p>n&&(n=p,s=i.x<i.next.x?i:i.next,p===r))return s}i=i.next}while(i!==t);if(!s)return null;let o=s,l=s.x,h=s.y,c=1/0;i=s;do{if(r>=i.x&&i.x>=l&&r!==i.x&&Qc(a<h?r:n,a,l,h,a<h?n:r,a,i.x,i.y)){let p=Math.abs(a-i.y)/(r-i.x);wn(i,e)&&(p<c||p===c&&(i.x>s.x||i.x===s.x&&s1(s,i)))&&(s=i,c=p)}i=i.next}while(i!==o);return s}function s1(e,t){return Tt(e.prev,e,t.prev)<0&&Tt(t.next,e,e.next)<0}function o1(e,t,i,r){let a=e;do a.z===0&&(a.z=Ol(a.x,a.y,t,i,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next;while(a!==e);a.prevZ.nextZ=null,a.prevZ=null,l1(a)}function l1(e){let t,i=1;do{let r=e,a;e=null;let n=null;for(t=0;r;){t++;let s=r,o=0;for(let h=0;h<i&&(o++,s=s.nextZ,!!s);h++);let l=i;for(;o>0||l>0&&s;)o!==0&&(l===0||!s||r.z<=s.z)?(a=r,r=r.nextZ,o--):(a=s,s=s.nextZ,l--),n?n.nextZ=a:e=a,a.prevZ=n,n=a;r=s}n.nextZ=null,i*=2}while(t>1);return e}function Ol(e,t,i,r,a){return e=(e-i)*a|0,t=(t-r)*a|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function h1(e){let t=e,i=e;do(t.x<i.x||t.x===i.x&&t.y<i.y)&&(i=t),t=t.next;while(t!==e);return i}function Qc(e,t,i,r,a,n,s,o){return(a-s)*(t-o)>=(e-s)*(n-o)&&(e-s)*(r-o)>=(i-s)*(t-o)&&(i-s)*(n-o)>=(a-s)*(r-o)}function pn(e,t,i,r,a,n,s,o){return!(e===s&&t===o)&&Qc(e,t,i,r,a,n,s,o)}function c1(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!u1(e,t)&&(wn(e,t)&&wn(t,e)&&p1(e,t)&&(Tt(e.prev,e,t.prev)||Tt(e,t.prev,t))||Ga(e,t)&&Tt(e.prev,e,e.next)>0&&Tt(t.prev,t,t.next)>0)}function Tt(e,t,i){return(t.y-e.y)*(i.x-t.x)-(t.x-e.x)*(i.y-t.y)}function Ga(e,t){return e.x===t.x&&e.y===t.y}function eu(e,t,i,r){let a=vs(Tt(e,t,i)),n=vs(Tt(e,t,r)),s=vs(Tt(i,r,e)),o=vs(Tt(i,r,t));return!!(a!==n&&s!==o||a===0&&_s(e,i,t)||n===0&&_s(e,r,t)||s===0&&_s(i,e,r)||o===0&&_s(i,t,r))}function _s(e,t,i){return t.x<=Math.max(e.x,i.x)&&t.x>=Math.min(e.x,i.x)&&t.y<=Math.max(e.y,i.y)&&t.y>=Math.min(e.y,i.y)}function vs(e){return e>0?1:e<0?-1:0}function u1(e,t){let i=e;do{if(i.i!==e.i&&i.next.i!==e.i&&i.i!==t.i&&i.next.i!==t.i&&eu(i,i.next,e,t))return!0;i=i.next}while(i!==e);return!1}function wn(e,t){return Tt(e.prev,e,e.next)<0?Tt(e,t,e.next)>=0&&Tt(e,e.prev,t)>=0:Tt(e,t,e.prev)<0||Tt(e,e.next,t)<0}function p1(e,t){let i=e,r=!1,a=(e.x+t.x)/2,n=(e.y+t.y)/2;do i.y>n!=i.next.y>n&&i.next.y!==i.y&&a<(i.next.x-i.x)*(n-i.y)/(i.next.y-i.y)+i.x&&(r=!r),i=i.next;while(i!==e);return r}function tu(e,t){let i=Fl(e.i,e.x,e.y),r=Fl(t.i,t.x,t.y),a=e.next,n=t.prev;return e.next=t,t.prev=e,i.next=a,a.prev=i,r.next=i,i.prev=r,n.next=r,r.prev=n,r}function Sh(e,t,i,r){let a=Fl(e,t,i);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function An(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Fl(e,t,i){return{i:e,x:t,y:i,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function d1(e,t,i,r){let a=0;for(let n=t,s=i-r;n<i;n+=r)a+=(e[s]-e[n])*(e[n+1]+e[s+1]),s=n;return a}var f1=class{static triangulate(e,t,i=2){return Kd(e,t,i)}},jr=class iu{static area(t){let i=t.length,r=0;for(let a=i-1,n=0;n<i;a=n++)r+=t[a].x*t[n].y-t[n].x*t[a].y;return r*.5}static isClockWise(t){return iu.area(t)<0}static triangulateShape(t,i){let r=[],a=[],n=[];Mh(t),Eh(r,t);let s=t.length;i.forEach(Mh);for(let l=0;l<i.length;l++)a.push(s),s+=i[l].length,Eh(r,i[l]);let o=f1.triangulate(r,a);for(let l=0;l<o.length;l+=3)n.push(o.slice(l,l+3));return n}};function Mh(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Eh(e,t){for(let i=0;i<t.length;i++)e.push(t[i].x),e.push(t[i].y)}var m1=class ru extends yt{constructor(t=new Kc([new se(.5,.5),new se(-.5,.5),new se(-.5,-.5),new se(.5,-.5)]),i={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:i},t=Array.isArray(t)?t:[t];let r=this,a=[],n=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];s(h)}this.setAttribute("position",new He(a,3)),this.setAttribute("uv",new He(n,2)),this.computeVertexNormals();function s(o){let l=[],h=i.curveSegments!==void 0?i.curveSegments:12,c=i.steps!==void 0?i.steps:1,p=i.depth!==void 0?i.depth:1,u=i.bevelEnabled!==void 0?i.bevelEnabled:!0,f=i.bevelThickness!==void 0?i.bevelThickness:.2,_=i.bevelSize!==void 0?i.bevelSize:f-.1,y=i.bevelOffset!==void 0?i.bevelOffset:0,m=i.bevelSegments!==void 0?i.bevelSegments:3,d=i.extrudePath,w=i.UVGenerator!==void 0?i.UVGenerator:g1,A,v=!1,T,C,M,g;if(d){A=d.getSpacedPoints(c),v=!0,u=!1;let re=d.isCatmullRomCurve3?d.closed:!1;T=d.computeFrenetFrames(c,re),C=new x,M=new x,g=new x}u||(m=0,f=0,_=0,y=0);let b=o.extractPoints(h),I=b.shape,P=b.holes;if(!jr.isClockWise(I)){I=I.reverse();for(let re=0,ie=P.length;re<ie;re++){let ce=P[re];jr.isClockWise(ce)&&(P[re]=ce.reverse())}}function L(re){let ie=10000000000000001e-36,ce=re[0];for(let Se=1;Se<=re.length;Se++){let Me=Se%re.length,De=re[Me],Ge=De.x-ce.x,Je=De.y-ce.y,$e=Ge*Ge+Je*Je,N=Math.max(Math.abs(De.x),Math.abs(De.y),Math.abs(ce.x),Math.abs(ce.y)),xt=ie*N*N;if($e<=xt){re.splice(Me,1),Se--;continue}ce=De}}L(I),P.forEach(L);let V=P.length,D=I;for(let re=0;re<V;re++){let ie=P[re];I=I.concat(ie)}function H(re,ie,ce){return ie||Ye("ExtrudeGeometry: vec does not exist"),re.clone().addScaledVector(ie,ce)}let J=I.length;function j(re,ie,ce){let Se,Me,De,Ge=re.x-ie.x,Je=re.y-ie.y,$e=ce.x-re.x,N=ce.y-re.y,xt=Ge*Ge+Je*Je,nt=Ge*N-Je*$e;if(Math.abs(nt)>Number.EPSILON){let rt=Math.sqrt(xt),R=Math.sqrt($e*$e+N*N),S=ie.x-Je/rt,O=ie.y+Ge/rt,q=ce.x-N/R,ee=ce.y+$e/R,fe=((q-S)*N-(ee-O)*$e)/(Ge*N-Je*$e);Se=S+Ge*fe-re.x,Me=O+Je*fe-re.y;let ge=Se*Se+Me*Me;if(ge<=2)return new se(Se,Me);De=Math.sqrt(ge/2)}else{let rt=!1;Ge>Number.EPSILON?$e>Number.EPSILON&&(rt=!0):Ge<-Number.EPSILON?$e<-Number.EPSILON&&(rt=!0):Math.sign(Je)===Math.sign(N)&&(rt=!0),rt?(Se=-Je,Me=Ge,De=Math.sqrt(xt)):(Se=Ge,Me=Je,De=Math.sqrt(xt/2))}return new se(Se/De,Me/De)}let ue=[];for(let re=0,ie=D.length,ce=ie-1,Se=re+1;re<ie;re++,ce++,Se++)ce===ie&&(ce=0),Se===ie&&(Se=0),ue[re]=j(D[re],D[ce],D[Se]);let Z=[],K,te=ue.concat();for(let re=0,ie=V;re<ie;re++){let ce=P[re];K=[];for(let Se=0,Me=ce.length,De=Me-1,Ge=Se+1;Se<Me;Se++,De++,Ge++)De===Me&&(De=0),Ge===Me&&(Ge=0),K[Se]=j(ce[Se],ce[De],ce[Ge]);Z.push(K),te=te.concat(K)}let Ve;if(m===0)Ve=jr.triangulateShape(D,P);else{let re=[],ie=[];for(let ce=0;ce<m;ce++){let Se=ce/m,Me=f*Math.cos(Se*Math.PI/2),De=_*Math.sin(Se*Math.PI/2)+y;for(let Ge=0,Je=D.length;Ge<Je;Ge++){let $e=H(D[Ge],ue[Ge],De);ne($e.x,$e.y,-Me),Se===0&&re.push($e)}for(let Ge=0,Je=V;Ge<Je;Ge++){let $e=P[Ge];K=Z[Ge];let N=[];for(let xt=0,nt=$e.length;xt<nt;xt++){let rt=H($e[xt],K[xt],De);ne(rt.x,rt.y,-Me),Se===0&&N.push(rt)}Se===0&&ie.push(N)}}Ve=jr.triangulateShape(re,ie)}let Ce=Ve.length,ut=_+y;for(let re=0;re<J;re++){let ie=u?H(I[re],te[re],ut):I[re];v?(M.copy(T.normals[0]).multiplyScalar(ie.x),C.copy(T.binormals[0]).multiplyScalar(ie.y),g.copy(A[0]).add(M).add(C),ne(g.x,g.y,g.z)):ne(ie.x,ie.y,0)}for(let re=1;re<=c;re++)for(let ie=0;ie<J;ie++){let ce=u?H(I[ie],te[ie],ut):I[ie];v?(M.copy(T.normals[re]).multiplyScalar(ce.x),C.copy(T.binormals[re]).multiplyScalar(ce.y),g.copy(A[re]).add(M).add(C),ne(g.x,g.y,g.z)):ne(ce.x,ce.y,p/c*re)}for(let re=m-1;re>=0;re--){let ie=re/m,ce=f*Math.cos(ie*Math.PI/2),Se=_*Math.sin(ie*Math.PI/2)+y;for(let Me=0,De=D.length;Me<De;Me++){let Ge=H(D[Me],ue[Me],Se);ne(Ge.x,Ge.y,p+ce)}for(let Me=0,De=P.length;Me<De;Me++){let Ge=P[Me];K=Z[Me];for(let Je=0,$e=Ge.length;Je<$e;Je++){let N=H(Ge[Je],K[Je],Se);v?ne(N.x,N.y+A[c-1].y,A[c-1].x+ce):ne(N.x,N.y,p+ce)}}}be(),k();function be(){let re=a.length/3;if(u){let ie=0,ce=J*ie;for(let Se=0;Se<Ce;Se++){let Me=Ve[Se];Le(Me[2]+ce,Me[1]+ce,Me[0]+ce)}ie=c+m*2,ce=J*ie;for(let Se=0;Se<Ce;Se++){let Me=Ve[Se];Le(Me[0]+ce,Me[1]+ce,Me[2]+ce)}}else{for(let ie=0;ie<Ce;ie++){let ce=Ve[ie];Le(ce[2],ce[1],ce[0])}for(let ie=0;ie<Ce;ie++){let ce=Ve[ie];Le(ce[0]+J*c,ce[1]+J*c,ce[2]+J*c)}}r.addGroup(re,a.length/3-re,0)}function k(){let re=a.length/3,ie=0;$(D,ie),ie+=D.length;for(let ce=0,Se=P.length;ce<Se;ce++){let Me=P[ce];$(Me,ie),ie+=Me.length}r.addGroup(re,a.length/3-re,1)}function $(re,ie){let ce=re.length;for(;--ce>=0;){let Se=ce,Me=ce-1;Me<0&&(Me=re.length-1);for(let De=0,Ge=c+m*2;De<Ge;De++){let Je=J*De,$e=J*(De+1),N=ie+Se+Je,xt=ie+Me+Je,nt=ie+Me+$e,rt=ie+Se+$e;We(N,xt,nt,rt)}}}function ne(re,ie,ce){l.push(re),l.push(ie),l.push(ce)}function Le(re,ie,ce){me(re),me(ie),me(ce);let Se=a.length/3,Me=w.generateTopUV(r,a,Se-3,Se-2,Se-1);it(Me[0]),it(Me[1]),it(Me[2])}function We(re,ie,ce,Se){me(re),me(ie),me(Se),me(ie),me(ce),me(Se);let Me=a.length/3,De=w.generateSideWallUV(r,a,Me-6,Me-3,Me-2,Me-1);it(De[0]),it(De[1]),it(De[3]),it(De[1]),it(De[2]),it(De[3])}function me(re){a.push(l[re*3+0]),a.push(l[re*3+1]),a.push(l[re*3+2])}function it(re){n.push(re.x),n.push(re.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes,r=this.parameters.options;return _1(i,r,t)}static fromJSON(t,i){let r=[];for(let n=0,s=t.shapes.length;n<s;n++){let o=i[t.shapes[n]];r.push(o)}let a=t.options.extrudePath;return a!==void 0&&(t.options.extrudePath=new Fs[a.type]().fromJSON(a)),new ru(r,t.options)}},g1={generateTopUV:function(e,t,i,r,a){let n=t[i*3],s=t[i*3+1],o=t[r*3],l=t[r*3+1],h=t[a*3],c=t[a*3+1];return[new se(n,s),new se(o,l),new se(h,c)]},generateSideWallUV:function(e,t,i,r,a,n){let s=t[i*3],o=t[i*3+1],l=t[i*3+2],h=t[r*3],c=t[r*3+1],p=t[r*3+2],u=t[a*3],f=t[a*3+1],_=t[a*3+2],y=t[n*3],m=t[n*3+1],d=t[n*3+2];return Math.abs(o-c)<Math.abs(s-h)?[new se(s,1-l),new se(h,1-p),new se(u,1-_),new se(y,1-d)]:[new se(o,1-l),new se(c,1-p),new se(f,1-_),new se(m,1-d)]}};function _1(e,t,i){if(i.shapes=[],Array.isArray(e))for(let r=0,a=e.length;r<a;r++){let n=e[r];i.shapes.push(n.uuid)}else i.shapes.push(e.uuid);return i.options=Object.assign({},t),t.extrudePath!==void 0&&(i.options.extrudePath=t.extrudePath.toJSON()),i}var v1=class au extends Pn{constructor(t=1,i=0){let r=(1+Math.sqrt(5))/2,a=[-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(a,n,t,i),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new au(t.radius,t.detail)}},x1=class nu extends yt{constructor(t=[new se(0,-.5),new se(.5,0),new se(0,.5)],i=12,r=0,a=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:i,phiStart:r,phiLength:a},i=Math.floor(i),a=tt(a,0,Math.PI*2);let n=[],s=[],o=[],l=[],h=[],c=1/i,p=new x,u=new se,f=new x,_=new x,y=new x,m=0,d=0;for(let w=0;w<=t.length-1;w++)switch(w){case 0:m=t[w+1].x-t[w].x,d=t[w+1].y-t[w].y,f.x=d*1,f.y=-m,f.z=d*0,y.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(y.x,y.y,y.z);break;default:m=t[w+1].x-t[w].x,d=t[w+1].y-t[w].y,f.x=d*1,f.y=-m,f.z=d*0,_.copy(f),f.x+=y.x,f.y+=y.y,f.z+=y.z,f.normalize(),l.push(f.x,f.y,f.z),y.copy(_)}for(let w=0;w<=i;w++){let A=r+w*c*a,v=Math.sin(A),T=Math.cos(A);for(let C=0;C<=t.length-1;C++){p.x=t[C].x*v,p.y=t[C].y,p.z=t[C].x*T,s.push(p.x,p.y,p.z),u.x=w/i,u.y=C/(t.length-1),o.push(u.x,u.y);let M=l[3*C+0]*v,g=l[3*C+1],b=l[3*C+0]*T;h.push(M,g,b)}}for(let w=0;w<i;w++)for(let A=0;A<t.length-1;A++){let v=A+w*t.length,T=v,C=v+t.length,M=v+t.length+1,g=v+1;n.push(T,C,g),n.push(M,g,C)}this.setIndex(n),this.setAttribute("position",new He(s,3)),this.setAttribute("uv",new He(o,2)),this.setAttribute("normal",new He(h,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nu(t.points,t.segments,t.phiStart,t.phiLength)}},y1=class su extends Pn{constructor(t=1,i=0){let r=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],a=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(r,a,t,i),this.type="OctahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new su(t.radius,t.detail)}},or=class ou extends yt{constructor(t=1,i=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:r,heightSegments:a};let n=t/2,s=i/2,o=Math.floor(r),l=Math.floor(a),h=o+1,c=l+1,p=t/o,u=i/l,f=[],_=[],y=[],m=[];for(let d=0;d<c;d++){let w=d*u-s;for(let A=0;A<h;A++){let v=A*p-n;_.push(v,-w,0),y.push(0,0,1),m.push(A/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let w=0;w<o;w++){let A=w+h*d,v=w+h*(d+1),T=w+1+h*(d+1),C=w+1+h*d;f.push(A,v,C),f.push(v,T,C)}this.setIndex(f),this.setAttribute("position",new He(_,3)),this.setAttribute("normal",new He(y,3)),this.setAttribute("uv",new He(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ou(t.width,t.height,t.widthSegments,t.heightSegments)}},b1=class lu extends yt{constructor(t=.5,i=1,r=32,a=1,n=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:i,thetaSegments:r,phiSegments:a,thetaStart:n,thetaLength:s},r=Math.max(3,r),a=Math.max(1,a);let o=[],l=[],h=[],c=[],p=t,u=(i-t)/a,f=new x,_=new se;for(let y=0;y<=a;y++){for(let m=0;m<=r;m++){let d=n+m/r*s;f.x=p*Math.cos(d),f.y=p*Math.sin(d),l.push(f.x,f.y,f.z),h.push(0,0,1),_.x=(f.x/i+1)/2,_.y=(f.y/i+1)/2,c.push(_.x,_.y)}p+=u}for(let y=0;y<a;y++){let m=y*(r+1);for(let d=0;d<r;d++){let w=d+m,A=w,v=w+r+1,T=w+r+2,C=w+1;o.push(A,v,C),o.push(v,T,C)}}this.setIndex(o),this.setAttribute("position",new He(l,3)),this.setAttribute("normal",new He(h,3)),this.setAttribute("uv",new He(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new lu(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},S1=class hu extends yt{constructor(t=new Kc([new se(0,.5),new se(-.5,-.5),new se(.5,-.5)]),i=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:i};let r=[],a=[],n=[],s=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let c=0;c<t.length;c++)h(t[c]),this.addGroup(o,l,c),o+=l,l=0;this.setIndex(r),this.setAttribute("position",new He(a,3)),this.setAttribute("normal",new He(n,3)),this.setAttribute("uv",new He(s,2));function h(c){let p=a.length/3,u=c.extractPoints(i),f=u.shape,_=u.holes;jr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,d=_.length;m<d;m++){let w=_[m];jr.isClockWise(w)===!0&&(_[m]=w.reverse())}let y=jr.triangulateShape(f,_);for(let m=0,d=_.length;m<d;m++){let w=_[m];f=f.concat(w)}for(let m=0,d=f.length;m<d;m++){let w=f[m];a.push(w.x,w.y,0),n.push(0,0,1),s.push(w.x,w.y)}for(let m=0,d=y.length;m<d;m++){let w=y[m],A=w[0]+p,v=w[1]+p,T=w[2]+p;r.push(A,v,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),i=this.parameters.shapes;return M1(i,t)}static fromJSON(t,i){let r=[];for(let a=0,n=t.shapes.length;a<n;a++){let s=i[t.shapes[a]];r.push(s)}return new hu(r,t.curveSegments)}};function M1(e,t){if(t.shapes=[],Array.isArray(e))for(let i=0,r=e.length;i<r;i++){let a=e[i];t.shapes.push(a.uuid)}else t.shapes.push(e.uuid);return t}var Ri=class cu extends yt{constructor(t=1,i=32,r=16,a=0,n=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:i,heightSegments:r,phiStart:a,phiLength:n,thetaStart:s,thetaLength:o},i=Math.max(3,Math.floor(i)),r=Math.max(2,Math.floor(r));let l=Math.min(s+o,Math.PI),h=0,c=[],p=new x,u=new x,f=[],_=[],y=[],m=[];for(let d=0;d<=r;d++){let w=[],A=d/r,v=s+A*o,T=t*Math.cos(v),C=Math.sqrt(t*t-T*T),M=0;d===0&&s===0?M=.5/i:d===r&&l===Math.PI&&(M=-.5/i);for(let g=0;g<=i;g++){let b=g/i,I=a+b*n;p.x=-C*Math.cos(I),p.y=T,p.z=C*Math.sin(I),_.push(p.x,p.y,p.z),u.copy(p).normalize(),y.push(u.x,u.y,u.z),m.push(b+M,1-A),w.push(h++)}c.push(w)}for(let d=0;d<r;d++)for(let w=0;w<i;w++){let A=c[d][w+1],v=c[d][w],T=c[d+1][w],C=c[d+1][w+1];(d!==0||s>0)&&f.push(A,v,C),(d!==r-1||l<Math.PI)&&f.push(v,T,C)}this.setIndex(f),this.setAttribute("position",new He(_,3)),this.setAttribute("normal",new He(y,3)),this.setAttribute("uv",new He(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cu(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},E1=class uu extends Pn{constructor(t=1,i=0){let r=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],a=[2,1,0,0,3,2,1,3,0,2,3,1];super(r,a,t,i),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:i}}static fromJSON(t){return new uu(t.radius,t.detail)}},In=class pu extends yt{constructor(t=1,i=.4,r=12,a=48,n=Math.PI*2,s=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:i,radialSegments:r,tubularSegments:a,arc:n,thetaStart:s,thetaLength:o},r=Math.floor(r),a=Math.floor(a);let l=[],h=[],c=[],p=[],u=new x,f=new x,_=new x;for(let y=0;y<=r;y++){let m=s+y/r*o;for(let d=0;d<=a;d++){let w=d/a*n;f.x=(t+i*Math.cos(m))*Math.cos(w),f.y=(t+i*Math.cos(m))*Math.sin(w),f.z=i*Math.sin(m),h.push(f.x,f.y,f.z),u.x=t*Math.cos(w),u.y=t*Math.sin(w),_.subVectors(f,u).normalize(),c.push(_.x,_.y,_.z),p.push(d/a),p.push(y/r)}}for(let y=1;y<=r;y++)for(let m=1;m<=a;m++){let d=(a+1)*y+m-1,w=(a+1)*(y-1)+m-1,A=(a+1)*(y-1)+m,v=(a+1)*y+m;l.push(d,w,v),l.push(w,A,v)}this.setIndex(l),this.setAttribute("position",new He(h,3)),this.setAttribute("normal",new He(c,3)),this.setAttribute("uv",new He(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pu(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},T1=class du extends yt{constructor(t=1,i=.4,r=64,a=8,n=2,s=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:i,tubularSegments:r,radialSegments:a,p:n,q:s},r=Math.floor(r),a=Math.floor(a);let o=[],l=[],h=[],c=[],p=new x,u=new x,f=new x,_=new x,y=new x,m=new x,d=new x;for(let A=0;A<=r;++A){let v=A/r*n*Math.PI*2;w(v,n,s,t,f),w(v+.01,n,s,t,_),m.subVectors(_,f),d.addVectors(_,f),y.crossVectors(m,d),d.crossVectors(y,m),y.normalize(),d.normalize();for(let T=0;T<=a;++T){let C=T/a*Math.PI*2,M=-i*Math.cos(C),g=i*Math.sin(C);p.x=f.x+(M*d.x+g*y.x),p.y=f.y+(M*d.y+g*y.y),p.z=f.z+(M*d.z+g*y.z),l.push(p.x,p.y,p.z),u.subVectors(p,f).normalize(),h.push(u.x,u.y,u.z),c.push(A/r),c.push(T/a)}}for(let A=1;A<=r;A++)for(let v=1;v<=a;v++){let T=(a+1)*(A-1)+(v-1),C=(a+1)*A+(v-1),M=(a+1)*A+v,g=(a+1)*(A-1)+v;o.push(T,C,g),o.push(C,M,g)}this.setIndex(o),this.setAttribute("position",new He(l,3)),this.setAttribute("normal",new He(h,3)),this.setAttribute("uv",new He(c,2));function w(A,v,T,C,M){let g=Math.cos(A),b=Math.sin(A),I=T/v*A,P=Math.cos(I);M.x=C*(2+P)*.5*g,M.y=C*(2+P)*b*.5,M.z=C*Math.sin(I)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new du(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},w1=class fu extends yt{constructor(t=new Zc(new x(-1,-1,0),new x(-1,1,0),new x(1,1,0)),i=64,r=1,a=8,n=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:i,radius:r,radialSegments:a,closed:n};let s=t.computeFrenetFrames(i,n);this.tangents=s.tangents,this.normals=s.normals,this.binormals=s.binormals;let o=new x,l=new x,h=new se,c=new x,p=[],u=[],f=[],_=[];y(),this.setIndex(_),this.setAttribute("position",new He(p,3)),this.setAttribute("normal",new He(u,3)),this.setAttribute("uv",new He(f,2));function y(){for(let A=0;A<i;A++)m(A);m(n===!1?i:0),w(),d()}function m(A){c=t.getPointAt(A/i,c);let v=s.normals[A],T=s.binormals[A];for(let C=0;C<=a;C++){let M=C/a*Math.PI*2,g=Math.sin(M),b=-Math.cos(M);l.x=b*v.x+g*T.x,l.y=b*v.y+g*T.y,l.z=b*v.z+g*T.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=c.x+r*l.x,o.y=c.y+r*l.y,o.z=c.z+r*l.z,p.push(o.x,o.y,o.z)}}function d(){for(let A=1;A<=i;A++)for(let v=1;v<=a;v++){let T=(a+1)*(A-1)+(v-1),C=(a+1)*A+(v-1),M=(a+1)*A+v,g=(a+1)*(A-1)+v;_.push(T,C,g),_.push(C,M,g)}}function w(){for(let A=0;A<=i;A++)for(let v=0;v<=a;v++)h.x=A/i,h.y=v/a,f.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new fu(new Fs[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},A1=class extends yt{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,r=new x,a=new x;if(e.index!==null){let n=e.attributes.position,s=e.index,o=e.groups;o.length===0&&(o=[{start:0,count:s.count,materialIndex:0}]);for(let l=0,h=o.length;l<h;++l){let c=o[l],p=c.start,u=c.count;for(let f=p,_=p+u;f<_;f+=3)for(let y=0;y<3;y++){let m=s.getX(f+y),d=s.getX(f+(y+1)%3);r.fromBufferAttribute(n,m),a.fromBufferAttribute(n,d),Th(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}}else{let n=e.attributes.position;for(let s=0,o=n.count/3;s<o;s++)for(let l=0;l<3;l++){let h=3*s+l,c=3*s+(l+1)%3;r.fromBufferAttribute(n,h),a.fromBufferAttribute(n,c),Th(r,a,i)===!0&&(t.push(r.x,r.y,r.z),t.push(a.x,a.y,a.z))}}this.setAttribute("position",new He(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Th(e,t,i){let r=`${e.x},${e.y},${e.z}-${t.x},${t.y},${t.z}`,a=`${t.x},${t.y},${t.z}-${e.x},${e.y},${e.z}`;return i.has(r)===!0||i.has(a)===!0?!1:(i.add(r),i.add(a),!0)}var tv=Object.freeze({__proto__:null,BoxGeometry:wt,CapsuleGeometry:Od,CircleGeometry:Cn,ConeGeometry:ks,CylinderGeometry:Mr,DodecahedronGeometry:Fd,EdgesGeometry:Bd,ExtrudeGeometry:m1,IcosahedronGeometry:v1,LatheGeometry:x1,OctahedronGeometry:y1,PlaneGeometry:or,PolyhedronGeometry:Pn,RingGeometry:b1,ShapeGeometry:S1,SphereGeometry:Ri,TetrahedronGeometry:E1,TorusGeometry:In,TorusKnotGeometry:T1,TubeGeometry:w1,WireframeGeometry:A1});function ka(e){let t={};for(let i in e){t[i]={};for(let r in e[i]){let a=e[i][r];if(wh(a))a.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][r]=null):t[i][r]=a.clone();else if(Array.isArray(a))if(wh(a[0])){let n=[];for(let s=0,o=a.length;s<o;s++)n[s]=a[s].clone();t[i][r]=n}else t[i][r]=a.slice();else t[i][r]=a}}return t}function Qt(e){let t={};for(let i=0;i<e.length;i++){let r=ka(e[i]);for(let a in r)t[a]=r[a]}return t}function wh(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function R1(e){let t=[];for(let i=0;i<e.length;i++)t.push(e[i].clone());return t}function mu(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ot.workingColorSpace}var C1={clone:ka,merge:Qt},P1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,I1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Gi=class extends sr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=P1,this.fragmentShader=I1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ka(e.uniforms),this.uniformsGroups=R1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Oe().setHex(r.value);break;case"v2":this.uniforms[i].value=new se().fromArray(r.value);break;case"v3":this.uniforms[i].value=new x().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Mt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Qe().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Ke().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},L1=class extends Gi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},e0=class extends sr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bn,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var $r=class extends sr{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Oe(16777215),this.specular=new Oe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bn,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=Bs,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var It=class extends sr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bn,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mi,this.combine=Bs,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},D1=class extends sr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Dp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},U1=class extends sr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT=="number"?new t(e):Array.prototype.slice.call(e)}function Vo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ln=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],a=t[i-1];i:{e:{let n;t:{r:if(!(e<r)){for(let s=i+2;;){if(r===void 0){if(e<a)break r;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===s)break;if(a=r,r=t[++i],e<r)break e}n=t.length;break t}if(!(e>=a)){let s=t[1];e<s&&(i=2,a=s);for(let o=i-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===o)break;if(r=a,a=t[--i-1],e>=a)break e}n=i,i=0;break t}break i}for(;i<n;){let s=i+n>>>1;e<t[s]?n=s:i=s+1}if(r=t[i],a=t[i-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,a,r)}return this.interpolate_(i,a,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,a=e*r;for(let n=0;n!==r;++n)t[n]=i[a+n];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},N1=class extends Ln{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:k0,endingEnd:k0}}intervalChanged_(e,t,i){let r=this.parameterPositions,a=e-2,n=e+1,s=r[a],o=r[n];if(s===void 0)switch(this.getSettings_().endingStart){case W0:a=e,s=2*t-i;break;case j0:a=r.length-2,s=t+r[a]-r[a+1];break;default:a=e,s=i}if(o===void 0)switch(this.getSettings_().endingEnd){case W0:n=e,o=2*i-t;break;case j0:n=1,o=i+r[1]-r[0];break;default:n=e-1,o=t}let l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-s),this._weightNext=l/(o-i),this._offsetPrev=a*h,this._offsetNext=n*h}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this._offsetPrev,c=this._offsetNext,p=this._weightPrev,u=this._weightNext,f=(i-t)/(r-t),_=f*f,y=_*f,m=-p*y+2*p*_-p*f,d=(1+p)*y+(-1.5-2*p)*_+(-.5+p)*f+1,w=(-1-u)*y+(1.5+u)*_+.5*f,A=u*y-u*_;for(let v=0;v!==s;++v)a[v]=m*n[h+v]+d*n[l+v]+w*n[o+v]+A*n[c+v];return a}},O1=class extends Ln{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=(i-t)/(r-t),c=1-h;for(let p=0;p!==s;++p)a[p]=n[l+p]*c+n[o+p]*h;return a}},F1=class extends Ln{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},B1=class extends Ln{interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=e*s,l=o-s,h=this.inTangents,c=this.outTangents;if(!h||!c){let f=(i-t)/(r-t),_=1-f;for(let y=0;y!==s;++y)a[y]=n[l+y]*_+n[o+y]*f;return a}let p=s*2,u=e-1;for(let f=0;f!==s;++f){let _=n[l+f],y=n[o+f],m=u*p+f*2,d=c[m],w=c[m+1],A=e*p+f*2,v=h[A],T=h[A+1],C=H1(i,t,d,v,r);a[f]=gu(C,_,w,T,y)}return a}};function gu(e,t,i,r,a){let n=1-e;return n*n*n*t+3*n*n*e*i+3*n*e*e*r+e*e*e*a}function z1(e,t,i,r,a){let n=1-e;return 3*n*n*(i-t)+6*n*e*(r-i)+3*e*e*(a-r)}function H1(e,t,i,r,a){let n=(e-t)/(a-t);for(let s=0;s<8;s++){let o=gu(n,t,i,r,a)-e;if(Math.abs(o)<1e-10)break;let l=z1(n,t,i,r,a);if(Math.abs(l)<1e-10)break;n=Math.max(0,Math.min(1,n-o/l))}return n}var ji=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wa(t,this.TimeBufferType),this.values=wa(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:wa(e.times,Array),values:wa(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),Vo(e.settings)&&(i.settings={inTangents:wa(e.settings.inTangents,Array),outTangents:wa(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new F1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new O1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new N1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new B1(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ls:t=this.InterpolantFactoryMethodDiscrete;break;case Dl:t=this.InterpolantFactoryMethodLinear;break;case fo:t=this.InterpolantFactoryMethodSmooth;break;case G0:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return qe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ls;case this.InterpolantFactoryMethodLinear:return Dl;case this.InterpolantFactoryMethodSmooth:return fo;case this.InterpolantFactoryMethodBezier:return G0}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;Vo(this.settings)&&(Ah(this.settings.inTangents,e),Ah(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,a=0,n=r-1;for(;a!==r&&i[a]<e;)++a;for(;n!==-1&&i[n]>t;)--n;if(++n,a!==0||n!==r){a>=n&&(n=Math.max(n,1),a=n-1);let s=this.getValueSize();this.times=i.slice(a,n),this.values=this.values.slice(a*s,n*s)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ye("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,a=i.length;a===0&&(Ye("KeyframeTrack: Track is empty.",this),e=!1);let n=null;for(let s=0;s!==a;s++){let o=i[s];if(typeof o=="number"&&isNaN(o)){Ye("KeyframeTrack: Time is not a valid number.",this,s,o),e=!1;break}if(n!==null&&n>o){Ye("KeyframeTrack: Out of order keys.",this,s,o,n),e=!1;break}n=o}if(r!==void 0&&kp(r))for(let s=0,o=r.length;s!==o;++s){let l=r[s];if(isNaN(l)){Ye("KeyframeTrack: Value is not a valid number.",this,s,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===fo,a=e.length-1,n=1;for(let s=1;s<a;++s){let o=!1,l=e[s],h=e[s+1];if(l!==h&&(s!==1||l!==e[0]))if(r)o=!0;else{let c=s*i,p=c-i,u=c+i;for(let f=0;f!==i;++f){let _=t[c+f];if(_!==t[p+f]||_!==t[u+f]){o=!0;break}}}if(o){if(s!==n){e[n]=e[s];let c=s*i,p=n*i;for(let u=0;u!==i;++u)t[p+u]=t[c+u]}++n}}if(a>0){e[n]=e[a];for(let s=a*i,o=n*i,l=0;l!==i;++l)t[o+l]=t[s+l];++n}return n!==e.length?(this.times=e.slice(0,n),this.values=t.slice(0,n*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,Vo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ah(e,t){for(let i=0,r=e.length;i!==r;i+=2)e[i]*=t}ji.prototype.ValueTypeName="";ji.prototype.TimeBufferType=Float32Array;ji.prototype.ValueBufferType=Float32Array;ji.prototype.DefaultInterpolation=Dl;var Dn=class extends ji{constructor(e,t,i){super(e,t,i)}};Dn.prototype.ValueTypeName="bool";Dn.prototype.ValueBufferType=Array;Dn.prototype.DefaultInterpolation=Ls;Dn.prototype.InterpolantFactoryMethodLinear=void 0;Dn.prototype.InterpolantFactoryMethodSmooth=void 0;var V1=class extends ji{constructor(e,t,i,r){super(e,t,i,r)}};V1.prototype.ValueTypeName="color";var G1=class extends ji{constructor(e,t,i,r){super(e,t,i,r)}};G1.prototype.ValueTypeName="number";var k1=class extends Ln{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let a=this.resultBuffer,n=this.sampleValues,s=this.valueSize,o=(i-t)/(r-t),l=e*s;for(let h=l+s;l!==h;l+=4)ti.slerpFlat(a,0,n,l-s,n,l,o);return a}},_u=class extends ji{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new k1(this.times,this.values,this.getValueSize(),e)}};_u.prototype.ValueTypeName="quaternion";_u.prototype.InterpolantFactoryMethodSmooth=void 0;var Un=class extends ji{constructor(e,t,i){super(e,t,i)}};Un.prototype.ValueTypeName="string";Un.prototype.ValueBufferType=Array;Un.prototype.DefaultInterpolation=Ls;Un.prototype.InterpolantFactoryMethodLinear=void 0;Un.prototype.InterpolantFactoryMethodSmooth=void 0;var W1=class extends ji{constructor(e,t,i,r){super(e,t,i,r)}};W1.prototype.ValueTypeName="vector";var j1=class{constructor(e,t,i){let r=this,a=!1,n=0,s=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){s++,a===!1&&r.onStart!==void 0&&r.onStart(h,n,s),a=!0},this.itemEnd=function(h){n++,r.onProgress!==void 0&&r.onProgress(h,n,s),n===s&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),o?o(h):h},this.setURLModifier=function(h){return o=h,this},this.addHandler=function(h,c){return l.push(h,c),this},this.removeHandler=function(h){let c=l.indexOf(h);return c!==-1&&l.splice(c,2),this},this.getHandler=function(h){for(let c=0,p=l.length;c<p;c+=2){let u=l[c],f=l[c+1];if(u.global&&(u.lastIndex=0),u.test(h))return f}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},q1=new j1,X1=class{constructor(e){this.manager=e!==void 0?e:q1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,a){i.load(e,r,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};X1.DEFAULT_MATERIAL_NAME="__DEFAULT";var t0=class extends ei{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Nn=class extends t0{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ei.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Go=new Ke,Rh=new x,Ch=new x,vu=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.mapType=hi,this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Va,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Rh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Rh),Ch.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ch),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,r){Go.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Go,e.coordinateSystem,e.reversedDepth);let a=this._frameExtents,n=r?r.z/a.x:1,s=r?r.w/a.y:1,o=r?r.x/a.x:0,l=r?r.y/a.y:0;e.coordinateSystem===Sn||e.reversedDepth?t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,1,0,0,0,0,1):t.set(.5*n,0,0,.5*n+o,0,.5*s,0,.5*s+l,0,0,.5,.5,0,0,0,1),t.multiply(Go)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},xs=new x,ys=new ti,Ui=new x,i0=class extends ei{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=Ti,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(xs,ys,Ui),Ui.x===1&&Ui.y===1&&Ui.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(xs,ys,Ui.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(xs,ys,Ui),Ui.x===1&&Ui.y===1&&Ui.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(xs,ys,Ui.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xr=new x,Ph=new se,Ih=new se,Xt=class extends i0{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Mn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Fa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Mn*2*Math.atan(Math.tan(Fa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){xr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xr.x,xr.y).multiplyScalar(-e/xr.z),xr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xr.x,xr.y).multiplyScalar(-e/xr.z)}getViewSize(e,t){return this.getViewBounds(e,Ph,Ih),t.subVectors(Ih,Ph)}setViewOffset(e,t,i,r,a,n){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Fa*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,a=-.5*r,n=this.view;if(this.view!==null&&this.view.enabled){let o=n.fullWidth,l=n.fullHeight;a+=n.offsetX*r/o,t-=n.offsetY*i/l,r*=n.width/o,i*=n.height/l}let s=this.filmOffset;s!==0&&(a+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Y1=class extends vu{constructor(){super(new Xt(90,1,.5,500)),this.isPointLightShadow=!0}},xu=class extends t0{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new Y1}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},r0=class extends i0{constructor(e=-1,t=1,i=1,r=-1,a=.1,n=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=a,this.far=n,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,a,n){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=n,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,a=i-e,n=i+e,s=r+t,o=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,n=a+l*this.view.width,s-=h*this.view.offsetY,o=s-h*this.view.height}this.projectionMatrix.makeOrthographic(a,n,s,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Z1=class extends vu{constructor(){super(new r0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Er=class extends t0{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ei.DEFAULT_UP),this.updateMatrix(),this.target=new ei,this.shadow=new Z1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var iv=new Ke,rv=new Ke,av=new Ke;var Aa=-90,Ra=1,J1=class extends ei{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Xt(Aa,Ra,e,t);r.layers=this.layers,this.add(r);let a=new Xt(Aa,Ra,e,t);a.layers=this.layers,this.add(a);let n=new Xt(Aa,Ra,e,t);n.layers=this.layers,this.add(n);let s=new Xt(Aa,Ra,e,t);s.layers=this.layers,this.add(s);let o=new Xt(Aa,Ra,e,t);o.layers=this.layers,this.add(o);let l=new Xt(Aa,Ra,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,a,n,s,o]=t;for(let l of t)this.remove(l);if(e===Ti)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),n.up.set(0,0,1),n.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===Sn)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),n.up.set(0,0,-1),n.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,n,s,o,l,h]=this.children,c=e.getRenderTarget(),p=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),f=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let y=!1;e.isWebGLRenderer===!0?y=e.state.buffers.depth.getReversed():y=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,1,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,n),e.setRenderTarget(i,2,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,3,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,4,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(c,p,u),e.xr.enabled=f,i.texture.needsPMREMUpdate=!0}},K1=class extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var nv=new x,sv=new ti,ov=new x,lv=new x,hv=new x;var cv=new x,uv=new ti,pv=new x,dv=new x;var a0="\\[\\]\\.:\\/",$1=new RegExp("["+a0+"]","g"),n0="[^"+a0+"]",Q1="[^"+a0.replace("\\.","")+"]",ef=/((?:WC+[\/:])*)/.source.replace("WC",n0),tf=/(WCOD+)?/.source.replace("WCOD",Q1),rf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",n0),af=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",n0),nf=new RegExp("^"+ef+tf+rf+af+"$"),sf=["material","materials","bones","map"],of=class{constructor(e,t,i){let r=i||Ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,a=i.length;r!==a;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Ct=class La{constructor(t,i,r){this.path=i,this.parsedPath=r||La.parseTrackName(i),this.node=La.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,i,r){return t&&t.isAnimationObjectGroup?new La.Composite(t,i,r):new La(t,i,r)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace($1,"")}static parseTrackName(t){let i=nf.exec(t);if(i===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let r={nodeName:i[2],objectName:i[3],objectIndex:i[4],propertyName:i[5],propertyIndex:i[6]},a=r.nodeName&&r.nodeName.lastIndexOf(".");if(a!==void 0&&a!==-1){let n=r.nodeName.substring(a+1);sf.indexOf(n)!==-1&&(r.nodeName=r.nodeName.substring(0,a),r.objectName=n)}if(r.propertyName===null||r.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return r}static findNode(t,i){if(i===void 0||i===""||i==="."||i===-1||i===t.name||i===t.uuid)return t;if(t.skeleton){let r=t.skeleton.getBoneByName(i);if(r!==void 0)return r}if(t.children){let r=function(n){for(let s=0;s<n.length;s++){let o=n[s];if(o.name===i||o.uuid===i)return o;let l=r(o.children);if(l)return l}return null},a=r(t.children);if(a)return a}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,i){t[i]=this.targetObject[this.propertyName]}_getValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)t[i++]=r[a]}_getValue_arrayElement(t,i){t[i]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,i){this.resolvedProperty.toArray(t,i)}_setValue_direct(t,i){this.targetObject[this.propertyName]=t[i]}_setValue_direct_setNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,i){this.targetObject[this.propertyName]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++]}_setValue_array_setNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,i){let r=this.resolvedProperty;for(let a=0,n=r.length;a!==n;++a)r[a]=t[i++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,i){this.resolvedProperty[this.propertyIndex]=t[i]}_setValue_arrayElement_setNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty[this.propertyIndex]=t[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,i){this.resolvedProperty.fromArray(t,i)}_setValue_fromArray_setNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,i){this.resolvedProperty.fromArray(t,i),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,i){this.bind(),this.getValue(t,i)}_setValue_unbound(t,i){this.bind(),this.setValue(t,i)}bind(){let t=this.node,i=this.parsedPath,r=i.objectName,a=i.propertyName,n=i.propertyIndex;if(t||(t=La.findNode(this.rootNode,i.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){qe("PropertyBinding: No target node found for track: "+this.path+".");return}if(r){let h=i.objectIndex;switch(r){case"materials":if(!t.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ye("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ye("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===h){h=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ye("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[r]===void 0){Ye("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[r]}if(h!==void 0){if(t[h]===void 0){Ye("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let s=t[a];if(s===void 0){let h=i.nodeName;Ye("PropertyBinding: Trying to update property for track: "+h+"."+a+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(a==="morphTargetInfluences"){if(!t.geometry){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[n]!==void 0&&(n=t.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=n}else s.fromArray!==void 0&&s.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=a;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ct.Composite=of;Ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ct.prototype.GetterByBindingType=[Ct.prototype._getValue_direct,Ct.prototype._getValue_array,Ct.prototype._getValue_arrayElement,Ct.prototype._getValue_toArray];Ct.prototype.SetterByBindingTypeAndVersioning=[[Ct.prototype._setValue_direct,Ct.prototype._setValue_direct_setNeedsUpdate,Ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_array,Ct.prototype._setValue_array_setNeedsUpdate,Ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_arrayElement,Ct.prototype._setValue_arrayElement_setNeedsUpdate,Ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ct.prototype._setValue_fromArray,Ct.prototype._setValue_fromArray_setNeedsUpdate,Ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var fv=new Float32Array(1);var mv=new Ke;var gv=class yu{static{yu.prototype.isMatrix2=!0}constructor(t,i,r,a){this.elements=[1,0,0,1],t!==void 0&&this.set(t,i,r,a)}identity(){return this.set(1,0,0,1),this}fromArray(t,i=0){for(let r=0;r<4;r++)this.elements[r]=t[r+i];return this}set(t,i,r,a){let n=this.elements;return n[0]=t,n[2]=i,n[1]=r,n[3]=a,this}},_v=new se;var vv=new x,xv=new x,yv=new x,bv=new x,Sv=new x,Mv=new x,Ev=new x;var Tv=new x;var wv=new x,Av=new Ke,Rv=new Ke;var Cv=new x,Pv=new Oe,Iv=new Oe;var Lv=new x,Dv=new x,Uv=new x;var Nv=new x,Ov=new i0;var Fv=new ui;var Bv=new x;function Lh(e,t,i,r){let a=lf(r);switch(i){case mc:return e*t;case kl:return e*t/a.components*a.byteLength;case Wl:return e*t/a.components*a.byteLength;case Zr:return e*t*2/a.components*a.byteLength;case jl:return e*t*2/a.components*a.byteLength;case gc:return e*t*3/a.components*a.byteLength;case Ei:return e*t*4/a.components*a.byteLength;case ql:return e*t*4/a.components*a.byteLength;case Ms:case Es:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ts:case ws:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case al:case sl:return Math.max(e,16)*Math.max(t,8)/4;case rl:case nl:return Math.max(e,8)*Math.max(t,8)/2;case ol:case ll:case cl:case ul:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case hl:case Ps:case pl:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case dl:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fl:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ml:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case gl:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case _l:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case vl:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case xl:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case yl:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case bl:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Sl:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ml:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case El:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Tl:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case wl:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Al:case Rl:case Cl:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Pl:case Il:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Is:case Ll:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function lf(e){switch(e){case hi:case uc:return{byteLength:1,components:1};case xn:case pc:case Vi:return{byteLength:2,components:1};case Vl:case Gl:return{byteLength:2,components:4};case Hi:case Hl:case Mi:return{byteLength:4,components:1};case dc:case fc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function bu(){let e=null,t=!1,i=null,r=null;function a(n,s){r=e.requestAnimationFrame(a),i(n,s)}return{start:function(){t!==!0&&i!==null&&e!==null&&(r=e.requestAnimationFrame(a),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(n){i=n},setContext:function(n){e=n}}}function hf(e){let t=new WeakMap;function i(o,l){let h=o.array,c=o.usage,p=h.byteLength,u=e.createBuffer();e.bindBuffer(l,u),e.bufferData(l,h,c),o.onUploadCallback();let f;if(h instanceof Float32Array)f=e.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)f=e.HALF_FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?f=e.HALF_FLOAT:f=e.UNSIGNED_SHORT;else if(h instanceof Int16Array)f=e.SHORT;else if(h instanceof Uint32Array)f=e.UNSIGNED_INT;else if(h instanceof Int32Array)f=e.INT;else if(h instanceof Int8Array)f=e.BYTE;else if(h instanceof Uint8Array)f=e.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)f=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:u,type:f,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:p}}function r(o,l,h){let c=l.array,p=l.updateRanges;if(e.bindBuffer(h,o),p.length===0)e.bufferSubData(h,0,c);else{p.sort((f,_)=>f.start-_.start);let u=0;for(let f=1;f<p.length;f++){let _=p[u],y=p[f];y.start<=_.start+_.count+1?_.count=Math.max(_.count,y.start+y.count-_.start):(++u,p[u]=y)}p.length=u+1;for(let f=0,_=p.length;f<_;f++){let y=p[f];e.bufferSubData(h,y.start*c.BYTES_PER_ELEMENT,c,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(e.deleteBuffer(l.buffer),t.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let c=t.get(o);(!c||c.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let h=t.get(o);if(h===void 0)t.set(o,i(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,o,l),h.version=o.version}}return{get:a,remove:n,update:s}}var cf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,pf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,df=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ff=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_f=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,xf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Mf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ef=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Pf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,If=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Df=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Uf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Nf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Of=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ff=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,kf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$f=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,em=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,im=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,am=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,om=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,um=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,dm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_m=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ym=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Em=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Am=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Im=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Dm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Um=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Om=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Hm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ym=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Zm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Km=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,$m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,e2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,t2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,i2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,r2=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,a2=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,n2=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,s2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,o2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,l2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,h2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,c2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u2=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,d2=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,v2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,x2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,y2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,b2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,M2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,E2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,T2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,C2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,I2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,L2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,N2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,O2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,F2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,z2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,H2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,V2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,G2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,k2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:cf,alphahash_pars_fragment:uf,alphamap_fragment:pf,alphamap_pars_fragment:df,alphatest_fragment:ff,alphatest_pars_fragment:mf,aomap_fragment:gf,aomap_pars_fragment:_f,batching_pars_vertex:vf,batching_vertex:xf,begin_vertex:yf,beginnormal_vertex:bf,bsdfs:Sf,iridescence_fragment:Mf,bumpmap_pars_fragment:Ef,clipping_planes_fragment:Tf,clipping_planes_pars_fragment:wf,clipping_planes_pars_vertex:Af,clipping_planes_vertex:Rf,color_fragment:Cf,color_pars_fragment:Pf,color_pars_vertex:If,color_vertex:Lf,common:Df,cube_uv_reflection_fragment:Uf,defaultnormal_vertex:Nf,displacementmap_pars_vertex:Of,displacementmap_vertex:Ff,emissivemap_fragment:Bf,emissivemap_pars_fragment:zf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Gf,envmap_common_pars_fragment:kf,envmap_pars_fragment:Wf,envmap_pars_vertex:jf,envmap_physical_pars_fragment:im,envmap_vertex:qf,fog_vertex:Xf,fog_pars_vertex:Yf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Kf,lightmap_pars_fragment:$f,lights_lambert_fragment:Qf,lights_lambert_pars_fragment:em,lights_pars_begin:tm,lights_toon_fragment:rm,lights_toon_pars_fragment:am,lights_phong_fragment:nm,lights_phong_pars_fragment:sm,lights_physical_fragment:om,lights_physical_pars_fragment:lm,lights_fragment_begin:hm,lights_fragment_maps:cm,lights_fragment_end:um,lightprobes_pars_fragment:pm,logdepthbuf_fragment:dm,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:mm,logdepthbuf_vertex:gm,map_fragment:_m,map_pars_fragment:vm,map_particle_fragment:xm,map_particle_pars_fragment:ym,metalnessmap_fragment:bm,metalnessmap_pars_fragment:Sm,morphinstance_vertex:Mm,morphcolor_vertex:Em,morphnormal_vertex:Tm,morphtarget_pars_vertex:wm,morphtarget_vertex:Am,normal_fragment_begin:Rm,normal_fragment_maps:Cm,normal_pars_fragment:Pm,normal_pars_vertex:Im,normal_vertex:Lm,normalmap_pars_fragment:Dm,clearcoat_normal_fragment_begin:Um,clearcoat_normal_fragment_maps:Nm,clearcoat_pars_fragment:Om,iridescence_pars_fragment:Fm,opaque_fragment:Bm,packing:zm,premultiplied_alpha_fragment:Hm,project_vertex:Vm,dithering_fragment:Gm,dithering_pars_fragment:km,roughnessmap_fragment:Wm,roughnessmap_pars_fragment:jm,shadowmap_pars_fragment:qm,shadowmap_pars_vertex:Xm,shadowmap_vertex:Ym,shadowmask_pars_fragment:Zm,skinbase_vertex:Jm,skinning_pars_vertex:Km,skinning_vertex:$m,skinnormal_vertex:Qm,specularmap_fragment:e2,specularmap_pars_fragment:t2,tonemapping_fragment:i2,tonemapping_pars_fragment:r2,transmission_fragment:a2,transmission_pars_fragment:n2,uv_pars_fragment:s2,uv_pars_vertex:o2,uv_vertex:l2,worldpos_vertex:h2,background_vert:c2,background_frag:u2,backgroundCube_vert:p2,backgroundCube_frag:d2,cube_vert:f2,cube_frag:m2,depth_vert:g2,depth_frag:_2,distance_vert:v2,distance_frag:x2,equirect_vert:y2,equirect_frag:b2,linedashed_vert:S2,linedashed_frag:M2,meshbasic_vert:E2,meshbasic_frag:T2,meshlambert_vert:w2,meshlambert_frag:A2,meshmatcap_vert:R2,meshmatcap_frag:C2,meshnormal_vert:P2,meshnormal_frag:I2,meshphong_vert:L2,meshphong_frag:D2,meshphysical_vert:U2,meshphysical_frag:N2,meshtoon_vert:O2,meshtoon_frag:F2,points_vert:B2,points_frag:z2,shadow_vert:H2,shadow_frag:V2,sprite_vert:G2,sprite_frag:k2},_e={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qe}},envmap:{envMap:{value:null},envMapRotation:{value:new Qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qe},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new x},probesMax:{value:new x},probesResolution:{value:new x}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0},uvTransform:{value:new Qe}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qe},alphaMap:{value:null},alphaMapTransform:{value:new Qe},alphaTest:{value:0}}},Oi={basic:{uniforms:Qt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:Qt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)},envMapIntensity:{value:1}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:Qt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:Qt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:Qt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Oe(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:Qt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:Qt([_e.points,_e.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:Qt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:Qt([_e.common,_e.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:Qt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:Qt([_e.sprite,_e.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new Qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qe}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distance:{uniforms:Qt([_e.common,_e.displacementmap,{referencePosition:{value:new x},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distance_vert,fragmentShader:et.distance_frag},shadow:{uniforms:Qt([_e.lights,_e.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};Oi.physical={uniforms:Qt([Oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qe},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qe},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qe},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qe},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qe},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qe}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};var bs={r:0,b:0,g:0},W2=new Ke,Su=new Qe;Su.set(-1,0,0,0,1,0,0,0,1);function j2(e,t,i,r,a,n){let s=new Oe(0),o=a===!0?0:1,l,h,c=null,p=0,u=null;function f(w){let A=w.isScene===!0?w.background:null;if(A&&A.isTexture){let v=w.backgroundBlurriness>0;A=t.get(A,v)}return A}function _(w){let A=!1,v=f(w);v===null?m(s,o):v&&v.isColor&&(m(v,1),A=!0);let T=e.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,n):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,n),(e.autoClear||A)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function y(w,A){let v=f(A);v&&(v.isCubeTexture||v.mapping===zs)?(h===void 0&&(h=new ke(new wt(1,1,1),new Gi({name:"BackgroundCubeMaterial",uniforms:ka(Oi.backgroundCube.uniforms),vertexShader:Oi.backgroundCube.vertexShader,fragmentShader:Oi.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,C,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(W2.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(Su),h.material.toneMapped=ot.getTransfer(v.colorSpace)!==ft,(c!==v||p!==v.version||u!==e.toneMapping)&&(h.material.needsUpdate=!0,c=v,p=v.version,u=e.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ke(new or(2,2),new Gi({name:"BackgroundMaterial",uniforms:ka(Oi.background.uniforms),vertexShader:Oi.background.vertexShader,fragmentShader:Oi.background.fragmentShader,side:qr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=ot.getTransfer(v.colorSpace)!==ft,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(c!==v||p!==v.version||u!==e.toneMapping)&&(l.material.needsUpdate=!0,c=v,p=v.version,u=e.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function m(w,A){w.getRGB(bs,mu(e)),i.buffers.color.setClear(bs.r,bs.g,bs.b,A,n)}function d(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(w,A=1){s.set(w),o=A,m(s,o)},getClearAlpha:function(){return o},setClearAlpha:function(w){o=w,m(s,o)},render:_,addToRenderList:y,dispose:d}}function q2(e,t){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},a=u(null),n=a,s=!1;function o(P,L,V,D,H){let J=!1,j=p(P,D,V,L);n!==j&&(n=j,h(n.object)),J=f(P,D,V,H),J&&_(P,D,V,H),H!==null&&t.update(H,e.ELEMENT_ARRAY_BUFFER),(J||s)&&(s=!1,v(P,L,V,D),H!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return e.createVertexArray()}function h(P){return e.bindVertexArray(P)}function c(P){return e.deleteVertexArray(P)}function p(P,L,V,D){let H=D.wireframe===!0,J=r[L.id];J===void 0&&(J={},r[L.id]=J);let j=P.isInstancedMesh===!0?P.id:0,ue=J[j];ue===void 0&&(ue={},J[j]=ue);let Z=ue[V.id];Z===void 0&&(Z={},ue[V.id]=Z);let K=Z[H];return K===void 0&&(K=u(l()),Z[H]=K),K}function u(P){let L=[],V=[],D=[];for(let H=0;H<i;H++)L[H]=0,V[H]=0,D[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:V,attributeDivisors:D,object:P,attributes:{},index:null}}function f(P,L,V,D){let H=n.attributes,J=L.attributes,j=0,ue=V.getAttributes();for(let Z in ue)if(ue[Z].location>=0){let K=H[Z],te=J[Z];if(te===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(te=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(te=P.instanceColor)),K===void 0||K.attribute!==te||te&&K.data!==te.data)return!0;j++}return n.attributesNum!==j||n.index!==D}function _(P,L,V,D){let H={},J=L.attributes,j=0,ue=V.getAttributes();for(let Z in ue)if(ue[Z].location>=0){let K=J[Z];K===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(K=P.instanceColor));let te={};te.attribute=K,K&&K.data&&(te.data=K.data),H[Z]=te,j++}n.attributes=H,n.attributesNum=j,n.index=D}function y(){let P=n.newAttributes;for(let L=0,V=P.length;L<V;L++)P[L]=0}function m(P){d(P,0)}function d(P,L){let V=n.newAttributes,D=n.enabledAttributes,H=n.attributeDivisors;V[P]=1,D[P]===0&&(e.enableVertexAttribArray(P),D[P]=1),H[P]!==L&&(e.vertexAttribDivisor(P,L),H[P]=L)}function w(){let P=n.newAttributes,L=n.enabledAttributes;for(let V=0,D=L.length;V<D;V++)L[V]!==P[V]&&(e.disableVertexAttribArray(V),L[V]=0)}function A(P,L,V,D,H,J,j){j===!0?e.vertexAttribIPointer(P,L,V,H,J):e.vertexAttribPointer(P,L,V,D,H,J)}function v(P,L,V,D){y();let H=D.attributes,J=V.getAttributes(),j=L.defaultAttributeValues;for(let ue in J){let Z=J[ue];if(Z.location>=0){let K=H[ue];if(K===void 0&&(ue==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),ue==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){let te=K.normalized,Ve=K.itemSize,Ce=t.get(K);if(Ce===void 0)continue;let ut=Ce.buffer,be=Ce.type,k=Ce.bytesPerElement,$=be===e.INT||be===e.UNSIGNED_INT||K.gpuType===Hl;if(K.isInterleavedBufferAttribute){let ne=K.data,Le=ne.stride,We=K.offset;if(ne.isInstancedInterleavedBuffer){for(let me=0;me<Z.locationSize;me++)d(Z.location+me,ne.meshPerAttribute);P.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let me=0;me<Z.locationSize;me++)m(Z.location+me);e.bindBuffer(e.ARRAY_BUFFER,ut);for(let me=0;me<Z.locationSize;me++)A(Z.location+me,Ve/Z.locationSize,be,te,Le*k,(We+Ve/Z.locationSize*me)*k,$)}else{if(K.isInstancedBufferAttribute){for(let ne=0;ne<Z.locationSize;ne++)d(Z.location+ne,K.meshPerAttribute);P.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ne=0;ne<Z.locationSize;ne++)m(Z.location+ne);e.bindBuffer(e.ARRAY_BUFFER,ut);for(let ne=0;ne<Z.locationSize;ne++)A(Z.location+ne,Ve/Z.locationSize,be,te,Ve*k,Ve/Z.locationSize*ne*k,$)}}else if(j!==void 0){let te=j[ue];if(te!==void 0)switch(te.length){case 2:e.vertexAttrib2fv(Z.location,te);break;case 3:e.vertexAttrib3fv(Z.location,te);break;case 4:e.vertexAttrib4fv(Z.location,te);break;default:e.vertexAttrib1fv(Z.location,te)}}}}w()}function T(){b();for(let P in r){let L=r[P];for(let V in L){let D=L[V];for(let H in D){let J=D[H];for(let j in J)c(J[j].object),delete J[j];delete D[H]}}delete r[P]}}function C(P){if(r[P.id]===void 0)return;let L=r[P.id];for(let V in L){let D=L[V];for(let H in D){let J=D[H];for(let j in J)c(J[j].object),delete J[j];delete D[H]}}delete r[P.id]}function M(P){for(let L in r){let V=r[L];for(let D in V){let H=V[D];if(H[P.id]===void 0)continue;let J=H[P.id];for(let j in J)c(J[j].object),delete J[j];delete H[P.id]}}}function g(P){for(let L in r){let V=r[L],D=P.isInstancedMesh===!0?P.id:0,H=V[D];if(H!==void 0){for(let J in H){let j=H[J];for(let ue in j)c(j[ue].object),delete j[ue];delete H[J]}delete V[D],Object.keys(V).length===0&&delete r[L]}}}function b(){I(),s=!0,n!==a&&(n=a,h(n.object))}function I(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:b,resetDefaultState:I,dispose:T,releaseStatesOfGeometry:C,releaseStatesOfObject:g,releaseStatesOfProgram:M,initAttributes:y,enableAttribute:m,disableUnusedAttributes:w}}function X2(e,t,i){let r;function a(l){r=l}function n(l,h){e.drawArrays(r,l,h),i.update(h,r,1)}function s(l,h,c){c!==0&&(e.drawArraysInstanced(r,l,h,c),i.update(h,r,c))}function o(l,h,c){if(c===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,l,0,h,0,c);let p=0;for(let u=0;u<c;u++)p+=h[u];i.update(p,r,1)}this.setMode=a,this.render=n,this.renderInstances=s,this.renderMultiDraw=o}function Y2(e,t,i,r){let a;function n(){if(a!==void 0)return a;if(t.has("EXT_texture_filter_anisotropic")===!0){let M=t.get("EXT_texture_filter_anisotropic");a=e.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(M){return!(M!==Ei&&r.convert(M)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(M){let g=M===Vi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(M!==hi&&M!==Mi&&!g&&r.convert(M)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function l(M){if(M==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=i.precision!==void 0?i.precision:"highp",c=l(h);c!==h&&(qe("WebGLRenderer:",h,"not supported, using",c,"instead."),h=c);let p=i.logarithmicDepthBuffer===!0,u=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control");i.reversedDepthBuffer===!0&&u===!1&&qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),_=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),d=e.getParameter(e.MAX_VERTEX_ATTRIBS),w=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),A=e.getParameter(e.MAX_VARYING_VECTORS),v=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=e.getParameter(e.MAX_SAMPLES),C=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:p,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:_,maxTextureSize:y,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:w,maxVaryings:A,maxFragmentUniforms:v,maxSamples:T,samples:C}}function Z2(e){let t=this,i=null,r=0,a=!1,n=!1,s=new yr,o=new Qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,u){let f=p.length!==0||u||r!==0||a;return a=u,r=p.length,f},this.beginShadows=function(){n=!0,c(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(p,u){i=c(p,u,0)},this.setState=function(p,u,f){let _=p.clippingPlanes,y=p.clipIntersection,m=p.clipShadows,d=e.get(p);if(!a||_===null||_.length===0||n&&!m)n?c(null):h();else{let w=n?0:r,A=w*4,v=d.clippingState||null;l.value=v,v=c(_,u,A,f);for(let T=0;T!==A;++T)v[T]=i[T];d.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=w}};function h(){l.value!==i&&(l.value=i,l.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function c(p,u,f,_){let y=p!==null?p.length:0,m=null;if(y!==0){if(m=l.value,_!==!0||m===null){let d=f+y*4,w=u.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<d)&&(m=new Float32Array(d));for(let A=0,v=f;A!==y;++A,v+=4)s.copy(p[A]).applyMatrix4(w,o),s.normal.toArray(m,v),m[v+3]=s.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}var Ua=4,J2=6,K2=20,$2=256,hn=new r0,Dh=new Oe,ko=null,Wo=0,jo=0,qo=!1,Q2=new x,Vr=new x,Uh=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,a={}){let{size:n=256,position:s=Q2}=a;ko=this._renderer.getRenderTarget(),Wo=this._renderer.getActiveCubeFace(),jo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(n);let o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(e,i,r,o,s),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ko,Wo,jo),this._renderer.xr.enabled=qo,e.scissorTest=!1,Ca(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xr||e.mapping===za?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ko=this._renderer.getRenderTarget(),Wo=this._renderer.getActiveCubeFace(),jo=this._renderer.getActiveMipmapLevel(),qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Yt,minFilter:Yt,generateMipmaps:!1,type:Vi,format:Ei,colorSpace:Ds,depthBuffer:!1},r=Nh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nh(e,t,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=eg(a)),this._blurMaterial=ig(a,e,t),this._ggxMaterial=tg(a,e,t)}return r}_compileMaterial(e){let t=new ke(new yt,e);this._renderer.compile(t,hn)}_sceneToCubeUV(e,t,i,r,a){let n=new Xt(90,1,t,i),s=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,h=l.autoClear,c=l.toneMapping;l.getClearColor(Dh),l.toneMapping=Fi,l.autoClear=!1,l.state.buffers.depth.getReversed()&&(l.setRenderTarget(r),l.clearDepth(),l.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ke(new wt,new pi({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1})));let p=this._backgroundBox,u=p.material,f=!1,_=e.background;_?_.isColor&&(u.color.copy(_),e.background=null,f=!0):(u.color.copy(Dh),f=!0);for(let y=0;y<6;y++){let m=y%3;m===0?(n.up.set(0,s[y],0),n.position.set(a.x,a.y,a.z),n.lookAt(a.x+o[y],a.y,a.z)):m===1?(n.up.set(0,0,s[y]),n.position.set(a.x,a.y,a.z),n.lookAt(a.x,a.y+o[y],a.z)):(n.up.set(0,s[y],0),n.position.set(a.x,a.y,a.z),n.lookAt(a.x,a.y,a.z+o[y]));let d=this._cubeSize;Ca(r,m*d,y>2?d:0,d,d),l.setRenderTarget(r),f&&l.render(p,n),l.render(e,n)}l.toneMapping=c,l.autoClear=h,e.background=_}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===Xr||e.mapping===za;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oh());let a=r?this._cubemapMaterial:this._equirectMaterial,n=this._lodMeshes[0];n.material=a;let s=a.uniforms;s.envMap.value=e;let o=this._cubeSize;Ca(t,0,0,3*o,2*o),i.setRenderTarget(t),i.render(n,hn)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=i}_applyGGXFilter(e,t,i){let r=this._renderer,a=this._pingPongRenderTarget,n=this._ggxMaterial,s=this._lodMeshes[i];s.material=n;let o=n.uniforms,l=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),c=Math.sqrt(l*l-h*h),p=l*1.25,u=c*p,{_lodMax:f}=this,_=this._sizeLods[i],y=3*_*(i>f-Ua?i-f+Ua:0),m=4*(this._cubeSize-_);o.envMap.value=e.texture,o.roughness.value=u,o.mipInt.value=f-t,Ca(a,y,m,3*_,2*_),r.setRenderTarget(a),r.render(s,hn),o.envMap.value=a.texture,o.roughness.value=0,o.mipInt.value=f-i,Ca(e,y,m,3*_,2*_),r.setRenderTarget(e),r.render(s,hn)}_blur(e,t,i,r){let a=this._pingPongRenderTarget,n=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,a,t,i,n),this._blurPass(a,e,i,i,n)}_blurPass(e,t,i,r,a){let n=this._renderer,s=this._blurMaterial,o=this._lodMeshes[r];o.material=s;let l=s.uniforms;l.envMap.value=e.texture,l.sigma.value=a,l.mipInt.value=this._lodMax-i;let h=this._sizeLods[r],c=3*h*(r>this._lodMax-Ua?r-this._lodMax+Ua:0),p=4*(this._cubeSize-h);Ca(t,c,p,3*h,2*h),n.setRenderTarget(t),n.render(o,hn)}};function eg(e){let t=[],i=[],r=e,a=e-Ua+1+J2;for(let n=0;n<a;n++){let s=Math.pow(2,r);t.push(s);let o=1/(s-2),l=-o,h=1+o,c=[l,l,h,l,h,h,l,l,h,h,l,h],p=6,u=6,f=3,_=new Float32Array(f*u*p),y=new Float32Array(f*u*p);for(let d=0;d<p;d++){let w=d%3*2/3-1,A=d>2?0:-1,v=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];_.set(v,f*u*d);for(let T=0;T<u;T++){let C=c[T*2]*2-1,M=c[T*2+1]*2-1;d===0?Vr.set(1,M,C):d===1?Vr.set(-C,1,-M):d===2?Vr.set(-C,M,1):d===3?Vr.set(-1,M,-C):d===4?Vr.set(-C,-1,M):Vr.set(C,M,-1),Vr.toArray(y,(d*u+T)*f)}}let m=new yt;m.setAttribute("position",new ci(_,f)),m.setAttribute("outputDirection",new ci(y,f)),i.push(new ke(m,null)),r>Ua&&r--}return{lodMeshes:i,sizeLods:t}}function Nh(e,t,i){let r=new wi(e,t,i);return r.texture.mapping=zs,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Ca(e,t,i,r,a){e.viewport.set(t,i,r,a),e.scissor.set(t,i,r,a)}function tg(e,t,i){return new Gi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:$2,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ws(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ir,depthTest:!1,depthWrite:!1})}function ig(e,t,i){return new Gi({name:"SphericalGaussianBlur",defines:{SAMPLES:K2,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ws(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ir,depthTest:!1,depthWrite:!1})}function Oh(){return new Gi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ws(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ir,depthTest:!1,depthWrite:!1})}function Fh(){return new Gi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ws(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ir,depthTest:!1,depthWrite:!1})}function Ws(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Mu=class extends wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Fc(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new wt(5,5,5),a=new Gi({name:"CubemapFromEquirect",uniforms:ka(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Gt,blending:ir});a.uniforms.tEquirect.value=t;let n=new ke(r,a),s=t.minFilter;return t.minFilter===kr&&(t.minFilter=Yt),new J1(1,10,this).update(e,n),t.minFilter=s,n.geometry.dispose(),n.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let a=e.getRenderTarget();for(let n=0;n<6;n++)e.setRenderTarget(this,n),e.clear(t,i,r);e.setRenderTarget(a)}};function rg(e){let t=new WeakMap,i=new WeakMap,r=null;function a(u,f=!1){return u==null?null:f?s(u):n(u)}function n(u){if(u&&u.isTexture){let f=u.mapping;if(f===co||f===uo)if(t.has(u)){let _=t.get(u).texture;return o(_,u.mapping)}else{let _=u.image;if(_&&_.height>0){let y=new Mu(_.height);return y.fromEquirectangularTexture(e,u),t.set(u,y),u.addEventListener("dispose",h),o(y.texture,u.mapping)}else return null}}return u}function s(u){if(u&&u.isTexture){let f=u.mapping,_=f===co||f===uo,y=f===Xr||f===za;if(_||y){let m=i.get(u),d=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==d)return r===null&&(r=new Uh(e)),m=_?r.fromEquirectangular(u,m):r.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,i.set(u,m),m.texture;if(m!==void 0)return m.texture;{let w=u.image;return _&&w&&w.height>0||y&&w&&l(w)?(r===null&&(r=new Uh(e)),m=_?r.fromEquirectangular(u):r.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,i.set(u,m),u.addEventListener("dispose",c),m.texture):null}}}return u}function o(u,f){return f===co?u.mapping=Xr:f===uo&&(u.mapping=za),u}function l(u){let f=0,_=6;for(let y=0;y<_;y++)u[y]!==void 0&&f++;return f===_}function h(u){let f=u.target;f.removeEventListener("dispose",h);let _=t.get(f);_!==void 0&&(t.delete(f),_.dispose())}function c(u){let f=u.target;f.removeEventListener("dispose",c);let _=i.get(f);_!==void 0&&(i.delete(f),_.dispose())}function p(){t=new WeakMap,i=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:a,dispose:p}}function ag(e){let t={};function i(r){if(t[r]!==void 0)return t[r];let a=e.getExtension(r);return t[r]=a,a}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){let a=i(r);return a===null&&Oa("WebGLRenderer: "+r+" extension not supported."),a}}}function ng(e,t,i,r){let a={},n=new WeakMap;function s(p){let u=p.target;u.index!==null&&t.remove(u.index);for(let _ in u.attributes)t.remove(u.attributes[_]);u.removeEventListener("dispose",s),delete a[u.id];let f=n.get(u);f&&(t.remove(f),n.delete(u)),r.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,i.memory.geometries--}function o(p,u){return a[u.id]===!0||(u.addEventListener("dispose",s),a[u.id]=!0,i.memory.geometries++),u}function l(p){let u=p.attributes;for(let f in u)t.update(u[f],e.ARRAY_BUFFER)}function h(p){let u=[],f=p.index,_=p.attributes.position,y=0;if(_===void 0)return;if(f!==null){let w=f.array;y=f.version;for(let A=0,v=w.length;A<v;A+=3){let T=w[A+0],C=w[A+1],M=w[A+2];u.push(T,C,C,M,M,T)}}else{let w=_.array;y=_.version;for(let A=0,v=w.length/3-1;A<v;A+=3){let T=A+0,C=A+1,M=A+2;u.push(T,C,C,M,M,T)}}let m=new(_.count>=65535?Pc:Cc)(u,1);m.version=y;let d=n.get(p);d&&t.remove(d),n.set(p,m)}function c(p){let u=n.get(p);if(u){let f=p.index;f!==null&&u.version<f.version&&h(p)}else h(p);return n.get(p)}return{get:o,update:l,getWireframeAttribute:c}}function sg(e,t,i){let r;function a(p){r=p}let n,s;function o(p){n=p.type,s=p.bytesPerElement}function l(p,u){e.drawElements(r,u,n,p*s),i.update(u,r,1)}function h(p,u,f){f!==0&&(e.drawElementsInstanced(r,u,n,p*s,f),i.update(u,r,f))}function c(p,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,u,0,n,p,0,f);let _=0;for(let y=0;y<f;y++)_+=u[y];i.update(_,r,1)}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=c}function og(e){let t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(n,s,o){switch(i.calls++,s){case e.TRIANGLES:i.triangles+=o*(n/3);break;case e.LINES:i.lines+=o*(n/2);break;case e.LINE_STRIP:i.lines+=o*(n-1);break;case e.LINE_LOOP:i.lines+=o*n;break;case e.POINTS:i.points+=o*n;break;default:Ye("WebGLInfo: Unknown draw mode:",s);break}}function a(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:a,update:r}}function lg(e,t,i){let r=new WeakMap,a=new Mt;function n(s,o,l){let h=s.morphTargetInfluences,c=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=c!==void 0?c.length:0,u=r.get(o);if(u===void 0||u.count!==p){let f=function(){g.dispose(),r.delete(o),o.removeEventListener("dispose",f)};u!==void 0&&u.texture.dispose();let _=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],v=0;_===!0&&(v=1),y===!0&&(v=2),m===!0&&(v=3);let T=o.attributes.position.count*v,C=1;T>t.maxTextureSize&&(C=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);let M=new Float32Array(T*C*4*p),g=new Ec(M,T,C,p);g.type=Mi,g.needsUpdate=!0;let b=v*4;for(let I=0;I<p;I++){let P=d[I],L=w[I],V=A[I],D=T*C*4*I;for(let H=0;H<P.count;H++){let J=H*b;_===!0&&(a.fromBufferAttribute(P,H),M[D+J+0]=a.x,M[D+J+1]=a.y,M[D+J+2]=a.z,M[D+J+3]=0),y===!0&&(a.fromBufferAttribute(L,H),M[D+J+4]=a.x,M[D+J+5]=a.y,M[D+J+6]=a.z,M[D+J+7]=0),m===!0&&(a.fromBufferAttribute(V,H),M[D+J+8]=a.x,M[D+J+9]=a.y,M[D+J+10]=a.z,M[D+J+11]=V.itemSize===4?a.w:1)}}u={count:p,texture:g,size:new se(T,C)},r.set(o,u),o.addEventListener("dispose",f)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",s.morphTexture,i);else{let f=0;for(let y=0;y<h.length;y++)f+=h[y];let _=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(e,"morphTargetBaseInfluence",_),l.getUniforms().setValue(e,"morphTargetInfluences",h)}l.getUniforms().setValue(e,"morphTargetsTexture",u.texture,i),l.getUniforms().setValue(e,"morphTargetsTextureSize",u.size)}return{update:n}}function hg(e,t,i,r,a){let n=new WeakMap;function s(h){let c=a.render.frame,p=h.geometry,u=t.get(h,p);if(n.get(u)!==c&&(t.update(u),n.set(u,c)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),n.get(h)!==c&&(i.update(h.instanceMatrix,e.ARRAY_BUFFER),h.instanceColor!==null&&i.update(h.instanceColor,e.ARRAY_BUFFER),n.set(h,c))),h.isSkinnedMesh){let f=h.skeleton;n.get(f)!==c&&(f.update(),n.set(f,c))}return u}function o(){n=new WeakMap}function l(h){let c=h.target;c.removeEventListener("dispose",l),r.releaseStatesOfObject(c),i.remove(c.instanceMatrix),c.instanceColor!==null&&i.remove(c.instanceColor)}return{update:s,dispose:o}}var cg={[rc]:"LINEAR_TONE_MAPPING",[ac]:"REINHARD_TONE_MAPPING",[nc]:"CINEON_TONE_MAPPING",[sc]:"ACES_FILMIC_TONE_MAPPING",[lc]:"AGX_TONE_MAPPING",[hc]:"NEUTRAL_TONE_MAPPING",[oc]:"CUSTOM_TONE_MAPPING"};function ug(e,t,i,r,a,n){let s=new wi(t,i,{type:e,depthBuffer:a,stencilBuffer:n,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,h=new yt;h.setAttribute("position",new He([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new He([0,2,0,0,2,0],2));let c=new L1({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new ke(h,c),u=new r0(-1,1,1,-1,0,1),f=null,_=null,y=!1,m,d=null,w=[],A=!1;this.setSize=function(v,T){s.setSize(v,T),o!==null&&o.setSize(v,T),l!==null&&l.setSize(v,T);for(let C=0;C<w.length;C++){let M=w[C];M.setSize&&M.setSize(v,T)}},this.setEffects=function(v){w=v,A=w.length>0&&w[0].isRenderPass===!0;let T=s.width,C=s.height;w.length>0&&o===null&&(o=new wi(T,C,{type:Vi,depthBuffer:!1,stencilBuffer:!1}),l=new wi(T,C,{type:Vi,depthBuffer:!1,stencilBuffer:!1}));for(let M=0;M<w.length;M++){let g=w[M];g.setSize&&g.setSize(T,C)}},this.begin=function(v,T){if(y||v.toneMapping===Fi&&w.length===0)return!1;if(d=T,T!==null){let C=T.width,M=T.height;(s.width!==C||s.height!==M)&&this.setSize(C,M)}return A===!1&&v.setRenderTarget(s),m=v.toneMapping,v.toneMapping=Fi,!0},this.hasRenderPass=function(){return A},this.end=function(v,T){v.toneMapping=m,y=!0;let C=s,M=o;for(let g=0;g<w.length;g++){let b=w[g];b.enabled!==!1&&(b.render(v,M,C,T),b.needsSwap!==!1&&(C=M,M=M===o?l:o))}if(f!==v.outputColorSpace||_!==v.toneMapping){f=v.outputColorSpace,_=v.toneMapping,c.defines={},ot.getTransfer(f)===ft&&(c.defines.SRGB_TRANSFER="");let g=cg[_];g&&(c.defines[g]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=C.texture,v.setRenderTarget(d),v.render(p,u),d=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){s.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),c.dispose()}}var Eu=new gi,Bl=new En(1,1),Tu=new Ec,wu=new fd,Au=new Fc,Bh=[],zh=[],Hh=new Float32Array(16),Vh=new Float32Array(9),Gh=new Float32Array(4);function Wa(e,t,i){let r=e[0];if(r<=0||r>0)return e;let a=t*i,n=Bh[a];if(n===void 0&&(n=new Float32Array(a),Bh[a]=n),t!==0){r.toArray(n,0);for(let s=1,o=0;s!==t;++s)o+=i,e[s].toArray(n,o)}return n}function zt(e,t){if(e.length!==t.length)return!1;for(let i=0,r=e.length;i<r;i++)if(e[i]!==t[i])return!1;return!0}function Ht(e,t){for(let i=0,r=t.length;i<r;i++)e[i]=t[i]}function js(e,t){let i=zh[t];i===void 0&&(i=new Int32Array(t),zh[t]=i);for(let r=0;r!==t;++r)i[r]=e.allocateTextureUnit();return i}function pg(e,t){let i=this.cache;i[0]!==t&&(e.uniform1f(this.addr,t),i[0]=t)}function dg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(zt(i,t))return;e.uniform2fv(this.addr,t),Ht(i,t)}}function fg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(zt(i,t))return;e.uniform3fv(this.addr,t),Ht(i,t)}}function mg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(zt(i,t))return;e.uniform4fv(this.addr,t),Ht(i,t)}}function gg(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(zt(i,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ht(i,t)}else{if(zt(i,r))return;Gh.set(r),e.uniformMatrix2fv(this.addr,!1,Gh),Ht(i,r)}}function _g(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(zt(i,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ht(i,t)}else{if(zt(i,r))return;Vh.set(r),e.uniformMatrix3fv(this.addr,!1,Vh),Ht(i,r)}}function vg(e,t){let i=this.cache,r=t.elements;if(r===void 0){if(zt(i,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ht(i,t)}else{if(zt(i,r))return;Hh.set(r),e.uniformMatrix4fv(this.addr,!1,Hh),Ht(i,r)}}function xg(e,t){let i=this.cache;i[0]!==t&&(e.uniform1i(this.addr,t),i[0]=t)}function yg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(zt(i,t))return;e.uniform2iv(this.addr,t),Ht(i,t)}}function bg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(zt(i,t))return;e.uniform3iv(this.addr,t),Ht(i,t)}}function Sg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(zt(i,t))return;e.uniform4iv(this.addr,t),Ht(i,t)}}function Mg(e,t){let i=this.cache;i[0]!==t&&(e.uniform1ui(this.addr,t),i[0]=t)}function Eg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(zt(i,t))return;e.uniform2uiv(this.addr,t),Ht(i,t)}}function Tg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(zt(i,t))return;e.uniform3uiv(this.addr,t),Ht(i,t)}}function wg(e,t){let i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(zt(i,t))return;e.uniform4uiv(this.addr,t),Ht(i,t)}}function Ag(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a);let n;this.type===e.SAMPLER_2D_SHADOW?(Bl.compareFunction=i.isReversedDepthBuffer()?Yl:Xl,n=Bl):n=Eu,i.setTexture2D(t||n,a)}function Rg(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture3D(t||wu,a)}function Cg(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTextureCube(t||Au,a)}function Pg(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture2DArray(t||Tu,a)}function Ig(e){switch(e){case 5126:return pg;case 35664:return dg;case 35665:return fg;case 35666:return mg;case 35674:return gg;case 35675:return _g;case 35676:return vg;case 5124:case 35670:return xg;case 35667:case 35671:return yg;case 35668:case 35672:return bg;case 35669:case 35673:return Sg;case 5125:return Mg;case 36294:return Eg;case 36295:return Tg;case 36296:return wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Ag;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Cg;case 36289:case 36303:case 36311:case 36292:return Pg}}function Lg(e,t){e.uniform1fv(this.addr,t)}function Dg(e,t){let i=Wa(t,this.size,2);e.uniform2fv(this.addr,i)}function Ug(e,t){let i=Wa(t,this.size,3);e.uniform3fv(this.addr,i)}function Ng(e,t){let i=Wa(t,this.size,4);e.uniform4fv(this.addr,i)}function Og(e,t){let i=Wa(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,i)}function Fg(e,t){let i=Wa(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,i)}function Bg(e,t){let i=Wa(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,i)}function zg(e,t){e.uniform1iv(this.addr,t)}function Hg(e,t){e.uniform2iv(this.addr,t)}function Vg(e,t){e.uniform3iv(this.addr,t)}function Gg(e,t){e.uniform4iv(this.addr,t)}function kg(e,t){e.uniform1uiv(this.addr,t)}function Wg(e,t){e.uniform2uiv(this.addr,t)}function jg(e,t){e.uniform3uiv(this.addr,t)}function qg(e,t){e.uniform4uiv(this.addr,t)}function Xg(e,t,i){let r=this.cache,a=t.length,n=js(i,a);zt(r,n)||(e.uniform1iv(this.addr,n),Ht(r,n));let s;this.type===e.SAMPLER_2D_SHADOW?s=Bl:s=Eu;for(let o=0;o!==a;++o)i.setTexture2D(t[o]||s,n[o])}function Yg(e,t,i){let r=this.cache,a=t.length,n=js(i,a);zt(r,n)||(e.uniform1iv(this.addr,n),Ht(r,n));for(let s=0;s!==a;++s)i.setTexture3D(t[s]||wu,n[s])}function Zg(e,t,i){let r=this.cache,a=t.length,n=js(i,a);zt(r,n)||(e.uniform1iv(this.addr,n),Ht(r,n));for(let s=0;s!==a;++s)i.setTextureCube(t[s]||Au,n[s])}function Jg(e,t,i){let r=this.cache,a=t.length,n=js(i,a);zt(r,n)||(e.uniform1iv(this.addr,n),Ht(r,n));for(let s=0;s!==a;++s)i.setTexture2DArray(t[s]||Tu,n[s])}function Kg(e){switch(e){case 5126:return Lg;case 35664:return Dg;case 35665:return Ug;case 35666:return Ng;case 35674:return Og;case 35675:return Fg;case 35676:return Bg;case 5124:case 35670:return zg;case 35667:case 35671:return Hg;case 35668:case 35672:return Vg;case 35669:case 35673:return Gg;case 5125:return kg;case 36294:return Wg;case 36295:return jg;case 36296:return qg;case 35678:case 36198:case 36298:case 36306:case 35682:return Xg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return Zg;case 36289:case 36303:case 36311:case 36292:return Jg}}var $g=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ig(t.type)}},Qg=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Kg(t.type)}},e5=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let a=0,n=r.length;a!==n;++a){let s=r[a];s.setValue(e,t[s.id],i)}}},Xo=/(\w+)(\])?(\[|\.)?/g;function kh(e,t){e.seq.push(t),e.map[t.id]=t}function t5(e,t,i){let r=e.name,a=r.length;for(Xo.lastIndex=0;;){let n=Xo.exec(r),s=Xo.lastIndex,o=n[1],l=n[2]==="]",h=n[3];if(l&&(o=o|0),h===void 0||h==="["&&s+2===a){kh(i,h===void 0?new $g(o,e,t):new Qg(o,e,t));break}else{let c=i.map[o];c===void 0&&(c=new e5(o),kh(i,c)),i=c}}}var Cs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){let s=e.getActiveUniform(t,n),o=e.getUniformLocation(t,s.name);t5(s,o,this)}let r=[],a=[];for(let n of this.seq)n.type===e.SAMPLER_2D_SHADOW||n.type===e.SAMPLER_CUBE_SHADOW||n.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(n):a.push(n);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){let a=this.map[t];a!==void 0&&a.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,n=t.length;a!==n;++a){let s=t[a],o=i[s.id];o.needsUpdate!==!1&&s.setValue(e,o.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,a=e.length;r!==a;++r){let n=e[r];n.id in t&&i.push(n)}return i}};function Wh(e,t,i){let r=e.createShader(t);return e.shaderSource(r,i),e.compileShader(r),r}var i5=37297,r5=0;function a5(e,t){let i=e.split(`
`),r=[],a=Math.max(t-6,0),n=Math.min(t+6,i.length);for(let s=a;s<n;s++){let o=s+1;r.push(`${o===t?">":" "} ${o}: ${i[s]}`)}return r.join(`
`)}var jh=new Qe;function n5(e){ot._getMatrix(jh,ot.workingColorSpace,e);let t=`mat3( ${jh.elements.map(i=>i.toFixed(4))} )`;switch(ot.getTransfer(e)){case Us:return[t,"LinearTransferOETF"];case ft:return[t,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function qh(e,t,i){let r=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(r&&a==="")return"";let n=/ERROR: 0:(\d+)/.exec(a);if(n){let s=parseInt(n[1]);return i.toUpperCase()+`

`+a+`

`+a5(e.getShaderSource(t),s)}else return a}function s5(e,t){let i=n5(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}var o5={[rc]:"Linear",[ac]:"Reinhard",[nc]:"Cineon",[sc]:"ACESFilmic",[lc]:"AgX",[hc]:"Neutral",[oc]:"Custom"};function l5(e,t){let i=o5[t];return i===void 0?(qe("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}var Ss=new x;function h5(){ot.getLuminanceCoefficients(Ss);let e=Ss.x.toFixed(4),t=Ss.y.toFixed(4),i=Ss.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function c5(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dn).join(`
`)}function u5(e){let t=[];for(let i in e){let r=e[i];r!==!1&&t.push("#define "+i+" "+r)}return t.join(`
`)}function p5(e,t){let i={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){let n=e.getActiveAttrib(t,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),i[s]={type:n.type,location:e.getAttribLocation(t,s),locationSize:o}}return i}function dn(e){return e!==""}function Xh(e,t){let i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yh(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var d5=/^[ \t]*#include +<([\w\d./]+)>/gm;function zl(e){return e.replace(d5,m5)}var f5=new Map;function m5(e,t){let i=et[t];if(i===void 0){let r=f5.get(t);if(r!==void 0)i=et[r],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,r);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return zl(i)}var g5=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zh(e){return e.replace(g5,_5)}function _5(e,t,i,r){let a="";for(let n=parseInt(t);n<parseInt(i);n++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function Jh(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?t+=`
#define HIGH_PRECISION`:e.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var v5={[Na]:"SHADOWMAP_TYPE_PCF",[un]:"SHADOWMAP_TYPE_VSM"};function x5(e){return v5[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var y5={[Xr]:"ENVMAP_TYPE_CUBE",[za]:"ENVMAP_TYPE_CUBE",[zs]:"ENVMAP_TYPE_CUBE_UV"};function b5(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":y5[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var S5={[za]:"ENVMAP_MODE_REFRACTION"};function M5(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":S5[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var E5={[Bs]:"ENVMAP_BLENDING_MULTIPLY",[Pp]:"ENVMAP_BLENDING_MIX",[Ip]:"ENVMAP_BLENDING_ADD"};function T5(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":E5[e.combine]||"ENVMAP_BLENDING_NONE"}function w5(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let i=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function A5(e,t,i,r){let a=e.getContext(),n=i.defines,s=i.vertexShader,o=i.fragmentShader,l=x5(i),h=b5(i),c=M5(i),p=T5(i),u=w5(i),f=c5(i),_=u5(n),y=a.createProgram(),m,d,w=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(m=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,_].filter(dn).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,_].filter(dn).join(`
`),d.length>0&&(d+=`
`)):(m=[Jh(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,_,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+c:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dn).join(`
`),d=[Jh(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,_,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+h:"",i.envMap?"#define "+c:"",i.envMap?"#define "+p:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.retroreflection?"#define USE_RETROREFLECTION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+l:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Fi?"#define TONE_MAPPING":"",i.toneMapping!==Fi?et.tonemapping_pars_fragment:"",i.toneMapping!==Fi?l5("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,s5("linearToOutputTexel",i.outputColorSpace),h5(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(dn).join(`
`)),s=zl(s),s=Xh(s,i),s=Yh(s,i),o=zl(o),o=Xh(o,i),o=Yh(o,i),s=Zh(s),o=Zh(o),i.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",i.glslVersion===q0?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===q0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let A=w+m+s,v=w+d+o,T=Wh(a,a.VERTEX_SHADER,A),C=Wh(a,a.FRAGMENT_SHADER,v);a.attachShader(y,T),a.attachShader(y,C),i.index0AttributeName!==void 0?a.bindAttribLocation(y,0,i.index0AttributeName):i.hasPositionAttribute===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function M(P){if(e.debug.checkShaderErrors){let L=a.getProgramInfoLog(y)||"",V=a.getShaderInfoLog(T)||"",D=a.getShaderInfoLog(C)||"",H=L.trim(),J=V.trim(),j=D.trim(),ue=!0,Z=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(ue=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(a,y,T,C);else{let K=qh(a,T,"vertex"),te=qh(a,C,"fragment");Ye("WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+K+`
`+te)}else H!==""?qe("WebGLProgram: Program Info Log:",H):(J===""||j==="")&&(Z=!1);Z&&(P.diagnostics={runnable:ue,programLog:H,vertexShader:{log:J,prefix:m},fragmentShader:{log:j,prefix:d}})}a.deleteShader(T),a.deleteShader(C),g=new Cs(a,y),b=p5(a,y)}let g;this.getUniforms=function(){return g===void 0&&M(this),g};let b;this.getAttributes=function(){return b===void 0&&M(this),b};let I=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=a.getProgramParameter(y,i5)),I},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=r5++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=T,this.fragmentShader=C,this}var R5=0,C5=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new P5(e),t.set(e,i)),i}},P5=class{constructor(e){this.id=R5++,this.code=e,this.usedTimes=0}};function I5(e){return e===Zr||e===Ps||e===Is}function L5(e,t,i,r,a,n){let s=new wc,o=new C5,l=new Set,h=[],c=new Map,p=r.logarithmicDepthBuffer,u=r.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(g){return l.add(g),g===0?"uv":`uv${g}`}function y(g,b,I,P,L,V){let D=P.fog,H=L.geometry,J=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?P.environment:null,j=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,ue=t.get(g.envMap||J,j),Z=ue&&ue.mapping===zs?ue.image.height:null,K=f[g.type];g.precision!==null&&(u=r.getMaxPrecision(g.precision),u!==g.precision&&qe("WebGLProgram.getParameters:",g.precision,"not supported, using",u,"instead."));let te=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ve=te!==void 0?te.length:0,Ce=0;H.morphAttributes.position!==void 0&&(Ce=1),H.morphAttributes.normal!==void 0&&(Ce=2),H.morphAttributes.color!==void 0&&(Ce=3);let ut,be,k,$;if(K){let Ft=Oi[K];ut=Ft.vertexShader,be=Ft.fragmentShader}else{ut=g.vertexShader,be=g.fragmentShader;let Ft=o.getVertexShaderStage(g),dt=o.getFragmentShaderStage(g);o.update(g,Ft,dt),k=Ft.id,$=dt.id}let ne=e.getRenderTarget(),Le=e.state.buffers.depth.getReversed(),We=L.isInstancedMesh===!0,me=L.isBatchedMesh===!0,it=!!g.map,re=!!g.matcap,ie=!!ue,ce=!!g.aoMap,Se=!!g.lightMap,Me=!!g.bumpMap&&g.wireframe===!1,De=!!g.normalMap,Ge=!!g.displacementMap,Je=!!g.emissiveMap,$e=!!g.metalnessMap,N=!!g.roughnessMap,xt=g.anisotropy>0,nt=g.clearcoat>0,rt=g.dispersion>0,R=g.retroreflectivity>0,S=g.iridescence>0,O=g.sheen>0,q=g.transmission>0,ee=xt&&!!g.anisotropyMap,fe=nt&&!!g.clearcoatMap,ge=nt&&!!g.clearcoatNormalMap,z=nt&&!!g.clearcoatRoughnessMap,pe=S&&!!g.iridescenceMap,ve=S&&!!g.iridescenceThicknessMap,Ie=O&&!!g.sheenColorMap,le=O&&!!g.sheenRoughnessMap,Be=!!g.specularMap,ze=!!g.specularColorMap,Ze=!!g.specularIntensityMap,pt=q&&!!g.transmissionMap,B=q&&!!g.thicknessMap,Q=!!g.gradientMap,ae=!!g.alphaMap,Ee=g.alphaTest>0,Ue=!!g.alphaHash,oe=!!g.extensions,ye=Fi;g.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ye=e.toneMapping);let Xe={shaderID:K,shaderType:g.type,shaderName:g.name,vertexShader:ut,fragmentShader:be,defines:g.defines,customVertexShaderID:k,customFragmentShaderID:$,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:u,batching:me,batchingColor:me&&L._colorsTexture!==null,instancing:We,instancingColor:We&&L.instanceColor!==null,instancingMorph:We&&L.morphTexture!==null,outputColorSpace:ne===null?e.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:it,matcap:re,envMap:ie,envMapMode:ie&&ue.mapping,envMapCubeUVHeight:Z,aoMap:ce,lightMap:Se,bumpMap:Me,normalMap:De,displacementMap:Ge,emissiveMap:Je,normalMapObjectSpace:De&&g.normalMapType===Up,normalMapTangentSpace:De&&g.normalMapType===bn,packedNormalMap:De&&g.normalMapType===bn&&I5(g.normalMap.format),metalnessMap:$e,roughnessMap:N,anisotropy:xt,anisotropyMap:ee,clearcoat:nt,clearcoatMap:fe,clearcoatNormalMap:ge,clearcoatRoughnessMap:z,dispersion:rt,retroreflection:R,iridescence:S,iridescenceMap:pe,iridescenceThicknessMap:ve,sheen:O,sheenColorMap:Ie,sheenRoughnessMap:le,specularMap:Be,specularColorMap:ze,specularIntensityMap:Ze,transmission:q,transmissionMap:pt,thicknessMap:B,gradientMap:Q,opaque:g.transparent===!1&&g.blending===fn&&g.alphaToCoverage===!1,alphaMap:ae,alphaTest:Ee,alphaHash:Ue,combine:g.combine,mapUv:it&&_(g.map.channel),aoMapUv:ce&&_(g.aoMap.channel),lightMapUv:Se&&_(g.lightMap.channel),bumpMapUv:Me&&_(g.bumpMap.channel),normalMapUv:De&&_(g.normalMap.channel),displacementMapUv:Ge&&_(g.displacementMap.channel),emissiveMapUv:Je&&_(g.emissiveMap.channel),metalnessMapUv:$e&&_(g.metalnessMap.channel),roughnessMapUv:N&&_(g.roughnessMap.channel),anisotropyMapUv:ee&&_(g.anisotropyMap.channel),clearcoatMapUv:fe&&_(g.clearcoatMap.channel),clearcoatNormalMapUv:ge&&_(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:z&&_(g.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&_(g.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&_(g.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&_(g.sheenColorMap.channel),sheenRoughnessMapUv:le&&_(g.sheenRoughnessMap.channel),specularMapUv:Be&&_(g.specularMap.channel),specularColorMapUv:ze&&_(g.specularColorMap.channel),specularIntensityMapUv:Ze&&_(g.specularIntensityMap.channel),transmissionMapUv:pt&&_(g.transmissionMap.channel),thicknessMapUv:B&&_(g.thicknessMap.channel),alphaMapUv:ae&&_(g.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(De||xt),vertexNormals:!!H.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!H.attributes.uv&&(it||ae),fog:!!D,useFog:g.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||H.attributes.normal===void 0&&De===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:Le,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ve,morphTextureStride:Ce,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:n.numPlanes,numClipIntersection:n.numIntersection,dithering:g.dithering,shadowMapEnabled:e.shadowMap.enabled&&I.length>0,shadowMapType:e.shadowMap.type,toneMapping:ye,decodeVideoTexture:it&&g.map.isVideoTexture===!0&&ot.getTransfer(g.map.colorSpace)===ft,decodeVideoTextureEmissive:Je&&g.emissiveMap.isVideoTexture===!0&&ot.getTransfer(g.emissiveMap.colorSpace)===ft,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===ri,flipSided:g.side===Gt,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:oe&&g.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&g.extensions.multiDraw===!0||me)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Xe.vertexUv1s=l.has(1),Xe.vertexUv2s=l.has(2),Xe.vertexUv3s=l.has(3),l.clear(),Xe}function m(g){let b=[];if(g.shaderID?b.push(g.shaderID):(b.push(g.customVertexShaderID),b.push(g.customFragmentShaderID)),g.defines!==void 0)for(let I in g.defines)b.push(I),b.push(g.defines[I]);return g.isRawShaderMaterial===!1&&(d(b,g),w(b,g),b.push(e.outputColorSpace)),b.push(g.customProgramCacheKey),b.join()}function d(g,b){g.push(b.precision),g.push(b.outputColorSpace),g.push(b.envMapMode),g.push(b.envMapCubeUVHeight),g.push(b.mapUv),g.push(b.alphaMapUv),g.push(b.lightMapUv),g.push(b.aoMapUv),g.push(b.bumpMapUv),g.push(b.normalMapUv),g.push(b.displacementMapUv),g.push(b.emissiveMapUv),g.push(b.metalnessMapUv),g.push(b.roughnessMapUv),g.push(b.anisotropyMapUv),g.push(b.clearcoatMapUv),g.push(b.clearcoatNormalMapUv),g.push(b.clearcoatRoughnessMapUv),g.push(b.iridescenceMapUv),g.push(b.iridescenceThicknessMapUv),g.push(b.sheenColorMapUv),g.push(b.sheenRoughnessMapUv),g.push(b.specularMapUv),g.push(b.specularColorMapUv),g.push(b.specularIntensityMapUv),g.push(b.transmissionMapUv),g.push(b.thicknessMapUv),g.push(b.combine),g.push(b.fogExp2),g.push(b.sizeAttenuation),g.push(b.morphTargetsCount),g.push(b.morphAttributeCount),g.push(b.numSunLights),g.push(b.numDirLights),g.push(b.numPointLights),g.push(b.numSpotLights),g.push(b.numSpotLightMaps),g.push(b.numHemiLights),g.push(b.numRectAreaLights),g.push(b.numSunLightShadows),g.push(b.numDirLightShadows),g.push(b.numPointLightShadows),g.push(b.numSpotLightShadows),g.push(b.numSpotLightShadowsWithMaps),g.push(b.numLightProbes),g.push(b.shadowMapType),g.push(b.toneMapping),g.push(b.numClippingPlanes),g.push(b.numClipIntersection),g.push(b.depthPacking)}function w(g,b){s.disableAll(),b.instancing&&s.enable(0),b.instancingColor&&s.enable(1),b.instancingMorph&&s.enable(2),b.matcap&&s.enable(3),b.envMap&&s.enable(4),b.normalMapObjectSpace&&s.enable(5),b.normalMapTangentSpace&&s.enable(6),b.clearcoat&&s.enable(7),b.iridescence&&s.enable(8),b.alphaTest&&s.enable(9),b.vertexColors&&s.enable(10),b.vertexAlphas&&s.enable(11),b.vertexUv1s&&s.enable(12),b.vertexUv2s&&s.enable(13),b.vertexUv3s&&s.enable(14),b.vertexTangents&&s.enable(15),b.anisotropy&&s.enable(16),b.alphaHash&&s.enable(17),b.batching&&s.enable(18),b.dispersion&&s.enable(19),b.retroreflection&&s.enable(24),b.batchingColor&&s.enable(20),b.gradientMap&&s.enable(21),b.packedNormalMap&&s.enable(22),b.vertexNormals&&s.enable(23),g.push(s.mask),s.disableAll(),b.fog&&s.enable(0),b.useFog&&s.enable(1),b.flatShading&&s.enable(2),b.logarithmicDepthBuffer&&s.enable(3),b.reversedDepthBuffer&&s.enable(4),b.skinning&&s.enable(5),b.morphTargets&&s.enable(6),b.morphNormals&&s.enable(7),b.morphColors&&s.enable(8),b.premultipliedAlpha&&s.enable(9),b.shadowMapEnabled&&s.enable(10),b.doubleSided&&s.enable(11),b.flipSided&&s.enable(12),b.useDepthPacking&&s.enable(13),b.dithering&&s.enable(14),b.transmission&&s.enable(15),b.sheen&&s.enable(16),b.opaque&&s.enable(17),b.pointsUvs&&s.enable(18),b.decodeVideoTexture&&s.enable(19),b.decodeVideoTextureEmissive&&s.enable(20),b.alphaToCoverage&&s.enable(21),b.numLightProbeGrids>0&&s.enable(22),b.hasPositionAttribute&&s.enable(23),g.push(s.mask)}function A(g){let b=f[g.type],I;if(b){let P=Oi[b];I=C1.clone(P.uniforms)}else I=g.uniforms;return I}function v(g,b){let I=c.get(b);return I!==void 0?++I.usedTimes:(I=new A5(e,b,g,a),h.push(I),c.set(b,I)),I}function T(g){if(--g.usedTimes===0){let b=h.indexOf(g);h[b]=h[h.length-1],h.pop(),c.delete(g.cacheKey),g.destroy()}}function C(g){o.remove(g)}function M(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:A,acquireProgram:v,releaseProgram:T,releaseShaderCache:C,programs:h,dispose:M}}function D5(){let e=new WeakMap;function t(s){return e.has(s)}function i(s){let o=e.get(s);return o===void 0&&(o={},e.set(s,o)),o}function r(s){e.delete(s)}function a(s,o,l){e.get(s)[o]=l}function n(){e=new WeakMap}return{has:t,get:i,remove:r,update:a,dispose:n}}function U5(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.material.id!==t.material.id?e.material.id-t.material.id:e.materialVariant!==t.materialVariant?e.materialVariant-t.materialVariant:e.z!==t.z?e.z-t.z:e.id-t.id}function Kh(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function $h(){let e=[],t=0,i=[],r=[],a=[];function n(){t=0,i.length=0,r.length=0,a.length=0}function s(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,_,y,m,d){let w=e[t];return w===void 0?(w={id:u.id,object:u,geometry:f,material:_,materialVariant:s(u),groupOrder:y,renderOrder:u.renderOrder,z:m,group:d},e[t]=w):(w.id=u.id,w.object=u,w.geometry=f,w.material=_,w.materialVariant=s(u),w.groupOrder=y,w.renderOrder=u.renderOrder,w.z=m,w.group=d),t++,w}function l(u,f,_,y,m,d,w){w.reversedDepth===!0&&(m=-m);let A=o(u,f,_,y,m,d);_.transmission>0?r.push(A):_.transparent===!0?a.push(A):i.push(A)}function h(u,f,_,y,m,d){let w=o(u,f,_,y,m,d);_.transmission>0?r.unshift(w):_.transparent===!0?a.unshift(w):i.unshift(w)}function c(u,f){i.length>1&&i.sort(u||U5),r.length>1&&r.sort(f||Kh),a.length>1&&a.sort(f||Kh)}function p(){for(let u=t,f=e.length;u<f;u++){let _=e[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:i,transmissive:r,transparent:a,init:n,push:l,unshift:h,finish:p,sort:c}}function N5(){let e=new WeakMap;function t(r,a){let n=e.get(r),s;return n===void 0?(s=new $h,e.set(r,[s])):a>=n.length?(s=new $h,n.push(s)):s=n[a],s}function i(){e=new WeakMap}return{get:t,dispose:i}}function O5(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={direction:new x,color:new Oe};break;case"SpotLight":i={position:new x,direction:new x,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new x,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":i={direction:new x,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":i={color:new Oe,position:new x,halfWidth:new x,halfHeight:new x};break}return e[t.id]=i,i}}}function F5(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let i;switch(t.type){case"SunLight":case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[t.id]=i,i}}}var B5=0;function z5(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function H5(e){let t=new O5,i=F5(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new x);let a=new x,n=new Ke,s=new Ke;function o(h){let c=0,p=0,u=0;for(let L=0;L<9;L++)r.probe[L].set(0,0,0);let f=0,_=0,y=0,m=0,d=0,w=0,A=0,v=0,T=0,C=0,M=0,g=0,b=0,I=0;h.sort(z5);for(let L=0,V=h.length;L<V;L++){let D=h[L],H=D.color,J=D.intensity,j=D.distance,ue=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Zr?ue=D.shadow.map.texture:ue=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)c+=H.r*J,p+=H.g*J,u+=H.b*J;else if(D.isLightProbe){for(let Z=0;Z<9;Z++)r.probe[Z].addScaledVector(D.sh.coefficients[Z],J);I++}else if(D.isSunLight){let Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let K=D.shadow,te=i.get(D);te.shadowIntensity=K.intensity,te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),r.sunShadow[_]=te,r.sunShadowMap[_]=ue;let Ve=K.getViewportCount();for(let Ce=0;Ce<Ve;Ce++)r.sunShadowMatrix[y+Ce]=K.getMatrix(Ce),r.sunShadowCascade[y+Ce]=K._cascadeData[Ce];y+=Ve,_++}r.sun[f]=Z,f++}else if(D.isDirectionalLight){let Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let K=D.shadow,te=i.get(D);te.shadowIntensity=K.intensity,te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,r.directionalShadow[m]=te,r.directionalShadowMap[m]=ue,r.directionalShadowMatrix[m]=D.shadow.matrix,T++}r.directional[m]=Z,m++}else if(D.isSpotLight){let Z=t.get(D);Z.position.setFromMatrixPosition(D.matrixWorld),Z.color.copy(H).multiplyScalar(J),Z.distance=j,Z.coneCos=Math.cos(D.angle),Z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Z.decay=D.decay,r.spot[w]=Z;let K=D.shadow;if(D.map&&(r.spotLightMap[g]=D.map,g++,K.updateMatrices(D),D.castShadow&&b++),r.spotLightMatrix[w]=K.matrix,D.castShadow){let te=i.get(D);te.shadowIntensity=K.intensity,te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,r.spotShadow[w]=te,r.spotShadowMap[w]=ue,M++}w++}else if(D.isRectAreaLight){let Z=t.get(D);Z.color.copy(H).multiplyScalar(J),Z.halfWidth.set(D.width*.5,0,0),Z.halfHeight.set(0,D.height*.5,0),r.rectArea[A]=Z,A++}else if(D.isPointLight){let Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),Z.distance=D.distance,Z.decay=D.decay,D.castShadow){let K=D.shadow,te=i.get(D);te.shadowIntensity=K.intensity,te.shadowBias=K.bias,te.shadowNormalBias=K.normalBias,te.shadowRadius=K.radius,te.shadowMapSize=K.mapSize,te.shadowCameraNear=K.camera.near,te.shadowCameraFar=K.camera.far,r.pointShadow[d]=te,r.pointShadowMap[d]=ue,r.pointShadowMatrix[d]=D.shadow.matrix,C++}r.point[d]=Z,d++}else if(D.isHemisphereLight){let Z=t.get(D);Z.skyColor.copy(D.color).multiplyScalar(J),Z.groundColor.copy(D.groundColor).multiplyScalar(J),r.hemi[v]=Z,v++}}A>0&&(e.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=_e.LTC_FLOAT_1,r.rectAreaLTC2=_e.LTC_FLOAT_2):(r.rectAreaLTC1=_e.LTC_HALF_1,r.rectAreaLTC2=_e.LTC_HALF_2)),r.ambient[0]=c,r.ambient[1]=p,r.ambient[2]=u;let P=r.hash;(P.sunLength!==f||P.directionalLength!==m||P.pointLength!==d||P.spotLength!==w||P.rectAreaLength!==A||P.hemiLength!==v||P.numSunShadows!==_||P.numDirectionalShadows!==T||P.numPointShadows!==C||P.numSpotShadows!==M||P.numSpotMaps!==g||P.numLightProbes!==I)&&(r.sun.length=f,r.directional.length=m,r.spot.length=w,r.rectArea.length=A,r.point.length=d,r.hemi.length=v,r.sunShadow.length=_,r.sunShadowMap.length=_,r.sunShadowMatrix.length=y,r.sunShadowCascade.length=y,r.directionalShadow.length=T,r.directionalShadowMap.length=T,r.directionalShadowMatrix.length=T,r.pointShadow.length=C,r.pointShadowMap.length=C,r.pointShadowMatrix.length=C,r.spotShadow.length=M,r.spotShadowMap.length=M,r.spotLightMatrix.length=M+g-b,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=I,P.sunLength=f,P.directionalLength=m,P.pointLength=d,P.spotLength=w,P.rectAreaLength=A,P.hemiLength=v,P.numSunShadows=_,P.numDirectionalShadows=T,P.numPointShadows=C,P.numSpotShadows=M,P.numSpotMaps=g,P.numLightProbes=I,r.version=B5++)}function l(h,c){let p=0,u=0,f=0,_=0,y=0,m=0,d=c.matrixWorldInverse;for(let w=0,A=h.length;w<A;w++){let v=h[w];if(v.isSunLight){let T=r.sun[p];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(d),p++}else if(v.isDirectionalLight){let T=r.directional[u];T.direction.setFromMatrixPosition(v.matrixWorld),a.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(a),T.direction.transformDirection(d),u++}else if(v.isSpotLight){let T=r.spot[_];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),T.direction.setFromMatrixPosition(v.matrixWorld),a.setFromMatrixPosition(v.target.matrixWorld),T.direction.sub(a),T.direction.transformDirection(d),_++}else if(v.isRectAreaLight){let T=r.rectArea[y];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),s.identity(),n.copy(v.matrixWorld),n.premultiply(d),s.extractRotation(n),T.halfWidth.set(v.width*.5,0,0),T.halfHeight.set(0,v.height*.5,0),T.halfWidth.applyMatrix4(s),T.halfHeight.applyMatrix4(s),y++}else if(v.isPointLight){let T=r.point[f];T.position.setFromMatrixPosition(v.matrixWorld),T.position.applyMatrix4(d),f++}else if(v.isHemisphereLight){let T=r.hemi[m];T.direction.setFromMatrixPosition(v.matrixWorld),T.direction.transformDirection(d),m++}}}return{setup:o,setupView:l,state:r}}function Qh(e){let t=new H5(e),i=[],r=[],a=[];function n(u){p.camera=u,i.length=0,r.length=0,a.length=0}function s(u){i.push(u)}function o(u){r.push(u)}function l(u){a.push(u)}function h(){t.setup(i)}function c(u){t.setupView(i,u)}let p={lightsArray:i,shadowsArray:r,lightProbeGridArray:a,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:n,state:p,setupLights:h,setupLightsView:c,pushLight:s,pushShadow:o,pushLightProbeGrid:l}}function V5(e){let t=new WeakMap;function i(a,n=0){let s=t.get(a),o;return s===void 0?(o=new Qh(e),t.set(a,[o])):n>=s.length?(o=new Qh(e),s.push(o)):o=s[n],o}function r(){t=new WeakMap}return{get:i,dispose:r}}var G5=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,k5=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,W5=[new x(1,0,0),new x(-1,0,0),new x(0,1,0),new x(0,-1,0),new x(0,0,1),new x(0,0,-1)],j5=[new x(0,-1,0),new x(0,-1,0),new x(0,0,1),new x(0,0,-1),new x(0,-1,0),new x(0,-1,0)],ec=new Ke,cn=new x,Yo=new x;function q5(e,t,i){let r=new Va,a=new se,n=new se,s=new Mt,o=new D1,l=new U1,h={},c=i.maxTextureSize,p={[qr]:Gt,[Gt]:qr,[ri]:ri},u=new Gi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:G5,fragmentShader:k5}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let _=new yt;_.setAttribute("position",new ci(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new ke(_,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Na;let d=this.type;this.render=function(C,M,g){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;this.type===up&&(qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Na);let b=e.getRenderTarget(),I=e.getActiveCubeFace(),P=e.getActiveMipmapLevel(),L=e.state;L.setBlending(ir),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let V=d!==this.type;V&&M.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(H=>H.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,H=C.length;D<H;D++){let J=C[D],j=J.shadow;if(j===void 0){qe("WebGLShadowMap:",J,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;a.copy(j.mapSize);let ue=j.getFrameExtents();a.multiply(ue),n.copy(j.mapSize),(a.x>c||a.y>c)&&(a.x>c&&(n.x=Math.floor(c/ue.x),a.x=n.x*ue.x,j.mapSize.x=n.x),a.y>c&&(n.y=Math.floor(c/ue.y),a.y=n.y*ue.y,j.mapSize.y=n.y));let Z=e.state.buffers.depth.getReversed();if(j.camera._reversedDepth=Z,j.map===null||V===!0){if(j.map!==null&&(j.map.depthTexture!==null&&(j.map.depthTexture.dispose(),j.map.depthTexture=null),j.map.dispose()),this.type===un){if(J.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}j.map=new wi(a.x,a.y,{format:Zr,type:Vi,minFilter:Yt,magFilter:Yt,generateMipmaps:!1}),j.map.texture.name=J.name+".shadowMap",j.map.depthTexture=new En(a.x,a.y,Mi),j.map.depthTexture.name=J.name+".shadowMapDepth",j.map.depthTexture.format=ar,j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Bt,j.map.depthTexture.magFilter=Bt}else J.isPointLight?(j.map=new Mu(a.x),j.map.depthTexture=new Nd(a.x,Hi)):(j.map=new wi(a.x,a.y),j.map.depthTexture=new En(a.x,a.y,Hi)),j.map.depthTexture.name=J.name+".shadowMap",j.map.depthTexture.format=ar,this.type===Na?(j.map.depthTexture.compareFunction=Z?Yl:Xl,j.map.depthTexture.minFilter=Yt,j.map.depthTexture.magFilter=Yt):(j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Bt,j.map.depthTexture.magFilter=Bt);j.camera.updateProjectionMatrix()}j.map.isWebGLCubeRenderTarget!==!0&&(j.map.width!==a.x||j.map.height!==a.y)&&j.map.setSize(a.x,a.y);let K=j.map.isWebGLCubeRenderTarget?6:j.getViewportCount();J.isPointLight!==!0&&j.updateMatrices(J,g);for(let te=0;te<K;te++){let Ve=j.getCamera(te);if(J.isPointLight){let Ce=j.camera,ut=j.matrix,be=J.distance||Ce.far;be!==Ce.far&&(Ce.far=be,Ce.updateProjectionMatrix()),cn.setFromMatrixPosition(J.matrixWorld),Ce.position.copy(cn),Yo.copy(Ce.position),Yo.add(W5[te]),Ce.up.copy(j5[te]),Ce.lookAt(Yo),Ce.updateMatrixWorld(),ut.makeTranslation(-cn.x,-cn.y,-cn.z),ec.multiplyMatrices(Ce.projectionMatrix,Ce.matrixWorldInverse),j._frustum.setFromProjectionMatrix(ec,Ce.coordinateSystem,Ce.reversedDepth)}if(j.map.isWebGLCubeRenderTarget)e.setRenderTarget(j.map,te),e.clear();else{te===0&&(e.setRenderTarget(j.map),e.clear());let Ce=j.getViewport(te);s.set(n.x*Ce.x,n.y*Ce.y,n.x*Ce.z,n.y*Ce.w),L.viewport(s)}r=j.getFrustum(te),v(M,g,Ve,J,this.type)}j.isPointLightShadow!==!0&&this.type===un&&w(j,g),j.needsUpdate=!1}d=this.type,m.needsUpdate=!1,e.setRenderTarget(b,I,P)};function w(C,M){let g=t.update(y);u.defines.VSM_SAMPLES!==C.blurSamples&&(u.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null?C.mapPass=new wi(a.x,a.y,{format:Zr,type:Vi}):(C.mapPass.width!==C.map.width||C.mapPass.height!==C.map.height)&&C.mapPass.setSize(C.map.width,C.map.height),u.uniforms.shadow_pass.value=C.map.depthTexture,u.uniforms.resolution.value.set(C.map.width,C.map.height),u.uniforms.radius.value=C.radius,e.setRenderTarget(C.mapPass),e.clear(),e.renderBufferDirect(M,null,g,u,y,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value.set(C.map.width,C.map.height),f.uniforms.radius.value=C.radius,e.setRenderTarget(C.map),e.clear(),e.renderBufferDirect(M,null,g,f,y,null)}function A(C,M,g,b){let I=null,P=g.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(P!==void 0)I=P;else if(I=g.isPointLight===!0?l:o,e.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0||M.alphaToCoverage===!0){let L=I.uuid,V=M.uuid,D=h[L];D===void 0&&(D={},h[L]=D);let H=D[V];H===void 0&&(H=I.clone(),D[V]=H,M.addEventListener("dispose",T)),I=H}if(I.visible=M.visible,I.wireframe=M.wireframe,b===un?I.side=M.shadowSide!==null?M.shadowSide:M.side:I.side=M.shadowSide!==null?M.shadowSide:p[M.side],I.alphaMap=M.alphaMap,I.alphaTest=M.alphaToCoverage===!0?.5:M.alphaTest,I.map=M.map,I.clipShadows=M.clipShadows,I.clippingPlanes=M.clippingPlanes,I.clipIntersection=M.clipIntersection,I.displacementMap=M.displacementMap,I.displacementScale=M.displacementScale,I.displacementBias=M.displacementBias,I.wireframeLinewidth=M.wireframeLinewidth,I.linewidth=M.linewidth,g.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let L=e.properties.get(I);L.light=g}return I}function v(C,M,g,b,I){if(C.visible===!1)return;if(C.layers.test(M.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&I===un)&&(!C.frustumCulled||C.intersectsFrustum(r))){C.modelViewMatrix.multiplyMatrices(g.matrixWorldInverse,C.matrixWorld);let L=t.update(C),V=C.material;if(Array.isArray(V)){let D=L.groups;for(let H=0,J=D.length;H<J;H++){let j=D[H],ue=V[j.materialIndex];if(ue&&ue.visible){let Z=A(C,ue,b,I);C.onBeforeShadow(e,C,M,g,L,Z,j),e.renderBufferDirect(g,null,L,Z,C,j),C.onAfterShadow(e,C,M,g,L,Z,j)}}}else if(V.visible){let D=A(C,V,b,I);C.onBeforeShadow(e,C,M,g,L,D,null),e.renderBufferDirect(g,null,L,D,C,null),C.onAfterShadow(e,C,M,g,L,D,null)}}let P=C.children;for(let L=0,V=P.length;L<V;L++)v(P[L],M,g,b,I)}function T(C){C.target.removeEventListener("dispose",T);for(let M in h){let g=h[M],b=C.target.uuid;b in g&&(g[b].dispose(),delete g[b])}}}function X5(e,t){function i(){let B=!1,Q=new Mt,ae=null,Ee=new Mt(0,0,0,0);return{setMask:function(Ue){ae!==Ue&&!B&&(e.colorMask(Ue,Ue,Ue,Ue),ae=Ue)},setLocked:function(Ue){B=Ue},setClear:function(Ue,oe,ye,Xe,Ft){Ft===!0&&(Ue*=Xe,oe*=Xe,ye*=Xe),Q.set(Ue,oe,ye,Xe),Ee.equals(Q)===!1&&(e.clearColor(Ue,oe,ye,Xe),Ee.copy(Q))},reset:function(){B=!1,ae=null,Ee.set(-1,0,0,0)}}}function r(){let B=!1,Q=!1,ae=null,Ee=null,Ue=null;return{setReversed:function(oe){if(Q!==oe){let ye=t.get("EXT_clip_control");oe?ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.ZERO_TO_ONE_EXT):ye.clipControlEXT(ye.LOWER_LEFT_EXT,ye.NEGATIVE_ONE_TO_ONE_EXT),Q=oe;let Xe=Ue;Ue=null,this.setClear(Xe)}},getReversed:function(){return Q},setTest:function(oe){oe?ne(e.DEPTH_TEST):Le(e.DEPTH_TEST)},setMask:function(oe){ae!==oe&&!B&&(e.depthMask(oe),ae=oe)},setFunc:function(oe){if(Q&&(oe=qp[oe]),Ee!==oe){switch(oe){case Zo:e.depthFunc(e.NEVER);break;case Jo:e.depthFunc(e.ALWAYS);break;case Ko:e.depthFunc(e.LESS);break;case vn:e.depthFunc(e.LEQUAL);break;case $o:e.depthFunc(e.EQUAL);break;case Qo:e.depthFunc(e.GEQUAL);break;case el:e.depthFunc(e.GREATER);break;case tl:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}Ee=oe}},setLocked:function(oe){B=oe},setClear:function(oe){Ue!==oe&&(Ue=oe,Q&&(oe=1-oe),e.clearDepth(oe))},reset:function(){B=!1,ae=null,Ee=null,Ue=null,Q=!1}}}function a(){let B=!1,Q=null,ae=null,Ee=null,Ue=null,oe=null,ye=null,Xe=null,Ft=null;return{setTest:function(dt){B||(dt?ne(e.STENCIL_TEST):Le(e.STENCIL_TEST))},setMask:function(dt){Q!==dt&&!B&&(e.stencilMask(dt),Q=dt)},setFunc:function(dt,Li,Zi){(ae!==dt||Ee!==Li||Ue!==Zi)&&(e.stencilFunc(dt,Li,Zi),ae=dt,Ee=Li,Ue=Zi)},setOp:function(dt,Li,Zi){(oe!==dt||ye!==Li||Xe!==Zi)&&(e.stencilOp(dt,Li,Zi),oe=dt,ye=Li,Xe=Zi)},setLocked:function(dt){B=dt},setClear:function(dt){Ft!==dt&&(e.clearStencil(dt),Ft=dt)},reset:function(){B=!1,Q=null,ae=null,Ee=null,Ue=null,oe=null,ye=null,Xe=null,Ft=null}}}let n=new i,s=new r,o=new a,l=new WeakMap,h=new WeakMap,c={},p={},u={},f=new WeakMap,_=[],y=null,m=!1,d=null,w=null,A=null,v=null,T=null,C=null,M=null,g=new Oe(0,0,0),b=0,I=!1,P=null,L=null,V=null,D=null,H=null,J=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),j=!1,ue=0,Z=e.getParameter(e.VERSION);Z.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(Z)[1]),j=ue>=1):Z.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),j=ue>=2);let K=null,te={},Ve=e.getParameter(e.SCISSOR_BOX),Ce=e.getParameter(e.VIEWPORT),ut=new Mt().fromArray(Ve),be=new Mt().fromArray(Ce);function k(B,Q,ae,Ee){let Ue=new Uint8Array(4),oe=e.createTexture();e.bindTexture(B,oe),e.texParameteri(B,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(B,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let ye=0;ye<ae;ye++)B===e.TEXTURE_3D||B===e.TEXTURE_2D_ARRAY?e.texImage3D(Q,0,e.RGBA,1,1,Ee,0,e.RGBA,e.UNSIGNED_BYTE,Ue):e.texImage2D(Q+ye,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,Ue);return oe}let $={};$[e.TEXTURE_2D]=k(e.TEXTURE_2D,e.TEXTURE_2D,1),$[e.TEXTURE_CUBE_MAP]=k(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[e.TEXTURE_2D_ARRAY]=k(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),$[e.TEXTURE_3D]=k(e.TEXTURE_3D,e.TEXTURE_3D,1,1),n.setClear(0,0,0,1),s.setClear(1),o.setClear(0),ne(e.DEPTH_TEST),s.setFunc(vn),Me(!1),De(z0),ne(e.CULL_FACE),ce(ir);function ne(B){c[B]!==!0&&(e.enable(B),c[B]=!0)}function Le(B){c[B]!==!1&&(e.disable(B),c[B]=!1)}function We(B,Q){return u[B]!==Q?(e.bindFramebuffer(B,Q),u[B]=Q,B===e.DRAW_FRAMEBUFFER&&(u[e.FRAMEBUFFER]=Q),B===e.FRAMEBUFFER&&(u[e.DRAW_FRAMEBUFFER]=Q),!0):!1}function me(B,Q){let ae=_,Ee=!1;if(B){ae=f.get(Q),ae===void 0&&(ae=[],f.set(Q,ae));let Ue=B.textures;if(ae.length!==Ue.length||ae[0]!==e.COLOR_ATTACHMENT0){for(let oe=0,ye=Ue.length;oe<ye;oe++)ae[oe]=e.COLOR_ATTACHMENT0+oe;ae.length=Ue.length,Ee=!0}}else ae[0]!==e.BACK&&(ae[0]=e.BACK,Ee=!0);Ee&&e.drawBuffers(ae)}function it(B){return y!==B?(e.useProgram(B),y=B,!0):!1}let re={[Pa]:e.FUNC_ADD,[dp]:e.FUNC_SUBTRACT,[fp]:e.FUNC_REVERSE_SUBTRACT};re[mp]=e.MIN,re[gp]=e.MAX;let ie={[_p]:e.ZERO,[vp]:e.ONE,[xp]:e.SRC_COLOR,[tc]:e.SRC_ALPHA,[Tp]:e.SRC_ALPHA_SATURATE,[Mp]:e.DST_COLOR,[bp]:e.DST_ALPHA,[yp]:e.ONE_MINUS_SRC_COLOR,[ic]:e.ONE_MINUS_SRC_ALPHA,[Ep]:e.ONE_MINUS_DST_COLOR,[Sp]:e.ONE_MINUS_DST_ALPHA,[wp]:e.CONSTANT_COLOR,[Ap]:e.ONE_MINUS_CONSTANT_COLOR,[Rp]:e.CONSTANT_ALPHA,[Cp]:e.ONE_MINUS_CONSTANT_ALPHA};function ce(B,Q,ae,Ee,Ue,oe,ye,Xe,Ft,dt){if(B===ir){m===!0&&(Le(e.BLEND),m=!1);return}if(m===!1&&(ne(e.BLEND),m=!0),B!==pp){if(B!==d||dt!==I){if((w!==Pa||T!==Pa)&&(e.blendEquation(e.FUNC_ADD),w=Pa,T=Pa),dt)switch(B){case fn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zi:e.blendFunc(e.ONE,e.ONE);break;case H0:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case V0:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ye("WebGLState: Invalid blending: ",B);break}else switch(B){case fn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case H0:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case V0:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",B);break}A=null,v=null,C=null,M=null,g.set(0,0,0),b=0,d=B,I=dt}return}Ue=Ue||Q,oe=oe||ae,ye=ye||Ee,(Q!==w||Ue!==T)&&(e.blendEquationSeparate(re[Q],re[Ue]),w=Q,T=Ue),(ae!==A||Ee!==v||oe!==C||ye!==M)&&(e.blendFuncSeparate(ie[ae],ie[Ee],ie[oe],ie[ye]),A=ae,v=Ee,C=oe,M=ye),(Xe.equals(g)===!1||Ft!==b)&&(e.blendColor(Xe.r,Xe.g,Xe.b,Ft),g.copy(Xe),b=Ft),d=B,I=!1}function Se(B,Q){B.side===ri?Le(e.CULL_FACE):ne(e.CULL_FACE);let ae=B.side===Gt;Q&&(ae=!ae),Me(ae),B.blending===fn&&B.transparent===!1?ce(ir):ce(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),s.setFunc(B.depthFunc),s.setTest(B.depthTest),s.setMask(B.depthWrite),n.setMask(B.colorWrite);let Ee=B.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Je(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ne(e.SAMPLE_ALPHA_TO_COVERAGE):Le(e.SAMPLE_ALPHA_TO_COVERAGE)}function Me(B){P!==B&&(B?e.frontFace(e.CW):e.frontFace(e.CCW),P=B)}function De(B){B!==hp?(ne(e.CULL_FACE),B!==L&&(B===z0?e.cullFace(e.BACK):B===cp?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Le(e.CULL_FACE),L=B}function Ge(B){B!==V&&(j&&e.lineWidth(B),V=B)}function Je(B,Q,ae){B?(ne(e.POLYGON_OFFSET_FILL),(D!==Q||H!==ae)&&(D=Q,H=ae,s.getReversed()&&(Q=-Q),e.polygonOffset(Q,ae))):Le(e.POLYGON_OFFSET_FILL)}function $e(B){B?ne(e.SCISSOR_TEST):Le(e.SCISSOR_TEST)}function N(B){B===void 0&&(B=e.TEXTURE0+J-1),K!==B&&(e.activeTexture(B),K=B)}function xt(B,Q,ae){ae===void 0&&(K===null?ae=e.TEXTURE0+J-1:ae=K);let Ee=te[ae];Ee===void 0&&(Ee={type:void 0,texture:void 0},te[ae]=Ee),(Ee.type!==B||Ee.texture!==Q)&&(K!==ae&&(e.activeTexture(ae),K=ae),e.bindTexture(B,Q||$[B]),Ee.type=B,Ee.texture=Q)}function nt(){let B=te[K];B!==void 0&&B.type!==void 0&&(e.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function rt(){try{e.compressedTexImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function R(){try{e.compressedTexImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function S(){try{e.texSubImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function O(){try{e.texSubImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function q(){try{e.compressedTexSubImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function ee(){try{e.compressedTexSubImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function fe(){try{e.texStorage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function ge(){try{e.texStorage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function z(){try{e.texImage2D(...arguments)}catch(B){Ye("WebGLState:",B)}}function pe(){try{e.texImage3D(...arguments)}catch(B){Ye("WebGLState:",B)}}function ve(B){return p[B]!==void 0?p[B]:e.getParameter(B)}function Ie(B,Q){p[B]!==Q&&(e.pixelStorei(B,Q),p[B]=Q)}function le(B){ut.equals(B)===!1&&(e.scissor(B.x,B.y,B.z,B.w),ut.copy(B))}function Be(B){be.equals(B)===!1&&(e.viewport(B.x,B.y,B.z,B.w),be.copy(B))}function ze(B,Q){let ae=h.get(Q);ae===void 0&&(ae=new WeakMap,h.set(Q,ae));let Ee=ae.get(B);Ee===void 0&&(Ee=e.getUniformBlockIndex(Q,B.name),ae.set(B,Ee))}function Ze(B,Q){let ae=h.get(Q).get(B);l.get(Q)!==ae&&(e.uniformBlockBinding(Q,ae,B.__bindingPointIndex),l.set(Q,ae))}function pt(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),c={},p={},K=null,te={},u={},f=new WeakMap,_=[],y=null,m=!1,d=null,w=null,A=null,v=null,T=null,C=null,M=null,g=new Oe(0,0,0),b=0,I=!1,P=null,L=null,V=null,D=null,H=null,ut.set(0,0,e.canvas.width,e.canvas.height),be.set(0,0,e.canvas.width,e.canvas.height),n.reset(),s.reset(),o.reset()}return{buffers:{color:n,depth:s,stencil:o},enable:ne,disable:Le,bindFramebuffer:We,drawBuffers:me,useProgram:it,setBlending:ce,setMaterial:Se,setFlipSided:Me,setCullFace:De,setLineWidth:Ge,setPolygonOffset:Je,setScissorTest:$e,activeTexture:N,bindTexture:xt,unbindTexture:nt,compressedTexImage2D:rt,compressedTexImage3D:R,texImage2D:z,texImage3D:pe,pixelStorei:Ie,getParameter:ve,updateUBOMapping:ze,uniformBlockBinding:Ze,texStorage2D:fe,texStorage3D:ge,texSubImage2D:S,texSubImage3D:O,compressedTexSubImage2D:q,compressedTexSubImage3D:ee,scissor:le,viewport:Be,reset:pt}}function Y5(e,t,i,r,a,n,s){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new se,c=new WeakMap,p=new Set,u,f=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,S){return _?new OffscreenCanvas(R,S):Ns("canvas")}function m(R,S,O){let q=1,ee=rt(R);if((ee.width>O||ee.height>O)&&(q=O/Math.max(ee.width,ee.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let fe=Math.floor(q*ee.width),ge=Math.floor(q*ee.height);u===void 0&&(u=y(fe,ge));let z=S?y(fe,ge):u;return z.width=fe,z.height=ge,z.getContext("2d").drawImage(R,0,0,fe,ge),qe("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+fe+"x"+ge+")."),z}else return"data"in R&&qe("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),R;return R}function d(R){return R.generateMipmaps}function w(R){e.generateMipmap(R)}function A(R){return R.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?e.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function v(R,S,O,q,ee,fe=!1){if(R!==null){if(e[R]!==void 0)return e[R];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ge;q&&(ge=t.get("EXT_texture_norm16"),ge||qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let z=S;if(S===e.RED&&(O===e.FLOAT&&(z=e.R32F),O===e.HALF_FLOAT&&(z=e.R16F),O===e.UNSIGNED_BYTE&&(z=e.R8),O===e.UNSIGNED_SHORT&&ge&&(z=ge.R16_EXT),O===e.SHORT&&ge&&(z=ge.R16_SNORM_EXT)),S===e.RED_INTEGER&&(O===e.UNSIGNED_BYTE&&(z=e.R8UI),O===e.UNSIGNED_SHORT&&(z=e.R16UI),O===e.UNSIGNED_INT&&(z=e.R32UI),O===e.BYTE&&(z=e.R8I),O===e.SHORT&&(z=e.R16I),O===e.INT&&(z=e.R32I)),S===e.RG&&(O===e.FLOAT&&(z=e.RG32F),O===e.HALF_FLOAT&&(z=e.RG16F),O===e.UNSIGNED_BYTE&&(z=e.RG8),O===e.UNSIGNED_SHORT&&ge&&(z=ge.RG16_EXT),O===e.SHORT&&ge&&(z=ge.RG16_SNORM_EXT)),S===e.RG_INTEGER&&(O===e.UNSIGNED_BYTE&&(z=e.RG8UI),O===e.UNSIGNED_SHORT&&(z=e.RG16UI),O===e.UNSIGNED_INT&&(z=e.RG32UI),O===e.BYTE&&(z=e.RG8I),O===e.SHORT&&(z=e.RG16I),O===e.INT&&(z=e.RG32I)),S===e.RGB_INTEGER&&(O===e.UNSIGNED_BYTE&&(z=e.RGB8UI),O===e.UNSIGNED_SHORT&&(z=e.RGB16UI),O===e.UNSIGNED_INT&&(z=e.RGB32UI),O===e.BYTE&&(z=e.RGB8I),O===e.SHORT&&(z=e.RGB16I),O===e.INT&&(z=e.RGB32I)),S===e.RGBA_INTEGER&&(O===e.UNSIGNED_BYTE&&(z=e.RGBA8UI),O===e.UNSIGNED_SHORT&&(z=e.RGBA16UI),O===e.UNSIGNED_INT&&(z=e.RGBA32UI),O===e.BYTE&&(z=e.RGBA8I),O===e.SHORT&&(z=e.RGBA16I),O===e.INT&&(z=e.RGBA32I)),S===e.RGB&&(O===e.UNSIGNED_SHORT&&ge&&(z=ge.RGB16_EXT),O===e.SHORT&&ge&&(z=ge.RGB16_SNORM_EXT),O===e.UNSIGNED_INT_5_9_9_9_REV&&(z=e.RGB9_E5),O===e.UNSIGNED_INT_10F_11F_11F_REV&&(z=e.R11F_G11F_B10F)),S===e.RGBA){let pe=fe?Us:ot.getTransfer(ee);O===e.FLOAT&&(z=e.RGBA32F),O===e.HALF_FLOAT&&(z=e.RGBA16F),O===e.UNSIGNED_BYTE&&(z=pe===ft?e.SRGB8_ALPHA8:e.RGBA8),O===e.UNSIGNED_SHORT&&ge&&(z=ge.RGBA16_EXT),O===e.SHORT&&ge&&(z=ge.RGBA16_SNORM_EXT),O===e.UNSIGNED_SHORT_4_4_4_4&&(z=e.RGBA4),O===e.UNSIGNED_SHORT_5_5_5_1&&(z=e.RGB5_A1)}return(z===e.R16F||z===e.R32F||z===e.RG16F||z===e.RG32F||z===e.RGBA16F||z===e.RGBA32F)&&t.get("EXT_color_buffer_float"),z}function T(R,S){let O;return R?S===null||S===Hi||S===yn?O=e.DEPTH24_STENCIL8:S===Mi?O=e.DEPTH32F_STENCIL8:S===xn&&(O=e.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Hi||S===yn?O=e.DEPTH_COMPONENT24:S===Mi?O=e.DEPTH_COMPONENT32F:S===xn&&(O=e.DEPTH_COMPONENT16),O}function C(R,S){return d(R)===!0||R.isFramebufferTexture&&R.minFilter!==Bt&&R.minFilter!==Yt?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function M(R){let S=R.target;S.removeEventListener("dispose",M),b(S),S.isVideoTexture&&c.delete(S),S.isHTMLTexture&&p.delete(S)}function g(R){let S=R.target;S.removeEventListener("dispose",g),P(S)}function b(R){let S=r.get(R);if(S.__webglInit===void 0)return;let O=R.source,q=f.get(O);if(q){let ee=q[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&I(R),Object.keys(q).length===0&&f.delete(O)}r.remove(R)}function I(R){let S=r.get(R);e.deleteTexture(S.__webglTexture);let O=R.source,q=f.get(O);delete q[S.__cacheKey],s.memory.textures--}function P(R){let S=r.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),r.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(S.__webglFramebuffer[q]))for(let ee=0;ee<S.__webglFramebuffer[q].length;ee++)e.deleteFramebuffer(S.__webglFramebuffer[q][ee]);else e.deleteFramebuffer(S.__webglFramebuffer[q]);S.__webglDepthbuffer&&e.deleteRenderbuffer(S.__webglDepthbuffer[q])}else{if(Array.isArray(S.__webglFramebuffer))for(let q=0;q<S.__webglFramebuffer.length;q++)e.deleteFramebuffer(S.__webglFramebuffer[q]);else e.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&e.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&e.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let q=0;q<S.__webglColorRenderbuffer.length;q++)S.__webglColorRenderbuffer[q]&&e.deleteRenderbuffer(S.__webglColorRenderbuffer[q]);S.__webglDepthRenderbuffer&&e.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let O=R.textures;for(let q=0,ee=O.length;q<ee;q++){let fe=r.get(O[q]);fe.__webglTexture&&(e.deleteTexture(fe.__webglTexture),s.memory.textures--),r.remove(O[q])}r.remove(R)}let L=0;function V(){L=0}function D(){return L}function H(R){L=R}function J(){let R=L;return R>=a.maxTextures&&qe("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+a.maxTextures),L+=1,R}function j(R){let S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function ue(R,S){let O=r.get(R);if(R.isVideoTexture&&xt(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){let q=R.image;if(q===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{Le(O,R,S);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);i.bindTexture(e.TEXTURE_2D,O.__webglTexture,e.TEXTURE0+S)}function Z(R,S){let O=r.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Le(O,R,S);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);i.bindTexture(e.TEXTURE_2D_ARRAY,O.__webglTexture,e.TEXTURE0+S)}function K(R,S){let O=r.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Le(O,R,S);return}i.bindTexture(e.TEXTURE_3D,O.__webglTexture,e.TEXTURE0+S)}function te(R,S){let O=r.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){We(O,R,S);return}i.bindTexture(e.TEXTURE_CUBE_MAP,O.__webglTexture,e.TEXTURE0+S)}let Ve={[Yr]:e.REPEAT,[tr]:e.CLAMP_TO_EDGE,[il]:e.MIRRORED_REPEAT},Ce={[Bt]:e.NEAREST,[Lp]:e.NEAREST_MIPMAP_NEAREST,[Da]:e.NEAREST_MIPMAP_LINEAR,[Yt]:e.LINEAR,[po]:e.LINEAR_MIPMAP_NEAREST,[kr]:e.LINEAR_MIPMAP_LINEAR},ut={[Op]:e.NEVER,[Vp]:e.ALWAYS,[Fp]:e.LESS,[Xl]:e.LEQUAL,[Bp]:e.EQUAL,[Yl]:e.GEQUAL,[zp]:e.GREATER,[Hp]:e.NOTEQUAL};function be(R,S){if(S.type===Mi&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Yt||S.magFilter===po||S.magFilter===Da||S.magFilter===kr||S.minFilter===Yt||S.minFilter===po||S.minFilter===Da||S.minFilter===kr)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(R,e.TEXTURE_WRAP_S,Ve[S.wrapS]),e.texParameteri(R,e.TEXTURE_WRAP_T,Ve[S.wrapT]),(R===e.TEXTURE_3D||R===e.TEXTURE_2D_ARRAY)&&e.texParameteri(R,e.TEXTURE_WRAP_R,Ve[S.wrapR]),e.texParameteri(R,e.TEXTURE_MAG_FILTER,Ce[S.magFilter]),e.texParameteri(R,e.TEXTURE_MIN_FILTER,Ce[S.minFilter]),S.compareFunction&&(e.texParameteri(R,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(R,e.TEXTURE_COMPARE_FUNC,ut[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Bt||S.minFilter!==Da&&S.minFilter!==kr||S.type===Mi&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||r.get(S).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");e.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,a.getMaxAnisotropy())),r.get(S).__currentAnisotropy=S.anisotropy}}}function k(R,S){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",M));let q=S.source,ee=f.get(q);ee===void 0&&(ee={},f.set(q,ee));let fe=j(S);if(fe!==R.__cacheKey){ee[fe]===void 0&&(ee[fe]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,O=!0),ee[fe].usedTimes++;let ge=ee[R.__cacheKey];ge!==void 0&&(ee[R.__cacheKey].usedTimes--,ge.usedTimes===0&&I(S)),R.__cacheKey=fe,R.__webglTexture=ee[fe].texture}return O}function $(R,S,O){return Math.floor(Math.floor(R/O)/S)}function ne(R,S,O,q){let ee=R.updateRanges;if(ee.length===0)i.texSubImage2D(e.TEXTURE_2D,0,0,0,S.width,S.height,O,q,S.data);else{ee.sort((ve,Ie)=>ve.start-Ie.start);let fe=0;for(let ve=1;ve<ee.length;ve++){let Ie=ee[fe],le=ee[ve],Be=Ie.start+Ie.count,ze=$(le.start,S.width,4),Ze=$(Ie.start,S.width,4);le.start<=Be+1&&ze===Ze&&$(le.start+le.count-1,S.width,4)===ze?Ie.count=Math.max(Ie.count,le.start+le.count-Ie.start):(++fe,ee[fe]=le)}ee.length=fe+1;let ge=i.getParameter(e.UNPACK_ROW_LENGTH),z=i.getParameter(e.UNPACK_SKIP_PIXELS),pe=i.getParameter(e.UNPACK_SKIP_ROWS);i.pixelStorei(e.UNPACK_ROW_LENGTH,S.width);for(let ve=0,Ie=ee.length;ve<Ie;ve++){let le=ee[ve],Be=Math.floor(le.start/4),ze=Math.ceil(le.count/4),Ze=Be%S.width,pt=Math.floor(Be/S.width),B=ze;i.pixelStorei(e.UNPACK_SKIP_PIXELS,Ze),i.pixelStorei(e.UNPACK_SKIP_ROWS,pt),i.texSubImage2D(e.TEXTURE_2D,0,Ze,pt,B,1,O,q,S.data)}R.clearUpdateRanges(),i.pixelStorei(e.UNPACK_ROW_LENGTH,ge),i.pixelStorei(e.UNPACK_SKIP_PIXELS,z),i.pixelStorei(e.UNPACK_SKIP_ROWS,pe)}}function Le(R,S,O){let q=e.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(q=e.TEXTURE_2D_ARRAY),S.isData3DTexture&&(q=e.TEXTURE_3D);let ee=k(R,S),fe=S.source;i.bindTexture(q,R.__webglTexture,e.TEXTURE0+O);let ge=r.get(fe);if(fe.version!==ge.__version||ee===!0){if(i.activeTexture(e.TEXTURE0+O),!(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)){let Q=ot.getPrimaries(ot.workingColorSpace),ae=S.colorSpace===br?null:ot.getPrimaries(S.colorSpace),Ee=S.colorSpace===br||Q===ae?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee)}i.pixelStorei(e.UNPACK_ALIGNMENT,S.unpackAlignment);let z=m(S.image,!1,a.maxTextureSize);z=nt(S,z);let pe=n.convert(S.format,S.colorSpace),ve=n.convert(S.type),Ie=v(S.internalFormat,pe,ve,S.normalized,S.colorSpace,S.isVideoTexture);be(q,S);let le,Be=S.mipmaps,ze=S.isVideoTexture!==!0,Ze=ge.__version===void 0||ee===!0,pt=fe.dataReady,B=C(S,z);if(S.isDepthTexture)Ie=T(S.format===Wr,S.type),Ze&&(ze?i.texStorage2D(e.TEXTURE_2D,1,Ie,z.width,z.height):i.texImage2D(e.TEXTURE_2D,0,Ie,z.width,z.height,0,pe,ve,null));else if(S.isDataTexture)if(Be.length>0){ze&&Ze&&i.texStorage2D(e.TEXTURE_2D,B,Ie,Be[0].width,Be[0].height);for(let Q=0,ae=Be.length;Q<ae;Q++)le=Be[Q],ze?pt&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,le.width,le.height,pe,ve,le.data):i.texImage2D(e.TEXTURE_2D,Q,Ie,le.width,le.height,0,pe,ve,le.data);S.generateMipmaps=!1}else ze?(Ze&&i.texStorage2D(e.TEXTURE_2D,B,Ie,z.width,z.height),pt&&ne(S,z,pe,ve)):i.texImage2D(e.TEXTURE_2D,0,Ie,z.width,z.height,0,pe,ve,z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ze&&Ze&&i.texStorage3D(e.TEXTURE_2D_ARRAY,B,Ie,Be[0].width,Be[0].height,z.depth);for(let Q=0,ae=Be.length;Q<ae;Q++)if(le=Be[Q],S.format!==Ei)if(pe!==null)if(ze){if(pt)if(S.layerUpdates.size>0){let Ee=Lh(le.width,le.height,S.format,S.type);for(let Ue of S.layerUpdates){let oe=le.data.subarray(Ue*Ee/le.data.BYTES_PER_ELEMENT,(Ue+1)*Ee/le.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,Ue,le.width,le.height,1,pe,oe)}}else i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,le.width,le.height,z.depth,pe,le.data)}else i.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Q,Ie,le.width,le.height,z.depth,0,le.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?pt&&i.texSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,le.width,le.height,z.depth,pe,ve,le.data):i.texImage3D(e.TEXTURE_2D_ARRAY,Q,Ie,le.width,le.height,z.depth,0,pe,ve,le.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{ze&&Ze&&i.texStorage2D(e.TEXTURE_2D,B,Ie,Be[0].width,Be[0].height);for(let Q=0,ae=Be.length;Q<ae;Q++)le=Be[Q],S.format!==Ei?pe!==null?ze?pt&&i.compressedTexSubImage2D(e.TEXTURE_2D,Q,0,0,le.width,le.height,pe,le.data):i.compressedTexImage2D(e.TEXTURE_2D,Q,Ie,le.width,le.height,0,le.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?pt&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,le.width,le.height,pe,ve,le.data):i.texImage2D(e.TEXTURE_2D,Q,Ie,le.width,le.height,0,pe,ve,le.data)}else if(S.isDataArrayTexture)if(ze){if(Ze&&i.texStorage3D(e.TEXTURE_2D_ARRAY,B,Ie,z.width,z.height,z.depth),pt)if(S.layerUpdates.size>0){let Q=Lh(z.width,z.height,S.format,S.type);for(let ae of S.layerUpdates){let Ee=z.data.subarray(ae*Q/z.data.BYTES_PER_ELEMENT,(ae+1)*Q/z.data.BYTES_PER_ELEMENT);i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,ae,z.width,z.height,1,pe,ve,Ee)}S.clearLayerUpdates()}else i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,z.width,z.height,z.depth,pe,ve,z.data)}else i.texImage3D(e.TEXTURE_2D_ARRAY,0,Ie,z.width,z.height,z.depth,0,pe,ve,z.data);else if(S.isData3DTexture)ze?(Ze&&i.texStorage3D(e.TEXTURE_3D,B,Ie,z.width,z.height,z.depth),pt&&i.texSubImage3D(e.TEXTURE_3D,0,0,0,0,z.width,z.height,z.depth,pe,ve,z.data)):i.texImage3D(e.TEXTURE_3D,0,Ie,z.width,z.height,z.depth,0,pe,ve,z.data);else if(S.isFramebufferTexture){if(Ze)if(ze)i.texStorage2D(e.TEXTURE_2D,B,Ie,z.width,z.height);else{let Q=z.width,ae=z.height;for(let Ee=0;Ee<B;Ee++)i.texImage2D(e.TEXTURE_2D,Ee,Ie,Q,ae,0,pe,ve,null),Q>>=1,ae>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in e){let Q=e.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),z.parentNode!==Q){Q.appendChild(z),p.add(S),Q.onpaint=ae=>{let Ee=ae.changedElements;for(let Ue of p)Ee.includes(Ue.image)&&(Ue.needsUpdate=!0)},Q.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,z);else{let ae=e.RGBA,Ee=e.RGBA,Ue=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,ae,Ee,Ue,z)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(Be.length>0){if(ze&&Ze){let Q=rt(Be[0]);i.texStorage2D(e.TEXTURE_2D,B,Ie,Q.width,Q.height)}for(let Q=0,ae=Be.length;Q<ae;Q++)le=Be[Q],ze?pt&&i.texSubImage2D(e.TEXTURE_2D,Q,0,0,pe,ve,le):i.texImage2D(e.TEXTURE_2D,Q,Ie,pe,ve,le);S.generateMipmaps=!1}else if(ze){if(Ze){let Q=rt(z);i.texStorage2D(e.TEXTURE_2D,B,Ie,Q.width,Q.height)}pt&&i.texSubImage2D(e.TEXTURE_2D,0,0,0,pe,ve,z)}else i.texImage2D(e.TEXTURE_2D,0,Ie,pe,ve,z);d(S)&&w(q),ge.__version=fe.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function We(R,S,O){if(S.image.length!==6)return;let q=k(R,S),ee=S.source;i.bindTexture(e.TEXTURE_CUBE_MAP,R.__webglTexture,e.TEXTURE0+O);let fe=r.get(ee);if(ee.version!==fe.__version||q===!0){i.activeTexture(e.TEXTURE0+O);let ge=ot.getPrimaries(ot.workingColorSpace),z=S.colorSpace===br?null:ot.getPrimaries(S.colorSpace),pe=S.colorSpace===br||ge===z?e.NONE:e.BROWSER_DEFAULT_WEBGL;i.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(e.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);let ve=S.isCompressedTexture||S.image[0].isCompressedTexture,Ie=S.image[0]&&S.image[0].isDataTexture,le=[];for(let oe=0;oe<6;oe++)!ve&&!Ie?le[oe]=m(S.image[oe],!0,a.maxCubemapSize):le[oe]=Ie?S.image[oe].image:S.image[oe],le[oe]=nt(S,le[oe]);let Be=le[0],ze=n.convert(S.format,S.colorSpace),Ze=n.convert(S.type),pt=v(S.internalFormat,ze,Ze,S.normalized,S.colorSpace),B=S.isVideoTexture!==!0,Q=fe.__version===void 0||q===!0,ae=ee.dataReady,Ee=C(S,Be);be(e.TEXTURE_CUBE_MAP,S);let Ue;if(ve){B&&Q&&i.texStorage2D(e.TEXTURE_CUBE_MAP,Ee,pt,Be.width,Be.height);for(let oe=0;oe<6;oe++){Ue=le[oe].mipmaps;for(let ye=0;ye<Ue.length;ye++){let Xe=Ue[ye];S.format!==Ei?ze!==null?B?ae&&i.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye,0,0,Xe.width,Xe.height,ze,Xe.data):i.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye,pt,Xe.width,Xe.height,0,Xe.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?ae&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye,0,0,Xe.width,Xe.height,ze,Ze,Xe.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye,pt,Xe.width,Xe.height,0,ze,Ze,Xe.data)}}}else{if(Ue=S.mipmaps,B&&Q){Ue.length>0&&Ee++;let oe=rt(le[0]);i.texStorage2D(e.TEXTURE_CUBE_MAP,Ee,pt,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Ie){B?ae&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,le[oe].width,le[oe].height,ze,Ze,le[oe].data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,pt,le[oe].width,le[oe].height,0,ze,Ze,le[oe].data);for(let ye=0;ye<Ue.length;ye++){let Xe=Ue[ye].image[oe].image;B?ae&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye+1,0,0,Xe.width,Xe.height,ze,Ze,Xe.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye+1,pt,Xe.width,Xe.height,0,ze,Ze,Xe.data)}}else{B?ae&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ze,Ze,le[oe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,pt,ze,Ze,le[oe]);for(let ye=0;ye<Ue.length;ye++){let Xe=Ue[ye];B?ae&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye+1,0,0,ze,Ze,Xe.image[oe]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye+1,pt,ze,Ze,Xe.image[oe])}}}d(S)&&w(e.TEXTURE_CUBE_MAP),fe.__version=ee.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function me(R,S,O,q,ee,fe){let ge=n.convert(O.format,O.colorSpace),z=n.convert(O.type),pe=v(O.internalFormat,ge,z,O.normalized,O.colorSpace),ve=r.get(S),Ie=r.get(O);if(Ie.__renderTarget=S,!ve.__hasExternalTextures){let le=Math.max(1,S.width>>fe),Be=Math.max(1,S.height>>fe);ee===e.TEXTURE_3D||ee===e.TEXTURE_2D_ARRAY?i.texImage3D(ee,fe,pe,le,Be,S.depth,0,ge,z,null):i.texImage2D(ee,fe,pe,le,Be,0,ge,z,null)}i.bindFramebuffer(e.FRAMEBUFFER,R),N(S)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,q,ee,Ie.__webglTexture,0,$e(S)):(ee===e.TEXTURE_2D||ee>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,q,ee,Ie.__webglTexture,fe),i.bindFramebuffer(e.FRAMEBUFFER,null)}function it(R,S,O){if(e.bindRenderbuffer(e.RENDERBUFFER,R),S.depthBuffer){let q=S.depthTexture,ee=q&&q.isDepthTexture?q.type:null,fe=T(S.stencilBuffer,ee),ge=S.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;N(S)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,$e(S),fe,S.width,S.height):O?e.renderbufferStorageMultisample(e.RENDERBUFFER,$e(S),fe,S.width,S.height):e.renderbufferStorage(e.RENDERBUFFER,fe,S.width,S.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ge,e.RENDERBUFFER,R)}else{let q=S.textures;for(let ee=0;ee<q.length;ee++){let fe=q[ee],ge=n.convert(fe.format,fe.colorSpace),z=n.convert(fe.type),pe=v(fe.internalFormat,ge,z,fe.normalized,fe.colorSpace);N(S)?o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,$e(S),pe,S.width,S.height):O?e.renderbufferStorageMultisample(e.RENDERBUFFER,$e(S),pe,S.width,S.height):e.renderbufferStorage(e.RENDERBUFFER,pe,S.width,S.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function re(R,S,O){let q=S.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(e.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ee=r.get(S.depthTexture);if(ee.__renderTarget=S,(!ee.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),q){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,S.depthTexture.addEventListener("dispose",M)),ee.__webglTexture===void 0){ee.__webglTexture=e.createTexture(),i.bindTexture(e.TEXTURE_CUBE_MAP,ee.__webglTexture),be(e.TEXTURE_CUBE_MAP,S.depthTexture);let ve=n.convert(S.depthTexture.format),Ie=n.convert(S.depthTexture.type),le;S.depthTexture.format===ar?le=e.DEPTH_COMPONENT24:S.depthTexture.format===Wr&&(le=e.DEPTH24_STENCIL8);for(let Be=0;Be<6;Be++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+Be,0,le,S.width,S.height,0,ve,Ie,null)}}else ue(S.depthTexture,0);let fe=ee.__webglTexture,ge=$e(S),z=q?e.TEXTURE_CUBE_MAP_POSITIVE_X+O:e.TEXTURE_2D,pe=S.depthTexture.format===Wr?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(S.depthTexture.format===ar)N(S)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,pe,z,fe,0,ge):e.framebufferTexture2D(e.FRAMEBUFFER,pe,z,fe,0);else if(S.depthTexture.format===Wr)N(S)?o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,pe,z,fe,0,ge):e.framebufferTexture2D(e.FRAMEBUFFER,pe,z,fe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(R){let S=r.get(R),O=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){let q=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),q){let ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,q.removeEventListener("dispose",ee)};q.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=q}if(R.depthTexture&&!S.__autoAllocateDepthBuffer)if(O)for(let q=0;q<6;q++)re(S.__webglFramebuffer[q],R,q);else{let q=R.texture.mipmaps;q&&q.length>0?re(S.__webglFramebuffer[0],R,0):re(S.__webglFramebuffer,R,0)}else if(O){S.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(i.bindFramebuffer(e.FRAMEBUFFER,S.__webglFramebuffer[q]),S.__webglDepthbuffer[q]===void 0)S.__webglDepthbuffer[q]=e.createRenderbuffer(),it(S.__webglDepthbuffer[q],R,!1);else{let ee=R.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer[q];e.bindRenderbuffer(e.RENDERBUFFER,fe),e.framebufferRenderbuffer(e.FRAMEBUFFER,ee,e.RENDERBUFFER,fe)}}else{let q=R.texture.mipmaps;if(q&&q.length>0?i.bindFramebuffer(e.FRAMEBUFFER,S.__webglFramebuffer[0]):i.bindFramebuffer(e.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=e.createRenderbuffer(),it(S.__webglDepthbuffer,R,!1);else{let ee=R.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,fe),e.framebufferRenderbuffer(e.FRAMEBUFFER,ee,e.RENDERBUFFER,fe)}}i.bindFramebuffer(e.FRAMEBUFFER,null)}function ce(R,S,O){let q=r.get(R);S!==void 0&&me(q.__webglFramebuffer,R,R.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),O!==void 0&&ie(R)}function Se(R){let S=R.texture,O=r.get(R),q=r.get(S);R.addEventListener("dispose",g);let ee=R.textures,fe=R.isWebGLCubeRenderTarget===!0,ge=ee.length>1;if(ge||(q.__webglTexture===void 0&&(q.__webglTexture=e.createTexture()),q.__version=S.version,s.memory.textures++),fe){O.__webglFramebuffer=[];for(let z=0;z<6;z++)if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[z]=[];for(let pe=0;pe<S.mipmaps.length;pe++)O.__webglFramebuffer[z][pe]=e.createFramebuffer()}else O.__webglFramebuffer[z]=e.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let z=0;z<S.mipmaps.length;z++)O.__webglFramebuffer[z]=e.createFramebuffer()}else O.__webglFramebuffer=e.createFramebuffer();if(ge)for(let z=0,pe=ee.length;z<pe;z++){let ve=r.get(ee[z]);ve.__webglTexture===void 0&&(ve.__webglTexture=e.createTexture(),s.memory.textures++)}if(R.samples>0&&N(R)===!1){O.__webglMultisampledFramebuffer=e.createFramebuffer(),O.__webglColorRenderbuffer=[],i.bindFramebuffer(e.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let z=0;z<ee.length;z++){let pe=ee[z];O.__webglColorRenderbuffer[z]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,O.__webglColorRenderbuffer[z]);let ve=n.convert(pe.format,pe.colorSpace),Ie=n.convert(pe.type),le=v(pe.internalFormat,ve,Ie,pe.normalized,pe.colorSpace,R.isXRRenderTarget===!0),Be=$e(R);e.renderbufferStorageMultisample(e.RENDERBUFFER,Be,le,R.width,R.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+z,e.RENDERBUFFER,O.__webglColorRenderbuffer[z])}e.bindRenderbuffer(e.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=e.createRenderbuffer(),it(O.__webglDepthRenderbuffer,R,!0)),i.bindFramebuffer(e.FRAMEBUFFER,null)}}if(fe){i.bindTexture(e.TEXTURE_CUBE_MAP,q.__webglTexture),be(e.TEXTURE_CUBE_MAP,S);for(let z=0;z<6;z++)if(S.mipmaps&&S.mipmaps.length>0)for(let pe=0;pe<S.mipmaps.length;pe++)me(O.__webglFramebuffer[z][pe],R,S,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+z,pe);else me(O.__webglFramebuffer[z],R,S,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+z,0);d(S)&&w(e.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(ge){for(let z=0,pe=ee.length;z<pe;z++){let ve=ee[z],Ie=r.get(ve),le=e.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(le=R.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(le,Ie.__webglTexture),be(le,ve),me(O.__webglFramebuffer,R,ve,e.COLOR_ATTACHMENT0+z,le,0),d(ve)&&w(le)}i.unbindTexture()}else{let z=e.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(z=R.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(z,q.__webglTexture),be(z,S),S.mipmaps&&S.mipmaps.length>0)for(let pe=0;pe<S.mipmaps.length;pe++)me(O.__webglFramebuffer[pe],R,S,e.COLOR_ATTACHMENT0,z,pe);else me(O.__webglFramebuffer,R,S,e.COLOR_ATTACHMENT0,z,0);d(S)&&w(z),i.unbindTexture()}R.depthBuffer&&ie(R)}function Me(R){let S=R.textures;for(let O=0,q=S.length;O<q;O++){let ee=S[O];if(d(ee)){let fe=A(R),ge=r.get(ee).__webglTexture;i.bindTexture(fe,ge),w(fe),i.unbindTexture()}}}let De=[],Ge=[];function Je(R){if(R.samples>0){if(N(R)===!1){let S=R.textures,O=R.width,q=R.height,ee=e.COLOR_BUFFER_BIT,fe=R.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ge=r.get(R),z=S.length>1;if(z)for(let ve=0;ve<S.length;ve++)i.bindFramebuffer(e.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ve,e.RENDERBUFFER,null),i.bindFramebuffer(e.FRAMEBUFFER,ge.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ve,e.TEXTURE_2D,null,0);i.bindFramebuffer(e.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let pe=R.texture.mipmaps;pe&&pe.length>0?i.bindFramebuffer(e.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):i.bindFramebuffer(e.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let ve=0;ve<S.length;ve++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ee|=e.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ee|=e.STENCIL_BUFFER_BIT)),z){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);let Ie=r.get(S[ve]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Ie,0)}e.blitFramebuffer(0,0,O,q,0,0,O,q,ee,e.NEAREST),l===!0&&(De.length=0,Ge.length=0,De.push(e.COLOR_ATTACHMENT0+ve),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(De.push(fe),Ge.push(fe),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ge)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,De))}if(i.bindFramebuffer(e.READ_FRAMEBUFFER,null),i.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),z)for(let ve=0;ve<S.length;ve++){i.bindFramebuffer(e.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ve,e.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);let Ie=r.get(S[ve]).__webglTexture;i.bindFramebuffer(e.FRAMEBUFFER,ge.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+ve,e.TEXTURE_2D,Ie,0)}i.bindFramebuffer(e.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let S=R.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[S])}}}function $e(R){return Math.min(a.maxSamples,R.samples)}function N(R){let S=r.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function xt(R){let S=s.render.frame;c.get(R)!==S&&(c.set(R,S),R.update())}function nt(R,S){let O=R.colorSpace,q=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==Ds&&O!==br&&(ot.getTransfer(O)===ft?(q!==Ei||ee!==hi)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",O)),S}function rt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(h.width=R.naturalWidth||R.width,h.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(h.width=R.displayWidth,h.height=R.displayHeight):(h.width=R.width,h.height=R.height),h}this.allocateTextureUnit=J,this.resetTextureUnits=V,this.getTextureUnits=D,this.setTextureUnits=H,this.setTexture2D=ue,this.setTexture2DArray=Z,this.setTexture3D=K,this.setTextureCube=te,this.rebindTextures=ce,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=Je,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=me,this.useMultisampledRTT=N,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function Z5(e,t){function i(r,a=br){let n,s=ot.getTransfer(a);if(r===hi)return e.UNSIGNED_BYTE;if(r===Vl)return e.UNSIGNED_SHORT_4_4_4_4;if(r===Gl)return e.UNSIGNED_SHORT_5_5_5_1;if(r===dc)return e.UNSIGNED_INT_5_9_9_9_REV;if(r===fc)return e.UNSIGNED_INT_10F_11F_11F_REV;if(r===uc)return e.BYTE;if(r===pc)return e.SHORT;if(r===xn)return e.UNSIGNED_SHORT;if(r===Hl)return e.INT;if(r===Hi)return e.UNSIGNED_INT;if(r===Mi)return e.FLOAT;if(r===Vi)return e.HALF_FLOAT;if(r===mc)return e.ALPHA;if(r===gc)return e.RGB;if(r===Ei)return e.RGBA;if(r===ar)return e.DEPTH_COMPONENT;if(r===Wr)return e.DEPTH_STENCIL;if(r===kl)return e.RED;if(r===Wl)return e.RED_INTEGER;if(r===Zr)return e.RG;if(r===jl)return e.RG_INTEGER;if(r===ql)return e.RGBA_INTEGER;if(r===Ms||r===Es||r===Ts||r===ws)if(s===ft)if(n=t.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(r===Ms)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Es)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ts)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ws)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=t.get("WEBGL_compressed_texture_s3tc"),n!==null){if(r===Ms)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Es)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ts)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ws)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===rl||r===al||r===nl||r===sl)if(n=t.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(r===rl)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===al)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===nl)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===sl)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ol||r===ll||r===hl||r===cl||r===ul||r===Ps||r===pl)if(n=t.get("WEBGL_compressed_texture_etc"),n!==null){if(r===ol||r===ll)return s===ft?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(r===hl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(r===cl)return n.COMPRESSED_R11_EAC;if(r===ul)return n.COMPRESSED_SIGNED_R11_EAC;if(r===Ps)return n.COMPRESSED_RG11_EAC;if(r===pl)return n.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===dl||r===fl||r===ml||r===gl||r===_l||r===vl||r===xl||r===yl||r===bl||r===Sl||r===Ml||r===El||r===Tl||r===wl)if(n=t.get("WEBGL_compressed_texture_astc"),n!==null){if(r===dl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===fl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ml)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===gl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===_l)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===vl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===xl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===yl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===bl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Sl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ml)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===El)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Tl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===wl)return s===ft?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Al||r===Rl||r===Cl)if(n=t.get("EXT_texture_compression_bptc"),n!==null){if(r===Al)return s===ft?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Rl)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Cl)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Pl||r===Il||r===Is||r===Ll)if(n=t.get("EXT_texture_compression_rgtc"),n!==null){if(r===Pl)return n.COMPRESSED_RED_RGTC1_EXT;if(r===Il)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Is)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ll)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===yn?e.UNSIGNED_INT_24_8:e[r]!==void 0?e[r]:null}return{convert:i}}var J5=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,K5=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$5=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Bc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Gi({vertexShader:J5,fragmentShader:K5,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ke(new or(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Q5=class extends Kr{constructor(e,t){super();let i=this,r=null,a=1,n=null,s="local-floor",o=1,l=null,h=null,c=null,p=null,u=null,f=null,_=typeof XRWebGLBinding<"u",y=new $5,m={},d=t.getContextAttributes(),w=null,A=null,v=[],T=[],C=new se,M=null,g=null,b=new Xt;b.viewport=new Mt;let I=new Xt;I.viewport=new Mt;let P=[b,I],L=new K1,V=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let $=v[k];return $===void 0&&($=new bo,v[k]=$),$.getTargetRaySpace()},this.getControllerGrip=function(k){let $=v[k];return $===void 0&&($=new bo,v[k]=$),$.getGripSpace()},this.getHand=function(k){let $=v[k];return $===void 0&&($=new bo,v[k]=$),$.getHandSpace()};function H(k){let $=T.indexOf(k.inputSource);if($===-1)return;let ne=v[$];ne!==void 0&&(ne.update(k.inputSource,k.frame,l||n),ne.dispatchEvent({type:k.type,data:k.inputSource}))}function J(){r.removeEventListener("select",H),r.removeEventListener("selectstart",H),r.removeEventListener("selectend",H),r.removeEventListener("squeeze",H),r.removeEventListener("squeezestart",H),r.removeEventListener("squeezeend",H),r.removeEventListener("end",J),r.removeEventListener("inputsourceschange",j);for(let k=0;k<v.length;k++){let $=T[k];$!==null&&(T[k]=null,v[k].disconnect($))}V=null,D=null,y.reset();for(let k in m)delete m[k];if(e.setRenderTarget(w),u=null,p=null,c=null,r=null,A=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(C.width,C.height,!1),g!==null){let k=g.camera;k.fov=g.fov,k.zoom=g.zoom,k.updateProjectionMatrix(),g=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){a=k,i.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){s=k,i.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||n},this.setReferenceSpace=function(k){l=k},this.getBaseLayer=function(){return p!==null?p:u},this.getBinding=function(){return c===null&&_&&(c=new XRWebGLBinding(r,t)),c},this.getFrame=function(){return f},this.getSession=function(){return r},this.setSession=async function(k){if(r=k,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",H),r.addEventListener("selectstart",H),r.addEventListener("selectend",H),r.addEventListener("squeeze",H),r.addEventListener("squeezestart",H),r.addEventListener("squeezeend",H),r.addEventListener("end",J),r.addEventListener("inputsourceschange",j),d.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let $=null,ne=null,Le=null;d.depth&&(Le=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=d.stencil?Wr:ar,ne=d.stencil?yn:Hi);let We={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:a};c=this.getBinding(),p=c.createProjectionLayer(We),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),A=new wi(p.textureWidth,p.textureHeight,{format:Ei,type:hi,depthTexture:new En(p.textureWidth,p.textureHeight,ne,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}else{let $={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(r,t,$),r.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),A=new wi(u.framebufferWidth,u.framebufferHeight,{format:Ei,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(o),l=null,n=await r.requestReferenceSpace(s),be.setContext(r),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function j(k){for(let $=0;$<k.removed.length;$++){let ne=k.removed[$],Le=T.indexOf(ne);Le>=0&&(T[Le]=null,v[Le].disconnect(ne))}for(let $=0;$<k.added.length;$++){let ne=k.added[$],Le=T.indexOf(ne);if(Le===-1){for(let me=0;me<v.length;me++)if(me>=T.length){T.push(ne),Le=me;break}else if(T[me]===null){T[me]=ne,Le=me;break}if(Le===-1)break}let We=v[Le];We&&We.connect(ne)}}let ue=new x,Z=new x;function K(k,$,ne){ue.setFromMatrixPosition($.matrixWorld),Z.setFromMatrixPosition(ne.matrixWorld);let Le=ue.distanceTo(Z),We=$.projectionMatrix.elements,me=ne.projectionMatrix.elements,it=We[14]/(We[10]-1),re=We[14]/(We[10]+1),ie=(We[9]+1)/We[5],ce=(We[9]-1)/We[5],Se=(We[8]-1)/We[0],Me=(me[8]+1)/me[0],De=it*Se,Ge=it*Me,Je=Le/(-Se+Me),$e=Je*-Se;if($.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX($e),k.translateZ(Je),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),We[10]===-1)k.projectionMatrix.copy($.projectionMatrix),k.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let N=it+Je,xt=re+Je,nt=De-$e,rt=Ge+(Le-$e),R=ie*re/xt*N,S=ce*re/xt*N;k.projectionMatrix.makePerspective(nt,rt,R,S,N,xt),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function te(k,$){$===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices($.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(r===null)return;let $=k.near,ne=k.far;y.texture!==null&&(y.depthNear>0&&($=y.depthNear),y.depthFar>0&&(ne=y.depthFar)),L.near=I.near=b.near=$,L.far=I.far=b.far=ne,(V!==L.near||D!==L.far)&&(r.updateRenderState({depthNear:L.near,depthFar:L.far}),V=L.near,D=L.far),L.layers.mask=k.layers.mask|6,b.layers.mask=L.layers.mask&-5,I.layers.mask=L.layers.mask&-3;let Le=k.parent,We=L.cameras;te(L,Le);for(let me=0;me<We.length;me++)te(We[me],Le);We.length===2?K(L,b,I):L.projectionMatrix.copy(b.projectionMatrix),g===null&&k.isPerspectiveCamera&&(g={camera:k,fov:k.fov,zoom:k.zoom}),Ve(k,L,Le)};function Ve(k,$,ne){ne===null?k.matrix.copy($.matrixWorld):(k.matrix.copy(ne.matrixWorld),k.matrix.invert(),k.matrix.multiply($.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy($.projectionMatrix),k.projectionMatrixInverse.copy($.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Mn*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(p===null&&u===null))return o},this.setFoveation=function(k){o=k,p!==null&&(p.fixedFoveation=k),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=k)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(L)},this.getCameraTexture=function(k){return m[k]};let Ce=null;function ut(k,$){if(h=$.getViewerPose(l||n),f=$,h!==null){let ne=h.views;u!==null&&(e.setRenderTargetFramebuffer(A,u.framebuffer),e.setRenderTarget(A));let Le=!1;ne.length!==L.cameras.length&&(L.cameras.length=0,Le=!0);for(let me=0;me<ne.length;me++){let it=ne[me],re=null;if(u!==null)re=u.getViewport(it);else{let ce=c.getViewSubImage(p,it);re=ce.viewport,me===0&&(e.setRenderTargetTextures(A,ce.colorTexture,ce.depthStencilTexture),e.setRenderTarget(A))}let ie=P[me];ie===void 0&&(ie=new Xt,ie.layers.enable(me),ie.viewport=new Mt,P[me]=ie),ie.matrix.fromArray(it.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(it.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(re.x,re.y,re.width,re.height),me===0&&(L.matrix.copy(ie.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Le===!0&&L.cameras.push(ie)}let We=r.enabledFeatures;if(We&&We.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){c=i.getBinding();let me=c.getDepthInformation(ne[0]);me&&me.isValid&&me.texture&&y.init(me,r.renderState)}if(We&&We.includes("camera-access")&&_){e.state.unbindTexture(),c=i.getBinding();for(let me=0;me<ne.length;me++){let it=ne[me].camera;if(it){let re=m[it];re||(re=new Bc,m[it]=re);let ie=c.getCameraImage(it);re.sourceTexture=ie}}}}for(let ne=0;ne<v.length;ne++){let Le=T[ne],We=v[ne];Le!==null&&We!==void 0&&We.update(Le,$,l||n)}Ce&&Ce(k,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),f=null}let be=new bu;be.setAnimationLoop(ut),this.setAnimationLoop=function(k){Ce=k},this.dispose=function(){}}},e3=new Ke,Ru=new Qe;Ru.set(-1,0,0,0,1,0,0,0,1);function t3(e,t){function i(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function r(m,d){d.color.getRGB(m.fogColor.value,mu(e)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function a(m,d,w,A,v){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?n(m,d):d.isMeshLambertMaterial?(n(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(n(m,d),p(m,d)):d.isMeshPhongMaterial?(n(m,d),c(m,d),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(n(m,d),u(m,d),d.isMeshPhysicalMaterial&&f(m,d,v)):d.isMeshMatcapMaterial?(n(m,d),_(m,d)):d.isMeshDepthMaterial?n(m,d):d.isMeshDistanceMaterial?(n(m,d),y(m,d)):d.isMeshNormalMaterial?n(m,d):d.isLineBasicMaterial?(s(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,w,A):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function n(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,i(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,i(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,i(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Gt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,i(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Gt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,i(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,i(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,i(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);let w=t.get(d),A=w.envMap,v=w.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(e3.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ru),m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,i(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,i(d.aoMap,m.aoMapTransform))}function s(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,i(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,w,A){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*w,m.scale.value=A*.5,d.map&&(m.map.value=d.map,i(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,i(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,i(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,i(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function p(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function u(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,i(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,i(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function f(m,d,w){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,i(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,i(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,i(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,i(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,i(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Gt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.retroreflectivity>0&&(m.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,i(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,i(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,i(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,i(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,i(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,i(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,i(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function y(m,d){let w=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function i3(e,t,i,r){let a={},n={},s=[],o=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,T){let C=T.program;r.uniformBlockBinding(v,C)}function h(v,T){let C=a[v.id];C===void 0&&(m(v),C=c(v),a[v.id]=C,v.addEventListener("dispose",w));let M=T.program;r.updateUBOMapping(v,M);let g=t.render.frame;n[v.id]!==g&&(u(v),n[v.id]=g)}function c(v){let T=p();v.__bindingPointIndex=T;let C=e.createBuffer(),M=v.__size,g=v.usage;return e.bindBuffer(e.UNIFORM_BUFFER,C),e.bufferData(e.UNIFORM_BUFFER,M,g),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,T,C),C}function p(){for(let v=0;v<o;v++)if(s.indexOf(v)===-1)return s.push(v),v;return Ye("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){let T=a[v.id],C=v.uniforms,M=v.__cache;e.bindBuffer(e.UNIFORM_BUFFER,T);for(let g=0,b=C.length;g<b;g++){let I=C[g];if(Array.isArray(I))for(let P=0,L=I.length;P<L;P++)f(I[P],g,P,M);else f(I,g,0,M)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function f(v,T,C,M){if(y(v,T,C,M)===!0){let g=v.__offset,b=v.value;if(Array.isArray(b)){let I=0;for(let P=0;P<b.length;P++){let L=b[P],V=d(L);_(L,v.__data,I),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(I+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(b,v.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,g,v.__data)}}function _(v,T,C){typeof v=="number"||typeof v=="boolean"?T[0]=v:v.isMatrix3?(T[0]=v.elements[0],T[1]=v.elements[1],T[2]=v.elements[2],T[3]=0,T[4]=v.elements[3],T[5]=v.elements[4],T[6]=v.elements[5],T[7]=0,T[8]=v.elements[6],T[9]=v.elements[7],T[10]=v.elements[8],T[11]=0):ArrayBuffer.isView(v)?T.set(new v.constructor(v.buffer,v.byteOffset,T.length)):v.toArray(T,C)}function y(v,T,C,M){let g=v.value,b=T+"_"+C;if(M[b]===void 0)return typeof g=="number"||typeof g=="boolean"?M[b]=g:ArrayBuffer.isView(g)?M[b]=g.slice():M[b]=g.clone(),!0;{let I=M[b];if(typeof g=="number"||typeof g=="boolean"){if(I!==g)return M[b]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(I.equals(g)===!1)return I.copy(g),!0}}return!1}function m(v){let T=v.uniforms,C=0,M=16;for(let b=0,I=T.length;b<I;b++){let P=Array.isArray(T[b])?T[b]:[T[b]];for(let L=0,V=P.length;L<V;L++){let D=P[L],H=Array.isArray(D.value)?D.value:[D.value];for(let J=0,j=H.length;J<j;J++){let ue=H[J],Z=d(ue),K=C%M,te=K%Z.boundary,Ve=K+te;C+=te,Ve!==0&&M-Ve<Z.storage&&(C+=M-Ve),D.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=C,C+=Z.storage}}}let g=C%M;return g>0&&(C+=M-g),v.__size=C,v.__cache={},this}function d(v){let T={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(T.boundary=4,T.storage=4):v.isVector2?(T.boundary=8,T.storage=8):v.isVector3||v.isColor?(T.boundary=16,T.storage=12):v.isVector4?(T.boundary=16,T.storage=16):v.isMatrix3?(T.boundary=48,T.storage=48):v.isMatrix4?(T.boundary=64,T.storage=64):v.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(T.boundary=16,T.storage=v.byteLength):qe("WebGLRenderer: Unsupported uniform value type.",v),T}function w(v){let T=v.target;T.removeEventListener("dispose",w);let C=s.indexOf(T.__bindingPointIndex);s.splice(C,1),e.deleteBuffer(a[T.id]),delete a[T.id],delete n[T.id]}function A(){for(let v in a)e.deleteBuffer(a[v]);s=[],a={},n={}}return{bind:l,update:h,dispose:A}}var r3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ni=null;function a3(){return Ni===null&&(Ni=new Uc(r3,16,16,Zr,Vi),Ni.name="DFG_LUT",Ni.minFilter=Yt,Ni.magFilter=Yt,Ni.wrapS=tr,Ni.wrapT=tr,Ni.generateMipmaps=!1,Ni.needsUpdate=!0),Ni}var Cu=class{constructor(e={}){let{canvas:t=Wp(),context:i=null,depth:r=!0,stencil:a=!1,alpha:n=!1,antialias:s=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:c=!1,reversedDepthBuffer:p=!1,outputBufferType:u=hi}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=n;let _=u,y=new Set([ql,jl,Wl]),m=new Set([hi,Hi,xn,yn,Vl,Gl]),d=new Uint32Array(4),w=new Int32Array(4),A=new x,v=null,T=null,C=[],M=[],g=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let b=this,I=!1,P=null,L=null,V=null,D=null;this._outputColorSpace=Nt;let H=0,J=0,j=null,ue=-1,Z=null,K=new Mt,te=new Mt,Ve=null,Ce=new Oe(0),ut=0,be=t.width,k=t.height,$=1,ne=null,Le=null,We=new Mt(0,0,be,k),me=new Mt(0,0,be,k),it=!1,re=new Va,ie=!1,ce=!1,Se=new Ke,Me=new x,De=new Mt,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Je=!1;function $e(){return j===null?$:1}let N=i;function xt(E,F){return t.getContext(E,F)}let nt,rt,R,S,O,q,ee,fe,ge,z,pe,ve,Ie,le,Be,ze,Ze,pt,B,Q,ae,Ee,Ue;try{let E={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:c};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r186"),t.addEventListener("webglcontextlost",Xe,!1),t.addEventListener("webglcontextrestored",Ft,!1),t.addEventListener("webglcontextcreationerror",dt,!1),N===null){let F="webgl2";if(N=xt(F,E),N===null)throw xt(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}oe()}catch(E){throw t.removeEventListener("webglcontextlost",Xe,!1),t.removeEventListener("webglcontextrestored",Ft,!1),t.removeEventListener("webglcontextcreationerror",dt,!1),Ye("WebGLRenderer: "+E.message),E}function oe(){nt=new ag(N),nt.init(),ae=new Z5(N,nt),rt=new Y2(N,nt,e,ae),R=new X5(N,nt),rt.reversedDepthBuffer&&p&&R.buffers.depth.setReversed(!0),L=N.createFramebuffer(),V=N.createFramebuffer(),D=N.createFramebuffer(),S=new og(N),O=new D5,q=new Y5(N,nt,R,O,rt,ae,S),ee=new rg(b),fe=new hf(N),Ee=new q2(N,fe),ge=new ng(N,fe,S,Ee),z=new hg(N,ge,fe,Ee,S),pt=new lg(N,rt,q),Be=new Z2(O),pe=new L5(b,ee,nt,rt,Ee,Be),ve=new t3(b,O),Ie=new N5,le=new V5(nt),Ze=new j2(b,ee,R,z,f,o),ze=new q5(b,z,rt),Ue=new i3(N,S,rt,R),B=new X2(N,nt,S),Q=new sg(N,nt,S),S.programs=pe.programs,b.capabilities=rt,b.extensions=nt,b.properties=O,b.renderLists=Ie,b.shadowMap=ze,b.state=R,b.info=S}_!==hi&&(g=new ug(_,t.width,t.height,s,r,a));let ye=new Q5(b,N);this.xr=ye,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let E=nt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=nt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(E){E!==void 0&&($=E,this.setSize(be,k,!1))},this.getSize=function(E){return E.set(be,k)},this.setSize=function(E,F,X=!0){if(ye.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}be=E,k=F,t.width=Math.floor(E*$),t.height=Math.floor(F*$),X===!0&&(t.style.width=E+"px",t.style.height=F+"px"),g!==null&&g.setSize(t.width,t.height),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(be*$,k*$).floor()},this.setDrawingBufferSize=function(E,F,X){be=E,k=F,$=X,t.width=Math.floor(E*X),t.height=Math.floor(F*X),this.setViewport(0,0,E,F)},this.setEffects=function(E){if(_===hi){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let F=0;F<E.length;F++)if(E[F].isOutputPass===!0){qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}g.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(K)},this.getViewport=function(E){return E.copy(We)},this.setViewport=function(E,F,X,W){E.isVector4?We.set(E.x,E.y,E.z,E.w):We.set(E,F,X,W),R.viewport(K.copy(We).multiplyScalar($).round())},this.getScissor=function(E){return E.copy(me)},this.setScissor=function(E,F,X,W){E.isVector4?me.set(E.x,E.y,E.z,E.w):me.set(E,F,X,W),R.scissor(te.copy(me).multiplyScalar($).round())},this.getScissorTest=function(){return it},this.setScissorTest=function(E){R.setScissorTest(it=E)},this.setOpaqueSort=function(E){ne=E},this.setTransparentSort=function(E){Le=E},this.getClearColor=function(E){return E.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,X=!0){let W=0;if(E){let G=!1;if(j!==null){let de=j.texture.format;G=y.has(de)}if(G){let de=j.texture.type,xe=m.has(de),Ae=Ze.getClearColor(),Pe=Ze.getClearAlpha(),je=Ae.r,at=Ae.g,ht=Ae.b;xe?(d[0]=je,d[1]=at,d[2]=ht,d[3]=Pe,N.clearBufferuiv(N.COLOR,0,d)):(w[0]=je,w[1]=at,w[2]=ht,w[3]=Pe,N.clearBufferiv(N.COLOR,0,w))}else W|=N.COLOR_BUFFER_BIT}F&&(W|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(W|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&N.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),P=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Xe,!1),t.removeEventListener("webglcontextrestored",Ft,!1),t.removeEventListener("webglcontextcreationerror",dt,!1),Ze.dispose(),Ie.dispose(),le.dispose(),O.dispose(),ee.dispose(),z.dispose(),Ee.dispose(),Ue.dispose(),pe.dispose(),ye.dispose(),ye.removeEventListener("sessionstart",P0),ye.removeEventListener("sessionend",I0),Nr.stop()};function Xe(E){E.preventDefault(),Os("WebGLRenderer: Context Lost."),I=!0}function Ft(){Os("WebGLRenderer: Context Restored."),I=!1;let E=S.autoReset,F=ze.enabled,X=ze.autoUpdate,W=ze.needsUpdate,G=ze.type;oe(),S.autoReset=E,ze.enabled=F,ze.autoUpdate=X,ze.needsUpdate=W,ze.type=G}function dt(E){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Li(E){let F=E.target;F.removeEventListener("dispose",Li),Zi(F)}function Zi(E){rp(E),O.remove(E)}function rp(E){let F=O.get(E).programs;F!==void 0&&(F.forEach(function(X){pe.releaseProgram(X)}),E.isShaderMaterial&&pe.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,X,W,G,de){F===null&&(F=Ge);let xe=G.isMesh&&G.matrixWorld.determinantAffine()<0,Ae=sp(E,F,X,W,G);R.setMaterial(W,xe);let Pe=X.index,je=1;if(W.wireframe===!0){if(Pe=ge.getWireframeAttribute(X),Pe===void 0)return;je=2}let at=X.drawRange,ht=X.attributes.position,Fe=at.start*je,gt=(at.start+at.count)*je;de!==null&&(Fe=Math.max(Fe,de.start*je),gt=Math.min(gt,(de.start+de.count)*je)),Pe!==null?(Fe=Math.max(Fe,0),gt=Math.min(gt,Pe.count)):ht!=null&&(Fe=Math.max(Fe,0),gt=Math.min(gt,ht.count));let Dt=gt-Fe;if(Dt<0||Dt===1/0)return;Ee.setup(G,W,Ae,X,Pe);let bt,St=B;if(Pe!==null&&(bt=fe.get(Pe),St=Q,St.setIndex(bt)),G.isMesh)W.wireframe===!0?(R.setLineWidth(W.wireframeLinewidth*$e()),St.setMode(N.LINES)):St.setMode(N.TRIANGLES);else if(G.isLine){let Rt=W.linewidth;Rt===void 0&&(Rt=1),R.setLineWidth(Rt*$e()),G.isLineSegments?St.setMode(N.LINES):G.isLineLoop?St.setMode(N.LINE_LOOP):St.setMode(N.LINE_STRIP)}else G.isPoints?St.setMode(N.POINTS):G.isSprite&&St.setMode(N.TRIANGLES);if(G.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))St.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Rt=G._multiDrawStarts,Ne=G._multiDrawCounts,Kt=G._multiDrawCount,Or=Pe?fe.get(Pe).bytesPerElement:1,di=O.get(W).currentProgram.getUniforms();for(let Di=0;Di<Kt;Di++)di.setValue(N,"_gl_DrawID",Di),St.render(Rt[Di]/Or,Ne[Di])}else if(G.isInstancedMesh)St.renderInstances(Fe,Dt,G.count);else if(X.isInstancedBufferGeometry){let Rt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ne=Math.min(X.instanceCount,Rt);St.renderInstances(Fe,Dt,Ne)}else St.render(Fe,Dt)};function C0(E,F,X,W){P!==null&&E.isNodeMaterial&&P.setObject(W,E),ie===!0&&Be.setState(E,X,!1),E.transparent===!0&&E.side===ri&&E.forceSinglePass===!1?(E.side=Gt,E.needsUpdate=!0,Wn(E,F,W),E.side=qr,E.needsUpdate=!0,Wn(E,F,W),E.side=ri):Wn(E,F,W)}this.compile=function(E,F,X=null){X===null&&(X=E),P!==null&&P.renderStart(E,F,X),T=le.get(X),T.init(F),M.push(T),X.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),E!==X&&E.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights(),P!==null&&P.updateLights(T.state.lightsArray),ce=this.localClippingEnabled,ie=Be.init(this.clippingPlanes,ce),ie===!0&&Be.setGlobalState(this.clippingPlanes,F),P!==null&&ze.render(T.state.shadowsArray,X,F);let W=new Set;return E.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let de=G.material;if(de)if(Array.isArray(de))for(let xe=0;xe<de.length;xe++){let Ae=de[xe];C0(Ae,X,F,G),W.add(Ae)}else C0(de,X,F,G),W.add(de)}),T=M.pop(),P!==null&&P.renderEnd(),W},this.compileAsync=function(E,F,X=null){let W=this.compile(E,F,X);return new Promise(G=>{function de(){if(W.forEach(function(xe){let Ae=O.get(xe).currentProgram;(Ae===void 0||Ae.isReady())&&W.delete(xe)}),W.size===0){G(E);return}setTimeout(de,10)}nt.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let lo=null;function ap(E){lo&&lo(E)}function P0(){Nr.stop()}function I0(){Nr.start()}let Nr=new bu;Nr.setAnimationLoop(ap),typeof self<"u"&&Nr.setContext(self),this.setAnimationLoop=function(E){lo=E,ye.setAnimationLoop(E),E===null?Nr.stop():Nr.start()},ye.addEventListener("sessionstart",P0),ye.addEventListener("sessionend",I0),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;P!==null&&P.renderStart(E,F);let X=ye.enabled===!0&&ye.isPresenting===!0,W=g!==null&&(j===null||X)&&g.begin(b,j);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ye.enabled===!0&&ye.isPresenting===!0&&(g===null||g.isCompositing()===!1)&&(ye.cameraAutoUpdate===!0&&ye.updateCamera(F),F=ye.getCamera()),E.isScene===!0&&E.onBeforeRender(b,E,F,j),T=le.get(E,M.length),T.init(F),T.state.textureUnits=q.getTextureUnits(),M.push(T),Se.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),re.setFromProjectionMatrix(Se,Ti,F.reversedDepth),ce=this.localClippingEnabled,ie=Be.init(this.clippingPlanes,ce),v=Ie.get(E,C.length),v.init(),C.push(v),ye.enabled===!0&&ye.isPresenting===!0){let de=b.xr.getDepthSensingMesh();de!==null&&ho(de,F,-1/0,b.sortObjects)}ho(E,F,0,b.sortObjects),v.finish(),P!==null&&P.updateLights(T.state.lightsArray),b.sortObjects===!0&&v.sort(ne,Le),Je=ye.enabled===!1||ye.isPresenting===!1||ye.hasDepthSensing()===!1,Je&&Ze.addToRenderList(v,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ie===!0&&Be.beginShadows();let G=T.state.shadowsArray;if(ze.render(G,E,F),ie===!0&&Be.endShadows(),(W&&g.hasRenderPass())===!1){let de=v.opaque,xe=v.transmissive;if(T.setupLights(),F.isArrayCamera){let Ae=F.cameras;if(xe.length>0)for(let Pe=0,je=Ae.length;Pe<je;Pe++){let at=Ae[Pe];D0(de,xe,E,at)}Je&&Ze.render(E);for(let Pe=0,je=Ae.length;Pe<je;Pe++){let at=Ae[Pe];L0(v,E,at,at.viewport)}}else xe.length>0&&D0(de,xe,E,F),Je&&Ze.render(E),L0(v,E,F)}j!==null&&J===0&&(q.updateMultisampleRenderTarget(j),q.updateRenderTargetMipmap(j)),W&&g.end(b),E.isScene===!0&&E.onAfterRender(b,E,F),Ee.resetDefaultState(),ue=-1,Z=null,M.pop(),M.length>0?(T=M[M.length-1],q.setTextureUnits(T.state.textureUnits),ie===!0&&Be.setGlobalState(b.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?v=C[C.length-1]:v=null,P!==null&&P.renderEnd()};function ho(E,F,X,W){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLightProbeGrid)T.pushLightProbeGrid(E);else if(E.isLight)T.pushLight(E),E.castShadow&&T.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(re)){W&&De.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Se);let de=z.update(E),xe=E.material;xe.visible&&v.push(E,de,xe,X,De.z,null,F)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(re))){let de=z.update(E),xe=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),De.copy(E.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),De.copy(de.boundingSphere.center)),De.applyMatrix4(E.matrixWorld).applyMatrix4(Se)),Array.isArray(xe)){let Ae=de.groups;for(let Pe=0,je=Ae.length;Pe<je;Pe++){let at=Ae[Pe],ht=xe[at.materialIndex];ht&&ht.visible&&v.push(E,de,ht,X,De.z,at,F)}}else xe.visible&&v.push(E,de,xe,X,De.z,null,F)}}let G=E.children;for(let de=0,xe=G.length;de<xe;de++)ho(G[de],F,X,W)}function L0(E,F,X,W){let{opaque:G,transmissive:de,transparent:xe}=E;T.setupLightsView(X),ie===!0&&Be.setGlobalState(b.clippingPlanes,X),W&&R.viewport(K.copy(W)),G.length>0&&kn(G,F,X),de.length>0&&kn(de,F,X),xe.length>0&&kn(xe,F,X),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function D0(E,F,X,W){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){let ht=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new wi(1,1,{generateMipmaps:!0,type:ht?Vi:hi,minFilter:kr,samples:Math.max(4,rt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ot.workingColorSpace})}let G=T.state.transmissionRenderTarget[W.id],de=W.viewport||K;G.setSize(de.z*b.transmissionResolutionScale,de.w*b.transmissionResolutionScale);let xe=b.getRenderTarget(),Ae=b.getActiveCubeFace(),Pe=b.getActiveMipmapLevel();b.setRenderTarget(G),b.getClearColor(Ce),ut=b.getClearAlpha(),ut<1&&b.setClearColor(16777215,.5),b.clear(),Je&&Ze.render(X);let je=b.toneMapping;b.toneMapping=Fi;let at=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),ie===!0&&Be.setGlobalState(b.clippingPlanes,W),kn(E,X,W),q.updateMultisampleRenderTarget(G),q.updateRenderTargetMipmap(G),nt.has("WEBGL_multisampled_render_to_texture")===!1){let ht=!1;for(let Fe=0,gt=F.length;Fe<gt;Fe++){let Dt=F[Fe],{object:bt,geometry:St,material:Rt,group:Ne}=Dt;if(Rt.side===ri&&bt.layers.test(W.layers)){let Kt=Rt.side;Rt.side=Gt,Rt.needsUpdate=!0,U0(bt,X,W,St,Rt,Ne),Rt.side=Kt,Rt.needsUpdate=!0,ht=!0}}ht===!0&&(q.updateMultisampleRenderTarget(G),q.updateRenderTargetMipmap(G))}b.setRenderTarget(xe,Ae,Pe),b.setClearColor(Ce,ut),at!==void 0&&(W.viewport=at),b.toneMapping=je}function kn(E,F,X){let W=F.isScene===!0?F.overrideMaterial:null;for(let G=0,de=E.length;G<de;G++){let xe=E[G],{object:Ae,geometry:Pe,group:je}=xe,at=xe.material;at.allowOverride===!0&&W!==null&&(at=W),Ae.layers.test(X.layers)&&U0(Ae,F,X,Pe,at,je)}}function U0(E,F,X,W,G,de){P!==null&&G.isNodeMaterial&&P.setObject(E,G),E.onBeforeRender(b,F,X,W,G,de),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),G.onBeforeRender(b,F,X,W,E,de),G.transparent===!0&&G.side===ri&&G.forceSinglePass===!1?(G.side=Gt,G.needsUpdate=!0,b.renderBufferDirect(X,F,W,G,E,de),G.side=qr,G.needsUpdate=!0,b.renderBufferDirect(X,F,W,G,E,de),G.side=ri):b.renderBufferDirect(X,F,W,G,E,de),E.onAfterRender(b,F,X,W,G,de)}function Wn(E,F,X){F.isScene!==!0&&(F=Ge);let W=O.get(E),G=T.state.lights,de=T.state.shadowsArray,xe=G.state.version,Ae=pe.getParameters(E,G.state,de,F,X,T.state.lightProbeGridArray),Pe=pe.getProgramCacheKey(Ae),je=W.programs;W.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?F.environment:null,W.fog=F.fog;let at=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;W.envMap=ee.get(E.envMap||W.environment,at),W.envMapRotation=W.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,je===void 0&&(E.addEventListener("dispose",Li),je=new Map,W.programs=je);let ht=je.get(Pe);if(ht!==void 0){if(W.currentProgram===ht&&W.lightsStateVersion===xe)return O0(E,Ae),ht}else Ae.uniforms=pe.getUniforms(E),P!==null&&E.isNodeMaterial&&P.build(E,X,Ae),E.onBeforeCompile(Ae,b),ht=pe.acquireProgram(Ae,Pe),je.set(Pe,ht),W.uniforms=Ae.uniforms;let Fe=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Fe.clippingPlanes=Be.uniform),O0(E,Ae),W.needsLights=lp(E),W.lightsStateVersion=xe,W.needsLights&&(Fe.ambientLightColor.value=G.state.ambient,Fe.lightProbe.value=G.state.probe,Fe.sunLights.value=G.state.sun,Fe.sunLightShadows.value=G.state.sunShadow,Fe.directionalLights.value=G.state.directional,Fe.directionalLightShadows.value=G.state.directionalShadow,Fe.spotLights.value=G.state.spot,Fe.spotLightShadows.value=G.state.spotShadow,Fe.rectAreaLights.value=G.state.rectArea,Fe.ltc_1.value=G.state.rectAreaLTC1,Fe.ltc_2.value=G.state.rectAreaLTC2,Fe.pointLights.value=G.state.point,Fe.pointLightShadows.value=G.state.pointShadow,Fe.hemisphereLights.value=G.state.hemi,Fe.sunShadowMatrix.value=G.state.sunShadowMatrix,Fe.sunShadowCascade.value=G.state.sunShadowCascade,Fe.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Fe.spotLightMatrix.value=G.state.spotLightMatrix,Fe.spotLightMap.value=G.state.spotLightMap,Fe.pointShadowMatrix.value=G.state.pointShadowMatrix),W.lightProbeGrid=T.state.lightProbeGridArray.length>0,W.currentProgram=ht,W.uniformsList=null,ht}function N0(E){if(E.uniformsList===null){let F=E.currentProgram.getUniforms();E.uniformsList=Cs.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function O0(E,F){let X=O.get(E);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function np(E,F){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;A.setFromMatrixPosition(F.matrixWorld);for(let X=0,W=E.length;X<W;X++){let G=E[X];if(G.texture!==null&&G.boundingBox.containsPoint(A))return G}return null}function sp(E,F,X,W,G){F.isScene!==!0&&(F=Ge),q.resetTextureUnits();let de=F.fog,xe=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?F.environment:null,Ae=j===null?b.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:ot.workingColorSpace,Pe=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,je=ee.get(W.envMap||xe,Pe),at=W.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ht=!!X.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Fe=!!X.morphAttributes.position,gt=!!X.morphAttributes.normal,Dt=!!X.morphAttributes.color,bt=Fi;W.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(bt=b.toneMapping);let St=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Rt=St!==void 0?St.length:0,Ne=O.get(W),Kt=T.state.lights;if(ie===!0&&(ce===!0||E!==Z)){let vt=E===Z&&W.id===ue;Be.setState(W,E,vt)}let Or=!1;W.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==Kt.state.version||Ne.outputColorSpace!==Ae||G.isBatchedMesh&&Ne.batching===!1||!G.isBatchedMesh&&Ne.batching===!0||G.isBatchedMesh&&Ne.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Ne.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Ne.instancing===!1||!G.isInstancedMesh&&Ne.instancing===!0||G.isSkinnedMesh&&Ne.skinning===!1||!G.isSkinnedMesh&&Ne.skinning===!0||G.isInstancedMesh&&Ne.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ne.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ne.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ne.instancingMorph===!1&&G.morphTexture!==null||Ne.envMap!==je||W.fog===!0&&Ne.fog!==de||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==Be.numPlanes||Ne.numIntersection!==Be.numIntersection)||Ne.vertexAlphas!==at||Ne.vertexTangents!==ht||Ne.morphTargets!==Fe||Ne.morphNormals!==gt||Ne.morphColors!==Dt||Ne.toneMapping!==bt||Ne.morphTargetsCount!==Rt||!!Ne.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Or=!0):(Or=!0,Ne.__version=W.version);let di=Ne.currentProgram;Or===!0&&(di=Wn(W,F,G),P&&W.isNodeMaterial&&P.onUpdateProgram(W,di,Ne));let Di=!1,dr=!1,ha=!1,_t=di.getUniforms(),Pt=Ne.uniforms;if(R.useProgram(di.program)&&(Di=!0,dr=!0,ha=!0),W.id!==ue&&(ue=W.id,dr=!0),Ne.needsLights){let vt=np(T.state.lightProbeGridArray,G);Ne.lightProbeGrid!==vt&&(Ne.lightProbeGrid=vt,dr=!0)}if(Di||Z!==E){R.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),_t.setValue(N,"projectionMatrix",E.projectionMatrix),_t.setValue(N,"viewMatrix",E.matrixWorldInverse);let vt=_t.map.cameraPosition;vt!==void 0&&vt.setValue(N,Me.setFromMatrixPosition(E.matrixWorld)),rt.logarithmicDepthBuffer&&_t.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_t.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),Z!==E&&(Z=E,dr=!0,ha=!0)}if(Ne.needsLights&&(Kt.state.sunShadowMap.length>0&&_t.setValue(N,"sunShadowMap",Kt.state.sunShadowMap,q),Kt.state.directionalShadowMap.length>0&&_t.setValue(N,"directionalShadowMap",Kt.state.directionalShadowMap,q),Kt.state.spotShadowMap.length>0&&_t.setValue(N,"spotShadowMap",Kt.state.spotShadowMap,q),Kt.state.pointShadowMap.length>0&&_t.setValue(N,"pointShadowMap",Kt.state.pointShadowMap,q)),G.isSkinnedMesh){_t.setOptional(N,G,"bindMatrix"),_t.setOptional(N,G,"bindMatrixInverse");let vt=G.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),_t.setValue(N,"boneTexture",vt.boneTexture,q))}G.isBatchedMesh&&(_t.setOptional(N,G,"batchingTexture"),_t.setValue(N,"batchingTexture",G._matricesTexture,q),_t.setOptional(N,G,"batchingIdTexture"),_t.setValue(N,"batchingIdTexture",G._indirectTexture,q),_t.setOptional(N,G,"batchingColorTexture"),G._colorsTexture!==null&&_t.setValue(N,"batchingColorTexture",G._colorsTexture,q));let fr=X.morphAttributes;if((fr.position!==void 0||fr.normal!==void 0||fr.color!==void 0)&&pt.update(G,X,di),(dr||Ne.receiveShadow!==G.receiveShadow)&&(Ne.receiveShadow=G.receiveShadow,_t.setValue(N,"receiveShadow",G.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&F.environment!==null&&(Pt.envMapIntensity.value=F.environmentIntensity),Pt.dfgLUT!==void 0&&(Pt.dfgLUT.value=a3()),dr){if(_t.setValue(N,"toneMappingExposure",b.toneMappingExposure),Ne.needsLights&&op(Pt,ha),de&&W.fog===!0&&ve.refreshFogUniforms(Pt,de),ve.refreshMaterialUniforms(Pt,W,$,k,T.state.transmissionRenderTarget[E.id]),Ne.needsLights&&Ne.lightProbeGrid){let vt=Ne.lightProbeGrid;Pt.probesSH.value=vt.texture,Pt.probesMin.value.copy(vt.boundingBox.min),Pt.probesMax.value.copy(vt.boundingBox.max),Pt.probesResolution.value.copy(vt.resolution)}Cs.upload(N,N0(Ne),Pt,q)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Cs.upload(N,N0(Ne),Pt,q),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_t.setValue(N,"center",G.center),_t.setValue(N,"modelViewMatrix",G.modelViewMatrix),_t.setValue(N,"normalMatrix",G.normalMatrix),_t.setValue(N,"modelMatrix",G.matrixWorld),W.uniformsGroups!==void 0){let vt=W.uniformsGroups;for(let $a=0,ca=vt.length;$a<ca;$a++){let B0=vt[$a];Ue.update(B0,di),Ue.bind(B0,di)}}return di}function op(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.sunLights.needsUpdate=F,E.sunLightShadows.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function lp(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(E,F,X){let W=O.get(E);W.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),O.get(E.texture).__webglTexture=F,O.get(E.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:X,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){let X=O.get(E);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,X=0){j=E,H=F,J=X;let W=null,G=!1,de=!1;if(E){let xe=O.get(E);if(xe.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(N.FRAMEBUFFER,xe.__webglFramebuffer),K.copy(E.viewport),te.copy(E.scissor),Ve=E.scissorTest,R.viewport(K),R.scissor(te),R.setScissorTest(Ve),ue=-1;return}else if(xe.__webglFramebuffer===void 0)q.setupRenderTarget(E);else if(xe.__hasExternalTextures)q.rebindTextures(E,O.get(E.texture).__webglTexture,O.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let je=E.depthTexture;if(xe.__boundDepthTexture!==je){if(je!==null&&O.has(je)&&(E.width!==je.image.width||E.height!==je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(E)}}let Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(de=!0);let Pe=O.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Pe[F])?W=Pe[F][X]:W=Pe[F],G=!0):E.samples>0&&q.useMultisampledRTT(E)===!1?W=O.get(E).__webglMultisampledFramebuffer:Array.isArray(Pe)?W=Pe[X]:W=Pe,K.copy(E.viewport),te.copy(E.scissor),Ve=E.scissorTest}else K.copy(We).multiplyScalar($).floor(),te.copy(me).multiplyScalar($).floor(),Ve=it;if(X!==0&&(W=L),R.bindFramebuffer(N.FRAMEBUFFER,W)&&R.drawBuffers(E,W),R.viewport(K),R.scissor(te),R.setScissorTest(Ve),G){let xe=O.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+F,xe.__webglTexture,X)}else if(de){let xe=F;for(let Ae=0;Ae<E.textures.length;Ae++){let Pe=O.get(E.textures[Ae]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ae,Pe.__webglTexture,X,xe)}}else if(E!==null&&X!==0){let xe=O.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xe.__webglTexture,X)}ue=-1};function F0(E){let F=O.get(E);return(F.__readFormat!==E.format||F.__readType!==E.type)&&(F.__readFormat=E.format,F.__readType=E.type,F.__formatReadable=rt.textureFormatReadable(E.format),F.__typeReadable=rt.textureTypeReadable(E.type)),F}this.readRenderTargetPixels=function(E,F,X,W,G,de,xe,Ae=0){if(!(E&&E.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=O.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&xe!==void 0&&(Pe=Pe[xe]),Pe){R.bindFramebuffer(N.FRAMEBUFFER,Pe);try{let je=E.textures[Ae],at=je.format,ht=je.type;E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ae);let Fe=F0(je);if(Fe.__formatReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Fe.__typeReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-W&&X>=0&&X<=E.height-G&&N.readPixels(F,X,W,G,ae.convert(at),ae.convert(ht),de)}finally{let je=j!==null?O.get(j).__webglFramebuffer:null;R.bindFramebuffer(N.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(E,F,X,W,G,de,xe,Ae=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=O.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&xe!==void 0&&(Pe=Pe[xe]),Pe)if(F>=0&&F<=E.width-W&&X>=0&&X<=E.height-G){R.bindFramebuffer(N.FRAMEBUFFER,Pe);let je=E.textures[Ae],at=je.format,ht=je.type;E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ae);let Fe=F0(je);if(Fe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Fe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let gt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,gt),N.bufferData(N.PIXEL_PACK_BUFFER,de.byteLength,N.STREAM_READ),N.readPixels(F,X,W,G,ae.convert(at),ae.convert(ht),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Dt=j!==null?O.get(j).__webglFramebuffer:null;R.bindFramebuffer(N.FRAMEBUFFER,Dt);let bt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await jp(N,bt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,gt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,de),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(gt),N.deleteSync(bt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,X=0){let W=Math.pow(2,-X),G=Math.floor(E.image.width*W),de=Math.floor(E.image.height*W),xe=F!==null?F.x:0,Ae=F!==null?F.y:0;q.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,xe,Ae,G,de),R.unbindTexture()},this.copyTextureToTexture=function(E,F,X=null,W=null,G=0,de=0){let xe,Ae,Pe,je,at,ht,Fe,gt,Dt,bt=E.isCompressedTexture?E.mipmaps[de]:E.image;if(X!==null)xe=X.max.x-X.min.x,Ae=X.max.y-X.min.y,Pe=X.isBox3?X.max.z-X.min.z:1,je=X.min.x,at=X.min.y,ht=X.isBox3?X.min.z:0;else{let Pt=Math.pow(2,-G);xe=Math.floor(bt.width*Pt),Ae=Math.floor(bt.height*Pt),E.isDataArrayTexture?Pe=bt.depth:E.isData3DTexture?Pe=Math.floor(bt.depth*Pt):Pe=1,je=0,at=0,ht=0}W!==null?(Fe=W.x,gt=W.y,Dt=W.z):(Fe=0,gt=0,Dt=0);let St=ae.convert(F.format),Rt=ae.convert(F.type),Ne;F.isData3DTexture?(q.setTexture3D(F,0),Ne=N.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(q.setTexture2DArray(F,0),Ne=N.TEXTURE_2D_ARRAY):(q.setTexture2D(F,0),Ne=N.TEXTURE_2D),R.activeTexture(N.TEXTURE0),R.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,F.flipY),R.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),R.pixelStorei(N.UNPACK_ALIGNMENT,F.unpackAlignment);let Kt=R.getParameter(N.UNPACK_ROW_LENGTH),Or=R.getParameter(N.UNPACK_IMAGE_HEIGHT),di=R.getParameter(N.UNPACK_SKIP_PIXELS),Di=R.getParameter(N.UNPACK_SKIP_ROWS),dr=R.getParameter(N.UNPACK_SKIP_IMAGES);R.pixelStorei(N.UNPACK_ROW_LENGTH,bt.width),R.pixelStorei(N.UNPACK_IMAGE_HEIGHT,bt.height),R.pixelStorei(N.UNPACK_SKIP_PIXELS,je),R.pixelStorei(N.UNPACK_SKIP_ROWS,at),R.pixelStorei(N.UNPACK_SKIP_IMAGES,ht);let ha=E.isDataArrayTexture||E.isData3DTexture,_t=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){let Pt=O.get(E),fr=O.get(F),vt=O.get(Pt.__renderTarget),$a=O.get(fr.__renderTarget);R.bindFramebuffer(N.READ_FRAMEBUFFER,vt.__webglFramebuffer),R.bindFramebuffer(N.DRAW_FRAMEBUFFER,$a.__webglFramebuffer);for(let ca=0;ca<Pe;ca++)ha&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,O.get(E).__webglTexture,G,ht+ca),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,O.get(F).__webglTexture,de,Dt+ca)),N.blitFramebuffer(je,at,xe,Ae,Fe,gt,xe,Ae,N.DEPTH_BUFFER_BIT,N.NEAREST);R.bindFramebuffer(N.READ_FRAMEBUFFER,null),R.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(G!==0||E.isRenderTargetTexture||O.has(E)){let Pt=O.get(E),fr=O.get(F);R.bindFramebuffer(N.READ_FRAMEBUFFER,V),R.bindFramebuffer(N.DRAW_FRAMEBUFFER,D);for(let vt=0;vt<Pe;vt++)ha?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Pt.__webglTexture,G,ht+vt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Pt.__webglTexture,G),_t?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,fr.__webglTexture,de,Dt+vt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,fr.__webglTexture,de),G!==0?N.blitFramebuffer(je,at,xe,Ae,Fe,gt,xe,Ae,N.COLOR_BUFFER_BIT,N.NEAREST):_t?N.copyTexSubImage3D(Ne,de,Fe,gt,Dt+vt,je,at,xe,Ae):N.copyTexSubImage2D(Ne,de,Fe,gt,je,at,xe,Ae);R.bindFramebuffer(N.READ_FRAMEBUFFER,null),R.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else _t?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(Ne,de,Fe,gt,Dt,xe,Ae,Pe,St,Rt,bt.data):F.isCompressedArrayTexture?N.compressedTexSubImage3D(Ne,de,Fe,gt,Dt,xe,Ae,Pe,St,bt.data):N.texSubImage3D(Ne,de,Fe,gt,Dt,xe,Ae,Pe,St,Rt,bt):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,de,Fe,gt,xe,Ae,St,Rt,bt.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,de,Fe,gt,bt.width,bt.height,St,bt.data):N.texSubImage2D(N.TEXTURE_2D,de,Fe,gt,xe,Ae,St,Rt,bt);R.pixelStorei(N.UNPACK_ROW_LENGTH,Kt),R.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Or),R.pixelStorei(N.UNPACK_SKIP_PIXELS,di),R.pixelStorei(N.UNPACK_SKIP_ROWS,Di),R.pixelStorei(N.UNPACK_SKIP_IMAGES,dr),de===0&&F.generateMipmaps&&N.generateMipmap(Ne),R.unbindTexture()},this.initRenderTarget=function(E){O.get(E).__webglFramebuffer===void 0&&q.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?q.setTextureCube(E,0):E.isData3DTexture?q.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?q.setTexture2DArray(E,0):q.setTexture2D(E,0),R.unbindTexture()},this.resetState=function(){H=0,J=0,j=null,R.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}};function o0(e){let t=e>>>0||1;return()=>(t^=t<<13,t>>>=0,t^=t>>>17,t^=t<<5,t>>>=0,t%1e5/1e5)}function Te(e,t){let i=parseInt(e.slice(1),16),r=a=>Math.max(0,Math.min(255,Math.round(t>=0?a+(255-a)*t:a*(1+t))));return`rgb(${r(i>>16)},${r(i>>8&255)},${r(i&255)})`}function ct(e,t,i,r){e.fillStyle=r,e.fillRect(t,i,1,1)}function Zt(e,t,i,r,a,n,s,o){for(let l=0;l<a;l++)for(let h=0;h<n;h++)ct(e,i+l,r+h,Te(s,(t()-.5)*o))}var Pu={herbe:{base:"#5cb83c",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.22);for(let r=0;r<14;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.25));for(let r=0;r<6;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,.25))}},pierre:{base:"#8f949c",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.16);for(let r=0;r<5;r++){let a=Math.floor(t()*16),n=Math.floor(t()*16);for(let s=0;s<4;s++)ct(e,a&15,n&15,Te(i,-.35)),a+=t()<.5?1:0,n+=1}}},brique:{base:"#b4553c",dessin(e,t,i){e.fillStyle="#cfc6b8",e.fillRect(0,0,16,16);for(let r=0;r<4;r++){let a=r%2?4:0;for(let n=-1;n<2;n++){let s=n*8+a,o=Te(i,(t()-.5)*.25);for(let l=0;l<7;l++)for(let h=0;h<3;h++){let c=s+l;c>=0&&c<16&&ct(e,c,r*4+h,t()<.15?Te(i,-.2):o)}}}}},bois:{base:"#b98a4e",dessin(e,t,i){for(let r=0;r<4;r++){let a=Te(i,(t()-.5)*.2);for(let n=0;n<16;n++)for(let s=0;s<4;s++)ct(e,n,r*4+s,s===3?Te(i,-.35):t()<.12?Te(i,-.15):a);ct(e,(r*5+3)%16,r*4+1,Te(i,-.3))}}},caisse:{base:"#c98f4a",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.15);let r="#7a4f24";for(let a=0;a<16;a++){for(let n of[0,1,14,15])ct(e,a,n,Te(r,(t()-.5)*.2)),ct(e,n,a,Te(r,(t()-.5)*.2));a>1&&a<14&&(ct(e,a,a,r),ct(e,a,15-a,Te(r,.1)))}}},tronc:{base:"#6b4a2b",dessin(e,t,i){for(let r=0;r<16;r++){let a=Te(i,(r%4===0?-.25:0)+(t()-.5)*.15);for(let n=0;n<16;n++)ct(e,r,n,t()<.1?Te(i,-.3):a)}}},feuilles:{base:"#3f9b3a",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.35);for(let r=0;r<20;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.45));for(let r=0;r<6;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),"#e85a8a")}},trampoline:{base:"#1a2c52",lumineux:!0,dessin(e,t,i){Zt(e,t,0,0,16,16,i,.1),e.fillStyle="#39e0ff";for(let r=2;r<14;r++)e.fillRect(r,2,1,1),e.fillRect(r,13,1,1),e.fillRect(2,r,1,1),e.fillRect(13,r,1,1);e.fillStyle="#b8f6ff",e.fillRect(7,5,2,7),e.fillRect(5,7,6,1),e.fillRect(6,6,4,1)}},neon:{base:"#3aa8ff",lumineux:!0,dessin(e,t,i){e.fillStyle=i,e.fillRect(0,0,16,16),e.fillStyle="#d9f0ff",e.fillRect(0,6,16,4)}},neon_rouge:{base:"#ff4d4d",lumineux:!0,dessin(e,t,i){e.fillStyle=i,e.fillRect(0,0,16,16),e.fillStyle="#ffe0e0",e.fillRect(0,6,16,4)}},terre:{base:"#7a5532",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.25);for(let r=0;r<10;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.35));for(let r=0;r<5;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),"#9a948a")}},sable:{base:"#e6cf94",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.12);for(let r=0;r<12;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.18));for(let r=0;r<8;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,.35))}},pave:{base:"#8b8a86",dessin(e,t,i){e.fillStyle=Te(i,-.45),e.fillRect(0,0,16,16);for(let r=0;r<4;r++){let a=r%2?2:0;for(let n=-1;n<4;n++){let s=n*4+a,o=Te(i,(t()-.5)*.3);for(let l=0;l<3;l++)for(let h=0;h<3;h++){let c=s+l;c>=0&&c<16&&ct(e,c,r*4+h,t()<.2?Te(i,-.15):o)}}}}},asphalte:{base:"#3d4046",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.2);for(let r=0;r<10;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,.25))}},trottoir:{base:"#b9b6ae",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.08),e.fillStyle=Te(i,-.25),e.fillRect(0,0,16,1),e.fillRect(0,8,16,1),e.fillRect(0,0,1,16),e.fillRect(8,0,1,16)}},pierre_chateau:{base:"#b7af9c",echelle:2,dessin(e,t,i){e.fillStyle="#857d6c",e.fillRect(0,0,16,16);for(let r=0;r<4;r++){let a=r%2?4:0;for(let n=-1;n<2;n++){let s=n*8+a,o=Te(i,(t()-.5)*.18);for(let l=0;l<7;l++)for(let h=0;h<3;h++){let c=s+l;c>=0&&c<16&&ct(e,c,r*4+h,t()<.18?Te(i,(t()-.6)*.3):o)}}}}},beton:{base:"#a9acad",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.08);for(let r=0;r<6;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.3));e.fillStyle=Te(i,-.18),e.fillRect(0,15,16,1)}},planches:{base:"#7a5230",dessin(e,t,i){for(let r=0;r<4;r++){let a=Te(i,(t()-.5)*.25);for(let n=0;n<4;n++)for(let s=0;s<16;s++)ct(e,r*4+n,s,n===3?Te(i,-.45):t()<.1?Te(i,-.2):a);ct(e,r*4+1,2,"#3b2a1a"),ct(e,r*4+1,13,"#3b2a1a")}}},paille:{base:"#d6b45a",dessin(e,t,i){for(let r=0;r<16;r++){let a=Te(i,(t()-.5)*.3);for(let n=0;n<16;n++)ct(e,r,n,t()<.25?Te(i,(t()-.5)*.5):a)}e.fillStyle=Te(i,-.35),e.fillRect(0,7,16,1),e.fillRect(0,15,16,1)}},toit_rouge:{base:"#b8452f",dessin(e,t,i){for(let r=0;r<4;r++){let a=r%2?2:0;for(let n=0;n<16;n++)for(let s=0;s<4;s++){let o=(n+a)%4===0||s===3;ct(e,n,r*4+s,o?Te(i,-.4):Te(i,(s===0?.15:0)+(t()-.5)*.12))}}}},toit_ardoise:{base:"#4d5868",dessin(e,t,i){for(let r=0;r<4;r++){let a=r%2?3:0;for(let n=0;n<16;n++)for(let s=0;s<4;s++){let o=(n+a)%6===0||s===3;ct(e,n,r*4+s,o?Te(i,-.45):Te(i,(t()-.5)*.15))}}}},palmier:{base:"#9a7a4c",dessin(e,t,i){for(let r=0;r<16;r++){let a=r%4===3;for(let n=0;n<16;n++)ct(e,n,r,a?Te(i,-.35):Te(i,(t()-.5)*.2+((n+r)%5===0?-.1:0)))}}},feuilles_palmier:{base:"#43b33a",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.25),e.fillStyle=Te(i,-.35);for(let r=0;r<16;r++)e.fillRect(r,7,1,2),r%3===0&&(e.fillRect(r,3+r%2,1,1),e.fillRect(r,12-r%2,1,1));e.fillStyle=Te(i,.3);for(let r=0;r<6;r++)e.fillRect(Math.floor(t()*16),Math.floor(t()*16),1,1)}},metal:{base:"#9aa3ad",dessin(e,t,i){for(let r=0;r<16;r++){let a=Te(i,(t()-.5)*.12);for(let n=0;n<16;n++)ct(e,n,r,t()<.15?Te(i,(t()-.5)*.2):a)}for(let[r,a]of[[1,1],[14,1],[1,14],[14,14]])ct(e,r,a,Te(i,-.4))}},metal_rouge:{base:"#c8352b",dessin:s0},metal_bleu:{base:"#2f6fd0",dessin:s0},metal_jaune:{base:"#e8b923",dessin:s0},pneu:{base:"#1e1f22",dessin(e,t,i){Zt(e,t,0,0,16,16,i,.15),e.fillStyle="#34363b";for(let r=1;r<16;r+=4)e.fillRect(0,r,16,2)}},vitre:{base:"#9fd6ff",transparent:.38,dessin(e,t,i){e.fillStyle=i,e.fillRect(0,0,16,16),e.fillStyle="#e8f7ff";for(let r=0;r<5;r++)e.fillRect(3+r,10-r,1,1),e.fillRect(8+r,13-r,1,1);e.fillStyle="#d0ecff",e.fillRect(0,0,16,1),e.fillRect(0,0,1,16)}},lampe:{base:"#ffd36b",lumineux:!0,dessin(e,t,i){e.fillStyle=i,e.fillRect(0,0,16,16),e.fillStyle="#fff6d8",e.fillRect(3,3,10,10),e.fillStyle="#ffffff",e.fillRect(6,6,4,4)}},tissu_bleu:{base:"#2f6fe0",dessin:Iu},tissu_rouge:{base:"#d63a3a",dessin:Iu}};function s0(e,t,i){Zt(e,t,0,0,16,16,i,.08),e.fillStyle=Te(i,.3),e.fillRect(0,1,16,1),e.fillStyle=Te(i,-.3),e.fillRect(0,15,16,1);for(let r=0;r<4;r++)ct(e,Math.floor(t()*16),Math.floor(t()*16),Te(i,-.2))}function Iu(e,t,i){Zt(e,t,0,0,16,16,i,.1),e.fillStyle=Te(i,-.2);for(let r=0;r<16;r+=4)e.fillRect(r,0,1,16);e.fillStyle="#e8c45a",e.fillRect(0,14,16,1),e.fillStyle="#ffffff";for(let r=0;r<4;r++)e.fillRect(4+r,5+r,1,1),e.fillRect(11-r,5+r,1,1)}function On(e){let t=new Sr(e);return t.magFilter=Bt,t.minFilter=Da,t.colorSpace=Nt,t}var l0=new Set(["invisible"]);function Lu(e){if(l0.has(e))return null;let t=Pu[e]||Pu.pierre,i=document.createElement("canvas");i.width=i.height=16;let r=0;for(let n of e)r=r*31+n.charCodeAt(0)>>>0;t.dessin(i.getContext("2d"),o0(r),t.base);let a=On(i);return a.wrapS=a.wrapT=Yr,a.anisotropy=4,t.echelle&&a.repeat.set(1/t.echelle,1/t.echelle),t.lumineux?new It({map:a,emissive:16777215,emissiveMap:a,emissiveIntensity:.9}):t.transparent?new It({map:a,transparent:!0,opacity:t.transparent,depthWrite:!1,side:ri}):new It({map:a})}var Ot=(e,t=30,i=2763306)=>new $r({color:e,shininess:t,specular:i}),U={noir:Ot(2369324,45,3815994),gris:Ot(5264733,50,4473924),polymere:Ot(1842722,12,1447446),bois:Ot(8079909,18,2232576),boisClair:Ot(10118198,18,2232576),olive:Ot(5660733,15,1710618),tan:Ot(11770732,12,1710618),vert:Ot(4016692,15,1710618),laiton:Ot(13214523,80,8943428),rouge:Ot(10165276,20,2228224),verre:new $r({color:10275071,transparent:!0,opacity:.16,shininess:120,specular:16777215,depthWrite:!1,side:ri}),tubeInterieur:new $r({color:723982,shininess:5,side:ri}),pointRouge:new pi({color:16722474}),reticule:new pi({color:16734751}),acier:Ot(13225686,110,16777215),fonte:Ot(1710620,35,2763306),orange:Ot(16738836,30,3351057),vertGrenade:Ot(5069614,20,1710618),grisClair:Ot(10133672,40,3355443),blanc:Ot(15921906,20,2236962),rougeVif:Ot(14232363,25,2228224),battebois:Ot(13146715,20,2232576),caoutchouc:Ot(1447446,5,1118481),corde:Ot(15262159,5,1118481),flamme:new pi({color:16742954})};function Y(e,t,i,r,a,n,s,o,l=0,h=0,c=0){let p=new ke(new wt(t,i,r),o);return p.position.set(a,n,s),p.rotation.set(l,h,c),e.add(p),p}function we(e,t,i,r,a,n,s,{r2:o=t,segments:l=14,ouvert:h=!1,axe:c="z"}={}){let p=new ke(new Mr(t,o,i,l,1,h),s);return c==="z"?p.rotation.x=Math.PI/2:c==="x"&&(p.rotation.z=Math.PI/2),p.position.set(r,a,n),e.add(p),p}function h0(e,t,i,r,a){let n=new ke(new Cn(t,18),U.verre);return n.position.set(i,r,a),n.renderOrder=5,e.add(n),n}function qs(e,{y:t,zArriere:i,longueur:r,r:a,rAvant:n,rOeil:s}){let o=i-r/2;we(e,a,r,0,t,o,U.noir,{ouvert:!0,segments:20}),we(e,a*.97,r,0,t,o,U.tubeInterieur,{ouvert:!0,segments:20});let l=r*.22;we(e,n,l,0,t,i-r-l/2+.005,U.noir,{r2:a,ouvert:!0,segments:20});let h=.03;we(e,s,h,0,t,i+h/2,U.noir,{ouvert:!0,segments:20}),h0(e,s*.95,0,t,i+h),h0(e,n*.95,0,t,i-r-l+.006)}function Du(){let e=new Re;Y(e,.05,.07,.22,0,-.01,0,U.noir),Y(e,.052,.05,.27,0,.035,-.02,U.noir),Y(e,.058,.062,.27,0,.026,-.285,U.polymere),Y(e,.03,.012,.5,0,.066,-.13,U.gris);for(let i=0;i<6;i++)Y(e,.06,.008,.012,0,.026,-.18-i*.04,U.noir);we(e,.011,.17,0,.026,-.5,U.noir),we(e,.017,.05,0,.026,-.6,U.gris,{segments:8});let t=new Re;return t.position.set(0,-.04,-.065),Y(t,.028,.09,.07,0,-.045,0,U.polymere),Y(t,.028,.08,.068,0,-.12,-.012,U.polymere,.25),e.add(t),Y(e,.032,.1,.045,0,-.085,.075,U.polymere,-.3),Y(e,.006,.02,.05,0,-.06,.02,U.noir),we(e,.015,.13,0,.02,.18,U.noir),Y(e,.045,.085,.16,0,0,.27,U.polymere),Y(e,.048,.1,.02,0,-.005,.355,U.noir),Y(e,.015,.012,.03,.02,.045,.1,U.gris),Y(e,.024,.026,.026,0,.083,-.01,U.noir),Y(e,.024,.026,.026,0,.083,-.12,U.noir),qs(e,{y:.108,zArriere:.02,longueur:.14,r:.02,rAvant:.026,rOeil:.022}),Y(e,.0016,.006,.0016,0,.105,-.13,U.reticule),Y(e,.004,.0016,.0016,0,.1085,-.13,U.reticule),Object.assign(e.userData,{bout:new x(0,.026,-.63),visee:new x(0,.108,.05),oeil:.12,ejection:new x(.03,.035,-.03),mainD:new x(0,-.08,.08),mainG:new x(0,-.01,-.3),hanche:new x(.15,-.165,-.36),chargeur:t,flash:.22}),e}function n3(){let e=new Re;Y(e,.048,.07,.3,0,.01,-.03,U.noir),Y(e,.054,.056,.13,0,0,-.21,U.tan),we(e,.01,.06,0,.012,-.3,U.noir),we(e,.014,.03,0,.012,-.33,U.gris,{segments:8});let t=new Re;t.position.set(0,-.025,-.1),Y(t,.026,.17,.045,0,-.085,-.008,U.noir,.12),e.add(t),Y(e,.032,.1,.045,0,-.07,.065,U.tan,-.25),Y(e,.006,.018,.045,0,-.04,.01,U.noir),we(e,.006,.19,.018,0,.21,U.gris),we(e,.006,.19,-.018,0,.21,U.gris),Y(e,.05,.075,.015,0,-.005,.305,U.noir),Y(e,.028,.012,.05,0,.051,-.03,U.noir),we(e,.017,.04,0,.074,-.03,U.noir,{ouvert:!0,segments:18}),we(e,.0165,.04,0,.074,-.03,U.tubeInterieur,{ouvert:!0,segments:18}),h0(e,.016,0,.074,-.049);let i=new ke(new Ri(.0011,8,6),U.pointRouge);return i.position.set(0,.074,-.048),e.add(i),Object.assign(e.userData,{bout:new x(0,.012,-.35),visee:new x(0,.074,-.01),oeil:.2,ejection:new x(.03,.03,-.03),mainD:new x(0,-.07,.07),mainG:new x(0,-.015,-.21),hanche:new x(.14,-.15,-.33),chargeur:t,flash:.16}),e}function s3(){let e=new Re;Y(e,.05,.068,.2,0,0,0,U.noir),we(e,.012,.5,0,.017,-.35,U.noir),we(e,.011,.36,0,-.016,-.28,U.noir);let t=new Re;Y(t,.054,.048,.15,0,-.016,-.28,U.bois);for(let r=0;r<5;r++)Y(t,.056,.004,.006,0,-.016,-.23-r*.025,U.noir);e.add(t);let i=new ke(new Ri(.0035,8,6),U.laiton);i.position.set(0,.031,-.59),e.add(i),Y(e,.042,.075,.3,0,-.045,.25,U.bois,.12),Y(e,.035,.065,.09,0,-.04,.11,U.bois,.35),Y(e,.045,.11,.02,0,-.07,.4,U.polymere,.12),Y(e,.006,.02,.05,0,-.045,.02,U.noir);for(let r=0;r<4;r++)Y(e,.012,.012,.03,-.031,.012-r%2*0,-.06+r*.026,U.rouge,Math.PI/2),Y(e,.013,.013,.008,-.031,.012,-.06+r*.026+.012,U.laiton);return Object.assign(e.userData,{bout:new x(0,.017,-.61),visee:new x(0,.05,.08),oeil:.26,ejection:new x(.03,.01,-.02),mainD:new x(0,-.075,.13),mainG:new x(0,-.04,-.28),hanche:new x(.15,-.16,-.35),pompe:t,flash:.3}),e}function o3(){let e=new Re;Y(e,.052,.08,.6,0,-.03,.04,U.vert),Y(e,.045,.035,.2,0,.022,.25,U.vert),Y(e,.055,.13,.03,0,-.04,.35,U.polymere),Y(e,.034,.09,.05,0,-.085,.1,U.vert,-.3),we(e,.019,.25,0,.035,-.05,U.noir),we(e,.013,.6,0,.035,-.47,U.noir),we(e,.02,.065,0,.035,-.8,U.gris,{segments:8}),Y(e,.006,.02,.05,0,-.07,.03,U.noir);let t=new Re;t.position.set(0,-.06,-.04),Y(t,.035,.05,.08,0,-.02,0,U.noir),e.add(t);let i=new Re;i.position.set(0,.035,.06),we(i,.004,.05,.03,0,0,U.gris,{axe:"x",segments:8});let r=new ke(new Ri(.009,10,8),U.noir);return r.position.set(.055,0,0),i.add(r),e.add(i),we(e,.004,.18,.012,-.075,-.33,U.noir,{segments:6}),we(e,.004,.18,-.012,-.075,-.33,U.noir,{segments:6}),Y(e,.03,.04,.025,0,.065,-.14,U.noir),Y(e,.03,.04,.025,0,.065,.02,U.noir),qs(e,{y:.098,zArriere:.12,longueur:.33,r:.018,rAvant:.03,rOeil:.024}),we(e,.011,.03,0,.124,-.06,U.noir,{axe:"y",segments:10}),we(e,.011,.03,.026,.098,-.06,U.noir,{axe:"x",segments:10}),Object.assign(e.userData,{bout:new x(0,.035,-.84),visee:new x(0,.098,.15),oeil:.07,ejection:new x(.03,.04,0),mainD:new x(0,-.08,.11),mainG:new x(0,-.05,-.2),hanche:new x(.16,-.17,-.38),chargeur:t,culasse:i,lunette:!0,flash:.32}),e}function l3(){let e=new Re;we(e,.04,.95,0,0,-.05,U.olive,{segments:18}),we(e,.047,.26,0,0,-.05,U.bois,{segments:18}),we(e,.04,.13,0,0,.48,U.noir,{r2:.062,ouvert:!0,segments:18}),Y(e,.032,.1,.05,0,-.085,.06,U.bois,-.2),Y(e,.032,.09,.045,0,-.08,-.2,U.polymere,.1),Y(e,.006,.02,.05,0,-.045,.02,U.noir),Y(e,.004,.032,.004,0,.058,-.4,U.noir),Y(e,.02,.006,.006,0,.075,-.4,U.noir),Y(e,.024,.026,.006,0,.055,0,U.noir);let t=new Re;t.position.set(0,0,-.52),we(t,.024,.1,0,0,-.05,U.noir,{segments:12}),we(t,.046,.2,0,0,-.2,U.olive,{segments:16});let i=new ke(new ks(.046,.13,16),U.olive);return i.rotation.x=-Math.PI/2,i.position.set(0,0,-.365),t.add(i),e.add(t),Object.assign(e.userData,{bout:new x(0,0,-.55),visee:new x(0,.07,.02),oeil:.22,ejection:null,mainD:new x(0,-.085,.07),mainG:new x(0,-.075,-.2),hanche:new x(.17,-.11,-.33),munition:t,flash:.45}),e}function Uu(e,t,i){Y(e,.034,.008,.06,0,t-.022,i,U.noir),Y(e,.004,.036,.05,-.016,t,i,U.noir),Y(e,.004,.036,.05,.016,t,i,U.noir),Y(e,.036,.004,.05,0,t+.018,i,U.noir);let r=new ke(new or(.028,.032),U.verre);r.position.set(0,t,i-.02),r.renderOrder=5,e.add(r);let a=new ke(new Ri(.0011,8,6),U.pointRouge);a.position.set(0,t,i-.02),e.add(a)}function Fn(e,t,i,r){Y(e,.003,.008,.004,0,t+.004,i,U.noir),Y(e,.004,.007,.004,-.005,t+.0035,r,U.noir),Y(e,.004,.007,.004,.005,t+.0035,r,U.noir)}function h3(){let e=new Re;Y(e,.056,.085,.6,0,0,0,U.polymere),Y(e,.05,.05,.16,0,-.005,-.37,U.noir),we(e,.011,.14,0,.012,-.5,U.noir),we(e,.016,.04,0,.012,-.585,U.gris,{segments:8}),Y(e,.016,.03,.34,0,.065,-.08,U.noir),Y(e,.012,.03,.02,0,.05,-.23,U.noir),Y(e,.012,.03,.02,0,.05,.07,U.noir),Uu(e,.112,-.1),Y(e,.032,.1,.045,0,-.085,-.04,U.polymere,-.25),Y(e,.006,.02,.06,0,-.06,-.09,U.noir);let t=new Re;return t.position.set(0,-.04,.12),Y(t,.028,.12,.06,0,-.06,0,U.noir,.12),e.add(t),Y(e,.06,.1,.02,0,-.005,.31,U.caoutchouc),e.children.forEach(i=>{i.position.z+=.04}),Object.assign(e.userData,{bout:new x(0,.012,-.57),visee:new x(0,.112,-.04),oeil:.18,ejection:new x(.03,.02,.1),mainD:new x(0,-.08,0),mainG:new x(0,-.03,-.32),hanche:new x(.15,-.165,-.38),chargeur:t,flash:.2}),e}function c3(){let e=new Re;Y(e,.07,.09,.34,0,.01,-.04,U.noir),Y(e,.072,.02,.2,0,.065,-.04,U.gris),Y(e,.03,.012,.3,0,.081,-.06,U.gris),Uu(e,.105,-.06),we(e,.014,.56,0,.02,-.48,U.noir),we(e,.024,.3,0,.02,-.33,U.grisClair,{segments:10,ouvert:!0});for(let i=0;i<6;i++)we(e,.025,.006,0,.02,-.21-i*.045,U.noir,{segments:10});we(e,.02,.05,0,.02,-.78,U.gris,{segments:8}),Y(e,.012,.05,.05,0,.06,-.38,U.noir),Y(e,.012,.012,.12,0,.085,-.38,U.noir),Y(e,.05,.05,.14,0,-.04,-.28,U.polymere),we(e,.005,.22,.014,-.02,-.55,U.noir,{segments:6}),we(e,.005,.22,-.014,-.02,-.55,U.noir,{segments:6});let t=new Re;t.position.set(-.02,-.04,-.08),Y(t,.1,.1,.13,-.02,-.06,0,U.olive),Y(t,.104,.012,.134,-.02,-.01,0,U.vert);for(let i=0;i<4;i++)Y(t,.012,.024,.008,.035,.015+i*.012,.02-i*.004,U.laiton,0,0,.4);return e.add(t),Y(e,.032,.1,.045,0,-.085,.07,U.polymere,-.3),Y(e,.006,.02,.05,0,-.06,.02,U.noir),Y(e,.05,.09,.22,0,-.005,.25,U.polymere),Y(e,.052,.1,.02,0,-.005,.37,U.caoutchouc),Object.assign(e.userData,{bout:new x(0,.02,-.81),visee:new x(0,.105,0),oeil:.2,ejection:new x(.04,0,-.05),mainD:new x(0,-.08,.08),mainG:new x(0,-.04,-.28),hanche:new x(.16,-.19,-.4),chargeur:t,flash:.26}),e}function u3(){let e=new Re;Y(e,.05,.075,.24,0,-.005,0,U.noir),Y(e,.056,.06,.36,0,.02,-.3,U.tan),Y(e,.03,.012,.52,0,.056,-.15,U.gris),we(e,.012,.22,0,.022,-.58,U.noir),we(e,.019,.06,0,.022,-.71,U.gris,{segments:8});let t=new Re;return t.position.set(0,-.04,-.06),Y(t,.03,.1,.075,0,-.05,0,U.noir,.05),e.add(t),Y(e,.032,.1,.045,0,-.085,.075,U.tan,-.3),Y(e,.006,.02,.05,0,-.06,.02,U.noir),Y(e,.048,.09,.24,0,-.01,.25,U.tan),Y(e,.044,.03,.14,0,.045,.24,U.tan),Y(e,.05,.1,.02,0,-.01,.38,U.caoutchouc),Y(e,.024,.026,.026,0,.074,-.03,U.noir),Y(e,.024,.026,.026,0,.074,-.15,U.noir),qs(e,{y:.1,zArriere:.02,longueur:.18,r:.019,rAvant:.027,rOeil:.022}),Y(e,.0016,.012,.0016,0,.1,-.17,U.noir),Y(e,.012,.0016,.0016,0,.1,-.17,U.noir),Y(e,.002,.002,.002,0,.1,-.168,U.pointRouge),Object.assign(e.userData,{bout:new x(0,.022,-.74),visee:new x(0,.1,.05),oeil:.12,ejection:new x(.03,.03,-.03),mainD:new x(0,-.08,.08),mainG:new x(0,-.01,-.32),hanche:new x(.15,-.17,-.38),chargeur:t,flash:.24}),e}function p3(){let e=new Re;Y(e,.05,.06,.6,0,0,-.08,U.bois),Y(e,.016,.01,.42,0,.033,-.17,U.noir),Y(e,.032,.1,.045,0,-.075,.06,U.bois,-.3),Y(e,.006,.02,.05,0,-.045,.01,U.noir),Y(e,.046,.085,.16,0,-.01,.28,U.bois),Y(e,.03,.03,.04,0,0,-.4,U.noir);for(let s of[-1,1]){let o=Y(e,.27,.018,.026,s*.14,.01,-.4,U.noir,0,s*-.22,0);o.position.z=-.37,Y(e,.012,.022,.012,s*.265,.01,-.31,U.gris)}let t=new Re,i=[0,1].map(()=>{let s=new ke(new wt(.003,.003,1).translate(0,0,.5),U.corde);return t.add(s),s});e.add(t);let r=s=>{let o=new x(0,.035,-.31+.25*s);[[-.265,i[0]],[.265,i[1]]].forEach(([l,h])=>{let c=new x(l,.012,-.31),p=o.clone().sub(c);h.position.copy(c),h.scale.set(1,1,p.length()),h.quaternion.setFromUnitVectors(new x(0,0,1),p.normalize())})};r(1);let a=new Re;a.position.set(0,.042,-.06),we(a,.004,.36,0,0,-.18,U.noir,{segments:6});let n=new ke(new ks(.008,.03,6),U.acier);n.rotation.x=-Math.PI/2,n.position.z=-.375,a.add(n);for(let s=0;s<3;s++){let o=Y(a,.002,.016,.04,0,0,-.01,U.rougeVif);o.rotation.z=s*Math.PI*2/3}return e.add(a),Y(e,.022,.03,.022,0,.06,-.05,U.noir),Y(e,.022,.03,.022,0,.06,.06,U.noir),qs(e,{y:.088,zArriere:.11,longueur:.15,r:.017,rAvant:.024,rOeil:.02}),Y(e,.0016,.01,.0016,0,.088,-.06,U.reticule),Y(e,.01,.0016,.0016,0,.088,-.06,U.reticule),Object.assign(e.userData,{bout:new x(0,.042,-.44),visee:new x(0,.088,.14),oeil:.12,ejection:null,mainD:new x(0,-.07,.07),mainG:new x(0,-.03,-.24),hanche:new x(.15,-.16,-.36),munition:a,corde:t,tendre:r,flash:0}),e}function d3(){let e=new Re;Y(e,.028,.095,.036,0,-.045,.012,U.bois,-.28),Y(e,.024,.045,.1,0,.022,-.02,U.gris),we(e,.0095,.16,0,.034,-.15,U.gris,{segments:10}),Y(e,.008,.012,.16,0,.044,-.15,U.gris),Y(e,.006,.016,.03,0,0,-.01,U.gris),Y(e,.008,.018,.012,0,.05,.04,U.noir,.4);let t=new Re;t.position.set(-.014,.006,-.03);let i=we(t,.021,.05,.014,.018,0,U.gris,{segments:12});i.userData.repos=i.position.clone();for(let r=0;r<6;r++){let a=r/6*Math.PI*2;we(t,.004,.052,.014+Math.cos(a)*.012,.018+Math.sin(a)*.012,0,U.noir,{segments:6})}return e.add(t),Fn(e,.05,-.225,.03),Object.assign(e.userData,{bout:new x(0,.034,-.235),visee:new x(0,.055,.035),oeil:.3,ejection:null,mainD:new x(0,-.045,.02),mainG:new x(-.01,-.06,.03),hanche:new x(.13,-.14,-.32),barillet:t,flash:.17,pistolet:!0}),e}function f3(){let e=new Re;Y(e,.028,.1,.042,0,-.04,.02,U.polymere,-.25);let t=new Re;t.position.set(0,-.06,.025),Y(t,.022,.075,.032,0,-.012,0,U.noir,-.25),Y(t,.026,.008,.038,0,-.05,.012,U.polymere,-.25),e.add(t),Y(e,.026,.02,.17,0,.008,-.05,U.polymere);let i=new Re;Y(i,.028,.03,.19,0,.032,-.05,U.noir);for(let r=0;r<5;r++)Y(i,.029,.022,.003,0,.032,.02+r*.008,U.gris);return e.add(i),Y(e,.006,.016,.04,0,-.008,-.02,U.polymere),Fn(e,.047,-.135,.035),Object.assign(e.userData,{bout:new x(0,.03,-.15),visee:new x(0,.054,.04),oeil:.3,ejection:new x(.02,.04,-.03),mainD:new x(0,-.045,.02),mainG:new x(-.01,-.06,.03),hanche:new x(.13,-.14,-.31),chargeur:t,culasse:i,flash:.13,pistolet:!0}),e}function m3(){let e=new Re;Y(e,.042,.07,.24,0,.022,-.05,U.noir),we(e,.009,.05,0,.022,-.19,U.noir),Y(e,.032,.09,.044,0,-.05,0,U.polymere,-.1);let t=new Re;return t.position.set(0,-.09,0),Y(t,.022,.12,.03,0,-.03,0,U.noir,-.1),e.add(t),Y(e,.006,.016,.04,0,-.018,-.04,U.noir),Y(e,.03,.03,.05,0,-.025,-.13,U.polymere),we(e,.004,.14,.016,-.012,-.01,U.gris,{segments:6}),we(e,.004,.14,-.016,-.012,-.01,U.gris,{segments:6}),Y(e,.04,.012,.03,0,-.012,.07,U.gris),Fn(e,.057,-.16,.04),Object.assign(e.userData,{bout:new x(0,.022,-.22),visee:new x(0,.064,.05),oeil:.27,ejection:new x(.025,.04,-.05),mainD:new x(0,-.05,0),mainG:new x(0,-.04,-.13),hanche:new x(.13,-.14,-.31),chargeur:t,flash:.12}),e}function g3(){let e=new Re;Y(e,.034,.09,.05,0,-.04,.03,U.bois,-.4),Y(e,.04,.04,.09,0,.012,-.02,U.gris),Y(e,.006,.016,.04,0,-.012,-0,U.noir);let t=new Re;t.position.set(0,.012,-.065);for(let r of[-.0125,.0125])we(t,.0125,.27,r,.012,-.135,U.noir,{segments:10});Y(t,.042,.03,.16,0,-.012,-.09,U.bois);let i=new Re;for(let r of[-.0125,.0125])we(i,.011,.006,r,.012,.003,U.laiton,{segments:10});return t.add(i),e.add(t),Object.assign(e.userData,{bout:new x(0,.024,-.34),visee:new x(0,.05,.03),oeil:.3,ejection:null,mainD:new x(0,-.05,.03),mainG:new x(0,-.01,-.16),hanche:new x(.14,-.15,-.32),canons:t,munitionCanon:i,flash:.3}),e}function _3(){let e=new Re;Y(e,.032,.1,.045,0,-.04,.02,U.orange,-.25),Y(e,.034,.03,.08,0,.012,-0,U.orange),Y(e,.008,.02,.04,0,-.012,-.02,U.orange),Y(e,.01,.02,.012,0,.032,.04,U.noir,.4);let t=new Re;t.position.set(0,.02,-.04),we(t,.02,.16,0,.012,-.08,U.orange,{segments:14}),we(t,.014,.005,0,.012,-.161,U.noir,{segments:14});let i=new Re;return we(i,.017,.008,0,.012,.004,U.rougeVif,{segments:12}),t.add(i),e.add(t),Fn(e,.052,-.19,.03),Object.assign(e.userData,{bout:new x(0,.032,-.2),visee:new x(0,.058,.035),oeil:.3,ejection:null,mainD:new x(0,-.045,.02),mainG:new x(-.01,-.06,.03),hanche:new x(.13,-.14,-.31),canons:t,munitionCanon:i,flash:.22,pistolet:!0}),e}function v3(){let e=new Re;Y(e,.024,.03,.11,0,0,.01,U.caoutchouc),Y(e,.03,.04,.008,0,.002,-.048,U.noir);let t=new Re;return Y(t,.004,.032,.15,0,.004,-.125,U.acier),Y(t,.004,.022,.035,0,0,-.21,U.acier,.45),Y(t,.0045,.006,.15,0,.018,-.125,U.gris),e.add(t),Object.assign(e.userData,{bout:new x(0,0,-.23),visee:new x(0,0,0),oeil:.3,ejection:null,mainD:new x(0,-.005,.02),mainG:null,hanche:new x(.16,-.13,-.32),lame:t,flash:0,melee:!0,repos:[.15,.35,-.5],garde:{pos:new x(.13,-.08,-.38),rot:[-.55,.1,-.2]}}),e}function x3(){let e=new Re;we(e,.033,.62,0,0,-.38,U.battebois,{r2:.016,segments:14}),we(e,.015,.16,0,0,0,U.battebois,{segments:10}),we(e,.024,.02,0,0,.085,U.battebois,{segments:12});for(let t=0;t<4;t++)we(e,.0162,.012,0,0,.04-t*.025,U.caoutchouc,{segments:10});return we(e,.033,.004,0,0,-.69,U.battebois,{segments:14}),Object.assign(e.userData,{bout:new x(0,0,-.68),visee:new x(0,0,0),oeil:.3,ejection:null,mainD:new x(0,0,.02),mainG:new x(0,0,.07),hanche:new x(.25,-.3,-.55),flash:0,melee:!0,repos:[.75,.55,-.4],garde:{pos:new x(.3,-.27,-.42),rot:[1.27,-.1,-.3]}}),e}function y3(){let e=new Re;Y(e,.022,.016,.2,0,0,-.06,U.fonte),Y(e,.024,.018,.07,0,0,.03,U.bois);let t=we(e,.125,.012,0,-.012,-.29,U.fonte,{axe:"y",segments:20});return t.userData.fond=!0,we(e,.13,.04,0,.008,-.29,U.fonte,{r2:.125,ouvert:!0,axe:"y",segments:20}),we(e,.118,.002,0,-.005,-.29,U.grisClair,{axe:"y",segments:20}),Object.assign(e.userData,{bout:new x(0,0,-.29),visee:new x(0,0,0),oeil:.3,ejection:null,mainD:new x(0,0,.03),mainG:null,hanche:new x(.2,-.24,-.46),flash:0,melee:!0,repos:[1,.2,-.35],garde:{pos:new x(.2,-.16,-.46),rot:[1.6,.2,-.3]}}),e}function c0(e=!1){let t=new Re,i=new Re;if(e)we(i,.028,.11,0,0,0,U.grisClair,{axe:"y",segments:14}),we(i,.0285,.025,0,.02,0,U.vert,{axe:"y",segments:14}),we(i,.022,.015,0,.062,0,U.noir,{axe:"y",segments:12});else{let n=new ke(new Ri(.034,14,10),U.vertGrenade);n.scale.y=1.2,i.add(n);for(let s=0;s<3;s++)we(i,.0345,.004,0,-.02+s*.02,0,U.vert,{axe:"y",segments:14});we(i,.012,.02,0,.045,0,U.grisClair,{axe:"y",segments:10})}let r=e?.07:.055;Y(i,.012,.006,.06,0,r,.012,U.grisClair,-.35);let a=new ke(new In(.012,.0022,6,14),U.laiton);return a.position.set(.018,r,-.004),a.rotation.y=Math.PI/2,i.add(a),t.add(i),Object.assign(t.userData,{bout:new x(0,0,0),visee:new x(0,0,0),oeil:.3,ejection:null,mainD:new x(0,-.03,.01),mainG:null,hanche:new x(.15,-.12,-.3),flash:0,gadget:!0,objet:i,repos:[.2,.3,.1],garde:{pos:new x(.13,-.08,-.3),rot:[.5,.2,.1]}}),t}function b3(){let e=new Re;Y(e,.032,.1,.045,0,-.04,.02,U.polymere,-.25),Y(e,.04,.05,.18,0,.02,-.06,U.noir),we(e,.026,.12,0,.03,-.2,U.gris,{segments:14}),we(e,.03,.04,.034,.012,-.05,U.olive,{axe:"x",segments:14}),we(e,.031,.005,.034,.012,-.05,U.corde,{axe:"x",segments:14}),Y(e,.006,.016,.04,0,-.012,-0,U.noir);let t=new Re;t.position.set(0,.03,-.27),we(t,.006,.07,0,0,0,U.acier,{segments:8});for(let i=0;i<3;i++){let r=i/3*Math.PI*2;Y(t,.006,.006,.05,Math.cos(r)*.016,Math.sin(r)*.016,-.04,U.acier).rotation.set(Math.sin(r)*.7,-Math.cos(r)*.7,0)}return e.add(t),Fn(e,.045,-.13,.02),Object.assign(e.userData,{bout:new x(0,.03,-.3),visee:new x(0,.055,.03),oeil:.3,ejection:null,mainD:new x(0,-.045,.02),mainG:new x(0,-.005,-.2),hanche:new x(.14,-.15,-.32),flash:0,gadget:!0,crochet:t,objet:t}),e}function S3(){let e=new Re,t=new Re;return Y(t,.17,.11,.06,0,0,0,U.blanc),Y(t,.172,.014,.062,0,.025,0,U.rougeVif),Y(t,.02,.06,.004,0,-.012,-.031,U.rougeVif),Y(t,.06,.02,.004,0,-.012,-.031,U.rougeVif),Y(t,.06,.012,.012,0,.065,0,U.noir),e.add(t),t.position.set(0,.04,-.02),Object.assign(e.userData,{bout:new x(0,.04,-.02),visee:new x(0,0,0),oeil:.3,ejection:null,mainD:new x(.05,0,.01),mainG:new x(-.07,0,0),hanche:new x(.1,-.15,-.38),flash:0,gadget:!0,objet:t,repos:[.1,.15,.05],garde:{pos:new x(.05,-.12,-.34),rot:[.3,0,0]}}),e}var M3={fusil:Du,smg:n3,pompe:s3,sniper:o3,roquette:l3,rafale:h3,mitrailleuse:c3,precision:u3,arbalete:p3,revolver:d3,pistolet:f3,uzi:m3,canon_scie:g3,lance_fusee:_3,couteau:v3,batte:x3,poele:y3,grenade:()=>c0(!1),fumigene:()=>c0(!0),grappin:b3,kit_soin:S3};function Bn(e,t=!1){let i=(M3[e]||Du)();return t&&i.traverse(r=>{r.isMesh&&r.material!==U.verre&&(r.castShadow=!0)}),i}function Nu(e){let t=c0(e==="fumigene");return t.traverse(i=>{i.isMesh&&(i.castShadow=!0)}),t}var Et=1.85/32,p0=["#3d8bff","#ff5a5a"],E3=null;function Bu(e){E3=e}var T3={peau:"#e0ac69",yeux:"#2d6cdf",cheveux:"#4a2c17",coupe:"courts",visage:null,haut:"tshirt",hautC1:"#2fb5ff",hautC2:"#ffffff",motif:"uni",bas:"jean",basC:"#2b3a67",chaussures:"baskets",chaussuresC:"#2a2a2a",chapeau:"aucun",chapeauC:"#ff3b3b",accVisage:"aucun",accOreilles:"aucun",accDos:"aucun",accCou:"aucun",accC:"#2a2a2a"},w3=/^#[0-9a-f]{6}$/,A3=["peau","yeux","cheveux","hautC1","hautC2","basC","chaussuresC","chapeauC","accC"];function lr(e){let t={...T3};if(!e||typeof e!="object")return t;for(let i of A3)typeof e[i]=="string"&&w3.test(e[i])&&(t[i]=e[i]);for(let i of["coupe","haut","motif","bas","chaussures","chapeau","accVisage","accOreilles","accDos","accCou"])typeof e[i]=="string"&&/^[a-z_]{1,30}$/.test(e[i])&&(t[i]=e[i]);return typeof e.visage=="string"&&/^[0-9a-f]{384}$/.test(e.visage)&&(t.visage=e.visage),t}function d0(e){let t=lr(e),i=Array.from({length:8},()=>Array(8).fill(t.peau)),r=t.cheveux,a={courts:2,frange:3,longs:2,queue:2,herisses:1,chauve:0}[t.coupe]??2;for(let n=0;n<a;n++)for(let s=0;s<8;s++)i[n][s]=r;if(t.coupe==="frange"&&(i[2][6]=t.peau,i[2][7]=t.peau),t.coupe==="herisses")for(let n=0;n<8;n+=2)i[1][n]=r;if(t.coupe==="longs")for(let n=2;n<8;n++)i[n][0]=r,i[n][7]=r;return a>=2&&(i[2][0]=Ci(r,-.1),i[2][7]=t.coupe==="frange"?t.peau:Ci(r,-.1)),i[4][1]="#ffffff",i[4][2]=t.yeux,i[4][5]=t.yeux,i[4][6]="#ffffff",i[3][1]=Ci(r,-.2),i[3][2]=Ci(r,-.2),i[3][5]=Ci(r,-.2),i[3][6]=Ci(r,-.2),(t.coupe==="chauve"||t.coupe==="herisses")&&(i[3][1]=i[3][2]=i[3][5]=i[3][6]=Ci(t.peau,-.35)),i[6][3]=Ci(t.peau,-.45),i[6][4]=Ci(t.peau,-.45),i[5][2]=Ci(t.peau,-.25),i[5][5]=Ci(t.peau,-.25),t.coupe==="longs"&&(i[5][0]=r,i[5][7]=r),i.flat().map(n=>n.slice(1)).join("")}function R3(e){let t=[];for(let i=0;i<64;i++)t.push(`#${e.slice(i*6,i*6+6)}`);return t}function Ci(e,t){let i=/rgb\((\d+),(\d+),(\d+)\)/.exec(Te(e,t));return`#${[i[1],i[2],i[3]].map(r=>Number(r).toString(16).padStart(2,"0")).join("")}`}var C3={eclair:["...##.","..##..",".####.","..##..",".##...",".#...."],etoile:["..##..","..##..","######",".####.",".#..#.","#....#"],coeur:[".#..#.","######","######",".####.","..##..","......"],smiley:[".####.","#.##.#","######","#.##.#","##..##",".####."]},Ou={1:[".#.","##.",".#.",".#.","###"],0:["###","#.#","#.#","#.#","###"]};function zn(e,t){let i=lr(e);(t===0||t===1)&&(i.hautC1=p0[t]);let r=document.createElement("canvas");r.width=r.height=64;let a=r.getContext("2d"),n=o0(17),s=(M,g,b,I,P,L=.1)=>Zt(a,n,M,g,b,I,P,L),o=(M,g,b)=>{a.fillStyle=b,a.fillRect(M,g,1,1)},l=i.cheveux,h=i.coupe==="chauve",c=(M,g,b,I,P,L)=>{L.dessus(M+P,g,b,P),L.dessous(M+P+b,g,b,P),L.cote(M,g+P,P,I,"droite"),L.devant(M+P,g+P,b,I),L.cote(M+P+b,g+P,P,I,"gauche"),L.dos(M+P+b+P,g+P,b,I)},p={courts:3,frange:4,longs:8,queue:3,herisses:2,chauve:0}[i.coupe]??3,u={courts:6,frange:7,longs:8,queue:7,herisses:5,chauve:0}[i.coupe]??6;c(0,0,8,8,8,{dessus:(M,g,b,I)=>{if(s(M,g,b,I,h?i.peau:l,.12),i.coupe==="herisses")for(let P=0;P<8;P+=2)for(let L=P/2%2;L<8;L+=2)o(M+P,g+L,Te(l,.25))},dessous:(M,g,b,I)=>s(M,g,b,I,i.peau,.04),cote:(M,g,b,I,P)=>{s(M,g,b,I,i.peau,.05);let L=P==="droite"?7:0;if(p&&s(M,g,b,p,l,.12),(i.coupe==="courts"||i.coupe==="queue")&&s(P==="droite"?M:M+5,g+3,3,2,l,.12),p<5&&(o(M+3,g+4,Te(i.peau,-.2)),o(M+4,g+4,Te(i.peau,-.2)),o(M+3,g+5,Te(i.peau,-.2))),i.coupe==="longs")for(let V=2;V<8;V++)o(M+L,g+V,Te(l,.05))},devant:(M,g)=>{R3(i.visage||d0(i)).forEach((I,P)=>o(M+P%8,g+Math.floor(P/8),I))},dos:(M,g,b,I)=>{s(M,g,b,I,i.peau,.05),u&&s(M,g,b,u,l,.12)}});let f=i.hautC1,_=i.hautC2,y=Te(f,-.3),m={tshirt:4,maillot:4,debardeur:0,sweat:11,veste:11,chemise:11,pull:11}[i.haut]??4,d=(M,g,b,I)=>{for(let P=0;P<I;P++)s(M,g+P,b,1,Math.floor(P/2)%2?_:f,.08)},w=(M,g,b,I)=>i.haut==="pull"?d(M,g,b,I):s(M,g,b,I,f,.08),A=(M,g)=>{if(i.motif==="uni"||i.haut==="veste"||i.haut==="chemise")return;if(i.motif==="bande"){s(M,g+4,8,2,_,.05);return}if(i.motif==="numero"){Fu(o,M+1,g+2,_);return}let b=C3[i.motif];b&&b.forEach((I,P)=>[...I].forEach((L,V)=>{L==="#"&&o(M+1+V,g+2+P,_)}))};c(16,16,8,12,4,{dessus:(M,g,b,I)=>s(M,g,b,I,i.haut==="debardeur"?i.peau:f,.06),dessous:(M,g,b,I)=>s(M,g,b,I,i.basC,.06),cote:(M,g,b,I)=>{w(M,g,b,I-2),i.haut==="maillot"&&s(M+1,g,2,I-2,_,.05),s(M,g+I-2,b,2,(i.bas==="short",i.basC),.08)},devant:(M,g,b,I)=>{if(w(M,g,b,I-2),s(M,g+I-2,b,2,i.basC,.08),o(M+3,g+I-2,"#d4af37"),o(M+4,g+I-2,"#d4af37"),i.haut==="debardeur"?(o(M,g,i.peau),o(M+7,g,i.peau),o(M+3,g,i.peau),o(M+4,g,i.peau),o(M+3,g+1,i.peau),o(M+4,g+1,i.peau)):(o(M+3,g,Te(i.peau,-.05)),o(M+4,g,Te(i.peau,-.05))),i.haut==="sweat"&&(s(M+1,g+6,6,3,y,.05),o(M+3,g+1,_),o(M+3,g+2,_),o(M+4,g+1,_),o(M+4,g+3,_)),i.haut==="veste"){s(M+2,g,4,I-2,_,.06);for(let P=0;P<I-2;P++)o(M+2,g+P,y),o(M+5,g+P,y)}if(i.haut==="maillot"&&(s(M,g,8,1,_,.03),s(M,g,1,I-2,_,.03),s(M+7,g,1,I-2,_,.03)),i.haut==="chemise"){o(M+2,g,_),o(M+5,g,_),o(M+2,g+1,_),o(M+5,g+1,_);for(let P=2;P<I-2;P+=2)o(M+4,g+P,_);s(M+1,g+3,2,2,y,.03)}A(M,g)},dos:(M,g,b,I)=>{w(M,g,b,I-2),s(M,g+I-2,b,2,i.basC,.08),i.haut==="sweat"&&s(M+1,g,6,4,y,.05),i.haut==="maillot"&&(s(M,g,8,1,_,.03),Fu(o,M+1,g+3,_))}});let v=(M,g)=>{let b=(I,P,L,V)=>{s(I,P,L,V,i.peau,.05),m&&(i.haut==="pull"?d(I,P,L,m):s(I,P,L,m,f,.08),m>4&&s(I,P+m-1,L,1,i.haut==="pull"?f:y,.04),i.haut==="maillot"&&s(I,P+m-1,L,1,_,.04))};c(M,g,4,12,4,{dessus:(I,P,L,V)=>s(I,P,L,V,m?f:i.peau,.06),dessous:(I,P,L,V)=>s(I,P,L,V,i.peau,.04),cote:b,devant:b,dos:b})};v(40,16),v(32,48);let T={baskets:2,montantes:3,bottes:5}[i.chaussures]??2,C=(M,g,b)=>{let I=(P,L,V,D,H)=>{if(i.bas==="short"?(s(P,L,V,5,i.basC,.08),s(P,L+5,V,D-5,i.peau,.05)):s(P,L,V,D,i.basC,i.bas==="jean"?.14:.08),i.bas==="jean"&&H==="devant")for(let J=1;J<10;J+=3)o(P+1,L+J,Te(i.basC,.25));i.bas==="jogging"&&(s(P,L+9,V,1,Te(i.basC,-.3),.03),H===b&&s(P+1,L,1,9,"#ffffff",.03)),i.bas==="cargo"&&H===b&&s(P,L+4,V,3,Te(i.basC,-.25),.05),s(P,L+D-T,V,T,i.chaussuresC,.06),i.chaussures==="baskets"&&s(P,L+D-1,V,1,"#f2f2f2",.03),i.chaussures==="montantes"&&(s(P,L+D-1,V,1,"#f2f2f2",.03),H==="devant"&&o(P+1,L+D-3,"#ffffff")),i.chaussures==="bottes"&&s(P,L+D-1,V,1,Te(i.chaussuresC,-.4),.03)};c(M,g,4,12,4,{dessus:(P,L,V,D)=>s(P,L,V,D,i.basC,.06),dessous:(P,L,V,D)=>s(P,L,V,D,i.chaussures==="bottes"?Te(i.chaussuresC,-.4):"#f2f2f2",.03),cote:(P,L,V,D,H)=>I(P,L,V,D,H),devant:(P,L,V,D)=>I(P,L,V,D,"devant"),dos:(P,L,V,D)=>I(P,L,V,D,"dos")})};return C(0,16,"droite"),C(16,48,"gauche"),r}function Fu(e,t,i,r){[Ou[1],Ou[0]].forEach((a,n)=>a.forEach((s,o)=>[...s].forEach((l,h)=>{l==="#"&&e(t+h+n*3,i+o,r)})))}var u0=new Map;function lt(e,{lumineux:t=!1,transparent:i=!1,brillant:r=!1}={}){let a=`${e}|${t}|${i}|${r}`;if(!u0.has(a)){let n;i?n=new $r({color:e,transparent:!0,opacity:.35,shininess:120,specular:16777215,depthWrite:!1}):r?n=new $r({color:e,shininess:90,specular:6710886}):n=new It(t?{color:e,emissive:e,emissiveIntensity:.9}:{color:e}),u0.set(a,n)}return u0.get(a)}function he(e,t,i,r,a,n,s,o,l=0,h=0,c=0){let p=new ke(new wt(t*Et,i*Et,r*Et),o);return p.position.set(a*Et,n*Et,s*Et),p.rotation.set(l,h,c),p.castShadow=!0,e.add(p),p}function zu(e,t,i){let r=lr(i),a={},n=lt(r.cheveux),s=lt(r.chapeauC),o=lt(Te(r.chapeauC,-.3)),l=lt(r.accC),h=lt(Te(r.accC,-.3));if(r.coupe==="queue"&&he(e,2.2,4.5,2.2,0,-1.2,5.1,n,.35),r.coupe==="herisses"&&r.chapeau==="aucun")for(let[c,p]of[[-2.5,-2.5],[0,-2.8],[2.5,-2.5],[-2.5,.5],[.5,0],[2.5,.5],[-1.5,3],[1.5,3]])he(e,1.6,1.8,1.6,c,4.8,p,n,.2*Math.sign(p),0,-.15*c);switch(r.chapeau){case"casquette":case"casquette_envers":{let c=r.chapeau==="casquette"?-1:1;he(e,8.6,2.6,8.6,0,4.9,0,s),he(e,8.6,.6,4.5,0,3.9,c*6.3,o),he(e,1.2,.6,1.2,0,6.4,0,o);break}case"bonnet":he(e,8.8,3.4,8.8,0,5,0,s),he(e,9,1.3,9,0,3.8,0,o),he(e,2.2,2.2,2.2,0,7.6,0,lt("#ffffff"));break;case"couronne":{let c=lt("#f5c542",{brillant:!0});he(e,9,1.8,.6,0,4.9,-4.3,c),he(e,9,1.8,.6,0,4.9,4.3,c),he(e,.6,1.8,9,-4.3,4.9,0,c),he(e,.6,1.8,9,4.3,4.9,0,c);for(let p of[-3.6,0,3.6])he(e,1.2,1.6,.6,p,6.5,-4.3,c),he(e,1.2,1.6,.6,p,6.5,4.3,c);for(let p of[-1.8,1.8])he(e,.6,1.6,1.2,-4.3,6.5,p,c),he(e,.6,1.6,1.2,4.3,6.5,p,c);he(e,1.2,1,.4,0,4.9,-4.65,lt("#e33b3b",{brillant:!0})),he(e,.4,1,1.2,-4.65,4.9,0,lt("#3b6bff",{brillant:!0})),he(e,.4,1,1.2,4.65,4.9,0,lt("#3b6bff",{brillant:!0}));break}case"chantier":{let c=lt("#ffcc00",{brillant:!0});he(e,8.8,3,8.8,0,5,0,c),he(e,10.6,.6,10.6,0,3.9,0,c),he(e,1.4,.8,8.9,0,6.6,0,lt("#e6b800"));break}case"astronaute":{let c=lt("#f2f4f7");he(e,11,1,11,0,5.6,0,c),he(e,11,10,1,0,.6,5.5,c),he(e,1,10,11,-5.5,.6,0,c),he(e,1,10,11,5.5,.6,0,c),he(e,11,1.6,1,0,5,-5.5,c),he(e,11,1.8,1,0,-3.6,-5.5,c),he(e,9.4,7.4,.3,0,.6,-5.4,lt("#ffd27a",{transparent:!0})),he(e,.5,3,.5,3.5,7.4,2,lt("#c9ced6")),he(e,1,1,1,3.5,9.2,2,lt("#ff3b3b",{lumineux:!0}));break}case"cowboy":he(e,13,.6,13,0,4.1,0,s),he(e,8,3.4,8,0,5.9,0,s),he(e,8.2,.9,8.2,0,4.8,0,o);break;case"haut_de_forme":he(e,10.6,.6,10.6,0,4.2,0,s),he(e,7.6,6.5,7.6,0,7.6,0,s),he(e,7.8,1.2,7.8,0,5.2,0,lt("#d93a3a"));break;case"pirate":{let c=lt("#1d1d1f");he(e,11,.8,10,0,4.3,0,c),he(e,8,3,8,0,5.9,0,c),he(e,11.1,.3,.3,0,4.75,-5,lt("#f5c542")),he(e,1.8,1.8,.3,0,5.9,-4.1,lt("#f2f2f2"));break}case"viking":{let c=lt("#9aa0a8",{brillant:!0}),p=lt("#efe6c8");he(e,8.8,3,8.8,0,5,0,c),he(e,9,.9,9,0,3.9,0,lt("#7a5530")),he(e,1.6,4.5,1.6,-5.4,6.2,0,p,0,0,.55),he(e,1.6,4.5,1.6,5.4,6.2,0,p,0,0,-.55);break}case"oreilles_chat":he(e,8.6,.6,1.2,0,4.3,0,s);for(let c of[-2.7,2.7])he(e,2.4,2.8,.8,c,5.6,0,s),he(e,1.2,1.5,.9,c,5.4,0,lt("#ffb3c7"));break;default:break}switch(r.accVisage){case"lunettes_soleil":{let c=lt("#111111",{brillant:!0});he(e,3,1.8,.5,-2,-.5,-4.3,c),he(e,3,1.8,.5,2,-.5,-4.3,c),he(e,1.2,.5,.5,0,-.1,-4.3,c),he(e,.4,.5,8,-4.25,-.1,0,c),he(e,.4,.5,8,4.25,-.1,0,c);break}case"lunettes_rondes":{let c=lt(r.accC);for(let p of[-2,2])he(e,2.8,.4,.4,p,.9,-4.3,c),he(e,2.8,.4,.4,p,-1.9,-4.3,c),he(e,.4,2.8,.4,p-1.2,-.5,-4.3,c),he(e,.4,2.8,.4,p+1.2,-.5,-4.3,c),he(e,2.2,2.2,.2,p,-.5,-4.3,lt("#bfe3ff",{transparent:!0}));he(e,.4,.5,8,-4.25,.5,0,c),he(e,.4,.5,8,4.25,.5,0,c);break}case"masque_ski":he(e,8.6,2.4,.9,0,-.3,-4.4,lt(r.accC,{brillant:!0})),he(e,7.6,1.6,.3,0,-.3,-4.9,lt("#ffb347",{transparent:!0})),he(e,.5,1.4,8.6,-4.3,-.3,0,h),he(e,.5,1.4,8.6,4.3,-.3,0,h),he(e,8.6,1.4,.5,0,-.3,4.3,h);break;case"moustache":he(e,4,.9,.5,0,-1.6,-4.25,n),he(e,1,1,.5,-2.4,-1.25,-4.25,n),he(e,1,1,.5,2.4,-1.25,-4.25,n);break;default:break}switch(r.accOreilles==="casque_audio"&&(he(e,9.4,.8,1.6,0,4.5,0,h),he(e,1.4,3.4,3.4,-4.7,-.5,0,l),he(e,1.4,3.4,3.4,4.7,-.5,0,l),he(e,.6,1.8,1.8,-5.6,-.5,0,lt("#111111")),he(e,.6,1.8,1.8,5.6,-.5,0,lt("#111111"))),r.accDos){case"sac_a_dos":he(t,6,7,3,0,.5,3.5,l),he(t,6.2,2.2,3.2,0,3.4,3.6,h),he(t,4,2,.6,0,-1.6,5.2,h),he(t,1,11,.4,-2.2,.3,-2.2,h),he(t,1,11,.4,2.2,.3,-2.2,h);break;case"cape":{let c=new Re;c.position.set(0,5.6*Et,2.3*Et),t.add(c),he(c,8.4,14,.4,0,-7,.2,l),he(c,8.6,.8,.6,0,0,.2,h),a.cape=c;break}case"jetpack":{let c=lt("#9aa0a8",{brillant:!0});for(let p of[-1.7,1.7])he(t,2.6,6.5,2.6,p,.6,3.6,c),he(t,2.8,.8,2.8,p,3.6,3.6,l),he(t,1.6,1.2,1.6,p,-3.3,3.6,lt("#3a3a3a"));a.flammes=[-1.7,1.7].map(p=>he(t,1.2,3,1.2,p,-5.4,3.6,lt("#ff9a2e",{lumineux:!0})));for(let p of a.flammes)p.castShadow=!1;break}case"ailes":{a.ailes=[-1,1].map(c=>{let p=new Re;return p.position.set(c*1*Et,2.5*Et,2.3*Et),t.add(p),he(p,9,7,.5,c*4.5,.5,0,l),he(p,7,4,.55,c*5.5,-3.5,0,lt(Te(r.accC,.25))),p.rotation.y=c*-.5,p.userData.sens=c,p});break}default:break}switch(r.accCou){case"echarpe":he(t,8.6,1.8,4.6,0,5.4,0,l),he(t,1.8,5.5,.6,-2.2,2.4,-2.5,l),he(t,1.9,.5,.65,-2.2,.2,-2.5,h);break;case"noeud_papillon":he(t,1,1,.5,0,5.1,-2.25,h),he(t,1.6,1.6,.5,-1.2,5.1,-2.25,l),he(t,1.6,1.6,.5,1.2,5.1,-2.25,l);break;default:break}return a}function Hu(e,t,{vitesse:i,enLAir:r}){if(e.cape&&(e.cape.rotation.x=-(.12+Math.min(1,i/7)*.45+Math.sin(t*1.7)*.06+(r?.35:0))),e.ailes)for(let a of e.ailes)a.rotation.y=a.userData.sens*(-.5+(r?Math.sin(t*2.2)*.45:Math.sin(t*.6)*.05));if(e.flammes)for(let a of e.flammes)a.visible=r,a.scale.y=.7+Math.random()*.6}function P3(e,t,i,r,a,n){let s=[[t,i+n,n,a],[t+n+r,i+n,n,a],[t+n,i,r,n],[t+n+r,i,r,n],[t+n+r+n,i+n,r,a],[t+n,i+n,r,a]],o=e.attributes.uv;for(let l=0;l<6;l++){let[h,c,p,u]=s[l],f=h/64,_=(h+p)/64,y=1-c/64,m=1-(c+u)/64;o.setXY(l*4+0,f,y),o.setXY(l*4+1,_,y),o.setXY(l*4+2,f,m),o.setXY(l*4+3,_,m)}return o.needsUpdate=!0,e}function I3(e,t){let i=document.createElement("canvas");i.width=256,i.height=64;let r=i.getContext("2d");r.font="bold 30px system-ui, sans-serif";let a=Math.min(240,r.measureText(e).width+24);r.fillStyle="rgba(8, 12, 24, 0.6)",r.fillRect(128-a/2,10,a,44),r.fillStyle=t,r.textAlign="center",r.textBaseline="middle",r.fillText(e,128,33,230);let n=new Sr(i);n.colorSpace=Nt;let s=new ki(new Ai({map:n,depthWrite:!1}));return s.scale.set(1.6,.4,1),s}var Xs=class{constructor({style:t,equipe:i=null,nom:r="",allieVisible:a=!1}){this.canvas=zn(t,i),this.texture=On(this.canvas),this.materiau=new It({map:this.texture,transparent:!0}),this.groupe=new Re,this.parties={},this.temps=Math.random()*10;let n=(s,[o,l,h],[c,p],u,f)=>{let _=P3(new wt(o*Et,l*Et,h*Et),c,p,o,l,h),y=new ke(_,this.materiau);y.castShadow=!0,y.position.set(0,f*Et,0);let m=new Re;return m.position.set(u[0]*Et,u[1]*Et,0),m.add(y),this.groupe.add(m),this.parties[s]={pivot:m,mesh:y,taille:[o*Et,l*Et,h*Et]},m};if(n("jambeD",[4,12,4],[0,16],[2,12],-6),n("jambeG",[4,12,4],[16,48],[-2,12],-6),n("corps",[8,12,4],[16,16],[0,18],0),n("tete",[8,8,8],[0,0],[0,24],4),n("brasD",[4,12,4],[40,16],[6,22],-4),n("brasG",[4,12,4],[32,48],[-6,22],-4),this.accessoires=zu(this.parties.tete.mesh,this.parties.corps.mesh,t),this.modelesArmes={},this.armeId=null,this.categorie="principale",this.prendreArme("fusil","principale"),this.choc=0,this.eclairCanon=0,this.anim=null,this.poeleDos=null,r){let s=i===0||i===1?p0[i]:"#ffffff";this.etiquette=I3(r,s),this.etiquette.position.y=2.2,a&&(this.etiquette.material.depthTest=!1,this.etiquette.renderOrder=10),this.groupe.add(this.etiquette)}}prendreArme(t,i){if(i&&(this.categorie=i),t!==this.armeId){if(this.arme&&(this.arme.visible=!1),!this.modelesArmes[t]){let r=Bn(t,!0),a=r.userData;a.melee||a.gadget&&!a.crochet?(r.rotation.x=a.melee?-.25:0,r.position.set(0,-11*Et,-.01)):(r.rotation.x=-Math.PI/2,r.position.set(0,-11*Et,-.02)),this.parties.brasD.pivot.add(r),this.modelesArmes[t]=r}if(this.armeId=t,this.arme=this.modelesArmes[t],this.arme.visible=!0,!i){let r=this.arme.userData;this.categorie=r.melee?"melee":r.gadget?"gadget":r.pistolet?"secondaire":"principale"}}}frapper(t=!1){this.anim={type:"coup",t:0,duree:t?.75:this.armeId==="batte"?.55:.4,special:t}}lancer(){this.anim={type:"lancer",t:0,duree:.6}}soigner(t){this.anim={type:"soin",t:0,duree:t/1e3}}afficherPoeleDos(t){if(t&&!this.poeleDos){let i=Bn("poele",!0);i.rotation.x=Math.PI/2,i.position.set(0,-.29,2*Et+.022),this.parties.corps.mesh.add(i),this.poeleDos=i}this.poeleDos&&(this.poeleDos.visible=!!t)}boutDuCanon(t){return this.groupe.updateMatrixWorld(!0),t.copy(this.arme.userData.bout),this.arme.localToWorld(t)}toucher(){this.choc=1}animer(t,{vitesse:i,enLAir:r,pitch:a,visee:n=!1,recharge:s=!1}){let o=this.parties,l=Math.min(1,i/7);this.temps+=t*(4+8*l);let h=Math.sin(this.temps)*.9*l;r?(o.jambeD.pivot.rotation.x=.5,o.jambeG.pivot.rotation.x=-.4):(o.jambeD.pivot.rotation.x=h,o.jambeG.pivot.rotation.x=-h);let c=Math.max(-1.2,Math.min(1.2,a||0));this.viseeLisse=(this.viseeLisse||0)+((n?1:0)-(this.viseeLisse||0))*Math.min(1,t*10);let p=this.viseeLisse;o.tete.pivot.rotation.set(c*.8+p*.15,0,p*.12);let f=this.arme&&!this.arme.userData.crochet&&(this.arme.userData.melee||this.arme.userData.gadget)?this.categorie:this.categorie==="gadget"?"secondaire":this.categorie;if(f==="melee"||f==="gadget"){let _=f==="melee"?.95+p*.5:.9;o.brasD.pivot.rotation.set(_+c*.4,-.1,0),o.brasG.pivot.rotation.set(.15+Math.sin(this.temps)*.25*l,0,-.12)}else{o.brasD.pivot.rotation.set(Math.PI/2+c+p*.12,-p*.1,0);let _=Math.PI/2+c-.1+p*.1;s&&(_-=.6+Math.sin(this.temps*2.5)*.25),o.brasG.pivot.rotation.set(_,f==="secondaire"?.75:.55,0)}if(this.anim){let _=this.anim;_.t+=t;let y=Math.min(1,_.t/_.duree),m=Math.sin(y*Math.PI);if(_.type==="coup")if(_.special){let d=y<.4?y/.4:1-(y-.4)/.6;o.brasD.pivot.rotation.x=.6+Math.max(0,d)*2.4,o.corps.pivot.rotation.x=-.2*m}else{let d=y<.35?y/.35:1-(y-.35)/.65;o.brasD.pivot.rotation.x=.5+d*1.9,o.brasD.pivot.rotation.y=-.1-(y>.35?(y-.35)*1.6:0),o.corps.pivot.rotation.y=.25*m}else if(_.type==="lancer"){let d=y<.4?y/.4:1-(y-.4)/.6;o.brasD.pivot.rotation.set(.6+d*2.4,-.2,0),y>.45&&this.arme&&(this.arme.visible=!1)}else _.type==="soin"&&(o.brasD.pivot.rotation.set(1.2,.5,0),o.brasG.pivot.rotation.set(1.2+Math.sin(this.temps*3)*.2,-.5,0));y>=1&&(this.anim=null,this.arme&&(this.arme.visible=!0))}this.choc=Math.max(0,this.choc-t*5),o.corps.pivot.position.y=18*Et+Math.abs(Math.sin(this.temps))*.02*l,o.corps.pivot.rotation.set(-this.choc*.25,Math.sin(this.temps)*.08*l,0),o.tete.pivot.rotation.x-=this.choc*.3,this.materiau.emissive.setScalar(this.choc*.55),Hu(this.accessoires,this.temps,{vitesse:i,enLAir:r})}transparence(t){this.materiau.opacity=t,this.materiau.depthWrite=t>.99}liberer(){this.groupe.removeFromParent(),this.texture.dispose(),this.materiau.dispose(),this.groupe.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.map&&t.material!==this.materiau&&(t.material.map.dispose(),t.material.dispose())})}};function L3(e,t){let[i,r,a,n,s,o]=t,l=[{n:[1,0,0],c:[[n,r,o],[n,r,a],[n,s,a],[n,s,o]],uv:h=>[-h[2],h[1]]},{n:[-1,0,0],c:[[i,r,a],[i,r,o],[i,s,o],[i,s,a]],uv:h=>[h[2],h[1]]},{n:[0,1,0],c:[[i,s,o],[n,s,o],[n,s,a],[i,s,a]],uv:h=>[h[0],-h[2]]},{n:[0,-1,0],c:[[i,r,a],[n,r,a],[n,r,o],[i,r,o]],uv:h=>[h[0],h[2]]},{n:[0,0,1],c:[[i,r,o],[n,r,o],[n,s,o],[i,s,o]],uv:h=>[h[0],h[1]]},{n:[0,0,-1],c:[[n,r,a],[i,r,a],[i,s,a],[n,s,a]],uv:h=>[-h[0],h[1]]}];for(let h of l){let c=e.pos.length/3;for(let p of h.c){e.pos.push(p[0],p[1],p[2]),e.nor.push(h.n[0],h.n[1],h.n[2]);let u=h.uv(p);e.uv.push(u[0],u[1])}e.idx.push(c,c+1,c+2,c,c+2,c+3)}}function D3(e,t,i){let r=new Ri(400,24,16),a=new Oe(t),n=new Oe(i),s=[],o=r.attributes.position;for(let h=0;h<o.count;h++){let c=Math.max(0,Math.min(1,o.getY(h)/250+.15)),p=n.clone().lerp(a,c);s.push(p.r,p.g,p.b)}r.setAttribute("color",new He(s,3));let l=new ke(r,new pi({vertexColors:!0,side:Gt,fog:!1,depthWrite:!1}));return l.renderOrder=-1,e.add(l),l}function U3(e){let t=new It({color:16777215,emissive:16777215,emissiveIntensity:.45,fog:!1}),i=[];for(let r=0;r<14;r++){let a=new Re,n=2+r%3;for(let s=0;s<n;s++){let o=new ke(new wt(8+(s*7+r*3)%10,2.5,6+(s*5+r)%8),t);o.position.set(s*6-n*3,s%2*1.2,(s*13+r*7)%8-4),a.add(o)}a.position.set(r*53%220-110,45+r*17%18,r*37%220-110),e.add(a),i.push(a)}return i}function N3(e){let t=document.createElement("canvas");t.width=t.height=32;let i=t.getContext("2d"),r=new Oe(e);for(let n=0;n<32;n++)for(let s=0;s<32;s++){let l=.85+(Math.sin(n*.4+Math.sin(s*.3)*2)*.5+.5)*.25;i.fillStyle=`rgb(${Math.min(255,r.r*255*l)},${Math.min(255,r.g*255*l)},${Math.min(255,r.b*255*l)})`,i.fillRect(n,s,1,1)}i.fillStyle="rgba(255,255,255,0.55)";for(let[n,s]of[[3,5],[4,5],[17,12],[18,12],[19,12],[9,24],[10,24],[26,28],[27,28],[24,3],[25,3]])i.fillRect(n,s,1,1);let a=On(t);return a.wrapS=a.wrapT=Yr,a}function Vu(e,t,i,{ombres:r,decor:a}){let n={};for(let s of t){let o=s[6];l0.has(o)||(n[o]||(n[o]={pos:[],nor:[],uv:[],idx:[]}),L3(n[o],s))}for(let[s,o]of Object.entries(n)){i.has(s)||i.set(s,Lu(s));let l=i.get(s),h=new yt;h.setAttribute("position",new He(o.pos,3)),h.setAttribute("normal",new He(o.nor,3)),h.setAttribute("uv",new He(o.uv,2)),h.setIndex(o.idx),h.computeBoundingSphere();let c=new ke(h,l),p=l.transparent;c.receiveShadow=r&&!p,c.castShadow=r&&!p&&!O3.has(s)&&(!a||F3.has(s)),p&&(c.renderOrder=2),e.add(c)}}var O3=new Set(["herbe","sable","asphalte","trottoir","terre","pave"]),F3=new Set(["feuilles","feuilles_palmier","tissu_bleu","tissu_rouge","toit_rouge","toit_ardoise","paille"]),B3={ciel:["#2f7fe0","#cdeaff"],brouillard:["#cdeaff",70,220],soleil:{couleur:"#fff1d6",intensite:2.1,position:[28,55,18]},ambiante:{ciel:"#cfe8ff",sol:"#5d7a3a",intensite:1.35},nuages:!0};function Gu(e,t,{ombres:i}){let r={...B3,...t.ambiance||{}},a=t.taille||32,n=new Re;n.name="carte",e.add(n);let[s,o,l]=r.brouillard;e.fog=new Rn(new Oe(s),o,l),D3(n,r.ciel[0],r.ciel[1]),n.add(new Nn(new Oe(r.ambiante.ciel),new Oe(r.ambiante.sol),r.ambiante.intensite));let h=new Er(new Oe(r.soleil.couleur),r.soleil.intensite),c=new x(...r.soleil.position).normalize(),p=a*2+30;if(h.position.copy(c).multiplyScalar(p),i){h.castShadow=!0,h.shadow.mapSize.set(2048,2048);let m=a*1.15+6;Object.assign(h.shadow.camera,{left:-m,right:m,top:m,bottom:-m,near:1,far:p+a*2+20}),h.shadow.bias=-4e-4,h.shadow.normalBias=.03}n.add(h),n.add(h.target);let u=new Map;Vu(n,t.boites,u,{ombres:i,decor:!1}),Array.isArray(t.decors)&&Vu(n,t.decors,u,{ombres:i,decor:!0});let f=null;if(t.eau){let m=a*2+600;f=N3(t.eau.couleur||"#2a8fd6"),f.repeat.set(m/4,m/4);let d=new ke(new or(m,m),new It({map:f,transparent:!0,opacity:.72,depthWrite:!1}));d.rotation.x=-Math.PI/2,d.position.y=t.eau.niveau||0,d.renderOrder=1,d.receiveShadow=i,n.add(d)}let _=r.nuages===!1?[]:U3(n),y=0;return{couleurCiel:r.ciel[1],animer(m){y+=m;for(let d of _)d.position.x+=m*1.5,d.position.x>130&&(d.position.x=-130);f&&(f.offset.x=Math.sin(y*.3)*.08,f.offset.y=y*.02)},liberer(){n.removeFromParent();let m=new Set;n.traverse(d=>{d.geometry&&!m.has(d.geometry)&&(m.add(d.geometry),d.geometry.dispose()),d.material&&!m.has(d.material)&&(m.add(d.material),d.material.map&&d.material.map.dispose(),d.material.dispose()),d.isLight&&d.shadow&&d.shadow.map&&d.shadow.map.dispose()}),e.fog&&(e.fog=null)}}}var z3=new x(0,-22,0),H3=.35,qi=new x,Wt=new x,Hn=new x,ai=new x,Ys=new ti,Zs=class{constructor(t,i,{impulsion:r,vitesse:a,boites:n,force:s=1,tete:o=!1,duree:l=3.5}){this.scene=t,this.boites=n,this.age=0,this.duree=l,this.morceaux=[],this.groupe=new Re,t.add(this.groupe),i.groupe.updateMatrixWorld(!0);let h=i.materiau.clone();h.opacity=1,h.depthWrite=!0,h.emissive.setScalar(0),this.materiau=h;let c=r.clone().setY(0).normalize().multiplyScalar(10*s);c.y=7*s;let p={};for(let[_,y]of Object.entries(i.parties)){let m=new ke(y.mesh.geometry,h);for(let T of y.mesh.children)m.add(T.clone(!0));m.castShadow=!0,y.mesh.getWorldPosition(m.position),y.mesh.getWorldQuaternion(m.quaternion),this.groupe.add(m);let d=(a?a.clone():new x).add(c);d.x+=(Math.random()-.5)*3,d.z+=(Math.random()-.5)*3,_==="tete"&&o&&(d.addScaledVector(r,6*s).y+=3);let w=Math.max(...y.taille)/2,A=Math.min(...y.taille)/2,v={nom:_,mesh:m,prec:m.position.clone().addScaledVector(d,-1/120),w:new x((Math.random()-.5)*14,(Math.random()-.5)*10,(Math.random()-.5)*14),masse:_==="corps"?3:1,rayon:A,bouts:[new x(0,w-A,0),new x(0,0,0),new x(0,-(w-A),0)]};_==="tete"&&(v.bouts=[new x]),_==="corps"&&(v.bouts=[new x(0,w-A,0),new x(0,-(w-A),0)]),p[_]=v,this.morceaux.push(v)}this.liens=[];let u=(_,y,m)=>{let d=p[_],w=p[y],A=new x;m.getWorldPosition(A);let v=T=>A.clone().sub(T.mesh.position).applyQuaternion(T.mesh.quaternion.clone().invert());this.liens.push({A:d,B:w,ancreA:v(d),ancreB:v(w)})},f=i.parties;u("corps","tete",f.tete.pivot),u("corps","brasD",f.brasD.pivot),u("corps","brasG",f.brasG.pivot),u("corps","jambeD",f.jambeD.pivot),u("corps","jambeG",f.jambeG.pivot)}pas(t){for(let i of this.morceaux){let r=i.mesh.position;qi.subVectors(r,i.prec).multiplyScalar(.998),i.prec.copy(r),r.add(qi).addScaledVector(z3,t*t),i.w.lengthSq()>1e-6&&(Ys.setFromAxisAngle(Wt.copy(i.w).normalize(),i.w.length()*t),i.mesh.quaternion.premultiply(Ys)),i.w.multiplyScalar(.995)}for(let i=0;i<5;i++)for(let r of this.liens){let{A:a,B:n}=r;Wt.copy(r.ancreA).applyQuaternion(a.mesh.quaternion).add(a.mesh.position),Hn.copy(r.ancreB).applyQuaternion(n.mesh.quaternion).add(n.mesh.position),ai.subVectors(Hn,Wt);let s=a.masse+n.masse;a.mesh.position.addScaledVector(ai,n.masse/s),n.mesh.position.addScaledVector(ai,-a.masse/s);let o=qi.copy(r.ancreB).applyQuaternion(n.mesh.quaternion),l=Wt.crossVectors(o,ai.negate()),h=l.length()/Math.max(1e-4,o.lengthSq());h>1e-5&&(Ys.setFromAxisAngle(l.normalize(),Math.min(h,.3)*.5),n.mesh.quaternion.premultiply(Ys))}for(let i of this.morceaux)for(let r of i.bouts){Wt.copy(r).applyQuaternion(i.mesh.quaternion).add(i.mesh.position);for(let a of this.boites){let n=i.rayon;if(Wt.x<a[0]-n||Wt.x>a[3]+n||Wt.y<a[1]-n||Wt.y>a[4]+n||Wt.z<a[2]-n||Wt.z>a[5]+n)continue;Hn.set(Math.max(a[0],Math.min(Wt.x,a[3])),Math.max(a[1],Math.min(Wt.y,a[4])),Math.max(a[2],Math.min(Wt.z,a[5]))),ai.subVectors(Wt,Hn);let s=ai.length();if(s<1e-5?(ai.set(0,1,0),s=0,Wt.y=a[4]):ai.divideScalar(s),s>=n)continue;let o=n-s;i.mesh.position.addScaledVector(ai,o),Wt.addScaledVector(ai,o),qi.subVectors(i.mesh.position,i.prec);let l=qi.dot(ai);if(l<0){qi.addScaledVector(ai,-l*(1+H3));let h=Hn.copy(qi).addScaledVector(ai,-qi.dot(ai));qi.addScaledVector(h,-.25),i.prec.subVectors(i.mesh.position,qi),i.w.multiplyScalar(.85)}}}}maj(t){this.age+=t;let i=Math.ceil(Math.min(t,.05)/(1/120));for(let r=0;r<i;r++)this.pas(1/120);return this.age<this.duree}positions(){return this.morceaux.map(t=>t.mesh.position.clone())}centre(){return this.morceaux.find(t=>t.nom==="corps").mesh.position}liberer(){this.groupe.removeFromParent(),this.materiau.dispose()}};var ku={_aide:"Catalogue de la personnalisation des personnages. Pour ajouter une couleur \xE0 une palette, ajoute-la dans la liste. Les identifiants (id) ne doivent pas changer : ils sont enregistr\xE9s dans la base. Apr\xE8s une modification : sudo docker compose restart.",peaux:["#ffdbac","#f1c7a0","#e0ac69","#c68642","#a8714a","#8d5524","#6b3e1f","#4a2a14","#9be37a","#7fc8ff"],cheveux:["#121212","#2b1d0e","#4a2c17","#7a4a1e","#b5442b","#d9a441","#f2e6b5","#c9c9c9","#ff5fa2","#6a3d9a","#1f7ae0","#2bd46c"],yeux:["#2d6cdf","#3b7a2a","#5a3a1a","#222222","#7a7a7a","#c9a227","#d93a3a","#9b4dff"],couleurs:["#ff3b3b","#ff8a1f","#ffd21f","#7ed957","#22c55e","#14b8a6","#2fb5ff","#3d6bff","#8b5cf6","#ec4899","#ffffff","#c9ced6","#6b7280","#2a2a2a","#7b4a25","#2b3a67"],coupes:[{id:"courts",nom:"Courts"},{id:"frange",nom:"Frange"},{id:"longs",nom:"Longs"},{id:"queue",nom:"Queue de cheval"},{id:"herisses",nom:"H\xE9riss\xE9s"},{id:"chauve",nom:"Chauve"}],hauts:[{id:"tshirt",nom:"T-shirt"},{id:"debardeur",nom:"D\xE9bardeur"},{id:"sweat",nom:"Sweat \xE0 capuche"},{id:"veste",nom:"Veste ouverte"},{id:"maillot",nom:"Maillot de sport"},{id:"chemise",nom:"Chemise"},{id:"pull",nom:"Pull ray\xE9"}],motifs:[{id:"uni",nom:"Uni"},{id:"eclair",nom:"\xC9clair"},{id:"etoile",nom:"\xC9toile"},{id:"coeur",nom:"C\u0153ur"},{id:"smiley",nom:"Smiley"},{id:"bande",nom:"Bande"},{id:"numero",nom:"Num\xE9ro 10"}],bas:[{id:"jean",nom:"Jean"},{id:"short",nom:"Short"},{id:"jogging",nom:"Jogging"},{id:"cargo",nom:"Cargo"}],chaussures:[{id:"baskets",nom:"Baskets"},{id:"montantes",nom:"Montantes"},{id:"bottes",nom:"Bottes"}],chapeaux:[{id:"aucun",nom:"Aucun"},{id:"casquette",nom:"Casquette"},{id:"casquette_envers",nom:"Casquette \xE0 l'envers"},{id:"bonnet",nom:"Bonnet"},{id:"couronne",nom:"Couronne"},{id:"chantier",nom:"Casque de chantier"},{id:"astronaute",nom:"Casque d'astronaute"},{id:"cowboy",nom:"Chapeau de cowboy"},{id:"haut_de_forme",nom:"Haut-de-forme"},{id:"pirate",nom:"Chapeau de pirate"},{id:"viking",nom:"Casque viking"},{id:"oreilles_chat",nom:"Oreilles de chat"}],accessoires:{visage:[{id:"aucun",nom:"Rien"},{id:"lunettes_soleil",nom:"Lunettes de soleil"},{id:"lunettes_rondes",nom:"Lunettes rondes"},{id:"masque_ski",nom:"Masque de ski"},{id:"moustache",nom:"Moustache"}],oreilles:[{id:"aucun",nom:"Rien"},{id:"casque_audio",nom:"Casque audio"}],dos:[{id:"aucun",nom:"Rien"},{id:"sac_a_dos",nom:"Sac \xE0 dos"},{id:"cape",nom:"Cape"},{id:"jetpack",nom:"Jetpack"},{id:"ailes",nom:"Ailes"}],cou:[{id:"aucun",nom:"Rien"},{id:"echarpe",nom:"\xC9charpe"},{id:"noeud_papillon",nom:"N\u0153ud papillon"}]}};var Wu={_aide:"Carte d'Arena FPS (fabriqu\xE9e par games/fps/outils/cartes.py : modifie plut\xF4t ce script). taille = demi-c\xF4t\xE9 de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, mati\xE8re] (en m\xE8tres, le sol est \xE0 y = 0) ; decors = blocs sans collision ; apparitions : y = hauteur du sol, angle en degr\xE9s (0 = regarde vers le nord, 90 = l'ouest, -90 = l'est, 180 = le sud), equipe 0 = Bleus (au nord), 1 = Rouges (au sud), null = chacun pour soi. Les vitres et les murs invisibles laissent passer les balles.",id:"arene",nom:"Ar\xE8ne",description:"L'ar\xE8ne classique : une tour au centre, des ponts, des balcons et des trampolines.",taille:34,ambiance:{ciel:["#2f7fe0","#cdeaff"],brouillard:["#cdeaff",70,220],soleil:{couleur:"#fff1d6",intensite:2.1,position:[28,55,18]},ambiante:{ciel:"#cfe8ff",sol:"#5d7a3a",intensite:1.35},nuages:!0},eau:null,boites:[[-34,-1,-34,34,0,34,"herbe"],[-35,0,-35,35,8,-34,"pierre"],[-35,0,34,35,8,35,"pierre"],[-35,0,-34,-34,8,34,"pierre"],[34,0,-34,35,8,34,"pierre"],[-35,8,-35,35,14,-34,"invisible"],[-35,8,34,35,14,35,"invisible"],[-35,8,-34,-34,14,34,"invisible"],[34,8,-34,35,14,34,"invisible"],[-4,0,-4,4,4,4,"brique"],[11,0,-1.5,12,.5,1.5,"pierre"],[10,0,-1.5,11,1,1.5,"pierre"],[9,0,-1.5,10,1.5,1.5,"pierre"],[8,0,-1.5,9,2,1.5,"pierre"],[7,0,-1.5,8,2.5,1.5,"pierre"],[6,0,-1.5,7,3,1.5,"pierre"],[5,0,-1.5,6,3.5,1.5,"pierre"],[4,0,-1.5,5,4,1.5,"pierre"],[3.6,4,-4,4,5,-1.5,"brique"],[3.6,4,1.5,4,5,4,"brique"],[-4,4,3.6,-1.25,5,4,"brique"],[1.25,4,3.6,4,5,4,"brique"],[3.5,5,3.5,4,7.5,4,"pierre"],[3.5,5,-4,4,7.5,-3.5,"pierre"],[-12,0,-1.5,-11,.5,1.5,"pierre"],[-11,0,-1.5,-10,1,1.5,"pierre"],[-10,0,-1.5,-9,1.5,1.5,"pierre"],[-9,0,-1.5,-8,2,1.5,"pierre"],[-8,0,-1.5,-7,2.5,1.5,"pierre"],[-7,0,-1.5,-6,3,1.5,"pierre"],[-6,0,-1.5,-5,3.5,1.5,"pierre"],[-5,0,-1.5,-4,4,1.5,"pierre"],[-4,4,-4,-3.6,5,-1.5,"brique"],[-4,4,1.5,-3.6,5,4,"brique"],[-4,4,-4,-1.25,5,-3.6,"brique"],[1.25,4,-4,4,5,-3.6,"brique"],[-4,5,3.5,-3.5,7.5,4,"pierre"],[-4,5,-4,-3.5,7.5,-3.5,"pierre"],[-4.5,7.5,-4.5,4.5,7.9,4.5,"metal"],[-.8,4,-.8,.8,5.6,.8,"caisse"],[-1.25,3.7,-11,1.25,4,-4,"planches"],[-3,0,-15,3,4,-11,"bois"],[-3,4,-15,-2.6,5,-11,"bois"],[2.6,4,-15,3,5,-11,"bois"],[-1.5,0,-23,1.5,.5,-22,"pierre"],[-1.5,0,-22,1.5,1,-21,"pierre"],[-1.5,0,-21,1.5,1.5,-20,"pierre"],[-1.5,0,-20,1.5,2,-19,"pierre"],[-1.5,0,-19,1.5,2.5,-18,"pierre"],[-1.5,0,-18,1.5,3,-17,"pierre"],[-1.5,0,-17,1.5,3.5,-16,"pierre"],[-1.5,0,-16,1.5,4,-15,"pierre"],[-10,0,-21,-3,1.2,-20,"pierre"],[3,0,-21,10,1.2,-20,"pierre"],[-22,0,-30.5,-15,3,-30.1,"planches"],[-22,0,-25.4,-19.4,3,-25,"planches"],[-19.4,2.5,-25.4,-17.6,3,-25,"planches"],[-17.6,0,-25.4,-15,3,-25,"planches"],[-22,0,-30.1,-21.6,3,-28.55,"planches"],[-22,0,-28.55,-21.6,1.1,-26.95,"planches"],[-22,2.1,-28.55,-21.6,3,-26.95,"planches"],[-22,0,-26.95,-21.6,3,-25.4,"planches"],[-15.4,0,-30.1,-15,3,-28.55,"planches"],[-15.4,0,-28.55,-15,1.1,-26.95,"planches"],[-15.4,2.1,-28.55,-15,3,-26.95,"planches"],[-15.4,0,-26.95,-15,3,-25.4,"planches"],[-22,2.7,-30.5,-15,3,-25,"bois"],[15,0,-30.5,22,3,-30.1,"planches"],[15,0,-25.4,17.6,3,-25,"planches"],[17.6,2.5,-25.4,19.4,3,-25,"planches"],[19.4,0,-25.4,22,3,-25,"planches"],[15,0,-30.1,15.4,3,-28.55,"planches"],[15,0,-28.55,15.4,1.1,-26.95,"planches"],[15,2.1,-28.55,15.4,3,-26.95,"planches"],[15,0,-26.95,15.4,3,-25.4,"planches"],[21.6,0,-30.1,22,3,-28.55,"planches"],[21.6,0,-28.55,22,1.1,-26.95,"planches"],[21.6,2.1,-28.55,22,3,-26.95,"planches"],[21.6,0,-26.95,22,3,-25.4,"planches"],[15,2.7,-30.5,22,3,-25,"bois"],[-25.5,0,-23.5,-23.5,.2,-21.5,"trampoline"],[12,0,-15,13,3.2,-9,"brique"],[19,0,-7,24,2.4,-6,"pierre"],[16.9,0,-9.1,18.1,1.2,-7.9,"caisse"],[-13,0,-15,-12,3.2,-9,"brique"],[-24,0,-7,-19,2.4,-6,"pierre"],[-18.1,0,-9.1,-16.9,1.2,-7.9,"caisse"],[17,0,-3,19.6,2.8,-2.6,"brique"],[19.6,2.5,-3,21.4,2.8,-2.6,"brique"],[21.4,0,-3,24,2.8,-2.6,"brique"],[17,0,2.6,19.6,2.8,3,"brique"],[19.6,2.5,2.6,21.4,2.8,3,"brique"],[21.4,0,2.6,24,2.8,3,"brique"],[17,0,-2.6,17.4,2.8,-1,"brique"],[17,0,-1,17.4,1.1,1,"brique"],[17,2,-1,17.4,2.8,1,"brique"],[17,0,1,17.4,2.8,2.6,"brique"],[23.6,0,-2.6,24,2.8,-1,"brique"],[23.6,0,-1,24,1.1,1,"brique"],[23.6,2,-1,24,2.8,1,"brique"],[23.6,0,1,24,2.8,2.6,"brique"],[17,2.5,-3,24,2.8,3,"metal"],[30,0,-10,34,3,10,"bois"],[30,3,-10,30.3,3.8,10,"pierre"],[30,0,-16,34,.5,-15,"pierre"],[30,0,-15,34,1,-14,"pierre"],[30,0,-14,34,1.5,-13,"pierre"],[30,0,-13,34,2,-12,"pierre"],[30,0,-12,34,2.5,-11,"pierre"],[30,0,-11,34,3,-10,"pierre"],[7.3,0,-5.7,8.7,1.4,-4.3,"caisse"],[7.4,0,-7,8.6,1.2,-5.8,"caisse"],[7.5,1.4,-5.5,8.5,2.4,-4.5,"caisse"],[5.2,0,-13.8,6.8,1.6,-12.2,"caisse"],[-7.7,0,-13.7,-6.3,1.4,-12.3,"caisse"],[16.3,0,-12.7,17.7,1.4,-11.3,"caisse"],[25.3,0,-16.7,26.7,1.4,-15.3,"caisse"],[25.4,0,-18,26.6,1.2,-16.8,"caisse"],[21.3,0,-22.7,22.7,1.4,-21.3,"caisse"],[-26.7,0,-14.7,-25.3,1.4,-13.3,"caisse"],[9.4,0,-27.6,10.6,1.2,-26.4,"caisse"],[-10.6,0,-27.6,-9.4,1.2,-26.4,"caisse"],[-22.5,0,-12.5,-21.5,3.5,-11.5,"tronc"],[-23.5,3.5,-13.5,-20.5,6,-10.5,"feuilles"],[23.5,0,-19.5,24.5,3.5,-18.5,"tronc"],[22.5,3.5,-20.5,25.5,6,-17.5,"feuilles"],[-7.5,0,-26.5,-6.5,3.5,-25.5,"tronc"],[-8.5,3.5,-27.5,-5.5,6,-24.5,"feuilles"],[7,0,-10,9,.2,-8,"trampoline"],[-9,0,-10,-7,.2,-8,"trampoline"],[27,0,-31,27.4,4.5,-30.6,"tronc"],[30.6,0,-31,31,4.5,-30.6,"tronc"],[27,0,-27.4,27.4,4.5,-27,"tronc"],[30.6,0,-27.4,31,4.5,-27,"tronc"],[27,4.5,-31,31,4.9,-27,"planches"],[27,4.9,-31,31,5.6,-30.8,"planches"],[30.8,4.9,-31,31,5.6,-27,"planches"],[-27.4,0,-31,-27,4.5,-30.6,"tronc"],[-31,0,-31,-30.6,4.5,-30.6,"tronc"],[-27.4,0,-27.4,-27,4.5,-27,"tronc"],[-31,0,-27.4,-30.6,4.5,-27,"tronc"],[-31,4.5,-31,-27,4.9,-27,"planches"],[-31,4.9,-31,-27,5.6,-30.8,"planches"],[-31,4.9,-31,-30.8,5.6,-27,"planches"],[-25.5,0,-28.5,-23.5,.2,-26.5,"trampoline"],[23.5,0,-28.5,25.5,.2,-26.5,"trampoline"],[-1.25,3.7,4,1.25,4,11,"planches"],[-3,0,11,3,4,15,"bois"],[2.6,4,11,3,5,15,"bois"],[-3,4,11,-2.6,5,15,"bois"],[-1.5,0,22,1.5,.5,23,"pierre"],[-1.5,0,21,1.5,1,22,"pierre"],[-1.5,0,20,1.5,1.5,21,"pierre"],[-1.5,0,19,1.5,2,20,"pierre"],[-1.5,0,18,1.5,2.5,19,"pierre"],[-1.5,0,17,1.5,3,18,"pierre"],[-1.5,0,16,1.5,3.5,17,"pierre"],[-1.5,0,15,1.5,4,16,"pierre"],[3,0,20,10,1.2,21,"pierre"],[-10,0,20,-3,1.2,21,"pierre"],[15,0,30.1,22,3,30.5,"planches"],[19.4,0,25,22,3,25.4,"planches"],[17.6,2.5,25,19.4,3,25.4,"planches"],[15,0,25,17.6,3,25.4,"planches"],[21.6,0,28.55,22,3,30.1,"planches"],[21.6,0,26.95,22,1.1,28.55,"planches"],[21.6,2.1,26.95,22,3,28.55,"planches"],[21.6,0,25.4,22,3,26.95,"planches"],[15,0,28.55,15.4,3,30.1,"planches"],[15,0,26.95,15.4,1.1,28.55,"planches"],[15,2.1,26.95,15.4,3,28.55,"planches"],[15,0,25.4,15.4,3,26.95,"planches"],[15,2.7,25,22,3,30.5,"bois"],[-22,0,30.1,-15,3,30.5,"planches"],[-17.6,0,25,-15,3,25.4,"planches"],[-19.4,2.5,25,-17.6,3,25.4,"planches"],[-22,0,25,-19.4,3,25.4,"planches"],[-15.4,0,28.55,-15,3,30.1,"planches"],[-15.4,0,26.95,-15,1.1,28.55,"planches"],[-15.4,2.1,26.95,-15,3,28.55,"planches"],[-15.4,0,25.4,-15,3,26.95,"planches"],[-22,0,28.55,-21.6,3,30.1,"planches"],[-22,0,26.95,-21.6,1.1,28.55,"planches"],[-22,2.1,26.95,-21.6,3,28.55,"planches"],[-22,0,25.4,-21.6,3,26.95,"planches"],[-22,2.7,25,-15,3,30.5,"bois"],[23.5,0,21.5,25.5,.2,23.5,"trampoline"],[-13,0,9,-12,3.2,15,"brique"],[-24,0,6,-19,2.4,7,"pierre"],[-18.1,0,7.9,-16.9,1.2,9.1,"caisse"],[12,0,9,13,3.2,15,"brique"],[19,0,6,24,2.4,7,"pierre"],[16.9,0,7.9,18.1,1.2,9.1,"caisse"],[-19.6,0,2.6,-17,2.8,3,"brique"],[-21.4,2.5,2.6,-19.6,2.8,3,"brique"],[-24,0,2.6,-21.4,2.8,3,"brique"],[-19.6,0,-3,-17,2.8,-2.6,"brique"],[-21.4,2.5,-3,-19.6,2.8,-2.6,"brique"],[-24,0,-3,-21.4,2.8,-2.6,"brique"],[-17.4,0,1,-17,2.8,2.6,"brique"],[-17.4,0,-1,-17,1.1,1,"brique"],[-17.4,2,-1,-17,2.8,1,"brique"],[-17.4,0,-2.6,-17,2.8,-1,"brique"],[-24,0,1,-23.6,2.8,2.6,"brique"],[-24,0,-1,-23.6,1.1,1,"brique"],[-24,2,-1,-23.6,2.8,1,"brique"],[-24,0,-2.6,-23.6,2.8,-1,"brique"],[-24,2.5,-3,-17,2.8,3,"metal"],[-34,0,-10,-30,3,10,"bois"],[-30.3,3,-10,-30,3.8,10,"pierre"],[-34,0,15,-30,.5,16,"pierre"],[-34,0,14,-30,1,15,"pierre"],[-34,0,13,-30,1.5,14,"pierre"],[-34,0,12,-30,2,13,"pierre"],[-34,0,11,-30,2.5,12,"pierre"],[-34,0,10,-30,3,11,"pierre"],[-8.7,0,4.3,-7.3,1.4,5.7,"caisse"],[-8.6,0,5.8,-7.4,1.2,7,"caisse"],[-8.5,1.4,4.5,-7.5,2.4,5.5,"caisse"],[-6.8,0,12.2,-5.2,1.6,13.8,"caisse"],[6.3,0,12.3,7.7,1.4,13.7,"caisse"],[-17.7,0,11.3,-16.3,1.4,12.7,"caisse"],[-26.7,0,15.3,-25.3,1.4,16.7,"caisse"],[-26.6,0,16.8,-25.4,1.2,18,"caisse"],[-22.7,0,21.3,-21.3,1.4,22.7,"caisse"],[25.3,0,13.3,26.7,1.4,14.7,"caisse"],[-10.6,0,26.4,-9.4,1.2,27.6,"caisse"],[9.4,0,26.4,10.6,1.2,27.6,"caisse"],[21.5,0,11.5,22.5,3.5,12.5,"tronc"],[20.5,3.5,10.5,23.5,6,13.5,"feuilles"],[-24.5,0,18.5,-23.5,3.5,19.5,"tronc"],[-25.5,3.5,17.5,-22.5,6,20.5,"feuilles"],[6.5,0,25.5,7.5,3.5,26.5,"tronc"],[5.5,3.5,24.5,8.5,6,27.5,"feuilles"],[-9,0,8,-7,.2,10,"trampoline"],[7,0,8,9,.2,10,"trampoline"],[-27.4,0,30.6,-27,4.5,31,"tronc"],[-31,0,30.6,-30.6,4.5,31,"tronc"],[-27.4,0,27,-27,4.5,27.4,"tronc"],[-31,0,27,-30.6,4.5,27.4,"tronc"],[-31,4.5,27,-27,4.9,31,"planches"],[-31,4.9,30.8,-27,5.6,31,"planches"],[-31,4.9,27,-30.8,5.6,31,"planches"],[27,0,30.6,27.4,4.5,31,"tronc"],[30.6,0,30.6,31,4.5,31,"tronc"],[27,0,27,27.4,4.5,27.4,"tronc"],[30.6,0,27,31,4.5,27.4,"tronc"],[27,4.5,27,31,4.9,31,"planches"],[27,4.9,30.8,31,5.6,31,"planches"],[30.8,4.9,27,31,5.6,31,"planches"],[23.5,0,26.5,25.5,.2,28.5,"trampoline"],[-25.5,0,26.5,-23.5,.2,28.5,"trampoline"]],decors:[[-34,7.5,-34,34,7.8,-33.85,"neon"],[-34,7.5,33.85,34,7.8,34,"neon"],[-34,7.5,-34,-33.85,7.8,34,"neon"],[33.85,7.5,-34,34,7.8,34,"neon"],[-1.5,0,-34,1.5,.02,34,"terre"],[-34,0,-1.5,34,.02,1.5,"terre"],[-14,0,17,14,.02,19,"terre"],[-14,0,-19,14,.02,-17,"terre"],[-4.6,7.9,-4.6,4.6,8,4.6,"neon"],[-1.3,4,-11,-1.1,4.9,-4,"bois"],[1.1,4,-11,1.3,4.9,-4,"bois"],[-10,1.2,-21,-3,1.35,-20,"neon"],[3,1.2,-21,10,1.35,-20,"neon"],[-13.08,0,-24.08,-12.92,6,-23.92,"metal"],[-12.92,3.8,-24.04,-11.1,5.8,-23.96,"tissu_bleu"],[10.92,0,-24.08,11.08,6,-23.92,"metal"],[11.08,3.8,-24.04,12.9,5.8,-23.96,"tissu_bleu"],[-23,6,-13,-21,6.7,-11,"feuilles"],[23,6,-20,25,6.7,-18,"feuilles"],[-8,6,-27,-6,6.7,-25,"feuilles"],[-15.45,0,-8.45,-14.55,.6,-7.55,"feuilles"],[4.55,0,-18.45,5.45,.6,-17.55,"feuilles"],[-28.45,0,-20.45,-27.55,.6,-19.55,"feuilles"],[27.55,0,-7.45,28.45,.6,-6.55,"feuilles"],[12.55,0,-21.45,13.45,.6,-20.55,"feuilles"],[-19.45,0,-17.45,-18.55,.6,-16.55,"feuilles"],[2.55,0,-30.45,3.45,.6,-29.55,"feuilles"],[-30.45,0,-3.45,-29.55,.6,-2.55,"feuilles"],[27,7.2,-31.2,31,7.5,-26.8,"toit_rouge"],[27,4.9,-31,27.2,7.2,-30.8,"tronc"],[30.8,4.9,-31,31,7.2,-30.8,"tronc"],[27,4.9,-27.2,27.2,7.2,-27,"tronc"],[30.8,4.9,-27.2,31,7.2,-27,"tronc"],[-31,7.2,-31.2,-27,7.5,-26.8,"toit_rouge"],[-27.2,4.9,-31,-27,7.2,-30.8,"tronc"],[-31,4.9,-31,-30.8,7.2,-30.8,"tronc"],[-27.2,4.9,-27.2,-27,7.2,-27,"tronc"],[-31,4.9,-27.2,-30.8,7.2,-27,"tronc"],[-4.1,0,-17.1,-3.9,3.4,-16.9,"metal"],[-4.3,3.4,-17.3,-3.7,3.8,-16.7,"lampe"],[-4.38,3.8,-17.38,-3.62,3.9,-16.62,"metal"],[3.9,0,-17.1,4.1,3.4,-16.9,"metal"],[3.7,3.4,-17.3,4.3,3.8,-16.7,"lampe"],[3.62,3.8,-17.38,4.38,3.9,-16.62,"metal"],[-15.1,0,-1.6,-14.9,3.4,-1.4,"metal"],[-15.3,3.4,-1.8,-14.7,3.8,-1.2,"lampe"],[-15.38,3.8,-1.88,-14.62,3.9,-1.12,"metal"],[14.9,0,-1.6,15.1,3.4,-1.4,"metal"],[14.7,3.4,-1.8,15.3,3.8,-1.2,"lampe"],[14.62,3.8,-1.88,15.38,3.9,-1.12,"metal"],[-25.1,0,-9.1,-24.9,3.4,-8.9,"metal"],[-25.3,3.4,-9.3,-24.7,3.8,-8.7,"lampe"],[-25.38,3.8,-9.38,-24.62,3.9,-8.62,"metal"],[24.9,0,-9.1,25.1,3.4,-8.9,"metal"],[24.7,3.4,-9.3,25.3,3.8,-8.7,"lampe"],[24.62,3.8,-9.38,25.38,3.9,-8.62,"metal"],[-12.1,0,-30.1,-11.9,3.4,-29.9,"metal"],[-12.3,3.4,-30.3,-11.7,3.8,-29.7,"lampe"],[-12.38,3.8,-30.38,-11.62,3.9,-29.62,"metal"],[11.9,0,-30.1,12.1,3.4,-29.9,"metal"],[11.7,3.4,-30.3,12.3,3.8,-29.7,"lampe"],[11.62,3.8,-30.38,12.38,3.9,-29.62,"metal"],[1.1,4,4,1.3,4.9,11,"bois"],[-1.3,4,4,-1.1,4.9,11,"bois"],[3,1.2,20,10,1.35,21,"neon"],[-10,1.2,20,-3,1.35,21,"neon"],[12.92,0,23.92,13.08,6,24.08,"metal"],[11.1,3.8,23.96,12.92,5.8,24.04,"tissu_bleu"],[-11.08,0,23.92,-10.92,6,24.08,"metal"],[-12.9,3.8,23.96,-11.08,5.8,24.04,"tissu_bleu"],[21,6,11,23,6.7,13,"feuilles"],[-25,6,18,-23,6.7,20,"feuilles"],[6,6,25,8,6.7,27,"feuilles"],[14.55,0,7.55,15.45,.6,8.45,"feuilles"],[-5.45,0,17.55,-4.55,.6,18.45,"feuilles"],[27.55,0,19.55,28.45,.6,20.45,"feuilles"],[-28.45,0,6.55,-27.55,.6,7.45,"feuilles"],[-13.45,0,20.55,-12.55,.6,21.45,"feuilles"],[18.55,0,16.55,19.45,.6,17.45,"feuilles"],[-3.45,0,29.55,-2.55,.6,30.45,"feuilles"],[29.55,0,2.55,30.45,.6,3.45,"feuilles"],[-31,7.2,26.8,-27,7.5,31.2,"toit_rouge"],[-27.2,4.9,30.8,-27,7.2,31,"tronc"],[-31,4.9,30.8,-30.8,7.2,31,"tronc"],[-27.2,4.9,27,-27,7.2,27.2,"tronc"],[-31,4.9,27,-30.8,7.2,27.2,"tronc"],[27,7.2,26.8,31,7.5,31.2,"toit_rouge"],[27,4.9,30.8,27.2,7.2,31,"tronc"],[30.8,4.9,30.8,31,7.2,31,"tronc"],[27,4.9,27,27.2,7.2,27.2,"tronc"],[30.8,4.9,27,31,7.2,27.2,"tronc"],[3.9,0,16.9,4.1,3.4,17.1,"metal"],[3.7,3.4,16.7,4.3,3.8,17.3,"lampe"],[3.62,3.8,16.62,4.38,3.9,17.38,"metal"],[-4.1,0,16.9,-3.9,3.4,17.1,"metal"],[-4.3,3.4,16.7,-3.7,3.8,17.3,"lampe"],[-4.38,3.8,16.62,-3.62,3.9,17.38,"metal"],[14.9,0,1.4,15.1,3.4,1.6,"metal"],[14.7,3.4,1.2,15.3,3.8,1.8,"lampe"],[14.62,3.8,1.12,15.38,3.9,1.88,"metal"],[-15.1,0,1.4,-14.9,3.4,1.6,"metal"],[-15.3,3.4,1.2,-14.7,3.8,1.8,"lampe"],[-15.38,3.8,1.12,-14.62,3.9,1.88,"metal"],[24.9,0,8.9,25.1,3.4,9.1,"metal"],[24.7,3.4,8.7,25.3,3.8,9.3,"lampe"],[24.62,3.8,8.62,25.38,3.9,9.38,"metal"],[-25.1,0,8.9,-24.9,3.4,9.1,"metal"],[-25.3,3.4,8.7,-24.7,3.8,9.3,"lampe"],[-25.38,3.8,8.62,-24.62,3.9,9.38,"metal"],[11.9,0,29.9,12.1,3.4,30.1,"metal"],[11.7,3.4,29.7,12.3,3.8,30.3,"lampe"],[11.62,3.8,29.62,12.38,3.9,30.38,"metal"],[-12.1,0,29.9,-11.9,3.4,30.1,"metal"],[-12.3,3.4,29.7,-11.7,3.8,30.3,"lampe"],[-12.38,3.8,29.62,-11.62,3.9,30.38,"metal"]],apparitions:[{x:-12,y:0,z:-32,angle:180,equipe:0},{x:-6,y:0,z:-32,angle:180,equipe:0},{x:0,y:0,z:-32,angle:180,equipe:0},{x:6,y:0,z:-32,angle:180,equipe:0},{x:12,y:0,z:-32,angle:180,equipe:0},{x:-27,y:0,z:3,angle:-84,equipe:null},{x:-14,y:0,z:3,angle:-78,equipe:null},{x:-11,y:0,z:-24,angle:-155,equipe:null},{x:20,y:0,z:-18,angle:132,equipe:null},{x:-30,y:0,z:-24,angle:-129,equipe:null},{x:30,y:0,z:-18,angle:121,equipe:null},{x:12,y:0,z:32,angle:0,equipe:1},{x:6,y:0,z:32,angle:0,equipe:1},{x:0,y:0,z:32,angle:0,equipe:1},{x:-6,y:0,z:32,angle:0,equipe:1},{x:-12,y:0,z:32,angle:0,equipe:1},{x:27,y:0,z:-3,angle:96,equipe:null},{x:14,y:0,z:-3,angle:102,equipe:null},{x:11,y:0,z:24,angle:25,equipe:null},{x:-20,y:0,z:18,angle:-48,equipe:null},{x:30,y:0,z:24,angle:51,equipe:null},{x:-30,y:0,z:18,angle:-59,equipe:null}]};var ju={_aide:"Carte d'Arena FPS (fabriqu\xE9e par games/fps/outils/cartes.py : modifie plut\xF4t ce script). taille = demi-c\xF4t\xE9 de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, mati\xE8re] (en m\xE8tres, le sol est \xE0 y = 0) ; decors = blocs sans collision ; apparitions : y = hauteur du sol, angle en degr\xE9s (0 = regarde vers le nord, 90 = l'ouest, -90 = l'est, 180 = le sud), equipe 0 = Bleus (au nord), 1 = Rouges (au sud), null = chacun pour soi. Les vitres et les murs invisibles laissent passer les balles.",id:"chateau",nom:"Ch\xE2teau",description:"Un ch\xE2teau fort avec ses douves, ses remparts, son donjon et un village autour.",taille:44,ambiance:{ciel:["#3b5fa6","#ffcf96"],brouillard:["#f3d0a4",75,260],soleil:{couleur:"#ffbe7a",intensite:2.3,position:[-50,32,22]},ambiante:{ciel:"#ffe0bd",sol:"#4f5d35",intensite:1.15},nuages:!0},eau:{niveau:-.4,couleur:"#4fa6c9"},boites:[[-44,-3,-44,44,0,-24,"herbe"],[-44,-3,24,44,0,44,"herbe"],[-44,-3,-24,-24,0,24,"herbe"],[24,-3,-24,44,0,24,"herbe"],[-24,-3,-24,24,-1.6,24,"terre"],[-18,-3,-18,18,0,18,"pave"],[-45,-5,-45,45,14,-44,"invisible"],[-45,-5,44,45,14,45,"invisible"],[-45,-5,-44,-44,14,44,"invisible"],[44,-5,-44,45,14,44,"invisible"],[-6,0,-6,-3,12,-5,"pierre_chateau"],[-3,0,-6,-2,5,-5,"pierre_chateau"],[-3,6.2,-6,-2,9,-5,"pierre_chateau"],[-3,10.2,-6,-2,12,-5,"pierre_chateau"],[-2,0,-6,2,12,-5,"pierre_chateau"],[2,0,-6,3,5,-5,"pierre_chateau"],[2,6.2,-6,3,9,-5,"pierre_chateau"],[2,10.2,-6,3,12,-5,"pierre_chateau"],[3,0,-6,6,12,-5,"pierre_chateau"],[-6,0,5,-3,12,6,"pierre_chateau"],[-3,0,5,-2,5,6,"pierre_chateau"],[-3,6.2,5,-2,9,6,"pierre_chateau"],[-3,10.2,5,-2,12,6,"pierre_chateau"],[-2,0,5,2,12,6,"pierre_chateau"],[2,0,5,3,5,6,"pierre_chateau"],[2,6.2,5,3,9,6,"pierre_chateau"],[2,10.2,5,3,12,6,"pierre_chateau"],[3,0,5,6,12,6,"pierre_chateau"],[-6,0,-5,-5,12,-3,"pierre_chateau"],[-6,0,-3,-5,9,-2,"pierre_chateau"],[-6,10.2,-3,-5,12,-2,"pierre_chateau"],[-6,0,-2,-5,12,-1,"pierre_chateau"],[-6,2.5,-1,-5,12,1,"pierre_chateau"],[-6,0,1,-5,12,2,"pierre_chateau"],[-6,0,2,-5,9,2.5,"pierre_chateau"],[-6,10.2,2,-5,12,2.5,"pierre_chateau"],[-6,0,2.5,-5,5,3,"pierre_chateau"],[-6,6.2,2.5,-5,9,3,"pierre_chateau"],[-6,10.2,2.5,-5,12,3,"pierre_chateau"],[-6,0,3,-5,5,3.5,"pierre_chateau"],[-6,6.2,3,-5,12,3.5,"pierre_chateau"],[-6,0,3.5,-5,12,5,"pierre_chateau"],[5,0,-5,6,12,-3.5,"pierre_chateau"],[5,0,-3.5,6,5,-3,"pierre_chateau"],[5,6.2,-3.5,6,12,-3,"pierre_chateau"],[5,0,-3,6,5,-2.5,"pierre_chateau"],[5,6.2,-3,6,9,-2.5,"pierre_chateau"],[5,10.2,-3,6,12,-2.5,"pierre_chateau"],[5,0,-2.5,6,9,-2,"pierre_chateau"],[5,10.2,-2.5,6,12,-2,"pierre_chateau"],[5,0,-2,6,12,-1,"pierre_chateau"],[5,2.5,-1,6,12,1,"pierre_chateau"],[5,0,1,6,12,2,"pierre_chateau"],[5,0,2,6,9,3,"pierre_chateau"],[5,10.2,2,6,12,3,"pierre_chateau"],[5,0,3,6,12,5,"pierre_chateau"],[-5,3.6,-3.5,5,4,5,"planches"],[4,3.6,-5,5,4,-3.5,"planches"],[-5,.2,-5,-4,.5,-3.5,"planches"],[-4,.7,-5,-3,1,-3.5,"planches"],[-3,1.2,-5,-2,1.5,-3.5,"planches"],[-2,1.7,-5,-1,2,-3.5,"planches"],[-1,2.2,-5,0,2.5,-3.5,"planches"],[0,2.7,-5,1,3,-3.5,"planches"],[1,3.2,-5,2,3.5,-3.5,"planches"],[2,3.7,-5,3,4,-3.5,"planches"],[-5,7.6,-5,5,8,3.5,"planches"],[-5,7.6,3.5,-4,8,5,"planches"],[4,4.2,3.5,5,4.5,5,"planches"],[3,4.7,3.5,4,5,5,"planches"],[2,5.2,3.5,3,5.5,5,"planches"],[1,5.7,3.5,2,6,5,"planches"],[0,6.2,3.5,1,6.5,5,"planches"],[-1,6.7,3.5,0,7,5,"planches"],[-2,7.2,3.5,-1,7.5,5,"planches"],[-3,7.7,3.5,-2,8,5,"planches"],[-6,11.6,-3.5,6,12,6,"pierre_chateau"],[-6,11.6,-6,6,12,-5,"pierre_chateau"],[4,11.6,-5,6,12,-3.5,"pierre_chateau"],[-6,11.6,-5,-5,12,-3.5,"pierre_chateau"],[-5,8.2,-5,-4,8.5,-3.5,"planches"],[-4,8.7,-5,-3,9,-3.5,"planches"],[-3,9.2,-5,-2,9.5,-3.5,"planches"],[-2,9.7,-5,-1,10,-3.5,"planches"],[-1,10.2,-5,0,10.5,-3.5,"planches"],[0,10.7,-5,1,11,-3.5,"planches"],[1,11.2,-5,2,11.5,-3.5,"planches"],[2,11.7,-5,3,12,-3.5,"planches"],[-6,12,-6,-5,13.2,-5.6,"pierre_chateau"],[-4,12,-6,-3,13.2,-5.6,"pierre_chateau"],[-2,12,-6,-1,13.2,-5.6,"pierre_chateau"],[0,12,-6,1,13.2,-5.6,"pierre_chateau"],[2,12,-6,3,13.2,-5.6,"pierre_chateau"],[4,12,-6,5,13.2,-5.6,"pierre_chateau"],[-6,12,5.6,-5,13.2,6,"pierre_chateau"],[-4,12,5.6,-3,13.2,6,"pierre_chateau"],[-2,12,5.6,-1,13.2,6,"pierre_chateau"],[0,12,5.6,1,13.2,6,"pierre_chateau"],[2,12,5.6,3,13.2,6,"pierre_chateau"],[4,12,5.6,5,13.2,6,"pierre_chateau"],[-6,12,-5,-5.6,13.2,-4,"pierre_chateau"],[-6,12,-3,-5.6,13.2,-2,"pierre_chateau"],[-6,12,-1,-5.6,13.2,0,"pierre_chateau"],[-6,12,1,-5.6,13.2,2,"pierre_chateau"],[-6,12,3,-5.6,13.2,4,"pierre_chateau"],[5.6,12,-5,6,13.2,-4,"pierre_chateau"],[5.6,12,-3,6,13.2,-2,"pierre_chateau"],[5.6,12,-1,6,13.2,0,"pierre_chateau"],[5.6,12,1,6,13.2,2,"pierre_chateau"],[5.6,12,3,6,13.2,4,"pierre_chateau"],[-1,4,-1,1,5.2,1,"caisse"],[-3.8,8,.5,-2.4,9.1,2,"caisse"],[-18,-3,-18,-2.5,6,-16,"pierre_chateau"],[-2.5,-3,-18,2.5,0,-16,"pierre_chateau"],[-2.5,3.4,-18,2.5,6,-16,"pierre_chateau"],[2.5,-3,-18,18,6,-16,"pierre_chateau"],[-18,-3,-16,-16,6,0,"pierre_chateau"],[16,-3,-16,18,6,-9.5,"pierre_chateau"],[16,-3,-9.5,18,0,-8,"pierre_chateau"],[16,2.4,-9.5,18,6,-8,"pierre_chateau"],[16,-3,-8,18,6,0,"pierre_chateau"],[-13,6,-18,-12,7.2,-17.6,"pierre_chateau"],[-11,6,-18,-10,7.2,-17.6,"pierre_chateau"],[-9,6,-18,-8,7.2,-17.6,"pierre_chateau"],[7,6,-18,8,7.2,-17.6,"pierre_chateau"],[9,6,-18,10,7.2,-17.6,"pierre_chateau"],[11,6,-18,12,7.2,-17.6,"pierre_chateau"],[-18,6,-12,-17.6,7.2,-11,"pierre_chateau"],[-18,6,-10,-17.6,7.2,-9,"pierre_chateau"],[-18,6,-8,-17.6,7.2,-7,"pierre_chateau"],[-18,6,-6,-17.6,7.2,-5,"pierre_chateau"],[-18,6,-4,-17.6,7.2,-3,"pierre_chateau"],[-18,6,-2,-17.6,7.2,-1,"pierre_chateau"],[17.6,6,-12,18,7.2,-11,"pierre_chateau"],[17.6,6,-10,18,7.2,-9,"pierre_chateau"],[17.6,6,-8,18,7.2,-7,"pierre_chateau"],[17.6,6,-6,18,7.2,-5,"pierre_chateau"],[17.6,6,-4,18,7.2,-3,"pierre_chateau"],[17.6,6,-2,18,7.2,-1,"pierre_chateau"],[14,-3,-20,20,8,-14,"pierre_chateau"],[14,8,-20,15,9.2,-19.6,"pierre_chateau"],[16,8,-20,17,9.2,-19.6,"pierre_chateau"],[18,8,-20,19,9.2,-19.6,"pierre_chateau"],[19.6,8,-19,20,9.2,-18,"pierre_chateau"],[19.6,8,-17,20,9.2,-16,"pierre_chateau"],[19.6,8,-15,20,9.2,-14,"pierre_chateau"],[10,6,-18,11,6.5,-16,"pierre_chateau"],[11,6,-18,12,7,-16,"pierre_chateau"],[12,6,-18,13,7.5,-16,"pierre_chateau"],[13,6,-18,14,8,-16,"pierre_chateau"],[16,6,-11,18,6.5,-10,"pierre_chateau"],[16,6,-12,18,7,-11,"pierre_chateau"],[16,6,-13,18,7.5,-12,"pierre_chateau"],[16,6,-14,18,8,-13,"pierre_chateau"],[-20,-3,-20,-14,8,-14,"pierre_chateau"],[-20,8,-20,-19,9.2,-19.6,"pierre_chateau"],[-18,8,-20,-17,9.2,-19.6,"pierre_chateau"],[-16,8,-20,-15,9.2,-19.6,"pierre_chateau"],[-20,8,-19,-19.6,9.2,-18,"pierre_chateau"],[-20,8,-17,-19.6,9.2,-16,"pierre_chateau"],[-20,8,-15,-19.6,9.2,-14,"pierre_chateau"],[-11,6,-18,-10,6.5,-16,"pierre_chateau"],[-12,6,-18,-11,7,-16,"pierre_chateau"],[-13,6,-18,-12,7.5,-16,"pierre_chateau"],[-14,6,-18,-13,8,-16,"pierre_chateau"],[-18,6,-11,-16,6.5,-10,"pierre_chateau"],[-18,6,-12,-16,7,-11,"pierre_chateau"],[-18,6,-13,-16,7.5,-12,"pierre_chateau"],[-18,6,-14,-16,8,-13,"pierre_chateau"],[-6,-3,-20,-2.5,8,-15,"pierre_chateau"],[2.5,-3,-20,6,8,-15,"pierre_chateau"],[-2.5,3.4,-20,2.5,8,-15,"pierre_chateau"],[-6,8,-20,-5,9.2,-19.6,"pierre_chateau"],[-4,8,-20,-3,9.2,-19.6,"pierre_chateau"],[-2,8,-20,-1,9.2,-19.6,"pierre_chateau"],[0,8,-20,1,9.2,-19.6,"pierre_chateau"],[2,8,-20,3,9.2,-19.6,"pierre_chateau"],[4,8,-20,5,9.2,-19.6,"pierre_chateau"],[-10,6,-18,-9,6.5,-16,"pierre_chateau"],[-9,6,-18,-8,7,-16,"pierre_chateau"],[-8,6,-18,-7,7.5,-16,"pierre_chateau"],[-7,6,-18,-6,8,-16,"pierre_chateau"],[9,6,-18,10,6.5,-16,"pierre_chateau"],[8,6,-18,9,7,-16,"pierre_chateau"],[7,6,-18,8,7.5,-16,"pierre_chateau"],[6,6,-18,7,8,-16,"pierre_chateau"],[-2.5,-.3,-24,2.5,0,-20,"planches"],[9,0,-5,11,.5,-4,"pierre_chateau"],[9,0,-6,11,1,-5,"pierre_chateau"],[9,0,-7,11,1.5,-6,"pierre_chateau"],[9,0,-8,11,2,-7,"pierre_chateau"],[9,0,-9,11,2.5,-8,"pierre_chateau"],[9,0,-10,11,3,-9,"pierre_chateau"],[9,0,-11,11,3.5,-10,"pierre_chateau"],[9,0,-12,11,4,-11,"pierre_chateau"],[9,0,-13,11,4.5,-12,"pierre_chateau"],[9,0,-14,11,5,-13,"pierre_chateau"],[9,0,-15,11,5.5,-14,"pierre_chateau"],[9,0,-16,11,6,-15,"pierre_chateau"],[-5,0,-11,-4,.5,-9,"pierre_chateau"],[-6,0,-11,-5,1,-9,"pierre_chateau"],[-7,0,-11,-6,1.5,-9,"pierre_chateau"],[-8,0,-11,-7,2,-9,"pierre_chateau"],[-9,0,-11,-8,2.5,-9,"pierre_chateau"],[-10,0,-11,-9,3,-9,"pierre_chateau"],[-11,0,-11,-10,3.5,-9,"pierre_chateau"],[-12,0,-11,-11,4,-9,"pierre_chateau"],[-13,0,-11,-12,4.5,-9,"pierre_chateau"],[-14,0,-11,-13,5,-9,"pierre_chateau"],[-15,0,-11,-14,5.5,-9,"pierre_chateau"],[-16,0,-11,-15,6,-9,"pierre_chateau"],[12.5,0,-12,14.5,.2,-10,"trampoline"],[18,-3,-9.5,24,-.5,-8,"pierre"],[11,-1.6,-22,13,-1.1,-21,"pierre"],[11,-1.6,-23,13,-.6,-22,"pierre"],[11,-1.6,-24,13,-.1,-23,"pierre"],[-13,-1.6,-22,-11,-1.1,-21,"pierre"],[-13,-1.6,-23,-11,-.6,-22,"pierre"],[-13,-1.6,-24,-11,-.1,-23,"pierre"],[21,-1.6,-13,22,-1.1,-11,"pierre"],[22,-1.6,-13,23,-.6,-11,"pierre"],[23,-1.6,-13,24,-.1,-11,"pierre"],[-13.5,0,-14.5,-11.5,1,-13.5,"paille"],[-13.5,0,-13.4,-11.5,1,-12.4,"paille"],[-13,1,-14.3,-12,2,-12.8,"paille"],[4,.5,-13,7,1.3,-11.5,"planches"],[-4,0,-13,0,1.1,-12.2,"planches"],[-13,0,-5,-11,1,-3,"pierre"],[6.9,0,-8.1,8.1,1.2,-6.9,"caisse"],[-8.6,0,-7.6,-7.4,1.2,-6.4,"caisse"],[12.4,0,-3.6,13.6,1.2,-2.4,"caisse"],[-16,0,-33,-9,1.2,-32.5,"planches"],[-3,0,-33,3,1.2,-32.5,"planches"],[9,0,-33,16,1.2,-32.5,"planches"],[-26.5,0,-40,-21.5,.25,-36,"planches"],[21.5,0,-40,26.5,.25,-36,"planches"],[30,0,-15,32,2.6,-14.7,"planches"],[32,0,-15,33,1,-14.7,"planches"],[32,1.8,-15,33,2.6,-14.7,"planches"],[33,0,-15,35,2.6,-14.7,"planches"],[30,0,-11.3,35,2.6,-11,"planches"],[30,0,-14.7,30.3,2.6,-13.8,"planches"],[30,2.5,-13.8,30.3,2.6,-12.2,"planches"],[30,0,-12.2,30.3,2.6,-11.3,"planches"],[34.7,0,-14.7,35,2.6,-11.3,"planches"],[29.7,2.6,-15.3,35.3,3,-10.7,"paille"],[30.4,3,-14.6,34.6,3.4,-11.4,"paille"],[31.1,3.4,-13.9,33.9,3.8,-12.1,"paille"],[36,0,-6,38,2.6,-5.7,"planches"],[38,0,-6,39,1,-5.7,"planches"],[38,1.8,-6,39,2.6,-5.7,"planches"],[39,0,-6,41,2.6,-5.7,"planches"],[36,0,-1.3,41,2.6,-1,"planches"],[36,0,-5.7,36.3,2.6,-4.3,"planches"],[36,2.5,-4.3,36.3,2.6,-2.7,"planches"],[36,0,-2.7,36.3,2.6,-1.3,"planches"],[40.7,0,-5.7,41,2.6,-1.3,"planches"],[35.7,2.6,-6.3,41.3,3,-.7,"paille"],[36.4,3,-5.6,40.6,3.4,-1.4,"paille"],[37.1,3.4,-4.9,39.9,3.8,-2.1,"paille"],[-39,0,-14,-37,2.6,-13.7,"planches"],[-37,0,-14,-36,1,-13.7,"planches"],[-37,1.8,-14,-36,2.6,-13.7,"planches"],[-36,0,-14,-34,2.6,-13.7,"planches"],[-39,0,-10.3,-34,2.6,-10,"planches"],[-39,0,-13.7,-38.7,2.6,-10.3,"planches"],[-34.3,0,-13.7,-34,2.6,-12.8,"planches"],[-34.3,2.5,-12.8,-34,2.6,-11.2,"planches"],[-34.3,0,-11.2,-34,2.6,-10.3,"planches"],[-39.3,2.6,-14.3,-33.7,3,-9.7,"paille"],[-38.6,3,-13.6,-34.4,3.4,-10.4,"paille"],[-37.9,3.4,-12.9,-35.1,3.8,-11.1,"paille"],[33,0,-28,39,2.6,-27.7,"planches"],[33,0,-24.3,35.2,2.6,-24,"planches"],[35.2,2.5,-24.3,36.8,2.6,-24,"planches"],[36.8,0,-24.3,39,2.6,-24,"planches"],[33,0,-27.7,33.3,2.6,-24.3,"planches"],[38.7,0,-27.7,39,2.6,-26.5,"planches"],[38.7,0,-26.5,39,1,-25.5,"planches"],[38.7,1.8,-26.5,39,2.6,-25.5,"planches"],[38.7,0,-25.5,39,2.6,-24.3,"planches"],[32.7,2.6,-28.3,39.3,3,-23.7,"paille"],[33.4,3,-27.6,38.6,3.4,-24.4,"paille"],[34.1,3.4,-26.9,37.9,3.8,-25.1,"paille"],[29,0,-20,30.2,1,-19,"caisse"],[36,0,-24,37.2,1,-23,"caisse"],[-40,0,-22,-34,1.1,-21.8,"planches"],[-31,0,-22,-26,1.1,-21.8,"planches"],[-26.2,0,-30,-26,1.1,-22,"planches"],[-36.75,0,-27.5,-35.25,1,-26.5,"paille"],[-34.75,0,-25.5,-33.25,1,-24.5,"paille"],[-30.75,0,-28.5,-29.25,1,-27.5,"paille"],[-14.5,0,-27.5,-13.5,4,-26.5,"tronc"],[-15.5,4,-28.5,-12.5,6.5,-25.5,"feuilles"],[13.5,0,-26.5,14.5,4,-25.5,"tronc"],[12.5,4,-27.5,15.5,6.5,-24.5,"feuilles"],[-32.5,0,-4.5,-31.5,4,-3.5,"tronc"],[-33.5,4,-5.5,-30.5,6.5,-2.5,"feuilles"],[39.5,0,-16.5,40.5,4,-15.5,"tronc"],[38.5,4,-17.5,41.5,6.5,-14.5,"feuilles"],[26.5,0,-36.5,27.5,4,-35.5,"tronc"],[25.5,4,-37.5,28.5,6.5,-34.5,"feuilles"],[-40.5,0,-30.5,-39.5,4,-29.5,"tronc"],[-41.5,4,-31.5,-38.5,6.5,-28.5,"feuilles"],[18.5,0,-40.5,19.5,4,-39.5,"tronc"],[17.5,4,-41.5,20.5,6.5,-38.5,"feuilles"],[-21.2,0,-28.2,-18.8,1.6,-25.8,"pierre"],[-21.7,0,-26.7,-20.3,2.4,-25.3,"pierre"],[19,0,-30,21,1.3,-28,"pierre"],[-29.1,0,-10.1,-26.9,1.5,-7.9,"pierre"],[38.8,0,-33.2,41.2,2,-30.8,"pierre"],[-5.8,0,-28.8,-4.2,1.1,-27.2,"pierre"],[-12,0,-29,-7,1.2,-28,"feuilles"],[6,0,-30,11,1.2,-29,"feuilles"],[-30,0,-16,-25,1.2,-15,"feuilles"],[3.2,0,-26.6,4.8,1.1,-25.4,"paille"],[-9.8,0,-34.1,-8.2,1.1,-32.9,"paille"],[16.2,0,-34.1,17.8,1.1,-32.9,"paille"],[-24.8,0,-30.6,-23.2,1.1,-29.4,"paille"],[2.5,-3,16,18,6,18,"pierre_chateau"],[-2.5,-3,16,2.5,0,18,"pierre_chateau"],[-2.5,3.4,16,2.5,6,18,"pierre_chateau"],[-18,-3,16,-2.5,6,18,"pierre_chateau"],[16,-3,0,18,6,16,"pierre_chateau"],[-18,-3,9.5,-16,6,16,"pierre_chateau"],[-18,-3,8,-16,0,9.5,"pierre_chateau"],[-18,2.4,8,-16,6,9.5,"pierre_chateau"],[-18,-3,0,-16,6,8,"pierre_chateau"],[12,6,17.6,13,7.2,18,"pierre_chateau"],[10,6,17.6,11,7.2,18,"pierre_chateau"],[8,6,17.6,9,7.2,18,"pierre_chateau"],[-8,6,17.6,-7,7.2,18,"pierre_chateau"],[-10,6,17.6,-9,7.2,18,"pierre_chateau"],[-12,6,17.6,-11,7.2,18,"pierre_chateau"],[17.6,6,11,18,7.2,12,"pierre_chateau"],[17.6,6,9,18,7.2,10,"pierre_chateau"],[17.6,6,7,18,7.2,8,"pierre_chateau"],[17.6,6,5,18,7.2,6,"pierre_chateau"],[17.6,6,3,18,7.2,4,"pierre_chateau"],[17.6,6,1,18,7.2,2,"pierre_chateau"],[-18,6,11,-17.6,7.2,12,"pierre_chateau"],[-18,6,9,-17.6,7.2,10,"pierre_chateau"],[-18,6,7,-17.6,7.2,8,"pierre_chateau"],[-18,6,5,-17.6,7.2,6,"pierre_chateau"],[-18,6,3,-17.6,7.2,4,"pierre_chateau"],[-18,6,1,-17.6,7.2,2,"pierre_chateau"],[-20,-3,14,-14,8,20,"pierre_chateau"],[-15,8,19.6,-14,9.2,20,"pierre_chateau"],[-17,8,19.6,-16,9.2,20,"pierre_chateau"],[-19,8,19.6,-18,9.2,20,"pierre_chateau"],[-20,8,18,-19.6,9.2,19,"pierre_chateau"],[-20,8,16,-19.6,9.2,17,"pierre_chateau"],[-20,8,14,-19.6,9.2,15,"pierre_chateau"],[-11,6,16,-10,6.5,18,"pierre_chateau"],[-12,6,16,-11,7,18,"pierre_chateau"],[-13,6,16,-12,7.5,18,"pierre_chateau"],[-14,6,16,-13,8,18,"pierre_chateau"],[-18,6,10,-16,6.5,11,"pierre_chateau"],[-18,6,11,-16,7,12,"pierre_chateau"],[-18,6,12,-16,7.5,13,"pierre_chateau"],[-18,6,13,-16,8,14,"pierre_chateau"],[14,-3,14,20,8,20,"pierre_chateau"],[19,8,19.6,20,9.2,20,"pierre_chateau"],[17,8,19.6,18,9.2,20,"pierre_chateau"],[15,8,19.6,16,9.2,20,"pierre_chateau"],[19.6,8,18,20,9.2,19,"pierre_chateau"],[19.6,8,16,20,9.2,17,"pierre_chateau"],[19.6,8,14,20,9.2,15,"pierre_chateau"],[10,6,16,11,6.5,18,"pierre_chateau"],[11,6,16,12,7,18,"pierre_chateau"],[12,6,16,13,7.5,18,"pierre_chateau"],[13,6,16,14,8,18,"pierre_chateau"],[16,6,10,18,6.5,11,"pierre_chateau"],[16,6,11,18,7,12,"pierre_chateau"],[16,6,12,18,7.5,13,"pierre_chateau"],[16,6,13,18,8,14,"pierre_chateau"],[2.5,-3,15,6,8,20,"pierre_chateau"],[-6,-3,15,-2.5,8,20,"pierre_chateau"],[-2.5,3.4,15,2.5,8,20,"pierre_chateau"],[5,8,19.6,6,9.2,20,"pierre_chateau"],[3,8,19.6,4,9.2,20,"pierre_chateau"],[1,8,19.6,2,9.2,20,"pierre_chateau"],[-1,8,19.6,0,9.2,20,"pierre_chateau"],[-3,8,19.6,-2,9.2,20,"pierre_chateau"],[-5,8,19.6,-4,9.2,20,"pierre_chateau"],[9,6,16,10,6.5,18,"pierre_chateau"],[8,6,16,9,7,18,"pierre_chateau"],[7,6,16,8,7.5,18,"pierre_chateau"],[6,6,16,7,8,18,"pierre_chateau"],[-10,6,16,-9,6.5,18,"pierre_chateau"],[-9,6,16,-8,7,18,"pierre_chateau"],[-8,6,16,-7,7.5,18,"pierre_chateau"],[-7,6,16,-6,8,18,"pierre_chateau"],[-2.5,-.3,20,2.5,0,24,"planches"],[-11,0,4,-9,.5,5,"pierre_chateau"],[-11,0,5,-9,1,6,"pierre_chateau"],[-11,0,6,-9,1.5,7,"pierre_chateau"],[-11,0,7,-9,2,8,"pierre_chateau"],[-11,0,8,-9,2.5,9,"pierre_chateau"],[-11,0,9,-9,3,10,"pierre_chateau"],[-11,0,10,-9,3.5,11,"pierre_chateau"],[-11,0,11,-9,4,12,"pierre_chateau"],[-11,0,12,-9,4.5,13,"pierre_chateau"],[-11,0,13,-9,5,14,"pierre_chateau"],[-11,0,14,-9,5.5,15,"pierre_chateau"],[-11,0,15,-9,6,16,"pierre_chateau"],[4,0,9,5,.5,11,"pierre_chateau"],[5,0,9,6,1,11,"pierre_chateau"],[6,0,9,7,1.5,11,"pierre_chateau"],[7,0,9,8,2,11,"pierre_chateau"],[8,0,9,9,2.5,11,"pierre_chateau"],[9,0,9,10,3,11,"pierre_chateau"],[10,0,9,11,3.5,11,"pierre_chateau"],[11,0,9,12,4,11,"pierre_chateau"],[12,0,9,13,4.5,11,"pierre_chateau"],[13,0,9,14,5,11,"pierre_chateau"],[14,0,9,15,5.5,11,"pierre_chateau"],[15,0,9,16,6,11,"pierre_chateau"],[-14.5,0,10,-12.5,.2,12,"trampoline"],[-24,-3,8,-18,-.5,9.5,"pierre"],[-13,-1.6,21,-11,-1.1,22,"pierre"],[-13,-1.6,22,-11,-.6,23,"pierre"],[-13,-1.6,23,-11,-.1,24,"pierre"],[11,-1.6,21,13,-1.1,22,"pierre"],[11,-1.6,22,13,-.6,23,"pierre"],[11,-1.6,23,13,-.1,24,"pierre"],[-22,-1.6,11,-21,-1.1,13,"pierre"],[-23,-1.6,11,-22,-.6,13,"pierre"],[-24,-1.6,11,-23,-.1,13,"pierre"],[11.5,0,13.5,13.5,1,14.5,"paille"],[11.5,0,12.4,13.5,1,13.4,"paille"],[12,1,12.8,13,2,14.3,"paille"],[-7,.5,11.5,-4,1.3,13,"planches"],[0,0,12.2,4,1.1,13,"planches"],[11,0,3,13,1,5,"pierre"],[-8.1,0,6.9,-6.9,1.2,8.1,"caisse"],[7.4,0,6.4,8.6,1.2,7.6,"caisse"],[-13.6,0,2.4,-12.4,1.2,3.6,"caisse"],[9,0,32.5,16,1.2,33,"planches"],[-3,0,32.5,3,1.2,33,"planches"],[-16,0,32.5,-9,1.2,33,"planches"],[21.5,0,36,26.5,.25,40,"planches"],[-26.5,0,36,-21.5,.25,40,"planches"],[-32,0,14.7,-30,2.6,15,"planches"],[-33,0,14.7,-32,1,15,"planches"],[-33,1.8,14.7,-32,2.6,15,"planches"],[-35,0,14.7,-33,2.6,15,"planches"],[-35,0,11,-30,2.6,11.3,"planches"],[-30.3,0,13.8,-30,2.6,14.7,"planches"],[-30.3,2.5,12.2,-30,2.6,13.8,"planches"],[-30.3,0,11.3,-30,2.6,12.2,"planches"],[-35,0,11.3,-34.7,2.6,14.7,"planches"],[-35.3,2.6,10.7,-29.7,3,15.3,"paille"],[-34.6,3,11.4,-30.4,3.4,14.6,"paille"],[-33.9,3.4,12.1,-31.1,3.8,13.9,"paille"],[-38,0,5.7,-36,2.6,6,"planches"],[-39,0,5.7,-38,1,6,"planches"],[-39,1.8,5.7,-38,2.6,6,"planches"],[-41,0,5.7,-39,2.6,6,"planches"],[-41,0,1,-36,2.6,1.3,"planches"],[-36.3,0,4.3,-36,2.6,5.7,"planches"],[-36.3,2.5,2.7,-36,2.6,4.3,"planches"],[-36.3,0,1.3,-36,2.6,2.7,"planches"],[-41,0,1.3,-40.7,2.6,5.7,"planches"],[-41.3,2.6,.7,-35.7,3,6.3,"paille"],[-40.6,3,1.4,-36.4,3.4,5.6,"paille"],[-39.9,3.4,2.1,-37.1,3.8,4.9,"paille"],[37,0,13.7,39,2.6,14,"planches"],[36,0,13.7,37,1,14,"planches"],[36,1.8,13.7,37,2.6,14,"planches"],[34,0,13.7,36,2.6,14,"planches"],[34,0,10,39,2.6,10.3,"planches"],[38.7,0,10.3,39,2.6,13.7,"planches"],[34,0,12.8,34.3,2.6,13.7,"planches"],[34,2.5,11.2,34.3,2.6,12.8,"planches"],[34,0,10.3,34.3,2.6,11.2,"planches"],[33.7,2.6,9.7,39.3,3,14.3,"paille"],[34.4,3,10.4,38.6,3.4,13.6,"paille"],[35.1,3.4,11.1,37.9,3.8,12.9,"paille"],[-39,0,27.7,-33,2.6,28,"planches"],[-35.2,0,24,-33,2.6,24.3,"planches"],[-36.8,2.5,24,-35.2,2.6,24.3,"planches"],[-39,0,24,-36.8,2.6,24.3,"planches"],[-33.3,0,24.3,-33,2.6,27.7,"planches"],[-39,0,26.5,-38.7,2.6,27.7,"planches"],[-39,0,25.5,-38.7,1,26.5,"planches"],[-39,1.8,25.5,-38.7,2.6,26.5,"planches"],[-39,0,24.3,-38.7,2.6,25.5,"planches"],[-39.3,2.6,23.7,-32.7,3,28.3,"paille"],[-38.6,3,24.4,-33.4,3.4,27.6,"paille"],[-37.9,3.4,25.1,-34.1,3.8,26.9,"paille"],[-30.2,0,19,-29,1,20,"caisse"],[-37.2,0,23,-36,1,24,"caisse"],[34,0,21.8,40,1.1,22,"planches"],[26,0,21.8,31,1.1,22,"planches"],[26,0,22,26.2,1.1,30,"planches"],[35.25,0,26.5,36.75,1,27.5,"paille"],[33.25,0,24.5,34.75,1,25.5,"paille"],[29.25,0,27.5,30.75,1,28.5,"paille"],[13.5,0,26.5,14.5,4,27.5,"tronc"],[12.5,4,25.5,15.5,6.5,28.5,"feuilles"],[-14.5,0,25.5,-13.5,4,26.5,"tronc"],[-15.5,4,24.5,-12.5,6.5,27.5,"feuilles"],[31.5,0,3.5,32.5,4,4.5,"tronc"],[30.5,4,2.5,33.5,6.5,5.5,"feuilles"],[-40.5,0,15.5,-39.5,4,16.5,"tronc"],[-41.5,4,14.5,-38.5,6.5,17.5,"feuilles"],[-27.5,0,35.5,-26.5,4,36.5,"tronc"],[-28.5,4,34.5,-25.5,6.5,37.5,"feuilles"],[39.5,0,29.5,40.5,4,30.5,"tronc"],[38.5,4,28.5,41.5,6.5,31.5,"feuilles"],[-19.5,0,39.5,-18.5,4,40.5,"tronc"],[-20.5,4,38.5,-17.5,6.5,41.5,"feuilles"],[18.8,0,25.8,21.2,1.6,28.2,"pierre"],[20.3,0,25.3,21.7,2.4,26.7,"pierre"],[-21,0,28,-19,1.3,30,"pierre"],[26.9,0,7.9,29.1,1.5,10.1,"pierre"],[-41.2,0,30.8,-38.8,2,33.2,"pierre"],[4.2,0,27.2,5.8,1.1,28.8,"pierre"],[7,0,28,12,1.2,29,"feuilles"],[-11,0,29,-6,1.2,30,"feuilles"],[25,0,15,30,1.2,16,"feuilles"],[-4.8,0,25.4,-3.2,1.1,26.6,"paille"],[8.2,0,32.9,9.8,1.1,34.1,"paille"],[-17.8,0,32.9,-16.2,1.1,34.1,"paille"],[23.2,0,29.4,24.8,1.1,30.6,"paille"]],decors:[[-200,-3,-200,200,0,-44,"herbe"],[-200,-3,44,200,0,200,"herbe"],[-200,-3,-44,-44,0,44,"herbe"],[44,-3,-44,200,0,44,"herbe"],[-43,0,-47.5,-42,4,-46.5,"tronc"],[-44.5,4,-49,-40.5,7.5,-45,"feuilles"],[42,0,46.5,43,4,47.5,"tronc"],[40.5,4,45,44.5,7.5,49,"feuilles"],[-47.5,0,42,-46.5,4,43,"tronc"],[-49,4,40.5,-45,7.5,44.5,"feuilles"],[46.5,0,-43,47.5,4,-42,"tronc"],[45,4,-44.5,49,7.5,-40.5,"feuilles"],[-37,0,-47.5,-36,4,-46.5,"tronc"],[-38.5,4,-49,-34.5,7.5,-45,"feuilles"],[36,0,46.5,37,4,47.5,"tronc"],[34.5,4,45,38.5,7.5,49,"feuilles"],[-47.5,0,36,-46.5,4,37,"tronc"],[-49,4,34.5,-45,7.5,38.5,"feuilles"],[46.5,0,-37,47.5,4,-36,"tronc"],[45,4,-38.5,49,7.5,-34.5,"feuilles"],[-31,0,-47.5,-30,4,-46.5,"tronc"],[-32.5,4,-49,-28.5,7.5,-45,"feuilles"],[30,0,46.5,31,4,47.5,"tronc"],[28.5,4,45,32.5,7.5,49,"feuilles"],[-47.5,0,30,-46.5,4,31,"tronc"],[-49,4,28.5,-45,7.5,32.5,"feuilles"],[46.5,0,-31,47.5,4,-30,"tronc"],[45,4,-32.5,49,7.5,-28.5,"feuilles"],[-25,0,-47.5,-24,4,-46.5,"tronc"],[-26.5,4,-49,-22.5,7.5,-45,"feuilles"],[24,0,46.5,25,4,47.5,"tronc"],[22.5,4,45,26.5,7.5,49,"feuilles"],[-47.5,0,24,-46.5,4,25,"tronc"],[-49,4,22.5,-45,7.5,26.5,"feuilles"],[46.5,0,-25,47.5,4,-24,"tronc"],[45,4,-26.5,49,7.5,-22.5,"feuilles"],[-19,0,-47.5,-18,4,-46.5,"tronc"],[-20.5,4,-49,-16.5,7.5,-45,"feuilles"],[18,0,46.5,19,4,47.5,"tronc"],[16.5,4,45,20.5,7.5,49,"feuilles"],[-47.5,0,18,-46.5,4,19,"tronc"],[-49,4,16.5,-45,7.5,20.5,"feuilles"],[46.5,0,-19,47.5,4,-18,"tronc"],[45,4,-20.5,49,7.5,-16.5,"feuilles"],[-13,0,-47.5,-12,4,-46.5,"tronc"],[-14.5,4,-49,-10.5,7.5,-45,"feuilles"],[12,0,46.5,13,4,47.5,"tronc"],[10.5,4,45,14.5,7.5,49,"feuilles"],[-47.5,0,12,-46.5,4,13,"tronc"],[-49,4,10.5,-45,7.5,14.5,"feuilles"],[46.5,0,-13,47.5,4,-12,"tronc"],[45,4,-14.5,49,7.5,-10.5,"feuilles"],[-7,0,-47.5,-6,4,-46.5,"tronc"],[-8.5,4,-49,-4.5,7.5,-45,"feuilles"],[6,0,46.5,7,4,47.5,"tronc"],[4.5,4,45,8.5,7.5,49,"feuilles"],[-47.5,0,6,-46.5,4,7,"tronc"],[-49,4,4.5,-45,7.5,8.5,"feuilles"],[46.5,0,-7,47.5,4,-6,"tronc"],[45,4,-8.5,49,7.5,-4.5,"feuilles"],[-1,0,-47.5,0,4,-46.5,"tronc"],[-2.5,4,-49,1.5,7.5,-45,"feuilles"],[0,0,46.5,1,4,47.5,"tronc"],[-1.5,4,45,2.5,7.5,49,"feuilles"],[-47.5,0,0,-46.5,4,1,"tronc"],[-49,4,-1.5,-45,7.5,2.5,"feuilles"],[46.5,0,-1,47.5,4,0,"tronc"],[45,4,-2.5,49,7.5,1.5,"feuilles"],[5,0,-47.5,6,4,-46.5,"tronc"],[3.5,4,-49,7.5,7.5,-45,"feuilles"],[-6,0,46.5,-5,4,47.5,"tronc"],[-7.5,4,45,-3.5,7.5,49,"feuilles"],[-47.5,0,-6,-46.5,4,-5,"tronc"],[-49,4,-7.5,-45,7.5,-3.5,"feuilles"],[46.5,0,5,47.5,4,6,"tronc"],[45,4,3.5,49,7.5,7.5,"feuilles"],[11,0,-47.5,12,4,-46.5,"tronc"],[9.5,4,-49,13.5,7.5,-45,"feuilles"],[-12,0,46.5,-11,4,47.5,"tronc"],[-13.5,4,45,-9.5,7.5,49,"feuilles"],[-47.5,0,-12,-46.5,4,-11,"tronc"],[-49,4,-13.5,-45,7.5,-9.5,"feuilles"],[46.5,0,11,47.5,4,12,"tronc"],[45,4,9.5,49,7.5,13.5,"feuilles"],[17,0,-47.5,18,4,-46.5,"tronc"],[15.5,4,-49,19.5,7.5,-45,"feuilles"],[-18,0,46.5,-17,4,47.5,"tronc"],[-19.5,4,45,-15.5,7.5,49,"feuilles"],[-47.5,0,-18,-46.5,4,-17,"tronc"],[-49,4,-19.5,-45,7.5,-15.5,"feuilles"],[46.5,0,17,47.5,4,18,"tronc"],[45,4,15.5,49,7.5,19.5,"feuilles"],[23,0,-47.5,24,4,-46.5,"tronc"],[21.5,4,-49,25.5,7.5,-45,"feuilles"],[-24,0,46.5,-23,4,47.5,"tronc"],[-25.5,4,45,-21.5,7.5,49,"feuilles"],[-47.5,0,-24,-46.5,4,-23,"tronc"],[-49,4,-25.5,-45,7.5,-21.5,"feuilles"],[46.5,0,23,47.5,4,24,"tronc"],[45,4,21.5,49,7.5,25.5,"feuilles"],[29,0,-47.5,30,4,-46.5,"tronc"],[27.5,4,-49,31.5,7.5,-45,"feuilles"],[-30,0,46.5,-29,4,47.5,"tronc"],[-31.5,4,45,-27.5,7.5,49,"feuilles"],[-47.5,0,-30,-46.5,4,-29,"tronc"],[-49,4,-31.5,-45,7.5,-27.5,"feuilles"],[46.5,0,29,47.5,4,30,"tronc"],[45,4,27.5,49,7.5,31.5,"feuilles"],[35,0,-47.5,36,4,-46.5,"tronc"],[33.5,4,-49,37.5,7.5,-45,"feuilles"],[-36,0,46.5,-35,4,47.5,"tronc"],[-37.5,4,45,-33.5,7.5,49,"feuilles"],[-47.5,0,-36,-46.5,4,-35,"tronc"],[-49,4,-37.5,-45,7.5,-33.5,"feuilles"],[46.5,0,35,47.5,4,36,"tronc"],[45,4,33.5,49,7.5,37.5,"feuilles"],[41,0,-47.5,42,4,-46.5,"tronc"],[39.5,4,-49,43.5,7.5,-45,"feuilles"],[-42,0,46.5,-41,4,47.5,"tronc"],[-43.5,4,45,-39.5,7.5,49,"feuilles"],[-47.5,0,-42,-46.5,4,-41,"tronc"],[-49,4,-43.5,-45,7.5,-39.5,"feuilles"],[46.5,0,41,47.5,4,42,"tronc"],[45,4,39.5,49,7.5,43.5,"feuilles"],[-.08,12,-.08,.08,17,.08,"metal"],[.08,15,-.04,1.9,16.8,.04,"tissu_bleu"],[-1.9,15,-.04,-.08,16.8,.04,"tissu_rouge"],[16.92,8,-17.08,17.08,13,-16.92,"metal"],[17.08,10.8,-17.04,18.9,12.8,-16.96,"tissu_bleu"],[-17.08,8,-17.08,-16.92,13,-16.92,"metal"],[-16.92,10.8,-17.04,-15.1,12.8,-16.96,"tissu_bleu"],[-2.5,0,-24,-2.3,.6,-20,"bois"],[2.3,0,-24,2.5,.6,-20,"bois"],[-2.5,2.9,-20.05,2.5,3.4,-19.8,"metal"],[-5.6,2.5,-20.06,-3,7,-20,"tissu_bleu"],[3,2.5,-20.06,5.6,7,-20,"tissu_bleu"],[-1.2,7,-6.06,1.2,11,-6,"tissu_bleu"],[24.2,0,-9.55,25.8,1.4,-7.95,"feuilles"],[24.4,0,-10.8,25.6,1,-9.6,"feuilles"],[4.2,0,-13.1,4.9,.7,-12.9,"tronc"],[6.1,0,-13.1,6.8,.7,-12.9,"tronc"],[4.2,0,-11.6,4.9,.7,-11.4,"tronc"],[6.1,0,-11.6,6.8,.7,-11.4,"tronc"],[-4.1,2.4,-13.4,.1,2.6,-11.6,"tissu_bleu"],[-4,0,-13.4,-3.85,2.4,-13.25,"bois"],[0,0,-13.4,.15,2.4,-13.25,"bois"],[-12.7,1,-4.7,-11.3,1.02,-3.3,"pierre"],[-13,1,-5,-12.8,2.6,-4.8,"bois"],[-11.2,1,-3.2,-11,2.6,-3,"bois"],[-13.2,2.6,-5.2,-10.8,2.9,-2.8,"toit_rouge"],[-7.6,0,-15.1,-7.4,3.4,-14.9,"metal"],[-7.8,3.4,-15.3,-7.2,3.8,-14.7,"lampe"],[-7.88,3.8,-15.38,-7.12,3.9,-14.62,"metal"],[7.4,0,-15.1,7.6,3.4,-14.9,"metal"],[7.2,3.4,-15.3,7.8,3.8,-14.7,"lampe"],[7.12,3.8,-15.38,7.88,3.9,-14.62,"metal"],[-27,0,-40,-21,.1,-36,"terre"],[-26.8,2.6,-40.2,-21.2,3,-35.8,"tissu_bleu"],[-26.5,.25,-40,-26.3,2.6,-39.8,"bois"],[-21.7,.25,-40,-21.5,2.6,-39.8,"bois"],[-26.5,.25,-36.2,-26.3,2.6,-36,"bois"],[-21.7,.25,-36.2,-21.5,2.6,-36,"bois"],[21,0,-40,27,.1,-36,"terre"],[21.2,2.6,-40.2,26.8,3,-35.8,"tissu_bleu"],[21.5,.25,-40,21.7,2.6,-39.8,"bois"],[26.3,.25,-40,26.5,2.6,-39.8,"bois"],[21.5,.25,-36.2,21.7,2.6,-36,"bois"],[26.3,.25,-36.2,26.5,2.6,-36,"bois"],[-8.08,0,-36.08,-7.92,7,-35.92,"metal"],[-7.92,4.8,-36.04,-6.1,6.8,-35.96,"tissu_bleu"],[5.92,0,-36.08,6.08,7,-35.92,"metal"],[6.08,4.8,-36.04,7.9,6.8,-35.96,"tissu_bleu"],[-15,6.5,-28,-13,7.2,-26,"feuilles"],[13,6.5,-27,15,7.2,-25,"feuilles"],[-33,6.5,-5,-31,7.2,-3,"feuilles"],[39,6.5,-17,41,7.2,-15,"feuilles"],[26,6.5,-37,28,7.2,-35,"feuilles"],[-41,6.5,-31,-39,7.2,-29,"feuilles"],[18,6.5,-41,20,7.2,-39,"feuilles"],[-30.45,0,-32.45,-29.55,.6,-31.55,"feuilles"],[31.55,0,-33.45,32.45,.6,-32.55,"feuilles"],[-22.45,0,-18.45,-21.55,.6,-17.55,"feuilles"],[25.55,0,-10.45,26.45,.6,-9.55,"feuilles"],[-27.1,0,-24.6,-26.9,3.4,-24.4,"metal"],[-27.3,3.4,-24.8,-26.7,3.8,-24.2,"lampe"],[-27.38,3.8,-24.88,-26.62,3.9,-24.12,"metal"],[26.9,0,-24.6,27.1,3.4,-24.4,"metal"],[26.7,3.4,-24.8,27.3,3.8,-24.2,"lampe"],[26.62,3.8,-24.88,27.38,3.9,-24.12,"metal"],[-17.08,8,16.92,-16.92,13,17.08,"metal"],[-18.9,10.8,16.96,-17.08,12.8,17.04,"tissu_bleu"],[16.92,8,16.92,17.08,13,17.08,"metal"],[15.1,10.8,16.96,16.92,12.8,17.04,"tissu_bleu"],[2.3,0,20,2.5,.6,24,"bois"],[-2.5,0,20,-2.3,.6,24,"bois"],[-2.5,2.9,19.8,2.5,3.4,20.05,"metal"],[3,2.5,20,5.6,7,20.06,"tissu_bleu"],[-5.6,2.5,20,-3,7,20.06,"tissu_bleu"],[-1.2,7,6,1.2,11,6.06,"tissu_bleu"],[-25.8,0,7.95,-24.2,1.4,9.55,"feuilles"],[-25.6,0,9.6,-24.4,1,10.8,"feuilles"],[-4.9,0,12.9,-4.2,.7,13.1,"tronc"],[-6.8,0,12.9,-6.1,.7,13.1,"tronc"],[-4.9,0,11.4,-4.2,.7,11.6,"tronc"],[-6.8,0,11.4,-6.1,.7,11.6,"tronc"],[-.1,2.4,11.6,4.1,2.6,13.4,"tissu_bleu"],[3.85,0,13.25,4,2.4,13.4,"bois"],[-.15,0,13.25,0,2.4,13.4,"bois"],[11.3,1,3.3,12.7,1.02,4.7,"pierre"],[12.8,1,4.8,13,2.6,5,"bois"],[11,1,3,11.2,2.6,3.2,"bois"],[10.8,2.6,2.8,13.2,2.9,5.2,"toit_rouge"],[7.4,0,14.9,7.6,3.4,15.1,"metal"],[7.2,3.4,14.7,7.8,3.8,15.3,"lampe"],[7.12,3.8,14.62,7.88,3.9,15.38,"metal"],[-7.6,0,14.9,-7.4,3.4,15.1,"metal"],[-7.8,3.4,14.7,-7.2,3.8,15.3,"lampe"],[-7.88,3.8,14.62,-7.12,3.9,15.38,"metal"],[21,0,36,27,.1,40,"terre"],[21.2,2.6,35.8,26.8,3,40.2,"tissu_bleu"],[26.3,.25,39.8,26.5,2.6,40,"bois"],[21.5,.25,39.8,21.7,2.6,40,"bois"],[26.3,.25,36,26.5,2.6,36.2,"bois"],[21.5,.25,36,21.7,2.6,36.2,"bois"],[-27,0,36,-21,.1,40,"terre"],[-26.8,2.6,35.8,-21.2,3,40.2,"tissu_bleu"],[-21.7,.25,39.8,-21.5,2.6,40,"bois"],[-26.5,.25,39.8,-26.3,2.6,40,"bois"],[-21.7,.25,36,-21.5,2.6,36.2,"bois"],[-26.5,.25,36,-26.3,2.6,36.2,"bois"],[7.92,0,35.92,8.08,7,36.08,"metal"],[6.1,4.8,35.96,7.92,6.8,36.04,"tissu_bleu"],[-6.08,0,35.92,-5.92,7,36.08,"metal"],[-7.9,4.8,35.96,-6.08,6.8,36.04,"tissu_bleu"],[13,6.5,26,15,7.2,28,"feuilles"],[-15,6.5,25,-13,7.2,27,"feuilles"],[31,6.5,3,33,7.2,5,"feuilles"],[-41,6.5,15,-39,7.2,17,"feuilles"],[-28,6.5,35,-26,7.2,37,"feuilles"],[39,6.5,29,41,7.2,31,"feuilles"],[-20,6.5,39,-18,7.2,41,"feuilles"],[29.55,0,31.55,30.45,.6,32.45,"feuilles"],[-32.45,0,32.55,-31.55,.6,33.45,"feuilles"],[21.55,0,17.55,22.45,.6,18.45,"feuilles"],[-26.45,0,9.55,-25.55,.6,10.45,"feuilles"],[26.9,0,24.4,27.1,3.4,24.6,"metal"],[26.7,3.4,24.2,27.3,3.8,24.8,"lampe"],[26.62,3.8,24.12,27.38,3.9,24.88,"metal"],[-27.1,0,24.4,-26.9,3.4,24.6,"metal"],[-27.3,3.4,24.2,-26.7,3.8,24.8,"lampe"],[-27.38,3.8,24.12,-26.62,3.9,24.88,"metal"]],apparitions:[{x:-18,y:0,z:-41,angle:180,equipe:0},{x:-9,y:0,z:-41,angle:180,equipe:0},{x:0,y:0,z:-41,angle:180,equipe:0},{x:9,y:0,z:-41,angle:180,equipe:0},{x:18,y:0,z:-41,angle:180,equipe:0},{x:-12,y:0,z:-8,angle:-124,equipe:null},{x:12.5,y:0,z:-1,angle:95,equipe:null},{x:-36,y:0,z:-20,angle:-119,equipe:null},{x:38,y:0,z:-11.5,angle:107,equipe:null},{x:-17,y:8,z:-17,angle:-135,equipe:null},{x:-2,y:4,z:2,angle:-45,equipe:null},{x:26,y:0,z:-18,angle:125,equipe:null},{x:-34,y:0,z:-36,angle:-137,equipe:null},{x:18,y:0,z:41,angle:0,equipe:1},{x:9,y:0,z:41,angle:0,equipe:1},{x:0,y:0,z:41,angle:0,equipe:1},{x:-9,y:0,z:41,angle:0,equipe:1},{x:-18,y:0,z:41,angle:0,equipe:1},{x:12,y:0,z:8,angle:56,equipe:null},{x:-12.5,y:0,z:1,angle:-85,equipe:null},{x:36,y:0,z:20,angle:61,equipe:null},{x:-38,y:0,z:11.5,angle:-73,equipe:null},{x:17,y:8,z:17,angle:45,equipe:null},{x:2,y:4,z:-2,angle:135,equipe:null},{x:-26,y:0,z:18,angle:-55,equipe:null},{x:34,y:0,z:36,angle:43,equipe:null}]};var qu={_aide:"Carte d'Arena FPS (fabriqu\xE9e par games/fps/outils/cartes.py : modifie plut\xF4t ce script). taille = demi-c\xF4t\xE9 de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, mati\xE8re] (en m\xE8tres, le sol est \xE0 y = 0) ; decors = blocs sans collision ; apparitions : y = hauteur du sol, angle en degr\xE9s (0 = regarde vers le nord, 90 = l'ouest, -90 = l'est, 180 = le sud), equipe 0 = Bleus (au nord), 1 = Rouges (au sud), null = chacun pour soi. Les vitres et les murs invisibles laissent passer les balles.",id:"ville",nom:"Ville",description:"Des rues, des immeubles et des toits reli\xE9s par des ponts de planches.",taille:42,ambiance:{ciel:["#5a8fd2","#e2e8ef"],brouillard:["#dde3ea",55,200],soleil:{couleur:"#fff4e0",intensite:2,position:[30,60,-22]},ambiante:{ciel:"#dde8f5",sol:"#6a6a66",intensite:1.35},nuages:!0},eau:null,boites:[[-42,-1,-42,42,0,42,"asphalte"],[-43,0,-43,43,14,-42,"beton"],[-43,0,42,43,14,43,"beton"],[-43,0,-42,-42,14,42,"beton"],[42,0,-42,43,14,42,"beton"],[-36,0,-36,-18,.15,-18,"trottoir"],[-36,0,-10,-18,.15,10,"trottoir"],[-36,0,18,-18,.15,36,"trottoir"],[-10,0,-36,10,.15,-18,"trottoir"],[-10,0,18,10,.15,36,"trottoir"],[18,0,-36,36,.15,-18,"trottoir"],[18,0,-10,36,.15,10,"trottoir"],[18,0,18,36,.15,36,"trottoir"],[-10,0,-10,10,.15,10,"herbe"],[-2.6,.15,-2.6,2.6,.8,-2.1,"pierre"],[-2.6,.15,2.1,2.6,.8,2.6,"pierre"],[-2.6,.15,-2.1,-2.1,.8,2.1,"pierre"],[2.1,.15,-2.1,2.6,.8,2.1,"pierre"],[-.5,.15,-.5,.5,2.4,.5,"pierre"],[4,.15,-8.5,8.5,1.2,-7.5,"feuilles"],[7.5,.15,-8.5,8.5,1.2,-4,"feuilles"],[5.5,.15,-6.5,6.5,3.65,-5.5,"tronc"],[4.6,3.65,-7.4,7.4,6.15,-4.6,"feuilles"],[3.5,.15,-5.2,5.5,.6,-4.6,"planches"],[-8.5,.15,-8.5,-4,1.2,-7.5,"feuilles"],[-8.5,.15,-8.5,-7.5,1.2,-4,"feuilles"],[-6.5,.15,-6.5,-5.5,3.65,-5.5,"tronc"],[-7.4,3.65,-7.4,-4.6,6.15,-4.6,"feuilles"],[-5.5,.15,-5.2,-3.5,.6,-4.6,"planches"],[-8.5,.15,7.5,-4,1.2,8.5,"feuilles"],[-8.5,.15,4,-7.5,1.2,8.5,"feuilles"],[-6.5,.15,5.5,-5.5,3.65,6.5,"tronc"],[-7.4,3.65,4.6,-4.6,6.15,7.4,"feuilles"],[-5.5,.15,4.6,-3.5,.6,5.2,"planches"],[4,.15,7.5,8.5,1.2,8.5,"feuilles"],[7.5,.15,4,8.5,1.2,8.5,"feuilles"],[5.5,.15,5.5,6.5,3.65,6.5,"tronc"],[4.6,3.65,4.6,7.4,6.15,7.4,"feuilles"],[3.5,.15,4.6,5.5,.6,5.2,"planches"],[-36,.15,-36,-28,12.15,-28,"brique"],[-26,.15,-36,-19,6.15,-29,"beton"],[-26,6.15,-36,-19,6.85,-35.7,"beton"],[-23.5,6.15,-29.3,-19,6.85,-29,"beton"],[-26,6.15,-35.7,-25.7,6.85,-29.3,"beton"],[-19.3,6.15,-35.7,-19,6.85,-31.5,"beton"],[-19.3,6.15,-30,-19,6.85,-29.3,"beton"],[-26,.35,-27.8,-25,.65,-26.6,"metal"],[-25,.85,-27.8,-24,1.15,-26.6,"metal"],[-24,1.35,-27.8,-23,1.65,-26.6,"metal"],[-23,1.85,-27.8,-22,2.15,-26.6,"metal"],[-22,2.35,-27.8,-21,2.65,-26.6,"metal"],[-21,2.85,-27.8,-20,3.15,-26.6,"metal"],[-20,2.85,-29,-18.5,3.15,-26.6,"metal"],[-21,3.35,-29,-20,3.65,-27.8,"metal"],[-22,3.85,-29,-21,4.15,-27.8,"metal"],[-23,4.35,-29,-22,4.65,-27.8,"metal"],[-24,4.85,-29,-23,5.15,-27.8,"metal"],[-25,5.35,-29,-24,5.65,-27.8,"metal"],[-26,5.85,-29,-25,6.15,-27.8,"metal"],[-36,.15,-26,-28,3.65,-25.6,"brique"],[-36,.15,-19.4,-34.7,3.65,-19,"brique"],[-34.7,.15,-19.4,-32.3,.95,-19,"brique"],[-34.7,2.75,-19.4,-32.3,3.65,-19,"brique"],[-34.7,.95,-19.25,-32.3,2.75,-19.15,"vitre"],[-32.3,.15,-19.4,-31.2,3.65,-19,"brique"],[-31.2,.15,-19.4,-28.8,.95,-19,"brique"],[-31.2,2.75,-19.4,-28.8,3.65,-19,"brique"],[-31.2,.95,-19.25,-28.8,2.75,-19.15,"vitre"],[-28.8,.15,-19.4,-28,3.65,-19,"brique"],[-36,.15,-25.6,-35.6,3.65,-19.4,"brique"],[-28.4,.15,-25.6,-28,3.65,-23.4,"brique"],[-28.4,2.65,-23.4,-28,3.65,-21.6,"brique"],[-28.4,.15,-21.6,-28,3.65,-19.4,"brique"],[-36,3.35,-26,-28,3.65,-19,"beton"],[-36,3.65,-26,-28,4.35,-25.7,"beton"],[-36,3.65,-19.3,-28,4.35,-19,"beton"],[-36,3.65,-25.7,-35.7,4.35,-19.3,"beton"],[-28.3,3.65,-25.7,-28,4.35,-19.3,"beton"],[-27.2,.15,-21.2,-25.8,1.55,-19.8,"caisse"],[-27.1,1.55,-21.1,-25.9,2.75,-19.9,"caisse"],[-25.8,.15,-22.1,-24.6,1.35,-20.9,"caisse"],[-24,.15,-27.6,-22,1.5,-26.6,"metal_bleu"],[-10,.15,-32,-3,3.75,-31.6,"beton"],[-10,.15,-20.4,-8,3.75,-20,"beton"],[-8,.15,-20.4,-5,.95,-20,"beton"],[-8,2.75,-20.4,-5,3.75,-20,"beton"],[-8,.95,-20.25,-5,2.75,-20.15,"vitre"],[-5,.15,-20.4,-3,3.75,-20,"beton"],[-10,.15,-31.6,-9.6,3.75,-20.4,"beton"],[-3.4,.15,-31.6,-3,3.75,-23.9,"beton"],[-3.4,2.65,-23.9,-3,3.75,-22.1,"beton"],[-3.4,.15,-22.1,-3,3.75,-20.4,"beton"],[-10,3.45,-32,-3,3.75,-20,"beton"],[-10,3.75,-32,-3,6.15,-20,"beton"],[-10,6.15,-32,-9.5,6.85,-31.7,"beton"],[-7.5,6.15,-32,-3,6.85,-31.7,"beton"],[-10,6.15,-20.3,-3,6.85,-20,"beton"],[-10,6.15,-31.7,-9.7,6.85,-31.5,"beton"],[-10,6.15,-30,-9.7,6.85,-20.3,"beton"],[-3.3,6.15,-31.7,-3,6.85,-27,"beton"],[-3.3,6.15,-25.5,-3,6.85,-20.3,"beton"],[-9.5,.35,-34.4,-8.5,.65,-33.2,"metal"],[-8.5,.85,-34.4,-7.5,1.15,-33.2,"metal"],[-7.5,1.35,-34.4,-6.5,1.65,-33.2,"metal"],[-6.5,1.85,-34.4,-5.5,2.15,-33.2,"metal"],[-5.5,2.35,-34.4,-4.5,2.65,-33.2,"metal"],[-4.5,2.85,-34.4,-3.5,3.15,-33.2,"metal"],[-3.5,2.85,-34.4,-2,3.15,-32,"metal"],[-4.5,3.35,-33.2,-3.5,3.65,-32,"metal"],[-5.5,3.85,-33.2,-4.5,4.15,-32,"metal"],[-6.5,4.35,-33.2,-5.5,4.65,-32,"metal"],[-7.5,4.85,-33.2,-6.5,5.15,-32,"metal"],[-8.5,5.35,-33.2,-7.5,5.65,-32,"metal"],[-9.5,5.85,-33.2,-8.5,6.15,-32,"metal"],[3,.15,-32,10,3.75,-31.6,"brique"],[3,.15,-20.4,5,3.75,-20,"brique"],[5,.15,-20.4,8,.95,-20,"brique"],[5,2.75,-20.4,8,3.75,-20,"brique"],[5,.95,-20.25,8,2.75,-20.15,"vitre"],[8,.15,-20.4,10,3.75,-20,"brique"],[3,.15,-31.6,3.4,3.75,-23.9,"brique"],[3,2.65,-23.9,3.4,3.75,-22.1,"brique"],[3,.15,-22.1,3.4,3.75,-20.4,"brique"],[9.6,.15,-31.6,10,3.75,-20.4,"brique"],[3,3.45,-32,10,3.75,-20,"beton"],[3,3.75,-32,10,6.15,-20,"brique"],[3,6.15,-32,10,6.85,-31.7,"beton"],[3,6.15,-20.3,10,6.85,-20,"beton"],[3,6.15,-31.7,3.3,6.85,-27,"beton"],[3,6.15,-25.5,3.3,6.85,-20.3,"beton"],[9.7,6.15,-31.7,10,6.85,-20.3,"beton"],[-3,5.9,-27,3,6.15,-25.5,"planches"],[-19,5.9,-31.5,-10,6.15,-30,"planches"],[-.7,.15,-21.7,.7,1.55,-20.3,"caisse"],[-1.8,.15,-30.6,-.6,1.35,-29.4,"caisse"],[26,.15,-36,36,3.15,-28,"beton"],[26,3.15,-36,36,3.85,-35.7,"beton"],[26,3.15,-28.3,30,3.85,-28,"beton"],[32,3.15,-28.3,36,3.85,-28,"beton"],[26,3.15,-35.7,26.3,3.85,-28.3,"beton"],[35.7,3.15,-35.7,36,3.85,-28.3,"beton"],[30,.15,-23,32,.65,-22,"beton"],[30,.15,-24,32,1.15,-23,"beton"],[30,.15,-25,32,1.65,-24,"beton"],[30,.15,-26,32,2.15,-25,"beton"],[30,.15,-27,32,2.65,-26,"beton"],[30,.15,-28,32,3.15,-27,"beton"],[20.55,.3,-35.1,22.45,1.15,-30.9,"metal_rouge"],[20.65,1.15,-34.1,22.35,1.85,-31.9,"metal_rouge"],[22.1,0,-31.8,22.8,.7,-31.1,"pneu"],[22.1,0,-34.9,22.8,.7,-34.2,"pneu"],[20.2,0,-31.8,20.9,.7,-31.1,"pneu"],[20.2,0,-34.9,20.9,.7,-34.2,"pneu"],[23.55,.3,-26.1,25.45,1.15,-21.9,"metal_bleu"],[23.65,1.15,-25.1,25.35,1.85,-22.9,"metal_bleu"],[25.1,0,-22.8,25.8,.7,-22.1,"pneu"],[25.1,0,-25.9,25.8,.7,-25.2,"pneu"],[23.2,0,-22.8,23.9,.7,-22.1,"pneu"],[23.2,0,-25.9,23.9,.7,-25.2,"pneu"],[20.55,.3,-26.1,22.45,1.15,-21.9,"metal_jaune"],[20.65,1.15,-25.1,22.35,1.85,-22.9,"metal_jaune"],[22.1,0,-22.8,22.8,.7,-22.1,"pneu"],[22.1,0,-25.9,22.8,.7,-25.2,"pneu"],[20.2,0,-22.8,20.9,.7,-22.1,"pneu"],[20.2,0,-25.9,20.9,.7,-25.2,"pneu"],[34,.15,-21,36,2.6,-20.6,"vitre"],[34,2.6,-22,36,2.8,-20.4,"metal"],[-36,.15,-10,-28,3.75,-9.6,"brique"],[-36,.15,-.4,-28,3.75,0,"brique"],[-36,.15,-9.6,-35.6,3.75,-.4,"brique"],[-28.4,.15,-9.6,-28,3.75,-5.9,"brique"],[-28.4,2.65,-5.9,-28,3.75,-4.1,"brique"],[-28.4,.15,-4.1,-28,3.75,-.4,"brique"],[-36,3.45,-10,-28,3.75,0,"beton"],[-36,3.75,-10,-28,9.15,0,"brique"],[-36,9.15,-10,-28,9.85,-9.7,"beton"],[-36,9.15,-.3,-28,9.85,0,"beton"],[-36,9.15,-9.7,-35.7,9.85,-.3,"beton"],[-28.3,9.15,-9.7,-28,9.85,-3.5,"beton"],[-28.3,9.15,-1,-28,9.85,-.3,"beton"],[-26.8,.35,-9,-25.6,.65,-8,"metal"],[-26.8,.85,-8,-25.6,1.15,-7,"metal"],[-26.8,1.35,-7,-25.6,1.65,-6,"metal"],[-26.8,1.85,-6,-25.6,2.15,-5,"metal"],[-26.8,2.35,-5,-25.6,2.65,-4,"metal"],[-26.8,2.85,-4,-25.6,3.15,-3,"metal"],[-28,2.85,-3,-25.6,3.15,-1.5,"metal"],[-28,3.35,-4,-26.8,3.65,-3,"metal"],[-28,3.85,-5,-26.8,4.15,-4,"metal"],[-28,4.35,-6,-26.8,4.65,-5,"metal"],[-28,4.85,-7,-26.8,5.15,-6,"metal"],[-28,5.35,-8,-26.8,5.65,-7,"metal"],[-28,5.85,-9,-26.8,6.15,-8,"metal"],[-28,5.85,-10.5,-25.6,6.15,-9,"metal"],[-26.8,6.35,-9,-25.6,6.65,-8,"metal"],[-26.8,6.85,-8,-25.6,7.15,-7,"metal"],[-26.8,7.35,-7,-25.6,7.65,-6,"metal"],[-26.8,7.85,-6,-25.6,8.15,-5,"metal"],[-26.8,8.35,-5,-25.6,8.65,-4,"metal"],[-26.8,8.85,-4,-25.6,9.15,-3,"metal"],[-28,8.85,-3,-25.6,9.15,-1.5,"metal"],[-36,.15,3,-29,3.65,3.4,"beton"],[-36,.15,9.6,-34,3.65,10,"beton"],[-34,.15,9.6,-31,.95,10,"beton"],[-34,2.75,9.6,-31,3.65,10,"beton"],[-34,.95,9.75,-31,2.75,9.85,"vitre"],[-31,.15,9.6,-29,3.65,10,"beton"],[-36,.15,3.4,-35.6,3.65,9.6,"beton"],[-29.4,.15,3.4,-29,3.65,5.6,"beton"],[-29.4,2.65,5.6,-29,3.65,7.4,"beton"],[-29.4,.15,7.4,-29,3.65,9.6,"beton"],[-36,3.35,3,-29,3.65,10,"beton"],[-36,3.65,3,-29,4.35,3.3,"beton"],[-36,3.65,9.7,-29,4.35,10,"beton"],[-36,3.65,3.3,-35.7,4.35,9.7,"beton"],[-29.3,3.65,3.3,-29,4.35,9.7,"beton"],[-24,.15,-8,-18.5,6.15,-2,"beton"],[-24,6.15,-8,-18.5,6.85,-7.7,"beton"],[-24,6.15,-2.3,-18.5,6.85,-2,"beton"],[-24,6.15,-7.7,-23.7,6.85,-2.3,"beton"],[-18.8,6.15,-7.7,-18.5,6.85,-6.5,"beton"],[-18.8,6.15,-3.5,-18.5,6.85,-2.3,"beton"],[-17.5,0,-6,-15.5,.2,-4,"trampoline"],[-22.7,.15,4.3,-21.3,1.55,5.7,"caisse"],[-22.6,.15,5.8,-21.4,1.35,7,"caisse"],[-8.1,.3,-14.95,-3.9,1.15,-13.05,"metal_bleu"],[-7.1,1.15,-14.85,-4.9,1.85,-13.15,"metal_bleu"],[-4.8,0,-13.4,-4.1,.7,-12.7,"pneu"],[-4.8,0,-15.3,-4.1,.7,-14.6,"pneu"],[-7.9,0,-13.4,-7.2,.7,-12.7,"pneu"],[-7.9,0,-15.3,-7.2,.7,-14.6,"pneu"],[27.9,.3,-12.95,32.1,1.15,-11.05,"metal_rouge"],[28.9,1.15,-12.85,31.1,1.85,-11.15,"metal_rouge"],[31.2,0,-11.4,31.9,.7,-10.7,"pneu"],[31.2,0,-13.3,31.9,.7,-12.6,"pneu"],[28.1,0,-11.4,28.8,.7,-10.7,"pneu"],[28.1,0,-13.3,28.8,.7,-12.6,"pneu"],[-12.95,.3,-29.1,-11.05,1.15,-24.9,"metal_jaune"],[-12.85,1.15,-28.1,-11.15,1.85,-25.9,"metal_jaune"],[-11.4,0,-25.8,-10.7,.7,-25.1,"pneu"],[-11.4,0,-28.9,-10.7,.7,-28.2,"pneu"],[-13.3,0,-25.8,-12.6,.7,-25.1,"pneu"],[-13.3,0,-28.9,-12.6,.7,-28.2,"pneu"],[15.05,.3,-6.1,16.95,1.15,-1.9,"metal_rouge"],[15.15,1.15,-5.1,16.85,1.85,-2.9,"metal_rouge"],[16.6,0,-2.8,17.3,.7,-2.1,"pneu"],[16.6,0,-5.9,17.3,.7,-5.2,"pneu"],[14.7,0,-2.8,15.4,.7,-2.1,"pneu"],[14.7,0,-5.9,15.4,.7,-5.2,"pneu"],[-32.1,.3,-40.45,-27.9,1.15,-38.55,"metal_bleu"],[-31.1,1.15,-40.35,-28.9,1.85,-38.65,"metal_bleu"],[-28.8,0,-38.9,-28.1,.7,-38.2,"pneu"],[-28.8,0,-40.8,-28.1,.7,-40.1,"pneu"],[-31.9,0,-38.9,-31.2,.7,-38.2,"pneu"],[-31.9,0,-40.8,-31.2,.7,-40.1,"pneu"],[28,.15,28,36,12.15,36,"brique"],[19,.15,29,26,6.15,36,"beton"],[19,6.15,35.7,26,6.85,36,"beton"],[19,6.15,29,23.5,6.85,29.3,"beton"],[25.7,6.15,29.3,26,6.85,35.7,"beton"],[19,6.15,31.5,19.3,6.85,35.7,"beton"],[19,6.15,29.3,19.3,6.85,30,"beton"],[25,.35,26.6,26,.65,27.8,"metal"],[24,.85,26.6,25,1.15,27.8,"metal"],[23,1.35,26.6,24,1.65,27.8,"metal"],[22,1.85,26.6,23,2.15,27.8,"metal"],[21,2.35,26.6,22,2.65,27.8,"metal"],[20,2.85,26.6,21,3.15,27.8,"metal"],[18.5,2.85,26.6,20,3.15,29,"metal"],[20,3.35,27.8,21,3.65,29,"metal"],[21,3.85,27.8,22,4.15,29,"metal"],[22,4.35,27.8,23,4.65,29,"metal"],[23,4.85,27.8,24,5.15,29,"metal"],[24,5.35,27.8,25,5.65,29,"metal"],[25,5.85,27.8,26,6.15,29,"metal"],[28,.15,25.6,36,3.65,26,"brique"],[34.7,.15,19,36,3.65,19.4,"brique"],[32.3,.15,19,34.7,.95,19.4,"brique"],[32.3,2.75,19,34.7,3.65,19.4,"brique"],[32.3,.95,19.15,34.7,2.75,19.25,"vitre"],[31.2,.15,19,32.3,3.65,19.4,"brique"],[28.8,.15,19,31.2,.95,19.4,"brique"],[28.8,2.75,19,31.2,3.65,19.4,"brique"],[28.8,.95,19.15,31.2,2.75,19.25,"vitre"],[28,.15,19,28.8,3.65,19.4,"brique"],[35.6,.15,19.4,36,3.65,25.6,"brique"],[28,.15,23.4,28.4,3.65,25.6,"brique"],[28,2.65,21.6,28.4,3.65,23.4,"brique"],[28,.15,19.4,28.4,3.65,21.6,"brique"],[28,3.35,19,36,3.65,26,"beton"],[28,3.65,25.7,36,4.35,26,"beton"],[28,3.65,19,36,4.35,19.3,"beton"],[35.7,3.65,19.3,36,4.35,25.7,"beton"],[28,3.65,19.3,28.3,4.35,25.7,"beton"],[25.8,.15,19.8,27.2,1.55,21.2,"caisse"],[25.9,1.55,19.9,27.1,2.75,21.1,"caisse"],[24.6,.15,20.9,25.8,1.35,22.1,"caisse"],[22,.15,26.6,24,1.5,27.6,"metal_bleu"],[3,.15,31.6,10,3.75,32,"beton"],[8,.15,20,10,3.75,20.4,"beton"],[5,.15,20,8,.95,20.4,"beton"],[5,2.75,20,8,3.75,20.4,"beton"],[5,.95,20.15,8,2.75,20.25,"vitre"],[3,.15,20,5,3.75,20.4,"beton"],[9.6,.15,20.4,10,3.75,31.6,"beton"],[3,.15,23.9,3.4,3.75,31.6,"beton"],[3,2.65,22.1,3.4,3.75,23.9,"beton"],[3,.15,20.4,3.4,3.75,22.1,"beton"],[3,3.45,20,10,3.75,32,"beton"],[3,3.75,20,10,6.15,32,"beton"],[9.5,6.15,31.7,10,6.85,32,"beton"],[3,6.15,31.7,7.5,6.85,32,"beton"],[3,6.15,20,10,6.85,20.3,"beton"],[9.7,6.15,31.5,10,6.85,31.7,"beton"],[9.7,6.15,20.3,10,6.85,30,"beton"],[3,6.15,27,3.3,6.85,31.7,"beton"],[3,6.15,20.3,3.3,6.85,25.5,"beton"],[8.5,.35,33.2,9.5,.65,34.4,"metal"],[7.5,.85,33.2,8.5,1.15,34.4,"metal"],[6.5,1.35,33.2,7.5,1.65,34.4,"metal"],[5.5,1.85,33.2,6.5,2.15,34.4,"metal"],[4.5,2.35,33.2,5.5,2.65,34.4,"metal"],[3.5,2.85,33.2,4.5,3.15,34.4,"metal"],[2,2.85,32,3.5,3.15,34.4,"metal"],[3.5,3.35,32,4.5,3.65,33.2,"metal"],[4.5,3.85,32,5.5,4.15,33.2,"metal"],[5.5,4.35,32,6.5,4.65,33.2,"metal"],[6.5,4.85,32,7.5,5.15,33.2,"metal"],[7.5,5.35,32,8.5,5.65,33.2,"metal"],[8.5,5.85,32,9.5,6.15,33.2,"metal"],[-10,.15,31.6,-3,3.75,32,"brique"],[-5,.15,20,-3,3.75,20.4,"brique"],[-8,.15,20,-5,.95,20.4,"brique"],[-8,2.75,20,-5,3.75,20.4,"brique"],[-8,.95,20.15,-5,2.75,20.25,"vitre"],[-10,.15,20,-8,3.75,20.4,"brique"],[-3.4,.15,23.9,-3,3.75,31.6,"brique"],[-3.4,2.65,22.1,-3,3.75,23.9,"brique"],[-3.4,.15,20.4,-3,3.75,22.1,"brique"],[-10,.15,20.4,-9.6,3.75,31.6,"brique"],[-10,3.45,20,-3,3.75,32,"beton"],[-10,3.75,20,-3,6.15,32,"brique"],[-10,6.15,31.7,-3,6.85,32,"beton"],[-10,6.15,20,-3,6.85,20.3,"beton"],[-3.3,6.15,27,-3,6.85,31.7,"beton"],[-3.3,6.15,20.3,-3,6.85,25.5,"beton"],[-10,6.15,20.3,-9.7,6.85,31.7,"beton"],[-3,5.9,25.5,3,6.15,27,"planches"],[10,5.9,30,19,6.15,31.5,"planches"],[-.7,.15,20.3,.7,1.55,21.7,"caisse"],[.6,.15,29.4,1.8,1.35,30.6,"caisse"],[-36,.15,28,-26,3.15,36,"beton"],[-36,3.15,35.7,-26,3.85,36,"beton"],[-30,3.15,28,-26,3.85,28.3,"beton"],[-36,3.15,28,-32,3.85,28.3,"beton"],[-26.3,3.15,28.3,-26,3.85,35.7,"beton"],[-36,3.15,28.3,-35.7,3.85,35.7,"beton"],[-32,.15,22,-30,.65,23,"beton"],[-32,.15,23,-30,1.15,24,"beton"],[-32,.15,24,-30,1.65,25,"beton"],[-32,.15,25,-30,2.15,26,"beton"],[-32,.15,26,-30,2.65,27,"beton"],[-32,.15,27,-30,3.15,28,"beton"],[-22.45,.3,30.9,-20.55,1.15,35.1,"metal_rouge"],[-22.35,1.15,31.9,-20.65,1.85,34.1,"metal_rouge"],[-22.8,0,31.1,-22.1,.7,31.8,"pneu"],[-22.8,0,34.2,-22.1,.7,34.9,"pneu"],[-20.9,0,31.1,-20.2,.7,31.8,"pneu"],[-20.9,0,34.2,-20.2,.7,34.9,"pneu"],[-25.45,.3,21.9,-23.55,1.15,26.1,"metal_bleu"],[-25.35,1.15,22.9,-23.65,1.85,25.1,"metal_bleu"],[-25.8,0,22.1,-25.1,.7,22.8,"pneu"],[-25.8,0,25.2,-25.1,.7,25.9,"pneu"],[-23.9,0,22.1,-23.2,.7,22.8,"pneu"],[-23.9,0,25.2,-23.2,.7,25.9,"pneu"],[-22.45,.3,21.9,-20.55,1.15,26.1,"metal_jaune"],[-22.35,1.15,22.9,-20.65,1.85,25.1,"metal_jaune"],[-22.8,0,22.1,-22.1,.7,22.8,"pneu"],[-22.8,0,25.2,-22.1,.7,25.9,"pneu"],[-20.9,0,22.1,-20.2,.7,22.8,"pneu"],[-20.9,0,25.2,-20.2,.7,25.9,"pneu"],[-36,.15,20.6,-34,2.6,21,"vitre"],[-36,2.6,20.4,-34,2.8,22,"metal"],[28,.15,9.6,36,3.75,10,"brique"],[28,.15,0,36,3.75,.4,"brique"],[35.6,.15,.4,36,3.75,9.6,"brique"],[28,.15,5.9,28.4,3.75,9.6,"brique"],[28,2.65,4.1,28.4,3.75,5.9,"brique"],[28,.15,.4,28.4,3.75,4.1,"brique"],[28,3.45,0,36,3.75,10,"beton"],[28,3.75,0,36,9.15,10,"brique"],[28,9.15,9.7,36,9.85,10,"beton"],[28,9.15,0,36,9.85,.3,"beton"],[35.7,9.15,.3,36,9.85,9.7,"beton"],[28,9.15,3.5,28.3,9.85,9.7,"beton"],[28,9.15,.3,28.3,9.85,1,"beton"],[25.6,.35,8,26.8,.65,9,"metal"],[25.6,.85,7,26.8,1.15,8,"metal"],[25.6,1.35,6,26.8,1.65,7,"metal"],[25.6,1.85,5,26.8,2.15,6,"metal"],[25.6,2.35,4,26.8,2.65,5,"metal"],[25.6,2.85,3,26.8,3.15,4,"metal"],[25.6,2.85,1.5,28,3.15,3,"metal"],[26.8,3.35,3,28,3.65,4,"metal"],[26.8,3.85,4,28,4.15,5,"metal"],[26.8,4.35,5,28,4.65,6,"metal"],[26.8,4.85,6,28,5.15,7,"metal"],[26.8,5.35,7,28,5.65,8,"metal"],[26.8,5.85,8,28,6.15,9,"metal"],[25.6,5.85,9,28,6.15,10.5,"metal"],[25.6,6.35,8,26.8,6.65,9,"metal"],[25.6,6.85,7,26.8,7.15,8,"metal"],[25.6,7.35,6,26.8,7.65,7,"metal"],[25.6,7.85,5,26.8,8.15,6,"metal"],[25.6,8.35,4,26.8,8.65,5,"metal"],[25.6,8.85,3,26.8,9.15,4,"metal"],[25.6,8.85,1.5,28,9.15,3,"metal"],[29,.15,-3.4,36,3.65,-3,"beton"],[34,.15,-10,36,3.65,-9.6,"beton"],[31,.15,-10,34,.95,-9.6,"beton"],[31,2.75,-10,34,3.65,-9.6,"beton"],[31,.95,-9.85,34,2.75,-9.75,"vitre"],[29,.15,-10,31,3.65,-9.6,"beton"],[35.6,.15,-9.6,36,3.65,-3.4,"beton"],[29,.15,-5.6,29.4,3.65,-3.4,"beton"],[29,2.65,-7.4,29.4,3.65,-5.6,"beton"],[29,.15,-9.6,29.4,3.65,-7.4,"beton"],[29,3.35,-10,36,3.65,-3,"beton"],[29,3.65,-3.3,36,4.35,-3,"beton"],[29,3.65,-10,36,4.35,-9.7,"beton"],[35.7,3.65,-9.7,36,4.35,-3.3,"beton"],[29,3.65,-9.7,29.3,4.35,-3.3,"beton"],[18.5,.15,2,24,6.15,8,"beton"],[18.5,6.15,7.7,24,6.85,8,"beton"],[18.5,6.15,2,24,6.85,2.3,"beton"],[23.7,6.15,2.3,24,6.85,7.7,"beton"],[18.5,6.15,6.5,18.8,6.85,7.7,"beton"],[18.5,6.15,2.3,18.8,6.85,3.5,"beton"],[15.5,0,4,17.5,.2,6,"trampoline"],[21.3,.15,-5.7,22.7,1.55,-4.3,"caisse"],[21.4,.15,-7,22.6,1.35,-5.8,"caisse"],[3.9,.3,13.05,8.1,1.15,14.95,"metal_bleu"],[4.9,1.15,13.15,7.1,1.85,14.85,"metal_bleu"],[4.1,0,12.7,4.8,.7,13.4,"pneu"],[4.1,0,14.6,4.8,.7,15.3,"pneu"],[7.2,0,12.7,7.9,.7,13.4,"pneu"],[7.2,0,14.6,7.9,.7,15.3,"pneu"],[-32.1,.3,11.05,-27.9,1.15,12.95,"metal_rouge"],[-31.1,1.15,11.15,-28.9,1.85,12.85,"metal_rouge"],[-31.9,0,10.7,-31.2,.7,11.4,"pneu"],[-31.9,0,12.6,-31.2,.7,13.3,"pneu"],[-28.8,0,10.7,-28.1,.7,11.4,"pneu"],[-28.8,0,12.6,-28.1,.7,13.3,"pneu"],[11.05,.3,24.9,12.95,1.15,29.1,"metal_jaune"],[11.15,1.15,25.9,12.85,1.85,28.1,"metal_jaune"],[10.7,0,25.1,11.4,.7,25.8,"pneu"],[10.7,0,28.2,11.4,.7,28.9,"pneu"],[12.6,0,25.1,13.3,.7,25.8,"pneu"],[12.6,0,28.2,13.3,.7,28.9,"pneu"],[-16.95,.3,1.9,-15.05,1.15,6.1,"metal_rouge"],[-16.85,1.15,2.9,-15.15,1.85,5.1,"metal_rouge"],[-17.3,0,2.1,-16.6,.7,2.8,"pneu"],[-17.3,0,5.2,-16.6,.7,5.9,"pneu"],[-15.4,0,2.1,-14.7,.7,2.8,"pneu"],[-15.4,0,5.2,-14.7,.7,5.9,"pneu"],[27.9,.3,38.55,32.1,1.15,40.45,"metal_bleu"],[28.9,1.15,38.65,31.1,1.85,40.35,"metal_bleu"],[28.1,0,38.2,28.8,.7,38.9,"pneu"],[28.1,0,40.1,28.8,.7,40.8,"pneu"],[31.2,0,38.2,31.9,.7,38.9,"pneu"],[31.2,0,40.1,31.9,.7,40.8,"pneu"]],decors:[[-42,1.5,-42,42,2.9,-41.96,"vitre"],[-42,1.5,41.96,42,2.9,42,"vitre"],[-42,1.5,-42,-41.96,2.9,42,"vitre"],[41.96,1.5,-42,42,2.9,42,"vitre"],[-42,4.5,-42,42,5.9,-41.96,"vitre"],[-42,4.5,41.96,42,5.9,42,"vitre"],[-42,4.5,-42,-41.96,5.9,42,"vitre"],[41.96,4.5,-42,42,5.9,42,"vitre"],[-42,7.5,-42,42,8.9,-41.96,"vitre"],[-42,7.5,41.96,42,8.9,42,"vitre"],[-42,7.5,-42,-41.96,8.9,42,"vitre"],[41.96,7.5,-42,42,8.9,42,"vitre"],[-42,10.5,-42,42,11.9,-41.96,"vitre"],[-42,10.5,41.96,42,11.9,42,"vitre"],[-42,10.5,-42,-41.96,11.9,42,"vitre"],[41.96,10.5,-42,42,11.9,42,"vitre"],[-1.5,.15,-10,1.5,.17,10,"pave"],[-10,.15,-1.5,10,.17,1.5,"pave"],[-2.1,.15,-2.1,2.1,.6,2.1,"neon"],[-.7,2.4,-.7,.7,2.7,.7,"lampe"],[5.1,6.15,-6.9,6.9,6.85,-5.1,"feuilles"],[2.2,.15,-9.1,2.4,3.55,-8.9,"metal"],[2,3.55,-9.3,2.6,3.95,-8.7,"lampe"],[1.92,3.95,-9.38,2.68,4.05,-8.62,"metal"],[-6.9,6.15,-6.9,-5.1,6.85,-5.1,"feuilles"],[-2.4,.15,-9.1,-2.2,3.55,-8.9,"metal"],[-2.6,3.55,-9.3,-2,3.95,-8.7,"lampe"],[-2.68,3.95,-9.38,-1.92,4.05,-8.62,"metal"],[-6.9,6.15,5.1,-5.1,6.85,6.9,"feuilles"],[-2.4,.15,8.9,-2.2,3.55,9.1,"metal"],[-2.6,3.55,8.7,-2,3.95,9.3,"lampe"],[-2.68,3.95,8.62,-1.92,4.05,9.38,"metal"],[5.1,6.15,5.1,6.9,6.85,6.9,"feuilles"],[2.2,.15,8.9,2.4,3.55,9.1,"metal"],[2,3.55,8.7,2.6,3.95,9.3,"lampe"],[1.92,3.95,8.62,2.68,4.05,9.38,"metal"],[-35.5,1.15,-36.04,-28.5,2.55,-36,"vitre"],[-35.5,1.15,-28,-28.5,2.55,-27.96,"vitre"],[-36.04,1.15,-35.5,-36,2.55,-28.5,"vitre"],[-28,1.15,-35.5,-27.96,2.55,-28.5,"vitre"],[-35.5,4.15,-36.04,-28.5,5.55,-36,"vitre"],[-35.5,4.15,-28,-28.5,5.55,-27.96,"vitre"],[-36.04,4.15,-35.5,-36,5.55,-28.5,"vitre"],[-28,4.15,-35.5,-27.96,5.55,-28.5,"vitre"],[-35.5,7.15,-36.04,-28.5,8.55,-36,"vitre"],[-35.5,7.15,-28,-28.5,8.55,-27.96,"vitre"],[-36.04,7.15,-35.5,-36,8.55,-28.5,"vitre"],[-28,7.15,-35.5,-27.96,8.55,-28.5,"vitre"],[-35.5,10.15,-36.04,-28.5,11.55,-36,"vitre"],[-35.5,10.15,-28,-28.5,11.55,-27.96,"vitre"],[-36.04,10.15,-35.5,-36,11.55,-28.5,"vitre"],[-28,10.15,-35.5,-27.96,11.55,-28.5,"vitre"],[-25.5,1.15,-36.04,-19.5,2.55,-36,"vitre"],[-25.5,1.15,-29,-19.5,2.55,-28.96,"vitre"],[-26.04,1.15,-35.5,-26,2.55,-29.5,"vitre"],[-19,1.15,-35.5,-18.96,2.55,-29.5,"vitre"],[-25.5,4.15,-36.04,-19.5,5.55,-36,"vitre"],[-25.5,4.15,-29,-19.5,5.55,-28.96,"vitre"],[-26.04,4.15,-35.5,-26,5.55,-29.5,"vitre"],[-19,4.15,-35.5,-18.96,5.55,-29.5,"vitre"],[-20,3.15,-26.7,-18.5,4.15,-26.6,"metal"],[-9.5,4.15,-32.04,-3.5,5.55,-32,"vitre"],[-9.5,4.15,-20,-3.5,5.55,-19.96,"vitre"],[-10.04,4.15,-31.5,-10,5.55,-20.5,"vitre"],[-3,4.15,-31.5,-2.96,5.55,-20.5,"vitre"],[-3.5,3.15,-34.4,-2,4.15,-34.3,"metal"],[3.5,4.15,-32.04,9.5,5.55,-32,"vitre"],[3.5,4.15,-20,9.5,5.55,-19.96,"vitre"],[2.96,4.15,-31.5,3,5.55,-20.5,"vitre"],[10,4.15,-31.5,10.04,5.55,-20.5,"vitre"],[-3,6.15,-27,3,7,-26.9,"metal"],[-3,6.15,-25.6,3,7,-25.5,"metal"],[-19,6.15,-31.5,-10,7,-31.4,"metal"],[-19,6.15,-30.1,-10,7,-30,"metal"],[26.5,1.15,-36.04,35.5,2.55,-36,"vitre"],[26.5,1.15,-28,35.5,2.55,-27.96,"vitre"],[25.96,1.15,-35.5,26,2.55,-28.5,"vitre"],[36,1.15,-35.5,36.04,2.55,-28.5,"vitre"],[33.4,3.15,-33,33.6,7,-32.8,"metal"],[28,5,-33.05,34.5,7.4,-32.9,"metal_jaune"],[20.62,1.25,-33.95,22.38,1.75,-32.05,"vitre"],[20.7,.7,-30.9,21,.95,-30.87,"lampe"],[22,.7,-30.9,22.3,.95,-30.87,"lampe"],[23.62,1.25,-24.95,25.38,1.75,-23.05,"vitre"],[23.7,.7,-21.9,24,.95,-21.87,"lampe"],[25,.7,-21.9,25.3,.95,-21.87,"lampe"],[20.62,1.25,-24.95,22.38,1.75,-23.05,"vitre"],[20.7,.7,-21.9,21,.95,-21.87,"lampe"],[22,.7,-21.9,22.3,.95,-21.87,"lampe"],[19.95,.15,-27,20.05,.17,-21,"trottoir"],[22.95,.15,-27,23.05,.17,-21,"trottoir"],[25.95,.15,-27,26.05,.17,-21,"trottoir"],[-35.5,4.15,-10.04,-28.5,5.55,-10,"vitre"],[-35.5,4.15,0,-28.5,5.55,.04,"vitre"],[-36.04,4.15,-9.5,-36,5.55,-.5,"vitre"],[-28,4.15,-9.5,-27.96,5.55,-.5,"vitre"],[-35.5,7.15,-10.04,-28.5,8.55,-10,"vitre"],[-35.5,7.15,0,-28.5,8.55,.04,"vitre"],[-36.04,7.15,-9.5,-36,8.55,-.5,"vitre"],[-28,7.15,-9.5,-27.96,8.55,-.5,"vitre"],[-25.7,3.15,-3,-25.6,4.15,-1.5,"metal"],[-25.7,9.15,-3,-25.6,10.15,-1.5,"metal"],[-23.5,1.15,-8.04,-19,2.55,-8,"vitre"],[-23.5,1.15,-2,-19,2.55,-1.96,"vitre"],[-24.04,1.15,-7.5,-24,2.55,-2.5,"vitre"],[-18.5,1.15,-7.5,-18.46,2.55,-2.5,"vitre"],[-23.5,4.15,-8.04,-19,5.55,-8,"vitre"],[-23.5,4.15,-2,-19,5.55,-1.96,"vitre"],[-24.04,4.15,-7.5,-24,5.55,-2.5,"vitre"],[-18.5,4.15,-7.5,-18.46,5.55,-2.5,"vitre"],[-41,0,-14.1,-39,.02,-13.9,"metal_jaune"],[-37,0,-14.1,-35,.02,-13.9,"metal_jaune"],[-33,0,-14.1,-31,.02,-13.9,"metal_jaune"],[-29,0,-14.1,-27,.02,-13.9,"metal_jaune"],[-25,0,-14.1,-23,.02,-13.9,"metal_jaune"],[-21,0,-14.1,-19,.02,-13.9,"metal_jaune"],[-9,0,-14.1,-7,.02,-13.9,"metal_jaune"],[-5,0,-14.1,-3,.02,-13.9,"metal_jaune"],[-1,0,-14.1,1,.02,-13.9,"metal_jaune"],[3,0,-14.1,5,.02,-13.9,"metal_jaune"],[7,0,-14.1,9,.02,-13.9,"metal_jaune"],[19,0,-14.1,21,.02,-13.9,"metal_jaune"],[23,0,-14.1,25,.02,-13.9,"metal_jaune"],[27,0,-14.1,29,.02,-13.9,"metal_jaune"],[31,0,-14.1,33,.02,-13.9,"metal_jaune"],[35,0,-14.1,37,.02,-13.9,"metal_jaune"],[39,0,-14.1,41,.02,-13.9,"metal_jaune"],[-14.1,0,-41,-13.9,.02,-39,"metal_jaune"],[-14.1,0,-37,-13.9,.02,-35,"metal_jaune"],[-14.1,0,-33,-13.9,.02,-31,"metal_jaune"],[-14.1,0,-29,-13.9,.02,-27,"metal_jaune"],[-14.1,0,-25,-13.9,.02,-23,"metal_jaune"],[-14.1,0,-21,-13.9,.02,-19,"metal_jaune"],[-14.1,0,-9,-13.9,.02,-7,"metal_jaune"],[-14.1,0,-5,-13.9,.02,-3,"metal_jaune"],[13.9,0,-41,14.1,.02,-39,"metal_jaune"],[13.9,0,-37,14.1,.02,-35,"metal_jaune"],[13.9,0,-33,14.1,.02,-31,"metal_jaune"],[13.9,0,-29,14.1,.02,-27,"metal_jaune"],[13.9,0,-25,14.1,.02,-23,"metal_jaune"],[13.9,0,-21,14.1,.02,-19,"metal_jaune"],[13.9,0,-9,14.1,.02,-7,"metal_jaune"],[13.9,0,-5,14.1,.02,-3,"metal_jaune"],[-39.1,0,-35,-38.9,.02,-33,"metal_jaune"],[-39.1,0,-31,-38.9,.02,-29,"metal_jaune"],[-39.1,0,-27,-38.9,.02,-25,"metal_jaune"],[-39.1,0,-23,-38.9,.02,-21,"metal_jaune"],[-39.1,0,-19,-38.9,.02,-17,"metal_jaune"],[-39.1,0,-15,-38.9,.02,-13,"metal_jaune"],[-39.1,0,-11,-38.9,.02,-9,"metal_jaune"],[-39.1,0,-7,-38.9,.02,-5,"metal_jaune"],[-39.1,0,-3,-38.9,.02,-1,"metal_jaune"],[38.9,0,-35,39.1,.02,-33,"metal_jaune"],[38.9,0,-31,39.1,.02,-29,"metal_jaune"],[38.9,0,-27,39.1,.02,-25,"metal_jaune"],[38.9,0,-23,39.1,.02,-21,"metal_jaune"],[38.9,0,-19,39.1,.02,-17,"metal_jaune"],[38.9,0,-15,39.1,.02,-13,"metal_jaune"],[38.9,0,-11,39.1,.02,-9,"metal_jaune"],[38.9,0,-7,39.1,.02,-5,"metal_jaune"],[38.9,0,-3,39.1,.02,-1,"metal_jaune"],[-35,0,-39.1,-33,.02,-38.9,"metal_jaune"],[-31,0,-39.1,-29,.02,-38.9,"metal_jaune"],[-27,0,-39.1,-25,.02,-38.9,"metal_jaune"],[-23,0,-39.1,-21,.02,-38.9,"metal_jaune"],[-19,0,-39.1,-17,.02,-38.9,"metal_jaune"],[-15,0,-39.1,-13,.02,-38.9,"metal_jaune"],[-11,0,-39.1,-9,.02,-38.9,"metal_jaune"],[-7,0,-39.1,-5,.02,-38.9,"metal_jaune"],[-3,0,-39.1,-1,.02,-38.9,"metal_jaune"],[1,0,-39.1,3,.02,-38.9,"metal_jaune"],[5,0,-39.1,7,.02,-38.9,"metal_jaune"],[9,0,-39.1,11,.02,-38.9,"metal_jaune"],[13,0,-39.1,15,.02,-38.9,"metal_jaune"],[17,0,-39.1,19,.02,-38.9,"metal_jaune"],[21,0,-39.1,23,.02,-38.9,"metal_jaune"],[25,0,-39.1,27,.02,-38.9,"metal_jaune"],[29,0,-39.1,31,.02,-38.9,"metal_jaune"],[33,0,-39.1,35,.02,-38.9,"metal_jaune"],[-17.4,0,-21.5,-16.8,.02,-19.2,"trottoir"],[-9.5,0,-17.4,-7.2,.02,-16.8,"trottoir"],[-16.2,0,-21.5,-15.6,.02,-19.2,"trottoir"],[-9.5,0,-16.2,-7.2,.02,-15.6,"trottoir"],[-15,0,-21.5,-14.4,.02,-19.2,"trottoir"],[-9.5,0,-15,-7.2,.02,-14.4,"trottoir"],[-13.8,0,-21.5,-13.2,.02,-19.2,"trottoir"],[-9.5,0,-13.8,-7.2,.02,-13.2,"trottoir"],[-12.6,0,-21.5,-12,.02,-19.2,"trottoir"],[-9.5,0,-12.6,-7.2,.02,-12,"trottoir"],[-11.4,0,-21.5,-10.8,.02,-19.2,"trottoir"],[-9.5,0,-11.4,-7.2,.02,-10.8,"trottoir"],[-6.95,1.25,-14.88,-5.05,1.75,-13.12,"vitre"],[-3.9,.7,-14.8,-3.87,.95,-14.5,"lampe"],[-3.9,.7,-13.5,-3.87,.95,-13.2,"lampe"],[29.05,1.25,-12.88,30.95,1.75,-11.12,"vitre"],[32.1,.7,-12.8,32.13,.95,-12.5,"lampe"],[32.1,.7,-11.5,32.13,.95,-11.2,"lampe"],[-12.88,1.25,-27.95,-11.12,1.75,-26.05,"vitre"],[-12.8,.7,-24.9,-12.5,.95,-24.87,"lampe"],[-11.5,.7,-24.9,-11.2,.95,-24.87,"lampe"],[15.12,1.25,-4.95,16.88,1.75,-3.05,"vitre"],[15.2,.7,-1.9,15.5,.95,-1.87,"lampe"],[16.5,.7,-1.9,16.8,.95,-1.87,"lampe"],[-30.95,1.25,-40.38,-29.05,1.75,-38.62,"vitre"],[-27.9,.7,-40.3,-27.87,.95,-40,"lampe"],[-27.9,.7,-39,-27.87,.95,-38.7,"lampe"],[-18.7,.15,-24.1,-18.5,3.55,-23.9,"metal"],[-18.9,3.55,-24.3,-18.3,3.95,-23.7,"lampe"],[-18.98,3.95,-24.38,-18.22,4.05,-23.62,"metal"],[-9.5,.15,-34.1,-9.3,3.55,-33.9,"metal"],[-9.7,3.55,-34.3,-9.1,3.95,-33.7,"lampe"],[-9.78,3.95,-34.38,-9.02,4.05,-33.62,"metal"],[9.3,.15,-24.1,9.5,3.55,-23.9,"metal"],[9.1,3.55,-24.3,9.7,3.95,-23.7,"lampe"],[9.02,3.95,-24.38,9.78,4.05,-23.62,"metal"],[18.5,.15,-32.1,18.7,3.55,-31.9,"metal"],[18.3,3.55,-32.3,18.9,3.95,-31.7,"lampe"],[18.22,3.95,-32.38,18.98,4.05,-31.62,"metal"],[-18.7,.15,-2.1,-18.5,3.55,-1.9,"metal"],[-18.9,3.55,-2.3,-18.3,3.95,-1.7,"lampe"],[-18.98,3.95,-2.38,-18.22,4.05,-1.62,"metal"],[-36.7,.15,-14.1,-36.5,3.55,-13.9,"metal"],[-36.9,3.55,-14.3,-36.3,3.95,-13.7,"lampe"],[-36.98,3.95,-14.38,-36.22,4.05,-13.62,"metal"],[23.9,.15,-17.5,24.1,3.55,-17.3,"metal"],[23.7,3.55,-17.7,24.3,3.95,-17.1,"lampe"],[23.62,3.95,-17.78,24.38,4.05,-17.02,"metal"],[-24.1,.15,-17.5,-23.9,3.55,-17.3,"metal"],[-24.3,3.55,-17.7,-23.7,3.95,-17.1,"lampe"],[-24.38,3.95,-17.78,-23.62,4.05,-17.02,"metal"],[28.5,1.15,36,35.5,2.55,36.04,"vitre"],[28.5,1.15,27.96,35.5,2.55,28,"vitre"],[36,1.15,28.5,36.04,2.55,35.5,"vitre"],[27.96,1.15,28.5,28,2.55,35.5,"vitre"],[28.5,4.15,36,35.5,5.55,36.04,"vitre"],[28.5,4.15,27.96,35.5,5.55,28,"vitre"],[36,4.15,28.5,36.04,5.55,35.5,"vitre"],[27.96,4.15,28.5,28,5.55,35.5,"vitre"],[28.5,7.15,36,35.5,8.55,36.04,"vitre"],[28.5,7.15,27.96,35.5,8.55,28,"vitre"],[36,7.15,28.5,36.04,8.55,35.5,"vitre"],[27.96,7.15,28.5,28,8.55,35.5,"vitre"],[28.5,10.15,36,35.5,11.55,36.04,"vitre"],[28.5,10.15,27.96,35.5,11.55,28,"vitre"],[36,10.15,28.5,36.04,11.55,35.5,"vitre"],[27.96,10.15,28.5,28,11.55,35.5,"vitre"],[19.5,1.15,36,25.5,2.55,36.04,"vitre"],[19.5,1.15,28.96,25.5,2.55,29,"vitre"],[26,1.15,29.5,26.04,2.55,35.5,"vitre"],[18.96,1.15,29.5,19,2.55,35.5,"vitre"],[19.5,4.15,36,25.5,5.55,36.04,"vitre"],[19.5,4.15,28.96,25.5,5.55,29,"vitre"],[26,4.15,29.5,26.04,5.55,35.5,"vitre"],[18.96,4.15,29.5,19,5.55,35.5,"vitre"],[18.5,3.15,26.6,20,4.15,26.7,"metal"],[3.5,4.15,32,9.5,5.55,32.04,"vitre"],[3.5,4.15,19.96,9.5,5.55,20,"vitre"],[10,4.15,20.5,10.04,5.55,31.5,"vitre"],[2.96,4.15,20.5,3,5.55,31.5,"vitre"],[2,3.15,34.3,3.5,4.15,34.4,"metal"],[-9.5,4.15,32,-3.5,5.55,32.04,"vitre"],[-9.5,4.15,19.96,-3.5,5.55,20,"vitre"],[-3,4.15,20.5,-2.96,5.55,31.5,"vitre"],[-10.04,4.15,20.5,-10,5.55,31.5,"vitre"],[-3,6.15,26.9,3,7,27,"metal"],[-3,6.15,25.5,3,7,25.6,"metal"],[10,6.15,31.4,19,7,31.5,"metal"],[10,6.15,30,19,7,30.1,"metal"],[-35.5,1.15,36,-26.5,2.55,36.04,"vitre"],[-35.5,1.15,27.96,-26.5,2.55,28,"vitre"],[-26,1.15,28.5,-25.96,2.55,35.5,"vitre"],[-36.04,1.15,28.5,-36,2.55,35.5,"vitre"],[-33.6,3.15,32.8,-33.4,7,33,"metal"],[-34.5,5,32.9,-28,7.4,33.05,"metal_jaune"],[-22.38,1.25,32.05,-20.62,1.75,33.95,"vitre"],[-21,.7,30.87,-20.7,.95,30.9,"lampe"],[-22.3,.7,30.87,-22,.95,30.9,"lampe"],[-25.38,1.25,23.05,-23.62,1.75,24.95,"vitre"],[-24,.7,21.87,-23.7,.95,21.9,"lampe"],[-25.3,.7,21.87,-25,.95,21.9,"lampe"],[-22.38,1.25,23.05,-20.62,1.75,24.95,"vitre"],[-21,.7,21.87,-20.7,.95,21.9,"lampe"],[-22.3,.7,21.87,-22,.95,21.9,"lampe"],[-20.05,.15,21,-19.95,.17,27,"trottoir"],[-23.05,.15,21,-22.95,.17,27,"trottoir"],[-26.05,.15,21,-25.95,.17,27,"trottoir"],[28.5,4.15,10,35.5,5.55,10.04,"vitre"],[28.5,4.15,-.04,35.5,5.55,0,"vitre"],[36,4.15,.5,36.04,5.55,9.5,"vitre"],[27.96,4.15,.5,28,5.55,9.5,"vitre"],[28.5,7.15,10,35.5,8.55,10.04,"vitre"],[28.5,7.15,-.04,35.5,8.55,0,"vitre"],[36,7.15,.5,36.04,8.55,9.5,"vitre"],[27.96,7.15,.5,28,8.55,9.5,"vitre"],[25.6,3.15,1.5,25.7,4.15,3,"metal"],[25.6,9.15,1.5,25.7,10.15,3,"metal"],[19,1.15,8,23.5,2.55,8.04,"vitre"],[19,1.15,1.96,23.5,2.55,2,"vitre"],[24,1.15,2.5,24.04,2.55,7.5,"vitre"],[18.46,1.15,2.5,18.5,2.55,7.5,"vitre"],[19,4.15,8,23.5,5.55,8.04,"vitre"],[19,4.15,1.96,23.5,5.55,2,"vitre"],[24,4.15,2.5,24.04,5.55,7.5,"vitre"],[18.46,4.15,2.5,18.5,5.55,7.5,"vitre"],[39,0,13.9,41,.02,14.1,"metal_jaune"],[35,0,13.9,37,.02,14.1,"metal_jaune"],[31,0,13.9,33,.02,14.1,"metal_jaune"],[27,0,13.9,29,.02,14.1,"metal_jaune"],[23,0,13.9,25,.02,14.1,"metal_jaune"],[19,0,13.9,21,.02,14.1,"metal_jaune"],[7,0,13.9,9,.02,14.1,"metal_jaune"],[3,0,13.9,5,.02,14.1,"metal_jaune"],[-1,0,13.9,1,.02,14.1,"metal_jaune"],[-5,0,13.9,-3,.02,14.1,"metal_jaune"],[-9,0,13.9,-7,.02,14.1,"metal_jaune"],[-21,0,13.9,-19,.02,14.1,"metal_jaune"],[-25,0,13.9,-23,.02,14.1,"metal_jaune"],[-29,0,13.9,-27,.02,14.1,"metal_jaune"],[-33,0,13.9,-31,.02,14.1,"metal_jaune"],[-37,0,13.9,-35,.02,14.1,"metal_jaune"],[-41,0,13.9,-39,.02,14.1,"metal_jaune"],[13.9,0,39,14.1,.02,41,"metal_jaune"],[13.9,0,35,14.1,.02,37,"metal_jaune"],[13.9,0,31,14.1,.02,33,"metal_jaune"],[13.9,0,27,14.1,.02,29,"metal_jaune"],[13.9,0,23,14.1,.02,25,"metal_jaune"],[13.9,0,19,14.1,.02,21,"metal_jaune"],[13.9,0,7,14.1,.02,9,"metal_jaune"],[13.9,0,3,14.1,.02,5,"metal_jaune"],[-14.1,0,39,-13.9,.02,41,"metal_jaune"],[-14.1,0,35,-13.9,.02,37,"metal_jaune"],[-14.1,0,31,-13.9,.02,33,"metal_jaune"],[-14.1,0,27,-13.9,.02,29,"metal_jaune"],[-14.1,0,23,-13.9,.02,25,"metal_jaune"],[-14.1,0,19,-13.9,.02,21,"metal_jaune"],[-14.1,0,7,-13.9,.02,9,"metal_jaune"],[-14.1,0,3,-13.9,.02,5,"metal_jaune"],[38.9,0,33,39.1,.02,35,"metal_jaune"],[38.9,0,29,39.1,.02,31,"metal_jaune"],[38.9,0,25,39.1,.02,27,"metal_jaune"],[38.9,0,21,39.1,.02,23,"metal_jaune"],[38.9,0,17,39.1,.02,19,"metal_jaune"],[38.9,0,13,39.1,.02,15,"metal_jaune"],[38.9,0,9,39.1,.02,11,"metal_jaune"],[38.9,0,5,39.1,.02,7,"metal_jaune"],[38.9,0,1,39.1,.02,3,"metal_jaune"],[-39.1,0,33,-38.9,.02,35,"metal_jaune"],[-39.1,0,29,-38.9,.02,31,"metal_jaune"],[-39.1,0,25,-38.9,.02,27,"metal_jaune"],[-39.1,0,21,-38.9,.02,23,"metal_jaune"],[-39.1,0,17,-38.9,.02,19,"metal_jaune"],[-39.1,0,13,-38.9,.02,15,"metal_jaune"],[-39.1,0,9,-38.9,.02,11,"metal_jaune"],[-39.1,0,5,-38.9,.02,7,"metal_jaune"],[-39.1,0,1,-38.9,.02,3,"metal_jaune"],[33,0,38.9,35,.02,39.1,"metal_jaune"],[29,0,38.9,31,.02,39.1,"metal_jaune"],[25,0,38.9,27,.02,39.1,"metal_jaune"],[21,0,38.9,23,.02,39.1,"metal_jaune"],[17,0,38.9,19,.02,39.1,"metal_jaune"],[13,0,38.9,15,.02,39.1,"metal_jaune"],[9,0,38.9,11,.02,39.1,"metal_jaune"],[5,0,38.9,7,.02,39.1,"metal_jaune"],[1,0,38.9,3,.02,39.1,"metal_jaune"],[-3,0,38.9,-1,.02,39.1,"metal_jaune"],[-7,0,38.9,-5,.02,39.1,"metal_jaune"],[-11,0,38.9,-9,.02,39.1,"metal_jaune"],[-15,0,38.9,-13,.02,39.1,"metal_jaune"],[-19,0,38.9,-17,.02,39.1,"metal_jaune"],[-23,0,38.9,-21,.02,39.1,"metal_jaune"],[-27,0,38.9,-25,.02,39.1,"metal_jaune"],[-31,0,38.9,-29,.02,39.1,"metal_jaune"],[-35,0,38.9,-33,.02,39.1,"metal_jaune"],[16.8,0,19.2,17.4,.02,21.5,"trottoir"],[7.2,0,16.8,9.5,.02,17.4,"trottoir"],[15.6,0,19.2,16.2,.02,21.5,"trottoir"],[7.2,0,15.6,9.5,.02,16.2,"trottoir"],[14.4,0,19.2,15,.02,21.5,"trottoir"],[7.2,0,14.4,9.5,.02,15,"trottoir"],[13.2,0,19.2,13.8,.02,21.5,"trottoir"],[7.2,0,13.2,9.5,.02,13.8,"trottoir"],[12,0,19.2,12.6,.02,21.5,"trottoir"],[7.2,0,12,9.5,.02,12.6,"trottoir"],[10.8,0,19.2,11.4,.02,21.5,"trottoir"],[7.2,0,10.8,9.5,.02,11.4,"trottoir"],[5.05,1.25,13.12,6.95,1.75,14.88,"vitre"],[3.87,.7,14.5,3.9,.95,14.8,"lampe"],[3.87,.7,13.2,3.9,.95,13.5,"lampe"],[-30.95,1.25,11.12,-29.05,1.75,12.88,"vitre"],[-32.13,.7,12.5,-32.1,.95,12.8,"lampe"],[-32.13,.7,11.2,-32.1,.95,11.5,"lampe"],[11.12,1.25,26.05,12.88,1.75,27.95,"vitre"],[12.5,.7,24.87,12.8,.95,24.9,"lampe"],[11.2,.7,24.87,11.5,.95,24.9,"lampe"],[-16.88,1.25,3.05,-15.12,1.75,4.95,"vitre"],[-15.5,.7,1.87,-15.2,.95,1.9,"lampe"],[-16.8,.7,1.87,-16.5,.95,1.9,"lampe"],[29.05,1.25,38.62,30.95,1.75,40.38,"vitre"],[27.87,.7,40,27.9,.95,40.3,"lampe"],[27.87,.7,38.7,27.9,.95,39,"lampe"],[18.5,.15,23.9,18.7,3.55,24.1,"metal"],[18.3,3.55,23.7,18.9,3.95,24.3,"lampe"],[18.22,3.95,23.62,18.98,4.05,24.38,"metal"],[9.3,.15,33.9,9.5,3.55,34.1,"metal"],[9.1,3.55,33.7,9.7,3.95,34.3,"lampe"],[9.02,3.95,33.62,9.78,4.05,34.38,"metal"],[-9.5,.15,23.9,-9.3,3.55,24.1,"metal"],[-9.7,3.55,23.7,-9.1,3.95,24.3,"lampe"],[-9.78,3.95,23.62,-9.02,4.05,24.38,"metal"],[-18.7,.15,31.9,-18.5,3.55,32.1,"metal"],[-18.9,3.55,31.7,-18.3,3.95,32.3,"lampe"],[-18.98,3.95,31.62,-18.22,4.05,32.38,"metal"],[18.5,.15,1.9,18.7,3.55,2.1,"metal"],[18.3,3.55,1.7,18.9,3.95,2.3,"lampe"],[18.22,3.95,1.62,18.98,4.05,2.38,"metal"],[36.5,.15,13.9,36.7,3.55,14.1,"metal"],[36.3,3.55,13.7,36.9,3.95,14.3,"lampe"],[36.22,3.95,13.62,36.98,4.05,14.38,"metal"],[-24.1,.15,17.3,-23.9,3.55,17.5,"metal"],[-24.3,3.55,17.1,-23.7,3.95,17.7,"lampe"],[-24.38,3.95,17.02,-23.62,4.05,17.78,"metal"],[23.9,.15,17.3,24.1,3.55,17.5,"metal"],[23.7,3.55,17.1,24.3,3.95,17.7,"lampe"],[23.62,3.95,17.02,24.38,4.05,17.78,"metal"]],apparitions:[{x:-24,y:0,z:-39,angle:180,equipe:0},{x:-12,y:0,z:-39,angle:180,equipe:0},{x:0,y:0,z:-39,angle:180,equipe:0},{x:12,y:0,z:-39,angle:180,equipe:0},{x:24,y:0,z:-39,angle:180,equipe:0},{x:-14,y:0,z:-24,angle:-150,equipe:null},{x:14,y:0,z:-6,angle:113,equipe:null},{x:-30,y:0,z:-14,angle:-115,equipe:null},{x:-6,y:.15,z:-25,angle:-167,equipe:null},{x:-22.5,y:6.15,z:-33,angle:-146,equipe:null},{x:6.5,y:6.15,z:-26,angle:166,equipe:null},{x:-38,y:0,z:-2,angle:-93,equipe:null},{x:24,y:.15,z:-30,angle:141,equipe:null},{x:-32,y:.15,z:6.5,angle:-79,equipe:null},{x:-14,y:0,z:2,angle:-82,equipe:null},{x:24,y:0,z:39,angle:0,equipe:1},{x:12,y:0,z:39,angle:0,equipe:1},{x:0,y:0,z:39,angle:0,equipe:1},{x:-12,y:0,z:39,angle:0,equipe:1},{x:-24,y:0,z:39,angle:0,equipe:1},{x:14,y:0,z:24,angle:30,equipe:null},{x:-14,y:0,z:6,angle:-67,equipe:null},{x:30,y:0,z:14,angle:65,equipe:null},{x:6,y:.15,z:25,angle:13,equipe:null},{x:22.5,y:6.15,z:33,angle:34,equipe:null},{x:-6.5,y:6.15,z:26,angle:-14,equipe:null},{x:38,y:0,z:2,angle:87,equipe:null},{x:-24,y:.15,z:30,angle:-39,equipe:null},{x:32,y:.15,z:-6.5,angle:101,equipe:null},{x:14,y:0,z:-2,angle:98,equipe:null}]};var Xu={_aide:"Carte d'Arena FPS (fabriqu\xE9e par games/fps/outils/cartes.py : modifie plut\xF4t ce script). taille = demi-c\xF4t\xE9 de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, mati\xE8re] (en m\xE8tres, le sol est \xE0 y = 0) ; decors = blocs sans collision ; apparitions : y = hauteur du sol, angle en degr\xE9s (0 = regarde vers le nord, 90 = l'ouest, -90 = l'est, 180 = le sud), equipe 0 = Bleus (au nord), 1 = Rouges (au sud), null = chacun pour soi. Les vitres et les murs invisibles laissent passer les balles.",id:"ile",nom:"\xCEle tropicale",description:"Une \xEEle au soleil : plages, palmiers, cabanes sur pilotis et une grotte sous la colline.",taille:44,ambiance:{ciel:["#1d86de","#c4f1ff"],brouillard:["#c4f1ff",85,280],soleil:{couleur:"#fffbe8",intensite:2.4,position:[22,70,30]},ambiante:{ciel:"#d6f4ff",sol:"#cbb37c",intensite:1.45},nuages:!0},eau:{niveau:0,couleur:"#21b8c9"},boites:[[-44,-3,-44,44,-.7,44,"sable"],[-45,-5,-45,45,14,-44,"invisible"],[-45,-5,44,45,14,45,"invisible"],[-45,-5,-44,-44,14,44,"invisible"],[44,-5,-44,45,14,44,"invisible"],[-12,-.7,-32,8,-.2,-30,"sable"],[-20,-.7,-30,-10,-.2,-28,"sable"],[-10,-.7,-30,4,.3,-26,"sable"],[4,-.7,-30,16,-.2,-28,"sable"],[-22,-.7,-28,-18,-.2,-26,"sable"],[-18,-.7,-28,-10,.3,-24,"sable"],[4,-.7,-28,14,.3,-24,"sable"],[14,-.7,-28,20,-.2,-26,"sable"],[-26,-.7,-26,-22,-.2,-24,"sable"],[-22,-.7,-26,-18,.3,-22,"sable"],[-10,-.7,-26,4,.8,-22,"sable"],[14,-.7,-26,18,.3,-22,"sable"],[18,-.7,-26,22,-.2,-24,"sable"],[-26,-.7,-24,-24,-.2,-22,"sable"],[-24,-.7,-24,-22,.3,-16,"sable"],[-18,-.7,-24,-16,.3,-22,"sable"],[-16,-.7,-24,-10,.8,-22,"sable"],[4,-.7,-24,12,.8,-22,"sable"],[12,-.7,-24,14,.3,-22,"sable"],[18,-.7,-24,20,.3,-18,"sable"],[20,-.7,-24,24,-.2,-22,"sable"],[-28,-.7,-22,-26,-.2,-18,"sable"],[-26,-.7,-22,-24,.3,-12,"sable"],[-22,-.7,-22,-20,.3,-20,"sable"],[-20,-.7,-22,-12,.8,-20,"sable"],[-12,-.7,-22,6,1.3,-18,"herbe"],[6,-.7,-22,16,.8,-20,"sable"],[16,-.7,-22,18,.3,-20,"sable"],[20,-.7,-22,24,.3,-16,"sable"],[24,-.7,-22,26,-.2,-18,"sable"],[-30,-.7,-20,-28,-.2,-14,"sable"],[-22,-.7,-20,-16,.8,-18,"sable"],[-16,-.7,-20,-12,1.3,-16,"herbe"],[6,-.7,-20,12,1.3,-18,"herbe"],[12,-.7,-20,18,.8,-18,"sable"],[26,-.7,-20,28,-.2,-14,"sable"],[-28,-.7,-18,-26,.3,14,"sable"],[-22,-.7,-18,-18,.8,-16,"sable"],[-18,-.7,-18,-16,1.3,-12,"herbe"],[-12,-.7,-18,8,1.8,-14,"herbe"],[8,-.7,-18,16,1.3,-16,"herbe"],[16,-.7,-18,20,.8,-16,"sable"],[24,-.7,-18,26,.3,-4,"sable"],[-32,-.7,-16,-30,-.2,10,"sable"],[-24,-.7,-16,-20,.8,-12,"sable"],[-20,-.7,-16,-18,1.3,12,"herbe"],[-16,-.7,-16,-12,1.8,12,"herbe"],[8,-.7,-16,12,1.8,-12,"herbe"],[12,-.7,-16,18,1.3,-14,"herbe"],[18,-.7,-16,22,.8,-12,"sable"],[22,-.7,-16,24,.3,-12,"sable"],[28,-.7,-16,30,-.2,-8,"sable"],[-30,-.7,-14,-28,.3,8,"sable"],[-12,-.7,-14,-10,1.8,-12,"herbe"],[-10,-.7,-14,4,2.3,12,"herbe"],[4,-.7,-14,8,1.8,-12,"herbe"],[12,-.7,-14,14,1.8,16,"herbe"],[14,-.7,-14,18,1.3,-12,"herbe"],[26,-.7,-14,28,.3,18,"sable"],[-26,-.7,-12,-22,.8,4,"sable"],[-22,-.7,-12,-20,1.3,4,"herbe"],[-18,-.7,-12,-16,1.8,6,"herbe"],[-12,-.7,-12,-10,2.3,8,"herbe"],[4,-.7,-12,10,2.3,14,"herbe"],[10,-.7,-12,12,1.8,-8,"herbe"],[14,-.7,-12,16,1.8,16,"herbe"],[16,-.7,-12,20,1.3,-6,"herbe"],[20,-.7,-12,24,.8,-4,"sable"],[30,-.7,-10,32,-.2,16,"sable"],[10,-.7,-8,12,2.3,12,"herbe"],[28,-.7,-8,30,.3,14,"sable"],[16,-.7,-6,18,1.8,12,"herbe"],[18,-.7,-6,20,1.3,16,"herbe"],[20,-.7,-4,22,1.3,12,"herbe"],[22,-.7,-4,26,.8,12,"sable"],[-26,-.7,4,-24,.3,18,"sable"],[-24,-.7,4,-20,.8,12,"sable"],[-18,-.7,6,-16,1.3,16,"herbe"],[-30,-.7,8,-28,-.2,16,"sable"],[-12,-.7,8,-10,1.8,16,"herbe"],[-24,-.7,12,-22,.3,22,"sable"],[-22,-.7,12,-18,.8,16,"sable"],[-16,-.7,12,-14,1.3,18,"herbe"],[-14,-.7,12,-12,1.8,14,"herbe"],[-10,-.7,12,-4,1.8,16,"herbe"],[-4,-.7,12,4,2.3,14,"herbe"],[10,-.7,12,12,1.8,18,"herbe"],[16,-.7,12,18,1.3,18,"herbe"],[20,-.7,12,24,.8,16,"sable"],[24,-.7,12,26,.3,22,"sable"],[-28,-.7,14,-26,-.2,20,"sable"],[-14,-.7,14,-12,1.3,18,"herbe"],[-4,-.7,14,10,1.8,18,"herbe"],[28,-.7,14,30,-.2,20,"sable"],[-22,-.7,16,-20,.3,22,"sable"],[-20,-.7,16,-16,.8,18,"sable"],[-12,-.7,16,-8,1.3,20,"herbe"],[-8,-.7,16,-4,1.8,18,"herbe"],[12,-.7,16,16,1.3,20,"herbe"],[18,-.7,16,22,.8,20,"sable"],[22,-.7,16,24,.3,24,"sable"],[-26,-.7,18,-24,-.2,22,"sable"],[-20,-.7,18,-18,.3,24,"sable"],[-18,-.7,18,-12,.8,20,"sable"],[-8,-.7,18,12,1.3,20,"herbe"],[16,-.7,18,18,.8,22,"sable"],[26,-.7,18,28,-.2,22,"sable"],[-18,-.7,20,-16,.3,26,"sable"],[-16,-.7,20,-6,.8,22,"sable"],[-6,-.7,20,12,1.3,22,"herbe"],[12,-.7,20,16,.8,24,"sable"],[18,-.7,20,20,.8,22,"sable"],[20,-.7,20,22,.3,26,"sable"],[-24,-.7,22,-20,-.2,24,"sable"],[-16,-.7,22,-12,.3,26,"sable"],[-12,-.7,22,12,.8,24,"sable"],[16,-.7,22,20,.3,26,"sable"],[24,-.7,22,26,-.2,26,"sable"],[-22,-.7,24,-18,-.2,26,"sable"],[-12,-.7,24,-4,.3,28,"sable"],[-4,-.7,24,10,.8,26,"sable"],[10,-.7,24,16,.3,28,"sable"],[22,-.7,24,24,-.2,26,"sable"],[-20,-.7,26,-14,-.2,28,"sable"],[-14,-.7,26,-12,.3,28,"sable"],[-4,-.7,26,10,.3,30,"sable"],[16,-.7,26,18,.3,28,"sable"],[18,-.7,26,22,-.2,28,"sable"],[-16,-.7,28,-4,-.2,30,"sable"],[10,-.7,28,20,-.2,30,"sable"],[-8,-.7,30,12,-.2,32,"sable"],[-10,2.3,-8,-1.5,3.6,8,"pierre"],[1.5,2.3,-8,10,3.6,8,"pierre"],[-8.5,3.6,-7,-1.5,4.9,7,"pierre"],[1.5,3.6,-7,8.5,4.9,7,"pierre"],[-7,4.9,-6,7,6.2,6,"herbe"],[-5,6.2,-4.5,5,7.5,4.5,"herbe"],[-2.5,7.5,-2,2.5,8.8,2,"pierre"],[33,-.7,-18,33.4,1.5,-17.6,"tronc"],[40.6,-.7,-18,41,1.5,-17.6,"tronc"],[33,-.7,-11.4,33.4,1.5,-11,"tronc"],[40.6,-.7,-11.4,41,1.5,-11,"tronc"],[36.8,-.7,-18,37.2,1.5,-17.6,"tronc"],[36.8,-.7,-11.4,37.2,1.5,-11,"tronc"],[33,1.5,-18,41,1.8,-11,"planches"],[34.5,1.8,-16.5,36.4,4.4,-16.2,"planches"],[36.4,1.8,-16.5,37.6,2.8,-16.2,"planches"],[36.4,3.6,-16.5,37.6,4.4,-16.2,"planches"],[37.6,1.8,-16.5,39.5,4.4,-16.2,"planches"],[34.5,1.8,-12.8,36.4,4.4,-12.5,"planches"],[36.4,1.8,-12.8,37.6,2.8,-12.5,"planches"],[36.4,3.6,-12.8,37.6,4.4,-12.5,"planches"],[37.6,1.8,-12.8,39.5,4.4,-12.5,"planches"],[34.5,1.8,-16.2,34.8,4.4,-15.3,"planches"],[34.5,4.3,-15.3,34.8,4.4,-13.7,"planches"],[34.5,1.8,-13.7,34.8,4.4,-12.8,"planches"],[39.2,1.8,-16.2,39.5,4.4,-12.8,"planches"],[34,4.4,-17,40,4.8,-12,"paille"],[34.8,4.8,-16.2,39.2,5.2,-12.8,"paille"],[35.5,5.2,-15.5,38.5,5.6,-13.5,"paille"],[40.8,1.8,-18,41,2.7,-11,"planches"],[24,.5,-15.25,31,.8,-13.75,"planches"],[31,1,-15.25,32,1.3,-13.75,"planches"],[32,1.5,-15.25,33,1.8,-13.75,"planches"],[24,-.7,-15.4,24.3,.5,-15.1,"tronc"],[27,-.7,-15.4,27.3,.5,-15.1,"tronc"],[30,-.7,-15.4,30.3,.5,-15.1,"tronc"],[39,1.8,-12.5,40,2.8,-11.5,"caisse"],[-3,0,-36,3,.3,-27,"planches"],[-3,-.7,-35,-2.7,0,-34.7,"tronc"],[2.7,-.7,-35,3,0,-34.7,"tronc"],[-3,-.7,-31,-2.7,0,-30.7,"tronc"],[2.7,-.7,-31,3,0,-30.7,"tronc"],[5,-.4,-34,6.6,.4,-29,"bois"],[5.2,.4,-33.8,6.4,.6,-29.2,"planches"],[-20,1.3,-12,-19.6,5.3,-11.6,"tronc"],[-16.4,1.3,-12,-16,5.3,-11.6,"tronc"],[-20,1.3,-8.4,-19.6,5.3,-8,"tronc"],[-16.4,1.3,-8.4,-16,5.3,-8,"tronc"],[-20,5.3,-12,-16,5.6,-8,"planches"],[-20,5.6,-12,-16,6.4,-11.8,"planches"],[-20,5.6,-8.2,-16,6.4,-8,"planches"],[-20,5.6,-11.8,-19.8,6.4,-8.2,"planches"],[-9,1.5,-10.8,-8,1.8,-9.2,"planches"],[-10,2,-10.8,-9,2.3,-9.2,"planches"],[-11,2.5,-10.8,-10,2.8,-9.2,"planches"],[-12,3,-10.8,-11,3.3,-9.2,"planches"],[-13,3.5,-10.8,-12,3.8,-9.2,"planches"],[-14,4,-10.8,-13,4.3,-9.2,"planches"],[-15,4.5,-10.8,-14,4.8,-9.2,"planches"],[-16,5,-10.8,-15,5.3,-9.2,"planches"],[8,1.3,-19,13,3.9,-18.7,"planches"],[8,1.3,-15.3,9.7,3.9,-15,"planches"],[9.7,3.8,-15.3,11.3,3.9,-15,"planches"],[11.3,1.3,-15.3,13,3.9,-15,"planches"],[8,1.3,-18.7,8.3,3.9,-17.6,"planches"],[8,1.3,-17.6,8.3,2.3,-16.4,"planches"],[8,3.1,-17.6,8.3,3.9,-16.4,"planches"],[8,1.3,-16.4,8.3,3.9,-15.3,"planches"],[12.7,1.3,-18.7,13,3.9,-17.6,"planches"],[12.7,1.3,-17.6,13,2.3,-16.4,"planches"],[12.7,3.1,-17.6,13,3.9,-16.4,"planches"],[12.7,1.3,-16.4,13,3.9,-15.3,"planches"],[7.5,3.9,-19.5,13.5,4.3,-14.5,"paille"],[8.3,4.3,-18.7,12.7,4.7,-15.3,"paille"],[9,4.7,-18,12,5.1,-16,"paille"],[-27,.8,-2,-25.35,3.4,-1.7,"planches"],[-25.35,.8,-2,-24.15,1.8,-1.7,"planches"],[-25.35,2.6,-2,-24.15,3.4,-1.7,"planches"],[-24.15,.8,-2,-22.5,3.4,-1.7,"planches"],[-27,.8,1.7,-25.35,3.4,2,"planches"],[-25.35,.8,1.7,-24.15,1.8,2,"planches"],[-25.35,2.6,1.7,-24.15,3.4,2,"planches"],[-24.15,.8,1.7,-22.5,3.4,2,"planches"],[-27,.8,-1.7,-26.7,3.4,1.7,"planches"],[-22.8,.8,-1.7,-22.5,3.4,-.8,"planches"],[-22.8,3.3,-.8,-22.5,3.4,.8,"planches"],[-22.8,.8,.8,-22.5,3.4,1.7,"planches"],[-27.5,3.4,-2.5,-22,3.8,2.5,"paille"],[-26.7,3.8,-1.7,-22.8,4.2,1.7,"paille"],[-26,4.2,-1,-23.5,4.6,1,"paille"],[-12.35,1.3,-21.35,-11.65,2.9,-20.65,"palmier"],[-12.05,2.9,-21.35,-11.35,4.5,-20.65,"palmier"],[-11.65,4.5,-21.35,-10.95,6.1,-20.65,"palmier"],[13.65,1.8,-11.35,14.35,3.4,-10.65,"palmier"],[13.65,3.4,-11.65,14.35,5,-10.95,"palmier"],[13.65,5,-12.05,14.35,6.6,-11.35,"palmier"],[-27.35,.3,-9.35,-26.65,1.9,-8.65,"palmier"],[-27.05,1.9,-9.35,-26.35,3.5,-8.65,"palmier"],[-26.65,3.5,-9.35,-25.95,5.1,-8.65,"palmier"],[21.65,1.3,-2.35,22.35,2.9,-1.65,"palmier"],[21.35,2.9,-2.35,22.05,4.5,-1.65,"palmier"],[20.95,4.5,-2.35,21.65,6.1,-1.65,"palmier"],[-6.35,2.3,-14.35,-5.65,3.9,-13.65,"palmier"],[-6.35,3.9,-14.05,-5.65,5.5,-13.35,"palmier"],[-6.35,5.5,-13.65,-5.65,7.1,-12.95,"palmier"],[24.65,.8,-15.35,25.35,2.4,-14.65,"palmier"],[24.65,2.4,-15.05,25.35,4,-14.35,"palmier"],[24.65,4,-14.65,25.35,5.6,-13.95,"palmier"],[-16.35,1.8,-2.35,-15.65,3.4,-1.65,"palmier"],[-16.05,3.4,-2.35,-15.35,5,-1.65,"palmier"],[-15.65,5,-2.35,-14.95,6.6,-1.65,"palmier"],[3.65,.8,-24.35,4.35,2.4,-23.65,"palmier"],[3.65,2.4,-24.65,4.35,4,-23.95,"palmier"],[3.65,4,-25.05,4.35,5.6,-24.35,"palmier"],[-10.1,.5,-25.1,-7.9,2.2,-22.9,"pierre"],[-8.6,.5,-25.8,-7.4,2.8,-24.6,"pierre"],[11,.5,-25,13,2,-23,"pierre"],[-23.2,.5,-19.2,-20.8,2.4,-16.8,"pierre"],[27.1,0,-6.9,28.9,1.6,-5.1,"pierre"],[16.2,1,-7.8,17.8,2.4,-6.2,"pierre"],[-31,0,-15,-29,1.7,-13,"pierre"],[6.4,1.8,-16.1,7.6,3,-14.9,"caisse"],[-3.6,1.8,-18.6,-2.4,3,-17.4,"caisse"],[18.4,.8,-18.6,19.6,2,-17.4,"caisse"],[-24.6,.8,-6.6,-23.4,2,-5.4,"caisse"],[35,-.7,-38.5,41,.3,-33.5,"sable"],[37.65,.3,-36.35,38.35,1.9,-35.65,"palmier"],[37.65,1.9,-36.05,38.35,3.5,-35.35,"palmier"],[37.65,3.5,-35.65,38.35,5.1,-34.95,"palmier"],[39,.3,-37.5,40.6,1.4,-36.3,"pierre"],[-33,-.7,-39.5,-27,.3,-34.5,"sable"],[-30.35,.3,-37.35,-29.65,1.9,-36.65,"palmier"],[-30.35,1.9,-37.05,-29.65,3.5,-36.35,"palmier"],[-30.35,3.5,-36.65,-29.65,5.1,-35.95,"palmier"],[-29,.3,-38.5,-27.4,1.4,-37.3,"pierre"],[-33.4,-.7,17.6,-33,1.5,18,"tronc"],[-41,-.7,17.6,-40.6,1.5,18,"tronc"],[-33.4,-.7,11,-33,1.5,11.4,"tronc"],[-41,-.7,11,-40.6,1.5,11.4,"tronc"],[-37.2,-.7,17.6,-36.8,1.5,18,"tronc"],[-37.2,-.7,11,-36.8,1.5,11.4,"tronc"],[-41,1.5,11,-33,1.8,18,"planches"],[-36.4,1.8,16.2,-34.5,4.4,16.5,"planches"],[-37.6,1.8,16.2,-36.4,2.8,16.5,"planches"],[-37.6,3.6,16.2,-36.4,4.4,16.5,"planches"],[-39.5,1.8,16.2,-37.6,4.4,16.5,"planches"],[-36.4,1.8,12.5,-34.5,4.4,12.8,"planches"],[-37.6,1.8,12.5,-36.4,2.8,12.8,"planches"],[-37.6,3.6,12.5,-36.4,4.4,12.8,"planches"],[-39.5,1.8,12.5,-37.6,4.4,12.8,"planches"],[-34.8,1.8,15.3,-34.5,4.4,16.2,"planches"],[-34.8,4.3,13.7,-34.5,4.4,15.3,"planches"],[-34.8,1.8,12.8,-34.5,4.4,13.7,"planches"],[-39.5,1.8,12.8,-39.2,4.4,16.2,"planches"],[-40,4.4,12,-34,4.8,17,"paille"],[-39.2,4.8,12.8,-34.8,5.2,16.2,"paille"],[-38.5,5.2,13.5,-35.5,5.6,15.5,"paille"],[-41,1.8,11,-40.8,2.7,18,"planches"],[-31,.5,13.75,-24,.8,15.25,"planches"],[-32,1,13.75,-31,1.3,15.25,"planches"],[-33,1.5,13.75,-32,1.8,15.25,"planches"],[-24.3,-.7,15.1,-24,.5,15.4,"tronc"],[-27.3,-.7,15.1,-27,.5,15.4,"tronc"],[-30.3,-.7,15.1,-30,.5,15.4,"tronc"],[-40,1.8,11.5,-39,2.8,12.5,"caisse"],[-3,0,27,3,.3,36,"planches"],[2.7,-.7,34.7,3,0,35,"tronc"],[-3,-.7,34.7,-2.7,0,35,"tronc"],[2.7,-.7,30.7,3,0,31,"tronc"],[-3,-.7,30.7,-2.7,0,31,"tronc"],[-6.6,-.4,29,-5,.4,34,"bois"],[-6.4,.4,29.2,-5.2,.6,33.8,"planches"],[19.6,1.3,11.6,20,5.3,12,"tronc"],[16,1.3,11.6,16.4,5.3,12,"tronc"],[19.6,1.3,8,20,5.3,8.4,"tronc"],[16,1.3,8,16.4,5.3,8.4,"tronc"],[16,5.3,8,20,5.6,12,"planches"],[16,5.6,11.8,20,6.4,12,"planches"],[16,5.6,8,20,6.4,8.2,"planches"],[19.8,5.6,8.2,20,6.4,11.8,"planches"],[8,1.5,9.2,9,1.8,10.8,"planches"],[9,2,9.2,10,2.3,10.8,"planches"],[10,2.5,9.2,11,2.8,10.8,"planches"],[11,3,9.2,12,3.3,10.8,"planches"],[12,3.5,9.2,13,3.8,10.8,"planches"],[13,4,9.2,14,4.3,10.8,"planches"],[14,4.5,9.2,15,4.8,10.8,"planches"],[15,5,9.2,16,5.3,10.8,"planches"],[-13,1.3,18.7,-8,3.9,19,"planches"],[-9.7,1.3,15,-8,3.9,15.3,"planches"],[-11.3,3.8,15,-9.7,3.9,15.3,"planches"],[-13,1.3,15,-11.3,3.9,15.3,"planches"],[-8.3,1.3,17.6,-8,3.9,18.7,"planches"],[-8.3,1.3,16.4,-8,2.3,17.6,"planches"],[-8.3,3.1,16.4,-8,3.9,17.6,"planches"],[-8.3,1.3,15.3,-8,3.9,16.4,"planches"],[-13,1.3,17.6,-12.7,3.9,18.7,"planches"],[-13,1.3,16.4,-12.7,2.3,17.6,"planches"],[-13,3.1,16.4,-12.7,3.9,17.6,"planches"],[-13,1.3,15.3,-12.7,3.9,16.4,"planches"],[-13.5,3.9,14.5,-7.5,4.3,19.5,"paille"],[-12.7,4.3,15.3,-8.3,4.7,18.7,"paille"],[-12,4.7,16,-9,5.1,18,"paille"],[25.35,.8,1.7,27,3.4,2,"planches"],[24.15,.8,1.7,25.35,1.8,2,"planches"],[24.15,2.6,1.7,25.35,3.4,2,"planches"],[22.5,.8,1.7,24.15,3.4,2,"planches"],[25.35,.8,-2,27,3.4,-1.7,"planches"],[24.15,.8,-2,25.35,1.8,-1.7,"planches"],[24.15,2.6,-2,25.35,3.4,-1.7,"planches"],[22.5,.8,-2,24.15,3.4,-1.7,"planches"],[26.7,.8,-1.7,27,3.4,1.7,"planches"],[22.5,.8,.8,22.8,3.4,1.7,"planches"],[22.5,3.3,-.8,22.8,3.4,.8,"planches"],[22.5,.8,-1.7,22.8,3.4,-.8,"planches"],[22,3.4,-2.5,27.5,3.8,2.5,"paille"],[22.8,3.8,-1.7,26.7,4.2,1.7,"paille"],[23.5,4.2,-1,26,4.6,1,"paille"],[11.65,1.3,20.65,12.35,2.9,21.35,"palmier"],[11.35,2.9,20.65,12.05,4.5,21.35,"palmier"],[10.95,4.5,20.65,11.65,6.1,21.35,"palmier"],[-14.35,1.8,10.65,-13.65,3.4,11.35,"palmier"],[-14.35,3.4,10.95,-13.65,5,11.65,"palmier"],[-14.35,5,11.35,-13.65,6.6,12.05,"palmier"],[26.65,.3,8.65,27.35,1.9,9.35,"palmier"],[26.35,1.9,8.65,27.05,3.5,9.35,"palmier"],[25.95,3.5,8.65,26.65,5.1,9.35,"palmier"],[-22.35,1.3,1.65,-21.65,2.9,2.35,"palmier"],[-22.05,2.9,1.65,-21.35,4.5,2.35,"palmier"],[-21.65,4.5,1.65,-20.95,6.1,2.35,"palmier"],[5.65,2.3,13.65,6.35,3.9,14.35,"palmier"],[5.65,3.9,13.35,6.35,5.5,14.05,"palmier"],[5.65,5.5,12.95,6.35,7.1,13.65,"palmier"],[-25.35,.8,14.65,-24.65,2.4,15.35,"palmier"],[-25.35,2.4,14.35,-24.65,4,15.05,"palmier"],[-25.35,4,13.95,-24.65,5.6,14.65,"palmier"],[15.65,1.8,1.65,16.35,3.4,2.35,"palmier"],[15.35,3.4,1.65,16.05,5,2.35,"palmier"],[14.95,5,1.65,15.65,6.6,2.35,"palmier"],[-4.35,.8,23.65,-3.65,2.4,24.35,"palmier"],[-4.35,2.4,23.95,-3.65,4,24.65,"palmier"],[-4.35,4,24.35,-3.65,5.6,25.05,"palmier"],[7.9,.5,22.9,10.1,2.2,25.1,"pierre"],[7.4,.5,24.6,8.6,2.8,25.8,"pierre"],[-13,.5,23,-11,2,25,"pierre"],[20.8,.5,16.8,23.2,2.4,19.2,"pierre"],[-28.9,0,5.1,-27.1,1.6,6.9,"pierre"],[-17.8,1,6.2,-16.2,2.4,7.8,"pierre"],[29,0,13,31,1.7,15,"pierre"],[-7.6,1.8,14.9,-6.4,3,16.1,"caisse"],[2.4,1.8,17.4,3.6,3,18.6,"caisse"],[-19.6,.8,17.4,-18.4,2,18.6,"caisse"],[23.4,.8,5.4,24.6,2,6.6,"caisse"],[-41,-.7,33.5,-35,.3,38.5,"sable"],[-38.35,.3,35.65,-37.65,1.9,36.35,"palmier"],[-38.35,1.9,35.35,-37.65,3.5,36.05,"palmier"],[-38.35,3.5,34.95,-37.65,5.1,35.65,"palmier"],[-40.6,.3,36.3,-39,1.4,37.5,"pierre"],[27,-.7,34.5,33,.3,39.5,"sable"],[29.65,.3,36.65,30.35,1.9,37.35,"palmier"],[29.65,1.9,36.35,30.35,3.5,37.05,"palmier"],[29.65,3.5,35.95,30.35,5.1,36.65,"palmier"],[27.4,.3,37.3,29,1.4,38.5,"pierre"]],decors:[[-200,-4,-200,200,-2.4,-44,"sable"],[-200,-4,44,200,-2.4,200,"sable"],[-200,-4,-44,-44,-2.4,44,"sable"],[44,-4,-44,200,-2.4,44,"sable"],[-10,3.6,-8,-1.5,3.62,8,"herbe"],[1.5,3.6,-8,10,3.62,8,"herbe"],[-8.5,4.9,-7,-1.5,4.92,7,"herbe"],[1.5,4.9,-7,8.5,4.92,7,"herbe"],[-1.5,3.6,-4.15,-1.35,4.1,-3.85,"lampe"],[1.35,3.6,-4.15,1.5,4.1,-3.85,"lampe"],[-1.5,3.6,-.15,-1.35,4.1,.15,"lampe"],[1.35,3.6,-.15,1.5,4.1,.15,"lampe"],[-1.5,3.6,3.85,-1.35,4.1,4.15,"lampe"],[1.35,3.6,3.85,1.5,4.1,4.15,"lampe"],[-.08,8.8,-.08,.08,13,.08,"tronc"],[.08,11.3,-.04,1.9,12.8,.04,"tissu_bleu"],[-1.9,11.3,-.04,-.08,12.8,.04,"tissu_rouge"],[-20.3,8.3,-12.3,-15.7,8.7,-7.7,"paille"],[-20,6.4,-12,-19.8,8.3,-11.8,"tronc"],[-16.2,6.4,-12,-16,8.3,-11.8,"tronc"],[-20,6.4,-8.2,-19.8,8.3,-8,"tronc"],[-16.2,6.4,-8.2,-16,8.3,-8,"tronc"],[-12.1,6.1,-21.8,-10.5,6.6,-20.2,"feuilles_palmier"],[-10.5,6.15,-21.5,-9,6.45,-20.5,"feuilles_palmier"],[-9,5.65,-21.4,-8.1,6,-20.6,"feuilles_palmier"],[-13.6,6.15,-21.5,-12.1,6.45,-20.5,"feuilles_palmier"],[-14.5,5.65,-21.4,-13.6,6,-20.6,"feuilles_palmier"],[-11.8,6.15,-20.2,-10.8,6.45,-18.7,"feuilles_palmier"],[-11.7,5.65,-18.7,-10.9,6,-17.8,"feuilles_palmier"],[-11.8,6.15,-23.3,-10.8,6.45,-21.8,"feuilles_palmier"],[-11.7,5.65,-24.2,-10.9,6,-23.3,"feuilles_palmier"],[-11.75,5.75,-21.1,-11.45,6.05,-20.8,"tronc"],[-11.2,5.75,-20.85,-10.9,6.05,-20.55,"tronc"],[13.2,6.6,-12.5,14.8,7.1,-10.9,"feuilles_palmier"],[14.8,6.65,-12.2,16.3,6.95,-11.2,"feuilles_palmier"],[16.3,6.15,-12.1,17.2,6.5,-11.3,"feuilles_palmier"],[11.7,6.65,-12.2,13.2,6.95,-11.2,"feuilles_palmier"],[10.8,6.15,-12.1,11.7,6.5,-11.3,"feuilles_palmier"],[13.5,6.65,-10.9,14.5,6.95,-9.4,"feuilles_palmier"],[13.6,6.15,-9.4,14.4,6.5,-8.5,"feuilles_palmier"],[13.5,6.65,-14,14.5,6.95,-12.5,"feuilles_palmier"],[13.6,6.15,-14.9,14.4,6.5,-14,"feuilles_palmier"],[13.55,6.25,-11.8,13.85,6.55,-11.5,"tronc"],[14.1,6.25,-11.55,14.4,6.55,-11.25,"tronc"],[-27.1,5.1,-9.8,-25.5,5.6,-8.2,"feuilles_palmier"],[-25.5,5.15,-9.5,-24,5.45,-8.5,"feuilles_palmier"],[-24,4.65,-9.4,-23.1,5,-8.6,"feuilles_palmier"],[-28.6,5.15,-9.5,-27.1,5.45,-8.5,"feuilles_palmier"],[-29.5,4.65,-9.4,-28.6,5,-8.6,"feuilles_palmier"],[-26.8,5.15,-8.2,-25.8,5.45,-6.7,"feuilles_palmier"],[-26.7,4.65,-6.7,-25.9,5,-5.8,"feuilles_palmier"],[-26.8,5.15,-11.3,-25.8,5.45,-9.8,"feuilles_palmier"],[-26.7,4.65,-12.2,-25.9,5,-11.3,"feuilles_palmier"],[-26.75,4.75,-9.1,-26.45,5.05,-8.8,"tronc"],[-26.2,4.75,-8.85,-25.9,5.05,-8.55,"tronc"],[20.5,6.1,-2.8,22.1,6.6,-1.2,"feuilles_palmier"],[22.1,6.15,-2.5,23.6,6.45,-1.5,"feuilles_palmier"],[23.6,5.65,-2.4,24.5,6,-1.6,"feuilles_palmier"],[19,6.15,-2.5,20.5,6.45,-1.5,"feuilles_palmier"],[18.1,5.65,-2.4,19,6,-1.6,"feuilles_palmier"],[20.8,6.15,-1.2,21.8,6.45,.3,"feuilles_palmier"],[20.9,5.65,.3,21.7,6,1.2,"feuilles_palmier"],[20.8,6.15,-4.3,21.8,6.45,-2.8,"feuilles_palmier"],[20.9,5.65,-5.2,21.7,6,-4.3,"feuilles_palmier"],[20.85,5.75,-2.1,21.15,6.05,-1.8,"tronc"],[21.4,5.75,-1.85,21.7,6.05,-1.55,"tronc"],[-6.8,7.1,-14.1,-5.2,7.6,-12.5,"feuilles_palmier"],[-5.2,7.15,-13.8,-3.7,7.45,-12.8,"feuilles_palmier"],[-3.7,6.65,-13.7,-2.8,7,-12.9,"feuilles_palmier"],[-8.3,7.15,-13.8,-6.8,7.45,-12.8,"feuilles_palmier"],[-9.2,6.65,-13.7,-8.3,7,-12.9,"feuilles_palmier"],[-6.5,7.15,-12.5,-5.5,7.45,-11,"feuilles_palmier"],[-6.4,6.65,-11,-5.6,7,-10.1,"feuilles_palmier"],[-6.5,7.15,-15.6,-5.5,7.45,-14.1,"feuilles_palmier"],[-6.4,6.65,-16.5,-5.6,7,-15.6,"feuilles_palmier"],[-6.45,6.75,-13.4,-6.15,7.05,-13.1,"tronc"],[-5.9,6.75,-13.15,-5.6,7.05,-12.85,"tronc"],[24.2,5.6,-15.1,25.8,6.1,-13.5,"feuilles_palmier"],[25.8,5.65,-14.8,27.3,5.95,-13.8,"feuilles_palmier"],[27.3,5.15,-14.7,28.2,5.5,-13.9,"feuilles_palmier"],[22.7,5.65,-14.8,24.2,5.95,-13.8,"feuilles_palmier"],[21.8,5.15,-14.7,22.7,5.5,-13.9,"feuilles_palmier"],[24.5,5.65,-13.5,25.5,5.95,-12,"feuilles_palmier"],[24.6,5.15,-12,25.4,5.5,-11.1,"feuilles_palmier"],[24.5,5.65,-16.6,25.5,5.95,-15.1,"feuilles_palmier"],[24.6,5.15,-17.5,25.4,5.5,-16.6,"feuilles_palmier"],[24.55,5.25,-14.4,24.85,5.55,-14.1,"tronc"],[25.1,5.25,-14.15,25.4,5.55,-13.85,"tronc"],[-16.1,6.6,-2.8,-14.5,7.1,-1.2,"feuilles_palmier"],[-14.5,6.65,-2.5,-13,6.95,-1.5,"feuilles_palmier"],[-13,6.15,-2.4,-12.1,6.5,-1.6,"feuilles_palmier"],[-17.6,6.65,-2.5,-16.1,6.95,-1.5,"feuilles_palmier"],[-18.5,6.15,-2.4,-17.6,6.5,-1.6,"feuilles_palmier"],[-15.8,6.65,-1.2,-14.8,6.95,.3,"feuilles_palmier"],[-15.7,6.15,.3,-14.9,6.5,1.2,"feuilles_palmier"],[-15.8,6.65,-4.3,-14.8,6.95,-2.8,"feuilles_palmier"],[-15.7,6.15,-5.2,-14.9,6.5,-4.3,"feuilles_palmier"],[-15.75,6.25,-2.1,-15.45,6.55,-1.8,"tronc"],[-15.2,6.25,-1.85,-14.9,6.55,-1.55,"tronc"],[3.2,5.6,-25.5,4.8,6.1,-23.9,"feuilles_palmier"],[4.8,5.65,-25.2,6.3,5.95,-24.2,"feuilles_palmier"],[6.3,5.15,-25.1,7.2,5.5,-24.3,"feuilles_palmier"],[1.7,5.65,-25.2,3.2,5.95,-24.2,"feuilles_palmier"],[.8,5.15,-25.1,1.7,5.5,-24.3,"feuilles_palmier"],[3.5,5.65,-23.9,4.5,5.95,-22.4,"feuilles_palmier"],[3.6,5.15,-22.4,4.4,5.5,-21.5,"feuilles_palmier"],[3.5,5.65,-27,4.5,5.95,-25.5,"feuilles_palmier"],[3.6,5.15,-27.9,4.4,5.5,-27,"feuilles_palmier"],[3.55,5.25,-24.8,3.85,5.55,-24.5,"tronc"],[4.1,5.25,-24.55,4.4,5.55,-24.25,"tronc"],[37.2,5.1,-36.1,38.8,5.6,-34.5,"feuilles_palmier"],[38.8,5.15,-35.8,40.3,5.45,-34.8,"feuilles_palmier"],[40.3,4.65,-35.7,41.2,5,-34.9,"feuilles_palmier"],[35.7,5.15,-35.8,37.2,5.45,-34.8,"feuilles_palmier"],[34.8,4.65,-35.7,35.7,5,-34.9,"feuilles_palmier"],[37.5,5.15,-34.5,38.5,5.45,-33,"feuilles_palmier"],[37.6,4.65,-33,38.4,5,-32.1,"feuilles_palmier"],[37.5,5.15,-37.6,38.5,5.45,-36.1,"feuilles_palmier"],[37.6,4.65,-38.5,38.4,5,-37.6,"feuilles_palmier"],[37.55,4.75,-35.4,37.85,5.05,-35.1,"tronc"],[38.1,4.75,-35.15,38.4,5.05,-34.85,"tronc"],[-30.8,5.1,-37.1,-29.2,5.6,-35.5,"feuilles_palmier"],[-29.2,5.15,-36.8,-27.7,5.45,-35.8,"feuilles_palmier"],[-27.7,4.65,-36.7,-26.8,5,-35.9,"feuilles_palmier"],[-32.3,5.15,-36.8,-30.8,5.45,-35.8,"feuilles_palmier"],[-33.2,4.65,-36.7,-32.3,5,-35.9,"feuilles_palmier"],[-30.5,5.15,-35.5,-29.5,5.45,-34,"feuilles_palmier"],[-30.4,4.65,-34,-29.6,5,-33.1,"feuilles_palmier"],[-30.5,5.15,-38.6,-29.5,5.45,-37.1,"feuilles_palmier"],[-30.4,4.65,-39.5,-29.6,5,-38.6,"feuilles_palmier"],[-30.45,4.75,-36.4,-30.15,5.05,-36.1,"tronc"],[-29.9,4.75,-36.15,-29.6,5.05,-35.85,"tronc"],[15.7,8.3,7.7,20.3,8.7,12.3,"paille"],[19.8,6.4,11.8,20,8.3,12,"tronc"],[16,6.4,11.8,16.2,8.3,12,"tronc"],[19.8,6.4,8,20,8.3,8.2,"tronc"],[16,6.4,8,16.2,8.3,8.2,"tronc"],[10.5,6.1,20.2,12.1,6.6,21.8,"feuilles_palmier"],[9,6.15,20.5,10.5,6.45,21.5,"feuilles_palmier"],[8.1,5.65,20.6,9,6,21.4,"feuilles_palmier"],[12.1,6.15,20.5,13.6,6.45,21.5,"feuilles_palmier"],[13.6,5.65,20.6,14.5,6,21.4,"feuilles_palmier"],[10.8,6.15,18.7,11.8,6.45,20.2,"feuilles_palmier"],[10.9,5.65,17.8,11.7,6,18.7,"feuilles_palmier"],[10.8,6.15,21.8,11.8,6.45,23.3,"feuilles_palmier"],[10.9,5.65,23.3,11.7,6,24.2,"feuilles_palmier"],[11.45,5.75,20.8,11.75,6.05,21.1,"tronc"],[10.9,5.75,20.55,11.2,6.05,20.85,"tronc"],[-14.8,6.6,10.9,-13.2,7.1,12.5,"feuilles_palmier"],[-16.3,6.65,11.2,-14.8,6.95,12.2,"feuilles_palmier"],[-17.2,6.15,11.3,-16.3,6.5,12.1,"feuilles_palmier"],[-13.2,6.65,11.2,-11.7,6.95,12.2,"feuilles_palmier"],[-11.7,6.15,11.3,-10.8,6.5,12.1,"feuilles_palmier"],[-14.5,6.65,9.4,-13.5,6.95,10.9,"feuilles_palmier"],[-14.4,6.15,8.5,-13.6,6.5,9.4,"feuilles_palmier"],[-14.5,6.65,12.5,-13.5,6.95,14,"feuilles_palmier"],[-14.4,6.15,14,-13.6,6.5,14.9,"feuilles_palmier"],[-13.85,6.25,11.5,-13.55,6.55,11.8,"tronc"],[-14.4,6.25,11.25,-14.1,6.55,11.55,"tronc"],[25.5,5.1,8.2,27.1,5.6,9.8,"feuilles_palmier"],[24,5.15,8.5,25.5,5.45,9.5,"feuilles_palmier"],[23.1,4.65,8.6,24,5,9.4,"feuilles_palmier"],[27.1,5.15,8.5,28.6,5.45,9.5,"feuilles_palmier"],[28.6,4.65,8.6,29.5,5,9.4,"feuilles_palmier"],[25.8,5.15,6.7,26.8,5.45,8.2,"feuilles_palmier"],[25.9,4.65,5.8,26.7,5,6.7,"feuilles_palmier"],[25.8,5.15,9.8,26.8,5.45,11.3,"feuilles_palmier"],[25.9,4.65,11.3,26.7,5,12.2,"feuilles_palmier"],[26.45,4.75,8.8,26.75,5.05,9.1,"tronc"],[25.9,4.75,8.55,26.2,5.05,8.85,"tronc"],[-22.1,6.1,1.2,-20.5,6.6,2.8,"feuilles_palmier"],[-23.6,6.15,1.5,-22.1,6.45,2.5,"feuilles_palmier"],[-24.5,5.65,1.6,-23.6,6,2.4,"feuilles_palmier"],[-20.5,6.15,1.5,-19,6.45,2.5,"feuilles_palmier"],[-19,5.65,1.6,-18.1,6,2.4,"feuilles_palmier"],[-21.8,6.15,-.3,-20.8,6.45,1.2,"feuilles_palmier"],[-21.7,5.65,-1.2,-20.9,6,-.3,"feuilles_palmier"],[-21.8,6.15,2.8,-20.8,6.45,4.3,"feuilles_palmier"],[-21.7,5.65,4.3,-20.9,6,5.2,"feuilles_palmier"],[-21.15,5.75,1.8,-20.85,6.05,2.1,"tronc"],[-21.7,5.75,1.55,-21.4,6.05,1.85,"tronc"],[5.2,7.1,12.5,6.8,7.6,14.1,"feuilles_palmier"],[3.7,7.15,12.8,5.2,7.45,13.8,"feuilles_palmier"],[2.8,6.65,12.9,3.7,7,13.7,"feuilles_palmier"],[6.8,7.15,12.8,8.3,7.45,13.8,"feuilles_palmier"],[8.3,6.65,12.9,9.2,7,13.7,"feuilles_palmier"],[5.5,7.15,11,6.5,7.45,12.5,"feuilles_palmier"],[5.6,6.65,10.1,6.4,7,11,"feuilles_palmier"],[5.5,7.15,14.1,6.5,7.45,15.6,"feuilles_palmier"],[5.6,6.65,15.6,6.4,7,16.5,"feuilles_palmier"],[6.15,6.75,13.1,6.45,7.05,13.4,"tronc"],[5.6,6.75,12.85,5.9,7.05,13.15,"tronc"],[-25.8,5.6,13.5,-24.2,6.1,15.1,"feuilles_palmier"],[-27.3,5.65,13.8,-25.8,5.95,14.8,"feuilles_palmier"],[-28.2,5.15,13.9,-27.3,5.5,14.7,"feuilles_palmier"],[-24.2,5.65,13.8,-22.7,5.95,14.8,"feuilles_palmier"],[-22.7,5.15,13.9,-21.8,5.5,14.7,"feuilles_palmier"],[-25.5,5.65,12,-24.5,5.95,13.5,"feuilles_palmier"],[-25.4,5.15,11.1,-24.6,5.5,12,"feuilles_palmier"],[-25.5,5.65,15.1,-24.5,5.95,16.6,"feuilles_palmier"],[-25.4,5.15,16.6,-24.6,5.5,17.5,"feuilles_palmier"],[-24.85,5.25,14.1,-24.55,5.55,14.4,"tronc"],[-25.4,5.25,13.85,-25.1,5.55,14.15,"tronc"],[14.5,6.6,1.2,16.1,7.1,2.8,"feuilles_palmier"],[13,6.65,1.5,14.5,6.95,2.5,"feuilles_palmier"],[12.1,6.15,1.6,13,6.5,2.4,"feuilles_palmier"],[16.1,6.65,1.5,17.6,6.95,2.5,"feuilles_palmier"],[17.6,6.15,1.6,18.5,6.5,2.4,"feuilles_palmier"],[14.8,6.65,-.3,15.8,6.95,1.2,"feuilles_palmier"],[14.9,6.15,-1.2,15.7,6.5,-.3,"feuilles_palmier"],[14.8,6.65,2.8,15.8,6.95,4.3,"feuilles_palmier"],[14.9,6.15,4.3,15.7,6.5,5.2,"feuilles_palmier"],[15.45,6.25,1.8,15.75,6.55,2.1,"tronc"],[14.9,6.25,1.55,15.2,6.55,1.85,"tronc"],[-4.8,5.6,23.9,-3.2,6.1,25.5,"feuilles_palmier"],[-6.3,5.65,24.2,-4.8,5.95,25.2,"feuilles_palmier"],[-7.2,5.15,24.3,-6.3,5.5,25.1,"feuilles_palmier"],[-3.2,5.65,24.2,-1.7,5.95,25.2,"feuilles_palmier"],[-1.7,5.15,24.3,-.8,5.5,25.1,"feuilles_palmier"],[-4.5,5.65,22.4,-3.5,5.95,23.9,"feuilles_palmier"],[-4.4,5.15,21.5,-3.6,5.5,22.4,"feuilles_palmier"],[-4.5,5.65,25.5,-3.5,5.95,27,"feuilles_palmier"],[-4.4,5.15,27,-3.6,5.5,27.9,"feuilles_palmier"],[-3.85,5.25,24.5,-3.55,5.55,24.8,"tronc"],[-4.4,5.25,24.25,-4.1,5.55,24.55,"tronc"],[-38.8,5.1,34.5,-37.2,5.6,36.1,"feuilles_palmier"],[-40.3,5.15,34.8,-38.8,5.45,35.8,"feuilles_palmier"],[-41.2,4.65,34.9,-40.3,5,35.7,"feuilles_palmier"],[-37.2,5.15,34.8,-35.7,5.45,35.8,"feuilles_palmier"],[-35.7,4.65,34.9,-34.8,5,35.7,"feuilles_palmier"],[-38.5,5.15,33,-37.5,5.45,34.5,"feuilles_palmier"],[-38.4,4.65,32.1,-37.6,5,33,"feuilles_palmier"],[-38.5,5.15,36.1,-37.5,5.45,37.6,"feuilles_palmier"],[-38.4,4.65,37.6,-37.6,5,38.5,"feuilles_palmier"],[-37.85,4.75,35.1,-37.55,5.05,35.4,"tronc"],[-38.4,4.75,34.85,-38.1,5.05,35.15,"tronc"],[29.2,5.1,35.5,30.8,5.6,37.1,"feuilles_palmier"],[27.7,5.15,35.8,29.2,5.45,36.8,"feuilles_palmier"],[26.8,4.65,35.9,27.7,5,36.7,"feuilles_palmier"],[30.8,5.15,35.8,32.3,5.45,36.8,"feuilles_palmier"],[32.3,4.65,35.9,33.2,5,36.7,"feuilles_palmier"],[29.5,5.15,34,30.5,5.45,35.5,"feuilles_palmier"],[29.6,4.65,33.1,30.4,5,34,"feuilles_palmier"],[29.5,5.15,37.1,30.5,5.45,38.6,"feuilles_palmier"],[29.6,4.65,38.6,30.4,5,39.5,"feuilles_palmier"],[30.15,4.75,36.1,30.45,5.05,36.4,"tronc"],[29.6,4.75,35.85,29.9,5.05,36.15,"tronc"]],apparitions:[{x:-16,y:.8,z:-22,angle:180,equipe:0},{x:-8,y:1.3,z:-22,angle:180,equipe:0},{x:0,y:.8,z:-24,angle:180,equipe:0},{x:8,y:.8,z:-22,angle:180,equipe:0},{x:16,y:.8,z:-22,angle:180,equipe:0},{x:0,y:7.5,z:-4,angle:180,equipe:null},{x:37,y:1.8,z:-11.6,angle:107,equipe:null},{x:-20,y:1.3,z:-6,angle:-107,equipe:null},{x:14,y:1.8,z:-5,angle:110,equipe:null},{x:-34,y:-.7,z:-24,angle:-125,equipe:null},{x:30,y:-.7,z:-24,angle:129,equipe:null},{x:0,y:.3,z:-33,angle:180,equipe:null},{x:-26,y:.3,z:8,angle:-73,equipe:null},{x:16,y:.8,z:22,angle:0,equipe:1},{x:8,y:1.3,z:22,angle:0,equipe:1},{x:0,y:.8,z:24,angle:0,equipe:1},{x:-8,y:.8,z:22,angle:0,equipe:1},{x:-16,y:.8,z:22,angle:0,equipe:1},{x:0,y:7.5,z:4,angle:0,equipe:null},{x:-37,y:1.8,z:11.6,angle:-73,equipe:null},{x:20,y:1.3,z:6,angle:73,equipe:null},{x:-14,y:1.8,z:5,angle:-70,equipe:null},{x:34,y:-.7,z:24,angle:55,equipe:null},{x:-30,y:-.7,z:24,angle:-51,equipe:null},{x:0,y:.3,z:33,angle:0,equipe:null},{x:26,y:.3,z:-8,angle:107,equipe:null}]};function Za(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let i=t;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}Math.random=Za(20261003);var _i={tete:[0,3.5],podium:[3.5,8],garde:[8,15],armes:[15,21],compte:[21,24.5],sautA:[24.5,28],sautB:[28,31],grappin:[31,34],dos:[34,37],dingA:[37,38.6],dingB:[38.6,40],fun:[40,43.5],logo:[43.5,50]},f0=[8,8.94,9.74,10.4,10.81,11.6,12.005,12.5,12.81],Xa=1920,Ya=1080,na=60,Dr=(e,t=0,i=1)=>Math.max(t,Math.min(i,e)),At=(e,t,i)=>e+(t-e)*i,st=(e,t,i)=>Dr((e-t)/(i-t)),pr=e=>1-(1-e)**3,q3=e=>1-(1-e)**5,ni=e=>e*e*(3-2*e);var y0=e=>{let t=2.7225280000000005;return 1+(t+1)*(e-1)**3+t*(e-1)**2},Xi=1.85/32,Yi=new x,sa=new x,Ii=(e,t)=>Math.atan2(-e,-t);Bu(ku);var X3=document.getElementById("vue3d"),si=new Cu({canvas:X3,antialias:!0,preserveDrawingBuffer:!0});si.setSize(Xa,Ya,!1);si.setPixelRatio(1);si.shadowMap.enabled=!0;si.shadowMap.type=Na;function $s(e,t){let i=document.createElement("canvas");i.width=i.height=128;let r=i.getContext("2d"),a=r.createRadialGradient(64,64,0,64,64,64);a.addColorStop(0,e),a.addColorStop(1,t),r.fillStyle=a,r.fillRect(0,0,128,128);let n=new Sr(i);return n.colorSpace=Nt,n}var Y3=$s("rgba(255,255,255,1)","rgba(255,255,255,0)"),b0=$s("rgba(255,236,170,1)","rgba(255,140,40,0)");function Z3(){let e=document.createElement("canvas");e.width=e.height=128;let t=e.getContext("2d");t.fillStyle="#ffd84a",t.beginPath();for(let r=0;r<10;r++){let a=r%2?22:62,n=r/10*Math.PI*2-Math.PI/2;t.lineTo(64+Math.cos(n)*a,64+Math.sin(n)*a)}t.closePath(),t.fill();let i=new Sr(e);return i.colorSpace=Nt,i}var Ku=Z3(),J3="8a3b3b",eo={peau:"#f1c7a0",yeux:"#2d6cdf",cheveux:"#2b1d0e",coupe:"courts",haut:"sweat",hautC1:"#3d6bff",hautC2:"#ffd21f",motif:"eclair",bas:"jogging",basC:"#2a2a2a",chaussures:"baskets",chaussuresC:"#ffffff",chapeau:"casquette_envers",chapeauC:"#ff8a1f",accDos:"cape",accC:"#ff3b3b"};function K3(e){let t=d0(e).match(/.{6}/g),i=e.peau.slice(1);for(let r of[42,45,51,52])t[r]=i;for(let r of[41,46,50,51,52,53])t[r]=J3;return t.join("")}var S0=K3(eo),to=(e={})=>lr({...eo,visage:S0,...e}),$3=[{haut:"tshirt",hautC1:"#2fb5ff",motif:"uni",bas:"jean",basC:"#2b3a67",chapeau:"aucun",accDos:"aucun",categorie:"HAUTS"},{haut:"sweat",hautC1:"#ff8a1f",motif:"uni",bas:"short",basC:"#2a2a2a",chapeau:"aucun",accDos:"aucun",categorie:"BAS"},{haut:"maillot",hautC1:"#22c55e",hautC2:"#ffffff",motif:"numero",bas:"short",basC:"#ffffff",chapeau:"casquette",chapeauC:"#ff3b3b",accDos:"aucun",categorie:"CHAPEAUX"},{haut:"veste",hautC1:"#8b5cf6",motif:"uni",bas:"cargo",basC:"#6b7280",chapeau:"couronne",chapeauC:"#ffd21f",accDos:"aucun",categorie:"CHAPEAUX"},{haut:"chemise",hautC1:"#ec4899",motif:"uni",bas:"jean",basC:"#2b3a67",chapeau:"cowboy",chapeauC:"#7b4a25",accVisage:"lunettes_soleil",accDos:"aucun",categorie:"ACCESSOIRES"},{haut:"pull",hautC1:"#14b8a6",motif:"coeur",hautC2:"#ffffff",bas:"jogging",basC:"#2a2a2a",chapeau:"oreilles_chat",chapeauC:"#ff8a1f",accCou:"echarpe",accC:"#ff3b3b",accDos:"aucun",categorie:"ACCESSOIRES"},{haut:"tshirt",hautC1:"#ffd21f",motif:"eclair",hautC2:"#2a2a2a",bas:"cargo",basC:"#7b4a25",chapeau:"viking",chapeauC:"#c9ced6",accDos:"ailes",accC:"#ffffff",categorie:"CAPES"},{haut:"debardeur",hautC1:"#ff3b3b",motif:"uni",bas:"short",basC:"#3d6bff",chapeau:"astronaute",chapeauC:"#ffffff",accDos:"jetpack",accC:"#6b7280",categorie:"ACCESSOIRES"},{categorie:"CAPES"}];function Ja(e,t=null){let i=new Xs({style:e,equipe:t});return i.groupe.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!1)}),i}function Ur(e){e.arme&&(e.arme.visible=!1)}function cr(e,t,{regard:i=0}={}){e.temps=t,e.viseeLisse=0,e.anim=null,e.choc=0,e.animer(0,{vitesse:0,enLAir:!1,pitch:0});let r=e.parties;r.brasD.pivot.rotation.set(Math.sin(t*1.3)*.03,0,.06),r.brasG.pivot.rotation.set(-Math.sin(t*1.3)*.03,0,-.06),r.jambeD.pivot.rotation.set(0,0,0),r.jambeG.pivot.rotation.set(0,0,0),r.corps.pivot.position.y=18*Xi+Math.sin(t*1.6)*.006,r.tete.pivot.rotation.set(Math.sin(t*.7)*.03,i,0)}function oa(e,t,i,{pitch:r=0,enLAir:a=!1,arme:n=!0}={}){if(e.temps=t*(4+8*Math.min(1,i/7)),e.viseeLisse=0,e.anim=null,e.choc=0,e.animer(0,{vitesse:i,enLAir:a,pitch:r}),!n){let s=Math.min(1,i/7),o=Math.sin(e.temps)*.9*s;e.parties.brasD.pivot.rotation.set(-o,0,.08),e.parties.brasG.pivot.rotation.set(o,0,-.08)}}function M0(e,t,i,r){let a=new Zs(e,t,i),n=[],s=Math.ceil(r*na)+2;for(let o=0;o<s;o++)n.push(a.morceaux.map(l=>[l.mesh.position.clone(),l.mesh.quaternion.clone()])),a.maj(1/na);return a.groupe.visible=!1,{groupe:a.groupe,centre:o=>n[Math.min(n.length-1,Math.max(0,Math.floor(o*na)))][a.morceaux.findIndex(l=>l.nom==="corps")][0],montrer(o){if(a.groupe.visible=o>=0,o<0)return;let l=o*na,h=Math.min(n.length-2,Math.floor(l)),c=Dr(l-h);a.morceaux.forEach((p,u)=>{p.mesh.position.lerpVectors(n[h][u][0],n[h+1][u][0],c),p.mesh.quaternion.slerpQuaternions(n[h][u][1],n[h+1][u][1],c)})}}}function E0(e){let t=document.createElement("canvas");t.width=512,t.height=128;let i=t.getContext("2d");i.font='700 64px "Space Mono", monospace';let r=Math.min(500,i.measureText(e).width+56);i.fillStyle="rgba(10, 15, 29, 0.88)",i.beginPath(),i.roundRect(256-r/2,14,r,100,18),i.fill(),i.strokeStyle="#ff8a1f",i.lineWidth=6,i.stroke(),i.fillStyle="#eef4ff",i.textAlign="center",i.textBaseline="middle",i.fillText(e,256,66);let a=new Sr(t);a.colorSpace=Nt;let n=new ki(new Ai({map:a,depthTest:!1,fog:!1}));return n.renderOrder=20,n.userData.ratio=.25,n}function $u(e,t,i,r){let a=Za(r),n=new Gs(new wt(1,1,1),new It({color:16777215}),t),s=[];for(let u=0;u<t;u++){let f=a()*Math.PI*2,_=.3+a()*.9,y=4+a()*7;s.push({vx:Math.cos(f)*y*(1-_*.5),vy:y*_+2,vz:Math.sin(f)*y*(1-_*.5),taille:.08+a()*.16,rot:a()*10,vr:(a()-.5)*16}),n.setColorAt(u,new Oe(i[u%i.length]))}n.frustumCulled=!1,n.visible=!1,e.add(n);let o=new Ke,l=new ti,h=new mi,c=new x,p=new x;return{montrer(u,f,_=1.6){if(n.visible=f>=0&&f<_,!n.visible)return;let y=1-st(f,_*.6,_);s.forEach((m,d)=>{c.set(u.x+m.vx*f,Math.max(u.y*0+.05,u.y+m.vy*f-11*f*f),u.z+m.vz*f),h.set(m.rot+m.vr*f,m.rot*.7+m.vr*f*.6,0),l.setFromEuler(h),p.setScalar(m.taille*y),n.setMatrixAt(d,o.compose(c,l,p))}),n.instanceMatrix.needsUpdate=!0}}}var T0=(()=>{let e=new Hs;e.fog=new Rn(6971344,18,70);let t=new Ri(150,32,20),i=new Oe("#081438"),r=new Oe("#2a5bd7"),a=new Oe("#ff9d5c"),n=[],s=t.attributes.position;for(let be=0;be<s.count;be++){let k=s.getY(be)/150,$=k>.15?r.clone().lerp(i,Math.min(1,(k-.15)/.7)):a.clone().lerp(r,Math.max(0,(k+.25)/.4));n.push($.r,$.g,$.b)}t.setAttribute("color",new He(n,3)),e.add(new ke(t,new pi({vertexColors:!0,side:Gt,fog:!1,depthWrite:!1})));let o=new ki(new Ai({map:$s("rgba(255,214,150,0.9)","rgba(255,140,80,0)"),blending:zi,depthWrite:!1,fog:!1}));o.scale.set(26,26,1),o.position.set(4,4,-40),e.add(o),e.add(new Nn(13624319,2760522,1.25));let l=new Er(16773340,2.3);l.position.set(-3,5,6),l.castShadow=!0,l.shadow.mapSize.set(1024,1024),Object.assign(l.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:1,far:20}),e.add(l);let h=new Er(3793151,1.6);h.position.set(4,3,-5),e.add(h);let c=new xu(11824127,6,8,2);c.position.set(-2.5,1.2,1.5),e.add(c);let p=new Re,u=new ke(new Mr(1.5,1.65,.36,48),new e0({color:1581373,roughness:.6,metalness:.3}));u.position.y=-.18,u.receiveShadow=!0;let f=new ke(new Mr(1.42,1.42,.02,48),new e0({color:2832486,roughness:.4,metalness:.2}));f.receiveShadow=!0;let _=(be,k,$,ne)=>{let Le=new ke(new In(be,ne,10,80),new pi({color:k}));return Le.rotation.x=Math.PI/2,Le.position.y=$,Le},y=_(1.52,3793151,.02,.035),m=new ke(new or(5.5,5.5),new pi({map:$s("rgba(57,224,255,0.55)","rgba(57,224,255,0)"),transparent:!0,blending:zi,depthWrite:!1}));m.rotation.x=-Math.PI/2,m.position.y=-.36,p.add(u,f,y,_(1.66,16747039,-.32,.025),m),e.add(p);let d=new ke(new Cn(80,48),new It({color:1709632}));d.rotation.x=-Math.PI/2,d.position.y=-2.5,e.add(d);let w=[4033535,16747039,9133302,3793151,16765471,15485081,2278750],A=70,v=new Gs(new wt(1,1,1),new It({color:16777215}),A),T=Za(7),C=[];for(let be=0;be<A;be++){let k,$;do k=-26+T()*52,$=-40+T()*46;while(Math.hypot(k,$)<5||$>-2.5);C.push({x:k,z:$,y:-1.5+T()*10.5,taille:.25+T()*1.35,rx:T()*6,ry:T()*6,vr:-.4+T()*.8,phase:T()*6,amp:.1+T()*.4}),v.setColorAt(be,new Oe(w[be%w.length]).multiplyScalar(.65+T()*.45))}e.add(v);let M=90,g=new Float32Array(M*3),b=[];for(let be=0;be<M;be++){let k=T()*Math.PI*2;b.push({a:k,rayon:.8+T()*1.8,y0:T()*3.8,v:.15+T()*.35})}let I=new yt;I.setAttribute("position",new ci(g,3));let P=new Oc(I,new Kl({map:Y3,size:.12,transparent:!0,blending:zi,depthWrite:!1,color:12580095}));e.add(P);let L=$3.map(({categorie:be,...k})=>{let $=Ja(to(k));return Ur($),$.groupe.visible=!1,e.add($.groupe),$}),V=L[L.length-1],D=new Re,H=new ke(new wt(.035,.035,.26),new It({color:16747039}));H.position.z=.13;let J=new ke(new wt(.02,.02,.04),new It({color:2825492}));J.position.z=-.01;let j=new ke(new wt(.037,.037,.04),new It({color:16743080}));j.position.z=.27,D.add(H,J,j),D.visible=!1,e.add(D);let ue=new Xt(30,Xa/Ya,.05,300),Z=new Ke,K=new ti,te=new mi,Ve=new x,Ce=new x;function ut(be){y.material.color.setHSL(.52+Math.sin(be*.8)*.03,1,.55+Math.sin(be*2)*.08),p.rotation.y=be*.15,C.forEach((k,$)=>{te.set(k.rx+be*k.vr,k.ry+be*k.vr*.7,0),K.setFromEuler(te),Ve.set(k.x,k.y+Math.sin(be*.6+k.phase)*k.amp,k.z),Ce.setScalar(k.taille),v.setMatrixAt($,Z.compose(Ve,K,Ce))}),v.instanceMatrix.needsUpdate=!0,b.forEach((k,$)=>{let ne=(k.y0+k.v*be)%3.8-.3;g[$*3]=Math.cos(k.a+be*.2)*k.rayon,g[$*3+1]=ne,g[$*3+2]=Math.sin(k.a+be*.2)*k.rayon}),I.attributes.position.needsUpdate=!0}return{scene:e,camera:ue,tenues:L,hero:V,crayon:D,decor:ut,soleil:o}})(),Qs=(()=>{let e=S0.match(/.{6}/g),t=eo.peau.slice(1),i=[];for(let r=0;r<3;r++)for(let a=0;a<8;a++)e[r*8+a]!==t&&i.push(r*8+a);for(let r of[3,4])for(let a of[1,2,5,6])e[r*8+a]!==t&&i.push(r*8+a);for(let r of[41,50,51,52,53,46])i.push(r);for(let r=0;r<64;r++)!i.includes(r)&&e[r]!==t&&i.push(r);return i})(),ta=Qs.map((e,t,i)=>.35+2.6*(1-(1-t/(i.length-1))**1.35)),Q3=.12,Yu="";function Qu(e){let t=S0.match(/.{6}/g),i=eo.peau.slice(1),r=Array(64).fill(i);Qs.forEach((l,h)=>{let c=ta[h];e>=c&&(r[l]=e<c+Q3?"ffffff":t[l])});let a=r.join("");if(a===Yu)return;Yu=a;let n=T0.hero,s=zn(to({visage:a})),o=n.canvas.getContext("2d");o.clearRect(0,0,64,64),o.drawImage(s,0,0),n.texture.needsUpdate=!0}function m0(){Qu(99)}function Zu(e,t){let i=e%8,r=Math.floor(e/8);return t.set((3.5-i)*Xi,(3.5-r)*Xi,-4*Xi-.002),T0.hero.parties.tete.mesh.localToWorld(t)}function Js(e,t){let i=T0;i.decor(e),i.soleil.visible=t!=="logo",i.tenues.forEach(n=>{n.groupe.visible=!1}),i.crayon.visible=!1;let r=i.camera,a=i.hero;if(t==="tete"){Qu(e),a=i.hero,a.groupe.visible=!0,a.groupe.position.set(0,0,0),a.groupe.rotation.y=Math.PI,cr(a,e),a.parties.tete.pivot.rotation.set(0,0,0);let n=At(1.5,1.3,ni(st(e,0,3.5)));r.fov=30,r.position.set(0,28*Xi+.01,n),r.lookAt(0,28*Xi+.01,0);let s=ta.findIndex(o=>o>e);if(s<0&&(s=ta.length),s>0&&e<3.15){let o=Math.max(0,s-1),l=Math.min(ta.length-1,s),h=s>=ta.length?1:ni(st(e,ta[o],ta[l]));a.groupe.updateMatrixWorld(!0);let c=Zu(Qs[o],Yi).clone(),p=Zu(Qs[l],sa);i.crayon.position.lerpVectors(c,p,h),i.crayon.position.z+=.035+Math.sin(h*Math.PI)*.04,i.crayon.rotation.set(-.6,.35,0),i.crayon.visible=!0}else e<.35&&(i.crayon.position.set(.12,28*Xi-.05,4*Xi+.12),i.crayon.rotation.set(-.6,.35,0),i.crayon.visible=!0)}else if(t==="podium"){m0(),a.groupe.visible=!0,a.groupe.position.set(0,0,0),a.groupe.rotation.y=Math.PI-.25*ni(st(e,3.5,6)),cr(a,e);let n=st(e,5,7.6);if(n>0&&n<1){let p=Math.sin(Math.PI*Dr(n*1.25));a.parties.brasG.pivot.rotation.set(0,0,-(.06+p*2.6)),a.parties.brasG.pivot.rotation.x=Math.sin(e*14)*.25*p}let s=st(e,3.5,7.4),o=q3(s)*ni(Math.min(1,s/.14)),l=At(1.3,7.4,o),h=At(28*Xi+.01,1,o),c=At(0,-1.15,o);r.fov=30,r.position.set(c,At(28*Xi+.01,1.55,o),l),r.lookAt(c,h,0)}else if(t==="garde"){m0();let n=0;for(let h=0;h<f0.length;h++)e>=f0[h]&&(n=h);a=i.tenues[n],a.groupe.visible=!0,a.groupe.position.set(0,0,0);let s=e-f0[n],o=n>0?1+.07*Math.exp(-s*14)*Math.cos(s*30):1;a.groupe.scale.setScalar(o),a.groupe.rotation.y=Math.PI-.35+Math.sin(e*.9)*.18,cr(a,e),r.fov=30;let l=Math.sin((e-8)*.25)*.12;r.position.set(Math.sin(l)*7.2+0,1.45,Math.cos(l)*7.2),r.lookAt(0,.98,0)}else if(t==="logo"){m0(),a.groupe.visible=!0,a.groupe.scale.setScalar(1);let n=pr(st(e,43.9,45.2));a.groupe.position.set(At(3.2,0,n),0,0),a.groupe.rotation.y=Math.PI+.3*n-(1-n)*1.2,n<1?oa(a,e,4.5*(1-n),{arme:!1}):cr(a,e);let s=st(e,45.6,48.2);if(s>0&&s<1){let l=Math.sin(Math.PI*Dr(s*1.2));a.parties.brasG.pivot.rotation.set(Math.sin(e*14)*.25*l,0,-(.06+l*2.6))}r.fov=30;let o=At(8.4,7.8,ni(st(e,43.5,50)));r.position.set(-2.75,1.5,o),r.lookAt(-2.75,1.1,0)}r.updateProjectionMatrix(),si.render(i.scene,r)}var e_=[[278,690],[729,690],[1180,690],[1631,690]],t_=(()=>{let e=new Hs;e.background=new Oe(725284),e.add(new Nn(15398143,4210784,2.2));let t=new Er(16773590,3.2);t.position.set(1,3,4),e.add(t);let i=new Er(8382719,2.2);i.position.set(-3,2,-3),e.add(i);let r=new Er(16747039,1.4);r.position.set(4,-1,-2),e.add(r);let a=new Xt(30,Xa/Ya,.05,50);a.position.set(0,0,0),a.lookAt(0,0,-1);let n=3,s=Math.tan(xc.degToRad(15)),o=(A,v)=>new x((A/Xa*2-1)*s*(Xa/Ya)*n,(1-v/Ya*2)*s*n,-n),h=[["fusil",.9],["revolver",1.7],["poele",1.15],["grappin",1.4]].map(([A,v],T)=>{let C=new Re,M=Bn(A,!1);return new ui().setFromObject(M).getCenter(Yi),M.position.sub(Yi),C.add(M),C.position.copy(o(...e_[T])),C.userData.echelle=v,e.add(C),C}),c=40,p=Za(11),u=new Gs(new wt(1,1,1),new It({color:16777215}),c),f=[];for(let A=0;A<c;A++)f.push({x:-14+p()*28,y:-6+p()*12,z:-14-p()*16,t:.3+p()*.8,rot:p()*6,v:-.3+p()*.6}),u.setColorAt(A,new Oe([4033535,16747039,8382719,9133302][A%4]).multiplyScalar(.35));e.add(u);let _=new Ke,y=new ti,m=new mi,d=new x,w=new x;return{scene:e,camera:a,armes:h,rendre(A){h.forEach((v,T)=>{let C=15.35+T*.18,M=st(A,C,C+.55),g=v.userData.echelle*(M<=0?0:y0(M));v.scale.setScalar(Math.max(1e-4,g));let b=(1-pr(M))*Math.PI*2;v.rotation.set(.12+Math.sin(A*.8+T)*.06,Math.PI/2+b+Math.sin((A-C)*.9+T)*.45,0)}),f.forEach((v,T)=>{m.set(v.rot+A*v.v,v.rot+A*v.v*.6,0),y.setFromEuler(m),w.set(v.x,v.y+Math.sin(A*.5+T)*.3,v.z),d.setScalar(v.t),u.setMatrixAt(T,_.compose(w,y,d))}),u.instanceMatrix.needsUpdate=!0,si.render(e,a)}}})();function io(e){let t=new Hs;Gu(t,e,{ombres:!0});let i=new Xt(55,Xa/Ya,.05,900);return{scene:t,camera:i,boites:e.boites.filter(r=>r[6]!=="invisible").map(r=>r.slice(0,6)),donnees:e}}var ro=io(ju),Ka=io(qu),la=io(Xu),kt=io(Wu);function ao(e){let t=Ja(to());return e.scene.add(t.groupe),t}var w0=ao(ro),A0=ao(Ka),ep=ao(la),no=ao(kt);[w0,A0,ep,no].forEach(e=>{let t=zn(to());e.canvas.getContext("2d").drawImage(t,0,0),e.texture.needsUpdate=!0});var Pr=E0("CH\xC2TEAU");ro.scene.add(Pr);var ra=E0("VILLE");Ka.scene.add(ra);function i_(e){let t=ro;w0.groupe.visible=!1,Pr.visible=!1;let i=.6+(e-21)*.09,r=52;t.camera.fov=55,t.camera.position.set(Math.sin(i)*r,26,Math.cos(i)*r),t.camera.lookAt(0,3,0),t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera)}var hr=(()=>{let e=new x(13.5,0,-6.2),t=new x(13.5,.2,-11),i=new x(-13.5,.2,11);return{depart:e,tramp:t,arrivee:i}})();function r_(e,t){let{depart:i,tramp:r,arrivee:a}=hr;if(e<25.2){let s=st(e,24.5,25.2);return t.lerpVectors(i,r,s).setY(0)}let n=st(e,25.2,28.4);return t.lerpVectors(r,a,n),t.y=At(r.y,a.y,n)+68*n*(1-n),t}function a_(e){let t=ro,i=w0;i.groupe.visible=!0;let r=r_(e,Yi);i.groupe.position.copy(r);let a=sa.subVectors(hr.arrivee,hr.tramp),n=Ii(hr.tramp.x-hr.depart.x,hr.tramp.z-hr.depart.z),o=Ii(a.x,a.z)-n;for(;o>Math.PI;)o-=2*Math.PI;for(;o<-Math.PI;)o+=2*Math.PI;if(i.groupe.rotation.set(0,n+o*ni(st(e,25.15,25.6)),0),e<25.2)oa(i,e,8,{arme:!1});else{oa(i,e,7,{enLAir:!0,arme:!1});let w=pr(st(e,25.25,25.8));i.parties.brasD.pivot.rotation.set(At(0,2.9,w),0,.1),i.parties.brasG.pivot.rotation.set(At(0,2.9,w),0,-.1),i.groupe.rotation.x=0,i.parties.corps.pivot.rotation.x=0}Ur(i);let l=sa.subVectors(hr.tramp,hr.arrivee).setY(0).normalize(),h=new x(-l.z,0,l.x),c=new x(12.6,1.1,-15.2),p=new x(r.x,Math.max(1,r.y+.9),r.z),u=r.clone().addScaledVector(l,6).addScaledVector(h,2.5).add(new x(0,2.8,0)),f=new x(r.x,r.y+.8,r.z).addScaledVector(l,-3),_=ni(st(e,25.45,26.2));t.camera.fov=55,t.camera.position.lerpVectors(c,u,_),t.camera.lookAt(Yi.lerpVectors(p,f,_)),t.camera.updateProjectionMatrix(),Pr.visible=e>26;let y=st(e,26,26.4);Pr.position.set(-3.5,17.5,-2.5);let d=t.camera.position.distanceTo(Pr.position)*.42*y0(y);Pr.scale.set(d,d*Pr.userData.ratio,1),si.render(t.scene,t.camera)}var Ks={a:new x(30,16,-26),b:new x(-6,6.5,8)};function n_(e){let t=Ka,i=A0;i.groupe.visible=!0;let r=pr(st(e,28,31)),a=Yi.lerpVectors(Ks.a,Ks.b,r);a.y+=Math.sin(r*Math.PI)*2.5,i.groupe.position.copy(a);let n=sa.subVectors(Ks.b,Ks.a);i.groupe.rotation.set(0,Ii(n.x,n.z),0),oa(i,e,7,{enLAir:!0,arme:!1}),i.parties.brasD.pivot.rotation.set(2.9,0,.1),i.parties.brasG.pivot.rotation.set(2.9,0,-.1),Ur(i);let s=n.clone().setY(0).normalize().negate(),o=new x(-s.z,0,s.x);t.camera.fov=55,t.camera.position.copy(a).addScaledVector(s,8).addScaledVector(o,-4).add(new x(0,3.5,0)),t.camera.lookAt(a.x,a.y+.6,a.z),t.camera.updateProjectionMatrix(),ra.visible=e>28.2,ra.position.set(12,18,-8);let l=st(e,28.2,28.6),c=t.camera.position.distanceTo(ra.position)*.42*y0(l);ra.scale.set(c,c*ra.userData.ratio,1),si.render(t.scene,t.camera)}var Ju={depart:new x(-6.5,0,12),cible:new x(-6.5,6.85,19.95),toit:new x(-6.5,6.15,21.3)},Ir=new ke(new Mr(.018,.018,1,6),new It({color:3877402}));Ir.visible=!1;Ka.scene.add(Ir);var Tr=(()=>{let e=new Re,t=new It({color:10134453});e.add(new ke(new wt(.05,.05,.22),t));for(let i=0;i<3;i++){let r=new ke(new wt(.03,.03,.14),t),a=i/3*Math.PI*2;r.position.set(Math.cos(a)*.06,Math.sin(a)*.06,-.12),r.rotation.set(Math.sin(a)*.6,-Math.cos(a)*.6,0),e.add(r)}return e.visible=!1,Ka.scene.add(e),e})();function s_(e,t){let i=sa.subVectors(t,e),r=i.length();Ir.position.copy(e).addScaledVector(i,.5),Ir.scale.set(1,r,1),Ir.quaternion.setFromUnitVectors(new x(0,1,0),i.normalize()),Ir.visible=!0}function o_(e){let t=Ka,i=A0;i.groupe.visible=!0,i.groupe.rotation.set(0,0,0),i.prendreArme("grappin","gadget"),i.arme.visible=!0;let{depart:r,cible:a}=Ju,n=st(e,31.25,31.6),s=ni(st(e,31.7,32.95)),o=a.clone().add(new x(0,-2,-.45)),l=Yi.lerpVectors(r,o,s);if(e>33){let f=pr(st(e,33,33.55));l.copy(o).lerp(Ju.toit,f),l.y+=Math.sin(f*Math.PI)*.6}i.groupe.position.copy(l),i.groupe.rotation.y=Ii(a.x-r.x,a.z-r.z);let h=Math.atan2(a.y-l.y,Math.hypot(a.x-l.x,a.z-l.z));oa(i,e,e<33?0:3,{pitch:e<33?h:0,enLAir:s>0&&e<33.3});let c=i.boutDuCanon(new x);Tr.visible=n>0&&e<33.1,i.arme.userData.crochet&&(i.arme.userData.crochet.visible=!Tr.visible),Tr.visible?(Tr.position.lerpVectors(c,a,pr(n)),Tr.lookAt(c),Tr.rotateY(Math.PI),s_(c,Tr.position)):Ir.visible=!1,t.camera.fov=50;let p=ni(st(e,31,34)),u=sa.lerpVectors(r,a,.5);t.camera.position.set(u.x+12.5,At(2.2,6.5,p),u.z-1.5+p*1.5),t.camera.lookAt(At(u.x,l.x,.5),At(u.y,l.y+1,.55),At(u.z,l.z,.55)),t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera),Ir.visible=!1,Tr.visible=!1}var Pi=Ja(lr({peau:"#c68642",cheveux:"#121212",coupe:"herisses",haut:"tshirt",bas:"cargo",basC:"#6b7280"}),1);la.scene.add(Pi.groupe);var Lt={rouge:new x(4,.8,25.6),regard:new x(0,0,1)},_0=null,l_=[0,1,2,3].map(()=>{let e=new ki(new Ai({map:Ku,transparent:!0,depthWrite:!1}));return e.visible=!1,la.scene.add(e),e}),h_=$u(la.scene,26,["#ffd84a","#ffffff","#ff8a1f","#7fe8ff"],21);function c_(){Pi.groupe.position.copy(Lt.rouge),Pi.groupe.rotation.set(0,Ii(Lt.regard.x,Lt.regard.z),0),cr(Pi,35.9),Ur(Pi),_0=M0(la.scene,Pi,{impulsion:new x(0,0,1),boites:la.boites,force:.42,duree:3},1.4)}function u_(e){let t=la,i=ep;i.groupe.visible=!0,i.prendreArme("couteau","melee"),i.arme.visible=!0;let r=Lt.rouge.clone().addScaledVector(Lt.regard,-1.15),a=r.clone().add(new x(-2.8,0,.15)),n=ni(st(e,34,35.2));if(i.groupe.position.lerpVectors(a,r,n),i.groupe.position.y=Lt.rouge.y,i.groupe.rotation.set(0,Ii(Lt.rouge.x-i.groupe.position.x,Lt.rouge.z-i.groupe.position.z),0),e<35.2)oa(i,e*.6,2.2,{});else{i.temps=e,i.viseeLisse=1,i.choc=0;let h=st(e,35.3,36.05);i.anim=h>0&&h<1?{type:"coup",t:h*.75,duree:.75,special:!0}:null,i.animer(0,{vitesse:0,enLAir:!1,pitch:-.2,visee:!0})}let s=e-35.9;Pi.groupe.visible=s<0,s<0&&(Pi.groupe.position.copy(Lt.rouge),Pi.groupe.rotation.set(0,Ii(Lt.regard.x,Lt.regard.z),0),cr(Pi,e),Ur(Pi)),_0.montrer(s);let o=s>=0?_0.centre(s):Lt.rouge;l_.forEach((h,c)=>{let p=e-35.85-c*.06;if(h.visible=p>0&&p<1,!h.visible)return;let u=c*1.7+p*3;h.position.set(o.x+Math.cos(u)*.6,o.y+1.1+p*.8,o.z+Math.sin(u)*.6);let f=.35*Math.sin(Math.PI*Dr(p/1));h.scale.set(f,f,1)}),h_.montrer(new x(Lt.rouge.x,Lt.rouge.y+1.2,Lt.rouge.z),e-35.88,1.2);let l=ni(st(e,34,37));t.camera.fov=45,t.camera.position.set(Lt.rouge.x+At(4.2,3.6,l),Lt.rouge.y+At(1.9,1.7,l),Lt.rouge.z-At(4.8,3.9,l)),t.camera.lookAt(Lt.rouge.x-.6,Lt.rouge.y+1,Lt.rouge.z+.2),t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera)}var ia={heros:new x(-27,0,-20),regard:new x(-1,0,0)},ea=37.36,p_=37.6,g0=37.55,ii=Ja(lr({peau:"#a8714a",cheveux:"#121212",coupe:"courts",haut:"veste",bas:"cargo",basC:"#2b3a67",chapeau:"casquette",chapeauC:"#2a2a2a"}),1);kt.scene.add(ii.groupe);var wr=ia.heros.clone().add(new x(9,0,.6)),aa=new ki(new Ai({map:b0,blending:zi,transparent:!0,depthWrite:!1}));aa.visible=!1;kt.scene.add(aa);var Ar=new ki(new Ai({map:Ku,transparent:!0,depthWrite:!1}));Ar.visible=!1;kt.scene.add(Ar);var ja=new ki(new Ai({map:b0,blending:zi,transparent:!0,depthWrite:!1}));ja.visible=!1;kt.scene.add(ja);var Rr=new ke(new wt(.03,.03,1),new pi({color:16771496}));Rr.visible=!1;kt.scene.add(Rr);var Jt=new x(-24,0,-21),so=[{style:{peau:"#8d5524",cheveux:"#121212",haut:"maillot",hautC1:"#ff3b3b",motif:"numero",chapeau:"chantier",chapeauC:"#ffd21f"},d:[-.9,0,.2]},{style:{peau:"#ffdbac",cheveux:"#d9a441",coupe:"longs",haut:"pull",hautC1:"#8b5cf6",chapeau:"bonnet",chapeauC:"#14b8a6"},d:[.8,0,-.3]},{style:{peau:"#9be37a",cheveux:"#2bd46c",coupe:"herisses",haut:"tshirt",hautC1:"#ffffff",motif:"smiley",hautC2:"#ffd21f",accVisage:"lunettes_rondes"},d:[.1,0,.9]}].map(e=>{let t=Ja(lr(e.style));return kt.scene.add(t.groupe),t.groupe.position.set(Jt.x+e.d[0],0,Jt.z+e.d[2]),{...e,p:t}}),ur=Nu("grenade");ur.scale.setScalar(2.6);ur.visible=!1;kt.scene.add(ur);var Lr=new ki(new Ai({map:b0,blending:zi,transparent:!0,depthWrite:!1}));Lr.visible=!1;kt.scene.add(Lr);var R0=$u(kt.scene,60,["#ff8a1f","#ffd21f","#ffffff","#bdbdbd","#6b7280"],33),Vn=39.2,oo=[];function d_(){oo=so.map((e,t)=>{e.p.groupe.rotation.set(0,Ii(-e.d[0]-.5,2),0),cr(e.p,Vn+t),Ur(e.p);let i=new x(e.d[0],0,e.d[2]+.2).normalize();return M0(kt.scene,e.p,{impulsion:i,boites:kt.boites,force:1.9+t*.15,duree:4},1.6)})}function f_(e,t){let i=Jt.clone().add(new x(9,1.6,2.5)),r=Jt.clone().add(new x(3.4,.12,.9)),a=new x(Jt.x,.12,Jt.z+.2);if(e<38.65)return t.copy(i);if(e<38.95){let s=st(e,38.65,38.95);return t.lerpVectors(i,r,s),t.y=At(i.y,r.y,s)+2.2*4*s*(1-s),t}let n=st(e,38.95,Vn);return t.lerpVectors(r,a,n),t.y=.12+.5*4*n*(1-n),t}function m_(e){let t=kt,i=no;if(ii.groupe.visible=!0,so.forEach(h=>{h.p.groupe.visible=!1}),oo.forEach(h=>h.montrer(-1)),ur.visible=!1,Lr.visible=!1,R0.montrer(Yi,-1),i.groupe.visible=!0,i.prendreArme("fusil","principale"),i.arme.visible=!0,i.afficherPoeleDos(!0),!i.poeleDos.userData.ajustee){i.poeleDos.scale.setScalar(2),i.groupe.updateMatrixWorld(!0);let h=new ui().setFromObject(i.poeleDos).getCenter(new x);i.parties.corps.mesh.worldToLocal(h),i.poeleDos.position.y-=h.y+.02,i.poeleDos.position.z+=.015,i.poeleDos.userData.ajustee=!0}i.accessoires.cape&&(i.accessoires.cape.visible=!1),i.groupe.position.copy(ia.heros),i.groupe.rotation.set(0,Ii(ia.regard.x,ia.regard.z),0),oa(i,e,0,{pitch:.05});let r=p_;i.choc=Dr(1-(e-r)*4,0,1)*(e>=r?1:0),i.parties.corps.pivot.rotation.x=-i.choc*.25,i.materiau.emissive.setScalar(i.choc*.08),i.groupe.updateMatrixWorld(!0);let a=new ui().setFromObject(i.poeleDos).getCenter(new x);ii.groupe.position.copy(wr),ii.groupe.rotation.set(0,Ii(a.x-wr.x,a.z-wr.z),0),ii.prendreArme("fusil","principale"),ii.arme.visible=!0,ii.temps=e,ii.viseeLisse=1,ii.anim=null,ii.choc=0;let n=e>=ea?Math.exp(-(e-ea)*12):0;ii.animer(0,{vitesse:0,enLAir:!1,pitch:Math.atan2(a.y-1.55,a.distanceTo(wr))+n*.25,visee:!0}),ii.groupe.updateMatrixWorld(!0);let s=ii.boutDuCanon(new x);if(aa.visible=e>=ea&&e<ea+.08,aa.visible){aa.position.copy(s);let h=.9*(1-(e-ea)/.08);aa.scale.set(h,h,1)}let o=st(e,ea,r);if(Rr.visible=e>ea&&e<r+.05,Rr.visible){let h=sa.lerpVectors(s,a,o),c=Yi.lerpVectors(s,a,Math.max(0,o-.35));Rr.position.copy(h).add(c).multiplyScalar(.5),Rr.scale.set(1,1,h.distanceTo(c)),Rr.lookAt(h)}let l=e-r;if(Ar.visible=l>=0&&l<.5,ja.visible=l>=0&&l<.25,Ar.visible){let h=a.clone().addScaledVector(ia.regard,-.12);Ar.position.copy(h);let c=.55*pr(Dr(l/.12))*(1-st(l,.25,.5));Ar.scale.set(c,c,1),Ar.material.rotation=l*6,ja.position.copy(h);let p=.9*(1-st(l,0,.25));ja.scale.set(p,p,1)}if(e<g0){let h=ni(st(e,37,g0));t.camera.fov=30,t.camera.position.set(wr.x+2.3-h*.4,2,wr.z+1.5-h*.2),t.camera.lookAt(At(a.x,wr.x,.25),a.y+.15,At(a.z,wr.z,.25))}else{let h=l>0?Math.exp(-l*8)*Math.sin(l*60)*.03:0,c=ni(st(e,g0,38.6));t.camera.fov=40,t.camera.position.set(ia.heros.x+2.3-c*.3+h,1.5+h,ia.heros.z+.9),t.camera.lookAt(a.x,a.y+.05,a.z+.05)}t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera),Rr.visible=!1,Ar.visible=!1,ja.visible=!1,aa.visible=!1}function g_(e){let t=kt;no.groupe.visible=!1,ii.groupe.visible=!1;let i=e-Vn;if(so.forEach((n,s)=>{if(n.p.groupe.visible=i<0,i<0){n.p.groupe.position.set(Jt.x+n.d[0],0,Jt.z+n.d[2]),n.p.groupe.rotation.set(0,Ii(-n.d[0]-.5,2)+Math.sin(e*2+s)*.2,0),cr(n.p,e+s),Ur(n.p);let o=st(e,38.95,39.15);n.p.parties.brasD.pivot.rotation.set(0,0,.06+o*2.4),n.p.parties.brasG.pivot.rotation.set(0,0,-(.06+o*2.4))}}),oo.forEach(n=>n.montrer(i)),ur.visible=i<0,ur.visible&&(f_(e,ur.position),ur.rotation.set(e*9,e*5,0)),Lr.visible=i>=0&&i<.45,Lr.visible){Lr.position.set(Jt.x,1,Jt.z);let n=9*pr(Dr(i/.12))*(1-st(i,.15,.45));Lr.scale.set(n,n,1)}R0.montrer(new x(Jt.x,.4,Jt.z),i,1.6);let r=i>0?Math.exp(-i*5)*Math.sin(i*50)*.12:0;t.camera.fov=50;let a=pr(st(e,Vn,Vn+.8));t.camera.position.set(Jt.x+5.6+a*1.4+r,2+a*1.2+r,Jt.z+3.3+a*.9),t.camera.lookAt(Jt.x+.4,1.2+a*1.6,Jt.z),t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera)}var qa=new x(8,.2,-9),Cr=Ja(lr({peau:"#7fc8ff",cheveux:"#ff5fa2",coupe:"queue",haut:"sweat",hautC1:"#ffd21f",motif:"etoile",hautC2:"#ff3b3b",bas:"short",basC:"#14b8a6",chapeau:"bonnet",chapeauC:"#ec4899"}));kt.scene.add(Cr.groupe);var Gn=null,v0=1,x0=41.55;function __(){Cr.groupe.position.set(qa.x-2.2,5.6,qa.z+1.2),Cr.groupe.rotation.set(.6,.8,.3),cr(Cr,3),Ur(Cr),Gn=M0(kt.scene,Cr,{impulsion:new x(1,0,-.5).normalize(),vitesse:new x(2,-1,-1),boites:kt.boites,force:.35,duree:5},3),Cr.groupe.visible=!1;let e=1/0;v0=1;for(let t=0;t<3*na;t++){let i=Gn.centre(t/na).y;if(i>e-1e-4&&t>3){v0=t/na;break}e=i}}function v_(e){return v0+.04-(x0-Math.min(e,x0))*.3}function x_(e){let t=kt;no.groupe.visible=!1,ii.groupe.visible=!1,so.forEach(s=>{s.p.groupe.visible=!1}),oo.forEach(s=>s.montrer(-1)),ur.visible=!1,Lr.visible=!1,R0.montrer(Yi,-1),Cr.groupe.visible=!1;let i=v_(e);Gn.montrer(i);let r=Gn.centre(i),a=t.scene.fog;t.scene.fog=new Rn(a.color,6,34),t.camera.fov=38;let n=ni(st(e,40,x0));t.camera.position.set(qa.x+3.6-n*.6,.9+n*.2,qa.z+3.4-n*.6),t.camera.lookAt(At(qa.x-.6,r.x,.5),At(1.2,r.y,.4),At(qa.z,r.z,.5)),t.camera.updateProjectionMatrix(),si.render(t.scene,t.camera),t.scene.fog=a,Gn.montrer(-1)}var vi=(e,[t,i])=>e>=t&&e<i,tp=!1;function ip(e){if(tp)return Math.random=Za(Math.round(e*1e3)+1),vi(e,_i.tete)?Js(e,"tete"):vi(e,_i.podium)?Js(e,"podium"):vi(e,_i.garde)?Js(e,"garde"):vi(e,_i.armes)?t_.rendre(e):vi(e,_i.compte)?i_(e):vi(e,_i.sautA)?a_(e):vi(e,_i.sautB)?n_(e):vi(e,_i.grappin)?o_(e):vi(e,_i.dos)?u_(e):vi(e,_i.dingA)?m_(e):vi(e,_i.dingB)?g_(e):vi(e,_i.fun)?x_(e):Js(Math.min(e,49.999),"logo")}async function y_(){try{await document.fonts.load('700 64px "Space Mono"')}catch{}for(let[e,t]of[[Pr,"CH\xC2TEAU"],[ra,"VILLE"]]){let i=E0(t);e.material.map.dispose(),e.material.map=i.material.map}Math.random=Za(424242),c_(),d_(),__(),tp=!0,ip(window.__hfThreeTime||0)}window.__hf=window.__hf||{};window.__hf.buildReady=window.__hf.buildReady||{};window.__hf.buildReady["moteur-3d"]=y_();window.addEventListener("hf-seek",e=>ip(e.detail.time));})();
