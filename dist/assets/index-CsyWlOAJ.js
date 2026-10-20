var fv=Object.defineProperty;var pv=(t,e,n)=>e in t?fv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Je=(t,e,n)=>pv(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function mv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var y0={exports:{}},Rc={},S0={exports:{}},tt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Pa=Symbol.for("react.element"),gv=Symbol.for("react.portal"),_v=Symbol.for("react.fragment"),vv=Symbol.for("react.strict_mode"),xv=Symbol.for("react.profiler"),yv=Symbol.for("react.provider"),Sv=Symbol.for("react.context"),Mv=Symbol.for("react.forward_ref"),wv=Symbol.for("react.suspense"),Ev=Symbol.for("react.memo"),Tv=Symbol.for("react.lazy"),Yf=Symbol.iterator;function Av(t){return t===null||typeof t!="object"?null:(t=Yf&&t[Yf]||t["@@iterator"],typeof t=="function"?t:null)}var M0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w0=Object.assign,E0={};function po(t,e,n){this.props=t,this.context=e,this.refs=E0,this.updater=n||M0}po.prototype.isReactComponent={};po.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};po.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function T0(){}T0.prototype=po.prototype;function Id(t,e,n){this.props=t,this.context=e,this.refs=E0,this.updater=n||M0}var Nd=Id.prototype=new T0;Nd.constructor=Id;w0(Nd,po.prototype);Nd.isPureReactComponent=!0;var qf=Array.isArray,A0=Object.prototype.hasOwnProperty,Ud={current:null},C0={key:!0,ref:!0,__self:!0,__source:!0};function R0(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)A0.call(e,i)&&!C0.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Pa,type:t,key:s,ref:o,props:r,_owner:Ud.current}}function Cv(t,e){return{$$typeof:Pa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Fd(t){return typeof t=="object"&&t!==null&&t.$$typeof===Pa}function Rv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Zf=/\/+/g;function eu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Rv(""+t.key):e.toString(36)}function Ll(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case Pa:case gv:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+eu(o,0):i,qf(r)?(n="",t!=null&&(n=t.replace(Zf,"$&/")+"/"),Ll(r,e,n,"",function(c){return c})):r!=null&&(Fd(r)&&(r=Cv(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Zf,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",qf(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+eu(s,a);o+=Ll(s,e,n,l,r)}else if(l=Av(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+eu(s,a++),o+=Ll(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function za(t,e,n){if(t==null)return t;var i=[],r=0;return Ll(t,i,"","",function(s){return e.call(n,s,r++)}),i}function bv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var pn={current:null},Dl={transition:null},Pv={ReactCurrentDispatcher:pn,ReactCurrentBatchConfig:Dl,ReactCurrentOwner:Ud};function b0(){throw Error("act(...) is not supported in production builds of React.")}tt.Children={map:za,forEach:function(t,e,n){za(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return za(t,function(){e++}),e},toArray:function(t){return za(t,function(e){return e})||[]},only:function(t){if(!Fd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};tt.Component=po;tt.Fragment=_v;tt.Profiler=xv;tt.PureComponent=Id;tt.StrictMode=vv;tt.Suspense=wv;tt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Pv;tt.act=b0;tt.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=w0({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Ud.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)A0.call(e,l)&&!C0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:Pa,type:t.type,key:r,ref:s,props:i,_owner:o}};tt.createContext=function(t){return t={$$typeof:Sv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:yv,_context:t},t.Consumer=t};tt.createElement=R0;tt.createFactory=function(t){var e=R0.bind(null,t);return e.type=t,e};tt.createRef=function(){return{current:null}};tt.forwardRef=function(t){return{$$typeof:Mv,render:t}};tt.isValidElement=Fd;tt.lazy=function(t){return{$$typeof:Tv,_payload:{_status:-1,_result:t},_init:bv}};tt.memo=function(t,e){return{$$typeof:Ev,type:t,compare:e===void 0?null:e}};tt.startTransition=function(t){var e=Dl.transition;Dl.transition={};try{t()}finally{Dl.transition=e}};tt.unstable_act=b0;tt.useCallback=function(t,e){return pn.current.useCallback(t,e)};tt.useContext=function(t){return pn.current.useContext(t)};tt.useDebugValue=function(){};tt.useDeferredValue=function(t){return pn.current.useDeferredValue(t)};tt.useEffect=function(t,e){return pn.current.useEffect(t,e)};tt.useId=function(){return pn.current.useId()};tt.useImperativeHandle=function(t,e,n){return pn.current.useImperativeHandle(t,e,n)};tt.useInsertionEffect=function(t,e){return pn.current.useInsertionEffect(t,e)};tt.useLayoutEffect=function(t,e){return pn.current.useLayoutEffect(t,e)};tt.useMemo=function(t,e){return pn.current.useMemo(t,e)};tt.useReducer=function(t,e,n){return pn.current.useReducer(t,e,n)};tt.useRef=function(t){return pn.current.useRef(t)};tt.useState=function(t){return pn.current.useState(t)};tt.useSyncExternalStore=function(t,e,n){return pn.current.useSyncExternalStore(t,e,n)};tt.useTransition=function(){return pn.current.useTransition()};tt.version="18.3.1";S0.exports=tt;var St=S0.exports;const Lv=mv(St);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Dv=St,Iv=Symbol.for("react.element"),Nv=Symbol.for("react.fragment"),Uv=Object.prototype.hasOwnProperty,Fv=Dv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ov={key:!0,ref:!0,__self:!0,__source:!0};function P0(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Uv.call(e,i)&&!Ov.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Iv,type:t,key:s,ref:o,props:r,_owner:Fv.current}}Rc.Fragment=Nv;Rc.jsx=P0;Rc.jsxs=P0;y0.exports=Rc;var ie=y0.exports,ih={},L0={exports:{}},In={},D0={exports:{}},I0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(D,q){var J=D.length;D.push(q);e:for(;0<J;){var se=J-1>>>1,ve=D[se];if(0<r(ve,q))D[se]=q,D[J]=ve,J=se;else break e}}function n(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var q=D[0],J=D.pop();if(J!==q){D[0]=J;e:for(var se=0,ve=D.length,Ee=ve>>>1;se<Ee;){var G=2*(se+1)-1,re=D[G],he=G+1,fe=D[he];if(0>r(re,J))he<ve&&0>r(fe,re)?(D[se]=fe,D[he]=J,se=he):(D[se]=re,D[G]=J,se=G);else if(he<ve&&0>r(fe,J))D[se]=fe,D[he]=J,se=he;else break e}}return q}function r(D,q){var J=D.sortIndex-q.sortIndex;return J!==0?J:D.id-q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],h=1,d=null,f=3,p=!1,v=!1,x=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function _(D){for(var q=n(c);q!==null;){if(q.callback===null)i(c);else if(q.startTime<=D)i(c),q.sortIndex=q.expirationTime,e(l,q);else break;q=n(c)}}function y(D){if(x=!1,_(D),!v)if(n(l)!==null)v=!0,Y(R);else{var q=n(c);q!==null&&Q(y,q.startTime-D)}}function R(D,q){v=!1,x&&(x=!1,u(A),A=-1),p=!0;var J=f;try{for(_(q),d=n(l);d!==null&&(!(d.expirationTime>q)||D&&!P());){var se=d.callback;if(typeof se=="function"){d.callback=null,f=d.priorityLevel;var ve=se(d.expirationTime<=q);q=t.unstable_now(),typeof ve=="function"?d.callback=ve:d===n(l)&&i(l),_(q)}else i(l);d=n(l)}if(d!==null)var Ee=!0;else{var G=n(c);G!==null&&Q(y,G.startTime-q),Ee=!1}return Ee}finally{d=null,f=J,p=!1}}var w=!1,T=null,A=-1,M=5,S=-1;function P(){return!(t.unstable_now()-S<M)}function z(){if(T!==null){var D=t.unstable_now();S=D;var q=!0;try{q=T(!0,D)}finally{q?B():(w=!1,T=null)}}else w=!1}var B;if(typeof g=="function")B=function(){g(z)};else if(typeof MessageChannel<"u"){var W=new MessageChannel,ne=W.port2;W.port1.onmessage=z,B=function(){ne.postMessage(null)}}else B=function(){m(z,0)};function Y(D){T=D,w||(w=!0,B())}function Q(D,q){A=m(function(){D(t.unstable_now())},q)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(D){D.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,Y(R))},t.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<D?Math.floor(1e3/D):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(D){switch(f){case 1:case 2:case 3:var q=3;break;default:q=f}var J=f;f=q;try{return D()}finally{f=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(D,q){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var J=f;f=D;try{return q()}finally{f=J}},t.unstable_scheduleCallback=function(D,q,J){var se=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?se+J:se):J=se,D){case 1:var ve=-1;break;case 2:ve=250;break;case 5:ve=1073741823;break;case 4:ve=1e4;break;default:ve=5e3}return ve=J+ve,D={id:h++,callback:q,priorityLevel:D,startTime:J,expirationTime:ve,sortIndex:-1},J>se?(D.sortIndex=J,e(c,D),n(l)===null&&D===n(c)&&(x?(u(A),A=-1):x=!0,Q(y,J-se))):(D.sortIndex=ve,e(l,D),v||p||(v=!0,Y(R))),D},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(D){var q=f;return function(){var J=f;f=q;try{return D.apply(this,arguments)}finally{f=J}}}})(I0);D0.exports=I0;var kv=D0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zv=St,Dn=kv;function _e(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var N0=new Set,ca={};function Qr(t,e){eo(t,e),eo(t+"Capture",e)}function eo(t,e){for(ca[t]=e,t=0;t<e.length;t++)N0.add(e[t])}var Ui=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),rh=Object.prototype.hasOwnProperty,Bv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,$f={},Kf={};function Hv(t){return rh.call(Kf,t)?!0:rh.call($f,t)?!1:Bv.test(t)?Kf[t]=!0:($f[t]=!0,!1)}function Gv(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Vv(t,e,n,i){if(e===null||typeof e>"u"||Gv(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function mn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Jt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Jt[t]=new mn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Jt[e]=new mn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Jt[t]=new mn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Jt[t]=new mn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Jt[t]=new mn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Jt[t]=new mn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Jt[t]=new mn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Jt[t]=new mn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Jt[t]=new mn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Od=/[\-:]([a-z])/g;function kd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Od,kd);Jt[e]=new mn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Od,kd);Jt[e]=new mn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Od,kd);Jt[e]=new mn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Jt[t]=new mn(t,1,!1,t.toLowerCase(),null,!1,!1)});Jt.xlinkHref=new mn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Jt[t]=new mn(t,1,!1,t.toLowerCase(),null,!0,!0)});function zd(t,e,n,i){var r=Jt.hasOwnProperty(e)?Jt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Vv(e,n,r,i)&&(n=null),i||r===null?Hv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Bi=zv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ba=Symbol.for("react.element"),Rs=Symbol.for("react.portal"),bs=Symbol.for("react.fragment"),Bd=Symbol.for("react.strict_mode"),sh=Symbol.for("react.profiler"),U0=Symbol.for("react.provider"),F0=Symbol.for("react.context"),Hd=Symbol.for("react.forward_ref"),oh=Symbol.for("react.suspense"),ah=Symbol.for("react.suspense_list"),Gd=Symbol.for("react.memo"),$i=Symbol.for("react.lazy"),O0=Symbol.for("react.offscreen"),Qf=Symbol.iterator;function To(t){return t===null||typeof t!="object"?null:(t=Qf&&t[Qf]||t["@@iterator"],typeof t=="function"?t:null)}var At=Object.assign,tu;function jo(t){if(tu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);tu=e&&e[1]||""}return`
`+tu+t}var nu=!1;function iu(t,e){if(!t||nu)return"";nu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{nu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?jo(t):""}function Wv(t){switch(t.tag){case 5:return jo(t.type);case 16:return jo("Lazy");case 13:return jo("Suspense");case 19:return jo("SuspenseList");case 0:case 2:case 15:return t=iu(t.type,!1),t;case 11:return t=iu(t.type.render,!1),t;case 1:return t=iu(t.type,!0),t;default:return""}}function lh(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case bs:return"Fragment";case Rs:return"Portal";case sh:return"Profiler";case Bd:return"StrictMode";case oh:return"Suspense";case ah:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case F0:return(t.displayName||"Context")+".Consumer";case U0:return(t._context.displayName||"Context")+".Provider";case Hd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Gd:return e=t.displayName||null,e!==null?e:lh(t.type)||"Memo";case $i:e=t._payload,t=t._init;try{return lh(t(e))}catch{}}return null}function Xv(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return lh(e);case 8:return e===Bd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function mr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function k0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function jv(t){var e=k0(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ha(t){t._valueTracker||(t._valueTracker=jv(t))}function z0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=k0(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Zl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function ch(t,e){var n=e.checked;return At({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Jf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=mr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function B0(t,e){e=e.checked,e!=null&&zd(t,"checked",e,!1)}function uh(t,e){B0(t,e);var n=mr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?hh(t,e.type,n):e.hasOwnProperty("defaultValue")&&hh(t,e.type,mr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function ep(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function hh(t,e,n){(e!=="number"||Zl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Yo=Array.isArray;function Vs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+mr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function dh(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(_e(91));return At({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function tp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(_e(92));if(Yo(n)){if(1<n.length)throw Error(_e(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:mr(n)}}function H0(t,e){var n=mr(e.value),i=mr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function np(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function G0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function fh(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?G0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ga,V0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ga=Ga||document.createElement("div"),Ga.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ga.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ua(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ko={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Yv=["Webkit","ms","Moz","O"];Object.keys(Ko).forEach(function(t){Yv.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ko[e]=Ko[t]})});function W0(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ko.hasOwnProperty(t)&&Ko[t]?(""+e).trim():e+"px"}function X0(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=W0(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var qv=At({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ph(t,e){if(e){if(qv[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(_e(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(_e(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(_e(61))}if(e.style!=null&&typeof e.style!="object")throw Error(_e(62))}}function mh(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var gh=null;function Vd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var _h=null,Ws=null,Xs=null;function ip(t){if(t=Ia(t)){if(typeof _h!="function")throw Error(_e(280));var e=t.stateNode;e&&(e=Ic(e),_h(t.stateNode,t.type,e))}}function j0(t){Ws?Xs?Xs.push(t):Xs=[t]:Ws=t}function Y0(){if(Ws){var t=Ws,e=Xs;if(Xs=Ws=null,ip(t),e)for(t=0;t<e.length;t++)ip(e[t])}}function q0(t,e){return t(e)}function Z0(){}var ru=!1;function $0(t,e,n){if(ru)return t(e,n);ru=!0;try{return q0(t,e,n)}finally{ru=!1,(Ws!==null||Xs!==null)&&(Z0(),Y0())}}function ha(t,e){var n=t.stateNode;if(n===null)return null;var i=Ic(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(_e(231,e,typeof n));return n}var vh=!1;if(Ui)try{var Ao={};Object.defineProperty(Ao,"passive",{get:function(){vh=!0}}),window.addEventListener("test",Ao,Ao),window.removeEventListener("test",Ao,Ao)}catch{vh=!1}function Zv(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(h){this.onError(h)}}var Qo=!1,$l=null,Kl=!1,xh=null,$v={onError:function(t){Qo=!0,$l=t}};function Kv(t,e,n,i,r,s,o,a,l){Qo=!1,$l=null,Zv.apply($v,arguments)}function Qv(t,e,n,i,r,s,o,a,l){if(Kv.apply(this,arguments),Qo){if(Qo){var c=$l;Qo=!1,$l=null}else throw Error(_e(198));Kl||(Kl=!0,xh=c)}}function Jr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function K0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function rp(t){if(Jr(t)!==t)throw Error(_e(188))}function Jv(t){var e=t.alternate;if(!e){if(e=Jr(t),e===null)throw Error(_e(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return rp(r),t;if(s===i)return rp(r),e;s=s.sibling}throw Error(_e(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(_e(189))}}if(n.alternate!==i)throw Error(_e(190))}if(n.tag!==3)throw Error(_e(188));return n.stateNode.current===n?t:e}function Q0(t){return t=Jv(t),t!==null?J0(t):null}function J0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=J0(t);if(e!==null)return e;t=t.sibling}return null}var eg=Dn.unstable_scheduleCallback,sp=Dn.unstable_cancelCallback,ex=Dn.unstable_shouldYield,tx=Dn.unstable_requestPaint,Lt=Dn.unstable_now,nx=Dn.unstable_getCurrentPriorityLevel,Wd=Dn.unstable_ImmediatePriority,tg=Dn.unstable_UserBlockingPriority,Ql=Dn.unstable_NormalPriority,ix=Dn.unstable_LowPriority,ng=Dn.unstable_IdlePriority,bc=null,_i=null;function rx(t){if(_i&&typeof _i.onCommitFiberRoot=="function")try{_i.onCommitFiberRoot(bc,t,void 0,(t.current.flags&128)===128)}catch{}}var ii=Math.clz32?Math.clz32:ax,sx=Math.log,ox=Math.LN2;function ax(t){return t>>>=0,t===0?32:31-(sx(t)/ox|0)|0}var Va=64,Wa=4194304;function qo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Jl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=qo(a):(s&=o,s!==0&&(i=qo(s)))}else o=n&~r,o!==0?i=qo(o):s!==0&&(i=qo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ii(e),r=1<<n,i|=t[n],e&=~r;return i}function lx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function cx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-ii(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=lx(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function yh(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function ig(){var t=Va;return Va<<=1,!(Va&4194240)&&(Va=64),t}function su(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function La(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ii(e),t[e]=n}function ux(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-ii(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Xd(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ii(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var dt=0;function rg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var sg,jd,og,ag,lg,Sh=!1,Xa=[],sr=null,or=null,ar=null,da=new Map,fa=new Map,Ji=[],hx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function op(t,e){switch(t){case"focusin":case"focusout":sr=null;break;case"dragenter":case"dragleave":or=null;break;case"mouseover":case"mouseout":ar=null;break;case"pointerover":case"pointerout":da.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":fa.delete(e.pointerId)}}function Co(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Ia(e),e!==null&&jd(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function dx(t,e,n,i,r){switch(e){case"focusin":return sr=Co(sr,t,e,n,i,r),!0;case"dragenter":return or=Co(or,t,e,n,i,r),!0;case"mouseover":return ar=Co(ar,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return da.set(s,Co(da.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,fa.set(s,Co(fa.get(s)||null,t,e,n,i,r)),!0}return!1}function cg(t){var e=kr(t.target);if(e!==null){var n=Jr(e);if(n!==null){if(e=n.tag,e===13){if(e=K0(n),e!==null){t.blockedOn=e,lg(t.priority,function(){og(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Il(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Mh(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);gh=i,n.target.dispatchEvent(i),gh=null}else return e=Ia(n),e!==null&&jd(e),t.blockedOn=n,!1;e.shift()}return!0}function ap(t,e,n){Il(t)&&n.delete(e)}function fx(){Sh=!1,sr!==null&&Il(sr)&&(sr=null),or!==null&&Il(or)&&(or=null),ar!==null&&Il(ar)&&(ar=null),da.forEach(ap),fa.forEach(ap)}function Ro(t,e){t.blockedOn===e&&(t.blockedOn=null,Sh||(Sh=!0,Dn.unstable_scheduleCallback(Dn.unstable_NormalPriority,fx)))}function pa(t){function e(r){return Ro(r,t)}if(0<Xa.length){Ro(Xa[0],t);for(var n=1;n<Xa.length;n++){var i=Xa[n];i.blockedOn===t&&(i.blockedOn=null)}}for(sr!==null&&Ro(sr,t),or!==null&&Ro(or,t),ar!==null&&Ro(ar,t),da.forEach(e),fa.forEach(e),n=0;n<Ji.length;n++)i=Ji[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Ji.length&&(n=Ji[0],n.blockedOn===null);)cg(n),n.blockedOn===null&&Ji.shift()}var js=Bi.ReactCurrentBatchConfig,ec=!0;function px(t,e,n,i){var r=dt,s=js.transition;js.transition=null;try{dt=1,Yd(t,e,n,i)}finally{dt=r,js.transition=s}}function mx(t,e,n,i){var r=dt,s=js.transition;js.transition=null;try{dt=4,Yd(t,e,n,i)}finally{dt=r,js.transition=s}}function Yd(t,e,n,i){if(ec){var r=Mh(t,e,n,i);if(r===null)mu(t,e,i,tc,n),op(t,i);else if(dx(r,t,e,n,i))i.stopPropagation();else if(op(t,i),e&4&&-1<hx.indexOf(t)){for(;r!==null;){var s=Ia(r);if(s!==null&&sg(s),s=Mh(t,e,n,i),s===null&&mu(t,e,i,tc,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else mu(t,e,i,null,n)}}var tc=null;function Mh(t,e,n,i){if(tc=null,t=Vd(i),t=kr(t),t!==null)if(e=Jr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=K0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return tc=t,null}function ug(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(nx()){case Wd:return 1;case tg:return 4;case Ql:case ix:return 16;case ng:return 536870912;default:return 16}default:return 16}}var nr=null,qd=null,Nl=null;function hg(){if(Nl)return Nl;var t,e=qd,n=e.length,i,r="value"in nr?nr.value:nr.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return Nl=r.slice(t,1<i?1-i:void 0)}function Ul(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ja(){return!0}function lp(){return!1}function Nn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ja:lp,this.isPropagationStopped=lp,this}return At(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ja)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ja)},persist:function(){},isPersistent:ja}),e}var mo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zd=Nn(mo),Da=At({},mo,{view:0,detail:0}),gx=Nn(Da),ou,au,bo,Pc=At({},Da,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$d,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==bo&&(bo&&t.type==="mousemove"?(ou=t.screenX-bo.screenX,au=t.screenY-bo.screenY):au=ou=0,bo=t),ou)},movementY:function(t){return"movementY"in t?t.movementY:au}}),cp=Nn(Pc),_x=At({},Pc,{dataTransfer:0}),vx=Nn(_x),xx=At({},Da,{relatedTarget:0}),lu=Nn(xx),yx=At({},mo,{animationName:0,elapsedTime:0,pseudoElement:0}),Sx=Nn(yx),Mx=At({},mo,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),wx=Nn(Mx),Ex=At({},mo,{data:0}),up=Nn(Ex),Tx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ax={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Cx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Rx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Cx[t])?!!e[t]:!1}function $d(){return Rx}var bx=At({},Da,{key:function(t){if(t.key){var e=Tx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Ul(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ax[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$d,charCode:function(t){return t.type==="keypress"?Ul(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Ul(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Px=Nn(bx),Lx=At({},Pc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),hp=Nn(Lx),Dx=At({},Da,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$d}),Ix=Nn(Dx),Nx=At({},mo,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ux=Nn(Nx),Fx=At({},Pc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Ox=Nn(Fx),kx=[9,13,27,32],Kd=Ui&&"CompositionEvent"in window,Jo=null;Ui&&"documentMode"in document&&(Jo=document.documentMode);var zx=Ui&&"TextEvent"in window&&!Jo,dg=Ui&&(!Kd||Jo&&8<Jo&&11>=Jo),dp=" ",fp=!1;function fg(t,e){switch(t){case"keyup":return kx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function pg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ps=!1;function Bx(t,e){switch(t){case"compositionend":return pg(e);case"keypress":return e.which!==32?null:(fp=!0,dp);case"textInput":return t=e.data,t===dp&&fp?null:t;default:return null}}function Hx(t,e){if(Ps)return t==="compositionend"||!Kd&&fg(t,e)?(t=hg(),Nl=qd=nr=null,Ps=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return dg&&e.locale!=="ko"?null:e.data;default:return null}}var Gx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function pp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Gx[t.type]:e==="textarea"}function mg(t,e,n,i){j0(i),e=nc(e,"onChange"),0<e.length&&(n=new Zd("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var ea=null,ma=null;function Vx(t){Ag(t,0)}function Lc(t){var e=Is(t);if(z0(e))return t}function Wx(t,e){if(t==="change")return e}var gg=!1;if(Ui){var cu;if(Ui){var uu="oninput"in document;if(!uu){var mp=document.createElement("div");mp.setAttribute("oninput","return;"),uu=typeof mp.oninput=="function"}cu=uu}else cu=!1;gg=cu&&(!document.documentMode||9<document.documentMode)}function gp(){ea&&(ea.detachEvent("onpropertychange",_g),ma=ea=null)}function _g(t){if(t.propertyName==="value"&&Lc(ma)){var e=[];mg(e,ma,t,Vd(t)),$0(Vx,e)}}function Xx(t,e,n){t==="focusin"?(gp(),ea=e,ma=n,ea.attachEvent("onpropertychange",_g)):t==="focusout"&&gp()}function jx(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Lc(ma)}function Yx(t,e){if(t==="click")return Lc(e)}function qx(t,e){if(t==="input"||t==="change")return Lc(e)}function Zx(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var oi=typeof Object.is=="function"?Object.is:Zx;function ga(t,e){if(oi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!rh.call(e,r)||!oi(t[r],e[r]))return!1}return!0}function _p(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function vp(t,e){var n=_p(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=_p(n)}}function vg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?vg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function xg(){for(var t=window,e=Zl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Zl(t.document)}return e}function Qd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function $x(t){var e=xg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&vg(n.ownerDocument.documentElement,n)){if(i!==null&&Qd(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=vp(n,s);var o=vp(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Kx=Ui&&"documentMode"in document&&11>=document.documentMode,Ls=null,wh=null,ta=null,Eh=!1;function xp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Eh||Ls==null||Ls!==Zl(i)||(i=Ls,"selectionStart"in i&&Qd(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ta&&ga(ta,i)||(ta=i,i=nc(wh,"onSelect"),0<i.length&&(e=new Zd("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Ls)))}function Ya(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ds={animationend:Ya("Animation","AnimationEnd"),animationiteration:Ya("Animation","AnimationIteration"),animationstart:Ya("Animation","AnimationStart"),transitionend:Ya("Transition","TransitionEnd")},hu={},yg={};Ui&&(yg=document.createElement("div").style,"AnimationEvent"in window||(delete Ds.animationend.animation,delete Ds.animationiteration.animation,delete Ds.animationstart.animation),"TransitionEvent"in window||delete Ds.transitionend.transition);function Dc(t){if(hu[t])return hu[t];if(!Ds[t])return t;var e=Ds[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in yg)return hu[t]=e[n];return t}var Sg=Dc("animationend"),Mg=Dc("animationiteration"),wg=Dc("animationstart"),Eg=Dc("transitionend"),Tg=new Map,yp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function _r(t,e){Tg.set(t,e),Qr(e,[t])}for(var du=0;du<yp.length;du++){var fu=yp[du],Qx=fu.toLowerCase(),Jx=fu[0].toUpperCase()+fu.slice(1);_r(Qx,"on"+Jx)}_r(Sg,"onAnimationEnd");_r(Mg,"onAnimationIteration");_r(wg,"onAnimationStart");_r("dblclick","onDoubleClick");_r("focusin","onFocus");_r("focusout","onBlur");_r(Eg,"onTransitionEnd");eo("onMouseEnter",["mouseout","mouseover"]);eo("onMouseLeave",["mouseout","mouseover"]);eo("onPointerEnter",["pointerout","pointerover"]);eo("onPointerLeave",["pointerout","pointerover"]);Qr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Qr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Qr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Qr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Qr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Qr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ey=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zo));function Sp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Qv(i,e,void 0,t),t.currentTarget=null}function Ag(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Sp(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Sp(r,a,c),s=l}}}if(Kl)throw t=xh,Kl=!1,xh=null,t}function _t(t,e){var n=e[bh];n===void 0&&(n=e[bh]=new Set);var i=t+"__bubble";n.has(i)||(Cg(e,t,2,!1),n.add(i))}function pu(t,e,n){var i=0;e&&(i|=4),Cg(n,t,i,e)}var qa="_reactListening"+Math.random().toString(36).slice(2);function _a(t){if(!t[qa]){t[qa]=!0,N0.forEach(function(n){n!=="selectionchange"&&(ey.has(n)||pu(n,!1,t),pu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[qa]||(e[qa]=!0,pu("selectionchange",!1,e))}}function Cg(t,e,n,i){switch(ug(e)){case 1:var r=px;break;case 4:r=mx;break;default:r=Yd}n=r.bind(null,e,n,t),r=void 0,!vh||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function mu(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=kr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}$0(function(){var c=s,h=Vd(n),d=[];e:{var f=Tg.get(t);if(f!==void 0){var p=Zd,v=t;switch(t){case"keypress":if(Ul(n)===0)break e;case"keydown":case"keyup":p=Px;break;case"focusin":v="focus",p=lu;break;case"focusout":v="blur",p=lu;break;case"beforeblur":case"afterblur":p=lu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=cp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=vx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Ix;break;case Sg:case Mg:case wg:p=Sx;break;case Eg:p=Ux;break;case"scroll":p=gx;break;case"wheel":p=Ox;break;case"copy":case"cut":case"paste":p=wx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=hp}var x=(e&4)!==0,m=!x&&t==="scroll",u=x?f!==null?f+"Capture":null:f;x=[];for(var g=c,_;g!==null;){_=g;var y=_.stateNode;if(_.tag===5&&y!==null&&(_=y,u!==null&&(y=ha(g,u),y!=null&&x.push(va(g,y,_)))),m)break;g=g.return}0<x.length&&(f=new p(f,v,null,n,h),d.push({event:f,listeners:x}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==gh&&(v=n.relatedTarget||n.fromElement)&&(kr(v)||v[Fi]))break e;if((p||f)&&(f=h.window===h?h:(f=h.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=n.relatedTarget||n.toElement,p=c,v=v?kr(v):null,v!==null&&(m=Jr(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(x=cp,y="onMouseLeave",u="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(x=hp,y="onPointerLeave",u="onPointerEnter",g="pointer"),m=p==null?f:Is(p),_=v==null?f:Is(v),f=new x(y,g+"leave",p,n,h),f.target=m,f.relatedTarget=_,y=null,kr(h)===c&&(x=new x(u,g+"enter",v,n,h),x.target=_,x.relatedTarget=m,y=x),m=y,p&&v)t:{for(x=p,u=v,g=0,_=x;_;_=os(_))g++;for(_=0,y=u;y;y=os(y))_++;for(;0<g-_;)x=os(x),g--;for(;0<_-g;)u=os(u),_--;for(;g--;){if(x===u||u!==null&&x===u.alternate)break t;x=os(x),u=os(u)}x=null}else x=null;p!==null&&Mp(d,f,p,x,!1),v!==null&&m!==null&&Mp(d,m,v,x,!0)}}e:{if(f=c?Is(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var R=Wx;else if(pp(f))if(gg)R=qx;else{R=jx;var w=Xx}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(R=Yx);if(R&&(R=R(t,c))){mg(d,R,n,h);break e}w&&w(t,f,c),t==="focusout"&&(w=f._wrapperState)&&w.controlled&&f.type==="number"&&hh(f,"number",f.value)}switch(w=c?Is(c):window,t){case"focusin":(pp(w)||w.contentEditable==="true")&&(Ls=w,wh=c,ta=null);break;case"focusout":ta=wh=Ls=null;break;case"mousedown":Eh=!0;break;case"contextmenu":case"mouseup":case"dragend":Eh=!1,xp(d,n,h);break;case"selectionchange":if(Kx)break;case"keydown":case"keyup":xp(d,n,h)}var T;if(Kd)e:{switch(t){case"compositionstart":var A="onCompositionStart";break e;case"compositionend":A="onCompositionEnd";break e;case"compositionupdate":A="onCompositionUpdate";break e}A=void 0}else Ps?fg(t,n)&&(A="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(A="onCompositionStart");A&&(dg&&n.locale!=="ko"&&(Ps||A!=="onCompositionStart"?A==="onCompositionEnd"&&Ps&&(T=hg()):(nr=h,qd="value"in nr?nr.value:nr.textContent,Ps=!0)),w=nc(c,A),0<w.length&&(A=new up(A,t,null,n,h),d.push({event:A,listeners:w}),T?A.data=T:(T=pg(n),T!==null&&(A.data=T)))),(T=zx?Bx(t,n):Hx(t,n))&&(c=nc(c,"onBeforeInput"),0<c.length&&(h=new up("onBeforeInput","beforeinput",null,n,h),d.push({event:h,listeners:c}),h.data=T))}Ag(d,e)})}function va(t,e,n){return{instance:t,listener:e,currentTarget:n}}function nc(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=ha(t,n),s!=null&&i.unshift(va(t,s,r)),s=ha(t,e),s!=null&&i.push(va(t,s,r))),t=t.return}return i}function os(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Mp(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=ha(n,s),l!=null&&o.unshift(va(n,l,a))):r||(l=ha(n,s),l!=null&&o.push(va(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var ty=/\r\n?/g,ny=/\u0000|\uFFFD/g;function wp(t){return(typeof t=="string"?t:""+t).replace(ty,`
`).replace(ny,"")}function Za(t,e,n){if(e=wp(e),wp(t)!==e&&n)throw Error(_e(425))}function ic(){}var Th=null,Ah=null;function Ch(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Rh=typeof setTimeout=="function"?setTimeout:void 0,iy=typeof clearTimeout=="function"?clearTimeout:void 0,Ep=typeof Promise=="function"?Promise:void 0,ry=typeof queueMicrotask=="function"?queueMicrotask:typeof Ep<"u"?function(t){return Ep.resolve(null).then(t).catch(sy)}:Rh;function sy(t){setTimeout(function(){throw t})}function gu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),pa(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);pa(e)}function lr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Tp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var go=Math.random().toString(36).slice(2),fi="__reactFiber$"+go,xa="__reactProps$"+go,Fi="__reactContainer$"+go,bh="__reactEvents$"+go,oy="__reactListeners$"+go,ay="__reactHandles$"+go;function kr(t){var e=t[fi];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Fi]||n[fi]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Tp(t);t!==null;){if(n=t[fi])return n;t=Tp(t)}return e}t=n,n=t.parentNode}return null}function Ia(t){return t=t[fi]||t[Fi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Is(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(_e(33))}function Ic(t){return t[xa]||null}var Ph=[],Ns=-1;function vr(t){return{current:t}}function xt(t){0>Ns||(t.current=Ph[Ns],Ph[Ns]=null,Ns--)}function gt(t,e){Ns++,Ph[Ns]=t.current,t.current=e}var gr={},cn=vr(gr),yn=vr(!1),Xr=gr;function to(t,e){var n=t.type.contextTypes;if(!n)return gr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function Sn(t){return t=t.childContextTypes,t!=null}function rc(){xt(yn),xt(cn)}function Ap(t,e,n){if(cn.current!==gr)throw Error(_e(168));gt(cn,e),gt(yn,n)}function Rg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(_e(108,Xv(t)||"Unknown",r));return At({},n,i)}function sc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||gr,Xr=cn.current,gt(cn,t),gt(yn,yn.current),!0}function Cp(t,e,n){var i=t.stateNode;if(!i)throw Error(_e(169));n?(t=Rg(t,e,Xr),i.__reactInternalMemoizedMergedChildContext=t,xt(yn),xt(cn),gt(cn,t)):xt(yn),gt(yn,n)}var bi=null,Nc=!1,_u=!1;function bg(t){bi===null?bi=[t]:bi.push(t)}function ly(t){Nc=!0,bg(t)}function xr(){if(!_u&&bi!==null){_u=!0;var t=0,e=dt;try{var n=bi;for(dt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}bi=null,Nc=!1}catch(r){throw bi!==null&&(bi=bi.slice(t+1)),eg(Wd,xr),r}finally{dt=e,_u=!1}}return null}var Us=[],Fs=0,oc=null,ac=0,On=[],kn=0,jr=null,Pi=1,Li="";function Ir(t,e){Us[Fs++]=ac,Us[Fs++]=oc,oc=t,ac=e}function Pg(t,e,n){On[kn++]=Pi,On[kn++]=Li,On[kn++]=jr,jr=t;var i=Pi;t=Li;var r=32-ii(i)-1;i&=~(1<<r),n+=1;var s=32-ii(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Pi=1<<32-ii(e)+r|n<<r|i,Li=s+t}else Pi=1<<s|n<<r|i,Li=t}function Jd(t){t.return!==null&&(Ir(t,1),Pg(t,1,0))}function ef(t){for(;t===oc;)oc=Us[--Fs],Us[Fs]=null,ac=Us[--Fs],Us[Fs]=null;for(;t===jr;)jr=On[--kn],On[kn]=null,Li=On[--kn],On[kn]=null,Pi=On[--kn],On[kn]=null}var Ln=null,Pn=null,Mt=!1,ti=null;function Lg(t,e){var n=Gn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Rp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Ln=t,Pn=lr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Ln=t,Pn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=jr!==null?{id:Pi,overflow:Li}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Gn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Ln=t,Pn=null,!0):!1;default:return!1}}function Lh(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Dh(t){if(Mt){var e=Pn;if(e){var n=e;if(!Rp(t,e)){if(Lh(t))throw Error(_e(418));e=lr(n.nextSibling);var i=Ln;e&&Rp(t,e)?Lg(i,n):(t.flags=t.flags&-4097|2,Mt=!1,Ln=t)}}else{if(Lh(t))throw Error(_e(418));t.flags=t.flags&-4097|2,Mt=!1,Ln=t}}}function bp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Ln=t}function $a(t){if(t!==Ln)return!1;if(!Mt)return bp(t),Mt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Ch(t.type,t.memoizedProps)),e&&(e=Pn)){if(Lh(t))throw Dg(),Error(_e(418));for(;e;)Lg(t,e),e=lr(e.nextSibling)}if(bp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(_e(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Pn=lr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Pn=null}}else Pn=Ln?lr(t.stateNode.nextSibling):null;return!0}function Dg(){for(var t=Pn;t;)t=lr(t.nextSibling)}function no(){Pn=Ln=null,Mt=!1}function tf(t){ti===null?ti=[t]:ti.push(t)}var cy=Bi.ReactCurrentBatchConfig;function Po(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(_e(309));var i=n.stateNode}if(!i)throw Error(_e(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(_e(284));if(!n._owner)throw Error(_e(290,t))}return t}function Ka(t,e){throw t=Object.prototype.toString.call(e),Error(_e(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Pp(t){var e=t._init;return e(t._payload)}function Ig(t){function e(u,g){if(t){var _=u.deletions;_===null?(u.deletions=[g],u.flags|=16):_.push(g)}}function n(u,g){if(!t)return null;for(;g!==null;)e(u,g),g=g.sibling;return null}function i(u,g){for(u=new Map;g!==null;)g.key!==null?u.set(g.key,g):u.set(g.index,g),g=g.sibling;return u}function r(u,g){return u=dr(u,g),u.index=0,u.sibling=null,u}function s(u,g,_){return u.index=_,t?(_=u.alternate,_!==null?(_=_.index,_<g?(u.flags|=2,g):_):(u.flags|=2,g)):(u.flags|=1048576,g)}function o(u){return t&&u.alternate===null&&(u.flags|=2),u}function a(u,g,_,y){return g===null||g.tag!==6?(g=Eu(_,u.mode,y),g.return=u,g):(g=r(g,_),g.return=u,g)}function l(u,g,_,y){var R=_.type;return R===bs?h(u,g,_.props.children,y,_.key):g!==null&&(g.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===$i&&Pp(R)===g.type)?(y=r(g,_.props),y.ref=Po(u,g,_),y.return=u,y):(y=Gl(_.type,_.key,_.props,null,u.mode,y),y.ref=Po(u,g,_),y.return=u,y)}function c(u,g,_,y){return g===null||g.tag!==4||g.stateNode.containerInfo!==_.containerInfo||g.stateNode.implementation!==_.implementation?(g=Tu(_,u.mode,y),g.return=u,g):(g=r(g,_.children||[]),g.return=u,g)}function h(u,g,_,y,R){return g===null||g.tag!==7?(g=Wr(_,u.mode,y,R),g.return=u,g):(g=r(g,_),g.return=u,g)}function d(u,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Eu(""+g,u.mode,_),g.return=u,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Ba:return _=Gl(g.type,g.key,g.props,null,u.mode,_),_.ref=Po(u,null,g),_.return=u,_;case Rs:return g=Tu(g,u.mode,_),g.return=u,g;case $i:var y=g._init;return d(u,y(g._payload),_)}if(Yo(g)||To(g))return g=Wr(g,u.mode,_,null),g.return=u,g;Ka(u,g)}return null}function f(u,g,_,y){var R=g!==null?g.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return R!==null?null:a(u,g,""+_,y);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ba:return _.key===R?l(u,g,_,y):null;case Rs:return _.key===R?c(u,g,_,y):null;case $i:return R=_._init,f(u,g,R(_._payload),y)}if(Yo(_)||To(_))return R!==null?null:h(u,g,_,y,null);Ka(u,_)}return null}function p(u,g,_,y,R){if(typeof y=="string"&&y!==""||typeof y=="number")return u=u.get(_)||null,a(g,u,""+y,R);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Ba:return u=u.get(y.key===null?_:y.key)||null,l(g,u,y,R);case Rs:return u=u.get(y.key===null?_:y.key)||null,c(g,u,y,R);case $i:var w=y._init;return p(u,g,_,w(y._payload),R)}if(Yo(y)||To(y))return u=u.get(_)||null,h(g,u,y,R,null);Ka(g,y)}return null}function v(u,g,_,y){for(var R=null,w=null,T=g,A=g=0,M=null;T!==null&&A<_.length;A++){T.index>A?(M=T,T=null):M=T.sibling;var S=f(u,T,_[A],y);if(S===null){T===null&&(T=M);break}t&&T&&S.alternate===null&&e(u,T),g=s(S,g,A),w===null?R=S:w.sibling=S,w=S,T=M}if(A===_.length)return n(u,T),Mt&&Ir(u,A),R;if(T===null){for(;A<_.length;A++)T=d(u,_[A],y),T!==null&&(g=s(T,g,A),w===null?R=T:w.sibling=T,w=T);return Mt&&Ir(u,A),R}for(T=i(u,T);A<_.length;A++)M=p(T,u,A,_[A],y),M!==null&&(t&&M.alternate!==null&&T.delete(M.key===null?A:M.key),g=s(M,g,A),w===null?R=M:w.sibling=M,w=M);return t&&T.forEach(function(P){return e(u,P)}),Mt&&Ir(u,A),R}function x(u,g,_,y){var R=To(_);if(typeof R!="function")throw Error(_e(150));if(_=R.call(_),_==null)throw Error(_e(151));for(var w=R=null,T=g,A=g=0,M=null,S=_.next();T!==null&&!S.done;A++,S=_.next()){T.index>A?(M=T,T=null):M=T.sibling;var P=f(u,T,S.value,y);if(P===null){T===null&&(T=M);break}t&&T&&P.alternate===null&&e(u,T),g=s(P,g,A),w===null?R=P:w.sibling=P,w=P,T=M}if(S.done)return n(u,T),Mt&&Ir(u,A),R;if(T===null){for(;!S.done;A++,S=_.next())S=d(u,S.value,y),S!==null&&(g=s(S,g,A),w===null?R=S:w.sibling=S,w=S);return Mt&&Ir(u,A),R}for(T=i(u,T);!S.done;A++,S=_.next())S=p(T,u,A,S.value,y),S!==null&&(t&&S.alternate!==null&&T.delete(S.key===null?A:S.key),g=s(S,g,A),w===null?R=S:w.sibling=S,w=S);return t&&T.forEach(function(z){return e(u,z)}),Mt&&Ir(u,A),R}function m(u,g,_,y){if(typeof _=="object"&&_!==null&&_.type===bs&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Ba:e:{for(var R=_.key,w=g;w!==null;){if(w.key===R){if(R=_.type,R===bs){if(w.tag===7){n(u,w.sibling),g=r(w,_.props.children),g.return=u,u=g;break e}}else if(w.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===$i&&Pp(R)===w.type){n(u,w.sibling),g=r(w,_.props),g.ref=Po(u,w,_),g.return=u,u=g;break e}n(u,w);break}else e(u,w);w=w.sibling}_.type===bs?(g=Wr(_.props.children,u.mode,y,_.key),g.return=u,u=g):(y=Gl(_.type,_.key,_.props,null,u.mode,y),y.ref=Po(u,g,_),y.return=u,u=y)}return o(u);case Rs:e:{for(w=_.key;g!==null;){if(g.key===w)if(g.tag===4&&g.stateNode.containerInfo===_.containerInfo&&g.stateNode.implementation===_.implementation){n(u,g.sibling),g=r(g,_.children||[]),g.return=u,u=g;break e}else{n(u,g);break}else e(u,g);g=g.sibling}g=Tu(_,u.mode,y),g.return=u,u=g}return o(u);case $i:return w=_._init,m(u,g,w(_._payload),y)}if(Yo(_))return v(u,g,_,y);if(To(_))return x(u,g,_,y);Ka(u,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,g!==null&&g.tag===6?(n(u,g.sibling),g=r(g,_),g.return=u,u=g):(n(u,g),g=Eu(_,u.mode,y),g.return=u,u=g),o(u)):n(u,g)}return m}var io=Ig(!0),Ng=Ig(!1),lc=vr(null),cc=null,Os=null,nf=null;function rf(){nf=Os=cc=null}function sf(t){var e=lc.current;xt(lc),t._currentValue=e}function Ih(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ys(t,e){cc=t,nf=Os=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(vn=!0),t.firstContext=null)}function Xn(t){var e=t._currentValue;if(nf!==t)if(t={context:t,memoizedValue:e,next:null},Os===null){if(cc===null)throw Error(_e(308));Os=t,cc.dependencies={lanes:0,firstContext:t}}else Os=Os.next=t;return e}var zr=null;function of(t){zr===null?zr=[t]:zr.push(t)}function Ug(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,of(e)):(n.next=r.next,r.next=n),e.interleaved=n,Oi(t,i)}function Oi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Ki=!1;function af(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Fg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ni(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function cr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,at&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Oi(t,n)}return r=i.interleaved,r===null?(e.next=e,of(i)):(e.next=r.next,r.next=e),i.interleaved=e,Oi(t,n)}function Fl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Xd(t,n)}}function Lp(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function uc(t,e,n,i){var r=t.updateQueue;Ki=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var h=t.alternate;h!==null&&(h=h.updateQueue,a=h.lastBaseUpdate,a!==o&&(a===null?h.firstBaseUpdate=c:a.next=c,h.lastBaseUpdate=l))}if(s!==null){var d=r.baseState;o=0,h=c=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((i&f)===f){h!==null&&(h=h.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=t,x=a;switch(f=e,p=n,x.tag){case 1:if(v=x.payload,typeof v=="function"){d=v.call(p,d,f);break e}d=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,f=typeof v=="function"?v.call(p,d,f):v,f==null)break e;d=At({},d,f);break e;case 2:Ki=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},h===null?(c=h=p,l=d):h=h.next=p,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(h===null&&(l=d),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);qr|=o,t.lanes=o,t.memoizedState=d}}function Dp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(_e(191,r));r.call(i)}}}var Na={},vi=vr(Na),ya=vr(Na),Sa=vr(Na);function Br(t){if(t===Na)throw Error(_e(174));return t}function lf(t,e){switch(gt(Sa,e),gt(ya,t),gt(vi,Na),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:fh(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=fh(e,t)}xt(vi),gt(vi,e)}function ro(){xt(vi),xt(ya),xt(Sa)}function Og(t){Br(Sa.current);var e=Br(vi.current),n=fh(e,t.type);e!==n&&(gt(ya,t),gt(vi,n))}function cf(t){ya.current===t&&(xt(vi),xt(ya))}var wt=vr(0);function hc(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var vu=[];function uf(){for(var t=0;t<vu.length;t++)vu[t]._workInProgressVersionPrimary=null;vu.length=0}var Ol=Bi.ReactCurrentDispatcher,xu=Bi.ReactCurrentBatchConfig,Yr=0,Tt=null,Ot=null,Vt=null,dc=!1,na=!1,Ma=0,uy=0;function tn(){throw Error(_e(321))}function hf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!oi(t[n],e[n]))return!1;return!0}function df(t,e,n,i,r,s){if(Yr=s,Tt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Ol.current=t===null||t.memoizedState===null?py:my,t=n(i,r),na){s=0;do{if(na=!1,Ma=0,25<=s)throw Error(_e(301));s+=1,Vt=Ot=null,e.updateQueue=null,Ol.current=gy,t=n(i,r)}while(na)}if(Ol.current=fc,e=Ot!==null&&Ot.next!==null,Yr=0,Vt=Ot=Tt=null,dc=!1,e)throw Error(_e(300));return t}function ff(){var t=Ma!==0;return Ma=0,t}function ui(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Vt===null?Tt.memoizedState=Vt=t:Vt=Vt.next=t,Vt}function jn(){if(Ot===null){var t=Tt.alternate;t=t!==null?t.memoizedState:null}else t=Ot.next;var e=Vt===null?Tt.memoizedState:Vt.next;if(e!==null)Vt=e,Ot=t;else{if(t===null)throw Error(_e(310));Ot=t,t={memoizedState:Ot.memoizedState,baseState:Ot.baseState,baseQueue:Ot.baseQueue,queue:Ot.queue,next:null},Vt===null?Tt.memoizedState=Vt=t:Vt=Vt.next=t}return Vt}function wa(t,e){return typeof e=="function"?e(t):e}function yu(t){var e=jn(),n=e.queue;if(n===null)throw Error(_e(311));n.lastRenderedReducer=t;var i=Ot,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var h=c.lane;if((Yr&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var d={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=d,o=i):l=l.next=d,Tt.lanes|=h,qr|=h}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,oi(i,e.memoizedState)||(vn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Tt.lanes|=s,qr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Su(t){var e=jn(),n=e.queue;if(n===null)throw Error(_e(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);oi(s,e.memoizedState)||(vn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function kg(){}function zg(t,e){var n=Tt,i=jn(),r=e(),s=!oi(i.memoizedState,r);if(s&&(i.memoizedState=r,vn=!0),i=i.queue,pf(Gg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Vt!==null&&Vt.memoizedState.tag&1){if(n.flags|=2048,Ea(9,Hg.bind(null,n,i,r,e),void 0,null),Xt===null)throw Error(_e(349));Yr&30||Bg(n,e,r)}return r}function Bg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Tt.updateQueue,e===null?(e={lastEffect:null,stores:null},Tt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Hg(t,e,n,i){e.value=n,e.getSnapshot=i,Vg(e)&&Wg(t)}function Gg(t,e,n){return n(function(){Vg(e)&&Wg(t)})}function Vg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!oi(t,n)}catch{return!0}}function Wg(t){var e=Oi(t,1);e!==null&&ri(e,t,1,-1)}function Ip(t){var e=ui();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:wa,lastRenderedState:t},e.queue=t,t=t.dispatch=fy.bind(null,Tt,t),[e.memoizedState,t]}function Ea(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Tt.updateQueue,e===null?(e={lastEffect:null,stores:null},Tt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Xg(){return jn().memoizedState}function kl(t,e,n,i){var r=ui();Tt.flags|=t,r.memoizedState=Ea(1|e,n,void 0,i===void 0?null:i)}function Uc(t,e,n,i){var r=jn();i=i===void 0?null:i;var s=void 0;if(Ot!==null){var o=Ot.memoizedState;if(s=o.destroy,i!==null&&hf(i,o.deps)){r.memoizedState=Ea(e,n,s,i);return}}Tt.flags|=t,r.memoizedState=Ea(1|e,n,s,i)}function Np(t,e){return kl(8390656,8,t,e)}function pf(t,e){return Uc(2048,8,t,e)}function jg(t,e){return Uc(4,2,t,e)}function Yg(t,e){return Uc(4,4,t,e)}function qg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Zg(t,e,n){return n=n!=null?n.concat([t]):null,Uc(4,4,qg.bind(null,e,t),n)}function mf(){}function $g(t,e){var n=jn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&hf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Kg(t,e){var n=jn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&hf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Qg(t,e,n){return Yr&21?(oi(n,e)||(n=ig(),Tt.lanes|=n,qr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,vn=!0),t.memoizedState=n)}function hy(t,e){var n=dt;dt=n!==0&&4>n?n:4,t(!0);var i=xu.transition;xu.transition={};try{t(!1),e()}finally{dt=n,xu.transition=i}}function Jg(){return jn().memoizedState}function dy(t,e,n){var i=hr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},e_(t))t_(e,n);else if(n=Ug(t,e,n,i),n!==null){var r=fn();ri(n,t,i,r),n_(n,e,i)}}function fy(t,e,n){var i=hr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(e_(t))t_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,oi(a,o)){var l=e.interleaved;l===null?(r.next=r,of(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Ug(t,e,r,i),n!==null&&(r=fn(),ri(n,t,i,r),n_(n,e,i))}}function e_(t){var e=t.alternate;return t===Tt||e!==null&&e===Tt}function t_(t,e){na=dc=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function n_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Xd(t,n)}}var fc={readContext:Xn,useCallback:tn,useContext:tn,useEffect:tn,useImperativeHandle:tn,useInsertionEffect:tn,useLayoutEffect:tn,useMemo:tn,useReducer:tn,useRef:tn,useState:tn,useDebugValue:tn,useDeferredValue:tn,useTransition:tn,useMutableSource:tn,useSyncExternalStore:tn,useId:tn,unstable_isNewReconciler:!1},py={readContext:Xn,useCallback:function(t,e){return ui().memoizedState=[t,e===void 0?null:e],t},useContext:Xn,useEffect:Np,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,kl(4194308,4,qg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return kl(4194308,4,t,e)},useInsertionEffect:function(t,e){return kl(4,2,t,e)},useMemo:function(t,e){var n=ui();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ui();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=dy.bind(null,Tt,t),[i.memoizedState,t]},useRef:function(t){var e=ui();return t={current:t},e.memoizedState=t},useState:Ip,useDebugValue:mf,useDeferredValue:function(t){return ui().memoizedState=t},useTransition:function(){var t=Ip(!1),e=t[0];return t=hy.bind(null,t[1]),ui().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Tt,r=ui();if(Mt){if(n===void 0)throw Error(_e(407));n=n()}else{if(n=e(),Xt===null)throw Error(_e(349));Yr&30||Bg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Np(Gg.bind(null,i,s,t),[t]),i.flags|=2048,Ea(9,Hg.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ui(),e=Xt.identifierPrefix;if(Mt){var n=Li,i=Pi;n=(i&~(1<<32-ii(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ma++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=uy++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},my={readContext:Xn,useCallback:$g,useContext:Xn,useEffect:pf,useImperativeHandle:Zg,useInsertionEffect:jg,useLayoutEffect:Yg,useMemo:Kg,useReducer:yu,useRef:Xg,useState:function(){return yu(wa)},useDebugValue:mf,useDeferredValue:function(t){var e=jn();return Qg(e,Ot.memoizedState,t)},useTransition:function(){var t=yu(wa)[0],e=jn().memoizedState;return[t,e]},useMutableSource:kg,useSyncExternalStore:zg,useId:Jg,unstable_isNewReconciler:!1},gy={readContext:Xn,useCallback:$g,useContext:Xn,useEffect:pf,useImperativeHandle:Zg,useInsertionEffect:jg,useLayoutEffect:Yg,useMemo:Kg,useReducer:Su,useRef:Xg,useState:function(){return Su(wa)},useDebugValue:mf,useDeferredValue:function(t){var e=jn();return Ot===null?e.memoizedState=t:Qg(e,Ot.memoizedState,t)},useTransition:function(){var t=Su(wa)[0],e=jn().memoizedState;return[t,e]},useMutableSource:kg,useSyncExternalStore:zg,useId:Jg,unstable_isNewReconciler:!1};function Qn(t,e){if(t&&t.defaultProps){e=At({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Nh(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:At({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Fc={isMounted:function(t){return(t=t._reactInternals)?Jr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=fn(),r=hr(t),s=Ni(i,r);s.payload=e,n!=null&&(s.callback=n),e=cr(t,s,r),e!==null&&(ri(e,t,r,i),Fl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=fn(),r=hr(t),s=Ni(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=cr(t,s,r),e!==null&&(ri(e,t,r,i),Fl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=fn(),i=hr(t),r=Ni(n,i);r.tag=2,e!=null&&(r.callback=e),e=cr(t,r,i),e!==null&&(ri(e,t,i,n),Fl(e,t,i))}};function Up(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!ga(n,i)||!ga(r,s):!0}function i_(t,e,n){var i=!1,r=gr,s=e.contextType;return typeof s=="object"&&s!==null?s=Xn(s):(r=Sn(e)?Xr:cn.current,i=e.contextTypes,s=(i=i!=null)?to(t,r):gr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Fc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Fp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Fc.enqueueReplaceState(e,e.state,null)}function Uh(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},af(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Xn(s):(s=Sn(e)?Xr:cn.current,r.context=to(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Nh(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Fc.enqueueReplaceState(r,r.state,null),uc(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function so(t,e){try{var n="",i=e;do n+=Wv(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Mu(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Fh(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var _y=typeof WeakMap=="function"?WeakMap:Map;function r_(t,e,n){n=Ni(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){mc||(mc=!0,jh=i),Fh(t,e)},n}function s_(t,e,n){n=Ni(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Fh(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Fh(t,e),typeof i!="function"&&(ur===null?ur=new Set([this]):ur.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Op(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new _y;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Ly.bind(null,t,e,n),e.then(t,t))}function kp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function zp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ni(-1,1),e.tag=2,cr(n,e,1))),n.lanes|=1),t)}var vy=Bi.ReactCurrentOwner,vn=!1;function dn(t,e,n,i){e.child=t===null?Ng(e,null,n,i):io(e,t.child,n,i)}function Bp(t,e,n,i,r){n=n.render;var s=e.ref;return Ys(e,r),i=df(t,e,n,i,s,r),n=ff(),t!==null&&!vn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,ki(t,e,r)):(Mt&&n&&Jd(e),e.flags|=1,dn(t,e,i,r),e.child)}function Hp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!wf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,o_(t,e,s,i,r)):(t=Gl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:ga,n(o,i)&&t.ref===e.ref)return ki(t,e,r)}return e.flags|=1,t=dr(s,i),t.ref=e.ref,t.return=e,e.child=t}function o_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(ga(s,i)&&t.ref===e.ref)if(vn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(vn=!0);else return e.lanes=t.lanes,ki(t,e,r)}return Oh(t,e,n,i,r)}function a_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},gt(zs,Rn),Rn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,gt(zs,Rn),Rn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,gt(zs,Rn),Rn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,gt(zs,Rn),Rn|=i;return dn(t,e,r,n),e.child}function l_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Oh(t,e,n,i,r){var s=Sn(n)?Xr:cn.current;return s=to(e,s),Ys(e,r),n=df(t,e,n,i,s,r),i=ff(),t!==null&&!vn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,ki(t,e,r)):(Mt&&i&&Jd(e),e.flags|=1,dn(t,e,n,r),e.child)}function Gp(t,e,n,i,r){if(Sn(n)){var s=!0;sc(e)}else s=!1;if(Ys(e,r),e.stateNode===null)zl(t,e),i_(e,n,i),Uh(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Xn(c):(c=Sn(n)?Xr:cn.current,c=to(e,c));var h=n.getDerivedStateFromProps,d=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function";d||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Fp(e,o,i,c),Ki=!1;var f=e.memoizedState;o.state=f,uc(e,i,o,r),l=e.memoizedState,a!==i||f!==l||yn.current||Ki?(typeof h=="function"&&(Nh(e,n,h,i),l=e.memoizedState),(a=Ki||Up(e,n,a,i,f,l,c))?(d||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Fg(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:Qn(e.type,a),o.props=c,d=e.pendingProps,f=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Xn(l):(l=Sn(n)?Xr:cn.current,l=to(e,l));var p=n.getDerivedStateFromProps;(h=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==d||f!==l)&&Fp(e,o,i,l),Ki=!1,f=e.memoizedState,o.state=f,uc(e,i,o,r);var v=e.memoizedState;a!==d||f!==v||yn.current||Ki?(typeof p=="function"&&(Nh(e,n,p,i),v=e.memoizedState),(c=Ki||Up(e,n,c,i,f,v,l)||!1)?(h||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return kh(t,e,n,i,s,r)}function kh(t,e,n,i,r,s){l_(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Cp(e,n,!1),ki(t,e,s);i=e.stateNode,vy.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=io(e,t.child,null,s),e.child=io(e,null,a,s)):dn(t,e,a,s),e.memoizedState=i.state,r&&Cp(e,n,!0),e.child}function c_(t){var e=t.stateNode;e.pendingContext?Ap(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Ap(t,e.context,!1),lf(t,e.containerInfo)}function Vp(t,e,n,i,r){return no(),tf(r),e.flags|=256,dn(t,e,n,i),e.child}var zh={dehydrated:null,treeContext:null,retryLane:0};function Bh(t){return{baseLanes:t,cachePool:null,transitions:null}}function u_(t,e,n){var i=e.pendingProps,r=wt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),gt(wt,r&1),t===null)return Dh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=zc(o,i,0,null),t=Wr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Bh(n),e.memoizedState=zh,t):gf(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return xy(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=dr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=dr(a,s):(s=Wr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Bh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=zh,i}return s=t.child,t=s.sibling,i=dr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function gf(t,e){return e=zc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Qa(t,e,n,i){return i!==null&&tf(i),io(e,t.child,null,n),t=gf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function xy(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Mu(Error(_e(422))),Qa(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=zc({mode:"visible",children:i.children},r,0,null),s=Wr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&io(e,t.child,null,o),e.child.memoizedState=Bh(o),e.memoizedState=zh,s);if(!(e.mode&1))return Qa(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(_e(419)),i=Mu(s,i,void 0),Qa(t,e,o,i)}if(a=(o&t.childLanes)!==0,vn||a){if(i=Xt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Oi(t,r),ri(i,t,r,-1))}return Mf(),i=Mu(Error(_e(421))),Qa(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Dy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Pn=lr(r.nextSibling),Ln=e,Mt=!0,ti=null,t!==null&&(On[kn++]=Pi,On[kn++]=Li,On[kn++]=jr,Pi=t.id,Li=t.overflow,jr=e),e=gf(e,i.children),e.flags|=4096,e)}function Wp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Ih(t.return,e,n)}function wu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function h_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(dn(t,e,i.children,n),i=wt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Wp(t,n,e);else if(t.tag===19)Wp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(gt(wt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&hc(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),wu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&hc(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}wu(e,!0,n,null,s);break;case"together":wu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function zl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function ki(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),qr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(_e(153));if(e.child!==null){for(t=e.child,n=dr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=dr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function yy(t,e,n){switch(e.tag){case 3:c_(e),no();break;case 5:Og(e);break;case 1:Sn(e.type)&&sc(e);break;case 4:lf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;gt(lc,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(gt(wt,wt.current&1),e.flags|=128,null):n&e.child.childLanes?u_(t,e,n):(gt(wt,wt.current&1),t=ki(t,e,n),t!==null?t.sibling:null);gt(wt,wt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return h_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),gt(wt,wt.current),i)break;return null;case 22:case 23:return e.lanes=0,a_(t,e,n)}return ki(t,e,n)}var d_,Hh,f_,p_;d_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Hh=function(){};f_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Br(vi.current);var s=null;switch(n){case"input":r=ch(t,r),i=ch(t,i),s=[];break;case"select":r=At({},r,{value:void 0}),i=At({},i,{value:void 0}),s=[];break;case"textarea":r=dh(t,r),i=dh(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=ic)}ph(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(ca.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(ca.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&_t("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};p_=function(t,e,n,i){n!==i&&(e.flags|=4)};function Lo(t,e){if(!Mt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function nn(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Sy(t,e,n){var i=e.pendingProps;switch(ef(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nn(e),null;case 1:return Sn(e.type)&&rc(),nn(e),null;case 3:return i=e.stateNode,ro(),xt(yn),xt(cn),uf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&($a(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,ti!==null&&(Zh(ti),ti=null))),Hh(t,e),nn(e),null;case 5:cf(e);var r=Br(Sa.current);if(n=e.type,t!==null&&e.stateNode!=null)f_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(_e(166));return nn(e),null}if(t=Br(vi.current),$a(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[fi]=e,i[xa]=s,t=(e.mode&1)!==0,n){case"dialog":_t("cancel",i),_t("close",i);break;case"iframe":case"object":case"embed":_t("load",i);break;case"video":case"audio":for(r=0;r<Zo.length;r++)_t(Zo[r],i);break;case"source":_t("error",i);break;case"img":case"image":case"link":_t("error",i),_t("load",i);break;case"details":_t("toggle",i);break;case"input":Jf(i,s),_t("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},_t("invalid",i);break;case"textarea":tp(i,s),_t("invalid",i)}ph(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Za(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Za(i.textContent,a,t),r=["children",""+a]):ca.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&_t("scroll",i)}switch(n){case"input":Ha(i),ep(i,s,!0);break;case"textarea":Ha(i),np(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=ic)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=G0(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[fi]=e,t[xa]=i,d_(t,e,!1,!1),e.stateNode=t;e:{switch(o=mh(n,i),n){case"dialog":_t("cancel",t),_t("close",t),r=i;break;case"iframe":case"object":case"embed":_t("load",t),r=i;break;case"video":case"audio":for(r=0;r<Zo.length;r++)_t(Zo[r],t);r=i;break;case"source":_t("error",t),r=i;break;case"img":case"image":case"link":_t("error",t),_t("load",t),r=i;break;case"details":_t("toggle",t),r=i;break;case"input":Jf(t,i),r=ch(t,i),_t("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=At({},i,{value:void 0}),_t("invalid",t);break;case"textarea":tp(t,i),r=dh(t,i),_t("invalid",t);break;default:r=i}ph(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?X0(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&V0(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&ua(t,l):typeof l=="number"&&ua(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ca.hasOwnProperty(s)?l!=null&&s==="onScroll"&&_t("scroll",t):l!=null&&zd(t,s,l,o))}switch(n){case"input":Ha(t),ep(t,i,!1);break;case"textarea":Ha(t),np(t);break;case"option":i.value!=null&&t.setAttribute("value",""+mr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Vs(t,!!i.multiple,s,!1):i.defaultValue!=null&&Vs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=ic)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return nn(e),null;case 6:if(t&&e.stateNode!=null)p_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(_e(166));if(n=Br(Sa.current),Br(vi.current),$a(e)){if(i=e.stateNode,n=e.memoizedProps,i[fi]=e,(s=i.nodeValue!==n)&&(t=Ln,t!==null))switch(t.tag){case 3:Za(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Za(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[fi]=e,e.stateNode=i}return nn(e),null;case 13:if(xt(wt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Mt&&Pn!==null&&e.mode&1&&!(e.flags&128))Dg(),no(),e.flags|=98560,s=!1;else if(s=$a(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(_e(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(_e(317));s[fi]=e}else no(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;nn(e),s=!1}else ti!==null&&(Zh(ti),ti=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||wt.current&1?kt===0&&(kt=3):Mf())),e.updateQueue!==null&&(e.flags|=4),nn(e),null);case 4:return ro(),Hh(t,e),t===null&&_a(e.stateNode.containerInfo),nn(e),null;case 10:return sf(e.type._context),nn(e),null;case 17:return Sn(e.type)&&rc(),nn(e),null;case 19:if(xt(wt),s=e.memoizedState,s===null)return nn(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Lo(s,!1);else{if(kt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=hc(t),o!==null){for(e.flags|=128,Lo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return gt(wt,wt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Lt()>oo&&(e.flags|=128,i=!0,Lo(s,!1),e.lanes=4194304)}else{if(!i)if(t=hc(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Lo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Mt)return nn(e),null}else 2*Lt()-s.renderingStartTime>oo&&n!==1073741824&&(e.flags|=128,i=!0,Lo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Lt(),e.sibling=null,n=wt.current,gt(wt,i?n&1|2:n&1),e):(nn(e),null);case 22:case 23:return Sf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Rn&1073741824&&(nn(e),e.subtreeFlags&6&&(e.flags|=8192)):nn(e),null;case 24:return null;case 25:return null}throw Error(_e(156,e.tag))}function My(t,e){switch(ef(e),e.tag){case 1:return Sn(e.type)&&rc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return ro(),xt(yn),xt(cn),uf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return cf(e),null;case 13:if(xt(wt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(_e(340));no()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return xt(wt),null;case 4:return ro(),null;case 10:return sf(e.type._context),null;case 22:case 23:return Sf(),null;case 24:return null;default:return null}}var Ja=!1,on=!1,wy=typeof WeakSet=="function"?WeakSet:Set,Ie=null;function ks(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Rt(t,e,i)}else n.current=null}function Gh(t,e,n){try{n()}catch(i){Rt(t,e,i)}}var Xp=!1;function Ey(t,e){if(Th=ec,t=xg(),Qd(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,h=0,d=t,f=null;t:for(;;){for(var p;d!==n||r!==0&&d.nodeType!==3||(a=o+r),d!==s||i!==0&&d.nodeType!==3||(l=o+i),d.nodeType===3&&(o+=d.nodeValue.length),(p=d.firstChild)!==null;)f=d,d=p;for(;;){if(d===t)break t;if(f===n&&++c===r&&(a=o),f===s&&++h===i&&(l=o),(p=d.nextSibling)!==null)break;d=f,f=d.parentNode}d=p}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ah={focusedElem:t,selectionRange:n},ec=!1,Ie=e;Ie!==null;)if(e=Ie,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,Ie=t;else for(;Ie!==null;){e=Ie;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,m=v.memoizedState,u=e.stateNode,g=u.getSnapshotBeforeUpdate(e.elementType===e.type?x:Qn(e.type,x),m);u.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var _=e.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(_e(163))}}catch(y){Rt(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,Ie=t;break}Ie=e.return}return v=Xp,Xp=!1,v}function ia(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Gh(e,n,s)}r=r.next}while(r!==i)}}function Oc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Vh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function m_(t){var e=t.alternate;e!==null&&(t.alternate=null,m_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[fi],delete e[xa],delete e[bh],delete e[oy],delete e[ay])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function g_(t){return t.tag===5||t.tag===3||t.tag===4}function jp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||g_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Wh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=ic));else if(i!==4&&(t=t.child,t!==null))for(Wh(t,e,n),t=t.sibling;t!==null;)Wh(t,e,n),t=t.sibling}function Xh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Xh(t,e,n),t=t.sibling;t!==null;)Xh(t,e,n),t=t.sibling}var Zt=null,Jn=!1;function Vi(t,e,n){for(n=n.child;n!==null;)__(t,e,n),n=n.sibling}function __(t,e,n){if(_i&&typeof _i.onCommitFiberUnmount=="function")try{_i.onCommitFiberUnmount(bc,n)}catch{}switch(n.tag){case 5:on||ks(n,e);case 6:var i=Zt,r=Jn;Zt=null,Vi(t,e,n),Zt=i,Jn=r,Zt!==null&&(Jn?(t=Zt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Zt.removeChild(n.stateNode));break;case 18:Zt!==null&&(Jn?(t=Zt,n=n.stateNode,t.nodeType===8?gu(t.parentNode,n):t.nodeType===1&&gu(t,n),pa(t)):gu(Zt,n.stateNode));break;case 4:i=Zt,r=Jn,Zt=n.stateNode.containerInfo,Jn=!0,Vi(t,e,n),Zt=i,Jn=r;break;case 0:case 11:case 14:case 15:if(!on&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Gh(n,e,o),r=r.next}while(r!==i)}Vi(t,e,n);break;case 1:if(!on&&(ks(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){Rt(n,e,a)}Vi(t,e,n);break;case 21:Vi(t,e,n);break;case 22:n.mode&1?(on=(i=on)||n.memoizedState!==null,Vi(t,e,n),on=i):Vi(t,e,n);break;default:Vi(t,e,n)}}function Yp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new wy),e.forEach(function(i){var r=Iy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function qn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Zt=a.stateNode,Jn=!1;break e;case 3:Zt=a.stateNode.containerInfo,Jn=!0;break e;case 4:Zt=a.stateNode.containerInfo,Jn=!0;break e}a=a.return}if(Zt===null)throw Error(_e(160));__(s,o,r),Zt=null,Jn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Rt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)v_(e,t),e=e.sibling}function v_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(qn(e,t),li(t),i&4){try{ia(3,t,t.return),Oc(3,t)}catch(x){Rt(t,t.return,x)}try{ia(5,t,t.return)}catch(x){Rt(t,t.return,x)}}break;case 1:qn(e,t),li(t),i&512&&n!==null&&ks(n,n.return);break;case 5:if(qn(e,t),li(t),i&512&&n!==null&&ks(n,n.return),t.flags&32){var r=t.stateNode;try{ua(r,"")}catch(x){Rt(t,t.return,x)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&B0(r,s),mh(a,o);var c=mh(a,s);for(o=0;o<l.length;o+=2){var h=l[o],d=l[o+1];h==="style"?X0(r,d):h==="dangerouslySetInnerHTML"?V0(r,d):h==="children"?ua(r,d):zd(r,h,d,c)}switch(a){case"input":uh(r,s);break;case"textarea":H0(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Vs(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?Vs(r,!!s.multiple,s.defaultValue,!0):Vs(r,!!s.multiple,s.multiple?[]:"",!1))}r[xa]=s}catch(x){Rt(t,t.return,x)}}break;case 6:if(qn(e,t),li(t),i&4){if(t.stateNode===null)throw Error(_e(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(x){Rt(t,t.return,x)}}break;case 3:if(qn(e,t),li(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{pa(e.containerInfo)}catch(x){Rt(t,t.return,x)}break;case 4:qn(e,t),li(t);break;case 13:qn(e,t),li(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(xf=Lt())),i&4&&Yp(t);break;case 22:if(h=n!==null&&n.memoizedState!==null,t.mode&1?(on=(c=on)||h,qn(e,t),on=c):qn(e,t),li(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!h&&t.mode&1)for(Ie=t,h=t.child;h!==null;){for(d=Ie=h;Ie!==null;){switch(f=Ie,p=f.child,f.tag){case 0:case 11:case 14:case 15:ia(4,f,f.return);break;case 1:ks(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(x){Rt(i,n,x)}}break;case 5:ks(f,f.return);break;case 22:if(f.memoizedState!==null){Zp(d);continue}}p!==null?(p.return=f,Ie=p):Zp(d)}h=h.sibling}e:for(h=null,d=t;;){if(d.tag===5){if(h===null){h=d;try{r=d.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=d.stateNode,l=d.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=W0("display",o))}catch(x){Rt(t,t.return,x)}}}else if(d.tag===6){if(h===null)try{d.stateNode.nodeValue=c?"":d.memoizedProps}catch(x){Rt(t,t.return,x)}}else if((d.tag!==22&&d.tag!==23||d.memoizedState===null||d===t)&&d.child!==null){d.child.return=d,d=d.child;continue}if(d===t)break e;for(;d.sibling===null;){if(d.return===null||d.return===t)break e;h===d&&(h=null),d=d.return}h===d&&(h=null),d.sibling.return=d.return,d=d.sibling}}break;case 19:qn(e,t),li(t),i&4&&Yp(t);break;case 21:break;default:qn(e,t),li(t)}}function li(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(g_(n)){var i=n;break e}n=n.return}throw Error(_e(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(ua(r,""),i.flags&=-33);var s=jp(t);Xh(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=jp(t);Wh(t,a,o);break;default:throw Error(_e(161))}}catch(l){Rt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Ty(t,e,n){Ie=t,x_(t)}function x_(t,e,n){for(var i=(t.mode&1)!==0;Ie!==null;){var r=Ie,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Ja;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||on;a=Ja;var c=on;if(Ja=o,(on=l)&&!c)for(Ie=r;Ie!==null;)o=Ie,l=o.child,o.tag===22&&o.memoizedState!==null?$p(r):l!==null?(l.return=o,Ie=l):$p(r);for(;s!==null;)Ie=s,x_(s),s=s.sibling;Ie=r,Ja=a,on=c}qp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Ie=s):qp(t)}}function qp(t){for(;Ie!==null;){var e=Ie;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:on||Oc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!on)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Qn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Dp(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Dp(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var d=h.dehydrated;d!==null&&pa(d)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(_e(163))}on||e.flags&512&&Vh(e)}catch(f){Rt(e,e.return,f)}}if(e===t){Ie=null;break}if(n=e.sibling,n!==null){n.return=e.return,Ie=n;break}Ie=e.return}}function Zp(t){for(;Ie!==null;){var e=Ie;if(e===t){Ie=null;break}var n=e.sibling;if(n!==null){n.return=e.return,Ie=n;break}Ie=e.return}}function $p(t){for(;Ie!==null;){var e=Ie;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Oc(4,e)}catch(l){Rt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Rt(e,r,l)}}var s=e.return;try{Vh(e)}catch(l){Rt(e,s,l)}break;case 5:var o=e.return;try{Vh(e)}catch(l){Rt(e,o,l)}}}catch(l){Rt(e,e.return,l)}if(e===t){Ie=null;break}var a=e.sibling;if(a!==null){a.return=e.return,Ie=a;break}Ie=e.return}}var Ay=Math.ceil,pc=Bi.ReactCurrentDispatcher,_f=Bi.ReactCurrentOwner,Wn=Bi.ReactCurrentBatchConfig,at=0,Xt=null,Ut=null,Qt=0,Rn=0,zs=vr(0),kt=0,Ta=null,qr=0,kc=0,vf=0,ra=null,_n=null,xf=0,oo=1/0,Ri=null,mc=!1,jh=null,ur=null,el=!1,ir=null,gc=0,sa=0,Yh=null,Bl=-1,Hl=0;function fn(){return at&6?Lt():Bl!==-1?Bl:Bl=Lt()}function hr(t){return t.mode&1?at&2&&Qt!==0?Qt&-Qt:cy.transition!==null?(Hl===0&&(Hl=ig()),Hl):(t=dt,t!==0||(t=window.event,t=t===void 0?16:ug(t.type)),t):1}function ri(t,e,n,i){if(50<sa)throw sa=0,Yh=null,Error(_e(185));La(t,n,i),(!(at&2)||t!==Xt)&&(t===Xt&&(!(at&2)&&(kc|=n),kt===4&&er(t,Qt)),Mn(t,i),n===1&&at===0&&!(e.mode&1)&&(oo=Lt()+500,Nc&&xr()))}function Mn(t,e){var n=t.callbackNode;cx(t,e);var i=Jl(t,t===Xt?Qt:0);if(i===0)n!==null&&sp(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&sp(n),e===1)t.tag===0?ly(Kp.bind(null,t)):bg(Kp.bind(null,t)),ry(function(){!(at&6)&&xr()}),n=null;else{switch(rg(i)){case 1:n=Wd;break;case 4:n=tg;break;case 16:n=Ql;break;case 536870912:n=ng;break;default:n=Ql}n=C_(n,y_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function y_(t,e){if(Bl=-1,Hl=0,at&6)throw Error(_e(327));var n=t.callbackNode;if(qs()&&t.callbackNode!==n)return null;var i=Jl(t,t===Xt?Qt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=_c(t,i);else{e=i;var r=at;at|=2;var s=M_();(Xt!==t||Qt!==e)&&(Ri=null,oo=Lt()+500,Vr(t,e));do try{by();break}catch(a){S_(t,a)}while(!0);rf(),pc.current=s,at=r,Ut!==null?e=0:(Xt=null,Qt=0,e=kt)}if(e!==0){if(e===2&&(r=yh(t),r!==0&&(i=r,e=qh(t,r))),e===1)throw n=Ta,Vr(t,0),er(t,i),Mn(t,Lt()),n;if(e===6)er(t,i);else{if(r=t.current.alternate,!(i&30)&&!Cy(r)&&(e=_c(t,i),e===2&&(s=yh(t),s!==0&&(i=s,e=qh(t,s))),e===1))throw n=Ta,Vr(t,0),er(t,i),Mn(t,Lt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(_e(345));case 2:Nr(t,_n,Ri);break;case 3:if(er(t,i),(i&130023424)===i&&(e=xf+500-Lt(),10<e)){if(Jl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){fn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Rh(Nr.bind(null,t,_n,Ri),e);break}Nr(t,_n,Ri);break;case 4:if(er(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-ii(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Lt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Ay(i/1960))-i,10<i){t.timeoutHandle=Rh(Nr.bind(null,t,_n,Ri),i);break}Nr(t,_n,Ri);break;case 5:Nr(t,_n,Ri);break;default:throw Error(_e(329))}}}return Mn(t,Lt()),t.callbackNode===n?y_.bind(null,t):null}function qh(t,e){var n=ra;return t.current.memoizedState.isDehydrated&&(Vr(t,e).flags|=256),t=_c(t,e),t!==2&&(e=_n,_n=n,e!==null&&Zh(e)),t}function Zh(t){_n===null?_n=t:_n.push.apply(_n,t)}function Cy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!oi(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function er(t,e){for(e&=~vf,e&=~kc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ii(e),i=1<<n;t[n]=-1,e&=~i}}function Kp(t){if(at&6)throw Error(_e(327));qs();var e=Jl(t,0);if(!(e&1))return Mn(t,Lt()),null;var n=_c(t,e);if(t.tag!==0&&n===2){var i=yh(t);i!==0&&(e=i,n=qh(t,i))}if(n===1)throw n=Ta,Vr(t,0),er(t,e),Mn(t,Lt()),n;if(n===6)throw Error(_e(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Nr(t,_n,Ri),Mn(t,Lt()),null}function yf(t,e){var n=at;at|=1;try{return t(e)}finally{at=n,at===0&&(oo=Lt()+500,Nc&&xr())}}function Zr(t){ir!==null&&ir.tag===0&&!(at&6)&&qs();var e=at;at|=1;var n=Wn.transition,i=dt;try{if(Wn.transition=null,dt=1,t)return t()}finally{dt=i,Wn.transition=n,at=e,!(at&6)&&xr()}}function Sf(){Rn=zs.current,xt(zs)}function Vr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,iy(n)),Ut!==null)for(n=Ut.return;n!==null;){var i=n;switch(ef(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&rc();break;case 3:ro(),xt(yn),xt(cn),uf();break;case 5:cf(i);break;case 4:ro();break;case 13:xt(wt);break;case 19:xt(wt);break;case 10:sf(i.type._context);break;case 22:case 23:Sf()}n=n.return}if(Xt=t,Ut=t=dr(t.current,null),Qt=Rn=e,kt=0,Ta=null,vf=kc=qr=0,_n=ra=null,zr!==null){for(e=0;e<zr.length;e++)if(n=zr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}zr=null}return t}function S_(t,e){do{var n=Ut;try{if(rf(),Ol.current=fc,dc){for(var i=Tt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}dc=!1}if(Yr=0,Vt=Ot=Tt=null,na=!1,Ma=0,_f.current=null,n===null||n.return===null){kt=1,Ta=e,Ut=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Qt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=a,d=h.tag;if(!(h.mode&1)&&(d===0||d===11||d===15)){var f=h.alternate;f?(h.updateQueue=f.updateQueue,h.memoizedState=f.memoizedState,h.lanes=f.lanes):(h.updateQueue=null,h.memoizedState=null)}var p=kp(o);if(p!==null){p.flags&=-257,zp(p,o,a,s,e),p.mode&1&&Op(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var x=new Set;x.add(l),e.updateQueue=x}else v.add(l);break e}else{if(!(e&1)){Op(s,c,e),Mf();break e}l=Error(_e(426))}}else if(Mt&&a.mode&1){var m=kp(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),zp(m,o,a,s,e),tf(so(l,a));break e}}s=l=so(l,a),kt!==4&&(kt=2),ra===null?ra=[s]:ra.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=r_(s,l,e);Lp(s,u);break e;case 1:a=l;var g=s.type,_=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(ur===null||!ur.has(_)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=s_(s,a,e);Lp(s,y);break e}}s=s.return}while(s!==null)}E_(n)}catch(R){e=R,Ut===n&&n!==null&&(Ut=n=n.return);continue}break}while(!0)}function M_(){var t=pc.current;return pc.current=fc,t===null?fc:t}function Mf(){(kt===0||kt===3||kt===2)&&(kt=4),Xt===null||!(qr&268435455)&&!(kc&268435455)||er(Xt,Qt)}function _c(t,e){var n=at;at|=2;var i=M_();(Xt!==t||Qt!==e)&&(Ri=null,Vr(t,e));do try{Ry();break}catch(r){S_(t,r)}while(!0);if(rf(),at=n,pc.current=i,Ut!==null)throw Error(_e(261));return Xt=null,Qt=0,kt}function Ry(){for(;Ut!==null;)w_(Ut)}function by(){for(;Ut!==null&&!ex();)w_(Ut)}function w_(t){var e=A_(t.alternate,t,Rn);t.memoizedProps=t.pendingProps,e===null?E_(t):Ut=e,_f.current=null}function E_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=My(n,e),n!==null){n.flags&=32767,Ut=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{kt=6,Ut=null;return}}else if(n=Sy(n,e,Rn),n!==null){Ut=n;return}if(e=e.sibling,e!==null){Ut=e;return}Ut=e=t}while(e!==null);kt===0&&(kt=5)}function Nr(t,e,n){var i=dt,r=Wn.transition;try{Wn.transition=null,dt=1,Py(t,e,n,i)}finally{Wn.transition=r,dt=i}return null}function Py(t,e,n,i){do qs();while(ir!==null);if(at&6)throw Error(_e(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(_e(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(ux(t,s),t===Xt&&(Ut=Xt=null,Qt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||el||(el=!0,C_(Ql,function(){return qs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Wn.transition,Wn.transition=null;var o=dt;dt=1;var a=at;at|=4,_f.current=null,Ey(t,n),v_(n,t),$x(Ah),ec=!!Th,Ah=Th=null,t.current=n,Ty(n),tx(),at=a,dt=o,Wn.transition=s}else t.current=n;if(el&&(el=!1,ir=t,gc=r),s=t.pendingLanes,s===0&&(ur=null),rx(n.stateNode),Mn(t,Lt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(mc)throw mc=!1,t=jh,jh=null,t;return gc&1&&t.tag!==0&&qs(),s=t.pendingLanes,s&1?t===Yh?sa++:(sa=0,Yh=t):sa=0,xr(),null}function qs(){if(ir!==null){var t=rg(gc),e=Wn.transition,n=dt;try{if(Wn.transition=null,dt=16>t?16:t,ir===null)var i=!1;else{if(t=ir,ir=null,gc=0,at&6)throw Error(_e(331));var r=at;for(at|=4,Ie=t.current;Ie!==null;){var s=Ie,o=s.child;if(Ie.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(Ie=c;Ie!==null;){var h=Ie;switch(h.tag){case 0:case 11:case 15:ia(8,h,s)}var d=h.child;if(d!==null)d.return=h,Ie=d;else for(;Ie!==null;){h=Ie;var f=h.sibling,p=h.return;if(m_(h),h===c){Ie=null;break}if(f!==null){f.return=p,Ie=f;break}Ie=p}}}var v=s.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var m=x.sibling;x.sibling=null,x=m}while(x!==null)}}Ie=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,Ie=o;else e:for(;Ie!==null;){if(s=Ie,s.flags&2048)switch(s.tag){case 0:case 11:case 15:ia(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,Ie=u;break e}Ie=s.return}}var g=t.current;for(Ie=g;Ie!==null;){o=Ie;var _=o.child;if(o.subtreeFlags&2064&&_!==null)_.return=o,Ie=_;else e:for(o=g;Ie!==null;){if(a=Ie,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Oc(9,a)}}catch(R){Rt(a,a.return,R)}if(a===o){Ie=null;break e}var y=a.sibling;if(y!==null){y.return=a.return,Ie=y;break e}Ie=a.return}}if(at=r,xr(),_i&&typeof _i.onPostCommitFiberRoot=="function")try{_i.onPostCommitFiberRoot(bc,t)}catch{}i=!0}return i}finally{dt=n,Wn.transition=e}}return!1}function Qp(t,e,n){e=so(n,e),e=r_(t,e,1),t=cr(t,e,1),e=fn(),t!==null&&(La(t,1,e),Mn(t,e))}function Rt(t,e,n){if(t.tag===3)Qp(t,t,n);else for(;e!==null;){if(e.tag===3){Qp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(ur===null||!ur.has(i))){t=so(n,t),t=s_(e,t,1),e=cr(e,t,1),t=fn(),e!==null&&(La(e,1,t),Mn(e,t));break}}e=e.return}}function Ly(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=fn(),t.pingedLanes|=t.suspendedLanes&n,Xt===t&&(Qt&n)===n&&(kt===4||kt===3&&(Qt&130023424)===Qt&&500>Lt()-xf?Vr(t,0):vf|=n),Mn(t,e)}function T_(t,e){e===0&&(t.mode&1?(e=Wa,Wa<<=1,!(Wa&130023424)&&(Wa=4194304)):e=1);var n=fn();t=Oi(t,e),t!==null&&(La(t,e,n),Mn(t,n))}function Dy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),T_(t,n)}function Iy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(_e(314))}i!==null&&i.delete(e),T_(t,n)}var A_;A_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||yn.current)vn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return vn=!1,yy(t,e,n);vn=!!(t.flags&131072)}else vn=!1,Mt&&e.flags&1048576&&Pg(e,ac,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;zl(t,e),t=e.pendingProps;var r=to(e,cn.current);Ys(e,n),r=df(null,e,i,t,r,n);var s=ff();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Sn(i)?(s=!0,sc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,af(e),r.updater=Fc,e.stateNode=r,r._reactInternals=e,Uh(e,i,t,n),e=kh(null,e,i,!0,s,n)):(e.tag=0,Mt&&s&&Jd(e),dn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(zl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Uy(i),t=Qn(i,t),r){case 0:e=Oh(null,e,i,t,n);break e;case 1:e=Gp(null,e,i,t,n);break e;case 11:e=Bp(null,e,i,t,n);break e;case 14:e=Hp(null,e,i,Qn(i.type,t),n);break e}throw Error(_e(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Qn(i,r),Oh(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Qn(i,r),Gp(t,e,i,r,n);case 3:e:{if(c_(e),t===null)throw Error(_e(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Fg(t,e),uc(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=so(Error(_e(423)),e),e=Vp(t,e,i,n,r);break e}else if(i!==r){r=so(Error(_e(424)),e),e=Vp(t,e,i,n,r);break e}else for(Pn=lr(e.stateNode.containerInfo.firstChild),Ln=e,Mt=!0,ti=null,n=Ng(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(no(),i===r){e=ki(t,e,n);break e}dn(t,e,i,n)}e=e.child}return e;case 5:return Og(e),t===null&&Dh(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,Ch(i,r)?o=null:s!==null&&Ch(i,s)&&(e.flags|=32),l_(t,e),dn(t,e,o,n),e.child;case 6:return t===null&&Dh(e),null;case 13:return u_(t,e,n);case 4:return lf(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=io(e,null,i,n):dn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Qn(i,r),Bp(t,e,i,r,n);case 7:return dn(t,e,e.pendingProps,n),e.child;case 8:return dn(t,e,e.pendingProps.children,n),e.child;case 12:return dn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,gt(lc,i._currentValue),i._currentValue=o,s!==null)if(oi(s.value,o)){if(s.children===r.children&&!yn.current){e=ki(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ni(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Ih(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(_e(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),Ih(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}dn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ys(e,n),r=Xn(r),i=i(r),e.flags|=1,dn(t,e,i,n),e.child;case 14:return i=e.type,r=Qn(i,e.pendingProps),r=Qn(i.type,r),Hp(t,e,i,r,n);case 15:return o_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Qn(i,r),zl(t,e),e.tag=1,Sn(i)?(t=!0,sc(e)):t=!1,Ys(e,n),i_(e,i,r),Uh(e,i,r,n),kh(null,e,i,!0,t,n);case 19:return h_(t,e,n);case 22:return a_(t,e,n)}throw Error(_e(156,e.tag))};function C_(t,e){return eg(t,e)}function Ny(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Gn(t,e,n,i){return new Ny(t,e,n,i)}function wf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Uy(t){if(typeof t=="function")return wf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Hd)return 11;if(t===Gd)return 14}return 2}function dr(t,e){var n=t.alternate;return n===null?(n=Gn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Gl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")wf(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case bs:return Wr(n.children,r,s,e);case Bd:o=8,r|=8;break;case sh:return t=Gn(12,n,e,r|2),t.elementType=sh,t.lanes=s,t;case oh:return t=Gn(13,n,e,r),t.elementType=oh,t.lanes=s,t;case ah:return t=Gn(19,n,e,r),t.elementType=ah,t.lanes=s,t;case O0:return zc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case U0:o=10;break e;case F0:o=9;break e;case Hd:o=11;break e;case Gd:o=14;break e;case $i:o=16,i=null;break e}throw Error(_e(130,t==null?t:typeof t,""))}return e=Gn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Wr(t,e,n,i){return t=Gn(7,t,i,e),t.lanes=n,t}function zc(t,e,n,i){return t=Gn(22,t,i,e),t.elementType=O0,t.lanes=n,t.stateNode={isHidden:!1},t}function Eu(t,e,n){return t=Gn(6,t,null,e),t.lanes=n,t}function Tu(t,e,n){return e=Gn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Fy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=su(0),this.expirationTimes=su(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=su(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Ef(t,e,n,i,r,s,o,a,l){return t=new Fy(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Gn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},af(s),t}function Oy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Rs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function R_(t){if(!t)return gr;t=t._reactInternals;e:{if(Jr(t)!==t||t.tag!==1)throw Error(_e(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Sn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(_e(171))}if(t.tag===1){var n=t.type;if(Sn(n))return Rg(t,n,e)}return e}function b_(t,e,n,i,r,s,o,a,l){return t=Ef(n,i,!0,t,r,s,o,a,l),t.context=R_(null),n=t.current,i=fn(),r=hr(n),s=Ni(i,r),s.callback=e??null,cr(n,s,r),t.current.lanes=r,La(t,r,i),Mn(t,i),t}function Bc(t,e,n,i){var r=e.current,s=fn(),o=hr(r);return n=R_(n),e.context===null?e.context=n:e.pendingContext=n,e=Ni(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=cr(r,e,o),t!==null&&(ri(t,r,o,s),Fl(t,r,o)),o}function vc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Jp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Tf(t,e){Jp(t,e),(t=t.alternate)&&Jp(t,e)}function ky(){return null}var P_=typeof reportError=="function"?reportError:function(t){console.error(t)};function Af(t){this._internalRoot=t}Hc.prototype.render=Af.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(_e(409));Bc(t,e,null,null)};Hc.prototype.unmount=Af.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Zr(function(){Bc(null,t,null,null)}),e[Fi]=null}};function Hc(t){this._internalRoot=t}Hc.prototype.unstable_scheduleHydration=function(t){if(t){var e=ag();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Ji.length&&e!==0&&e<Ji[n].priority;n++);Ji.splice(n,0,t),n===0&&cg(t)}};function Cf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Gc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function em(){}function zy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=vc(o);s.call(c)}}var o=b_(e,i,t,0,null,!1,!1,"",em);return t._reactRootContainer=o,t[Fi]=o.current,_a(t.nodeType===8?t.parentNode:t),Zr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=vc(l);a.call(c)}}var l=Ef(t,0,!1,null,null,!1,!1,"",em);return t._reactRootContainer=l,t[Fi]=l.current,_a(t.nodeType===8?t.parentNode:t),Zr(function(){Bc(e,l,n,i)}),l}function Vc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=vc(o);a.call(l)}}Bc(e,o,t,r)}else o=zy(n,e,t,r,i);return vc(o)}sg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=qo(e.pendingLanes);n!==0&&(Xd(e,n|1),Mn(e,Lt()),!(at&6)&&(oo=Lt()+500,xr()))}break;case 13:Zr(function(){var i=Oi(t,1);if(i!==null){var r=fn();ri(i,t,1,r)}}),Tf(t,1)}};jd=function(t){if(t.tag===13){var e=Oi(t,134217728);if(e!==null){var n=fn();ri(e,t,134217728,n)}Tf(t,134217728)}};og=function(t){if(t.tag===13){var e=hr(t),n=Oi(t,e);if(n!==null){var i=fn();ri(n,t,e,i)}Tf(t,e)}};ag=function(){return dt};lg=function(t,e){var n=dt;try{return dt=t,e()}finally{dt=n}};_h=function(t,e,n){switch(e){case"input":if(uh(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Ic(i);if(!r)throw Error(_e(90));z0(i),uh(i,r)}}}break;case"textarea":H0(t,n);break;case"select":e=n.value,e!=null&&Vs(t,!!n.multiple,e,!1)}};q0=yf;Z0=Zr;var By={usingClientEntryPoint:!1,Events:[Ia,Is,Ic,j0,Y0,yf]},Do={findFiberByHostInstance:kr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Hy={bundleType:Do.bundleType,version:Do.version,rendererPackageName:Do.rendererPackageName,rendererConfig:Do.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Bi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Q0(t),t===null?null:t.stateNode},findFiberByHostInstance:Do.findFiberByHostInstance||ky,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var tl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!tl.isDisabled&&tl.supportsFiber)try{bc=tl.inject(Hy),_i=tl}catch{}}In.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=By;In.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Cf(e))throw Error(_e(200));return Oy(t,e,null,n)};In.createRoot=function(t,e){if(!Cf(t))throw Error(_e(299));var n=!1,i="",r=P_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Ef(t,1,!1,null,null,n,!1,i,r),t[Fi]=e.current,_a(t.nodeType===8?t.parentNode:t),new Af(e)};In.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(_e(188)):(t=Object.keys(t).join(","),Error(_e(268,t)));return t=Q0(e),t=t===null?null:t.stateNode,t};In.flushSync=function(t){return Zr(t)};In.hydrate=function(t,e,n){if(!Gc(e))throw Error(_e(200));return Vc(null,t,e,!0,n)};In.hydrateRoot=function(t,e,n){if(!Cf(t))throw Error(_e(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=P_;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=b_(e,null,t,1,n??null,r,!1,s,o),t[Fi]=e.current,_a(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new Hc(e)};In.render=function(t,e,n){if(!Gc(e))throw Error(_e(200));return Vc(null,t,e,!1,n)};In.unmountComponentAtNode=function(t){if(!Gc(t))throw Error(_e(40));return t._reactRootContainer?(Zr(function(){Vc(null,null,t,!1,function(){t._reactRootContainer=null,t[Fi]=null})}),!0):!1};In.unstable_batchedUpdates=yf;In.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Gc(n))throw Error(_e(200));if(t==null||t._reactInternals===void 0)throw Error(_e(38));return Vc(t,e,n,!1,i)};In.version="18.3.1-next-f1338f8080-20240426";function L_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(L_)}catch(t){console.error(t)}}L_(),L0.exports=In;var Gy=L0.exports,tm=Gy;ih.createRoot=tm.createRoot,ih.hydrateRoot=tm.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Rf="168",Zs={ROTATE:0,DOLLY:1,PAN:2},Bs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Vy=0,nm=1,Wy=2,D_=1,I_=2,Ci=3,xi=0,wn=1,Hn=2,fr=0,$s=1,$h=2,im=3,rm=4,Xy=5,Fr=100,jy=101,Yy=102,qy=103,Zy=104,$y=200,Ky=201,Qy=202,Jy=203,Kh=204,Qh=205,eS=206,tS=207,nS=208,iS=209,rS=210,sS=211,oS=212,aS=213,lS=214,cS=0,uS=1,hS=2,xc=3,dS=4,fS=5,pS=6,mS=7,N_=0,gS=1,_S=2,pr=0,vS=1,xS=2,yS=3,U_=4,SS=5,MS=6,wS=7,F_=300,ao=301,lo=302,Jh=303,ed=304,Wc=306,td=1e3,Di=1001,nd=1002,xn=1003,ES=1004,nl=1005,bn=1006,Au=1007,Hr=1008,yi=1009,O_=1010,k_=1011,Aa=1012,bf=1013,$r=1014,pi=1015,_o=1016,Pf=1017,Lf=1018,co=1020,z_=35902,B_=1021,H_=1022,Vn=1023,G_=1024,V_=1025,Ks=1026,uo=1027,Df=1028,If=1029,W_=1030,Nf=1031,Uf=1033,Vl=33776,Wl=33777,Xl=33778,jl=33779,id=35840,rd=35841,sd=35842,od=35843,ad=36196,ld=37492,cd=37496,ud=37808,hd=37809,dd=37810,fd=37811,pd=37812,md=37813,gd=37814,_d=37815,vd=37816,xd=37817,yd=37818,Sd=37819,Md=37820,wd=37821,Yl=36492,Ed=36494,Td=36495,X_=36283,Ad=36284,Cd=36285,Rd=36286,TS=3200,AS=3201,j_=0,CS=1,tr="",ei="srgb",yr="srgb-linear",Ff="display-p3",Xc="display-p3-linear",yc="linear",vt="srgb",Sc="rec709",Mc="p3",as=7680,sm=519,RS=512,bS=513,PS=514,Y_=515,LS=516,DS=517,IS=518,NS=519,om=35044,am="300 es",Ii=2e3,wc=2001;class es{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const rn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let lm=1234567;const Qs=Math.PI/180,Ca=180/Math.PI;function vo(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(rn[t&255]+rn[t>>8&255]+rn[t>>16&255]+rn[t>>24&255]+"-"+rn[e&255]+rn[e>>8&255]+"-"+rn[e>>16&15|64]+rn[e>>24&255]+"-"+rn[n&63|128]+rn[n>>8&255]+"-"+rn[n>>16&255]+rn[n>>24&255]+rn[i&255]+rn[i>>8&255]+rn[i>>16&255]+rn[i>>24&255]).toLowerCase()}function an(t,e,n){return Math.max(e,Math.min(n,t))}function Of(t,e){return(t%e+e)%e}function US(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function FS(t,e,n){return t!==e?(n-t)/(e-t):0}function oa(t,e,n){return(1-n)*t+n*e}function OS(t,e,n,i){return oa(t,e,1-Math.exp(-n*i))}function kS(t,e=1){return e-Math.abs(Of(t,e*2)-e)}function zS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function BS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function HS(t,e){return t+Math.floor(Math.random()*(e-t+1))}function GS(t,e){return t+Math.random()*(e-t)}function VS(t){return t*(.5-Math.random())}function WS(t){t!==void 0&&(lm=t);let e=lm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function XS(t){return t*Qs}function jS(t){return t*Ca}function YS(t){return(t&t-1)===0&&t!==0}function qS(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function ZS(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function $S(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),h=o((e+i)/2),d=s((e-i)/2),f=o((e-i)/2),p=s((i-e)/2),v=o((i-e)/2);switch(r){case"XYX":t.set(a*h,l*d,l*f,a*c);break;case"YZY":t.set(l*f,a*h,l*d,a*c);break;case"ZXZ":t.set(l*d,l*f,a*h,a*c);break;case"XZX":t.set(a*h,l*v,l*p,a*c);break;case"YXY":t.set(l*p,a*h,l*v,a*c);break;case"ZYZ":t.set(l*v,l*p,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function As(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function un(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const bt={DEG2RAD:Qs,RAD2DEG:Ca,generateUUID:vo,clamp:an,euclideanModulo:Of,mapLinear:US,inverseLerp:FS,lerp:oa,damp:OS,pingpong:kS,smoothstep:zS,smootherstep:BS,randInt:HS,randFloat:GS,randFloatSpread:VS,seededRandom:WS,degToRad:XS,radToDeg:jS,isPowerOfTwo:YS,ceilPowerOfTwo:qS,floorPowerOfTwo:ZS,setQuaternionFromProperEuler:$S,normalize:un,denormalize:As};class Pe{constructor(e=0,n=0){Pe.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(an(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $e{constructor(e,n,i,r,s,o,a,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=n,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],d=i[7],f=i[2],p=i[5],v=i[8],x=r[0],m=r[3],u=r[6],g=r[1],_=r[4],y=r[7],R=r[2],w=r[5],T=r[8];return s[0]=o*x+a*g+l*R,s[3]=o*m+a*_+l*w,s[6]=o*u+a*y+l*T,s[1]=c*x+h*g+d*R,s[4]=c*m+h*_+d*w,s[7]=c*u+h*y+d*T,s[2]=f*x+p*g+v*R,s[5]=f*m+p*_+v*w,s[8]=f*u+p*y+v*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return n*o*h-n*a*c-i*s*h+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=h*o-a*c,f=a*l-h*s,p=c*s-o*l,v=n*d+i*f+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=d*x,e[1]=(r*c-h*i)*x,e[2]=(a*i-r*o)*x,e[3]=f*x,e[4]=(h*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=p*x,e[7]=(i*l-c*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Cu.makeScale(e,n)),this}rotate(e){return this.premultiply(Cu.makeRotation(-e)),this}translate(e,n){return this.premultiply(Cu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Cu=new $e;function q_(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Ec(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function KS(){const t=Ec("canvas");return t.style.display="block",t}const cm={};function aa(t){t in cm||(cm[t]=!0,console.warn(t))}function QS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const um=new $e().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),hm=new $e().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Io={[yr]:{transfer:yc,primaries:Sc,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[ei]:{transfer:vt,primaries:Sc,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[Xc]:{transfer:yc,primaries:Mc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(hm),fromReference:t=>t.applyMatrix3(um)},[Ff]:{transfer:vt,primaries:Mc,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(hm),fromReference:t=>t.applyMatrix3(um).convertLinearToSRGB()}},JS=new Set([yr,Xc]),ut={enabled:!0,_workingColorSpace:yr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!JS.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=Io[e].toReference,r=Io[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return Io[t].primaries},getTransfer:function(t){return t===tr?yc:Io[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(Io[e].luminanceCoefficients)}};function Js(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ru(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let ls;class eM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ls===void 0&&(ls=Ec("canvas")),ls.width=e.width,ls.height=e.height;const i=ls.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ls}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Ec("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Js(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Js(n[i]/255)*255):n[i]=Js(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let tM=0;class Z_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:tM++}),this.uuid=vo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(bu(r[o].image)):s.push(bu(r[o]))}else s=bu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function bu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?eM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let nM=0;class ln extends es{constructor(e=ln.DEFAULT_IMAGE,n=ln.DEFAULT_MAPPING,i=Di,r=Di,s=bn,o=Hr,a=Vn,l=yi,c=ln.DEFAULT_ANISOTROPY,h=tr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nM++}),this.uuid=vo(),this.name="",this.source=new Z_(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Pe(0,0),this.repeat=new Pe(1,1),this.center=new Pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==F_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case td:e.x=e.x-Math.floor(e.x);break;case Di:e.x=e.x<0?0:1;break;case nd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case td:e.y=e.y-Math.floor(e.y);break;case Di:e.y=e.y<0?0:1;break;case nd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=F_;ln.DEFAULT_ANISOTROPY=1;class mt{constructor(e=0,n=0,i=0,r=1){mt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],h=l[4],d=l[8],f=l[1],p=l[5],v=l[9],x=l[2],m=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-x)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+x)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const _=(c+1)/2,y=(p+1)/2,R=(u+1)/2,w=(h+f)/4,T=(d+x)/4,A=(v+m)/4;return _>y&&_>R?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=w/i,s=T/i):y>R?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=w/r,s=A/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=T/s,r=A/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-v)*(m-v)+(d-x)*(d-x)+(f-h)*(f-h));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(d-x)/g,this.z=(f-h)/g,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class iM extends es{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new mt(0,0,e,n),this.scissorTest=!1,this.viewport=new mt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new ln(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Z_(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends iM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class $_ extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=xn,this.minFilter=xn,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class rM extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=xn,this.minFilter=xn,this.wrapR=Di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Kr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],h=i[r+2],d=i[r+3];const f=s[o+0],p=s[o+1],v=s[o+2],x=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=h,e[n+3]=d;return}if(a===1){e[n+0]=f,e[n+1]=p,e[n+2]=v,e[n+3]=x;return}if(d!==x||l!==f||c!==p||h!==v){let m=1-a;const u=l*f+c*p+h*v+d*x,g=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){const R=Math.sqrt(_),w=Math.atan2(R,u*g);m=Math.sin(m*w)/R,a=Math.sin(a*w)/R}const y=a*g;if(l=l*m+f*y,c=c*m+p*y,h=h*m+v*y,d=d*m+x*y,m===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}e[n]=l,e[n+1]=c,e[n+2]=h,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],h=i[r+3],d=s[o],f=s[o+1],p=s[o+2],v=s[o+3];return e[n]=a*v+h*d+l*p-c*f,e[n+1]=l*v+h*f+c*d-a*p,e[n+2]=c*v+h*p+a*f-l*d,e[n+3]=h*v-a*d-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(r/2),d=a(s/2),f=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=f*h*d+c*p*v,this._y=c*p*d-f*h*v,this._z=c*h*v+f*p*d,this._w=c*h*d-f*p*v;break;case"YXZ":this._x=f*h*d+c*p*v,this._y=c*p*d-f*h*v,this._z=c*h*v-f*p*d,this._w=c*h*d+f*p*v;break;case"ZXY":this._x=f*h*d-c*p*v,this._y=c*p*d+f*h*v,this._z=c*h*v+f*p*d,this._w=c*h*d-f*p*v;break;case"ZYX":this._x=f*h*d-c*p*v,this._y=c*p*d+f*h*v,this._z=c*h*v-f*p*d,this._w=c*h*d+f*p*v;break;case"YZX":this._x=f*h*d+c*p*v,this._y=c*p*d+f*h*v,this._z=c*h*v-f*p*d,this._w=c*h*d-f*p*v;break;case"XZY":this._x=f*h*d-c*p*v,this._y=c*p*d-f*h*v,this._z=c*h*v+f*p*d,this._w=c*h*d+f*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],h=n[6],d=n[10],f=i+a+d;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>d){const p=2*Math.sqrt(1+i-a-d);this._w=(h-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-i-d);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(an(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,h=n._w;return this._x=i*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-i*c,this._z=s*h+o*c+i*l-r*a,this._w=o*h-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-n)*h)/c,f=Math.sin(n*h)/c;return this._w=o*d+this._w*f,this._x=i*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,n=0,i=0){O.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(dm.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(dm.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),h=2*(a*n-s*r),d=2*(s*i-o*n);return this.x=n+l*c+o*d-a*h,this.y=i+l*h+a*c-s*d,this.z=r+l*d+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Pu.copy(this).projectOnVector(e),this.sub(Pu)}reflect(e){return this.sub(Pu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(an(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pu=new O,dm=new Kr;class ts{constructor(e=new O(1/0,1/0,1/0),n=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Zn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Zn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Zn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Zn):Zn.fromBufferAttribute(s,o),Zn.applyMatrix4(e.matrixWorld),this.expandByPoint(Zn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),il.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),il.copy(i.boundingBox)),il.applyMatrix4(e.matrixWorld),this.union(il)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zn),Zn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(No),rl.subVectors(this.max,No),cs.subVectors(e.a,No),us.subVectors(e.b,No),hs.subVectors(e.c,No),Wi.subVectors(us,cs),Xi.subVectors(hs,us),Tr.subVectors(cs,hs);let n=[0,-Wi.z,Wi.y,0,-Xi.z,Xi.y,0,-Tr.z,Tr.y,Wi.z,0,-Wi.x,Xi.z,0,-Xi.x,Tr.z,0,-Tr.x,-Wi.y,Wi.x,0,-Xi.y,Xi.x,0,-Tr.y,Tr.x,0];return!Lu(n,cs,us,hs,rl)||(n=[1,0,0,0,1,0,0,0,1],!Lu(n,cs,us,hs,rl))?!1:(sl.crossVectors(Wi,Xi),n=[sl.x,sl.y,sl.z],Lu(n,cs,us,hs,rl))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mi=[new O,new O,new O,new O,new O,new O,new O,new O],Zn=new O,il=new ts,cs=new O,us=new O,hs=new O,Wi=new O,Xi=new O,Tr=new O,No=new O,rl=new O,sl=new O,Ar=new O;function Lu(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Ar.fromArray(t,s);const a=r.x*Math.abs(Ar.x)+r.y*Math.abs(Ar.y)+r.z*Math.abs(Ar.z),l=e.dot(Ar),c=n.dot(Ar),h=i.dot(Ar);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const sM=new ts,Uo=new O,Du=new O;class xo{constructor(e=new O,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):sM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Uo.subVectors(e,this.center);const n=Uo.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Uo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Du.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Uo.copy(e.center).add(Du)),this.expandByPoint(Uo.copy(e.center).sub(Du))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wi=new O,Iu=new O,ol=new O,ji=new O,Nu=new O,al=new O,Uu=new O;class jc{constructor(e=new O,n=new O(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=wi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(wi.copy(this.origin).addScaledVector(this.direction,n),wi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Iu.copy(e).add(n).multiplyScalar(.5),ol.copy(n).sub(e).normalize(),ji.copy(this.origin).sub(Iu);const s=e.distanceTo(n)*.5,o=-this.direction.dot(ol),a=ji.dot(this.direction),l=-ji.dot(ol),c=ji.lengthSq(),h=Math.abs(1-o*o);let d,f,p,v;if(h>0)if(d=o*l-a,f=o*a-l,v=s*h,d>=0)if(f>=-v)if(f<=v){const x=1/h;d*=x,f*=x,p=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=s,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;else f<=-v?(d=Math.max(0,-(-o*s+a)),f=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+f*(f+2*l)+c):f<=v?(d=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(d=Math.max(0,-(o*s+a)),f=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+f*(f+2*l)+c);else f=o>0?-s:s,d=Math.max(0,-(o*f+a)),p=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Iu).addScaledVector(ol,f),p}intersectSphere(e,n){wi.subVectors(e.center,this.origin);const i=wi.dot(this.direction),r=wi.dot(wi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,wi)!==null}intersectTriangle(e,n,i,r,s){Nu.subVectors(n,e),al.subVectors(i,e),Uu.crossVectors(Nu,al);let o=this.direction.dot(Uu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ji.subVectors(this.origin,e);const l=a*this.direction.dot(al.crossVectors(ji,al));if(l<0)return null;const c=a*this.direction.dot(Nu.cross(ji));if(c<0||l+c>o)return null;const h=-a*ji.dot(Uu);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,n,i,r,s,o,a,l,c,h,d,f,p,v,x,m){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,h,d,f,p,v,x,m)}set(e,n,i,r,s,o,a,l,c,h,d,f,p,v,x,m){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=p,u[7]=v,u[11]=x,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ds.setFromMatrixColumn(e,0).length(),s=1/ds.setFromMatrixColumn(e,1).length(),o=1/ds.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=o*h,p=o*d,v=a*h,x=a*d;n[0]=l*h,n[4]=-l*d,n[8]=c,n[1]=p+v*c,n[5]=f-x*c,n[9]=-a*l,n[2]=x-f*c,n[6]=v+p*c,n[10]=o*l}else if(e.order==="YXZ"){const f=l*h,p=l*d,v=c*h,x=c*d;n[0]=f+x*a,n[4]=v*a-p,n[8]=o*c,n[1]=o*d,n[5]=o*h,n[9]=-a,n[2]=p*a-v,n[6]=x+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*h,p=l*d,v=c*h,x=c*d;n[0]=f-x*a,n[4]=-o*d,n[8]=v+p*a,n[1]=p+v*a,n[5]=o*h,n[9]=x-f*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*h,p=o*d,v=a*h,x=a*d;n[0]=l*h,n[4]=v*c-p,n[8]=f*c+x,n[1]=l*d,n[5]=x*c+f,n[9]=p*c-v,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,v=a*l,x=a*c;n[0]=l*h,n[4]=x-f*d,n[8]=v*d+p,n[1]=d,n[5]=o*h,n[9]=-a*h,n[2]=-c*h,n[6]=p*d+v,n[10]=f-x*d}else if(e.order==="XZY"){const f=o*l,p=o*c,v=a*l,x=a*c;n[0]=l*h,n[4]=-d,n[8]=c*h,n[1]=f*d+x,n[5]=o*h,n[9]=p*d-v,n[2]=v*d-p,n[6]=a*h,n[10]=x*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(oM,e,aM)}lookAt(e,n,i){const r=this.elements;return Tn.subVectors(e,n),Tn.lengthSq()===0&&(Tn.z=1),Tn.normalize(),Yi.crossVectors(i,Tn),Yi.lengthSq()===0&&(Math.abs(i.z)===1?Tn.x+=1e-4:Tn.z+=1e-4,Tn.normalize(),Yi.crossVectors(i,Tn)),Yi.normalize(),ll.crossVectors(Tn,Yi),r[0]=Yi.x,r[4]=ll.x,r[8]=Tn.x,r[1]=Yi.y,r[5]=ll.y,r[9]=Tn.y,r[2]=Yi.z,r[6]=ll.z,r[10]=Tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],d=i[5],f=i[9],p=i[13],v=i[2],x=i[6],m=i[10],u=i[14],g=i[3],_=i[7],y=i[11],R=i[15],w=r[0],T=r[4],A=r[8],M=r[12],S=r[1],P=r[5],z=r[9],B=r[13],W=r[2],ne=r[6],Y=r[10],Q=r[14],D=r[3],q=r[7],J=r[11],se=r[15];return s[0]=o*w+a*S+l*W+c*D,s[4]=o*T+a*P+l*ne+c*q,s[8]=o*A+a*z+l*Y+c*J,s[12]=o*M+a*B+l*Q+c*se,s[1]=h*w+d*S+f*W+p*D,s[5]=h*T+d*P+f*ne+p*q,s[9]=h*A+d*z+f*Y+p*J,s[13]=h*M+d*B+f*Q+p*se,s[2]=v*w+x*S+m*W+u*D,s[6]=v*T+x*P+m*ne+u*q,s[10]=v*A+x*z+m*Y+u*J,s[14]=v*M+x*B+m*Q+u*se,s[3]=g*w+_*S+y*W+R*D,s[7]=g*T+_*P+y*ne+R*q,s[11]=g*A+_*z+y*Y+R*J,s[15]=g*M+_*B+y*Q+R*se,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],d=e[6],f=e[10],p=e[14],v=e[3],x=e[7],m=e[11],u=e[15];return v*(+s*l*d-r*c*d-s*a*f+i*c*f+r*a*p-i*l*p)+x*(+n*l*p-n*c*f+s*o*f-r*o*p+r*c*h-s*l*h)+m*(+n*c*d-n*a*p-s*o*d+i*o*p+s*a*h-i*c*h)+u*(-r*a*h-n*l*d+n*a*f+r*o*d-i*o*f+i*l*h)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],d=e[9],f=e[10],p=e[11],v=e[12],x=e[13],m=e[14],u=e[15],g=d*m*c-x*f*c+x*l*p-a*m*p-d*l*u+a*f*u,_=v*f*c-h*m*c-v*l*p+o*m*p+h*l*u-o*f*u,y=h*x*c-v*d*c+v*a*p-o*x*p-h*a*u+o*d*u,R=v*d*l-h*x*l-v*a*f+o*x*f+h*a*m-o*d*m,w=n*g+i*_+r*y+s*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return e[0]=g*T,e[1]=(x*f*s-d*m*s-x*r*p+i*m*p+d*r*u-i*f*u)*T,e[2]=(a*m*s-x*l*s+x*r*c-i*m*c-a*r*u+i*l*u)*T,e[3]=(d*l*s-a*f*s-d*r*c+i*f*c+a*r*p-i*l*p)*T,e[4]=_*T,e[5]=(h*m*s-v*f*s+v*r*p-n*m*p-h*r*u+n*f*u)*T,e[6]=(v*l*s-o*m*s-v*r*c+n*m*c+o*r*u-n*l*u)*T,e[7]=(o*f*s-h*l*s+h*r*c-n*f*c-o*r*p+n*l*p)*T,e[8]=y*T,e[9]=(v*d*s-h*x*s-v*i*p+n*x*p+h*i*u-n*d*u)*T,e[10]=(o*x*s-v*a*s+v*i*c-n*x*c-o*i*u+n*a*u)*T,e[11]=(h*a*s-o*d*s-h*i*c+n*d*c+o*i*p-n*a*p)*T,e[12]=R*T,e[13]=(h*x*r-v*d*r+v*i*f-n*x*f-h*i*m+n*d*m)*T,e[14]=(v*a*r-o*x*r-v*i*l+n*x*l+o*i*m-n*a*m)*T,e[15]=(o*d*r-h*a*r+h*i*l-n*d*l-o*i*f+n*a*f)*T,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+i,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,h=o+o,d=a+a,f=s*c,p=s*h,v=s*d,x=o*h,m=o*d,u=a*d,g=l*c,_=l*h,y=l*d,R=i.x,w=i.y,T=i.z;return r[0]=(1-(x+u))*R,r[1]=(p+y)*R,r[2]=(v-_)*R,r[3]=0,r[4]=(p-y)*w,r[5]=(1-(f+u))*w,r[6]=(m+g)*w,r[7]=0,r[8]=(v+_)*T,r[9]=(m-g)*T,r[10]=(1-(f+x))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ds.set(r[0],r[1],r[2]).length();const o=ds.set(r[4],r[5],r[6]).length(),a=ds.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],$n.copy(this);const c=1/s,h=1/o,d=1/a;return $n.elements[0]*=c,$n.elements[1]*=c,$n.elements[2]*=c,$n.elements[4]*=h,$n.elements[5]*=h,$n.elements[6]*=h,$n.elements[8]*=d,$n.elements[9]*=d,$n.elements[10]*=d,n.setFromRotationMatrix($n),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Ii){const l=this.elements,c=2*s/(n-e),h=2*s/(i-r),d=(n+e)/(n-e),f=(i+r)/(i-r);let p,v;if(a===Ii)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===wc)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Ii){const l=this.elements,c=1/(n-e),h=1/(i-r),d=1/(o-s),f=(n+e)*c,p=(i+r)*h;let v,x;if(a===Ii)v=(o+s)*d,x=-2*d;else if(a===wc)v=s*d,x=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ds=new O,$n=new pt,oM=new O(0,0,0),aM=new O(1,1,1),Yi=new O,ll=new O,Tn=new O,fm=new pt,pm=new Kr;class Si{constructor(e=0,n=0,i=0,r=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],d=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(an(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-an(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(an(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-an(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(an(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-an(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return fm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return pm.setFromEuler(this),this.setFromQuaternion(pm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class kf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let lM=0;const mm=new O,fs=new Kr,Ei=new pt,cl=new O,Fo=new O,cM=new O,uM=new Kr,gm=new O(1,0,0),_m=new O(0,1,0),vm=new O(0,0,1),xm={type:"added"},hM={type:"removed"},ps={type:"childadded",child:null},Fu={type:"childremoved",child:null};class Dt extends es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lM++}),this.uuid=vo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dt.DEFAULT_UP.clone();const e=new O,n=new Si,i=new Kr,r=new O(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new pt},normalMatrix:{value:new $e}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Dt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return fs.setFromAxisAngle(e,n),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,n){return fs.setFromAxisAngle(e,n),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(gm,e)}rotateY(e){return this.rotateOnAxis(_m,e)}rotateZ(e){return this.rotateOnAxis(vm,e)}translateOnAxis(e,n){return mm.copy(e).applyQuaternion(this.quaternion),this.position.add(mm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(gm,e)}translateY(e){return this.translateOnAxis(_m,e)}translateZ(e){return this.translateOnAxis(vm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?cl.copy(e):cl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Fo,cl,this.up):Ei.lookAt(cl,Fo,this.up),this.quaternion.setFromRotationMatrix(Ei),r&&(Ei.extractRotation(r.matrixWorld),fs.setFromRotationMatrix(Ei),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(xm),ps.child=e,this.dispatchEvent(ps),ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(hM),Fu.child=e,this.dispatchEvent(Fu),Fu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(xm),ps.child=e,this.dispatchEvent(ps),ps.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fo,e,cM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fo,uM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),d=o(e.shapes),f=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Dt.DEFAULT_UP=new O(0,1,0);Dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kn=new O,Ti=new O,Ou=new O,Ai=new O,ms=new O,gs=new O,ym=new O,ku=new O,zu=new O,Bu=new O;class ni{constructor(e=new O,n=new O,i=new O){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Kn.subVectors(e,n),r.cross(Kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Kn.subVectors(r,n),Ti.subVectors(i,n),Ou.subVectors(e,n);const o=Kn.dot(Kn),a=Kn.dot(Ti),l=Kn.dot(Ou),c=Ti.dot(Ti),h=Ti.dot(Ou),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const f=1/d,p=(c*l-a*h)*f,v=(o*h-a*l)*f;return s.set(1-p-v,v,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(a,Ai.z),l)}static isFrontFacing(e,n,i,r){return Kn.subVectors(i,n),Ti.subVectors(e,n),Kn.cross(Ti).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kn.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),Kn.cross(Ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ni.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return ni.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return ni.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return ni.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ni.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;ms.subVectors(r,i),gs.subVectors(s,i),ku.subVectors(e,i);const l=ms.dot(ku),c=gs.dot(ku);if(l<=0&&c<=0)return n.copy(i);zu.subVectors(e,r);const h=ms.dot(zu),d=gs.dot(zu);if(h>=0&&d<=h)return n.copy(r);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),n.copy(i).addScaledVector(ms,o);Bu.subVectors(e,s);const p=ms.dot(Bu),v=gs.dot(Bu);if(v>=0&&p<=v)return n.copy(s);const x=p*c-l*v;if(x<=0&&c>=0&&v<=0)return a=c/(c-v),n.copy(i).addScaledVector(gs,a);const m=h*v-p*d;if(m<=0&&d-h>=0&&p-v>=0)return ym.subVectors(s,r),a=(d-h)/(d-h+(p-v)),n.copy(r).addScaledVector(ym,a);const u=1/(m+x+f);return o=x*u,a=f*u,n.copy(i).addScaledVector(ms,o).addScaledVector(gs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const K_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},ul={h:0,s:0,l:0};function Hu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class I{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=ei){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ut.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=ut.workingColorSpace){return this.r=e,this.g=n,this.b=i,ut.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=ut.workingColorSpace){if(e=Of(e,1),n=an(n,0,1),i=an(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Hu(o,s,e+1/3),this.g=Hu(o,s,e),this.b=Hu(o,s,e-1/3)}return ut.toWorkingColorSpace(this,r),this}setStyle(e,n=ei){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=ei){const i=K_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}copyLinearToSRGB(e){return this.r=Ru(e.r),this.g=Ru(e.g),this.b=Ru(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ei){return ut.fromWorkingColorSpace(sn.copy(this),e),Math.round(an(sn.r*255,0,255))*65536+Math.round(an(sn.g*255,0,255))*256+Math.round(an(sn.b*255,0,255))}getHexString(e=ei){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=ut.workingColorSpace){ut.fromWorkingColorSpace(sn.copy(this),n);const i=sn.r,r=sn.g,s=sn.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,n=ut.workingColorSpace){return ut.fromWorkingColorSpace(sn.copy(this),n),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=ei){ut.fromWorkingColorSpace(sn.copy(this),e);const n=sn.r,i=sn.g,r=sn.b;return e!==ei?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(qi),this.setHSL(qi.h+e,qi.s+n,qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(qi),e.getHSL(ul);const i=oa(qi.h,ul.h,n),r=oa(qi.s,ul.s,n),s=oa(qi.l,ul.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new I;I.NAMES=K_;let dM=0;class yo extends es{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dM++}),this.uuid=vo(),this.name="",this.type="Material",this.blending=$s,this.side=xi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Kh,this.blendDst=Qh,this.blendEquation=Fr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new I(0,0,0),this.blendAlpha=0,this.depthFunc=xc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=as,this.stencilZFail=as,this.stencilZPass=as,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==$s&&(i.blending=this.blending),this.side!==xi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Kh&&(i.blendSrc=this.blendSrc),this.blendDst!==Qh&&(i.blendDst=this.blendDst),this.blendEquation!==Fr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==xc&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sm&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==as&&(i.stencilFail=this.stencilFail),this.stencilZFail!==as&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==as&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Tc extends yo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new I(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=N_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Nt=new O,hl=new Pe;class Kt{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=om,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return aa("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)hl.fromBufferAttribute(this,n),hl.applyMatrix3(e),this.setXY(n,hl.x,hl.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix3(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyMatrix4(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.applyNormalMatrix(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Nt.fromBufferAttribute(this,n),Nt.transformDirection(e),this.setXYZ(n,Nt.x,Nt.y,Nt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=As(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=un(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=As(n,this.array)),n}setX(e,n){return this.normalized&&(n=un(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=As(n,this.array)),n}setY(e,n){return this.normalized&&(n=un(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=As(n,this.array)),n}setZ(e,n){return this.normalized&&(n=un(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=As(n,this.array)),n}setW(e,n){return this.normalized&&(n=un(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=un(n,this.array),i=un(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=un(n,this.array),i=un(i,this.array),r=un(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=un(n,this.array),i=un(i,this.array),r=un(r,this.array),s=un(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==om&&(e.usage=this.usage),e}}class Q_ extends Kt{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class J_ extends Kt{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class et extends Kt{constructor(e,n,i){super(new Float32Array(e),n,i)}}let fM=0;const Un=new pt,Gu=new Dt,_s=new O,An=new ts,Oo=new ts,Gt=new O;class It extends es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fM++}),this.uuid=vo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(q_(e)?J_:Q_)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new $e().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,n,i){return Un.makeTranslation(e,n,i),this.applyMatrix4(Un),this}scale(e,n,i){return Un.makeScale(e,n,i),this.applyMatrix4(Un),this}lookAt(e){return Gu.lookAt(e),Gu.updateMatrix(),this.applyMatrix4(Gu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new et(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ts);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];An.setFromBufferAttribute(s),this.morphTargetsRelative?(Gt.addVectors(this.boundingBox.min,An.min),this.boundingBox.expandByPoint(Gt),Gt.addVectors(this.boundingBox.max,An.max),this.boundingBox.expandByPoint(Gt)):(this.boundingBox.expandByPoint(An.min),this.boundingBox.expandByPoint(An.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xo);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const i=this.boundingSphere.center;if(An.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];Oo.setFromBufferAttribute(a),this.morphTargetsRelative?(Gt.addVectors(An.min,Oo.min),An.expandByPoint(Gt),Gt.addVectors(An.max,Oo.max),An.expandByPoint(Gt)):(An.expandByPoint(Oo.min),An.expandByPoint(Oo.max))}An.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Gt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Gt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Gt.fromBufferAttribute(a,c),l&&(_s.fromBufferAttribute(e,c),Gt.add(_s)),r=Math.max(r,i.distanceToSquared(Gt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let A=0;A<i.count;A++)a[A]=new O,l[A]=new O;const c=new O,h=new O,d=new O,f=new Pe,p=new Pe,v=new Pe,x=new O,m=new O;function u(A,M,S){c.fromBufferAttribute(i,A),h.fromBufferAttribute(i,M),d.fromBufferAttribute(i,S),f.fromBufferAttribute(s,A),p.fromBufferAttribute(s,M),v.fromBufferAttribute(s,S),h.sub(c),d.sub(c),p.sub(f),v.sub(f);const P=1/(p.x*v.y-v.x*p.y);isFinite(P)&&(x.copy(h).multiplyScalar(v.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-v.x).multiplyScalar(P),a[A].add(x),a[M].add(x),a[S].add(x),l[A].add(m),l[M].add(m),l[S].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let A=0,M=g.length;A<M;++A){const S=g[A],P=S.start,z=S.count;for(let B=P,W=P+z;B<W;B+=3)u(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const _=new O,y=new O,R=new O,w=new O;function T(A){R.fromBufferAttribute(r,A),w.copy(R);const M=a[A];_.copy(M),_.sub(R.multiplyScalar(R.dot(M))).normalize(),y.crossVectors(w,M);const P=y.dot(l[A])<0?-1:1;o.setXYZW(A,_.x,_.y,_.z,P)}for(let A=0,M=g.length;A<M;++A){const S=g[A],P=S.start,z=S.count;for(let B=P,W=P+z;B<W;B+=3)T(e.getX(B+0)),T(e.getX(B+1)),T(e.getX(B+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kt(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new O,s=new O,o=new O,a=new O,l=new O,c=new O,h=new O,d=new O;if(e)for(let f=0,p=e.count;f<p;f+=3){const v=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,m),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),h.subVectors(o,s),d.subVectors(r,s),h.cross(d),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Gt.fromBufferAttribute(e,n),Gt.normalize(),e.setXYZ(n,Gt.x,Gt.y,Gt.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h);let p=0,v=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*h;for(let u=0;u<h;u++)f[v++]=c[p++]}return new Kt(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new It,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,d=c.length;h<d;h++){const f=c[h],p=e(f,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(n))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let f=0,p=d.length;f<p;f++)h.push(d[f].clone(n));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sm=new pt,Cr=new jc,dl=new xo,Mm=new O,vs=new O,xs=new O,ys=new O,Vu=new O,fl=new O,pl=new Pe,ml=new Pe,gl=new Pe,wm=new O,Em=new O,Tm=new O,_l=new O,vl=new O;class Et extends Dt{constructor(e=new It,n=new Tc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){fl.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],d=s[l];h!==0&&(Vu.fromBufferAttribute(d,e),o?fl.addScaledVector(Vu,h):fl.addScaledVector(Vu.sub(n),h))}n.add(fl)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),dl.copy(i.boundingSphere),dl.applyMatrix4(s),Cr.copy(e.ray).recast(e.near),!(dl.containsPoint(Cr.origin)===!1&&(Cr.intersectSphere(dl,Mm)===null||Cr.origin.distanceToSquared(Mm)>(e.far-e.near)**2))&&(Sm.copy(s).invert(),Cr.copy(e.ray).applyMatrix4(Sm),!(i.boundingBox!==null&&Cr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Cr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,f=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,x=f.length;v<x;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=g,R=_;y<R;y+=3){const w=a.getX(y),T=a.getX(y+1),A=a.getX(y+2);r=xl(this,u,e,i,c,h,d,w,T,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=v,u=x;m<u;m+=3){const g=a.getX(m),_=a.getX(m+1),y=a.getX(m+2);r=xl(this,o,e,i,c,h,d,g,_,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,x=f.length;v<x;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=g,R=_;y<R;y+=3){const w=y,T=y+1,A=y+2;r=xl(this,u,e,i,c,h,d,w,T,A),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=v,u=x;m<u;m+=3){const g=m,_=m+1,y=m+2;r=xl(this,o,e,i,c,h,d,g,_,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function pM(t,e,n,i,r,s,o,a){let l;if(e.side===wn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===xi,a),l===null)return null;vl.copy(a),vl.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(vl);return c<n.near||c>n.far?null:{distance:c,point:vl.clone(),object:t}}function xl(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,vs),t.getVertexPosition(l,xs),t.getVertexPosition(c,ys);const h=pM(t,e,n,i,vs,xs,ys,_l);if(h){r&&(pl.fromBufferAttribute(r,a),ml.fromBufferAttribute(r,l),gl.fromBufferAttribute(r,c),h.uv=ni.getInterpolation(_l,vs,xs,ys,pl,ml,gl,new Pe)),s&&(pl.fromBufferAttribute(s,a),ml.fromBufferAttribute(s,l),gl.fromBufferAttribute(s,c),h.uv1=ni.getInterpolation(_l,vs,xs,ys,pl,ml,gl,new Pe)),o&&(wm.fromBufferAttribute(o,a),Em.fromBufferAttribute(o,l),Tm.fromBufferAttribute(o,c),h.normal=ni.getInterpolation(_l,vs,xs,ys,wm,Em,Tm,new O),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new O,materialIndex:0};ni.getNormal(vs,xs,ys,d.normal),h.face=d}return h}class ot extends It{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],d=[];let f=0,p=0;v("z","y","x",-1,-1,i,n,e,o,s,0),v("z","y","x",1,-1,i,n,-e,o,s,1),v("x","z","y",1,1,e,i,n,r,o,2),v("x","z","y",1,-1,e,i,-n,r,o,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new et(c,3)),this.setAttribute("normal",new et(h,3)),this.setAttribute("uv",new et(d,2));function v(x,m,u,g,_,y,R,w,T,A,M){const S=y/T,P=R/A,z=y/2,B=R/2,W=w/2,ne=T+1,Y=A+1;let Q=0,D=0;const q=new O;for(let J=0;J<Y;J++){const se=J*P-B;for(let ve=0;ve<ne;ve++){const Ee=ve*S-z;q[x]=Ee*g,q[m]=se*_,q[u]=W,c.push(q.x,q.y,q.z),q[x]=0,q[m]=0,q[u]=w>0?1:-1,h.push(q.x,q.y,q.z),d.push(ve/T),d.push(1-J/A),Q+=1}}for(let J=0;J<A;J++)for(let se=0;se<T;se++){const ve=f+se+ne*J,Ee=f+se+ne*(J+1),G=f+(se+1)+ne*(J+1),re=f+(se+1)+ne*J;l.push(ve,Ee,re),l.push(Ee,G,re),D+=6}a.addGroup(p,D,M),p+=D,f+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ot(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ho(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function hn(t){const e={};for(let n=0;n<t.length;n++){const i=ho(t[n]);for(const r in i)e[r]=i[r]}return e}function mM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function ev(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ut.workingColorSpace}const gM={clone:ho,merge:hn};var _M=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class si extends yo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_M,this.fragmentShader=vM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ho(e.uniforms),this.uniformsGroups=mM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class tv extends Dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=Ii}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new O,Am=new Pe,Cm=new Pe;class zn extends tv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Ca*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ca*2*Math.atan(Math.tan(Qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,n){return this.getViewBounds(e,Am,Cm),n.subVectors(Cm,Am)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Qs*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Ss=-90,Ms=1;class xM extends Dt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new zn(Ss,Ms,e,n);r.layers=this.layers,this.add(r);const s=new zn(Ss,Ms,e,n);s.layers=this.layers,this.add(s);const o=new zn(Ss,Ms,e,n);o.layers=this.layers,this.add(o);const a=new zn(Ss,Ms,e,n);a.layers=this.layers,this.add(a);const l=new zn(Ss,Ms,e,n);l.layers=this.layers,this.add(l);const c=new zn(Ss,Ms,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Ii)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===wc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(d,f,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class nv extends ln{constructor(e,n,i,r,s,o,a,l,c,h){e=e!==void 0?e:[],n=n!==void 0?n:ao,super(e,n,i,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class yM extends zi{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new nv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:bn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ot(5,5,5),s=new si({name:"CubemapFromEquirect",uniforms:ho(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:wn,blending:fr});s.uniforms.tEquirect.value=n;const o=new Et(r,s),a=n.minFilter;return n.minFilter===Hr&&(n.minFilter=bn),new xM(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const Wu=new O,SM=new O,MM=new $e;class Qi{constructor(e=new O(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Wu.subVectors(i,n).cross(SM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Wu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||MM.getNormalMatrix(e),r=this.coplanarPoint(Wu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Rr=new xo,yl=new O;class zf{constructor(e=new Qi,n=new Qi,i=new Qi,r=new Qi,s=new Qi,o=new Qi){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ii){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],d=r[6],f=r[7],p=r[8],v=r[9],x=r[10],m=r[11],u=r[12],g=r[13],_=r[14],y=r[15];if(i[0].setComponents(l-s,f-c,m-p,y-u).normalize(),i[1].setComponents(l+s,f+c,m+p,y+u).normalize(),i[2].setComponents(l+o,f+h,m+v,y+g).normalize(),i[3].setComponents(l-o,f-h,m-v,y-g).normalize(),i[4].setComponents(l-a,f-d,m-x,y-_).normalize(),n===Ii)i[5].setComponents(l+a,f+d,m+x,y+_).normalize();else if(n===wc)i[5].setComponents(a,d,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Rr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Rr)}intersectsSprite(e){return Rr.center.set(0,0,0),Rr.radius=.7071067811865476,Rr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Rr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(yl.x=r.normal.x>0?e.max.x:e.min.x,yl.y=r.normal.y>0?e.max.y:e.min.y,yl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(yl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function iv(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function wM(t){const e=new WeakMap;function n(a,l){const c=a.array,h=a.usage,d=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const h=l.array,d=l._updateRange,f=l.updateRanges;if(t.bindBuffer(c,a),d.count===-1&&f.length===0&&t.bufferSubData(c,0,h),f.length!==0){for(let p=0,v=f.length;p<v;p++){const x=f[p];t.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}d.count!==-1&&(t.bufferSubData(c,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count),d.count=-1),l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class ns extends It{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,h=l+1,d=e/a,f=n/l,p=[],v=[],x=[],m=[];for(let u=0;u<h;u++){const g=u*f-o;for(let _=0;_<c;_++){const y=_*d-s;v.push(y,-g,0),x.push(0,0,1),m.push(_/a),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let g=0;g<a;g++){const _=g+c*u,y=g+c*(u+1),R=g+1+c*(u+1),w=g+1+c*u;p.push(_,y,w),p.push(y,R,w)}this.setIndex(p),this.setAttribute("position",new et(v,3)),this.setAttribute("normal",new et(x,3)),this.setAttribute("uv",new et(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ns(e.width,e.height,e.widthSegments,e.heightSegments)}}var EM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,TM=`#ifdef USE_ALPHAHASH
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
#endif`,AM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,CM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,RM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,PM=`#ifdef USE_AOMAP
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
#endif`,LM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,DM=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,IM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,NM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,UM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,FM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,OM=`#ifdef USE_IRIDESCENCE
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
#endif`,kM=`#ifdef USE_BUMPMAP
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
#endif`,zM=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,BM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,HM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,GM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,VM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,WM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,XM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,YM=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,qM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ZM=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,$M=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,KM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,QM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,JM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,e1="gl_FragColor = linearToOutputTexel( gl_FragColor );",t1=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,n1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,i1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,r1=`#ifdef USE_ENVMAP
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
#endif`,s1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,o1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,a1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,l1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,c1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,u1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h1=`#ifdef USE_GRADIENTMAP
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
}`,d1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,f1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,p1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,m1=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,g1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
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
	#endif
#endif`,_1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,S1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,M1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,w1=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,E1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,T1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,A1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,C1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,P1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,L1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,D1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,I1=`#if defined( USE_POINTS_UV )
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
#endif`,N1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,O1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,k1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z1=`#ifdef USE_MORPHTARGETS
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
#endif`,B1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,G1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,V1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,j1=`#ifdef USE_NORMALMAP
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
#endif`,Y1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,q1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Z1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,K1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Q1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,J1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ew=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ow=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
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
#endif`,aw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,lw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,cw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,uw=`#ifdef USE_SKINNING
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
#endif`,hw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dw=`#ifdef USE_SKINNING
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
#endif`,fw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_w=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,vw=`#ifdef USE_TRANSMISSION
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
#endif`,xw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ww=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ew=`uniform sampler2D t2D;
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
}`,Tw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Aw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bw=`#include <common>
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
}`,Pw=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Lw=`#define DISTANCE
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
}`,Dw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Iw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Nw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Uw=`uniform float scale;
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
}`,Fw=`uniform vec3 diffuse;
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
}`,Ow=`#include <common>
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
}`,kw=`uniform vec3 diffuse;
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
}`,zw=`#define LAMBERT
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
}`,Bw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,Hw=`#define MATCAP
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
}`,Gw=`#define MATCAP
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
}`,Vw=`#define NORMAL
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
}`,Ww=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Xw=`#define PHONG
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
}`,jw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,Yw=`#define STANDARD
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
}`,qw=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,Zw=`#define TOON
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
}`,$w=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Kw=`uniform float size;
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
}`,Qw=`uniform vec3 diffuse;
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
}`,Jw=`#include <common>
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
}`,eE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,tE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,nE=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:EM,alphahash_pars_fragment:TM,alphamap_fragment:AM,alphamap_pars_fragment:CM,alphatest_fragment:RM,alphatest_pars_fragment:bM,aomap_fragment:PM,aomap_pars_fragment:LM,batching_pars_vertex:DM,batching_vertex:IM,begin_vertex:NM,beginnormal_vertex:UM,bsdfs:FM,iridescence_fragment:OM,bumpmap_pars_fragment:kM,clipping_planes_fragment:zM,clipping_planes_pars_fragment:BM,clipping_planes_pars_vertex:HM,clipping_planes_vertex:GM,color_fragment:VM,color_pars_fragment:WM,color_pars_vertex:XM,color_vertex:jM,common:YM,cube_uv_reflection_fragment:qM,defaultnormal_vertex:ZM,displacementmap_pars_vertex:$M,displacementmap_vertex:KM,emissivemap_fragment:QM,emissivemap_pars_fragment:JM,colorspace_fragment:e1,colorspace_pars_fragment:t1,envmap_fragment:n1,envmap_common_pars_fragment:i1,envmap_pars_fragment:r1,envmap_pars_vertex:s1,envmap_physical_pars_fragment:g1,envmap_vertex:o1,fog_vertex:a1,fog_pars_vertex:l1,fog_fragment:c1,fog_pars_fragment:u1,gradientmap_pars_fragment:h1,lightmap_pars_fragment:d1,lights_lambert_fragment:f1,lights_lambert_pars_fragment:p1,lights_pars_begin:m1,lights_toon_fragment:_1,lights_toon_pars_fragment:v1,lights_phong_fragment:x1,lights_phong_pars_fragment:y1,lights_physical_fragment:S1,lights_physical_pars_fragment:M1,lights_fragment_begin:w1,lights_fragment_maps:E1,lights_fragment_end:T1,logdepthbuf_fragment:A1,logdepthbuf_pars_fragment:C1,logdepthbuf_pars_vertex:R1,logdepthbuf_vertex:b1,map_fragment:P1,map_pars_fragment:L1,map_particle_fragment:D1,map_particle_pars_fragment:I1,metalnessmap_fragment:N1,metalnessmap_pars_fragment:U1,morphinstance_vertex:F1,morphcolor_vertex:O1,morphnormal_vertex:k1,morphtarget_pars_vertex:z1,morphtarget_vertex:B1,normal_fragment_begin:H1,normal_fragment_maps:G1,normal_pars_fragment:V1,normal_pars_vertex:W1,normal_vertex:X1,normalmap_pars_fragment:j1,clearcoat_normal_fragment_begin:Y1,clearcoat_normal_fragment_maps:q1,clearcoat_pars_fragment:Z1,iridescence_pars_fragment:$1,opaque_fragment:K1,packing:Q1,premultiplied_alpha_fragment:J1,project_vertex:ew,dithering_fragment:tw,dithering_pars_fragment:nw,roughnessmap_fragment:iw,roughnessmap_pars_fragment:rw,shadowmap_pars_fragment:sw,shadowmap_pars_vertex:ow,shadowmap_vertex:aw,shadowmask_pars_fragment:lw,skinbase_vertex:cw,skinning_pars_vertex:uw,skinning_vertex:hw,skinnormal_vertex:dw,specularmap_fragment:fw,specularmap_pars_fragment:pw,tonemapping_fragment:mw,tonemapping_pars_fragment:gw,transmission_fragment:_w,transmission_pars_fragment:vw,uv_pars_fragment:xw,uv_pars_vertex:yw,uv_vertex:Sw,worldpos_vertex:Mw,background_vert:ww,background_frag:Ew,backgroundCube_vert:Tw,backgroundCube_frag:Aw,cube_vert:Cw,cube_frag:Rw,depth_vert:bw,depth_frag:Pw,distanceRGBA_vert:Lw,distanceRGBA_frag:Dw,equirect_vert:Iw,equirect_frag:Nw,linedashed_vert:Uw,linedashed_frag:Fw,meshbasic_vert:Ow,meshbasic_frag:kw,meshlambert_vert:zw,meshlambert_frag:Bw,meshmatcap_vert:Hw,meshmatcap_frag:Gw,meshnormal_vert:Vw,meshnormal_frag:Ww,meshphong_vert:Xw,meshphong_frag:jw,meshphysical_vert:Yw,meshphysical_frag:qw,meshtoon_vert:Zw,meshtoon_frag:$w,points_vert:Kw,points_frag:Qw,shadow_vert:Jw,shadow_frag:eE,sprite_vert:tE,sprite_frag:nE},Re={common:{diffuse:{value:new I(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new Pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new I(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new I(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new I(16777215)},opacity:{value:1},center:{value:new Pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},hi={basic:{uniforms:hn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:hn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new I(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:hn([Re.common,Re.specularmap,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,Re.lights,{emissive:{value:new I(0)},specular:{value:new I(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:hn([Re.common,Re.envmap,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.roughnessmap,Re.metalnessmap,Re.fog,Re.lights,{emissive:{value:new I(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:hn([Re.common,Re.aomap,Re.lightmap,Re.emissivemap,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.gradientmap,Re.fog,Re.lights,{emissive:{value:new I(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:hn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,Re.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:hn([Re.points,Re.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:hn([Re.common,Re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:hn([Re.common,Re.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:hn([Re.common,Re.bumpmap,Re.normalmap,Re.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:hn([Re.sprite,Re.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:hn([Re.common,Re.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:hn([Re.lights,Re.fog,{color:{value:new I(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};hi.physical={uniforms:hn([hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new Pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new I(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new Pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new I(0)},specularColor:{value:new I(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new Pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Sl={r:0,b:0,g:0},br=new Si,iE=new pt;function rE(t,e,n,i,r,s,o){const a=new I(0);let l=s===!0?0:1,c,h,d=null,f=0,p=null;function v(g){let _=g.isScene===!0?g.background:null;return _&&_.isTexture&&(_=(g.backgroundBlurriness>0?n:e).get(_)),_}function x(g){let _=!1;const y=v(g);y===null?u(a,l):y&&y.isColor&&(u(y,1),_=!0);const R=t.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(g,_){const y=v(_);y&&(y.isCubeTexture||y.mapping===Wc)?(h===void 0&&(h=new Et(new ot(1,1,1),new si({name:"BackgroundCubeMaterial",uniforms:ho(hi.backgroundCube.uniforms),vertexShader:hi.backgroundCube.vertexShader,fragmentShader:hi.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),br.copy(_.backgroundRotation),br.x*=-1,br.y*=-1,br.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(br.y*=-1,br.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(iE.makeRotationFromEuler(br)),h.material.toneMapped=ut.getTransfer(y.colorSpace)!==vt,(d!==y||f!==y.version||p!==t.toneMapping)&&(h.material.needsUpdate=!0,d=y,f=y.version,p=t.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Et(new ns(2,2),new si({name:"BackgroundMaterial",uniforms:ho(hi.background.uniforms),vertexShader:hi.background.vertexShader,fragmentShader:hi.background.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ut.getTransfer(y.colorSpace)!==vt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||f!==y.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,d=y,f=y.version,p=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function u(g,_){g.getRGB(Sl,ev(t)),i.buffers.color.setClear(Sl.r,Sl.g,Sl.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(g,_=1){a.set(g),l=_,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,u(a,l)},render:x,addToRenderList:m}}function sE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(S,P,z,B,W){let ne=!1;const Y=d(B,z,P);s!==Y&&(s=Y,c(s.object)),ne=p(S,B,z,W),ne&&v(S,B,z,W),W!==null&&e.update(W,t.ELEMENT_ARRAY_BUFFER),(ne||o)&&(o=!1,y(S,P,z,B),W!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return t.createVertexArray()}function c(S){return t.bindVertexArray(S)}function h(S){return t.deleteVertexArray(S)}function d(S,P,z){const B=z.wireframe===!0;let W=i[S.id];W===void 0&&(W={},i[S.id]=W);let ne=W[P.id];ne===void 0&&(ne={},W[P.id]=ne);let Y=ne[B];return Y===void 0&&(Y=f(l()),ne[B]=Y),Y}function f(S){const P=[],z=[],B=[];for(let W=0;W<n;W++)P[W]=0,z[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:z,attributeDivisors:B,object:S,attributes:{},index:null}}function p(S,P,z,B){const W=s.attributes,ne=P.attributes;let Y=0;const Q=z.getAttributes();for(const D in Q)if(Q[D].location>=0){const J=W[D];let se=ne[D];if(se===void 0&&(D==="instanceMatrix"&&S.instanceMatrix&&(se=S.instanceMatrix),D==="instanceColor"&&S.instanceColor&&(se=S.instanceColor)),J===void 0||J.attribute!==se||se&&J.data!==se.data)return!0;Y++}return s.attributesNum!==Y||s.index!==B}function v(S,P,z,B){const W={},ne=P.attributes;let Y=0;const Q=z.getAttributes();for(const D in Q)if(Q[D].location>=0){let J=ne[D];J===void 0&&(D==="instanceMatrix"&&S.instanceMatrix&&(J=S.instanceMatrix),D==="instanceColor"&&S.instanceColor&&(J=S.instanceColor));const se={};se.attribute=J,J&&J.data&&(se.data=J.data),W[D]=se,Y++}s.attributes=W,s.attributesNum=Y,s.index=B}function x(){const S=s.newAttributes;for(let P=0,z=S.length;P<z;P++)S[P]=0}function m(S){u(S,0)}function u(S,P){const z=s.newAttributes,B=s.enabledAttributes,W=s.attributeDivisors;z[S]=1,B[S]===0&&(t.enableVertexAttribArray(S),B[S]=1),W[S]!==P&&(t.vertexAttribDivisor(S,P),W[S]=P)}function g(){const S=s.newAttributes,P=s.enabledAttributes;for(let z=0,B=P.length;z<B;z++)P[z]!==S[z]&&(t.disableVertexAttribArray(z),P[z]=0)}function _(S,P,z,B,W,ne,Y){Y===!0?t.vertexAttribIPointer(S,P,z,W,ne):t.vertexAttribPointer(S,P,z,B,W,ne)}function y(S,P,z,B){x();const W=B.attributes,ne=z.getAttributes(),Y=P.defaultAttributeValues;for(const Q in ne){const D=ne[Q];if(D.location>=0){let q=W[Q];if(q===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(q=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(q=S.instanceColor)),q!==void 0){const J=q.normalized,se=q.itemSize,ve=e.get(q);if(ve===void 0)continue;const Ee=ve.buffer,G=ve.type,re=ve.bytesPerElement,he=G===t.INT||G===t.UNSIGNED_INT||q.gpuType===bf;if(q.isInterleavedBufferAttribute){const fe=q.data,Te=fe.stride,ke=q.offset;if(fe.isInstancedInterleavedBuffer){for(let Xe=0;Xe<D.locationSize;Xe++)u(D.location+Xe,fe.meshPerAttribute);S.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Xe=0;Xe<D.locationSize;Xe++)m(D.location+Xe);t.bindBuffer(t.ARRAY_BUFFER,Ee);for(let Xe=0;Xe<D.locationSize;Xe++)_(D.location+Xe,se/D.locationSize,G,J,Te*re,(ke+se/D.locationSize*Xe)*re,he)}else{if(q.isInstancedBufferAttribute){for(let fe=0;fe<D.locationSize;fe++)u(D.location+fe,q.meshPerAttribute);S.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let fe=0;fe<D.locationSize;fe++)m(D.location+fe);t.bindBuffer(t.ARRAY_BUFFER,Ee);for(let fe=0;fe<D.locationSize;fe++)_(D.location+fe,se/D.locationSize,G,J,se*re,se/D.locationSize*fe*re,he)}}else if(Y!==void 0){const J=Y[Q];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(D.location,J);break;case 3:t.vertexAttrib3fv(D.location,J);break;case 4:t.vertexAttrib4fv(D.location,J);break;default:t.vertexAttrib1fv(D.location,J)}}}}g()}function R(){A();for(const S in i){const P=i[S];for(const z in P){const B=P[z];for(const W in B)h(B[W].object),delete B[W];delete P[z]}delete i[S]}}function w(S){if(i[S.id]===void 0)return;const P=i[S.id];for(const z in P){const B=P[z];for(const W in B)h(B[W].object),delete B[W];delete P[z]}delete i[S.id]}function T(S){for(const P in i){const z=i[P];if(z[S.id]===void 0)continue;const B=z[S.id];for(const W in B)h(B[W].object),delete B[W];delete z[S.id]}}function A(){M(),o=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:m,disableUnusedAttributes:g}}function oE(t,e,n){let i;function r(c){i=c}function s(c,h){t.drawArrays(i,c,h),n.update(h,i,1)}function o(c,h,d){d!==0&&(t.drawArraysInstanced(i,c,h,d),n.update(h,i,d))}function a(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let p=0;for(let v=0;v<d;v++)p+=h[v];n.update(p,i,1)}function l(c,h,d,f){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)o(c[v],h[v],f[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,d);let v=0;for(let x=0;x<d;x++)v+=h[x];for(let x=0;x<f.length;x++)n.update(v,i,f[x])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function aE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==Vn&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const T=w===_o&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==yi&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==pi&&!T)}function l(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=n.logarithmicDepthBuffer===!0,f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),m=t.getParameter(t.MAX_VERTEX_ATTRIBS),u=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),g=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),y=p>0,R=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:x,maxAttributes:m,maxVertexUniforms:u,maxVaryings:g,maxFragmentUniforms:_,vertexTextures:y,maxSamples:R}}function lE(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Qi,a=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const p=d.length!==0||f||i!==0||r;return r=f,i=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){n=h(d,f,0)},this.setState=function(d,f,p){const v=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,u=t.get(d);if(!r||v===null||v.length===0||s&&!m)s?h(null):c();else{const g=s?0:i,_=g*4;let y=u.clippingState||null;l.value=y,y=h(v,f,_,p);for(let R=0;R!==_;++R)y[R]=n[R];u.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,f,p,v){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=l.value,v!==!0||m===null){const u=p+x*4,g=f.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<u)&&(m=new Float32Array(u));for(let _=0,y=p;_!==x;++_,y+=4)o.copy(d[_]).applyMatrix4(g,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function cE(t){let e=new WeakMap;function n(o,a){return a===Jh?o.mapping=ao:a===ed&&(o.mapping=lo),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Jh||a===ed)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new yM(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Yc extends tv{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Hs=4,Rm=[.125,.215,.35,.446,.526,.582],Or=20,Xu=new Yc,bm=new I;let ju=null,Yu=0,qu=0,Zu=!1;const Ur=(1+Math.sqrt(5))/2,ws=1/Ur,Pm=[new O(-Ur,ws,0),new O(Ur,ws,0),new O(-ws,0,Ur),new O(ws,0,Ur),new O(0,Ur,-ws),new O(0,Ur,ws),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class Lm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){ju=this._renderer.getRenderTarget(),Yu=this._renderer.getActiveCubeFace(),qu=this._renderer.getActiveMipmapLevel(),Zu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Im(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ju,Yu,qu),this._renderer.xr.enabled=Zu,e.scissorTest=!1,Ml(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ao||e.mapping===lo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ju=this._renderer.getRenderTarget(),Yu=this._renderer.getActiveCubeFace(),qu=this._renderer.getActiveMipmapLevel(),Zu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:bn,minFilter:bn,generateMipmaps:!1,type:_o,format:Vn,colorSpace:yr,depthBuffer:!1},r=Dm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=uE(s)),this._blurMaterial=hE(s,e,n)}return r}_compileMaterial(e){const n=new Et(this._lodPlanes[0],e);this._renderer.compile(n,Xu)}_sceneToCubeUV(e,n,i,r){const a=new zn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(bm),h.toneMapping=pr,h.autoClear=!1;const p=new Tc({name:"PMREM.Background",side:wn,depthWrite:!1,depthTest:!1}),v=new Et(new ot,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(bm),x=!0);for(let u=0;u<6;u++){const g=u%3;g===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):g===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const _=this._cubeSize;Ml(r,g*_,u>2?_:0,_,_),h.setRenderTarget(r),x&&h.render(v,a),h.render(e,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ao||e.mapping===lo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Im());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Et(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ml(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Xu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Pm[(r-s-1)%Pm.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Et(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Or-1),x=s/v,m=isFinite(s)?1+Math.floor(h*x):Or;m>Or&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Or}`);const u=[];let g=0;for(let T=0;T<Or;++T){const A=T/x,M=Math.exp(-A*A/2);u.push(M),T===0?g+=M:T<m&&(g+=2*M)}for(let T=0;T<u.length;T++)u[T]=u[T]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:_}=this;f.dTheta.value=v,f.mipInt.value=_-i;const y=this._sizeLods[r],R=3*y*(r>_-Hs?r-_+Hs:0),w=4*(this._cubeSize-y);Ml(n,R,w,3*y,2*y),l.setRenderTarget(n),l.render(d,Xu)}}function uE(t){const e=[],n=[],i=[];let r=t;const s=t-Hs+1+Rm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-Hs?l=Rm[o-t+Hs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,v=6,x=3,m=2,u=1,g=new Float32Array(x*v*p),_=new Float32Array(m*v*p),y=new Float32Array(u*v*p);for(let w=0;w<p;w++){const T=w%3*2/3-1,A=w>2?0:-1,M=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];g.set(M,x*v*w),_.set(f,m*v*w);const S=[w,w,w,w,w,w];y.set(S,u*v*w)}const R=new It;R.setAttribute("position",new Kt(g,x)),R.setAttribute("uv",new Kt(_,m)),R.setAttribute("faceIndex",new Kt(y,u)),e.push(R),r>Hs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Dm(t,e,n){const i=new zi(t,e,n);return i.texture.mapping=Wc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ml(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function hE(t,e,n){const i=new Float32Array(Or),r=new O(0,1,0);return new si({name:"SphericalGaussianBlur",defines:{n:Or,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Bf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function Im(){return new si({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bf(),fragmentShader:`

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
		`,blending:fr,depthTest:!1,depthWrite:!1})}function Nm(){return new si({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function Bf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function dE(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Jh||l===ed,h=l===ao||l===lo;if(c||h){let d=e.get(a);const f=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return n===null&&(n=new Lm(t)),d=c?n.fromEquirectangular(a,d):n.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&r(p)?(n===null&&(n=new Lm(t)),d=c?n.fromEquirectangular(a):n.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function r(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function fE(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&aa("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function pE(t,e,n,i){const r={},s=new WeakMap;function o(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);for(const v in f.morphAttributes){const x=f.morphAttributes[v];for(let m=0,u=x.length;m<u;m++)e.remove(x[m])}f.removeEventListener("dispose",o),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(d,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,n.memory.geometries++),f}function l(d){const f=d.attributes;for(const v in f)e.update(f[v],t.ARRAY_BUFFER);const p=d.morphAttributes;for(const v in p){const x=p[v];for(let m=0,u=x.length;m<u;m++)e.update(x[m],t.ARRAY_BUFFER)}}function c(d){const f=[],p=d.index,v=d.attributes.position;let x=0;if(p!==null){const g=p.array;x=p.version;for(let _=0,y=g.length;_<y;_+=3){const R=g[_+0],w=g[_+1],T=g[_+2];f.push(R,w,w,T,T,R)}}else if(v!==void 0){const g=v.array;x=v.version;for(let _=0,y=g.length/3-1;_<y;_+=3){const R=_+0,w=_+1,T=_+2;f.push(R,w,w,T,T,R)}}else return;const m=new(q_(f)?J_:Q_)(f,1);m.version=x;const u=s.get(d);u&&e.remove(u),s.set(d,m)}function h(d){const f=s.get(d);if(f){const p=d.index;p!==null&&f.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function mE(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*o),n.update(p,i,1)}function c(f,p,v){v!==0&&(t.drawElementsInstanced(i,p,s,f*o,v),n.update(p,i,v))}function h(f,p,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,v);let m=0;for(let u=0;u<v;u++)m+=p[u];n.update(m,i,1)}function d(f,p,v,x){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/o,p[u],x[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,x,0,v);let u=0;for(let g=0;g<v;g++)u+=p[g];for(let g=0;g<x.length;g++)n.update(u,i,x[g])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function gE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function _E(t,e,n){const i=new WeakMap,r=new mt;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let f=i.get(a);if(f===void 0||f.count!==d){let S=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",S)};var p=S;f!==void 0&&f.texture.dispose();const v=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,u=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let y=0;v===!0&&(y=1),x===!0&&(y=2),m===!0&&(y=3);let R=a.attributes.position.count*y,w=1;R>e.maxTextureSize&&(w=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const T=new Float32Array(R*w*4*d),A=new $_(T,R,w,d);A.type=pi,A.needsUpdate=!0;const M=y*4;for(let P=0;P<d;P++){const z=u[P],B=g[P],W=_[P],ne=R*w*4*P;for(let Y=0;Y<z.count;Y++){const Q=Y*M;v===!0&&(r.fromBufferAttribute(z,Y),T[ne+Q+0]=r.x,T[ne+Q+1]=r.y,T[ne+Q+2]=r.z,T[ne+Q+3]=0),x===!0&&(r.fromBufferAttribute(B,Y),T[ne+Q+4]=r.x,T[ne+Q+5]=r.y,T[ne+Q+6]=r.z,T[ne+Q+7]=0),m===!0&&(r.fromBufferAttribute(W,Y),T[ne+Q+8]=r.x,T[ne+Q+9]=r.y,T[ne+Q+10]=r.z,T[ne+Q+11]=W.itemSize===4?r.w:1)}}f={count:d,texture:A,size:new Pe(R,w)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let v=0;for(let m=0;m<c.length;m++)v+=c[m];const x=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(t,"morphTargetBaseInfluence",x),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function vE(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,d=e.get(l,h);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return d}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}class rv extends ln{constructor(e,n,i,r,s,o,a,l,c,h=Ks){if(h!==Ks&&h!==uo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ks&&(i=$r),i===void 0&&h===uo&&(i=co),super(null,r,s,o,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:xn,this.minFilter=l!==void 0?l:xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const sv=new ln,Um=new rv(1,1),ov=new $_,av=new rM,lv=new nv,Fm=[],Om=[],km=new Float32Array(16),zm=new Float32Array(9),Bm=new Float32Array(4);function So(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Fm[r];if(s===void 0&&(s=new Float32Array(r),Fm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function zt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Bt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function qc(t,e){let n=Om[e];n===void 0&&(n=new Int32Array(e),Om[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function xE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function yE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(zt(n,e))return;t.uniform2fv(this.addr,e),Bt(n,e)}}function SE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(zt(n,e))return;t.uniform3fv(this.addr,e),Bt(n,e)}}function ME(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(zt(n,e))return;t.uniform4fv(this.addr,e),Bt(n,e)}}function wE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(zt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Bt(n,e)}else{if(zt(n,i))return;Bm.set(i),t.uniformMatrix2fv(this.addr,!1,Bm),Bt(n,i)}}function EE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(zt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Bt(n,e)}else{if(zt(n,i))return;zm.set(i),t.uniformMatrix3fv(this.addr,!1,zm),Bt(n,i)}}function TE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(zt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Bt(n,e)}else{if(zt(n,i))return;km.set(i),t.uniformMatrix4fv(this.addr,!1,km),Bt(n,i)}}function AE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function CE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(zt(n,e))return;t.uniform2iv(this.addr,e),Bt(n,e)}}function RE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(zt(n,e))return;t.uniform3iv(this.addr,e),Bt(n,e)}}function bE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(zt(n,e))return;t.uniform4iv(this.addr,e),Bt(n,e)}}function PE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function LE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(zt(n,e))return;t.uniform2uiv(this.addr,e),Bt(n,e)}}function DE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(zt(n,e))return;t.uniform3uiv(this.addr,e),Bt(n,e)}}function IE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(zt(n,e))return;t.uniform4uiv(this.addr,e),Bt(n,e)}}function NE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Um.compareFunction=Y_,s=Um):s=sv,n.setTexture2D(e||s,r)}function UE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||av,r)}function FE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||lv,r)}function OE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||ov,r)}function kE(t){switch(t){case 5126:return xE;case 35664:return yE;case 35665:return SE;case 35666:return ME;case 35674:return wE;case 35675:return EE;case 35676:return TE;case 5124:case 35670:return AE;case 35667:case 35671:return CE;case 35668:case 35672:return RE;case 35669:case 35673:return bE;case 5125:return PE;case 36294:return LE;case 36295:return DE;case 36296:return IE;case 35678:case 36198:case 36298:case 36306:case 35682:return NE;case 35679:case 36299:case 36307:return UE;case 35680:case 36300:case 36308:case 36293:return FE;case 36289:case 36303:case 36311:case 36292:return OE}}function zE(t,e){t.uniform1fv(this.addr,e)}function BE(t,e){const n=So(e,this.size,2);t.uniform2fv(this.addr,n)}function HE(t,e){const n=So(e,this.size,3);t.uniform3fv(this.addr,n)}function GE(t,e){const n=So(e,this.size,4);t.uniform4fv(this.addr,n)}function VE(t,e){const n=So(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function WE(t,e){const n=So(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function XE(t,e){const n=So(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function jE(t,e){t.uniform1iv(this.addr,e)}function YE(t,e){t.uniform2iv(this.addr,e)}function qE(t,e){t.uniform3iv(this.addr,e)}function ZE(t,e){t.uniform4iv(this.addr,e)}function $E(t,e){t.uniform1uiv(this.addr,e)}function KE(t,e){t.uniform2uiv(this.addr,e)}function QE(t,e){t.uniform3uiv(this.addr,e)}function JE(t,e){t.uniform4uiv(this.addr,e)}function eT(t,e,n){const i=this.cache,r=e.length,s=qc(n,r);zt(i,s)||(t.uniform1iv(this.addr,s),Bt(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||sv,s[o])}function tT(t,e,n){const i=this.cache,r=e.length,s=qc(n,r);zt(i,s)||(t.uniform1iv(this.addr,s),Bt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||av,s[o])}function nT(t,e,n){const i=this.cache,r=e.length,s=qc(n,r);zt(i,s)||(t.uniform1iv(this.addr,s),Bt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||lv,s[o])}function iT(t,e,n){const i=this.cache,r=e.length,s=qc(n,r);zt(i,s)||(t.uniform1iv(this.addr,s),Bt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||ov,s[o])}function rT(t){switch(t){case 5126:return zE;case 35664:return BE;case 35665:return HE;case 35666:return GE;case 35674:return VE;case 35675:return WE;case 35676:return XE;case 5124:case 35670:return jE;case 35667:case 35671:return YE;case 35668:case 35672:return qE;case 35669:case 35673:return ZE;case 5125:return $E;case 36294:return KE;case 36295:return QE;case 36296:return JE;case 35678:case 36198:case 36298:case 36306:case 35682:return eT;case 35679:case 36299:case 36307:return tT;case 35680:case 36300:case 36308:case 36293:return nT;case 36289:case 36303:case 36311:case 36292:return iT}}class sT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=kE(n.type)}}class oT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=rT(n.type)}}class aT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const $u=/(\w+)(\])?(\[|\.)?/g;function Hm(t,e){t.seq.push(e),t.map[e.id]=e}function lT(t,e,n){const i=t.name,r=i.length;for($u.lastIndex=0;;){const s=$u.exec(i),o=$u.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Hm(n,c===void 0?new sT(a,t,e):new oT(a,t,e));break}else{let d=n.map[a];d===void 0&&(d=new aT(a),Hm(n,d)),n=d}}}class ql{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);lT(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function Gm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const cT=37297;let uT=0;function hT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function dT(t){const e=ut.getPrimaries(ut.workingColorSpace),n=ut.getPrimaries(t);let i;switch(e===n?i="":e===Mc&&n===Sc?i="LinearDisplayP3ToLinearSRGB":e===Sc&&n===Mc&&(i="LinearSRGBToLinearDisplayP3"),t){case yr:case Xc:return[i,"LinearTransferOETF"];case ei:case Ff:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Vm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+hT(t.getShaderSource(e),o)}else return r}function fT(t,e){const n=dT(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function pT(t,e){let n;switch(e){case vS:n="Linear";break;case xS:n="Reinhard";break;case yS:n="Cineon";break;case U_:n="ACESFilmic";break;case MS:n="AgX";break;case wS:n="Neutral";break;case SS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const wl=new O;function mT(){ut.getLuminanceCoefficients(wl);const t=wl.x.toFixed(4),e=wl.y.toFixed(4),n=wl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($o).join(`
`)}function _T(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function vT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function $o(t){return t!==""}function Wm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const xT=/^[ \t]*#include +<([\w\d./]+)>/gm;function bd(t){return t.replace(xT,ST)}const yT=new Map;function ST(t,e){let n=Ze[e];if(n===void 0){const i=yT.get(e);if(i!==void 0)n=Ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return bd(n)}const MT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jm(t){return t.replace(MT,wT)}function wT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ym(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function ET(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===D_?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===I_?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function TT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ao:case lo:e="ENVMAP_TYPE_CUBE";break;case Wc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function AT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case lo:e="ENVMAP_MODE_REFRACTION";break}return e}function CT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case N_:e="ENVMAP_BLENDING_MULTIPLY";break;case gS:e="ENVMAP_BLENDING_MIX";break;case _S:e="ENVMAP_BLENDING_ADD";break}return e}function RT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function bT(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=ET(n),c=TT(n),h=AT(n),d=CT(n),f=RT(n),p=gT(n),v=_T(s),x=r.createProgram();let m,u,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter($o).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter($o).join(`
`),u.length>0&&(u+=`
`)):(m=[Ym(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($o).join(`
`),u=[Ym(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==pr?"#define TONE_MAPPING":"",n.toneMapping!==pr?Ze.tonemapping_pars_fragment:"",n.toneMapping!==pr?pT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,fT("linearToOutputTexel",n.outputColorSpace),mT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter($o).join(`
`)),o=bd(o),o=Wm(o,n),o=Xm(o,n),a=bd(a),a=Wm(a,n),a=Xm(a,n),o=jm(o),a=jm(a),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",n.glslVersion===am?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===am?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const _=g+m+o,y=g+u+a,R=Gm(r,r.VERTEX_SHADER,_),w=Gm(r,r.FRAGMENT_SHADER,y);r.attachShader(x,R),r.attachShader(x,w),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(P){if(t.debug.checkShaderErrors){const z=r.getProgramInfoLog(x).trim(),B=r.getShaderInfoLog(R).trim(),W=r.getShaderInfoLog(w).trim();let ne=!0,Y=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(ne=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,R,w);else{const Q=Vm(r,R,"vertex"),D=Vm(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+Q+`
`+D)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(B===""||W==="")&&(Y=!1);Y&&(P.diagnostics={runnable:ne,programLog:z,vertexShader:{log:B,prefix:m},fragmentShader:{log:W,prefix:u}})}r.deleteShader(R),r.deleteShader(w),A=new ql(r,x),M=vT(r,x)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let S=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(x,cT)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=uT++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=R,this.fragmentShader=w,this}let PT=0;class LT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new DT(e),n.set(e,i)),i}}class DT{constructor(e){this.id=PT++,this.code=e,this.usedTimes=0}}function IT(t,e,n,i,r,s,o){const a=new kf,l=new LT,c=new Set,h=[],d=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,S,P,z,B){const W=z.fog,ne=B.geometry,Y=M.isMeshStandardMaterial?z.environment:null,Q=(M.isMeshStandardMaterial?n:e).get(M.envMap||Y),D=Q&&Q.mapping===Wc?Q.image.height:null,q=v[M.type];M.precision!==null&&(p=r.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const J=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,se=J!==void 0?J.length:0;let ve=0;ne.morphAttributes.position!==void 0&&(ve=1),ne.morphAttributes.normal!==void 0&&(ve=2),ne.morphAttributes.color!==void 0&&(ve=3);let Ee,G,re,he;if(q){const Be=hi[q];Ee=Be.vertexShader,G=Be.fragmentShader}else Ee=M.vertexShader,G=M.fragmentShader,l.update(M),re=l.getVertexShaderID(M),he=l.getFragmentShaderID(M);const fe=t.getRenderTarget(),Te=B.isInstancedMesh===!0,ke=B.isBatchedMesh===!0,Xe=!!M.map,Qe=!!M.matcap,U=!!Q,nt=!!M.aoMap,je=!!M.lightMap,ze=!!M.bumpMap,De=!!M.normalMap,Ke=!!M.displacementMap,Ue=!!M.emissiveMap,be=!!M.metalnessMap,b=!!M.roughnessMap,E=M.anisotropy>0,j=M.clearcoat>0,le=M.dispersion>0,oe=M.iridescence>0,ae=M.sheen>0,Oe=M.transmission>0,Me=E&&!!M.anisotropyMap,Ae=j&&!!M.clearcoatMap,Ge=j&&!!M.clearcoatNormalMap,me=j&&!!M.clearcoatRoughnessMap,Ce=oe&&!!M.iridescenceMap,$=oe&&!!M.iridescenceThicknessMap,Z=ae&&!!M.sheenColorMap,te=ae&&!!M.sheenRoughnessMap,de=!!M.specularMap,pe=!!M.specularColorMap,xe=!!M.specularIntensityMap,N=Oe&&!!M.transmissionMap,ce=Oe&&!!M.thicknessMap,F=!!M.gradientMap,L=!!M.alphaMap,ee=M.alphaTest>0,ge=!!M.alphaHash,we=!!M.extensions;let Ve=pr;M.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Ve=t.toneMapping);const it={shaderID:q,shaderType:M.type,shaderName:M.name,vertexShader:Ee,fragmentShader:G,defines:M.defines,customVertexShaderID:re,customFragmentShaderID:he,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:ke,batchingColor:ke&&B._colorsTexture!==null,instancing:Te,instancingColor:Te&&B.instanceColor!==null,instancingMorph:Te&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:fe===null?t.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:yr,alphaToCoverage:!!M.alphaToCoverage,map:Xe,matcap:Qe,envMap:U,envMapMode:U&&Q.mapping,envMapCubeUVHeight:D,aoMap:nt,lightMap:je,bumpMap:ze,normalMap:De,displacementMap:f&&Ke,emissiveMap:Ue,normalMapObjectSpace:De&&M.normalMapType===CS,normalMapTangentSpace:De&&M.normalMapType===j_,metalnessMap:be,roughnessMap:b,anisotropy:E,anisotropyMap:Me,clearcoat:j,clearcoatMap:Ae,clearcoatNormalMap:Ge,clearcoatRoughnessMap:me,dispersion:le,iridescence:oe,iridescenceMap:Ce,iridescenceThicknessMap:$,sheen:ae,sheenColorMap:Z,sheenRoughnessMap:te,specularMap:de,specularColorMap:pe,specularIntensityMap:xe,transmission:Oe,transmissionMap:N,thicknessMap:ce,gradientMap:F,opaque:M.transparent===!1&&M.blending===$s&&M.alphaToCoverage===!1,alphaMap:L,alphaTest:ee,alphaHash:ge,combine:M.combine,mapUv:Xe&&x(M.map.channel),aoMapUv:nt&&x(M.aoMap.channel),lightMapUv:je&&x(M.lightMap.channel),bumpMapUv:ze&&x(M.bumpMap.channel),normalMapUv:De&&x(M.normalMap.channel),displacementMapUv:Ke&&x(M.displacementMap.channel),emissiveMapUv:Ue&&x(M.emissiveMap.channel),metalnessMapUv:be&&x(M.metalnessMap.channel),roughnessMapUv:b&&x(M.roughnessMap.channel),anisotropyMapUv:Me&&x(M.anisotropyMap.channel),clearcoatMapUv:Ae&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:Ge&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:me&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:$&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:Z&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:te&&x(M.sheenRoughnessMap.channel),specularMapUv:de&&x(M.specularMap.channel),specularColorMapUv:pe&&x(M.specularColorMap.channel),specularIntensityMapUv:xe&&x(M.specularIntensityMap.channel),transmissionMapUv:N&&x(M.transmissionMap.channel),thicknessMapUv:ce&&x(M.thicknessMap.channel),alphaMapUv:L&&x(M.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(De||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!ne.attributes.uv&&(Xe||L),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:B.isSkinnedMesh===!0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:ve,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ve,decodeVideoTexture:Xe&&M.map.isVideoTexture===!0&&ut.getTransfer(M.map.colorSpace)===vt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Hn,flipSided:M.side===wn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:we&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(we&&M.extensions.multiDraw===!0||ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return it.vertexUv1s=c.has(1),it.vertexUv2s=c.has(2),it.vertexUv3s=c.has(3),c.clear(),it}function u(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)S.push(P),S.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(g(S,M),_(S,M),S.push(t.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function g(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function _(M,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.skinning&&a.enable(4),S.morphTargets&&a.enable(5),S.morphNormals&&a.enable(6),S.morphColors&&a.enable(7),S.premultipliedAlpha&&a.enable(8),S.shadowMapEnabled&&a.enable(9),S.doubleSided&&a.enable(10),S.flipSided&&a.enable(11),S.useDepthPacking&&a.enable(12),S.dithering&&a.enable(13),S.transmission&&a.enable(14),S.sheen&&a.enable(15),S.opaque&&a.enable(16),S.pointsUvs&&a.enable(17),S.decodeVideoTexture&&a.enable(18),S.alphaToCoverage&&a.enable(19),M.push(a.mask)}function y(M){const S=v[M.type];let P;if(S){const z=hi[S];P=gM.clone(z.uniforms)}else P=M.uniforms;return P}function R(M,S){let P;for(let z=0,B=h.length;z<B;z++){const W=h[z];if(W.cacheKey===S){P=W,++P.usedTimes;break}}return P===void 0&&(P=new bT(t,S,M,s),h.push(P)),P}function w(M){if(--M.usedTimes===0){const S=h.indexOf(M);h[S]=h[h.length-1],h.pop(),M.destroy()}}function T(M){l.remove(M)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:y,acquireProgram:R,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:A}}function NT(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function UT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function qm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Zm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(d,f,p,v,x,m){let u=t[e];return u===void 0?(u={id:d.id,object:d,geometry:f,material:p,groupOrder:v,renderOrder:d.renderOrder,z:x,group:m},t[e]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=p,u.groupOrder=v,u.renderOrder=d.renderOrder,u.z=x,u.group=m),e++,u}function a(d,f,p,v,x,m){const u=o(d,f,p,v,x,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):n.push(u)}function l(d,f,p,v,x,m){const u=o(d,f,p,v,x,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):n.unshift(u)}function c(d,f){n.length>1&&n.sort(d||UT),i.length>1&&i.sort(f||qm),r.length>1&&r.sort(f||qm)}function h(){for(let d=e,f=t.length;d<f;d++){const p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function FT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new Zm,t.set(i,[o])):r>=s.length?(o=new Zm,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function OT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new O,color:new I};break;case"SpotLight":n={position:new O,direction:new O,color:new I,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new O,color:new I,distance:0,decay:0};break;case"HemisphereLight":n={direction:new O,skyColor:new I,groundColor:new I};break;case"RectAreaLight":n={color:new I,position:new O,halfWidth:new O,halfHeight:new O};break}return t[e.id]=n,n}}}function kT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let zT=0;function BT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function HT(t){const e=new OT,n=kT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);const r=new O,s=new pt,o=new pt;function a(c){let h=0,d=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,v=0,x=0,m=0,u=0,g=0,_=0,y=0,R=0,w=0,T=0;c.sort(BT);for(let M=0,S=c.length;M<S;M++){const P=c[M],z=P.color,B=P.intensity,W=P.distance,ne=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=z.r*B,d+=z.g*B,f+=z.b*B;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(P.sh.coefficients[Y],B);T++}else if(P.isDirectionalLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Q=P.shadow,D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,i.directionalShadow[p]=D,i.directionalShadowMap[p]=ne,i.directionalShadowMatrix[p]=P.shadow.matrix,g++}i.directional[p]=Y,p++}else if(P.isSpotLight){const Y=e.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(z).multiplyScalar(B),Y.distance=W,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,i.spot[x]=Y;const Q=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,Q.updateMatrices(P),P.castShadow&&w++),i.spotLightMatrix[x]=Q.matrix,P.castShadow){const D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,i.spotShadow[x]=D,i.spotShadowMap[x]=ne,y++}x++}else if(P.isRectAreaLight){const Y=e.get(P);Y.color.copy(z).multiplyScalar(B),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=Y,m++}else if(P.isPointLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const Q=P.shadow,D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,D.shadowCameraNear=Q.camera.near,D.shadowCameraFar=Q.camera.far,i.pointShadow[v]=D,i.pointShadowMap[v]=ne,i.pointShadowMatrix[v]=P.shadow.matrix,_++}i.point[v]=Y,v++}else if(P.isHemisphereLight){const Y=e.get(P);Y.skyColor.copy(P.color).multiplyScalar(B),Y.groundColor.copy(P.groundColor).multiplyScalar(B),i.hemi[u]=Y,u++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Re.LTC_FLOAT_1,i.rectAreaLTC2=Re.LTC_FLOAT_2):(i.rectAreaLTC1=Re.LTC_HALF_1,i.rectAreaLTC2=Re.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=f;const A=i.hash;(A.directionalLength!==p||A.pointLength!==v||A.spotLength!==x||A.rectAreaLength!==m||A.hemiLength!==u||A.numDirectionalShadows!==g||A.numPointShadows!==_||A.numSpotShadows!==y||A.numSpotMaps!==R||A.numLightProbes!==T)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=m,i.point.length=v,i.hemi.length=u,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=y+R-w,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=T,A.directionalLength=p,A.pointLength=v,A.spotLength=x,A.rectAreaLength=m,A.hemiLength=u,A.numDirectionalShadows=g,A.numPointShadows=_,A.numSpotShadows=y,A.numSpotMaps=R,A.numLightProbes=T,i.version=zT++)}function l(c,h){let d=0,f=0,p=0,v=0,x=0;const m=h.matrixWorldInverse;for(let u=0,g=c.length;u<g;u++){const _=c[u];if(_.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),d++}else if(_.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const y=i.rectArea[v];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),v++}else if(_.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const y=i.hemi[x];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function $m(t){const e=new HT(t),n=[],i=[];function r(h){c.camera=h,n.length=0,i.length=0}function s(h){n.push(h)}function o(h){i.push(h)}function a(){e.setup(n)}function l(h){e.setupView(n,h)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function GT(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new $m(t),e.set(r,[a])):s>=o.length?(a=new $m(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}class VT extends yo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=TS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class WT extends yo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const XT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,jT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function YT(t,e,n){let i=new zf;const r=new Pe,s=new Pe,o=new mt,a=new VT({depthPacking:AS}),l=new WT,c={},h=n.maxTextureSize,d={[xi]:wn,[wn]:xi,[Hn]:Hn},f=new si({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Pe},radius:{value:4}},vertexShader:XT,fragmentShader:jT}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new It;v.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Et(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=D_;let u=this.type;this.render=function(w,T,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=t.getRenderTarget(),S=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),z=t.state;z.setBlending(fr),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const B=u!==Ci&&this.type===Ci,W=u===Ci&&this.type!==Ci;for(let ne=0,Y=w.length;ne<Y;ne++){const Q=w[ne],D=Q.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const q=D.getFrameExtents();if(r.multiply(q),s.copy(D.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/q.x),r.x=s.x*q.x,D.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/q.y),r.y=s.y*q.y,D.mapSize.y=s.y)),D.map===null||B===!0||W===!0){const se=this.type!==Ci?{minFilter:xn,magFilter:xn}:{};D.map!==null&&D.map.dispose(),D.map=new zi(r.x,r.y,se),D.map.texture.name=Q.name+".shadowMap",D.camera.updateProjectionMatrix()}t.setRenderTarget(D.map),t.clear();const J=D.getViewportCount();for(let se=0;se<J;se++){const ve=D.getViewport(se);o.set(s.x*ve.x,s.y*ve.y,s.x*ve.z,s.y*ve.w),z.viewport(o),D.updateMatrices(Q,se),i=D.getFrustum(),y(T,A,D.camera,Q,this.type)}D.isPointLightShadow!==!0&&this.type===Ci&&g(D,A),D.needsUpdate=!1}u=this.type,m.needsUpdate=!1,t.setRenderTarget(M,S,P)};function g(w,T){const A=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new zi(r.x,r.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,t.setRenderTarget(w.mapPass),t.clear(),t.renderBufferDirect(T,null,A,f,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,t.setRenderTarget(w.map),t.clear(),t.renderBufferDirect(T,null,A,p,x,null)}function _(w,T,A,M){let S=null;const P=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)S=P;else if(S=A.isPointLight===!0?l:a,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const z=S.uuid,B=T.uuid;let W=c[z];W===void 0&&(W={},c[z]=W);let ne=W[B];ne===void 0&&(ne=S.clone(),W[B]=ne,T.addEventListener("dispose",R)),S=ne}if(S.visible=T.visible,S.wireframe=T.wireframe,M===Ci?S.side=T.shadowSide!==null?T.shadowSide:T.side:S.side=T.shadowSide!==null?T.shadowSide:d[T.side],S.alphaMap=T.alphaMap,S.alphaTest=T.alphaTest,S.map=T.map,S.clipShadows=T.clipShadows,S.clippingPlanes=T.clippingPlanes,S.clipIntersection=T.clipIntersection,S.displacementMap=T.displacementMap,S.displacementScale=T.displacementScale,S.displacementBias=T.displacementBias,S.wireframeLinewidth=T.wireframeLinewidth,S.linewidth=T.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const z=t.properties.get(S);z.light=A}return S}function y(w,T,A,M,S){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Ci)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const B=e.update(w),W=w.material;if(Array.isArray(W)){const ne=B.groups;for(let Y=0,Q=ne.length;Y<Q;Y++){const D=ne[Y],q=W[D.materialIndex];if(q&&q.visible){const J=_(w,q,M,S);w.onBeforeShadow(t,w,T,A,B,J,D),t.renderBufferDirect(A,null,B,J,w,D),w.onAfterShadow(t,w,T,A,B,J,D)}}}else if(W.visible){const ne=_(w,W,M,S);w.onBeforeShadow(t,w,T,A,B,ne,null),t.renderBufferDirect(A,null,B,ne,w,null),w.onAfterShadow(t,w,T,A,B,ne,null)}}const z=w.children;for(let B=0,W=z.length;B<W;B++)y(z[B],T,A,M,S)}function R(w){w.target.removeEventListener("dispose",R);for(const A in c){const M=c[A],S=w.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}function qT(t){function e(){let N=!1;const ce=new mt;let F=null;const L=new mt(0,0,0,0);return{setMask:function(ee){F!==ee&&!N&&(t.colorMask(ee,ee,ee,ee),F=ee)},setLocked:function(ee){N=ee},setClear:function(ee,ge,we,Ve,it){it===!0&&(ee*=Ve,ge*=Ve,we*=Ve),ce.set(ee,ge,we,Ve),L.equals(ce)===!1&&(t.clearColor(ee,ge,we,Ve),L.copy(ce))},reset:function(){N=!1,F=null,L.set(-1,0,0,0)}}}function n(){let N=!1,ce=null,F=null,L=null;return{setTest:function(ee){ee?he(t.DEPTH_TEST):fe(t.DEPTH_TEST)},setMask:function(ee){ce!==ee&&!N&&(t.depthMask(ee),ce=ee)},setFunc:function(ee){if(F!==ee){switch(ee){case cS:t.depthFunc(t.NEVER);break;case uS:t.depthFunc(t.ALWAYS);break;case hS:t.depthFunc(t.LESS);break;case xc:t.depthFunc(t.LEQUAL);break;case dS:t.depthFunc(t.EQUAL);break;case fS:t.depthFunc(t.GEQUAL);break;case pS:t.depthFunc(t.GREATER);break;case mS:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}F=ee}},setLocked:function(ee){N=ee},setClear:function(ee){L!==ee&&(t.clearDepth(ee),L=ee)},reset:function(){N=!1,ce=null,F=null,L=null}}}function i(){let N=!1,ce=null,F=null,L=null,ee=null,ge=null,we=null,Ve=null,it=null;return{setTest:function(Be){N||(Be?he(t.STENCIL_TEST):fe(t.STENCIL_TEST))},setMask:function(Be){ce!==Be&&!N&&(t.stencilMask(Be),ce=Be)},setFunc:function(Be,yt,En){(F!==Be||L!==yt||ee!==En)&&(t.stencilFunc(Be,yt,En),F=Be,L=yt,ee=En)},setOp:function(Be,yt,En){(ge!==Be||we!==yt||Ve!==En)&&(t.stencilOp(Be,yt,En),ge=Be,we=yt,Ve=En)},setLocked:function(Be){N=Be},setClear:function(Be){it!==Be&&(t.clearStencil(Be),it=Be)},reset:function(){N=!1,ce=null,F=null,L=null,ee=null,ge=null,we=null,Ve=null,it=null}}}const r=new e,s=new n,o=new i,a=new WeakMap,l=new WeakMap;let c={},h={},d=new WeakMap,f=[],p=null,v=!1,x=null,m=null,u=null,g=null,_=null,y=null,R=null,w=new I(0,0,0),T=0,A=!1,M=null,S=null,P=null,z=null,B=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ne=!1,Y=0;const Q=t.getParameter(t.VERSION);Q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(Q)[1]),ne=Y>=1):Q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),ne=Y>=2);let D=null,q={};const J=t.getParameter(t.SCISSOR_BOX),se=t.getParameter(t.VIEWPORT),ve=new mt().fromArray(J),Ee=new mt().fromArray(se);function G(N,ce,F,L){const ee=new Uint8Array(4),ge=t.createTexture();t.bindTexture(N,ge),t.texParameteri(N,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(N,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let we=0;we<F;we++)N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY?t.texImage3D(ce,0,t.RGBA,1,1,L,0,t.RGBA,t.UNSIGNED_BYTE,ee):t.texImage2D(ce+we,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ee);return ge}const re={};re[t.TEXTURE_2D]=G(t.TEXTURE_2D,t.TEXTURE_2D,1),re[t.TEXTURE_CUBE_MAP]=G(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[t.TEXTURE_2D_ARRAY]=G(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),re[t.TEXTURE_3D]=G(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),he(t.DEPTH_TEST),s.setFunc(xc),ze(!1),De(nm),he(t.CULL_FACE),nt(fr);function he(N){c[N]!==!0&&(t.enable(N),c[N]=!0)}function fe(N){c[N]!==!1&&(t.disable(N),c[N]=!1)}function Te(N,ce){return h[N]!==ce?(t.bindFramebuffer(N,ce),h[N]=ce,N===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=ce),N===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=ce),!0):!1}function ke(N,ce){let F=f,L=!1;if(N){F=d.get(ce),F===void 0&&(F=[],d.set(ce,F));const ee=N.textures;if(F.length!==ee.length||F[0]!==t.COLOR_ATTACHMENT0){for(let ge=0,we=ee.length;ge<we;ge++)F[ge]=t.COLOR_ATTACHMENT0+ge;F.length=ee.length,L=!0}}else F[0]!==t.BACK&&(F[0]=t.BACK,L=!0);L&&t.drawBuffers(F)}function Xe(N){return p!==N?(t.useProgram(N),p=N,!0):!1}const Qe={[Fr]:t.FUNC_ADD,[jy]:t.FUNC_SUBTRACT,[Yy]:t.FUNC_REVERSE_SUBTRACT};Qe[qy]=t.MIN,Qe[Zy]=t.MAX;const U={[$y]:t.ZERO,[Ky]:t.ONE,[Qy]:t.SRC_COLOR,[Kh]:t.SRC_ALPHA,[rS]:t.SRC_ALPHA_SATURATE,[nS]:t.DST_COLOR,[eS]:t.DST_ALPHA,[Jy]:t.ONE_MINUS_SRC_COLOR,[Qh]:t.ONE_MINUS_SRC_ALPHA,[iS]:t.ONE_MINUS_DST_COLOR,[tS]:t.ONE_MINUS_DST_ALPHA,[sS]:t.CONSTANT_COLOR,[oS]:t.ONE_MINUS_CONSTANT_COLOR,[aS]:t.CONSTANT_ALPHA,[lS]:t.ONE_MINUS_CONSTANT_ALPHA};function nt(N,ce,F,L,ee,ge,we,Ve,it,Be){if(N===fr){v===!0&&(fe(t.BLEND),v=!1);return}if(v===!1&&(he(t.BLEND),v=!0),N!==Xy){if(N!==x||Be!==A){if((m!==Fr||_!==Fr)&&(t.blendEquation(t.FUNC_ADD),m=Fr,_=Fr),Be)switch(N){case $s:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case $h:t.blendFunc(t.ONE,t.ONE);break;case im:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case rm:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case $s:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case $h:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case im:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case rm:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}u=null,g=null,y=null,R=null,w.set(0,0,0),T=0,x=N,A=Be}return}ee=ee||ce,ge=ge||F,we=we||L,(ce!==m||ee!==_)&&(t.blendEquationSeparate(Qe[ce],Qe[ee]),m=ce,_=ee),(F!==u||L!==g||ge!==y||we!==R)&&(t.blendFuncSeparate(U[F],U[L],U[ge],U[we]),u=F,g=L,y=ge,R=we),(Ve.equals(w)===!1||it!==T)&&(t.blendColor(Ve.r,Ve.g,Ve.b,it),w.copy(Ve),T=it),x=N,A=!1}function je(N,ce){N.side===Hn?fe(t.CULL_FACE):he(t.CULL_FACE);let F=N.side===wn;ce&&(F=!F),ze(F),N.blending===$s&&N.transparent===!1?nt(fr):nt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),s.setFunc(N.depthFunc),s.setTest(N.depthTest),s.setMask(N.depthWrite),r.setMask(N.colorWrite);const L=N.stencilWrite;o.setTest(L),L&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ue(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?he(t.SAMPLE_ALPHA_TO_COVERAGE):fe(t.SAMPLE_ALPHA_TO_COVERAGE)}function ze(N){M!==N&&(N?t.frontFace(t.CW):t.frontFace(t.CCW),M=N)}function De(N){N!==Vy?(he(t.CULL_FACE),N!==S&&(N===nm?t.cullFace(t.BACK):N===Wy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):fe(t.CULL_FACE),S=N}function Ke(N){N!==P&&(ne&&t.lineWidth(N),P=N)}function Ue(N,ce,F){N?(he(t.POLYGON_OFFSET_FILL),(z!==ce||B!==F)&&(t.polygonOffset(ce,F),z=ce,B=F)):fe(t.POLYGON_OFFSET_FILL)}function be(N){N?he(t.SCISSOR_TEST):fe(t.SCISSOR_TEST)}function b(N){N===void 0&&(N=t.TEXTURE0+W-1),D!==N&&(t.activeTexture(N),D=N)}function E(N,ce,F){F===void 0&&(D===null?F=t.TEXTURE0+W-1:F=D);let L=q[F];L===void 0&&(L={type:void 0,texture:void 0},q[F]=L),(L.type!==N||L.texture!==ce)&&(D!==F&&(t.activeTexture(F),D=F),t.bindTexture(N,ce||re[N]),L.type=N,L.texture=ce)}function j(){const N=q[D];N!==void 0&&N.type!==void 0&&(t.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function le(){try{t.compressedTexImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function oe(){try{t.compressedTexImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ae(){try{t.texSubImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Oe(){try{t.texSubImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Me(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ae(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ge(){try{t.texStorage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function me(){try{t.texStorage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ce(){try{t.texImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $(){try{t.texImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(N){ve.equals(N)===!1&&(t.scissor(N.x,N.y,N.z,N.w),ve.copy(N))}function te(N){Ee.equals(N)===!1&&(t.viewport(N.x,N.y,N.z,N.w),Ee.copy(N))}function de(N,ce){let F=l.get(ce);F===void 0&&(F=new WeakMap,l.set(ce,F));let L=F.get(N);L===void 0&&(L=t.getUniformBlockIndex(ce,N.name),F.set(N,L))}function pe(N,ce){const L=l.get(ce).get(N);a.get(ce)!==L&&(t.uniformBlockBinding(ce,L,N.__bindingPointIndex),a.set(ce,L))}function xe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),c={},D=null,q={},h={},d=new WeakMap,f=[],p=null,v=!1,x=null,m=null,u=null,g=null,_=null,y=null,R=null,w=new I(0,0,0),T=0,A=!1,M=null,S=null,P=null,z=null,B=null,ve.set(0,0,t.canvas.width,t.canvas.height),Ee.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:he,disable:fe,bindFramebuffer:Te,drawBuffers:ke,useProgram:Xe,setBlending:nt,setMaterial:je,setFlipSided:ze,setCullFace:De,setLineWidth:Ke,setPolygonOffset:Ue,setScissorTest:be,activeTexture:b,bindTexture:E,unbindTexture:j,compressedTexImage2D:le,compressedTexImage3D:oe,texImage2D:Ce,texImage3D:$,updateUBOMapping:de,uniformBlockBinding:pe,texStorage2D:Ge,texStorage3D:me,texSubImage2D:ae,texSubImage3D:Oe,compressedTexSubImage2D:Me,compressedTexSubImage3D:Ae,scissor:Z,viewport:te,reset:xe}}function Km(t,e,n,i){const r=ZT(i);switch(n){case B_:return t*e;case G_:return t*e;case V_:return t*e*2;case Df:return t*e/r.components*r.byteLength;case If:return t*e/r.components*r.byteLength;case W_:return t*e*2/r.components*r.byteLength;case Nf:return t*e*2/r.components*r.byteLength;case H_:return t*e*3/r.components*r.byteLength;case Vn:return t*e*4/r.components*r.byteLength;case Uf:return t*e*4/r.components*r.byteLength;case Vl:case Wl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Xl:case jl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case rd:case od:return Math.max(t,16)*Math.max(e,8)/4;case id:case sd:return Math.max(t,8)*Math.max(e,8)/2;case ad:case ld:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case cd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case ud:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case hd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case dd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case fd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case pd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case md:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case gd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case _d:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case vd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case xd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case yd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Sd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Md:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case wd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Yl:case Ed:case Td:return Math.ceil(t/4)*Math.ceil(e/4)*16;case X_:case Ad:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Cd:case Rd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function ZT(t){switch(t){case yi:case O_:return{byteLength:1,components:1};case Aa:case k_:case _o:return{byteLength:2,components:1};case Pf:case Lf:return{byteLength:2,components:4};case $r:case bf:case pi:return{byteLength:4,components:1};case z_:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function $T(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Pe,h=new WeakMap;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(b,E){return p?new OffscreenCanvas(b,E):Ec("canvas")}function x(b,E,j){let le=1;const oe=be(b);if((oe.width>j||oe.height>j)&&(le=j/Math.max(oe.width,oe.height)),le<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const ae=Math.floor(le*oe.width),Oe=Math.floor(le*oe.height);d===void 0&&(d=v(ae,Oe));const Me=E?v(ae,Oe):d;return Me.width=ae,Me.height=Oe,Me.getContext("2d").drawImage(b,0,0,ae,Oe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+ae+"x"+Oe+")."),Me}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),b;return b}function m(b){return b.generateMipmaps&&b.minFilter!==xn&&b.minFilter!==bn}function u(b){t.generateMipmap(b)}function g(b,E,j,le,oe=!1){if(b!==null){if(t[b]!==void 0)return t[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let ae=E;if(E===t.RED&&(j===t.FLOAT&&(ae=t.R32F),j===t.HALF_FLOAT&&(ae=t.R16F),j===t.UNSIGNED_BYTE&&(ae=t.R8)),E===t.RED_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.R8UI),j===t.UNSIGNED_SHORT&&(ae=t.R16UI),j===t.UNSIGNED_INT&&(ae=t.R32UI),j===t.BYTE&&(ae=t.R8I),j===t.SHORT&&(ae=t.R16I),j===t.INT&&(ae=t.R32I)),E===t.RG&&(j===t.FLOAT&&(ae=t.RG32F),j===t.HALF_FLOAT&&(ae=t.RG16F),j===t.UNSIGNED_BYTE&&(ae=t.RG8)),E===t.RG_INTEGER&&(j===t.UNSIGNED_BYTE&&(ae=t.RG8UI),j===t.UNSIGNED_SHORT&&(ae=t.RG16UI),j===t.UNSIGNED_INT&&(ae=t.RG32UI),j===t.BYTE&&(ae=t.RG8I),j===t.SHORT&&(ae=t.RG16I),j===t.INT&&(ae=t.RG32I)),E===t.RGB&&j===t.UNSIGNED_INT_5_9_9_9_REV&&(ae=t.RGB9_E5),E===t.RGBA){const Oe=oe?yc:ut.getTransfer(le);j===t.FLOAT&&(ae=t.RGBA32F),j===t.HALF_FLOAT&&(ae=t.RGBA16F),j===t.UNSIGNED_BYTE&&(ae=Oe===vt?t.SRGB8_ALPHA8:t.RGBA8),j===t.UNSIGNED_SHORT_4_4_4_4&&(ae=t.RGBA4),j===t.UNSIGNED_SHORT_5_5_5_1&&(ae=t.RGB5_A1)}return(ae===t.R16F||ae===t.R32F||ae===t.RG16F||ae===t.RG32F||ae===t.RGBA16F||ae===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function _(b,E){let j;return b?E===null||E===$r||E===co?j=t.DEPTH24_STENCIL8:E===pi?j=t.DEPTH32F_STENCIL8:E===Aa&&(j=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===$r||E===co?j=t.DEPTH_COMPONENT24:E===pi?j=t.DEPTH_COMPONENT32F:E===Aa&&(j=t.DEPTH_COMPONENT16),j}function y(b,E){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==xn&&b.minFilter!==bn?Math.log2(Math.max(E.width,E.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?E.mipmaps.length:1}function R(b){const E=b.target;E.removeEventListener("dispose",R),T(E),E.isVideoTexture&&h.delete(E)}function w(b){const E=b.target;E.removeEventListener("dispose",w),M(E)}function T(b){const E=i.get(b);if(E.__webglInit===void 0)return;const j=b.source,le=f.get(j);if(le){const oe=le[E.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&A(b),Object.keys(le).length===0&&f.delete(j)}i.remove(b)}function A(b){const E=i.get(b);t.deleteTexture(E.__webglTexture);const j=b.source,le=f.get(j);delete le[E.__cacheKey],o.memory.textures--}function M(b){const E=i.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let le=0;le<6;le++){if(Array.isArray(E.__webglFramebuffer[le]))for(let oe=0;oe<E.__webglFramebuffer[le].length;oe++)t.deleteFramebuffer(E.__webglFramebuffer[le][oe]);else t.deleteFramebuffer(E.__webglFramebuffer[le]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[le])}else{if(Array.isArray(E.__webglFramebuffer))for(let le=0;le<E.__webglFramebuffer.length;le++)t.deleteFramebuffer(E.__webglFramebuffer[le]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let le=0;le<E.__webglColorRenderbuffer.length;le++)E.__webglColorRenderbuffer[le]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[le]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const j=b.textures;for(let le=0,oe=j.length;le<oe;le++){const ae=i.get(j[le]);ae.__webglTexture&&(t.deleteTexture(ae.__webglTexture),o.memory.textures--),i.remove(j[le])}i.remove(b)}let S=0;function P(){S=0}function z(){const b=S;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),S+=1,b}function B(b){const E=[];return E.push(b.wrapS),E.push(b.wrapT),E.push(b.wrapR||0),E.push(b.magFilter),E.push(b.minFilter),E.push(b.anisotropy),E.push(b.internalFormat),E.push(b.format),E.push(b.type),E.push(b.generateMipmaps),E.push(b.premultiplyAlpha),E.push(b.flipY),E.push(b.unpackAlignment),E.push(b.colorSpace),E.join()}function W(b,E){const j=i.get(b);if(b.isVideoTexture&&Ke(b),b.isRenderTargetTexture===!1&&b.version>0&&j.__version!==b.version){const le=b.image;if(le===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(j,b,E);return}}n.bindTexture(t.TEXTURE_2D,j.__webglTexture,t.TEXTURE0+E)}function ne(b,E){const j=i.get(b);if(b.version>0&&j.__version!==b.version){Ee(j,b,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,j.__webglTexture,t.TEXTURE0+E)}function Y(b,E){const j=i.get(b);if(b.version>0&&j.__version!==b.version){Ee(j,b,E);return}n.bindTexture(t.TEXTURE_3D,j.__webglTexture,t.TEXTURE0+E)}function Q(b,E){const j=i.get(b);if(b.version>0&&j.__version!==b.version){G(j,b,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,j.__webglTexture,t.TEXTURE0+E)}const D={[td]:t.REPEAT,[Di]:t.CLAMP_TO_EDGE,[nd]:t.MIRRORED_REPEAT},q={[xn]:t.NEAREST,[ES]:t.NEAREST_MIPMAP_NEAREST,[nl]:t.NEAREST_MIPMAP_LINEAR,[bn]:t.LINEAR,[Au]:t.LINEAR_MIPMAP_NEAREST,[Hr]:t.LINEAR_MIPMAP_LINEAR},J={[RS]:t.NEVER,[NS]:t.ALWAYS,[bS]:t.LESS,[Y_]:t.LEQUAL,[PS]:t.EQUAL,[IS]:t.GEQUAL,[LS]:t.GREATER,[DS]:t.NOTEQUAL};function se(b,E){if(E.type===pi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===bn||E.magFilter===Au||E.magFilter===nl||E.magFilter===Hr||E.minFilter===bn||E.minFilter===Au||E.minFilter===nl||E.minFilter===Hr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(b,t.TEXTURE_WRAP_S,D[E.wrapS]),t.texParameteri(b,t.TEXTURE_WRAP_T,D[E.wrapT]),(b===t.TEXTURE_3D||b===t.TEXTURE_2D_ARRAY)&&t.texParameteri(b,t.TEXTURE_WRAP_R,D[E.wrapR]),t.texParameteri(b,t.TEXTURE_MAG_FILTER,q[E.magFilter]),t.texParameteri(b,t.TEXTURE_MIN_FILTER,q[E.minFilter]),E.compareFunction&&(t.texParameteri(b,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(b,t.TEXTURE_COMPARE_FUNC,J[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===xn||E.minFilter!==nl&&E.minFilter!==Hr||E.type===pi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const j=e.get("EXT_texture_filter_anisotropic");t.texParameterf(b,j.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function ve(b,E){let j=!1;b.__webglInit===void 0&&(b.__webglInit=!0,E.addEventListener("dispose",R));const le=E.source;let oe=f.get(le);oe===void 0&&(oe={},f.set(le,oe));const ae=B(E);if(ae!==b.__cacheKey){oe[ae]===void 0&&(oe[ae]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,j=!0),oe[ae].usedTimes++;const Oe=oe[b.__cacheKey];Oe!==void 0&&(oe[b.__cacheKey].usedTimes--,Oe.usedTimes===0&&A(E)),b.__cacheKey=ae,b.__webglTexture=oe[ae].texture}return j}function Ee(b,E,j){let le=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(le=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(le=t.TEXTURE_3D);const oe=ve(b,E),ae=E.source;n.bindTexture(le,b.__webglTexture,t.TEXTURE0+j);const Oe=i.get(ae);if(ae.version!==Oe.__version||oe===!0){n.activeTexture(t.TEXTURE0+j);const Me=ut.getPrimaries(ut.workingColorSpace),Ae=E.colorSpace===tr?null:ut.getPrimaries(E.colorSpace),Ge=E.colorSpace===tr||Me===Ae?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge);let me=x(E.image,!1,r.maxTextureSize);me=Ue(E,me);const Ce=s.convert(E.format,E.colorSpace),$=s.convert(E.type);let Z=g(E.internalFormat,Ce,$,E.colorSpace,E.isVideoTexture);se(le,E);let te;const de=E.mipmaps,pe=E.isVideoTexture!==!0,xe=Oe.__version===void 0||oe===!0,N=ae.dataReady,ce=y(E,me);if(E.isDepthTexture)Z=_(E.format===uo,E.type),xe&&(pe?n.texStorage2D(t.TEXTURE_2D,1,Z,me.width,me.height):n.texImage2D(t.TEXTURE_2D,0,Z,me.width,me.height,0,Ce,$,null));else if(E.isDataTexture)if(de.length>0){pe&&xe&&n.texStorage2D(t.TEXTURE_2D,ce,Z,de[0].width,de[0].height);for(let F=0,L=de.length;F<L;F++)te=de[F],pe?N&&n.texSubImage2D(t.TEXTURE_2D,F,0,0,te.width,te.height,Ce,$,te.data):n.texImage2D(t.TEXTURE_2D,F,Z,te.width,te.height,0,Ce,$,te.data);E.generateMipmaps=!1}else pe?(xe&&n.texStorage2D(t.TEXTURE_2D,ce,Z,me.width,me.height),N&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,me.width,me.height,Ce,$,me.data)):n.texImage2D(t.TEXTURE_2D,0,Z,me.width,me.height,0,Ce,$,me.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){pe&&xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Z,de[0].width,de[0].height,me.depth);for(let F=0,L=de.length;F<L;F++)if(te=de[F],E.format!==Vn)if(Ce!==null)if(pe){if(N)if(E.layerUpdates.size>0){const ee=Km(te.width,te.height,E.format,E.type);for(const ge of E.layerUpdates){const we=te.data.subarray(ge*ee/te.data.BYTES_PER_ELEMENT,(ge+1)*ee/te.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,F,0,0,ge,te.width,te.height,1,Ce,we,0,0)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,F,0,0,0,te.width,te.height,me.depth,Ce,te.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,F,Z,te.width,te.height,me.depth,0,te.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else pe?N&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,F,0,0,0,te.width,te.height,me.depth,Ce,$,te.data):n.texImage3D(t.TEXTURE_2D_ARRAY,F,Z,te.width,te.height,me.depth,0,Ce,$,te.data)}else{pe&&xe&&n.texStorage2D(t.TEXTURE_2D,ce,Z,de[0].width,de[0].height);for(let F=0,L=de.length;F<L;F++)te=de[F],E.format!==Vn?Ce!==null?pe?N&&n.compressedTexSubImage2D(t.TEXTURE_2D,F,0,0,te.width,te.height,Ce,te.data):n.compressedTexImage2D(t.TEXTURE_2D,F,Z,te.width,te.height,0,te.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?N&&n.texSubImage2D(t.TEXTURE_2D,F,0,0,te.width,te.height,Ce,$,te.data):n.texImage2D(t.TEXTURE_2D,F,Z,te.width,te.height,0,Ce,$,te.data)}else if(E.isDataArrayTexture)if(pe){if(xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Z,me.width,me.height,me.depth),N)if(E.layerUpdates.size>0){const F=Km(me.width,me.height,E.format,E.type);for(const L of E.layerUpdates){const ee=me.data.subarray(L*F/me.data.BYTES_PER_ELEMENT,(L+1)*F/me.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,L,me.width,me.height,1,Ce,$,ee)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,Ce,$,me.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Z,me.width,me.height,me.depth,0,Ce,$,me.data);else if(E.isData3DTexture)pe?(xe&&n.texStorage3D(t.TEXTURE_3D,ce,Z,me.width,me.height,me.depth),N&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,Ce,$,me.data)):n.texImage3D(t.TEXTURE_3D,0,Z,me.width,me.height,me.depth,0,Ce,$,me.data);else if(E.isFramebufferTexture){if(xe)if(pe)n.texStorage2D(t.TEXTURE_2D,ce,Z,me.width,me.height);else{let F=me.width,L=me.height;for(let ee=0;ee<ce;ee++)n.texImage2D(t.TEXTURE_2D,ee,Z,F,L,0,Ce,$,null),F>>=1,L>>=1}}else if(de.length>0){if(pe&&xe){const F=be(de[0]);n.texStorage2D(t.TEXTURE_2D,ce,Z,F.width,F.height)}for(let F=0,L=de.length;F<L;F++)te=de[F],pe?N&&n.texSubImage2D(t.TEXTURE_2D,F,0,0,Ce,$,te):n.texImage2D(t.TEXTURE_2D,F,Z,Ce,$,te);E.generateMipmaps=!1}else if(pe){if(xe){const F=be(me);n.texStorage2D(t.TEXTURE_2D,ce,Z,F.width,F.height)}N&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Ce,$,me)}else n.texImage2D(t.TEXTURE_2D,0,Z,Ce,$,me);m(E)&&u(le),Oe.__version=ae.version,E.onUpdate&&E.onUpdate(E)}b.__version=E.version}function G(b,E,j){if(E.image.length!==6)return;const le=ve(b,E),oe=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,b.__webglTexture,t.TEXTURE0+j);const ae=i.get(oe);if(oe.version!==ae.__version||le===!0){n.activeTexture(t.TEXTURE0+j);const Oe=ut.getPrimaries(ut.workingColorSpace),Me=E.colorSpace===tr?null:ut.getPrimaries(E.colorSpace),Ae=E.colorSpace===tr||Oe===Me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ge=E.isCompressedTexture||E.image[0].isCompressedTexture,me=E.image[0]&&E.image[0].isDataTexture,Ce=[];for(let L=0;L<6;L++)!Ge&&!me?Ce[L]=x(E.image[L],!0,r.maxCubemapSize):Ce[L]=me?E.image[L].image:E.image[L],Ce[L]=Ue(E,Ce[L]);const $=Ce[0],Z=s.convert(E.format,E.colorSpace),te=s.convert(E.type),de=g(E.internalFormat,Z,te,E.colorSpace),pe=E.isVideoTexture!==!0,xe=ae.__version===void 0||le===!0,N=oe.dataReady;let ce=y(E,$);se(t.TEXTURE_CUBE_MAP,E);let F;if(Ge){pe&&xe&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,de,$.width,$.height);for(let L=0;L<6;L++){F=Ce[L].mipmaps;for(let ee=0;ee<F.length;ee++){const ge=F[ee];E.format!==Vn?Z!==null?pe?N&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee,0,0,ge.width,ge.height,Z,ge.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee,de,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):pe?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee,0,0,ge.width,ge.height,Z,te,ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee,de,ge.width,ge.height,0,Z,te,ge.data)}}}else{if(F=E.mipmaps,pe&&xe){F.length>0&&ce++;const L=be(Ce[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,de,L.width,L.height)}for(let L=0;L<6;L++)if(me){pe?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,Ce[L].width,Ce[L].height,Z,te,Ce[L].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,de,Ce[L].width,Ce[L].height,0,Z,te,Ce[L].data);for(let ee=0;ee<F.length;ee++){const we=F[ee].image[L].image;pe?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee+1,0,0,we.width,we.height,Z,te,we.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee+1,de,we.width,we.height,0,Z,te,we.data)}}else{pe?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,Z,te,Ce[L]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,de,Z,te,Ce[L]);for(let ee=0;ee<F.length;ee++){const ge=F[ee];pe?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee+1,0,0,Z,te,ge.image[L]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+L,ee+1,de,Z,te,ge.image[L])}}}m(E)&&u(t.TEXTURE_CUBE_MAP),ae.__version=oe.version,E.onUpdate&&E.onUpdate(E)}b.__version=E.version}function re(b,E,j,le,oe,ae){const Oe=s.convert(j.format,j.colorSpace),Me=s.convert(j.type),Ae=g(j.internalFormat,Oe,Me,j.colorSpace);if(!i.get(E).__hasExternalTextures){const me=Math.max(1,E.width>>ae),Ce=Math.max(1,E.height>>ae);oe===t.TEXTURE_3D||oe===t.TEXTURE_2D_ARRAY?n.texImage3D(oe,ae,Ae,me,Ce,E.depth,0,Oe,Me,null):n.texImage2D(oe,ae,Ae,me,Ce,0,Oe,Me,null)}n.bindFramebuffer(t.FRAMEBUFFER,b),De(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,le,oe,i.get(j).__webglTexture,0,ze(E)):(oe===t.TEXTURE_2D||oe>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,le,oe,i.get(j).__webglTexture,ae),n.bindFramebuffer(t.FRAMEBUFFER,null)}function he(b,E,j){if(t.bindRenderbuffer(t.RENDERBUFFER,b),E.depthBuffer){const le=E.depthTexture,oe=le&&le.isDepthTexture?le.type:null,ae=_(E.stencilBuffer,oe),Oe=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=ze(E);De(E)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Me,ae,E.width,E.height):j?t.renderbufferStorageMultisample(t.RENDERBUFFER,Me,ae,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ae,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Oe,t.RENDERBUFFER,b)}else{const le=E.textures;for(let oe=0;oe<le.length;oe++){const ae=le[oe],Oe=s.convert(ae.format,ae.colorSpace),Me=s.convert(ae.type),Ae=g(ae.internalFormat,Oe,Me,ae.colorSpace),Ge=ze(E);j&&De(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ge,Ae,E.width,E.height):De(E)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ge,Ae,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,Ae,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function fe(b,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,b),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),W(E.depthTexture,0);const le=i.get(E.depthTexture).__webglTexture,oe=ze(E);if(E.depthTexture.format===Ks)De(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,le,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,le,0);else if(E.depthTexture.format===uo)De(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,le,0,oe):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,le,0);else throw new Error("Unknown depthTexture format")}function Te(b){const E=i.get(b),j=b.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==b.depthTexture){const le=b.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),le){const oe=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,le.removeEventListener("dispose",oe)};le.addEventListener("dispose",oe),E.__depthDisposeCallback=oe}E.__boundDepthTexture=le}if(b.depthTexture&&!E.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");fe(E.__webglFramebuffer,b)}else if(j){E.__webglDepthbuffer=[];for(let le=0;le<6;le++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[le]),E.__webglDepthbuffer[le]===void 0)E.__webglDepthbuffer[le]=t.createRenderbuffer(),he(E.__webglDepthbuffer[le],b,!1);else{const oe=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=E.__webglDepthbuffer[le];t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,oe,t.RENDERBUFFER,ae)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),he(E.__webglDepthbuffer,b,!1);else{const le=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,le,t.RENDERBUFFER,oe)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function ke(b,E,j){const le=i.get(b);E!==void 0&&re(le.__webglFramebuffer,b,b.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),j!==void 0&&Te(b)}function Xe(b){const E=b.texture,j=i.get(b),le=i.get(E);b.addEventListener("dispose",w);const oe=b.textures,ae=b.isWebGLCubeRenderTarget===!0,Oe=oe.length>1;if(Oe||(le.__webglTexture===void 0&&(le.__webglTexture=t.createTexture()),le.__version=E.version,o.memory.textures++),ae){j.__webglFramebuffer=[];for(let Me=0;Me<6;Me++)if(E.mipmaps&&E.mipmaps.length>0){j.__webglFramebuffer[Me]=[];for(let Ae=0;Ae<E.mipmaps.length;Ae++)j.__webglFramebuffer[Me][Ae]=t.createFramebuffer()}else j.__webglFramebuffer[Me]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){j.__webglFramebuffer=[];for(let Me=0;Me<E.mipmaps.length;Me++)j.__webglFramebuffer[Me]=t.createFramebuffer()}else j.__webglFramebuffer=t.createFramebuffer();if(Oe)for(let Me=0,Ae=oe.length;Me<Ae;Me++){const Ge=i.get(oe[Me]);Ge.__webglTexture===void 0&&(Ge.__webglTexture=t.createTexture(),o.memory.textures++)}if(b.samples>0&&De(b)===!1){j.__webglMultisampledFramebuffer=t.createFramebuffer(),j.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let Me=0;Me<oe.length;Me++){const Ae=oe[Me];j.__webglColorRenderbuffer[Me]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,j.__webglColorRenderbuffer[Me]);const Ge=s.convert(Ae.format,Ae.colorSpace),me=s.convert(Ae.type),Ce=g(Ae.internalFormat,Ge,me,Ae.colorSpace,b.isXRRenderTarget===!0),$=ze(b);t.renderbufferStorageMultisample(t.RENDERBUFFER,$,Ce,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Me,t.RENDERBUFFER,j.__webglColorRenderbuffer[Me])}t.bindRenderbuffer(t.RENDERBUFFER,null),b.depthBuffer&&(j.__webglDepthRenderbuffer=t.createRenderbuffer(),he(j.__webglDepthRenderbuffer,b,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ae){n.bindTexture(t.TEXTURE_CUBE_MAP,le.__webglTexture),se(t.TEXTURE_CUBE_MAP,E);for(let Me=0;Me<6;Me++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ae=0;Ae<E.mipmaps.length;Ae++)re(j.__webglFramebuffer[Me][Ae],b,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Ae);else re(j.__webglFramebuffer[Me],b,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0);m(E)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Oe){for(let Me=0,Ae=oe.length;Me<Ae;Me++){const Ge=oe[Me],me=i.get(Ge);n.bindTexture(t.TEXTURE_2D,me.__webglTexture),se(t.TEXTURE_2D,Ge),re(j.__webglFramebuffer,b,Ge,t.COLOR_ATTACHMENT0+Me,t.TEXTURE_2D,0),m(Ge)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let Me=t.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(Me=b.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Me,le.__webglTexture),se(Me,E),E.mipmaps&&E.mipmaps.length>0)for(let Ae=0;Ae<E.mipmaps.length;Ae++)re(j.__webglFramebuffer[Ae],b,E,t.COLOR_ATTACHMENT0,Me,Ae);else re(j.__webglFramebuffer,b,E,t.COLOR_ATTACHMENT0,Me,0);m(E)&&u(Me),n.unbindTexture()}b.depthBuffer&&Te(b)}function Qe(b){const E=b.textures;for(let j=0,le=E.length;j<le;j++){const oe=E[j];if(m(oe)){const ae=b.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Oe=i.get(oe).__webglTexture;n.bindTexture(ae,Oe),u(ae),n.unbindTexture()}}}const U=[],nt=[];function je(b){if(b.samples>0){if(De(b)===!1){const E=b.textures,j=b.width,le=b.height;let oe=t.COLOR_BUFFER_BIT;const ae=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Oe=i.get(b),Me=E.length>1;if(Me)for(let Ae=0;Ae<E.length;Ae++)n.bindFramebuffer(t.FRAMEBUFFER,Oe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ae,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Oe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ae,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Oe.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Oe.__webglFramebuffer);for(let Ae=0;Ae<E.length;Ae++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(oe|=t.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(oe|=t.STENCIL_BUFFER_BIT)),Me){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Oe.__webglColorRenderbuffer[Ae]);const Ge=i.get(E[Ae]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ge,0)}t.blitFramebuffer(0,0,j,le,0,0,j,le,oe,t.NEAREST),l===!0&&(U.length=0,nt.length=0,U.push(t.COLOR_ATTACHMENT0+Ae),b.depthBuffer&&b.resolveDepthBuffer===!1&&(U.push(ae),nt.push(ae),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,nt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,U))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Me)for(let Ae=0;Ae<E.length;Ae++){n.bindFramebuffer(t.FRAMEBUFFER,Oe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ae,t.RENDERBUFFER,Oe.__webglColorRenderbuffer[Ae]);const Ge=i.get(E[Ae]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Oe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ae,t.TEXTURE_2D,Ge,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Oe.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const E=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function ze(b){return Math.min(r.maxSamples,b.samples)}function De(b){const E=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ke(b){const E=o.render.frame;h.get(b)!==E&&(h.set(b,E),b.update())}function Ue(b,E){const j=b.colorSpace,le=b.format,oe=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||j!==yr&&j!==tr&&(ut.getTransfer(j)===vt?(le!==Vn||oe!==yi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),E}function be(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=P,this.setTexture2D=W,this.setTexture2DArray=ne,this.setTexture3D=Y,this.setTextureCube=Q,this.rebindTextures=ke,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=Qe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=re,this.useMultisampledRTT=De}function KT(t,e){function n(i,r=tr){let s;const o=ut.getTransfer(r);if(i===yi)return t.UNSIGNED_BYTE;if(i===Pf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Lf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===z_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===O_)return t.BYTE;if(i===k_)return t.SHORT;if(i===Aa)return t.UNSIGNED_SHORT;if(i===bf)return t.INT;if(i===$r)return t.UNSIGNED_INT;if(i===pi)return t.FLOAT;if(i===_o)return t.HALF_FLOAT;if(i===B_)return t.ALPHA;if(i===H_)return t.RGB;if(i===Vn)return t.RGBA;if(i===G_)return t.LUMINANCE;if(i===V_)return t.LUMINANCE_ALPHA;if(i===Ks)return t.DEPTH_COMPONENT;if(i===uo)return t.DEPTH_STENCIL;if(i===Df)return t.RED;if(i===If)return t.RED_INTEGER;if(i===W_)return t.RG;if(i===Nf)return t.RG_INTEGER;if(i===Uf)return t.RGBA_INTEGER;if(i===Vl||i===Wl||i===Xl||i===jl)if(o===vt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Vl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Wl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===jl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Vl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Wl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===jl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===id||i===rd||i===sd||i===od)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===id)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===sd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===od)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ad||i===ld||i===cd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ad||i===ld)return o===vt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===cd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ud||i===hd||i===dd||i===fd||i===pd||i===md||i===gd||i===_d||i===vd||i===xd||i===yd||i===Sd||i===Md||i===wd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===ud)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===hd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===dd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===md)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_d)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Md)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===wd)return o===vt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Yl||i===Ed||i===Td)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Yl)return o===vt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ed)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Td)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===X_||i===Ad||i===Cd||i===Rd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Yl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Ad)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===co?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class QT extends zn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class mi extends Dt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const JT={type:"move"};class Ku{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const m=n.getJointPose(x,i),u=this._getHandJoint(c,x);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(JT)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new mi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const e2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t2=`
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

}`;class n2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new ln,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new si({vertexShader:e2,fragmentShader:t2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Et(new ns(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class i2 extends es{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,p=null,v=null;const x=new n2,m=n.getContextAttributes();let u=null,g=null;const _=[],y=[],R=new Pe;let w=null;const T=new zn;T.layers.enable(1),T.viewport=new mt;const A=new zn;A.layers.enable(2),A.viewport=new mt;const M=[T,A],S=new QT;S.layers.enable(1),S.layers.enable(2);let P=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let re=_[G];return re===void 0&&(re=new Ku,_[G]=re),re.getTargetRaySpace()},this.getControllerGrip=function(G){let re=_[G];return re===void 0&&(re=new Ku,_[G]=re),re.getGripSpace()},this.getHand=function(G){let re=_[G];return re===void 0&&(re=new Ku,_[G]=re),re.getHandSpace()};function B(G){const re=y.indexOf(G.inputSource);if(re===-1)return;const he=_[re];he!==void 0&&(he.update(G.inputSource,G.frame,c||o),he.dispatchEvent({type:G.type,data:G.inputSource}))}function W(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",ne);for(let G=0;G<_.length;G++){const re=y[G];re!==null&&(y[G]=null,_[G].disconnect(re))}P=null,z=null,x.reset(),e.setRenderTarget(u),p=null,f=null,d=null,r=null,g=null,Ee.stop(),i.isPresenting=!1,e.setPixelRatio(w),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",W),r.addEventListener("inputsourceschange",ne),m.xrCompatible!==!0&&await n.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const re={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,re),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new zi(p.framebufferWidth,p.framebufferHeight,{format:Vn,type:yi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let re=null,he=null,fe=null;m.depth&&(fe=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,re=m.stencil?uo:Ks,he=m.stencil?co:$r);const Te={colorFormat:n.RGBA8,depthFormat:fe,scaleFactor:s};d=new XRWebGLBinding(r,n),f=d.createProjectionLayer(Te),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new zi(f.textureWidth,f.textureHeight,{format:Vn,type:yi,depthTexture:new rv(f.textureWidth,f.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ee.setContext(r),Ee.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function ne(G){for(let re=0;re<G.removed.length;re++){const he=G.removed[re],fe=y.indexOf(he);fe>=0&&(y[fe]=null,_[fe].disconnect(he))}for(let re=0;re<G.added.length;re++){const he=G.added[re];let fe=y.indexOf(he);if(fe===-1){for(let ke=0;ke<_.length;ke++)if(ke>=y.length){y.push(he),fe=ke;break}else if(y[ke]===null){y[ke]=he,fe=ke;break}if(fe===-1)break}const Te=_[fe];Te&&Te.connect(he)}}const Y=new O,Q=new O;function D(G,re,he){Y.setFromMatrixPosition(re.matrixWorld),Q.setFromMatrixPosition(he.matrixWorld);const fe=Y.distanceTo(Q),Te=re.projectionMatrix.elements,ke=he.projectionMatrix.elements,Xe=Te[14]/(Te[10]-1),Qe=Te[14]/(Te[10]+1),U=(Te[9]+1)/Te[5],nt=(Te[9]-1)/Te[5],je=(Te[8]-1)/Te[0],ze=(ke[8]+1)/ke[0],De=Xe*je,Ke=Xe*ze,Ue=fe/(-je+ze),be=Ue*-je;if(re.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(be),G.translateZ(Ue),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),Te[10]===-1)G.projectionMatrix.copy(re.projectionMatrix),G.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const b=Xe+Ue,E=Qe+Ue,j=De-be,le=Ke+(fe-be),oe=U*Qe/E*b,ae=nt*Qe/E*b;G.projectionMatrix.makePerspective(j,le,oe,ae,b,E),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function q(G,re){re===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(re.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;let re=G.near,he=G.far;x.texture!==null&&(x.depthNear>0&&(re=x.depthNear),x.depthFar>0&&(he=x.depthFar)),S.near=A.near=T.near=re,S.far=A.far=T.far=he,(P!==S.near||z!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),P=S.near,z=S.far);const fe=G.parent,Te=S.cameras;q(S,fe);for(let ke=0;ke<Te.length;ke++)q(Te[ke],fe);Te.length===2?D(S,T,A):S.projectionMatrix.copy(T.projectionMatrix),J(G,S,fe)};function J(G,re,he){he===null?G.matrix.copy(re.matrixWorld):(G.matrix.copy(he.matrixWorld),G.matrix.invert(),G.matrix.multiply(re.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(re.projectionMatrix),G.projectionMatrixInverse.copy(re.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Ca*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(G){l=G,f!==null&&(f.fixedFoveation=G),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=G)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(S)};let se=null;function ve(G,re){if(h=re.getViewerPose(c||o),v=re,h!==null){const he=h.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let fe=!1;he.length!==S.cameras.length&&(S.cameras.length=0,fe=!0);for(let ke=0;ke<he.length;ke++){const Xe=he[ke];let Qe=null;if(p!==null)Qe=p.getViewport(Xe);else{const nt=d.getViewSubImage(f,Xe);Qe=nt.viewport,ke===0&&(e.setRenderTargetTextures(g,nt.colorTexture,f.ignoreDepthValues?void 0:nt.depthStencilTexture),e.setRenderTarget(g))}let U=M[ke];U===void 0&&(U=new zn,U.layers.enable(ke),U.viewport=new mt,M[ke]=U),U.matrix.fromArray(Xe.transform.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale),U.projectionMatrix.fromArray(Xe.projectionMatrix),U.projectionMatrixInverse.copy(U.projectionMatrix).invert(),U.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),ke===0&&(S.matrix.copy(U.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),fe===!0&&S.cameras.push(U)}const Te=r.enabledFeatures;if(Te&&Te.includes("depth-sensing")){const ke=d.getDepthInformation(he[0]);ke&&ke.isValid&&ke.texture&&x.init(e,ke,r.renderState)}}for(let he=0;he<_.length;he++){const fe=y[he],Te=_[he];fe!==null&&Te!==void 0&&Te.update(fe,re,c||o)}se&&se(G,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),v=null}const Ee=new iv;Ee.setAnimationLoop(ve),this.setAnimationLoop=function(G){se=G},this.dispose=function(){}}}const Pr=new Si,r2=new pt;function s2(t,e){function n(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,ev(t)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,g,_,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),d(m,u)):u.isMeshPhongMaterial?(s(m,u),h(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,y)):u.isMeshMatcapMaterial?(s(m,u),v(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),x(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(o(m,u),u.isLineDashedMaterial&&a(m,u)):u.isPointsMaterial?l(m,u,g,_):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,n(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===wn&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,n(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===wn&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,n(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,n(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const g=e.get(u),_=g.envMap,y=g.envMapRotation;_&&(m.envMap.value=_,Pr.copy(y),Pr.x*=-1,Pr.y*=-1,Pr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Pr.y*=-1,Pr.z*=-1),m.envMapRotation.value.setFromMatrix4(r2.makeRotationFromEuler(Pr)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,m.aoMapTransform))}function o(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform))}function a(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,g,_){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*g,m.scale.value=_*.5,u.map&&(m.map.value=u.map,n(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function d(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,g){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===wn&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,u){u.matcap&&(m.matcap.value=u.matcap)}function x(m,u){const g=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function o2(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,_){const y=_.program;i.uniformBlockBinding(g,y)}function c(g,_){let y=r[g.id];y===void 0&&(v(g),y=h(g),r[g.id]=y,g.addEventListener("dispose",m));const R=_.program;i.updateUBOMapping(g,R);const w=e.render.frame;s[g.id]!==w&&(f(g),s[g.id]=w)}function h(g){const _=d();g.__bindingPointIndex=_;const y=t.createBuffer(),R=g.__size,w=g.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,R,w),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,_,y),y}function d(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const _=r[g.id],y=g.uniforms,R=g.__cache;t.bindBuffer(t.UNIFORM_BUFFER,_);for(let w=0,T=y.length;w<T;w++){const A=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,S=A.length;M<S;M++){const P=A[M];if(p(P,w,M,R)===!0){const z=P.__offset,B=Array.isArray(P.value)?P.value:[P.value];let W=0;for(let ne=0;ne<B.length;ne++){const Y=B[ne],Q=x(Y);typeof Y=="number"||typeof Y=="boolean"?(P.__data[0]=Y,t.bufferSubData(t.UNIFORM_BUFFER,z+W,P.__data)):Y.isMatrix3?(P.__data[0]=Y.elements[0],P.__data[1]=Y.elements[1],P.__data[2]=Y.elements[2],P.__data[3]=0,P.__data[4]=Y.elements[3],P.__data[5]=Y.elements[4],P.__data[6]=Y.elements[5],P.__data[7]=0,P.__data[8]=Y.elements[6],P.__data[9]=Y.elements[7],P.__data[10]=Y.elements[8],P.__data[11]=0):(Y.toArray(P.__data,W),W+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,z,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(g,_,y,R){const w=g.value,T=_+"_"+y;if(R[T]===void 0)return typeof w=="number"||typeof w=="boolean"?R[T]=w:R[T]=w.clone(),!0;{const A=R[T];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return R[T]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function v(g){const _=g.uniforms;let y=0;const R=16;for(let T=0,A=_.length;T<A;T++){const M=Array.isArray(_[T])?_[T]:[_[T]];for(let S=0,P=M.length;S<P;S++){const z=M[S],B=Array.isArray(z.value)?z.value:[z.value];for(let W=0,ne=B.length;W<ne;W++){const Y=B[W],Q=x(Y),D=y%R,q=D%Q.boundary,J=D+q;y+=q,J!==0&&R-J<Q.storage&&(y+=R-J),z.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=y,y+=Q.storage}}}const w=y%R;return w>0&&(y+=R-w),g.__size=y,g.__cache={},this}function x(g){const _={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(_.boundary=4,_.storage=4):g.isVector2?(_.boundary=8,_.storage=8):g.isVector3||g.isColor?(_.boundary=16,_.storage=12):g.isVector4?(_.boundary=16,_.storage=16):g.isMatrix3?(_.boundary=48,_.storage=48):g.isMatrix4?(_.boundary=64,_.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),_}function m(g){const _=g.target;_.removeEventListener("dispose",m);const y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function u(){for(const g in r)t.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:c,dispose:u}}class a2{constructor(e={}){const{canvas:n=KS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),v=new Int32Array(4);let x=null,m=null;const u=[],g=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ei,this.toneMapping=pr,this.toneMappingExposure=1;const _=this;let y=!1,R=0,w=0,T=null,A=-1,M=null;const S=new mt,P=new mt;let z=null;const B=new I(0);let W=0,ne=n.width,Y=n.height,Q=1,D=null,q=null;const J=new mt(0,0,ne,Y),se=new mt(0,0,ne,Y);let ve=!1;const Ee=new zf;let G=!1,re=!1;const he=new pt,fe=new O,Te=new mt,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xe=!1;function Qe(){return T===null?Q:1}let U=i;function nt(C,k){return n.getContext(C,k)}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Rf}`),n.addEventListener("webglcontextlost",F,!1),n.addEventListener("webglcontextrestored",L,!1),n.addEventListener("webglcontextcreationerror",ee,!1),U===null){const k="webgl2";if(U=nt(k,C),U===null)throw nt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let je,ze,De,Ke,Ue,be,b,E,j,le,oe,ae,Oe,Me,Ae,Ge,me,Ce,$,Z,te,de,pe,xe;function N(){je=new fE(U),je.init(),de=new KT(U,je),ze=new aE(U,je,e,de),De=new qT(U),Ke=new gE(U),Ue=new NT,be=new $T(U,je,De,Ue,ze,de,Ke),b=new cE(_),E=new dE(_),j=new wM(U),pe=new sE(U,j),le=new pE(U,j,Ke,pe),oe=new vE(U,le,j,Ke),$=new _E(U,ze,be),Ge=new lE(Ue),ae=new IT(_,b,E,je,ze,pe,Ge),Oe=new s2(_,Ue),Me=new FT,Ae=new GT(je),Ce=new rE(_,b,E,De,oe,f,l),me=new YT(_,oe,ze),xe=new o2(U,Ke,ze,De),Z=new oE(U,je,Ke),te=new mE(U,je,Ke),Ke.programs=ae.programs,_.capabilities=ze,_.extensions=je,_.properties=Ue,_.renderLists=Me,_.shadowMap=me,_.state=De,_.info=Ke}N();const ce=new i2(_,U);this.xr=ce,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const C=je.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=je.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(C){C!==void 0&&(Q=C,this.setSize(ne,Y,!1))},this.getSize=function(C){return C.set(ne,Y)},this.setSize=function(C,k,X=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ne=C,Y=k,n.width=Math.floor(C*Q),n.height=Math.floor(k*Q),X===!0&&(n.style.width=C+"px",n.style.height=k+"px"),this.setViewport(0,0,C,k)},this.getDrawingBufferSize=function(C){return C.set(ne*Q,Y*Q).floor()},this.setDrawingBufferSize=function(C,k,X){ne=C,Y=k,Q=X,n.width=Math.floor(C*X),n.height=Math.floor(k*X),this.setViewport(0,0,C,k)},this.getCurrentViewport=function(C){return C.copy(S)},this.getViewport=function(C){return C.copy(J)},this.setViewport=function(C,k,X,K){C.isVector4?J.set(C.x,C.y,C.z,C.w):J.set(C,k,X,K),De.viewport(S.copy(J).multiplyScalar(Q).round())},this.getScissor=function(C){return C.copy(se)},this.setScissor=function(C,k,X,K){C.isVector4?se.set(C.x,C.y,C.z,C.w):se.set(C,k,X,K),De.scissor(P.copy(se).multiplyScalar(Q).round())},this.getScissorTest=function(){return ve},this.setScissorTest=function(C){De.setScissorTest(ve=C)},this.setOpaqueSort=function(C){D=C},this.setTransparentSort=function(C){q=C},this.getClearColor=function(C){return C.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor.apply(Ce,arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha.apply(Ce,arguments)},this.clear=function(C=!0,k=!0,X=!0){let K=0;if(C){let H=!1;if(T!==null){const V=T.texture.format;H=V===Uf||V===Nf||V===If}if(H){const V=T.texture.type,ue=V===yi||V===$r||V===Aa||V===co||V===Pf||V===Lf,ye=Ce.getClearColor(),Se=Ce.getClearAlpha(),Ne=ye.r,He=ye.g,Le=ye.b;ue?(p[0]=Ne,p[1]=He,p[2]=Le,p[3]=Se,U.clearBufferuiv(U.COLOR,0,p)):(v[0]=Ne,v[1]=He,v[2]=Le,v[3]=Se,U.clearBufferiv(U.COLOR,0,v))}else K|=U.COLOR_BUFFER_BIT}k&&(K|=U.DEPTH_BUFFER_BIT),X&&(K|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",F,!1),n.removeEventListener("webglcontextrestored",L,!1),n.removeEventListener("webglcontextcreationerror",ee,!1),Me.dispose(),Ae.dispose(),Ue.dispose(),b.dispose(),E.dispose(),oe.dispose(),pe.dispose(),xe.dispose(),ae.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",En),ce.removeEventListener("sessionend",Mo),ai.stop()};function F(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const C=Ke.autoReset,k=me.enabled,X=me.autoUpdate,K=me.needsUpdate,H=me.type;N(),Ke.autoReset=C,me.enabled=k,me.autoUpdate=X,me.needsUpdate=K,me.type=H}function ee(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ge(C){const k=C.target;k.removeEventListener("dispose",ge),we(k)}function we(C){Ve(C),Ue.remove(C)}function Ve(C){const k=Ue.get(C).programs;k!==void 0&&(k.forEach(function(X){ae.releaseProgram(X)}),C.isShaderMaterial&&ae.releaseShaderCache(C))}this.renderBufferDirect=function(C,k,X,K,H,V){k===null&&(k=ke);const ue=H.isMesh&&H.matrixWorld.determinant()<0,ye=Eo(C,k,X,K,H);De.setMaterial(K,ue);let Se=X.index,Ne=1;if(K.wireframe===!0){if(Se=le.getWireframeAttribute(X),Se===void 0)return;Ne=2}const He=X.drawRange,Le=X.attributes.position;let Ye=He.start*Ne,ht=(He.start+He.count)*Ne;V!==null&&(Ye=Math.max(Ye,V.start*Ne),ht=Math.min(ht,(V.start+V.count)*Ne)),Se!==null?(Ye=Math.max(Ye,0),ht=Math.min(ht,Se.count)):Le!=null&&(Ye=Math.max(Ye,0),ht=Math.min(ht,Le.count));const ct=ht-Ye;if(ct<0||ct===1/0)return;pe.setup(H,K,ye,X,Se);let jt,rt=Z;if(Se!==null&&(jt=j.get(Se),rt=te,rt.setIndex(jt)),H.isMesh)K.wireframe===!0?(De.setLineWidth(K.wireframeLinewidth*Qe()),rt.setMode(U.LINES)):rt.setMode(U.TRIANGLES);else if(H.isLine){let Fe=K.linewidth;Fe===void 0&&(Fe=1),De.setLineWidth(Fe*Qe()),H.isLineSegments?rt.setMode(U.LINES):H.isLineLoop?rt.setMode(U.LINE_LOOP):rt.setMode(U.LINE_STRIP)}else H.isPoints?rt.setMode(U.POINTS):H.isSprite&&rt.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)rt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(je.get("WEBGL_multi_draw"))rt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Fe=H._multiDrawStarts,Ct=H._multiDrawCounts,lt=H._multiDrawCount,Yt=Se?j.get(Se).bytesPerElement:1,Yn=Ue.get(K).currentProgram.getUniforms();for(let Ht=0;Ht<lt;Ht++)Yn.setValue(U,"_gl_DrawID",Ht),rt.render(Fe[Ht]/Yt,Ct[Ht])}else if(H.isInstancedMesh)rt.renderInstances(Ye,ct,H.count);else if(X.isInstancedBufferGeometry){const Fe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ct=Math.min(X.instanceCount,Fe);rt.renderInstances(Ye,ct,Ct)}else rt.render(Ye,ct)};function it(C,k,X){C.transparent===!0&&C.side===Hn&&C.forceSinglePass===!1?(C.side=wn,C.needsUpdate=!0,rs(C,k,X),C.side=xi,C.needsUpdate=!0,rs(C,k,X),C.side=Hn):rs(C,k,X)}this.compile=function(C,k,X=null){X===null&&(X=C),m=Ae.get(X),m.init(k),g.push(m),X.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),C!==X&&C.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();const K=new Set;return C.traverse(function(H){const V=H.material;if(V)if(Array.isArray(V))for(let ue=0;ue<V.length;ue++){const ye=V[ue];it(ye,X,H),K.add(ye)}else it(V,X,H),K.add(V)}),g.pop(),m=null,K},this.compileAsync=function(C,k,X=null){const K=this.compile(C,k,X);return new Promise(H=>{function V(){if(K.forEach(function(ue){Ue.get(ue).currentProgram.isReady()&&K.delete(ue)}),K.size===0){H(C);return}setTimeout(V,10)}je.get("KHR_parallel_shader_compile")!==null?V():setTimeout(V,10)})};let Be=null;function yt(C){Be&&Be(C)}function En(){ai.stop()}function Mo(){ai.start()}const ai=new iv;ai.setAnimationLoop(yt),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(C){Be=C,ce.setAnimationLoop(C),C===null?ai.stop():ai.start()},ce.addEventListener("sessionstart",En),ce.addEventListener("sessionend",Mo),this.render=function(C,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(k),k=ce.getCamera()),C.isScene===!0&&C.onBeforeRender(_,C,k,T),m=Ae.get(C,g.length),m.init(k),g.push(m),he.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Ee.setFromProjectionMatrix(he),re=this.localClippingEnabled,G=Ge.init(this.clippingPlanes,re),x=Me.get(C,u.length),x.init(),u.push(x),ce.enabled===!0&&ce.isPresenting===!0){const V=_.xr.getDepthSensingMesh();V!==null&&Hi(V,k,-1/0,_.sortObjects)}Hi(C,k,0,_.sortObjects),x.finish(),_.sortObjects===!0&&x.sort(D,q),Xe=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Xe&&Ce.addToRenderList(x,C),this.info.render.frame++,G===!0&&Ge.beginShadows();const X=m.state.shadowsArray;me.render(X,C,k),G===!0&&Ge.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=x.opaque,H=x.transmissive;if(m.setupLights(),k.isArrayCamera){const V=k.cameras;if(H.length>0)for(let ue=0,ye=V.length;ue<ye;ue++){const Se=V[ue];wo(K,H,C,Se)}Xe&&Ce.render(C);for(let ue=0,ye=V.length;ue<ye;ue++){const Se=V[ue];Sr(x,C,Se,Se.viewport)}}else H.length>0&&wo(K,H,C,k),Xe&&Ce.render(C),Sr(x,C,k);T!==null&&(be.updateMultisampleRenderTarget(T),be.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(_,C,k),pe.resetDefaultState(),A=-1,M=null,g.pop(),g.length>0?(m=g[g.length-1],G===!0&&Ge.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,u.pop(),u.length>0?x=u[u.length-1]:x=null};function Hi(C,k,X,K){if(C.visible===!1)return;if(C.layers.test(k.layers)){if(C.isGroup)X=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(k);else if(C.isLight)m.pushLight(C),C.castShadow&&m.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Ee.intersectsSprite(C)){K&&Te.setFromMatrixPosition(C.matrixWorld).applyMatrix4(he);const ue=oe.update(C),ye=C.material;ye.visible&&x.push(C,ue,ye,X,Te.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Ee.intersectsObject(C))){const ue=oe.update(C),ye=C.material;if(K&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Te.copy(C.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Te.copy(ue.boundingSphere.center)),Te.applyMatrix4(C.matrixWorld).applyMatrix4(he)),Array.isArray(ye)){const Se=ue.groups;for(let Ne=0,He=Se.length;Ne<He;Ne++){const Le=Se[Ne],Ye=ye[Le.materialIndex];Ye&&Ye.visible&&x.push(C,ue,Ye,X,Te.z,Le)}}else ye.visible&&x.push(C,ue,ye,X,Te.z,null)}}const V=C.children;for(let ue=0,ye=V.length;ue<ye;ue++)Hi(V[ue],k,X,K)}function Sr(C,k,X,K){const H=C.opaque,V=C.transmissive,ue=C.transparent;m.setupLightsView(X),G===!0&&Ge.setGlobalState(_.clippingPlanes,X),K&&De.viewport(S.copy(K)),H.length>0&&Gi(H,k,X),V.length>0&&Gi(V,k,X),ue.length>0&&Gi(ue,k,X),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function wo(C,k,X,K){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[K.id]===void 0&&(m.state.transmissionRenderTarget[K.id]=new zi(1,1,{generateMipmaps:!0,type:je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float")?_o:yi,minFilter:Hr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ut.workingColorSpace}));const V=m.state.transmissionRenderTarget[K.id],ue=K.viewport||S;V.setSize(ue.z,ue.w);const ye=_.getRenderTarget();_.setRenderTarget(V),_.getClearColor(B),W=_.getClearAlpha(),W<1&&_.setClearColor(16777215,.5),_.clear(),Xe&&Ce.render(X);const Se=_.toneMapping;_.toneMapping=pr;const Ne=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),m.setupLightsView(K),G===!0&&Ge.setGlobalState(_.clippingPlanes,K),Gi(C,X,K),be.updateMultisampleRenderTarget(V),be.updateRenderTargetMipmap(V),je.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Le=0,Ye=k.length;Le<Ye;Le++){const ht=k[Le],ct=ht.object,jt=ht.geometry,rt=ht.material,Fe=ht.group;if(rt.side===Hn&&ct.layers.test(K.layers)){const Ct=rt.side;rt.side=wn,rt.needsUpdate=!0,is(ct,X,K,jt,rt,Fe),rt.side=Ct,rt.needsUpdate=!0,He=!0}}He===!0&&(be.updateMultisampleRenderTarget(V),be.updateRenderTargetMipmap(V))}_.setRenderTarget(ye),_.setClearColor(B,W),Ne!==void 0&&(K.viewport=Ne),_.toneMapping=Se}function Gi(C,k,X){const K=k.isScene===!0?k.overrideMaterial:null;for(let H=0,V=C.length;H<V;H++){const ue=C[H],ye=ue.object,Se=ue.geometry,Ne=K===null?ue.material:K,He=ue.group;ye.layers.test(X.layers)&&is(ye,k,X,Se,Ne,He)}}function is(C,k,X,K,H,V){C.onBeforeRender(_,k,X,K,H,V),C.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),H.onBeforeRender(_,k,X,K,C,V),H.transparent===!0&&H.side===Hn&&H.forceSinglePass===!1?(H.side=wn,H.needsUpdate=!0,_.renderBufferDirect(X,k,K,H,C,V),H.side=xi,H.needsUpdate=!0,_.renderBufferDirect(X,k,K,H,C,V),H.side=Hn):_.renderBufferDirect(X,k,K,H,C,V),C.onAfterRender(_,k,X,K,H,V)}function rs(C,k,X){k.isScene!==!0&&(k=ke);const K=Ue.get(C),H=m.state.lights,V=m.state.shadowsArray,ue=H.state.version,ye=ae.getParameters(C,H.state,V,k,X),Se=ae.getProgramCacheKey(ye);let Ne=K.programs;K.environment=C.isMeshStandardMaterial?k.environment:null,K.fog=k.fog,K.envMap=(C.isMeshStandardMaterial?E:b).get(C.envMap||K.environment),K.envMapRotation=K.environment!==null&&C.envMap===null?k.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",ge),Ne=new Map,K.programs=Ne);let He=Ne.get(Se);if(He!==void 0){if(K.currentProgram===He&&K.lightsStateVersion===ue)return Fa(C,ye),He}else ye.uniforms=ae.getUniforms(C),C.onBeforeCompile(ye,_),He=ae.acquireProgram(ye,Se),Ne.set(Se,He),K.uniforms=ye.uniforms;const Le=K.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Le.clippingPlanes=Ge.uniform),Fa(C,ye),K.needsLights=ka(C),K.lightsStateVersion=ue,K.needsLights&&(Le.ambientLightColor.value=H.state.ambient,Le.lightProbe.value=H.state.probe,Le.directionalLights.value=H.state.directional,Le.directionalLightShadows.value=H.state.directionalShadow,Le.spotLights.value=H.state.spot,Le.spotLightShadows.value=H.state.spotShadow,Le.rectAreaLights.value=H.state.rectArea,Le.ltc_1.value=H.state.rectAreaLTC1,Le.ltc_2.value=H.state.rectAreaLTC2,Le.pointLights.value=H.state.point,Le.pointLightShadows.value=H.state.pointShadow,Le.hemisphereLights.value=H.state.hemi,Le.directionalShadowMap.value=H.state.directionalShadowMap,Le.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Le.spotShadowMap.value=H.state.spotShadowMap,Le.spotLightMatrix.value=H.state.spotLightMatrix,Le.spotLightMap.value=H.state.spotLightMap,Le.pointShadowMap.value=H.state.pointShadowMap,Le.pointShadowMatrix.value=H.state.pointShadowMatrix),K.currentProgram=He,K.uniformsList=null,He}function ss(C){if(C.uniformsList===null){const k=C.currentProgram.getUniforms();C.uniformsList=ql.seqWithValue(k.seq,C.uniforms)}return C.uniformsList}function Fa(C,k){const X=Ue.get(C);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.batchingColor=k.batchingColor,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}function Eo(C,k,X,K,H){k.isScene!==!0&&(k=ke),be.resetTextureUnits();const V=k.fog,ue=K.isMeshStandardMaterial?k.environment:null,ye=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:yr,Se=(K.isMeshStandardMaterial?E:b).get(K.envMap||ue),Ne=K.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,He=!!X.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Le=!!X.morphAttributes.position,Ye=!!X.morphAttributes.normal,ht=!!X.morphAttributes.color;let ct=pr;K.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ct=_.toneMapping);const jt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,rt=jt!==void 0?jt.length:0,Fe=Ue.get(K),Ct=m.state.lights;if(G===!0&&(re===!0||C!==M)){const qt=C===M&&K.id===A;Ge.setState(K,C,qt)}let lt=!1;K.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Ct.state.version||Fe.outputColorSpace!==ye||H.isBatchedMesh&&Fe.batching===!1||!H.isBatchedMesh&&Fe.batching===!0||H.isBatchedMesh&&Fe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Fe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Fe.instancing===!1||!H.isInstancedMesh&&Fe.instancing===!0||H.isSkinnedMesh&&Fe.skinning===!1||!H.isSkinnedMesh&&Fe.skinning===!0||H.isInstancedMesh&&Fe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Fe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Fe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Fe.instancingMorph===!1&&H.morphTexture!==null||Fe.envMap!==Se||K.fog===!0&&Fe.fog!==V||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==Ge.numPlanes||Fe.numIntersection!==Ge.numIntersection)||Fe.vertexAlphas!==Ne||Fe.vertexTangents!==He||Fe.morphTargets!==Le||Fe.morphNormals!==Ye||Fe.morphColors!==ht||Fe.toneMapping!==ct||Fe.morphTargetsCount!==rt)&&(lt=!0):(lt=!0,Fe.__version=K.version);let Yt=Fe.currentProgram;lt===!0&&(Yt=rs(K,k,H));let Yn=!1,Ht=!1,Mr=!1;const st=Yt.getUniforms(),en=Fe.uniforms;if(De.useProgram(Yt.program)&&(Yn=!0,Ht=!0,Mr=!0),K.id!==A&&(A=K.id,Ht=!0),Yn||M!==C){st.setValue(U,"projectionMatrix",C.projectionMatrix),st.setValue(U,"viewMatrix",C.matrixWorldInverse);const qt=st.map.cameraPosition;qt!==void 0&&qt.setValue(U,fe.setFromMatrixPosition(C.matrixWorld)),ze.logarithmicDepthBuffer&&st.setValue(U,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&st.setValue(U,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,Ht=!0,Mr=!0)}if(H.isSkinnedMesh){st.setOptional(U,H,"bindMatrix"),st.setOptional(U,H,"bindMatrixInverse");const qt=H.skeleton;qt&&(qt.boneTexture===null&&qt.computeBoneTexture(),st.setValue(U,"boneTexture",qt.boneTexture,be))}H.isBatchedMesh&&(st.setOptional(U,H,"batchingTexture"),st.setValue(U,"batchingTexture",H._matricesTexture,be),st.setOptional(U,H,"batchingIdTexture"),st.setValue(U,"batchingIdTexture",H._indirectTexture,be),st.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&st.setValue(U,"batchingColorTexture",H._colorsTexture,be));const wr=X.morphAttributes;if((wr.position!==void 0||wr.normal!==void 0||wr.color!==void 0)&&$.update(H,X,Yt),(Ht||Fe.receiveShadow!==H.receiveShadow)&&(Fe.receiveShadow=H.receiveShadow,st.setValue(U,"receiveShadow",H.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(en.envMap.value=Se,en.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&k.environment!==null&&(en.envMapIntensity.value=k.environmentIntensity),Ht&&(st.setValue(U,"toneMappingExposure",_.toneMappingExposure),Fe.needsLights&&Oa(en,Mr),V&&K.fog===!0&&Oe.refreshFogUniforms(en,V),Oe.refreshMaterialUniforms(en,K,Q,Y,m.state.transmissionRenderTarget[C.id]),ql.upload(U,ss(Fe),en,be)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(ql.upload(U,ss(Fe),en,be),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&st.setValue(U,"center",H.center),st.setValue(U,"modelViewMatrix",H.modelViewMatrix),st.setValue(U,"normalMatrix",H.normalMatrix),st.setValue(U,"modelMatrix",H.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const qt=K.uniformsGroups;for(let Er=0,Jc=qt.length;Er<Jc;Er++){const jf=qt[Er];xe.update(jf,Yt),xe.bind(jf,Yt)}}return Yt}function Oa(C,k){C.ambientLightColor.needsUpdate=k,C.lightProbe.needsUpdate=k,C.directionalLights.needsUpdate=k,C.directionalLightShadows.needsUpdate=k,C.pointLights.needsUpdate=k,C.pointLightShadows.needsUpdate=k,C.spotLights.needsUpdate=k,C.spotLightShadows.needsUpdate=k,C.rectAreaLights.needsUpdate=k,C.hemisphereLights.needsUpdate=k}function ka(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,k,X){Ue.get(C.texture).__webglTexture=k,Ue.get(C.depthTexture).__webglTexture=X;const K=Ue.get(C);K.__hasExternalTextures=!0,K.__autoAllocateDepthBuffer=X===void 0,K.__autoAllocateDepthBuffer||je.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,k){const X=Ue.get(C);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(C,k=0,X=0){T=C,R=k,w=X;let K=!0,H=null,V=!1,ue=!1;if(C){const Se=Ue.get(C);if(Se.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(U.FRAMEBUFFER,null),K=!1;else if(Se.__webglFramebuffer===void 0)be.setupRenderTarget(C);else if(Se.__hasExternalTextures)be.rebindTextures(C,Ue.get(C.texture).__webglTexture,Ue.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Le=C.depthTexture;if(Se.__boundDepthTexture!==Le){if(Le!==null&&Ue.has(Le)&&(C.width!==Le.image.width||C.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");be.setupDepthRenderbuffer(C)}}const Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ue=!0);const He=Ue.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(He[k])?H=He[k][X]:H=He[k],V=!0):C.samples>0&&be.useMultisampledRTT(C)===!1?H=Ue.get(C).__webglMultisampledFramebuffer:Array.isArray(He)?H=He[X]:H=He,S.copy(C.viewport),P.copy(C.scissor),z=C.scissorTest}else S.copy(J).multiplyScalar(Q).floor(),P.copy(se).multiplyScalar(Q).floor(),z=ve;if(De.bindFramebuffer(U.FRAMEBUFFER,H)&&K&&De.drawBuffers(C,H),De.viewport(S),De.scissor(P),De.setScissorTest(z),V){const Se=Ue.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,Se.__webglTexture,X)}else if(ue){const Se=Ue.get(C.texture),Ne=k||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Se.__webglTexture,X||0,Ne)}A=-1},this.readRenderTargetPixels=function(C,k,X,K,H,V,ue){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Ue.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ue!==void 0&&(ye=ye[ue]),ye){De.bindFramebuffer(U.FRAMEBUFFER,ye);try{const Se=C.texture,Ne=Se.format,He=Se.type;if(!ze.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=C.width-K&&X>=0&&X<=C.height-H&&U.readPixels(k,X,K,H,de.convert(Ne),de.convert(He),V)}finally{const Se=T!==null?Ue.get(T).__webglFramebuffer:null;De.bindFramebuffer(U.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(C,k,X,K,H,V,ue){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Ue.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ue!==void 0&&(ye=ye[ue]),ye){De.bindFramebuffer(U.FRAMEBUFFER,ye);try{const Se=C.texture,Ne=Se.format,He=Se.type;if(!ze.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=C.width-K&&X>=0&&X<=C.height-H){const Le=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Le),U.bufferData(U.PIXEL_PACK_BUFFER,V.byteLength,U.STREAM_READ),U.readPixels(k,X,K,H,de.convert(Ne),de.convert(He),0),U.flush();const Ye=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);await QS(U,Ye,4);try{U.bindBuffer(U.PIXEL_PACK_BUFFER,Le),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,V)}finally{U.deleteBuffer(Le),U.deleteSync(Ye)}return V}}finally{const Se=T!==null?Ue.get(T).__webglFramebuffer:null;De.bindFramebuffer(U.FRAMEBUFFER,Se)}}},this.copyFramebufferToTexture=function(C,k=null,X=0){C.isTexture!==!0&&(aa("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,C=arguments[1]);const K=Math.pow(2,-X),H=Math.floor(C.image.width*K),V=Math.floor(C.image.height*K),ue=k!==null?k.x:0,ye=k!==null?k.y:0;be.setTexture2D(C,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,ue,ye,H,V),De.unbindTexture()},this.copyTextureToTexture=function(C,k,X=null,K=null,H=0){C.isTexture!==!0&&(aa("WebGLRenderer: copyTextureToTexture function signature has changed."),K=arguments[0]||null,C=arguments[1],k=arguments[2],H=arguments[3]||0,X=null);let V,ue,ye,Se,Ne,He;X!==null?(V=X.max.x-X.min.x,ue=X.max.y-X.min.y,ye=X.min.x,Se=X.min.y):(V=C.image.width,ue=C.image.height,ye=0,Se=0),K!==null?(Ne=K.x,He=K.y):(Ne=0,He=0);const Le=de.convert(k.format),Ye=de.convert(k.type);be.setTexture2D(k,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);const ht=U.getParameter(U.UNPACK_ROW_LENGTH),ct=U.getParameter(U.UNPACK_IMAGE_HEIGHT),jt=U.getParameter(U.UNPACK_SKIP_PIXELS),rt=U.getParameter(U.UNPACK_SKIP_ROWS),Fe=U.getParameter(U.UNPACK_SKIP_IMAGES),Ct=C.isCompressedTexture?C.mipmaps[H]:C.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,Ct.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ct.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,ye),U.pixelStorei(U.UNPACK_SKIP_ROWS,Se),C.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,H,Ne,He,V,ue,Le,Ye,Ct.data):C.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,H,Ne,He,Ct.width,Ct.height,Le,Ct.data):U.texSubImage2D(U.TEXTURE_2D,H,Ne,He,V,ue,Le,Ye,Ct),U.pixelStorei(U.UNPACK_ROW_LENGTH,ht),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ct),U.pixelStorei(U.UNPACK_SKIP_PIXELS,jt),U.pixelStorei(U.UNPACK_SKIP_ROWS,rt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Fe),H===0&&k.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),De.unbindTexture()},this.copyTextureToTexture3D=function(C,k,X=null,K=null,H=0){C.isTexture!==!0&&(aa("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,K=arguments[1]||null,C=arguments[2],k=arguments[3],H=arguments[4]||0);let V,ue,ye,Se,Ne,He,Le,Ye,ht;const ct=C.isCompressedTexture?C.mipmaps[H]:C.image;X!==null?(V=X.max.x-X.min.x,ue=X.max.y-X.min.y,ye=X.max.z-X.min.z,Se=X.min.x,Ne=X.min.y,He=X.min.z):(V=ct.width,ue=ct.height,ye=ct.depth,Se=0,Ne=0,He=0),K!==null?(Le=K.x,Ye=K.y,ht=K.z):(Le=0,Ye=0,ht=0);const jt=de.convert(k.format),rt=de.convert(k.type);let Fe;if(k.isData3DTexture)be.setTexture3D(k,0),Fe=U.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)be.setTexture2DArray(k,0),Fe=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);const Ct=U.getParameter(U.UNPACK_ROW_LENGTH),lt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Yt=U.getParameter(U.UNPACK_SKIP_PIXELS),Yn=U.getParameter(U.UNPACK_SKIP_ROWS),Ht=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ct.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ct.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Se),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ne),U.pixelStorei(U.UNPACK_SKIP_IMAGES,He),C.isDataTexture||C.isData3DTexture?U.texSubImage3D(Fe,H,Le,Ye,ht,V,ue,ye,jt,rt,ct.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Fe,H,Le,Ye,ht,V,ue,ye,jt,ct.data):U.texSubImage3D(Fe,H,Le,Ye,ht,V,ue,ye,jt,rt,ct),U.pixelStorei(U.UNPACK_ROW_LENGTH,Ct),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,lt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Yt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Yn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ht),H===0&&k.generateMipmaps&&U.generateMipmap(Fe),De.unbindTexture()},this.initRenderTarget=function(C){Ue.get(C).__webglFramebuffer===void 0&&be.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?be.setTextureCube(C,0):C.isData3DTexture?be.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?be.setTexture2DArray(C,0):be.setTexture2D(C,0),De.unbindTexture()},this.resetState=function(){R=0,w=0,T=null,De.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===Ff?"display-p3":"srgb",n.unpackColorSpace=ut.workingColorSpace===Xc?"display-p3":"srgb"}}let Pd=class extends Dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}};class l2 extends ln{constructor(e=null,n=1,i=1,r,s,o,a,l,c=xn,h=xn,d,f){super(null,o,a,l,c,h,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ld extends Kt{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Es=new pt,Qm=new pt,El=[],Jm=new ts,c2=new pt,ko=new Et,zo=new xo;class Cn extends Et{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Ld(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,c2)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new ts),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Es),Jm.copy(e.boundingBox).applyMatrix4(Es),this.boundingBox.union(Jm)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new xo),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,Es),zo.copy(e.boundingSphere).applyMatrix4(Es),this.boundingSphere.union(zo)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(ko.geometry=this.geometry,ko.material=this.material,ko.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zo.copy(this.boundingSphere),zo.applyMatrix4(i),e.ray.intersectsSphere(zo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Es),Qm.multiplyMatrices(i,Es),ko.matrixWorld=Qm,ko.raycast(e,El);for(let o=0,a=El.length;o<a;o++){const l=El[o];l.instanceId=s,l.object=this,n.push(l)}El.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new Ld(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new l2(new Float32Array(r*this.count),r,this.count,Df,pi));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class cv extends yo{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new I(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ac=new O,Cc=new O,e0=new pt,Bo=new jc,Tl=new xo,Qu=new O,t0=new O;class u2 extends Dt{constructor(e=new It,n=new cv){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Ac.fromBufferAttribute(n,r-1),Cc.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Ac.distanceTo(Cc);e.setAttribute("lineDistance",new et(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Tl.copy(i.boundingSphere),Tl.applyMatrix4(r),Tl.radius+=s,e.ray.intersectsSphere(Tl)===!1)return;e0.copy(r).invert(),Bo.copy(e.ray).applyMatrix4(e0);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const p=Math.max(0,o.start),v=Math.min(h.count,o.start+o.count);for(let x=p,m=v-1;x<m;x+=c){const u=h.getX(x),g=h.getX(x+1),_=Al(this,e,Bo,l,u,g);_&&n.push(_)}if(this.isLineLoop){const x=h.getX(v-1),m=h.getX(p),u=Al(this,e,Bo,l,x,m);u&&n.push(u)}}else{const p=Math.max(0,o.start),v=Math.min(f.count,o.start+o.count);for(let x=p,m=v-1;x<m;x+=c){const u=Al(this,e,Bo,l,x,x+1);u&&n.push(u)}if(this.isLineLoop){const x=Al(this,e,Bo,l,v-1,p);x&&n.push(x)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Al(t,e,n,i,r,s){const o=t.geometry.attributes.position;if(Ac.fromBufferAttribute(o,r),Cc.fromBufferAttribute(o,s),n.distanceSqToSegment(Ac,Cc,Qu,t0)>i)return;Qu.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Qu);if(!(l<e.near||l>e.far))return{distance:l,point:t0.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,object:t}}const n0=new O,i0=new O;class h2 extends u2{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)n0.fromBufferAttribute(n,r),i0.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+n0.distanceTo(i0);e.setAttribute("lineDistance",new et(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class d2 extends ln{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hf extends It{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],o=[],a=[],l=[],c=new O,h=new Pe;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let d=0,f=3;d<=n;d++,f+=3){const p=i+d/n*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=n;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new et(o,3)),this.setAttribute("normal",new et(a,3)),this.setAttribute("uv",new et(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hf(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class $t extends It{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],d=[],f=[],p=[];let v=0;const x=[],m=i/2;let u=0;g(),o===!1&&(e>0&&_(!0),n>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new et(d,3)),this.setAttribute("normal",new et(f,3)),this.setAttribute("uv",new et(p,2));function g(){const y=new O,R=new O;let w=0;const T=(n-e)/i;for(let A=0;A<=s;A++){const M=[],S=A/s,P=S*(n-e)+e;for(let z=0;z<=r;z++){const B=z/r,W=B*l+a,ne=Math.sin(W),Y=Math.cos(W);R.x=P*ne,R.y=-S*i+m,R.z=P*Y,d.push(R.x,R.y,R.z),y.set(ne,T,Y).normalize(),f.push(y.x,y.y,y.z),p.push(B,1-S),M.push(v++)}x.push(M)}for(let A=0;A<r;A++)for(let M=0;M<s;M++){const S=x[M][A],P=x[M+1][A],z=x[M+1][A+1],B=x[M][A+1];h.push(S,P,B),h.push(P,z,B),w+=6}c.addGroup(u,w,0),u+=w}function _(y){const R=v,w=new Pe,T=new O;let A=0;const M=y===!0?e:n,S=y===!0?1:-1;for(let z=1;z<=r;z++)d.push(0,m*S,0),f.push(0,S,0),p.push(.5,.5),v++;const P=v;for(let z=0;z<=r;z++){const W=z/r*l+a,ne=Math.cos(W),Y=Math.sin(W);T.x=M*Y,T.y=m*S,T.z=M*ne,d.push(T.x,T.y,T.z),f.push(0,S,0),w.x=ne*.5+.5,w.y=Y*.5*S+.5,p.push(w.x,w.y),v++}for(let z=0;z<r;z++){const B=R+z,W=P+z;y===!0?h.push(W,W+1,B):h.push(W+1,W,B),A+=3}c.addGroup(u,A,y===!0?1:2),u+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $t(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ra extends $t{constructor(e=1,n=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,n,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:n,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Ra(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Zc extends It{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],o=[];a(r),c(i),h(),this.setAttribute("position",new et(s,3)),this.setAttribute("normal",new et(s.slice(),3)),this.setAttribute("uv",new et(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(g){const _=new O,y=new O,R=new O;for(let w=0;w<n.length;w+=3)p(n[w+0],_),p(n[w+1],y),p(n[w+2],R),l(_,y,R,g)}function l(g,_,y,R){const w=R+1,T=[];for(let A=0;A<=w;A++){T[A]=[];const M=g.clone().lerp(y,A/w),S=_.clone().lerp(y,A/w),P=w-A;for(let z=0;z<=P;z++)z===0&&A===w?T[A][z]=M:T[A][z]=M.clone().lerp(S,z/P)}for(let A=0;A<w;A++)for(let M=0;M<2*(w-A)-1;M++){const S=Math.floor(M/2);M%2===0?(f(T[A][S+1]),f(T[A+1][S]),f(T[A][S])):(f(T[A][S+1]),f(T[A+1][S+1]),f(T[A+1][S]))}}function c(g){const _=new O;for(let y=0;y<s.length;y+=3)_.x=s[y+0],_.y=s[y+1],_.z=s[y+2],_.normalize().multiplyScalar(g),s[y+0]=_.x,s[y+1]=_.y,s[y+2]=_.z}function h(){const g=new O;for(let _=0;_<s.length;_+=3){g.x=s[_+0],g.y=s[_+1],g.z=s[_+2];const y=m(g)/2/Math.PI+.5,R=u(g)/Math.PI+.5;o.push(y,1-R)}v(),d()}function d(){for(let g=0;g<o.length;g+=6){const _=o[g+0],y=o[g+2],R=o[g+4],w=Math.max(_,y,R),T=Math.min(_,y,R);w>.9&&T<.1&&(_<.2&&(o[g+0]+=1),y<.2&&(o[g+2]+=1),R<.2&&(o[g+4]+=1))}}function f(g){s.push(g.x,g.y,g.z)}function p(g,_){const y=g*3;_.x=e[y+0],_.y=e[y+1],_.z=e[y+2]}function v(){const g=new O,_=new O,y=new O,R=new O,w=new Pe,T=new Pe,A=new Pe;for(let M=0,S=0;M<s.length;M+=9,S+=6){g.set(s[M+0],s[M+1],s[M+2]),_.set(s[M+3],s[M+4],s[M+5]),y.set(s[M+6],s[M+7],s[M+8]),w.set(o[S+0],o[S+1]),T.set(o[S+2],o[S+3]),A.set(o[S+4],o[S+5]),R.copy(g).add(_).add(y).divideScalar(3);const P=m(R);x(w,S+0,g,P),x(T,S+2,_,P),x(A,S+4,y,P)}}function x(g,_,y,R){R<0&&g.x===1&&(o[_]=g.x-1),y.x===0&&y.z===0&&(o[_]=R/2/Math.PI+.5)}function m(g){return Math.atan2(g.z,-g.x)}function u(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zc(e.vertices,e.indices,e.radius,e.details)}}class ba extends Zc{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new ba(e.radius,e.detail)}}const Cl=new O,Rl=new O,Ju=new O,bl=new ni;class f2 extends It{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(Qs*n),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),f={},p=[];for(let v=0;v<l;v+=3){o?(c[0]=o.getX(v),c[1]=o.getX(v+1),c[2]=o.getX(v+2)):(c[0]=v,c[1]=v+1,c[2]=v+2);const{a:x,b:m,c:u}=bl;if(x.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),u.fromBufferAttribute(a,c[2]),bl.getNormal(Ju),d[0]=`${Math.round(x.x*r)},${Math.round(x.y*r)},${Math.round(x.z*r)}`,d[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,d[2]=`${Math.round(u.x*r)},${Math.round(u.y*r)},${Math.round(u.z*r)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let g=0;g<3;g++){const _=(g+1)%3,y=d[g],R=d[_],w=bl[h[g]],T=bl[h[_]],A=`${y}_${R}`,M=`${R}_${y}`;M in f&&f[M]?(Ju.dot(f[M].normal)<=s&&(p.push(w.x,w.y,w.z),p.push(T.x,T.y,T.z)),f[M]=null):A in f||(f[A]={index0:c[g],index1:c[_],normal:Ju.clone()})}}for(const v in f)if(f[v]){const{index0:x,index1:m}=f[v];Cl.fromBufferAttribute(a,x),Rl.fromBufferAttribute(a,m),p.push(Cl.x,Cl.y,Cl.z),p.push(Rl.x,Rl.y,Rl.z)}this.setAttribute("position",new et(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class fo extends Zc{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new fo(e.radius,e.detail)}}class Gf extends It{constructor(e=.5,n=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],h=[];let d=e;const f=(n-e)/r,p=new O,v=new Pe;for(let x=0;x<=r;x++){for(let m=0;m<=i;m++){const u=s+m/i*o;p.x=d*Math.cos(u),p.y=d*Math.sin(u),l.push(p.x,p.y,p.z),c.push(0,0,1),v.x=(p.x/n+1)/2,v.y=(p.y/n+1)/2,h.push(v.x,v.y)}d+=f}for(let x=0;x<r;x++){const m=x*(i+1);for(let u=0;u<i;u++){const g=u+m,_=g,y=g+i+1,R=g+i+2,w=g+1;a.push(_,y,w),a.push(y,R,w)}}this.setIndex(a),this.setAttribute("position",new et(l,3)),this.setAttribute("normal",new et(c,3)),this.setAttribute("uv",new et(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Vf extends It{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new O,f=new O,p=[],v=[],x=[],m=[];for(let u=0;u<=i;u++){const g=[],_=u/i;let y=0;u===0&&o===0?y=.5/n:u===i&&l===Math.PI&&(y=-.5/n);for(let R=0;R<=n;R++){const w=R/n;d.x=-e*Math.cos(r+w*s)*Math.sin(o+_*a),d.y=e*Math.cos(o+_*a),d.z=e*Math.sin(r+w*s)*Math.sin(o+_*a),v.push(d.x,d.y,d.z),f.copy(d).normalize(),x.push(f.x,f.y,f.z),m.push(w+y,1-_),g.push(c++)}h.push(g)}for(let u=0;u<i;u++)for(let g=0;g<n;g++){const _=h[u][g+1],y=h[u][g],R=h[u+1][g],w=h[u+1][g+1];(u!==0||o>0)&&p.push(_,y,w),(u!==i-1||l<Math.PI)&&p.push(y,R,w)}this.setIndex(p),this.setAttribute("position",new et(v,3)),this.setAttribute("normal",new et(x,3)),this.setAttribute("uv",new et(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vf(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Pt extends yo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new I(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new I(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=j_,this.normalScale=new Pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $c extends Dt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new I(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class p2 extends $c{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new I(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const eh=new pt,r0=new O,s0=new O;class uv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Pe(512,512),this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zf,this._frameExtents=new Pe(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;r0.setFromMatrixPosition(e.matrixWorld),n.position.copy(r0),s0.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(s0),n.updateMatrixWorld(),eh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eh),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(eh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const o0=new pt,Ho=new O,th=new O;class m2 extends uv{constructor(){super(new zn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Pe(4,2),this._viewportCount=6,this._viewports=[new mt(2,1,1,1),new mt(0,1,1,1),new mt(3,1,1,1),new mt(1,1,1,1),new mt(3,0,1,1),new mt(1,0,1,1)],this._cubeDirections=[new O(1,0,0),new O(-1,0,0),new O(0,0,1),new O(0,0,-1),new O(0,1,0),new O(0,-1,0)],this._cubeUps=[new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,0,1),new O(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Ho.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ho),th.copy(i.position),th.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(th),i.updateMatrixWorld(),r.makeTranslation(-Ho.x,-Ho.y,-Ho.z),o0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(o0)}}class a0 extends $c{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new m2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class g2 extends uv{constructor(){super(new Yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _2 extends $c{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Dt.DEFAULT_UP),this.updateMatrix(),this.target=new Dt,this.shadow=new g2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class v2 extends $c{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class x2{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=l0(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=l0();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function l0(){return(typeof performance>"u"?Date:performance).now()}const c0=new pt;class y2{constructor(e,n,i=0,r=1/0){this.ray=new jc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new kf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return c0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(c0),this}intersectObject(e,n=!0,i=[]){return Dd(e,this,i,n),i.sort(u0),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Dd(e[r],this,i,n);return i.sort(u0),i}}function u0(t,e){return t.distance-e.distance}function Dd(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let o=0,a=s.length;o<a;o++)Dd(s[o],e,n,!0)}}class h0{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(an(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class S2 extends es{constructor(e,n){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Rf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Rf);const d0={type:"change"},Wf={type:"start"},hv={type:"end"},Pl=new jc,f0=new Qi,M2=Math.cos(70*bt.DEG2RAD),Ft=new O,gn=2*Math.PI,ft={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},nh=1e-6;class w2 extends S2{constructor(e,n=null){super(e,n),this.state=ft.NONE,this.enabled=!0,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zs.ROTATE,MIDDLE:Zs.DOLLY,RIGHT:Zs.PAN},this.touches={ONE:Bs.ROTATE,TWO:Bs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new Kr,this._lastTargetPosition=new O,this._quat=new Kr().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new h0,this._sphericalDelta=new h0,this._scale=1,this._panOffset=new O,this._rotateStart=new Pe,this._rotateEnd=new Pe,this._rotateDelta=new Pe,this._panStart=new Pe,this._panEnd=new Pe,this._panDelta=new Pe,this._dollyStart=new Pe,this._dollyEnd=new Pe,this._dollyDelta=new Pe,this._dollyDirection=new O,this._mouse=new Pe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=T2.bind(this),this._onPointerDown=E2.bind(this),this._onPointerUp=A2.bind(this),this._onContextMenu=I2.bind(this),this._onMouseWheel=b2.bind(this),this._onKeyDown=P2.bind(this),this._onTouchStart=L2.bind(this),this._onTouchMove=D2.bind(this),this._onMouseDown=C2.bind(this),this._onMouseMove=R2.bind(this),this._interceptControlDown=N2.bind(this),this._interceptControlUp=U2.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(d0),this.update(),this.state=ft.NONE}update(e=null){const n=this.object.position;Ft.copy(n).sub(this.target),Ft.applyQuaternion(this._quat),this._spherical.setFromVector3(Ft),this.autoRotate&&this.state===ft.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=gn:i>Math.PI&&(i-=gn),r<-Math.PI?r+=gn:r>Math.PI&&(r-=gn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(Ft.setFromSpherical(this._spherical),Ft.applyQuaternion(this._quatInverse),n.copy(this.target).add(Ft),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Ft.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new O(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ft.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Pl.origin.copy(this.object.position),Pl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Pl.direction))<M2?this.object.lookAt(this.target):(f0.setFromNormalAndCoplanarPoint(this.object.up,this.target),Pl.intersectPlane(f0,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>nh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>nh||this._lastTargetPosition.distanceToSquared(this.target)>nh?(this.dispatchEvent(d0),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?gn/60*this.autoRotateSpeed*e:gn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Ft.setFromMatrixColumn(n,0),Ft.multiplyScalar(-e),this._panOffset.add(Ft)}_panUp(e,n){this.screenSpacePanning===!0?Ft.setFromMatrixColumn(n,1):(Ft.setFromMatrixColumn(n,0),Ft.crossVectors(this.object.up,Ft)),Ft.multiplyScalar(e),this._panOffset.add(Ft)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;Ft.copy(r).sub(this.target);let s=Ft.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/n.clientHeight),this._rotateUp(gn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(gn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-gn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(gn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-gn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/n.clientHeight),this._rotateUp(gn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+n.x)*.5,a=(e.pageY+n.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Pe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function E2(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function T2(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function A2(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(hv),this.state=ft.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function C2(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Zs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=ft.DOLLY;break;case Zs.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ft.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ft.ROTATE}break;case Zs.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ft.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ft.PAN}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Wf)}function R2(t){switch(this.state){case ft.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case ft.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case ft.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function b2(t){this.enabled===!1||this.enableZoom===!1||this.state!==ft.NONE||(t.preventDefault(),this.dispatchEvent(Wf),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(hv))}function P2(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function L2(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Bs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=ft.TOUCH_ROTATE;break;case Bs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=ft.TOUCH_PAN;break;default:this.state=ft.NONE}break;case 2:switch(this.touches.TWO){case Bs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=ft.TOUCH_DOLLY_PAN;break;case Bs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=ft.TOUCH_DOLLY_ROTATE;break;default:this.state=ft.NONE}break;default:this.state=ft.NONE}this.state!==ft.NONE&&this.dispatchEvent(Wf)}function D2(t){switch(this._trackPointer(t),this.state){case ft.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case ft.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case ft.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case ft.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=ft.NONE}}function I2(t){this.enabled!==!1&&t.preventDefault()}function N2(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function U2(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Xf=20,Ua=16,p0=240,Ts=256,F2=42,O2=.8,k2=1.35,Wt=.28,z2=.18,dv=.36,B2=-.7,H2=-.52,la={timeOfDay:16.5,season:"spring",tide:"high",rippleStrength:.5,flowSpeed:.5,windStrength:.3,autoRotate:!1,quality:"high",debugTerrain:!1},Cs={spring:{canopyPrimary:new I(7778880),canopySecondary:new I(10672976),pineFoliage:new I(3106882),ground:new I(7576644),flowerColors:[new I(16027569),new I(16777215),new I(16771899)],grassTint:new I(9621327),snowAmount:0},summer:{canopyPrimary:new I(5409584),canopySecondary:new I(7646530),pineFoliage:new I(2644280),ground:new I(6457152),flowerColors:[new I(15684432),new I(16766287),new I(12216520)],grassTint:new I(7383612),snowAmount:0},autumn:{canopyPrimary:new I(14642972),canopySecondary:new I(16098594),pineFoliage:new I(3102266),ground:new I(9466440),flowerColors:[new I(16758605),new I(14172949)],grassTint:new I(11177042),snowAmount:0},winter:{canopyPrimary:new I(6056544),canopySecondary:new I(7833468),pineFoliage:new I(2509618),ground:new I(7897974),flowerColors:[],grassTint:new I(8818820),snowAmount:.65}},We={terrain:{grass:new I(7576644),grassMeadow:new I(8565322),rock:new I(9736072),rockDark:new I(7498852),cliffLedge:new I(10393742),dirt:new I(10124119),sand:new I(13286036),snow:new I(16185595),moss:new I(5602104),strataSoil:new I(6966323),strataRock1:new I(9209470),strataRock2:new I(7235680)},water:{shallow:new I(4772300),deep:new I(1145456),foam:new I(15793147),bedGravel:new I(8288366)},wood:{light:new I(13085050),dark:new I(7557680),plank:new I(14006150),beam:new I(6111010)},architecture:{tent:new I(16183524),teal:new I(1605748),cabinWood:new I(7557680),windowGlow:new I(16758087),standWood:new I(8543028)},base:new I(15985888)};class Kc{constructor(e=42){Je(this,"state");this.state=Math.floor(e)>>>0||1}next(){let e=this.state+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,n){return e+this.next()*(n-e)}gaussian(e=0,n=1){let i=this.next(),r=this.next();for(;i<=1e-15;)i=this.next();const s=Math.sqrt(-2*Math.log(i))*Math.cos(2*Math.PI*r);return e+s*n}}const Gr=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],Fn=new Uint8Array(512),rr=new Uint8Array(512);function G2(t){const e=new Uint8Array(256);for(let i=0;i<256;i++)e[i]=i;const n=new Kc(t);for(let i=255;i>0;i--){const r=Math.floor(n.next()*(i+1)),s=e[i];e[i]=e[r],e[r]=s}for(let i=0;i<512;i++)Fn[i]=e[i&255],rr[i]=e[i&255]%12}G2(F2);const V2=.5*(Math.sqrt(3)-1),Go=(3-Math.sqrt(3))/6;function Qc(t,e){let n=0,i=0,r=0;const s=(t+e)*V2,o=Math.floor(t+s),a=Math.floor(e+s),l=(o+a)*Go,c=o-l,h=a-l,d=t-c,f=e-h;let p,v;d>f?(p=1,v=0):(p=0,v=1);const x=d-p+Go,m=f-v+Go,u=d-1+2*Go,g=f-1+2*Go,_=o&255,y=a&255,R=rr[_+Fn[y]],w=rr[_+p+Fn[y+v]],T=rr[_+1+Fn[y+1]];let A=.5-d*d-f*f;if(A>=0){A*=A;const P=Gr[R];n=A*A*(P[0]*d+P[1]*f)}let M=.5-x*x-m*m;if(M>=0){M*=M;const P=Gr[w];i=M*M*(P[0]*x+P[1]*m)}let S=.5-u*u-g*g;if(S>=0){S*=S;const P=Gr[T];r=S*S*(P[0]*u+P[1]*g)}return 70*(n+i+r)}const Bn=Qc,W2=1/3,ci=1/6;function X2(t,e,n){let i=0,r=0,s=0,o=0;const a=(t+e+n)*W2,l=Math.floor(t+a),c=Math.floor(e+a),h=Math.floor(n+a),d=(l+c+h)*ci,f=l-d,p=c-d,v=h-d,x=t-f,m=e-p,u=n-v;let g,_,y,R,w,T;x>=m?m>=u?(g=1,_=0,y=0,R=1,w=1,T=0):x>=u?(g=1,_=0,y=0,R=1,w=0,T=1):(g=0,_=0,y=1,R=1,w=0,T=1):m<u?(g=0,_=0,y=1,R=0,w=1,T=1):x<u?(g=0,_=1,y=0,R=0,w=1,T=1):(g=0,_=1,y=0,R=1,w=1,T=0);const A=x-g+ci,M=m-_+ci,S=u-y+ci,P=x-R+2*ci,z=m-w+2*ci,B=u-T+2*ci,W=x-1+3*ci,ne=m-1+3*ci,Y=u-1+3*ci,Q=l&255,D=c&255,q=h&255,J=rr[Q+Fn[D+Fn[q]]],se=rr[Q+g+Fn[D+_+Fn[q+y]]],ve=rr[Q+R+Fn[D+w+Fn[q+T]]],Ee=rr[Q+1+Fn[D+1+Fn[q+1]]];let G=.6-x*x-m*m-u*u;if(G>=0){G*=G;const Te=Gr[J];i=G*G*(Te[0]*x+Te[1]*m+Te[2]*u)}let re=.6-A*A-M*M-S*S;if(re>=0){re*=re;const Te=Gr[se];r=re*re*(Te[0]*A+Te[1]*M+Te[2]*S)}let he=.6-P*P-z*z-B*B;if(he>=0){he*=he;const Te=Gr[ve];s=he*he*(Te[0]*P+Te[1]*z+Te[2]*B)}let fe=.6-W*W-ne*ne-Y*Y;if(fe>=0){fe*=fe;const Te=Gr[Ee];o=fe*fe*(Te[0]*W+Te[1]*ne+Te[2]*Y)}return 32*(i+r+s+o)}function m0(t,e,n=4,i=2,r=.5){let s=0,o=1,a=1,l=0;for(let c=0;c<n;c++)s+=Qc(t*o,e*o)*a,l+=a,a*=r,o*=i;return l>0?s/l:s}function j2(t,e,n=4,i=2,r=.5){let s=0,o=1,a=1,l=1,c=0;for(let h=0;h<n;h++){let d=1-Math.abs(Qc(t*o,e*o));d*=d,d*=l,l=Math.min(1,Math.max(0,d*2)),s+=d*a,c+=a,a*=r,o*=i}return c>0?s/c:s}function gi(t){if(t<0){const e=(t+8)/8;return 3.2*(1-e)+1.35*e+Math.sin(e*Math.PI)*.35}else{const e=t/8;return 1.35+Math.sin(e*Math.PI*.95)*1.15+e*.65}}function Gs(t){if(t<0)return .85+(t+8)/8*.45;{const e=t/8;return 1.3+e*e*3.1}}function di(t,e,n){const i=Math.min(Math.max((n-t)/(e-t),0),1);return i*i*(3-2*i)}function Y2(t,e){const n=Xf*.5,i=Ua*.5;if(Math.abs(t)>n||Math.abs(e)>i)return{height:0,zone:"out_of_bounds",distToStream:99};const r=j2(t*.22+4,e*.22-3,4,2,.48),s=m0(t*.32+10,e*.32-4,3,2,.45),o=Math.exp(-Math.pow((t+4.6)/3.4,2)-Math.pow((e+6.2)/2.2,2))*1.65,a=Math.exp(-Math.pow((t-4.5)/3.2,2)-Math.pow((e+6.4)/2,2))*1.45,l=2.1+r*1.1+s*.25+o+a,c=-7.6,h=-.4,d=-3.5,f=.85,p=t>=c&&t<=h&&e>=d&&e<=f,v=Math.min(t-c,h-t),x=Math.min(e-d,f-e),m=Math.min(v,x),u=di(-.25,.45,m),g=k2+Bn(t*.3+1,e*.3+1)*.02,_=di(.85,2.15,e),y=Bn(t*1.8,e*1.8)*.06+Bn(t*.8+5,e*.8+5)*.04,R=bt.lerp(g,.35,_)+y*(1-_)*_*2.2,w=.46+m0(t*.25+5,e*.25+5,3,2,.4)*.22;let T,A="bank";if(e<-3.5){const ne=di(-4.2,-3.2,e);T=bt.lerp(l,g,ne*(p?1:.35)),A="mountain"}else if(p&&u>.75)T=g,A="plateau";else if(p||t<.2&&e<=2.2)if(e>=.85&&e<=2.3&&t<=.4)T=R,A="cliff";else{const Y=di(-.4,.5,m);T=bt.lerp(.55,g,Y),A=Y>.6?"plateau":"cliff"}else t>1?(T=w,A="bank"):(T=.42+Bn(t*.4,e*.4)*.05,A="bank");const M=gi(e),S=Math.abs(t-M),P=Gs(e),z=di(P*1.15,P*.18,S);let B;if(e<.9){const ne=di(-7.5,.9,e);B=bt.lerp(1.75,.25,ne)+Bn(t*1.2,e*1.2)*.03}else B=.11+Bn(t*1.2+15,e*1.2+15)*.025;let W=T;return z>.001&&(W=bt.lerp(T,Math.min(T,B),z),S<P*.9&&W<=Wt+.05?A="stream":S<P*1.2&&(A="bank")),{height:Math.max(.08,W),zone:A,distToStream:S}}function q2(t){const e=new mi;e.name="TerrainSystemGroup";const n=p0,i=p0,r=Xf,s=Ua,o=r*.5,a=s*.5,l=B2,c=H2,h=.18,d=new Float32Array((n+1)*(i+1)),f=new Array((n+1)*(i+1));for(let $=0;$<=i;$++){const Z=-a+$/i*s;for(let te=0;te<=n;te++){const de=-o+te/n*r,pe=Y2(de,Z);d[$*(n+1)+te]=pe.height,f[$*(n+1)+te]=pe.zone}}function p($,Z){const te=Math.min(Math.max(($+o)/r,0),1),de=Math.min(Math.max((Z+a)/s,0),1),pe=te*n,xe=de*i,N=Math.min(Math.floor(pe),n-1),ce=Math.min(Math.floor(xe),i-1),F=pe-N,L=xe-ce,ee=ce*(n+1),ge=(ce+1)*(n+1),we=d[ee+N],Ve=d[ee+(N+1)],it=d[ge+N],Be=d[ge+(N+1)];return F<=L?we+(it-we)*L+(Be-it)*F:we+(Ve-we)*F+(Be-Ve)*L}function v($,Z){const de=p($-.05,Z),pe=p($+.05,Z),xe=p($,Z-.05),N=p($,Z+.05);return new O(de-pe,2*.05,xe-N).normalize()}function x($,Z){const te=v($,Z);return 1-Math.min(1,Math.max(0,te.y))}function m($,Z){const te=Math.abs($)<=o-.25&&Math.abs(Z)<=a-.25,de=p($,Z),pe=v($,Z),xe=1-Math.max(0,pe.y),N=gi(Z),ce=Math.abs($-N),F=Gs(Z);let L="bank";return te?Z<-3.5&&de>2?L="mountain":$>=-7.6&&$<=-.4&&Z>=-3.5&&Z<=.85&&de>=1.25&&xe<.18?L="plateau":$<=.6&&Z>=.8&&Z<=2.3&&xe>.28?L="cliff":Z>=.8&&ce<F*.88&&de<=Wt+.05?L="stream":$>1.2&&(L="bank"):L="out_of_bounds",{height:de,normal:pe,slope:xe,zone:L,inBounds:te,distToStream:ce}}function u($,Z){if(Z<.8)return!1;const te=gi(Z),de=Math.abs($-te),pe=Gs(Z),xe=p($,Z);return de<pe*.9||xe<=Wt+.03&&Z>=.85}function g($,Z){return m($,Z).zone==="plateau"}const _=[],y=[],R=[],w=[],T=new I,A=(n+1)*(i+1),M={spring:new Float32Array(A*3),summer:new Float32Array(A*3),autumn:new Float32Array(A*3),winter:new Float32Array(A*3)},S=["spring","summer","autumn","winter"];function P($,Z,te,de,pe,xe){const N=Cs[pe],ce=1-Math.max(0,de.y),F=gi(te),L=Math.abs($-F),ee=Gs(te),ge=Bn($*.55,te*.55)*.5+.5;if(xe.copy(N.ground).lerp(N.grassTint,ge*.55),$>=-7.6&&$<=-.4&&te>=-3.5&&te<=.85&&ce<.2&&xe.lerp(N.grassTint,.4),te>=.75&&L<ee*1.35){const we=Bn($*2,te*2)*.5+.5,Ve=We.terrain.sand.clone().lerp(We.water.bedGravel,we),it=di(ee*1.35,ee*.7,L);xe.lerp(Ve,it*.9)}if(ce>.26){const we=Bn($*1.1,te*1.1)*.5+.5,Ve=We.terrain.rock.clone().lerp(We.terrain.rockDark,we);ce>.42&&Z>.45&&pe!=="winter"&&Ve.lerp(We.terrain.moss,.38),xe.lerp(Ve,di(.26,.58,ce))}if(te<-3.6&&Z>2.2){const we=di(2.2,3.4,Z);xe.lerp(We.terrain.rock,we*.65),pe==="winter"&&de.y>.6&&xe.lerp(We.terrain.snow,di(2,3.2,Z)*.85)}pe==="winter"&&de.y>.75&&Z>.3&&!(te>=.8&&L<ee*.75)&&xe.lerp(We.terrain.snow,.45)}for(let $=0;$<=i;$++){const Z=-a+$/i*s;for(let te=0;te<=n;te++){const de=-o+te/n*r,pe=d[$*(n+1)+te],xe=v(de,Z);_.push(de,pe,Z),y.push(xe.x,xe.y,xe.z);const N=$*(n+1)+te;for(const ce of S)P(de,pe,Z,xe,ce,T),M[ce][N*3]=T.r,M[ce][N*3+1]=T.g,M[ce][N*3+2]=T.b;R.push(M.spring[N*3],M.spring[N*3+1],M.spring[N*3+2])}}for(let $=0;$<i;$++)for(let Z=0;Z<n;Z++){const te=$*(n+1)+Z,de=$*(n+1)+(Z+1),pe=($+1)*(n+1)+Z,xe=($+1)*(n+1)+(Z+1);w.push(te,pe,xe),w.push(te,xe,de)}const z=12,B=We.terrain.strataSoil,W=new I(7231035),ne=We.terrain.strataRock1,Y=We.base;function Q($,Z,te){const de=_.length/3;for(let pe=0;pe<=z;pe++){const xe=pe/z;for(let N=0;N<=te;N++){const ce=N/te,F=$(ce),L=F.yTop*(1-xe)+c*xe;_.push(F.x,L,F.z),y.push(Z.x,Z.y,Z.z);const ee=F.yTop-.16-Bn(F.u*.18,5)*.04,ge=(F.yTop+c)*.5+Bn(F.u*.15,15)*.06;L>ee?T.copy(B):L>ge?T.copy(W):T.copy(ne),R.push(T.r,T.g,T.b)}}for(let pe=0;pe<z;pe++)for(let xe=0;xe<te;xe++){const N=de+pe*(te+1)+xe,ce=N+1,F=de+(pe+1)*(te+1)+xe,L=F+1;w.push(N,F,ce),w.push(ce,F,L)}}Q($=>{const Z=-o+$*r,te=a,de=Math.min(Math.round($*n),n),pe=d[i*(n+1)+de];return{x:Z,z:te,yTop:pe,u:Z}},new O(0,0,1),n),Q($=>{const Z=a-$*s,te=o,de=Math.min(Math.round((1-$)*i),i),pe=d[de*(n+1)+n];return{x:te,z:Z,yTop:pe,u:Z}},new O(1,0,0),i),Q($=>{const Z=o-$*r,te=-a,de=Math.min(Math.round((1-$)*n),n),pe=d[0*(n+1)+de];return{x:Z,z:te,yTop:pe,u:Z}},new O(0,0,-1),n),Q($=>{const Z=-a+$*s,te=-o,de=Math.min(Math.round($*i),i),pe=d[de*(n+1)+0];return{x:te,z:Z,yTop:pe,u:Z}},new O(-1,0,0),i);const D=o-h,q=a-h,J=3;function se($,Z,te,de){const pe=_.length/3;for(let xe=0;xe<=J;xe++){const N=xe/J*(Math.PI*.5),ce=c-Math.sin(N)*(c-l),F=h*Math.cos(N),L=-Math.sin(N),ee=Math.cos(N);for(let ge=0;ge<=de;ge++){const we=ge/de,Ve=$.x*(1-we)+Z.x*we+te.x*F,it=$.y*(1-we)+Z.y*we+te.y*F;_.push(Ve,ce,it),y.push(te.x*ee,L,te.y*ee),R.push(Y.r,Y.g,Y.b)}}for(let xe=0;xe<J;xe++)for(let N=0;N<de;N++){const ce=pe+xe*(de+1)+N,F=ce+1,L=pe+(xe+1)*(de+1)+N,ee=L+1;w.push(ce,L,F),w.push(F,L,ee)}}se(new Pe(-D,q),new Pe(D,q),new Pe(0,1),24),se(new Pe(D,q),new Pe(D,-q),new Pe(1,0),20),se(new Pe(D,-q),new Pe(-D,-q),new Pe(0,-1),24),se(new Pe(-D,-q),new Pe(-D,q),new Pe(-1,0),20);const ve=_.length/3,Ee=4;for(let $=0;$<=Ee;$++){const Z=$/Ee,te=-q+Z*(2*q);for(let de=0;de<=Ee;de++){const pe=de/Ee,xe=-D+pe*(2*D);_.push(xe,l,te),y.push(0,-1,0),R.push(Y.r,Y.g,Y.b)}}for(let $=0;$<Ee;$++)for(let Z=0;Z<Ee;Z++){const te=ve+$*(Ee+1)+Z,de=ve+$*(Ee+1)+(Z+1),pe=ve+($+1)*(Ee+1)+Z,xe=ve+($+1)*(Ee+1)+(Z+1);w.push(te,xe,de),w.push(te,pe,xe)}const G=new It;G.setAttribute("position",new et(_,3)),G.setAttribute("normal",new et(y,3)),G.setAttribute("color",new et(R,3)),G.setIndex(w),G.computeVertexNormals(),G.computeBoundingBox(),G.computeBoundingSphere();const re=new Pt({vertexColors:!0,roughness:.88,metalness:.04,flatShading:!1,side:xi}),he=new Tc({color:9211020,side:xi,wireframe:!1}),fe=new Et(G,re);fe.name="DioramaTerrainMesh",fe.receiveShadow=!0,fe.castShadow=!0,e.add(fe);const Te=document.createElement("canvas");Te.width=128,Te.height=128;const ke=Te.getContext("2d"),Xe=ke.createRadialGradient(64,64,25,64,64,62);Xe.addColorStop(0,"rgba(42, 34, 24, 0.40)"),Xe.addColorStop(.55,"rgba(55, 46, 36, 0.18)"),Xe.addColorStop(1,"rgba(0, 0, 0, 0.0)"),ke.fillStyle=Xe,ke.fillRect(0,0,128,128);const Qe=new d2(Te),U=new ns(r*1.18,s*1.22);U.rotateX(-Math.PI/2);const nt=new Tc({map:Qe,transparent:!0,opacity:.7,depthWrite:!1}),je=new Et(U,nt);je.position.set(0,l-.02,0),e.add(je);const ze=new ba(1,2),De=ze.attributes.position,Ke=new O;for(let $=0;$<De.count;$++){Ke.fromBufferAttribute(De,$);const Z=Bn(Ke.x*1.5,Ke.z*1.5)*.12;Ke.multiplyScalar(1+Z),Ke.y*=.68,De.setXYZ($,Ke.x,Ke.y,Ke.z)}ze.computeVertexNormals();const Ue=new Pt({color:10261898,roughness:.82,metalness:.02,flatShading:!1}),be=[{x:-1.3,z:3.2,scale:.42,col:new I(10393227)},{x:4.6,z:3.6,scale:.38,col:new I(11247762)},{x:-2.3,z:2.5,scale:.35,col:new I(9340796)},{x:2.8,z:-2.6,scale:.4,col:new I(11576982)},{x:5.2,z:5.8,scale:.34,col:new I(11050638)}],b=new Cn(ze,Ue,be.length);b.castShadow=!0,b.receiveShadow=!0;const E=new Dt;for(let $=0;$<be.length;$++){const Z=be[$],te=p(Z.x,Z.z);E.position.set(Z.x,te+Z.scale*.22,Z.z),E.rotation.set(.1,$*1.7%(Math.PI*2),.1),E.scale.set(Z.scale,Z.scale,Z.scale),E.updateMatrix(),b.setMatrixAt($,E.matrix),b.setColorAt($,Z.col)}b.instanceMatrix.needsUpdate=!0,b.instanceColor&&(b.instanceColor.needsUpdate=!0),e.add(b);const j=220,le=new ba(.16,1);le.scale(1,.52,1),le.computeVertexNormals();const oe=new Pt({roughness:.7,metalness:.04,flatShading:!0}),ae=new Cn(le,oe,j);ae.receiveShadow=!0;const Oe=[new I(14077112),new I(11050638),new I(12496790),new I(9081484),new I(13154976),new I(10392194),new I(11707016)],Me=new Kc(2026);let Ae=0,Ge=0;for(;Ae<j&&Ge<1500;){Ge++;const $=Me.range(1,a-.4),Z=gi($),te=Gs($),de=Z+Me.range(-te*.82,te*.82),pe=p(de,$);if(pe>Wt+.03)continue;const xe=Me.range(.4,1.1);E.position.set(de,pe+.02*xe,$),E.rotation.set(Me.range(0,Math.PI),Me.range(0,Math.PI*2),Me.range(0,Math.PI)),E.scale.set(xe,xe,xe),E.updateMatrix(),ae.setMatrixAt(Ae,E.matrix),ae.setColorAt(Ae,Oe[Math.floor(Me.next()*Oe.length)]),Ae++}ae.instanceMatrix.needsUpdate=!0,ae.instanceColor&&(ae.instanceColor.needsUpdate=!0),e.add(ae),t.add(e);function me($,Z){const te=G.attributes.color,de=M[$],pe=te.array;for(let xe=0;xe<A*3;xe++)pe[xe]=bt.lerp(pe[xe],de[xe],Z);te.needsUpdate=!0}function Ce($){fe.material=$?he:re,je.visible=!$,b.visible=!$,ae.visible=!$}return{group:e,sampleTerrain:m,getHeightAt:p,getNormalAt:v,getSlopeAt:x,isInStream:u,isOnPlateau:g,updateSeason:me,setDebug:Ce,dispose(){G.dispose(),re.dispose(),he.dispose(),U.dispose(),nt.dispose(),Qe.dispose(),ze.dispose(),Ue.dispose(),le.dispose(),oe.dispose(),e.removeFromParent()}}}const Lr=new mt(-3.5,.7,7.5,8.2),Vo=20,g0=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,Z2=`
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uTexelSize;
  uniform float uWaveSpeedSq;
  uniform float uDamping;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    float current = info.r;
    float previous = info.g;

    float left   = texture2D(uTexture, vUv - vec2(uTexelSize.x, 0.0)).r;
    float right  = texture2D(uTexture, vUv + vec2(uTexelSize.x, 0.0)).r;
    float bottom = texture2D(uTexture, vUv - vec2(0.0, uTexelSize.y)).r;
    float top    = texture2D(uTexture, vUv + vec2(0.0, uTexelSize.y)).r;

    float next = (2.0 * current - previous) + uWaveSpeedSq * (left + right + bottom + top - 4.0 * current);
    next *= uDamping;
    next = clamp(next, -0.6, 0.6);

    gl_FragColor = vec4(next, current, 0.0, 1.0);
  }
`,$2=`
  precision highp float;
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, uCenter);
    float drop = max(0.0, 1.0 - dist / uRadius);
    drop = 0.5 - 0.5 * cos(drop * 3.14159265);
    gl_FragColor = vec4(drop * uStrength, 0.0, 0.0, 1.0);
  }
`,K2=`
  attribute float aTerrainHeight;
  attribute float aIsFrontCut;

  uniform float uTime;
  uniform float uWaterLevel;
  uniform sampler2D uRippleMap;
  uniform float uUseGpuRipples;
  uniform vec4 uRippleBounds;
  uniform float uFlowSpeed;
  uniform float uWindStrength;
  uniform vec4 uAnalyticalRipples[20];
  uniform int uAnalyticalRippleCount;

  varying vec3 vWorldPosition;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec2 vRippleUv;
  varying float vDepth;
  varying vec3 vNormal;
  varying float vIsFrontCut;

  float computeAnalyticalRipples(vec2 worldXZ, float time) {
    float total = 0.0;
    for (int i = 0; i < 20; i++) {
      if (i >= uAnalyticalRippleCount) break;
      vec4 rip = uAnalyticalRipples[i];
      float age = time - rip.z;
      if (age > 0.0 && age < 3.2) {
        float dist = distance(worldXZ, rip.xy);
        float waveDist = age * 2.0;
        float diff = dist - waveDist;
        float env = exp(-diff * diff * 12.0) * exp(-age * 1.4) * rip.w;
        total += sin(diff * 14.0) * env * 0.03;
      }
    }
    return total;
  }

  void main() {
    vUv = uv;
    vIsFrontCut = aIsFrontCut;

    vec3 pos = position;
    vec4 initialWorld = modelMatrix * vec4(pos, 1.0);

    vec2 ripUv = (initialWorld.xz - uRippleBounds.xy) / (uRippleBounds.zw - uRippleBounds.xy);
    vRippleUv = ripUv;

    float depth = max(0.0, uWaterLevel - aTerrainHeight);
    vDepth = depth;
    float shoreDamping = clamp(depth * 8.0, 0.0, 1.0);

    // Only apply surface waves if not on the vertical front cut skirt
    if (aIsFrontCut < 0.5) {
      float ripDisp = 0.0;
      if (uUseGpuRipples > 0.5) {
        if (ripUv.x >= 0.0 && ripUv.x <= 1.0 && ripUv.y >= 0.0 && ripUv.y <= 1.0) {
          ripDisp = texture2D(uRippleMap, ripUv).r * 0.07;
        }
      } else {
        ripDisp = computeAnalyticalRipples(initialWorld.xz, uTime);
      }

      float flowTime = uTime * (0.8 + uFlowSpeed * 0.6);
      float w1 = sin(initialWorld.x * 2.8 + initialWorld.z * 1.6 + flowTime) * 0.010;
      float w2 = cos(initialWorld.x * 4.4 - initialWorld.z * 2.2 + flowTime * 1.2) * 0.007;
      float gentleWaves = (w1 + w2) * (0.5 + uWindStrength * 0.6);

      pos.y += (ripDisp + gentleWaves) * shoreDamping;
    }

    vec4 finalWorld = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = finalWorld.xyz;
    vViewDir = normalize(cameraPosition - finalWorld.xyz);
    vNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * finalWorld;
  }
`,Q2=`
  precision highp float;

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform float uSunIntensity;
  uniform float uWaterLevel;
  uniform sampler2D uRippleMap;
  uniform float uUseGpuRipples;
  uniform vec4 uRippleBounds;
  uniform float uFlowSpeed;
  uniform vec3 uWaterColor;
  uniform vec3 uDeepColor;
  uniform vec3 uFoamColor;
  uniform vec3 uSkyHorizonColor;
  uniform vec3 uSkyZenithColor;
  uniform float uWindStrength;
  uniform vec4 uAnalyticalRipples[20];
  uniform int uAnalyticalRippleCount;

  varying vec3 vWorldPosition;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying vec2 vRippleUv;
  varying float vDepth;
  varying vec3 vNormal;
  varying float vIsFrontCut;

  float computeAnalyticalRipples(vec2 worldXZ, float time) {
    float total = 0.0;
    for (int i = 0; i < 20; i++) {
      if (i >= uAnalyticalRippleCount) break;
      vec4 rip = uAnalyticalRipples[i];
      float age = time - rip.z;
      if (age > 0.0 && age < 3.2) {
        float dist = distance(worldXZ, rip.xy);
        float waveDist = age * 2.0;
        float diff = dist - waveDist;
        float env = exp(-diff * diff * 12.0) * exp(-age * 1.4) * rip.w;
        total += sin(diff * 14.0) * env * 0.03;
      }
    }
    return total;
  }

  vec3 getWaterNormal() {
    if (vIsFrontCut > 0.5) {
      return vec3(0.0, 0.0, 1.0); // Clean flat vertical front cut normal
    }

    vec3 norm = vec3(0.0, 1.0, 0.0);

    if (uUseGpuRipples > 0.5) {
      vec2 texel = vec2(1.0 / 256.0);
      vec2 uvClamped = clamp(vRippleUv, texel, vec2(1.0) - texel);
      float hL = texture2D(uRippleMap, uvClamped - vec2(texel.x, 0.0)).r;
      float hR = texture2D(uRippleMap, uvClamped + vec2(texel.x, 0.0)).r;
      float hD = texture2D(uRippleMap, uvClamped - vec2(0.0, texel.y)).r;
      float hU = texture2D(uRippleMap, uvClamped + vec2(0.0, texel.y)).r;
      norm += vec3((hL - hR) * 1.5, 0.0, (hD - hU) * 1.5);
    } else {
      float eps = 0.06;
      float hX1 = computeAnalyticalRipples(vWorldPosition.xz + vec2(eps, 0.0), uTime);
      float hX0 = computeAnalyticalRipples(vWorldPosition.xz - vec2(eps, 0.0), uTime);
      float hZ1 = computeAnalyticalRipples(vWorldPosition.xz + vec2(0.0, eps), uTime);
      float hZ0 = computeAnalyticalRipples(vWorldPosition.xz - vec2(0.0, eps), uTime);
      norm += vec3((hX0 - hX1) / (2.0 * eps), 0.0, (hZ0 - hZ1) / (2.0 * eps)) * 1.0;
    }

    // Gentle downstream stream ripples
    float flowZ = uTime * uFlowSpeed * 1.4;
    float f1 = sin(vWorldPosition.x * 3.5 + vWorldPosition.z * 1.8 + flowZ) * 0.035;
    float f2 = cos(vWorldPosition.x * 5.2 - vWorldPosition.z * 2.4 + flowZ * 1.2) * 0.025;
    norm.x += (f1 - f2) * (0.5 + uWindStrength * 0.5);
    norm.z += (f1 + f2) * (0.5 + uWindStrength * 0.5);

    return normalize(norm);
  }

  void main() {
    float depth = vDepth;
    if (depth < 0.001) discard;

    vec3 N = getWaterNormal();
    vec3 V = normalize(vViewDir);

    // 1. Crystal mountain water: shallow is luminous turquoise, deepens into teal
    float depthFactor = clamp(depth / 0.28, 0.0, 1.0);
    vec3 waterColor = mix(uWaterColor, uDeepColor, smoothstep(0.10, 0.85, depthFactor));

    // 2. Schlick Fresnel reflection
    float F0 = 0.025;
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 4.5);

    vec3 R = reflect(-V, N);
    vec3 skyColor = mix(uSkyHorizonColor, uSkyZenithColor, clamp(R.y * 0.65 + 0.35, 0.0, 1.0));
    vec3 surfaceColor = mix(waterColor, skyColor, fresnel * 0.40);

    // 3. Sun specular sparkles
    vec3 L = normalize(uSunDirection);
    vec3 H = normalize(L + V);
    float NdotH = max(dot(N, H), 0.0);
    float specular = pow(NdotH, 48.0);
    vec3 spec = uSunColor * specular * uSunIntensity * 0.55;
    surfaceColor += spec;

    // 4. Subtle, delicate foam: ONLY at the upstream rocky cascade (z < 1.8)
    float foam = 0.0;
    if (vWorldPosition.z < 1.8 && vIsFrontCut < 0.5) {
      float upstreamFactor = smoothstep(1.8, 0.9, vWorldPosition.z);
      float rapidNoise = sin(vWorldPosition.x * 14.0 + uTime * 4.5) * cos(vWorldPosition.z * 16.0 - uTime * 5.5);
      foam = upstreamFactor * smoothstep(0.45, 0.95, rapidNoise) * 0.28;
    }
    surfaceColor = mix(surfaceColor, uFoamColor, foam);

    // 5. Alpha transparency:
    // Shallow water is clear (alpha ~0.38) revealing bed pebbles & fish.
    // Deep pools fade to ~0.72.
    float alpha = mix(0.38, 0.72, smoothstep(0.01, 0.24, depth));
    alpha = mix(alpha, 0.88, foam);
    alpha *= smoothstep(0.0, 0.02, depth);

    gl_FragColor = vec4(surfaceColor, alpha);
  }
`;function J2(t){const o=new Float32Array(20295),a=new Float32Array(6765*2),l=new Float32Array(6765),c=new Float32Array(6765),h=[],d=.5,f=Ua*.5;for(let m=0;m<=120;m++){const u=m/120,g=d+u*(f-d),_=gi(g),y=Gs(g)*1.2;for(let R=0;R<=54;R++){const w=R/54,T=_-y+w*(y*2),A=0,M=m*55+R;o[M*3+0]=T,o[M*3+1]=A,o[M*3+2]=g,a[M*2+0]=w,a[M*2+1]=u,l[M]=t(T,g),c[M]=0}}for(let m=0;m<120;m++)for(let u=0;u<54;u++){const g=m*55+u,_=m*55+(u+1),y=(m+1)*55+u,R=(m+1)*55+(u+1),w=l[g],T=l[_],A=l[y],M=l[R];Math.min(w,T,A,M)<=dv+.08&&(h.push(g,y,_),h.push(_,y,R))}const p=6655,v=120*55;for(let m=0;m<=54;m++){const u=v+m,g=o[u*3+0],_=f,y=l[u],R=Math.max(0,Wt-y),w=p+m*2+0;o[w*3+0]=g,o[w*3+1]=0,o[w*3+2]=_,a[w*2+0]=m/54,a[w*2+1]=1,l[w]=y,c[w]=1;const T=p+m*2+1;o[T*3+0]=g,o[T*3+1]=-R,o[T*3+2]=_,a[T*2+0]=m/54,a[T*2+1]=0,l[T]=y,c[T]=1}for(let m=0;m<54;m++){const u=p+m*2+0,g=p+m*2+1,_=p+(m+1)*2+0,y=p+(m+1)*2+1;(l[u]<Wt||l[_]<Wt)&&(h.push(u,g,_),h.push(_,g,y))}const x=new It;return x.setAttribute("position",new Kt(o,3)),x.setAttribute("uv",new Kt(a,2)),x.setAttribute("aTerrainHeight",new Kt(l,1)),x.setAttribute("aIsFrontCut",new Kt(c,1)),x.setIndex(h),x.computeVertexNormals(),x}function eA(t,e,n){const i=new mi;i.name="WaterSystem";let r=Wt,s=Wt,o=1,a=Wt;const l=1.8,c=[],h=[];for(let J=0;J<Vo;J++)h.push({x:0,z:0,startTime:-100,strength:0});let d=0;const f=new Float32Array(Vo*4),p=J2(n),v=!!t.capabilities.isWebGL2;let x=!0;const u={minFilter:bn,magFilter:bn,format:Vn,type:v?_o:yi,depthBuffer:!1,stencilBuffer:!1,wrapS:Di,wrapT:Di};let g=new zi(Ts,Ts,u),_=new zi(Ts,Ts,u);const y=new Yc(-1,1,1,-1,0,1),R=new ns(2,2),w=new si({vertexShader:g0,fragmentShader:Z2,uniforms:{uTexture:{value:null},uTexelSize:{value:new Pe(1/Ts,1/Ts)},uWaveSpeedSq:{value:.22},uDamping:{value:.992}},depthTest:!1,depthWrite:!1}),T=new Pd,A=new Et(R,w);T.add(A);const M=new si({vertexShader:g0,fragmentShader:$2,uniforms:{uCenter:{value:new Pe(.5,.5)},uRadius:{value:.035},uStrength:{value:.45}},blending:$h,transparent:!0,depthTest:!1,depthWrite:!1}),S=new Pd,P=new Et(R,M);S.add(P);try{const J=t.getRenderTarget();t.setRenderTarget(g),t.clearColor(),t.setRenderTarget(_),t.clearColor(),t.setRenderTarget(J)}catch(J){console.warn("Analytical ripple fallback",J),x=!1}const z={uTime:{value:0},uSunDirection:{value:new O(.5,.8,.3).normalize()},uSunColor:{value:new I(1,.96,.9)},uSunIntensity:{value:1},uWaterLevel:{value:r},uRippleMap:{value:g.texture},uUseGpuRipples:{value:x?1:0},uRippleBounds:{value:Lr.clone()},uFlowSpeed:{value:.5},uWaterColor:{value:We.water.shallow.clone()},uDeepColor:{value:We.water.deep.clone()},uFoamColor:{value:We.water.foam.clone()},uSkyHorizonColor:{value:new I(16183524)},uSkyZenithColor:{value:new I(8567508)},uWindStrength:{value:.3},uAnalyticalRipples:{value:f},uAnalyticalRippleCount:{value:Vo}},B=new si({vertexShader:K2,fragmentShader:Q2,uniforms:z,transparent:!0,depthWrite:!1,depthTest:!0}),W=new Et(p,B);W.name="WaterSurfaceMesh",W.position.y=r,i.add(W),e.add(i);let ne=0;function Y(J,se,ve){const Ee=(J-Lr.x)/(Lr.z-Lr.x),G=(se-Lr.y)/(Lr.w-Lr.y);if(Ee>=0&&Ee<=1&&G>=0&&G<=1)if(x)c.push({uv:new Pe(Ee,G),radius:.038,strength:Math.min(.65,ve)});else{const re=d%Vo;h[re]={x:J,z:se,startTime:ne,strength:Math.min(.6,ve)},d++}}function Q(J,se=!0){const ve=J==="high"?dv:z2;se?(a=r,s=ve,o=0):(r=ve,s=ve,o=1,W.position.y=ve,z.uWaterLevel.value=ve)}function D(){return r}function q(J,se,ve){if(ne=se,o<1){o=Math.min(1,o+J/l);const Ee=o*o*(3-2*o);r=bt.lerp(a,s,Ee),W.position.y=r,z.uWaterLevel.value=r}if(z.uTime.value=se,z.uFlowSpeed.value=ve.flowSpeed,z.uWindStrength.value=ve.windStrength,x){const Ee=t.getRenderTarget(),G=t.autoClear;for(t.autoClear=!1;c.length>0;){const he=c.pop();M.uniforms.uCenter.value.copy(he.uv),M.uniforms.uRadius.value=he.radius,M.uniforms.uStrength.value=he.strength,t.setRenderTarget(g),t.render(S,y)}w.uniforms.uTexture.value=g.texture,t.setRenderTarget(_),t.render(T,y);const re=g;g=_,_=re,z.uRippleMap.value=g.texture,t.setRenderTarget(Ee),t.autoClear=G}else for(let Ee=0;Ee<Vo;Ee++){const G=h[Ee];f[Ee*4+0]=G.x,f[Ee*4+1]=G.z,f[Ee*4+2]=G.startTime,f[Ee*4+3]=G.strength}}return{group:i,mesh:W,update:q,addRipple:Y,setTide:Q,getWaterLevel:D,dispose(){p.dispose(),B.dispose(),R.dispose(),w.dispose(),M.dispose(),g.dispose(),_.dispose(),i.removeFromParent()}}}function Wo(t,e=!1){const n=t[0].index!==null,i=new Set(Object.keys(t[0].attributes)),r=new Set(Object.keys(t[0].morphAttributes)),s={},o={},a=t[0].morphTargetsRelative,l=new It;let c=0;for(let h=0;h<t.length;++h){const d=t[h];let f=0;if(n!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in d.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;s[p]===void 0&&(s[p]=[]),s[p].push(d.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in d.morphAttributes){if(!r.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(d.morphAttributes[p])}if(e){let p;if(n)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,p,h),c+=p}}if(n){let h=0;const d=[];for(let f=0;f<t.length;++f){const p=t[f].index;for(let v=0;v<p.count;++v)d.push(p.getX(v)+h);h+=t[f].attributes.position.count}l.setIndex(d)}for(const h in s){const d=_0(s[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,d)}for(const h in o){const d=o[h][0].length;if(d===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<d;++f){const p=[];for(let x=0;x<o[h].length;++x)p.push(o[h][x][f]);const v=_0(p);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(v)}}return l}function _0(t){let e,n,i,r=-1,s=0;for(let c=0;c<t.length;++c){const h=t[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(n===void 0&&(n=h.itemSize),n!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*n}const o=new e(s),a=new Kt(o,n,i);let l=0;for(let c=0;c<t.length;++c){const h=t[c];if(h.isInterleavedBufferAttribute){const d=l/n;for(let f=0,p=h.count;f<p;f++)for(let v=0;v<n;v++){const x=h.getComponent(f,v);a.setComponent(f+d,v,x)}}else o.set(h.array,l);l+=h.count*n}return r!==void 0&&(a.gpuType=r),a}function qe(t,e){const n=t.index?t.toNonIndexed():t.clone();delete n.attributes.uv,n.attributes.normal||n.computeVertexNormals();const i=n.attributes.position.count,r=new Float32Array(i*3),s=n.attributes.position,o=n.attributes.normal,a=new O,l=new O;if(typeof e=="function")for(let c=0;c<i;c++){a.set(s.getX(c),s.getY(c),s.getZ(c)),o&&l.set(o.getX(c),o.getY(c),o.getZ(c));const h=e(a,l,c);r[c*3]=h.r,r[c*3+1]=h.g,r[c*3+2]=h.b}else{const c=e instanceof I?e:new I(e);for(let h=0;h<i;h++)r[h*3]=c.r,r[h*3+1]=c.g,r[h*3+2]=c.b}return n.setAttribute("color",new Kt(r,3)),n}function tA(){const e=new fo(1,2).attributes.position,n=[],i=[],r=We.architecture.tent,s=new I(15656406),o=new I(3483678),a=.72,l=.62;for(let d=0;d<e.count;d+=3){const f=e.getY(d),p=e.getY(d+1),v=e.getY(d+2),x=(f+p+v)/3;if(x>=-.05){const m=(e.getX(d)+e.getX(d+1)+e.getX(d+2))/3,_=(e.getZ(d)+e.getZ(d+1)+e.getZ(d+2))/3>.45&&Math.abs(m)<.28&&x<.4?o:d/3%2===0?r:s;for(let y=0;y<3;y++){const R=e.getX(d+y)*a,w=Math.max(0,e.getY(d+y))*l,T=e.getZ(d+y)*a;n.push(R,w,T),i.push(_.r,_.g,_.b)}}}const c=new It;c.setAttribute("position",new et(n,3)),c.setAttribute("color",new et(i,3)),c.computeVertexNormals();const h=new f2(c,1);return{domeGeo:c,edgesGeo:h}}function nA(t,e){const n=new mi;n.name="architecture";const i=[];let r=null;const s=[],o=[],a=[],l=[],c=new Pt({vertexColors:!0,roughness:.82,metalness:.05,flatShading:!0}),h=new Pt({vertexColors:!0,roughness:.92,metalness:.05,flatShading:!0}),d=new Pt({vertexColors:!0,roughness:.62,metalness:.05,flatShading:!0}),f=new cv({color:11706246,transparent:!0,opacity:.55});[{x:-5,z:-2,rotY:.15},{x:-2.2,z:-1.2,rotY:-.2},{x:-4.2,z:0,rotY:.05}].forEach((V,ue)=>{const ye=e(V.x,V.z),Se=2,Ne=2,He=.1,Le=ye+He,Ye=10,ht=(Se-.04)/Ye;for(let st=0;st<Ye;st++){const en=new ot(ht-.015,He,Ne).toNonIndexed(),wr=-Se/2+.02+(st+.5)*ht;en.translate(V.x+wr,ye+He/2,V.z);const qt=st%2===0?We.wood.plank.clone():We.wood.light.clone();s.push(qe(en,(Er,Jc)=>Math.abs(Jc.x)>.8?We.wood.dark:qt))}const ct=new ot(.85,.05,.3).toNonIndexed();ct.translate(V.x,ye+.025,V.z+Ne/2+.15),s.push(qe(ct,We.wood.light)),[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]].forEach(([st,en])=>{const wr=e(V.x+st,V.z+en),qt=Math.max(.12,Le-wr+.12),Er=new ot(.11,qt,.11).toNonIndexed();Er.translate(V.x+st,Le-qt/2,V.z+en),s.push(qe(Er,We.wood.dark))});const rt=new ot(Se-.08,.2,Ne-.08).toNonIndexed();rt.translate(V.x,ye,V.z),s.push(qe(rt,We.wood.dark));const{domeGeo:Fe,edgesGeo:Ct}=tA(),lt=new Pt({vertexColors:!0,roughness:.9,metalness:0,emissive:new I(16751150),emissiveIntensity:0,flatShading:!0,side:Hn}),Yt=new Et(Fe,lt);Yt.name=`domeTent_${ue}`,Yt.position.set(V.x,Le,V.z),Yt.rotation.y=V.rotY,n.add(Yt),i.push(Yt);const Yn=new h2(Ct,f);Yn.position.set(V.x,Le,V.z),Yn.rotation.y=V.rotY,Yn.scale.set(1.001,1.001,1.001),n.add(Yn);const Ht=new fo(.48,1).toNonIndexed(),Mr=Ht.attributes.position;for(let st=0;st<Mr.count;st++){const en=Math.max(0,Mr.getY(st))*.16;Mr.setY(st,en)}Ht.computeVertexNormals(),Ht.translate(V.x,Le+.6,V.z),l.push(qe(Ht,We.terrain.snow))});const v=-1,x=-2.5,m=e(v,x),u=.1,g=m+u,_=1.6,y=2,R=1.35,w=.7,T=y+w,A=new ot(_+.25,u,T).toNonIndexed();A.translate(v,m+u/2,x+w/2),s.push(qe(A,(V,ue)=>Math.abs(ue.y)>.8?We.wood.plank:We.wood.dark)),[[-1.7000000000000002/2,-y/2],[(_+.1)/2,-y/2],[-1.7000000000000002/2,y/2+w],[(_+.1)/2,y/2+w]].forEach(([V,ue])=>{const ye=e(v+V,x+ue),Se=Math.max(.12,g-ye+.12),Ne=new ot(.12,Se,.12).toNonIndexed();Ne.translate(v+V,g-Se/2,x+ue),s.push(qe(Ne,We.wood.dark))});const S=new ot(.9,.05,.28).toNonIndexed();S.translate(v,m+.025,x+y/2+w+.14),s.push(qe(S,We.wood.light));const P=new ot(_+.16,.22,T-.08).toNonIndexed();P.translate(v,m,x+w/2),s.push(qe(P,We.wood.dark));const z=new $t(.04,.04,.8,6).toNonIndexed();z.translate(v-_/2+.06,g+.4,x+y/2+w-.06),s.push(qe(z,We.wood.dark));const B=new $t(.04,.04,.8,6).toNonIndexed();B.translate(v+_/2-.06,g+.4,x+y/2+w-.06),s.push(qe(B,We.wood.dark));const W=[],ne=[],Y=new I(7885615);function Q(V,ue){const ye=_/2,Se=new O(v-ye,g,x+V),Ne=new O(v+ye,g,x+V),He=new O(v,g+R,x+V);(ue>0?[Se,Ne,He]:[Se,He,Ne]).forEach(Ye=>{W.push(Ye.x,Ye.y,Ye.z),ne.push(Y.r,Y.g,Y.b)})}Q(-y/2,-1),Q(y/2,1);const D=new It;D.setAttribute("position",new et(W,3)),D.setAttribute("color",new et(ne,3)),D.computeVertexNormals(),s.push(D);const q=new ot(.48,.78,.04).toNonIndexed();q.translate(v,g+.39,x+y/2+.02),s.push(qe(q,new I(4074526)));const J=new ns(.38,.38).toNonIndexed();J.translate(v,g+.95,x+y/2+.025);const se=new Pt({color:We.architecture.windowGlow,emissive:We.architecture.windowGlow,emissiveIntensity:.15,roughness:.3}),ve=new Et(J,se);n.add(ve),i.push(ve);const Ee=new I(2002044),G=.06,re=Math.hypot(_/2,R)+.22,he=Math.atan2(R,_/2),fe=y+.35,Te=new ot(re,G,fe).toNonIndexed();Te.rotateZ(he),Te.translate(v-_/4,g+R/2,x),a.push(qe(Te,Ee));const ke=new ot(re,G,fe).toNonIndexed();ke.rotateZ(-he),ke.translate(v+_/4,g+R/2,x),a.push(qe(ke,Ee));const Xe=new ot(.08,.08,fe+.06).toNonIndexed();Xe.translate(v,g+R+.04,x),s.push(qe(Xe,We.wood.dark));const Qe=new ot(re-.06,.03,fe-.06).toNonIndexed();Qe.rotateZ(he),Qe.translate(v-_/4,g+R/2+.035,x),l.push(qe(Qe,We.terrain.snow));const U=new ot(re-.06,.03,fe-.06).toNonIndexed();U.rotateZ(-he),U.translate(v+_/4,g+R/2+.035,x),l.push(qe(U,We.terrain.snow));const nt=-3.2,je=-.8,ze=e(nt,je),De=8,Ke=.4;for(let V=0;V<De;V++){const ue=V/De*Math.PI*2,ye=new ba(.09,1).toNonIndexed();ye.scale(1,.65,1),ye.translate(nt+Math.cos(ue)*Ke,ze+.05,je+Math.sin(ue)*Ke),o.push(qe(ye,We.terrain.rockDark))}for(let V=0;V<4;V++){const ue=new $t(.035,.035,.38,6).toNonIndexed();ue.rotateZ(.35),ue.rotateY(V/4*Math.PI*2),ue.translate(nt,ze+.06,je),s.push(qe(ue,new I(2629140)))}const Ue=new Ra(.12,.35,6);Ue.translate(0,.175,0);const be=new Pt({color:16737792,emissive:16729088,emissiveIntensity:1,roughness:.2});r=new Et(Ue,be),r.position.set(nt,ze+.05,je),n.add(r);const b=-6,E=-2.5,le=e(b,E)+.75,oe=[],ae=new $t(.42,.42,.08,20).toNonIndexed();ae.rotateX(Math.PI/2),ae.translate(0,0,-.04),oe.push(qe(ae,new I(12096085))),[{rIn:0,rOut:.08,color:16766287},{rIn:.08,rOut:.16,color:13840175},{rIn:.16,rOut:.24,color:1668818},{rIn:.24,rOut:.32,color:2236962},{rIn:.32,rOut:.4,color:15921906}].forEach(({rIn:V,rOut:ue,color:ye})=>{const Se=V===0?new Hf(ue,20).toNonIndexed():new Gf(V,ue,20).toNonIndexed();Se.translate(0,0,.002),oe.push(qe(Se,ye))});const Me=new $t(.008,.008,.42,6).toNonIndexed();Me.rotateX(Math.PI/2+.08),Me.translate(.04,.03,.18),oe.push(qe(Me,We.wood.light));const Ae=new $t(.025,.025,1.25,6).toNonIndexed();Ae.rotateZ(.24),Ae.translate(-.25,-.22,-.15),oe.push(qe(Ae,We.wood.dark));const Ge=new $t(.025,.025,1.25,6).toNonIndexed();Ge.rotateZ(-.24),Ge.translate(.25,-.22,-.15),oe.push(qe(Ge,We.wood.dark));const me=new $t(.025,.025,1.25,6).toNonIndexed();me.rotateX(-.4),me.translate(0,-.22,-.38),oe.push(qe(me,We.wood.dark));const Ce=Wo(oe,!1);Ce&&(Ce.rotateY(.45),Ce.translate(b,le,E),a.push(Ce));const $=-6.2,Z=-.5,te=e($,Z),de=.62,pe=1.25;for(let V=0;V<3;V++){const ue=-.19999999999999998+V*.2,ye=new ot(pe,.045,.18).toNonIndexed();ye.translate($,te+de,Z+ue),s.push(qe(ye,We.wood.plank))}[-.45,.45].forEach(V=>{const ue=new ot(pe,.045,.22).toNonIndexed();ue.translate($,te+.36,Z+V),s.push(qe(ue,We.wood.plank))});const xe=new ot(.05,.62,.05).toNonIndexed();xe.translate($-.45,te+.31,Z),s.push(qe(xe,We.wood.dark));const N=new ot(.05,.62,.05).toNonIndexed();N.translate($+.45,te+.31,Z),s.push(qe(N,We.wood.dark)),[{startX:-3.5,startZ:.85,endX:-3,endZ:1.55,steps:8,width:.9},{startX:-2.85,startZ:1.7,endX:-2.35,endZ:2.45,steps:8,width:.9},{startX:.3,startZ:.35,endX:.65,endZ:1.75,steps:8,width:.75}].forEach(V=>{for(let ue=0;ue<V.steps;ue++){const ye=ue/Math.max(1,V.steps-1),Se=bt.lerp(V.startX,V.endX,ye),Ne=bt.lerp(V.startZ,V.endZ,ye),He=e(Se,Ne),Le=.12,Ye=.32,ht=He+.05,ct=.22,jt=new ot(V.width,ct,Ye).toNonIndexed();jt.translate(Se,ht-ct/2+Le/2,Ne),o.push(qe(jt,We.terrain.rock)),[-V.width/2-.05,V.width/2+.05].forEach(Fe=>{const Ct=new ot(.12,ct+.1,Ye).toNonIndexed();Ct.translate(Se+Fe,ht-ct/2+Le/2+.05,Ne),o.push(qe(Ct,We.terrain.rockDark))});const rt=new ot(V.width-.04,.02,Ye-.04).toNonIndexed();rt.translate(Se,ht+Le/2+.01,Ne),l.push(qe(rt,We.terrain.snow))}});const F=-2.92,L=1.62,ee=e(F,L),ge=.24,we=new ot(1.15,ge,1.05).toNonIndexed();we.translate(F,ee+.05-ge/2+.06,L),o.push(qe(we,We.terrain.rock)),[{x:F-.58,z:L,w:.12,d:1.05},{x:F,z:L+.53,w:1.15,d:.12}].forEach(V=>{const ue=new ot(V.w,ge+.1,V.d).toNonIndexed();ue.translate(V.x,ee+.05-ge/2+.11,V.z),o.push(qe(ue,We.terrain.rockDark))}),[{x:-3.8,z:.2},{x:-3.7,z:.5},{x:-3.6,z:.7},{x:-2.1,z:2.7},{x:-1.8,z:3.1},{x:-1.4,z:3.6},{x:-1,z:4.1}].forEach(V=>{const ue=e(V.x,V.z),ye=new $t(.24,.28,.06,7).toNonIndexed();ye.translate(V.x,ue+.03,V.z),o.push(qe(ye,We.terrain.rockDark))});const Be=5.1,yt=4.2,En=e(Be,yt),Mo=1.95,ai=.52,Hi=new ot(ai,.07,Mo).toNonIndexed();Hi.rotateY(-.42),Hi.rotateZ(.08),Hi.translate(Be,En+.05,yt),a.push(qe(Hi,new I(16369487)));const Sr=new ot(ai*.72,.01,Mo*.65).toNonIndexed();Sr.rotateY(-.42),Sr.rotateZ(.08),Sr.translate(Be,En+.086,yt),a.push(qe(Sr,new I(1591374)));const wo=e(Be+.38,yt-.25),Gi=new $t(.012,.012,1.4,6).toNonIndexed();Gi.rotateZ(Math.PI/2-.12),Gi.translate(Be+.38,wo+.03,yt-.25),a.push(qe(Gi,We.wood.dark));const is=new ot(.14,.01,.32).toNonIndexed();is.rotateY(-.12),is.translate(Be+1.05,wo+.025,yt-.15),a.push(qe(is,new I(16369487)));const rs=e(Be+.42,yt+.45),ss=new ot(.32,.1,.36).toNonIndexed();ss.rotateY(.35),ss.translate(Be+.42,rs+.05,yt+.45),a.push(qe(ss,new I(16011550)));const Fa=e(Be+.48,yt+.88),Eo=new ot(.28,.2,.24).toNonIndexed();Eo.rotateY(-.2),Eo.translate(Be+.48,Fa+.1,yt+.88),a.push(qe(Eo,new I(11699022)));const Oa=Wo(s,!1);Oa&&n.add(new Et(Oa,c));const ka=Wo(o,!1);ka&&n.add(new Et(ka,h));const C=Wo(a,!1);C&&n.add(new Et(C,d));const k=Wo(l,!1);let X=null;if(k){const V=new Pt({color:We.terrain.snow,roughness:.95,metalness:0,transparent:!0,opacity:0});X=new Et(k,V),n.add(X)}t.add(n);function K(V,ue,ye){if(r){const Se=1+Math.sin(ue*12)*.08+Math.cos(ue*18)*.05;r.scale.set(Se,Se*1.1,Se),r.rotation.y=ue*2}}function H(V,ue){if(X){const ye=V==="winter"?.95:0,Se=X.material;Se.opacity=bt.lerp(Se.opacity,ye,ue),X.visible=Se.opacity>.01}}return{group:n,emissiveMeshes:i,fireMesh:r,update:K,updateSeason:H,dispose(){c.dispose(),h.dispose(),d.dispose(),f.dispose(),n.removeFromParent()}}}const v0=[{minX:-6.2,maxX:-3.8,minZ:-3.1,maxZ:-.9},{minX:-3.4,maxX:-1,minZ:-2.3,maxZ:-.1},{minX:-5.4,maxX:-3,minZ:-1.1,maxZ:1.1},{minX:-2,maxX:.1,minZ:-3.6,maxZ:-1.2},{minX:-3.8,maxX:-2.6,minZ:-1.4,maxZ:-.2},{minX:-7,maxX:-5.4,minZ:-1.2,maxZ:.2},{minX:-6.8,maxX:-5.2,minZ:-3.1,maxZ:-1.9},{minX:-4,maxX:-2,minZ:.7,maxZ:2.7},{minX:4.4,maxX:6.4,minZ:3.4,maxZ:5.5}];function Dr(t,e,n=.2){for(let i=0;i<v0.length;i++){const r=v0[i];if(t>=r.minX-n&&t<=r.maxX+n&&e>=r.minZ-n&&e<=r.maxZ+n)return!0}return!1}function iA(t,e,n,i,r){const s=new mi;s.name="VegetationSystem";const o=new Kc(777),a=Xf*.5,l=Ua*.5,c=new Dt,h=new $t(.04,.08,1,6);h.translate(0,.5,0);const d=new Ra(1,1,7);d.translate(0,.5,0);const f=new Pt({color:6046256,roughness:.88,metalness:.05,flatShading:!0}),p=new Pt({color:Cs.spring.pineFoliage,roughness:.82,metalness:.05,flatShading:!0}),v=26,x=5,m=new Cn(h,f,v),u=new Cn(d,p,v*x);m.castShadow=!0,u.castShadow=!0,u.receiveShadow=!0,s.add(m),s.add(u);const g=[];let _=0;for(;g.length<v&&_<1500;){_++;const F=o.range(-a+1.2,a-1.2),L=o.range(-l+1.2,-3.4);if(i(F,L)||Dr(F,L,.6))continue;const ee=e(F,L);if(ee<2||Math.abs(F)<1.4&&L>-5.5)continue;let ge=!1;for(const Be of g)if(Math.hypot(F-Be.x,L-Be.z)<1.1){ge=!0;break}if(ge)continue;const we=o.range(1.4,2.3),Ve=o.range(.36,.58),it=Math.floor(o.range(3,5.99));g.push({x:F,y:ee,z:L,h:we,r:Ve,layers:it})}let y=0;for(let F=0;F<g.length;F++){const L=g[F];c.position.set(L.x,L.y,L.z),c.rotation.set(o.range(-.04,.04),o.range(0,Math.PI*2),o.range(-.04,.04)),c.scale.set(1,L.h,1),c.updateMatrix(),m.setMatrixAt(F,c.matrix);for(let ee=0;ee<x;ee++){if(ee<L.layers){const ge=.32+ee/(L.layers-.2)*.58,we=L.y+L.h*ge,Ve=1-ee/L.layers*.62,it=L.r*Ve,Be=L.h*(.44/L.layers*4)*Ve;c.position.set(L.x,we,L.z),c.rotation.set(0,o.range(0,Math.PI*2),0),c.scale.set(it,Be,it)}else c.position.set(L.x,L.y,L.z),c.scale.set(0,0,0);c.updateMatrix(),u.setMatrixAt(y++,c.matrix)}}m.instanceMatrix.needsUpdate=!0,u.instanceMatrix.needsUpdate=!0;const R=new $t(.08,.16,1,7);R.translate(0,.5,0);const w=new fo(1,2),T=w.attributes.position,A=new O;for(let F=0;F<T.count;F++){A.fromBufferAttribute(T,F);const L=X2(A.x*1.8,A.y*1.8,A.z*1.8)*.18;A.multiplyScalar(1+L),T.setXYZ(F,A.x,A.y,A.z)}w.computeVertexNormals();const M=new Pt({color:5915184,roughness:.86,metalness:.05,flatShading:!0}),S=new Pt({color:Cs.spring.canopyPrimary,roughness:.78,metalness:.02,flatShading:!1}),P=13,z=5,B=new Cn(R,M,P),W=new Cn(w,S,P*z);B.castShadow=!0,W.castShadow=!0,W.receiveShadow=!0,s.add(B),s.add(W);const ne=[];[{x:-7.8,z:-2.8,r:.82,h:1.85},{x:-8,z:-1.2,r:.8,h:1.75},{x:-7.6,z:.3,r:.75,h:1.65},{x:-5.6,z:-3.8,r:.85,h:1.95},{x:-3.4,z:-4,r:.88,h:2.05},{x:-1.2,z:-4,r:.85,h:1.95},{x:.8,z:-3.8,r:.88,h:2},{x:2.6,z:-3.2,r:.85,h:1.9},{x:4.8,z:-2.2,r:.82,h:1.8},{x:6.2,z:-1.2,r:.85,h:1.8},{x:7.2,z:-.2,r:.8,h:1.75},{x:7.5,z:1.2,r:.78,h:1.65},{x:7.2,z:2.8,r:.75,h:1.6}].forEach(F=>{if(Math.abs(F.x)>a-.9||Math.abs(F.z)>l-.9||i(F.x,F.z)||Dr(F.x,F.z,.4))return;const L=e(F.x,F.z);L<Wt+.15||ne.push({x:F.x,y:L,z:F.z,h:F.h,r:F.r})});let Q=0;for(let F=0;F<ne.length;F++){const L=ne[F];c.position.set(L.x,L.y,L.z),c.rotation.set(o.range(-.04,.04),o.range(0,Math.PI*2),o.range(-.04,.04)),c.scale.set(1,L.h,1),c.updateMatrix(),B.setMatrixAt(F,c.matrix);const ee=[{dx:0,dy:L.h*1.02,dz:0,sx:L.r*1.12,sy:L.r*.96,sz:L.r*1.12},{dx:.36,dy:L.h*.82,dz:.22,sx:L.r*.88,sy:L.r*.82,sz:L.r*.88},{dx:-.34,dy:L.h*.86,dz:-.24,sx:L.r*.86,sy:L.r*.8,sz:L.r*.86},{dx:-.16,dy:L.h*.76,dz:.32,sx:L.r*.82,sy:L.r*.76,sz:L.r*.82},{dx:.26,dy:L.h*.74,dz:-.28,sx:L.r*.8,sy:L.r*.74,sz:L.r*.8}];for(const ge of ee)c.position.set(L.x+ge.dx,L.y+ge.dy,L.z+ge.dz),c.rotation.set(o.range(-.08,.08),o.range(0,Math.PI*2),o.range(-.08,.08)),c.scale.set(ge.sx,ge.sy,ge.sz),c.updateMatrix(),W.setMatrixAt(Q++,c.matrix)}B.instanceMatrix.needsUpdate=!0,W.instanceMatrix.needsUpdate=!0;const D=new fo(.32,1),q=new Pt({color:Cs.spring.canopyPrimary,roughness:.85,metalness:.05,flatShading:!0}),J=110,se=new Cn(D,q,J);se.castShadow=!0,se.receiveShadow=!0,s.add(se);let ve=0,Ee=0;for(;ve<J&&Ee<2500;){Ee++;const F=o.range(-a+.8,a-.8),L=o.range(-l+.8,l-.8);if(i(F,L)||Dr(F,L,.25))continue;const ee=e(F,L);if(ee<Wt+.05||n(F,L)>.65)continue;const we=o.range(.24,.44);c.position.set(F,ee+we*.4,L),c.rotation.set(0,o.range(0,Math.PI*2),0),c.scale.set(we,we*.85,we),c.updateMatrix(),se.setMatrixAt(ve++,c.matrix)}se.instanceMatrix.needsUpdate=!0;const G=new $t(.04,.02,.55,5);G.translate(0,-.27,0);const re=new Pt({color:new I(3825700),roughness:.82,metalness:.03,flatShading:!0}),he=45,fe=new Cn(G,re,he);s.add(fe);let Te=0;for(let F=0;F<he;F++){const L=o.range(-6.2,.1),ee=o.range(.85,1.85);if(n(L,ee)>.35&&!i(L,ee)&&!Dr(L,ee,.2)){const we=e(L,ee);c.position.set(L,we+.02,ee),c.rotation.set(o.range(-.1,.1),o.range(0,Math.PI*2),o.range(-.1,.1));const Ve=o.range(.7,1.3);c.scale.set(Ve,Ve*o.range(.8,1.4),Ve),c.updateMatrix(),fe.setMatrixAt(Te++,c.matrix)}}fe.count=Math.max(1,Te),fe.instanceMatrix.needsUpdate=!0;const ke=new $t(.008,.008,.12,4);ke.translate(0,.06,0);const Xe=new Vf(.045,5,4);Xe.translate(0,.12,0);const Qe=new Pt({color:4026403,roughness:.8}),U=new Pt({roughness:.5,metalness:.05,flatShading:!0}),nt=650,je=new Cn(ke,Qe,nt),ze=new Cn(Xe,U,nt);s.add(je),s.add(ze);const De=[{cx:-4.8,cz:.35,colIdx:0,radius:.75},{cx:-2.3,cz:.15,colIdx:1,radius:.65},{cx:-5.7,cz:-1.7,colIdx:2,radius:.7},{cx:-3.7,cz:-1.9,colIdx:0,radius:.6},{cx:-6.4,cz:-.2,colIdx:1,radius:.65},{cx:3.4,cz:2.1,colIdx:2,radius:.8},{cx:4.6,cz:3.2,colIdx:0,radius:.75},{cx:2.5,cz:3.6,colIdx:1,radius:.6},{cx:-1.6,cz:2.7,colIdx:2,radius:.65},{cx:5.2,cz:.7,colIdx:0,radius:.75}],Ke=Cs.spring.flowerColors;let Ue=0;for(let F=0;F<nt;F++){const L=De[F%De.length],ee=o.range(0,Math.PI*2),ge=Math.sqrt(o.next())*L.radius,we=L.cx+Math.cos(ee)*ge,Ve=L.cz+Math.sin(ee)*ge;if(i(we,Ve)||Dr(we,Ve,.08))continue;const it=e(we,Ve);if(it<Wt+.05||n(we,Ve)>.4)continue;const Be=Ke[L.colIdx%Ke.length];c.position.set(we,it,Ve),c.rotation.set(o.range(-.1,.1),o.range(0,Math.PI*2),o.range(-.1,.1));const yt=o.range(.75,1.25);c.scale.set(yt,yt,yt),c.updateMatrix(),je.setMatrixAt(Ue,c.matrix),ze.setMatrixAt(Ue,c.matrix),ze.setColorAt(Ue,Be),Ue++}je.count=Math.max(1,Ue),ze.count=Math.max(1,Ue),je.instanceMatrix.needsUpdate=!0,ze.instanceMatrix.needsUpdate=!0,ze.instanceColor&&(ze.instanceColor.needsUpdate=!0);const be=new It,b=[],E=[],j=[],le=[],oe=new I(4090658),ae=new I(9159498);for(let F=0;F<5;F++){const L=F/5*Math.PI*2,ee=Math.cos(L),ge=Math.sin(L),we=.035,Ve=.13,it=.05,Be=F*3;b.push(-ge*we,0,ee*we),b.push(ge*we,0,-ee*we),b.push(ee*it,Ve,ge*it),E.push(0,1,0,0,1,0,0,1,0),j.push(oe.r,oe.g,oe.b),j.push(oe.r,oe.g,oe.b),j.push(ae.r,ae.g,ae.b),le.push(Be,Be+1,Be+2)}be.setAttribute("position",new et(b,3)),be.setAttribute("normal",new et(E,3)),be.setAttribute("color",new et(j,3)),be.setIndex(le);const Oe=new Pt({vertexColors:!0,roughness:.85,metalness:.02,side:Hn,flatShading:!0});function Me(F,L){return Math.hypot(F- -3.2,L- -.8)<1.5||Math.hypot(F- -5,L- -2)<1.7||Math.hypot(F- -2.2,L- -1.2)<1.7||Math.hypot(F- -4.2,L-0)<1.7||Math.hypot(F- -1,L- -2.5)<1.9||Math.hypot(F- -6.2,L- -.5)<1.4}const Ae=1200,Ge=new Cn(be,Oe,Ae);Ge.receiveShadow=!0,s.add(Ge);let me=0,Ce=0;for(;me<Ae&&Ce<15e3;){Ce++;const F=o.range(-a+.5,a-.5),L=o.range(-l+.5,l-.5);if(i(F,L)||Dr(F,L,.15)||Me(F,L))continue;const ee=e(F,L);if(ee<Wt+.04||n(F,L)>.45||!(L>=.3||F>.5||L<-3)&&o.next()>.15)continue;c.position.set(F,ee,L),c.rotation.set(0,o.range(0,Math.PI*2),0);const Ve=o.range(.65,1.25);c.scale.set(Ve,Ve,Ve),c.updateMatrix(),Ge.setMatrixAt(me++,c.matrix)}Ge.count=Math.max(1,me),Ge.instanceMatrix.needsUpdate=!0;const $=new Ra(.24,.22,5);$.translate(0,.11,0);const Z=new Pt({color:4027692,roughness:.78,metalness:.04,flatShading:!0}),te=120,de=new Cn($,Z,te);s.add(de);let pe=0,xe=0;for(;pe<te&&xe<3500;){xe++;const F=o.range(-a+.8,a-.8),L=o.range(.6,l-.8);if(i(F,L)||Dr(F,L,.15))continue;const ee=e(F,L);if(ee<Wt+.05||n(F,L)<.25&&L<2.5)continue;c.position.set(F,ee,L),c.rotation.set(o.range(-.15,.15),o.range(0,Math.PI*2),o.range(-.15,.15));const we=o.range(.55,1.1);c.scale.set(we,we*.7,we),c.updateMatrix(),de.setMatrixAt(pe++,c.matrix)}de.instanceMatrix.needsUpdate=!0,t.add(s);function N(F,L,ee){const ge=Math.sin(L*2.2)*.015*ee;W.position.x=ge,W.position.z=ge*.7,fe.rotation.z=Math.sin(L*1.8)*.02*ee}function ce(F,L){const ee=Cs[F];if(p.color.lerp(ee.pineFoliage,L),S.color.lerp(ee.canopyPrimary,L),q.color.lerp(ee.canopyPrimary,L),re.color.lerp(F==="winter"?ee.pineFoliage:ee.canopyPrimary,L),F==="winter")ze.visible=!1,je.visible=!1;else{ze.visible=!0,je.visible=!0;const ge=ee.flowerColors;if(ge.length>0){for(let we=0;we<ze.count;we++)ze.setColorAt(we,ge[we%ge.length]);ze.instanceColor&&(ze.instanceColor.needsUpdate=!0)}}}return{group:s,update:N,updateSeason:ce,dispose(){h.dispose(),f.dispose(),d.dispose(),p.dispose(),R.dispose(),M.dispose(),w.dispose(),S.dispose(),D.dispose(),q.dispose(),G.dispose(),re.dispose(),ke.dispose(),Qe.dispose(),Xe.dispose(),U.dispose(),be.dispose(),Oe.dispose(),$.dispose(),Z.dispose(),s.removeFromParent()}}}function rA(){const t=[],e=[],n=[],i=new I(15092240),r=new I(16093984),s=new I(16773855),o=new I(16755552),a=new I(13383424),l=new I(16089125);function c(D,q,J,se){return t.push(D,q,J),e.push(se.r,se.g,se.b),t.length/3-1}const h=[.05,.015,-.02,-.055],d=[.009,.016,.011,.004],f=[.008,.013,.01,.006],p=[],v=c(.075,0,0,o);for(let D=0;D<h.length;D++){const q=d[D],J=f[D],se=h[D],ve=t.length/3;p.push(ve);for(let Ee=0;Ee<8;Ee++){const G=Ee/8*Math.PI*2,re=Math.sin(G)*q,he=Math.cos(G)*J,fe=new I,Te=he/J;Te>=0?fe.copy(r).lerp(i,Te):fe.copy(r).lerp(s,-Te),c(se,he,re,fe)}}const x=p[0];for(let D=0;D<8;D++){const q=(D+1)%8;n.push(v,x+D,x+q)}for(let D=0;D<p.length-1;D++){const q=p[D],J=p[D+1];for(let se=0;se<8;se++){const ve=(se+1)%8,Ee=q+se,G=q+ve,re=J+se,he=J+ve;n.push(Ee,G,he),n.push(Ee,he,re)}}const m=c(-.065,0,0,a),u=p[p.length-1];for(let D=0;D<8;D++){const q=(D+1)%8;n.push(u+D,m,u+q)}function g(D,q,J,se,ve,Ee){const G=c(D[0],D[1],D[2],q),re=c(J[0],J[1],J[2],se),he=c(ve[0],ve[1],ve[2],Ee);n.push(G,re,he),n.push(G,he,re)}const _=[-.062,.005,0],y=[-.062,-.005,0],R=[-.105,.02,0],w=[-.095,0,0],T=[-.105,-.02,0];g(_,a,R,l,w,l),g(_,a,w,l,y,a),g(y,a,w,l,T,l),g([.005,.013,0],a,[-.02,.026,0],l,[-.035,.009,0],a),g([.018,-.003,.014],a,[-.004,-.01,.032],l,[.002,-.005,.015],a),g([.018,-.003,-.014],a,[.002,-.005,-.015],a,[-.004,-.01,-.032],l);const Q=new It;return Q.setAttribute("position",new et(t,3)),Q.setAttribute("color",new et(e,3)),Q.setIndex(n),Q.computeVertexNormals(),Q}function sA(t,e,n){const r=new mi;r.name="fish_system";const s=rA(),o=new Float32Array(12),a=new Kc(777);for(let m=0;m<12;m++)o[m]=a.range(0,Math.PI*2);s.setAttribute("aPhase",new Ld(o,1));const l={uTime:{value:0}},c=new Pt({vertexColors:!0,roughness:.35,metalness:.08,side:Hn});c.customProgramCacheKey=()=>"fish_tail_shader_v1",c.onBeforeCompile=m=>{m.uniforms.uTime=l.uTime,m.vertexShader=`
      attribute float aPhase;
      uniform float uTime;
    `+m.vertexShader,m.vertexShader=m.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      // Tail starts bending behind mid-body (x < 0.01) toward tail tip (x ~ -0.105)
      float bend = clamp((0.01 - position.x) / 0.11, 0.0, 1.0);
      bend = bend * bend;
      float wiggle = sin(uTime * 10.0 + aPhase) * 0.025 * bend;
      transformed.z += wiggle;
      `)};const h=new Cn(s,c,12);h.castShadow=!0,h.receiveShadow=!1;const d=[new I(1.02,.92,.75),new I(1.15,.75,.55),new I(.98,.98,.92),new I(1.05,.85,.5),new I(1.1,.65,.45),new I(1,.88,.68),new I(1.18,.7,.5),new I(.95,.92,.88),new I(1.08,.82,.55),new I(1,.9,.7),new I(1.12,.68,.48),new I(1.04,.86,.6)];for(let m=0;m<12;m++)h.setColorAt(m,d[m%d.length]);h.instanceColor&&(h.instanceColor.needsUpdate=!0),r.add(h),t.add(r);const f=[],p=new Dt,v=O2+.6,x=Ua/2-.6;for(let m=0;m<12;m++){let u=a.range(v,x),g=gi(u)+a.range(-.5,.5);for(let P=0;P<30&&!(n(g,u)&&e(g,u)<Wt-.03);P++)u=a.range(v,x),g=gi(u)+a.range(-.6,.6);const _=e(g,u),y=bt.clamp((_+Wt)*.5,_+.04,Wt-.03),R=a.range(0,Math.PI*2),w=a.range(.32,.55),T=Math.cos(R)*w,A=Math.sin(R)*w,M={position:new O(g,y,u),velocity:new O(T,0,A),phase:o[m],wanderAngle:R,baseSpeed:w,rippleFleeBoost:new O(0,0,0),seedOffset:m*17.3+5.1};f.push(M),p.position.copy(M.position);const S=Math.atan2(-A,T);p.rotation.set(0,S,0,"YXZ"),p.updateMatrix(),h.setMatrixAt(m,p.matrix)}return h.instanceMatrix.needsUpdate=!0,{group:r,update(m,u,g){const _=Math.min(m,.06);l.uTime.value=u;const y=new O;for(let T=0;T<12;T++)y.add(f[T].position);y.multiplyScalar(1/12);const R=new O,w=new O;for(let T=0;T<12;T++){const A=f[T];w.set(0,0,0);const M=y.clone().sub(A.position);M.y=0,M.length()>.4&&(M.normalize(),w.addScaledVector(M,.25));for(let be=0;be<12;be++){if(T===be)continue;const b=f[be],E=A.position.clone().sub(b.position);E.y=0;const j=E.length(),le=.38;if(j<le&&j>1e-4){E.normalize();const oe=(le-j)/le;w.addScaledVector(E,oe*1.8)}}const P=Qc(A.seedOffset+u*.45,.5);A.wanderAngle+=P*_*1.6;const z=new O(Math.cos(A.wanderAngle),0,Math.sin(A.wanderAngle));w.addScaledVector(z,.45);const B=Math.hypot(A.velocity.x,A.velocity.z);B>.001?R.set(A.velocity.x/B,0,A.velocity.z/B):R.set(1,0,0);const W=.45,ne=A.position.x+R.x*W,Y=A.position.z+R.z*W,Q=.7071,D=.7071,q=R.x*Q-R.z*D,J=R.x*D+R.z*Q,se=R.x*Q+R.z*D,ve=-R.x*D+R.z*Q,Ee=A.position.x+q*W,G=A.position.z+J*W,re=A.position.x+se*W,he=A.position.z+ve*W,fe=n(ne,Y),Te=g-e(ne,Y);if(!fe||Te<.04){const be=n(Ee,G)&&g-e(Ee,G)>=.04,b=n(re,he)&&g-e(re,he)>=.04;if(be&&!b)w.x+=q*2.5,w.z+=J*2.5;else if(b&&!be)w.x+=se*2.5,w.z+=ve*2.5;else{const E=gi(A.position.z);w.x+=(E-A.position.x)*3.5}}if(A.position.z<v+.1?w.z+=2.8:A.position.z>x-.1&&(w.z-=2.8),!n(A.position.x,A.position.z)){const be=gi(A.position.z);w.x+=(be-A.position.x)*4.5}A.rippleFleeBoost.multiplyScalar(Math.exp(-_*3)),w.add(A.rippleFleeBoost),A.velocity.x+=w.x*_,A.velocity.z+=w.z*_;const ke=A.rippleFleeBoost.length(),Xe=Math.min(1.2,A.baseSpeed+ke*.8),Qe=Math.hypot(A.velocity.x,A.velocity.z);if(Qe>1e-4){const be=bt.clamp(Qe,.28,Xe);A.velocity.x=A.velocity.x/Qe*be,A.velocity.z=A.velocity.z/Qe*be}else A.velocity.set(A.baseSpeed,0,0);A.position.x+=A.velocity.x*_,A.position.z+=A.velocity.z*_;const U=e(A.position.x,A.position.z),nt=U+.03,je=g-.03;let ze;if(je>nt){const be=Math.sin(u*2.2+A.phase)*.012;ze=bt.clamp((nt+je)*.5+be,nt,je)}else ze=(U+g)*.5;A.velocity.y=(ze-A.position.y)*3.5,A.position.y+=A.velocity.y*_,A.position.y=bt.clamp(A.position.y,U+.015,g-.015);const De=A.velocity.x,Ke=A.velocity.z,Ue=Math.hypot(De,Ke);if(Ue>.001){const be=Math.atan2(-Ke,De),b=bt.clamp(-Math.atan2(A.velocity.y,Ue)*.4,-.45,.45);p.rotation.set(0,be,b,"YXZ")}p.position.copy(A.position),p.scale.set(1,1,1),p.updateMatrix(),h.setMatrixAt(T,p.matrix)}h.instanceMatrix.needsUpdate=!0},reactToRipple(m,u){for(let _=0;_<12;_++){const y=f[_],R=y.position.x-m,w=y.position.z-u,T=Math.hypot(R,w);if(T<2.4){const A=(1-T/2.4)*2.2,M=T>1e-4?T:1e-4,S=R/M,P=w/M;y.rippleFleeBoost.x+=S*A,y.rippleFleeBoost.z+=P*A,y.velocity.x+=S*A*.6,y.velocity.z+=P*A*.6,y.position.y-=.02*(1-T/2.4)}}},dispose(){t.remove(r),s.dispose(),c.dispose()}}}const Xo=[{time:0,sunColor:new I(8952268),sunIntensity:.15,hemiSky:new I(791588),hemiGround:new I(264200),hemiIntensity:.12,ambientColor:new I(1054760),ambientIntensity:.1,bgColor:new I(461588),fogColor:new I(461588)},{time:4,sunColor:new I(8952268),sunIntensity:.15,hemiSky:new I(989228),hemiGround:new I(330250),hemiIntensity:.13,ambientColor:new I(1186348),ambientIntensity:.1,bgColor:new I(527642),fogColor:new I(527642)},{time:5,sunColor:new I(14509636),sunIntensity:.4,hemiSky:new I(3678788),hemiGround:new I(1185808),hemiIntensity:.22,ambientColor:new I(2628656),ambientIntensity:.11,bgColor:new I(2364974),fogColor:new I(2364974)},{time:6,sunColor:new I(16755285),sunIntensity:.95,hemiSky:new I(16091720),hemiGround:new I(4867126),hemiIntensity:.52,ambientColor:new I(16759671),ambientIntensity:.28,bgColor:new I(15635040),fogColor:new I(14648404)},{time:8.5,sunColor:new I(16771720),sunIntensity:1.3,hemiSky:new I(9360629),hemiGround:new I(5657156),hemiIntensity:.65,ambientColor:new I(16775406),ambientIntensity:.32,bgColor:new I(9359348),fogColor:new I(9359348)},{time:12,sunColor:new I(16775400),sunIntensity:1.5,hemiSky:new I(7914224),hemiGround:new I(6051400),hemiIntensity:.72,ambientColor:new I(16777215),ambientIntensity:.35,bgColor:new I(8440056),fogColor:new I(8440056)},{time:15.5,sunColor:new I(16772816),sunIntensity:1.35,hemiSky:new I(8174566),hemiGround:new I(5919814),hemiIntensity:.66,ambientColor:new I(16772829),ambientIntensity:.34,bgColor:new I(8569582),fogColor:new I(8569582)},{time:17.25,sunColor:new I(16755285),sunIntensity:1.2,hemiSky:new I(15896656),hemiGround:new I(5393470),hemiIntensity:.58,ambientColor:new I(16759688),ambientIntensity:.32,bgColor:new I(15437144),fogColor:new I(14450248)},{time:18,sunColor:new I(16746564),sunIntensity:1,hemiSky:new I(15228976),hemiGround:new I(4472368),hemiIntensity:.48,ambientColor:new I(16746581),ambientIntensity:.28,bgColor:new I(14179372),fogColor:new I(12996642)},{time:19.5,sunColor:new I(11158613),sunIntensity:.35,hemiSky:new I(3285061),hemiGround:new I(1316880),hemiIntensity:.22,ambientColor:new I(3153978),ambientIntensity:.12,bgColor:new I(2365492),fogColor:new I(2102320)},{time:21,sunColor:new I(8952268),sunIntensity:.18,hemiSky:new I(1054763),hemiGround:new I(396298),hemiIntensity:.15,ambientColor:new I(1186348),ambientIntensity:.1,bgColor:new I(659486),fogColor:new I(659486)},{time:22,sunColor:new I(8952268),sunIntensity:.15,hemiSky:new I(791588),hemiGround:new I(264200),hemiIntensity:.12,ambientColor:new I(1054760),ambientIntensity:.1,bgColor:new I(461588),fogColor:new I(461588)},{time:24,sunColor:new I(8952268),sunIntensity:.15,hemiSky:new I(791588),hemiGround:new I(264200),hemiIntensity:.12,ambientColor:new I(1054760),ambientIntensity:.1,bgColor:new I(461588),fogColor:new I(461588)}];function oA(t){const e=(t%24+24)%24;let n=0;for(let v=0;v<Xo.length-1;v++)if(e>=Xo[v].time&&e<Xo[v+1].time){n=v;break}const i=Xo[n],r=Xo[n+1],s=r.time-i.time,o=s>0?(e-i.time)/s:0,a=o*o*(3-2*o),l=new I().lerpColors(i.sunColor,r.sunColor,a),c=new I().lerpColors(i.hemiSky,r.hemiSky,a),h=new I().lerpColors(i.hemiGround,r.hemiGround,a),d=new I().lerpColors(i.ambientColor,r.ambientColor,a),f=new I().lerpColors(i.bgColor,r.bgColor,a),p=new I().lerpColors(i.fogColor,r.fogColor,a);return{sunColor:l,sunIntensity:bt.lerp(i.sunIntensity,r.sunIntensity,a),hemiSky:c,hemiGround:h,hemiIntensity:bt.lerp(i.hemiIntensity,r.hemiIntensity,a),ambientColor:d,ambientIntensity:bt.lerp(i.ambientIntensity,r.ambientIntensity,a),bgColor:f,fogColor:p}}function aA(t){const e=new mi;e.name="lighting_system";const n=new _2(16775400,1.55);n.name="sun_moon_light",n.castShadow=!0;const i=14;n.shadow.camera.left=-i,n.shadow.camera.right=i,n.shadow.camera.top=i,n.shadow.camera.bottom=-i,n.shadow.camera.near=1,n.shadow.camera.far=50,n.shadow.bias=-5e-4,n.shadow.normalBias=.02,n.shadow.mapSize.width=2048,n.shadow.mapSize.height=2048,n.target.position.set(0,0,0),e.add(n),e.add(n.target);const r=new p2(7914224,4023852,.65);r.name="hemisphere_light",r.position.set(0,20,0),e.add(r);const s=new v2(16777215,.18);s.name="ambient_fill_light",e.add(s);const o=new O(-3.2,2.15,-.8),a=new a0(16737826,1.4,6,2);a.name="campfire_point_1",a.position.copy(o);const l=new a0(16755251,.9,4.5,2);l.name="campfire_point_2",l.position.set(o.x+.08,o.y+.12,o.z-.06),e.add(a),e.add(l),t.background=null,t.fog=null,t.add(e);const c=new O(0,1,0),h=new I(16775400);let d=null;return{group:e,sunDirection:c,sunColor:h,update(f){const p=(f.timeOfDay%24+24)%24,v=p/24*2*Math.PI-Math.PI/2,x=Math.sin(v),m=Math.cos(v)*.5,u=-Math.cos(v)*.3,g=26;if(x>=0){const M=Math.max(.08,x);n.position.set(m,M,u).normalize().multiplyScalar(g)}else{const M=v+Math.PI,S=Math.max(.2,Math.sin(M)),P=Math.cos(M)*.5,z=-Math.cos(M)*.3;n.position.set(P,S,z).normalize().multiplyScalar(g)}n.target.position.set(0,0,0),n.target.updateMatrixWorld();const _=oA(p);n.color.copy(_.sunColor),n.intensity=_.sunIntensity,r.color.copy(_.hemiSky),r.groundColor.copy(_.hemiGround),r.intensity=_.hemiIntensity,s.color.copy(_.ambientColor),s.intensity=_.ambientIntensity,p>20||p<5?(t.background||(t.background=new I),t.background instanceof I&&t.background.copy(_.bgColor)):t.background=null,c.copy(n.position).normalize(),h.copy(_.sunColor);const y=performance.now()*.001,R=.82+.12*Math.sin(y*11.3)+.07*Math.sin(y*23.7)+.04*Math.cos(y*41.9),w=.82+.12*Math.cos(y*13.7)+.07*Math.sin(y*29.3)+.04*Math.sin(y*47.1);let T=1;if(p>=6&&p<9?T=bt.lerp(1,.35,(p-6)/3):p>=9&&p<=16?T=.35:p>16&&p<19&&(T=bt.lerp(.35,1,(p-16)/3)),a.intensity=T*R*1.35,l.intensity=T*w*.85,f.quality!==d){d=f.quality;const M=f.quality==="high"?2048:f.quality==="medium"?1024:512;n.shadow.mapSize.set(M,M),n.shadow.map&&(n.shadow.map.dispose(),n.shadow.map=null)}const A=p>18||p<6?Math.min(1,Math.abs(p>12?p-18:6-p)/2):0;t.traverse(M=>{var S;if(M.isMesh){const P=M,z=(P.name||"").toLowerCase(),B=(((S=P.parent)==null?void 0:S.name)||"").toLowerCase();if((z.includes("tent")||z.includes("cabin")||z.includes("lantern")||z.includes("window")||z.includes("lamp")||B.includes("tent")||B.includes("cabin")||!!P.userData.nightEmissive)&&P.material){const ne=Array.isArray(P.material)?P.material:[P.material];for(const Y of ne)if("emissive"in Y&&Y.emissive instanceof I){const Q=Y;Q.userData._baseEmissive||(Q.userData._baseEmissive=Q.emissive.clone(),Q.userData._baseEmissiveIntensity=Q.emissiveIntensity??1);const D=new I(16750899);Q.emissive.copy(Q.userData._baseEmissive).lerp(D,A*.85),"emissiveIntensity"in Q&&(Q.emissiveIntensity=bt.lerp(Q.userData._baseEmissiveIntensity,1.2,A))}}}})},dispose(){t.remove(e),n.dispose(),n.shadow.map&&n.shadow.map.dispose(),r.dispose(),s.dispose(),a.dispose(),l.dispose()}}}class lA{constructor(e,n){Je(this,"scene");Je(this,"camera");Je(this,"renderer");Je(this,"controls");Je(this,"terrain",null);Je(this,"water",null);Je(this,"architecture",null);Je(this,"vegetation",null);Je(this,"fish",null);Je(this,"lighting",null);Je(this,"state",{...la});Je(this,"clock",new x2);Je(this,"animFrameId",0);Je(this,"raycaster",new y2);Je(this,"mouse",new Pe);Je(this,"isPointerOnUI",!1);Je(this,"isPointerDown",!1);Je(this,"isDragging",!1);Je(this,"pointerDownPos",new Pe);Je(this,"frameCount",0);Je(this,"fpsAccum",0);Je(this,"currentFps",60);Je(this,"onFpsUpdate",null);Je(this,"prevSeason",la.season);Je(this,"seasonBlend",1);Je(this,"seasonBlendTarget",1);Je(this,"disposed",!1);Je(this,"initialTarget",new O(-.6,.65,0));Je(this,"initialCameraPos",new O(25,23,25));Je(this,"baseFrustumHeight",21);Je(this,"animate",()=>{var i,r,s,o,a,l,c,h,d,f,p,v,x,m;if(this.disposed)return;this.animFrameId=requestAnimationFrame(this.animate);const e=Math.min(this.clock.getDelta(),.1),n=this.clock.getElapsedTime();if(this.frameCount++,this.fpsAccum+=e,this.fpsAccum>=.5&&(this.currentFps=Math.round(this.frameCount/this.fpsAccum),this.frameCount=0,this.fpsAccum=0,(i=this.onFpsUpdate)==null||i.call(this,this.currentFps)),this.seasonBlend<this.seasonBlendTarget&&(this.seasonBlend=Math.min(this.seasonBlend+e*.9,1),(r=this.terrain)==null||r.updateSeason(this.state.season,this.seasonBlend),(s=this.vegetation)==null||s.updateSeason(this.state.season,this.seasonBlend),(o=this.architecture)==null||o.updateSeason(this.state.season,this.seasonBlend)),this.controls.autoRotate=this.state.autoRotate,this.controls.autoRotateSpeed=.6,this.controls.update(),(a=this.water)==null||a.update(e,n,this.state),(l=this.architecture)==null||l.update(e,n,this.state.timeOfDay),(c=this.vegetation)==null||c.update(e,n,this.state.windStrength),(d=this.fish)==null||d.update(e,n,((h=this.water)==null?void 0:h.getWaterLevel())??.35),(f=this.lighting)==null||f.update(this.state),this.water&&this.lighting){const u=this.water.mesh.material;u.uniforms&&((v=(p=u.uniforms.uSunDirection)==null?void 0:p.value)==null||v.copy(this.lighting.sunDirection),(m=(x=u.uniforms.uSunColor)==null?void 0:x.value)==null||m.copy(this.lighting.sunColor))}if(this.architecture&&this.lighting){const u=this.state.timeOfDay>18||this.state.timeOfDay<6?Math.min(1,Math.abs(this.state.timeOfDay>12?this.state.timeOfDay-18:this.state.timeOfDay+6)/2):0;for(const g of this.architecture.emissiveMeshes){const _=g.material;_.emissive&&(_.emissiveIntensity=u*.9)}}this.renderer.render(this.scene,this.camera)});Je(this,"onPointerMove",e=>{if(this.isPointerDown){const i=e.clientX-this.pointerDownPos.x,r=e.clientY-this.pointerDownPos.y;i*i+r*r>16&&(this.isDragging=!0)}if(this.isDragging||this.isPointerOnUI)return;const n=this.renderer.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-n.left)/n.width*2-1,this.mouse.y=-((e.clientY-n.top)/n.height)*2+1,this.water){this.raycaster.setFromCamera(this.mouse,this.camera);const i=this.raycaster.intersectObject(this.water.mesh);if(i.length>0){const r=i[0].point;this.water.addRipple(r.x,r.z,.18*this.state.rippleStrength)}}});Je(this,"onPointerDown",e=>{this.isPointerDown=!0,this.isDragging=!1,this.pointerDownPos.set(e.clientX,e.clientY)});Je(this,"onPointerUp",e=>{var n;if(!this.isDragging&&!this.isPointerOnUI&&this.water){const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.camera);const r=this.raycaster.intersectObject(this.water.mesh);if(r.length>0){const s=r[0].point;this.water.addRipple(s.x,s.z,.65*this.state.rippleStrength),(n=this.fish)==null||n.reactToRipple(s.x,s.z)}}this.isPointerDown=!1,this.isDragging=!1});Je(this,"onResize",()=>{const e=this.renderer.domElement.parentElement;if(!e)return;const n=e.clientWidth,i=e.clientHeight,r=n/i;let s=this.baseFrustumHeight;r<1.1&&(s=this.baseFrustumHeight/(r*.88)),this.camera.left=-s*r/2,this.camera.right=s*r/2,this.camera.top=s/2,this.camera.bottom=-s/2,this.camera.updateProjectionMatrix(),this.renderer.setSize(n,i)});this.onFpsUpdate=n,this.renderer=new a2({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=I_,this.renderer.toneMapping=U_,this.renderer.toneMappingExposure=1.05,this.renderer.outputColorSpace=ei,e.appendChild(this.renderer.domElement),this.scene=new Pd,this.scene.background=null;const i=e.clientWidth/e.clientHeight;let r=this.baseFrustumHeight;i<1.1&&(r=this.baseFrustumHeight/(i*.88)),this.camera=new Yc(-r*i/2,r*i/2,r/2,-r/2,-60,120),this.camera.position.copy(this.initialCameraPos),this.controls=new w2(this.camera,this.renderer.domElement),this.controls.target.copy(this.initialTarget),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minZoom=.55,this.controls.maxZoom=2.2,this.controls.maxPolarAngle=Math.PI*.44,this.controls.minPolarAngle=Math.PI*.16,this.controls.update(),this.renderer.domElement.addEventListener("pointermove",this.onPointerMove),this.renderer.domElement.addEventListener("pointerdown",this.onPointerDown),this.renderer.domElement.addEventListener("pointerup",this.onPointerUp),window.addEventListener("resize",this.onResize)}async init(){try{this.terrain=q2(this.scene),this.water=eA(this.renderer,this.scene,this.terrain.getHeightAt),this.architecture=nA(this.scene,this.terrain.getHeightAt),this.vegetation=iA(this.scene,this.terrain.getHeightAt,this.terrain.getSlopeAt,this.terrain.isInStream,this.terrain.isOnPlateau),this.fish=sA(this.scene,this.terrain.getHeightAt,this.terrain.isInStream),this.lighting=aA(this.scene),this.lighting.update(this.state),this.water.setTide(this.state.tide,!1),this.terrain.updateSeason(this.state.season,1),this.vegetation.updateSeason(this.state.season,1),this.architecture.updateSeason(this.state.season,1)}catch(e){throw console.error("Failed to initialize scene:",e),e}}start(){this.clock.start(),this.animate()}setDebugMode(e){var n,i;e?(this.scene.background=new I(16711935),(n=this.terrain)==null||n.setDebug(!0),this.vegetation&&(this.vegetation.group.visible=!1),this.architecture&&(this.architecture.group.visible=!1),this.water&&(this.water.group.visible=!1),this.fish&&(this.fish.group.visible=!1)):(this.scene.background=null,(i=this.terrain)==null||i.setDebug(!1),this.vegetation&&(this.vegetation.group.visible=!0),this.architecture&&(this.architecture.group.visible=!0),this.water&&(this.water.group.visible=!0),this.fish&&(this.fish.group.visible=!0))}updateState(e){var n;e.debugTerrain!==void 0&&e.debugTerrain!==this.state.debugTerrain&&this.setDebugMode(e.debugTerrain),e.season&&e.season!==this.state.season&&(this.prevSeason=this.state.season,this.seasonBlend=0,this.seasonBlendTarget=1),e.tide&&e.tide!==this.state.tide&&((n=this.water)==null||n.setTide(e.tide,!0)),e.quality&&e.quality!==this.state.quality&&(e.quality==="low"?(this.renderer.setPixelRatio(1),this.renderer.shadowMap.enabled=!1):e.quality==="medium"?(this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25)),this.renderer.shadowMap.enabled=!0):(this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0)),Object.assign(this.state,e)}reset(){var e,n,i,r,s;this.state={...la},this.setDebugMode(!1),this.camera.position.copy(this.initialCameraPos),this.camera.zoom=1,this.camera.updateProjectionMatrix(),this.controls.target.copy(this.initialTarget),this.controls.update(),(e=this.water)==null||e.setTide(this.state.tide,!0),this.prevSeason=this.state.season,this.seasonBlend=1,(n=this.terrain)==null||n.updateSeason(this.state.season,1),(i=this.vegetation)==null||i.updateSeason(this.state.season,1),(r=this.architecture)==null||r.updateSeason(this.state.season,1),(s=this.lighting)==null||s.update(this.state)}setPointerOnUI(e){this.isPointerOnUI=e}dispose(){var e,n,i,r,s,o;this.disposed=!0,cancelAnimationFrame(this.animFrameId),this.renderer.domElement.removeEventListener("pointermove",this.onPointerMove),this.renderer.domElement.removeEventListener("pointerdown",this.onPointerDown),this.renderer.domElement.removeEventListener("pointerup",this.onPointerUp),window.removeEventListener("resize",this.onResize),(e=this.terrain)==null||e.dispose(),(n=this.water)==null||n.dispose(),(i=this.architecture)==null||i.dispose(),(r=this.vegetation)==null||r.dispose(),(s=this.fish)==null||s.dispose(),(o=this.lighting)==null||o.dispose(),this.controls.dispose(),this.renderer.dispose(),this.renderer.domElement.remove()}}function cA({state:t,onReady:e,onError:n,onFps:i,managerRef:r}){const s=St.useRef(null),o=St.useRef(t);return o.current=t,St.useEffect(()=>{const a=s.current;if(!a)return;const l=document.createElement("canvas");if(!(l.getContext("webgl2")||l.getContext("webgl"))){n("Your browser or device does not support WebGL. Please try a modern browser.");return}const h=new lA(a,i);return r.current=h,h.init().then(()=>{h.start(),e()}).catch(d=>{console.error(d),n(`Failed to initialize 3D scene: ${d.message}`)}),()=>{h.dispose(),r.current=null}},[]),St.useEffect(()=>{var a;(a=r.current)==null||a.updateState(t)},[t]),ie.jsx("div",{ref:s,className:"canvas-container"})}const uA=()=>ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("circle",{cx:"12",cy:"12",r:"5"}),ie.jsx("path",{d:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"})]}),hA=()=>ie.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:ie.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})}),dA=()=>ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("polyline",{points:"1 4 1 10 7 10"}),ie.jsx("path",{d:"M3.51 15a9 9 0 1 0 2.13-9.36L1 10"})]}),fA=()=>ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("line",{x1:"4",y1:"21",x2:"4",y2:"14"}),ie.jsx("line",{x1:"4",y1:"10",x2:"4",y2:"3"}),ie.jsx("line",{x1:"12",y1:"21",x2:"12",y2:"12"}),ie.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"3"}),ie.jsx("line",{x1:"20",y1:"21",x2:"20",y2:"16"}),ie.jsx("line",{x1:"20",y1:"12",x2:"20",y2:"3"}),ie.jsx("line",{x1:"1",y1:"14",x2:"7",y2:"14"}),ie.jsx("line",{x1:"9",y1:"8",x2:"15",y2:"8"}),ie.jsx("line",{x1:"17",y1:"16",x2:"23",y2:"16"})]}),pA=()=>ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("polyline",{points:"15 3 21 3 21 9"}),ie.jsx("polyline",{points:"9 21 3 21 3 15"}),ie.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),ie.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]}),mA=()=>ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("path",{d:"M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"}),ie.jsx("path",{d:"M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"}),ie.jsx("path",{d:"M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"})]});function x0(t){const e=Math.floor(t)%24,n=Math.floor(t%1*60);return`${e.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}function gA(t){return t>=6&&t<18?ie.jsx(uA,{}):ie.jsx(hA,{})}const _A={spring:"🌸",summer:"☀️",autumn:"🍂",winter:"❄️"};function vA({state:t,onChange:e,onReset:n,fps:i,loading:r,webglError:s}){const[o,a]=St.useState(!1),[l,c]=St.useState(!1),[h,d]=St.useState(!1),[f,p]=St.useState(!0);St.useEffect(()=>{if(r)p(!0);else{const x=setTimeout(()=>p(!1),600);return()=>clearTimeout(x)}},[r]),St.useEffect(()=>{const x=()=>d(!!document.fullscreenElement);return document.addEventListener("fullscreenchange",x),()=>document.removeEventListener("fullscreenchange",x)},[]);const v=St.useCallback(()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})},[]);return s?ie.jsxs("div",{className:"webgl-error",children:[ie.jsx("h2",{children:"WebGL Not Available"}),ie.jsx("p",{children:s})]}):ie.jsxs(ie.Fragment,{children:[f&&ie.jsxs("div",{className:`loading-screen ${r?"":"fade-out"}`,children:[ie.jsx("div",{className:"loading-spinner"}),ie.jsx("div",{className:"loading-text",children:"Building the garden from math…"})]}),ie.jsxs("div",{className:"top-left-panel",children:[ie.jsxs("div",{className:"logo-row",children:[ie.jsx("div",{className:"logo-icon",children:"✦"}),ie.jsxs("div",{className:"logo-text",children:["chillax",ie.jsx("span",{className:"logo-degree",children:"°"})]})]}),ie.jsx("div",{className:"eyebrow",children:"GLAMPING AND STREAM, IN MINIATURE"}),ie.jsxs("h1",{className:"hero-title",children:["Where the garden",ie.jsx("br",{}),"meets the ",ie.jsx("em",{children:"stream."})]}),ie.jsxs("button",{className:"how-btn",onClick:()=>c(!0),"aria-label":"How it's made",children:[ie.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[ie.jsx("circle",{cx:"12",cy:"12",r:"10"}),ie.jsx("path",{d:"M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"}),ie.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]}),"How it's made"]})]}),ie.jsxs("div",{className:"top-right-panel",children:[ie.jsxs("div",{className:"badge-row",children:[ie.jsx("span",{className:"badge",children:"Chillax Garden"}),ie.jsx("span",{className:"badge",children:"Highland Stream"}),ie.jsx("span",{className:"badge",children:"Valley Cove"})]}),ie.jsxs("div",{className:"time-control",children:[ie.jsx("span",{className:"time-icon",children:gA(t.timeOfDay)}),ie.jsx("input",{className:"time-slider",type:"range",min:"0",max:"24",step:"0.1",value:t.timeOfDay,onChange:x=>e({timeOfDay:parseFloat(x.target.value)}),"aria-label":"Time of day"}),ie.jsx("span",{className:"time-label",children:x0(t.timeOfDay)})]})]}),ie.jsxs("div",{className:"bottom-bar",children:[ie.jsxs("button",{className:"ctrl-btn",onClick:n,"aria-label":"Reset view",children:[ie.jsx("span",{className:"btn-icon",children:ie.jsx(dA,{})}),"Reset"]}),ie.jsx("div",{className:"ctrl-divider"}),ie.jsx("div",{className:"season-selector",children:["spring","summer","autumn","winter"].map(x=>ie.jsxs("button",{className:`season-btn ${t.season===x?"active":""}`,onClick:()=>e({season:x}),"aria-label":`Season: ${x}`,children:[_A[x]," ",ie.jsx("span",{className:"season-label",children:x.charAt(0).toUpperCase()+x.slice(1)})]},x))}),ie.jsx("div",{className:"ctrl-divider"}),ie.jsxs("button",{className:`ctrl-btn ${t.tide==="high"?"active":""}`,onClick:()=>e({tide:t.tide==="low"?"high":"low"}),"aria-label":`Tide: ${t.tide}`,children:[ie.jsx("span",{className:"btn-icon",children:ie.jsx(mA,{})}),t.tide==="high"?"High":"Low"]}),ie.jsx("div",{className:"ctrl-divider"}),ie.jsxs("button",{className:`ctrl-btn ${o?"active":""}`,onClick:()=>a(!o),"aria-label":"Tune settings",children:[ie.jsx("span",{className:"btn-icon",children:ie.jsx(fA,{})}),"Tune"]}),ie.jsx("div",{className:"ctrl-divider"}),ie.jsxs("button",{className:"ctrl-btn",onClick:v,"aria-label":"Toggle fullscreen",children:[ie.jsx("span",{className:"btn-icon",children:ie.jsx(pA,{})}),h?"Exit":"Full"]})]}),o&&ie.jsxs("div",{className:"tune-panel",children:[ie.jsx("h3",{children:"Settings"}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Ripple strength"}),ie.jsx("input",{className:"tune-slider",type:"range",min:"0",max:"1",step:"0.05",value:t.rippleStrength,onChange:x=>e({rippleStrength:parseFloat(x.target.value)})})]}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Flow speed"}),ie.jsx("input",{className:"tune-slider",type:"range",min:"0",max:"1",step:"0.05",value:t.flowSpeed,onChange:x=>e({flowSpeed:parseFloat(x.target.value)})})]}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Wind"}),ie.jsx("input",{className:"tune-slider",type:"range",min:"0",max:"1",step:"0.05",value:t.windStrength,onChange:x=>e({windStrength:parseFloat(x.target.value)})})]}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Auto rotate"}),ie.jsx("div",{className:"tune-toggle",children:ie.jsx("button",{className:`toggle-switch ${t.autoRotate?"on":""}`,onClick:()=>e({autoRotate:!t.autoRotate}),"aria-label":"Toggle auto rotate"})})]}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Quality"}),ie.jsx("div",{className:"quality-selector",children:["low","medium","high"].map(x=>ie.jsx("button",{className:`quality-btn ${t.quality===x?"active":""}`,onClick:()=>e({quality:x}),children:x.charAt(0).toUpperCase()+x.slice(1)},x))})]}),ie.jsxs("div",{className:"tune-row",children:[ie.jsx("span",{className:"tune-label",children:"Debug Terrain (Magenta)"}),ie.jsx("div",{className:"tune-toggle",children:ie.jsx("button",{className:`toggle-switch ${t.debugTerrain?"on":""}`,onClick:()=>e({debugTerrain:!t.debugTerrain}),"aria-label":"Toggle terrain debug mode"})})]})]}),ie.jsxs("div",{className:"footer",children:[ie.jsx("div",{className:"footer-left",children:"Drag to orbit · Glide cursor on stream for ripples · Click water to splash"}),ie.jsxs("div",{className:"footer-right",children:[ie.jsx("span",{children:t.season.charAt(0).toUpperCase()+t.season.slice(1)}),ie.jsx("span",{children:x0(t.timeOfDay)}),ie.jsxs("span",{children:[i," FPS"]})]})]}),l&&ie.jsx("div",{className:"how-panel-overlay",onClick:()=>c(!1),children:ie.jsxs("div",{className:"how-panel",onClick:x=>x.stopPropagation(),children:[ie.jsx("h2",{children:"How It's Made"}),ie.jsx("h3",{children:"🏔️ Terrain"}),ie.jsx("p",{children:"The terrain is a 240×240 heightfield generated with multi-octave simplex noise (FBM), ridged multifractal for mountain ridges, and Voronoi patterns for rock textures. The diorama is a floating island with visible geological cross-section layers colored via vertex colors — no textures are used."}),ie.jsx("h3",{children:"💧 Water & Ripples"}),ie.jsx("p",{children:"Water uses a custom GLSL shader implementing Beer–Lambert light absorption for depth-dependent color, Schlick's Fresnel approximation for reflections, and animated surface normals. Ripples are simulated on the GPU using a 256×256 ping-pong render target running the 2D wave equation each frame. Mouse interaction injects impulses via raycasting."}),ie.jsx("h3",{children:"🐟 Fish"}),ie.jsx("p",{children:"12 procedural fish are generated from mathematical body curves with oscillating tail vertices. They follow a simplified Boids algorithm for loose schooling, with boundary avoidance and ripple reactions."}),ie.jsx("h3",{children:"🏕️ Architecture"}),ie.jsx("p",{children:"Geodesic domes are constructed from subdivided icosahedra (detail level 2), hemisphered and framed. The A-frame cabin, furniture, campfire, and all props are built entirely from basic THREE.js geometries combined procedurally."}),ie.jsx("h3",{children:"🌲 Vegetation"}),ie.jsx("p",{children:"Over 4,500 plant instances use THREE.InstancedMesh for performance. Tree canopies are noise-deformed icospheres. Placement uses density maps based on elevation, slope, and proximity to water, with exclusion zones around buildings."}),ie.jsx("h3",{children:"☀️ Lighting"}),ie.jsx("p",{children:"The sun orbits based on a 0–24h slider, with color temperature shifting from warm golden (dawn/dusk) to neutral daylight to cool blue moonlight. Tent and cabin interiors glow at night via emissive materials and point lights."}),ie.jsx("h3",{children:"🍂 Seasons"}),ie.jsx("p",{children:"Four seasons smoothly interpolate vegetation colors, flower density, and snow coverage using per-instance color updates on InstancedMesh."}),ie.jsx("button",{className:"close-btn",onClick:()=>c(!1),children:"Close"})]})})]})}function xA(){const[t,e]=St.useState({...la}),[n,i]=St.useState(!0),[r,s]=St.useState(null),[o,a]=St.useState(60),l=St.useRef(null),c=St.useCallback(v=>{e(x=>({...x,...v}))},[]),h=St.useCallback(()=>{var v;e({...la}),(v=l.current)==null||v.reset()},[]),d=St.useCallback(()=>{i(!1)},[]),f=St.useCallback(v=>{s(v),i(!1)},[]),p=St.useCallback(v=>{a(v)},[]);return ie.jsxs("div",{className:"app-container",onPointerEnter:()=>{var v;return(v=l.current)==null?void 0:v.setPointerOnUI(!1)},children:[ie.jsx(cA,{state:t,onReady:d,onError:f,onFps:p,managerRef:l}),ie.jsx("div",{onPointerEnter:()=>{var v;return(v=l.current)==null?void 0:v.setPointerOnUI(!0)},onPointerLeave:()=>{var v;return(v=l.current)==null?void 0:v.setPointerOnUI(!1)},children:ie.jsx(vA,{state:t,onChange:c,onReset:h,fps:o,loading:n,webglError:r})})]})}ih.createRoot(document.getElementById("root")).render(ie.jsx(Lv.StrictMode,{children:ie.jsx(xA,{})}));
