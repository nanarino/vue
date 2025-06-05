import{_ as X}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{d as Z,c as G,r as q,i as z,a as O,G as k,F as V,k as S,C as H,E as W,A as Y,o as $}from"./runtime-core.esm-bundler.DKGPfaV6.js";const K=`#version 300 es\r
precision mediump float;\r
\r
in vec2 vUv;\r
out vec4 fragColor;\r
\r
uniform sampler2D u_image_texture;\r
uniform float u_time;\r
uniform float u_ratio;\r
uniform float u_img_ratio;\r
uniform float u_patternScale;\r
uniform float u_refraction;\r
uniform float u_edge;\r
uniform float u_patternBlur;\r
uniform float u_liquid;\r
\r
\r
#define TWO_PI 6.28318530718\r
#define PI 3.14159265358979323846\r
\r
\r
vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }\r
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }\r
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }\r
float snoise(vec2 v) {\r
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\r
    vec2 i = floor(v + dot(v, C.yy));\r
    vec2 x0 = v - i + dot(i, C.xx);\r
    vec2 i1;\r
    i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);\r
    vec4 x12 = x0.xyxy + C.xxzz;\r
    x12.xy -= i1;\r
    i = mod289(i);\r
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));\r
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);\r
    m = m*m;\r
    m = m*m;\r
    vec3 x = 2. * fract(p * C.www) - 1.;\r
    vec3 h = abs(x) - 0.5;\r
    vec3 ox = floor(x + 0.5);\r
    vec3 a0 = x - ox;\r
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\r
    vec3 g;\r
    g.x = a0.x * x0.x + h.x * x0.y;\r
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r
    return 130. * dot(m, g);\r
}\r
\r
vec2 get_img_uv() {\r
    vec2 img_uv = vUv;\r
    img_uv -= .5;\r
    if (u_ratio > u_img_ratio) {\r
        img_uv.x = img_uv.x * u_ratio / u_img_ratio;\r
    } else {\r
        img_uv.y = img_uv.y * u_img_ratio / u_ratio;\r
    }\r
    float scale_factor = 1.;\r
    img_uv *= scale_factor;\r
    img_uv += .5;\r
\r
    img_uv.y = 1. - img_uv.y;\r
\r
    return img_uv;\r
}\r
vec2 rotate(vec2 uv, float th) {\r
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;\r
}\r
float get_color_channel(float c1, float c2, float stripe_p, vec3 w, float extra_blur, float b) {\r
    float ch = c2;\r
    float border = 0.;\r
    float blur = u_patternBlur + extra_blur;\r
\r
    ch = mix(ch, c1, smoothstep(.0, blur, stripe_p));\r
\r
    border = w[0];\r
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));\r
\r
    b = smoothstep(.2, .8, b);\r
    border = w[0] + .4 * (1. - b) * w[1];\r
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));\r
\r
    border = w[0] + .5 * (1. - b) * w[1];\r
    ch = mix(ch, c2, smoothstep(border - blur, border + blur, stripe_p));\r
\r
    border = w[0] + w[1];\r
    ch = mix(ch, c1, smoothstep(border - blur, border + blur, stripe_p));\r
\r
    float gradient_t = (stripe_p - w[0] - w[1]) / w[2];\r
    float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));\r
    ch = mix(ch, gradient, smoothstep(border - blur, border + blur, stripe_p));\r
\r
    return ch;\r
}\r
\r
float get_img_frame_alpha(vec2 uv, float img_frame_width) {\r
    float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);\r
    img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);\r
    return img_frame_alpha;\r
}\r
\r
void main() {\r
    vec2 uv = vUv;\r
    uv.y = 1. - uv.y;\r
    uv.x *= u_ratio;\r
\r
    float diagonal = uv.x - uv.y;\r
\r
    float t = .001 * u_time;\r
\r
    vec2 img_uv = get_img_uv();\r
    vec4 img = texture(u_image_texture, img_uv);\r
\r
    vec3 color = vec3(0.);\r
    float opacity = 1.;\r
\r
    vec3 color1 = vec3(.98, 0.98, 1.);\r
    vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, uv.x + uv.y));\r
\r
    float edge = img.r;\r
\r
\r
    vec2 grad_uv = uv;\r
    grad_uv -= .5;\r
\r
    float dist = length(grad_uv + vec2(0., .2 * diagonal));\r
\r
    grad_uv = rotate(grad_uv, (.25 - .2 * diagonal) * PI);\r
\r
    float bulge = pow(1.8 * dist, 1.2);\r
    bulge = 1. - bulge;\r
    bulge *= pow(uv.y, .3);\r
\r
\r
    float cycle_width = u_patternScale;\r
    float thin_strip_1_ratio = .12 / cycle_width * (1. - .4 * bulge);\r
    float thin_strip_2_ratio = .07 / cycle_width * (1. + .4 * bulge);\r
    float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);\r
\r
    float thin_strip_1_width = cycle_width * thin_strip_1_ratio;\r
    float thin_strip_2_width = cycle_width * thin_strip_2_ratio;\r
\r
    opacity = 1. - smoothstep(.9 - .5 * u_edge, 1. - .5 * u_edge, edge);\r
    opacity *= get_img_frame_alpha(img_uv, 0.01);\r
\r
\r
    float noise = snoise(uv - t);\r
\r
    edge += (1. - edge) * u_liquid * noise;\r
\r
    float refr = 0.;\r
    refr += (1. - bulge);\r
    refr = clamp(refr, 0., 1.);\r
\r
    float dir = grad_uv.x;\r
\r
\r
    dir += diagonal;\r
\r
    dir -= 2. * noise * diagonal * (smoothstep(0., 1., edge) * smoothstep(1., 0., edge));\r
\r
    bulge *= clamp(pow(uv.y, .1), .3, 1.);\r
    dir *= (.1 + (1.1 - edge) * bulge);\r
\r
    dir *= smoothstep(1., .7, edge);\r
\r
    dir += .18 * (smoothstep(.1, .2, uv.y) * smoothstep(.4, .2, uv.y));\r
    dir += .03 * (smoothstep(.1, .2, 1. - uv.y) * smoothstep(.4, .2, 1. - uv.y));\r
\r
    dir *= (.5 + .5 * pow(uv.y, 2.));\r
\r
    dir *= cycle_width;\r
\r
    dir -= t;\r
\r
    float refr_r = refr;\r
    refr_r += .03 * bulge * noise;\r
    float refr_b = 1.3 * refr;\r
\r
    refr_r += 5. * (smoothstep(-.1, .2, uv.y) * smoothstep(.5, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(1., .4, bulge));\r
    refr_r -= diagonal;\r
\r
    refr_b += (smoothstep(0., .4, uv.y) * smoothstep(.8, .1, uv.y)) * (smoothstep(.4, .6, bulge) * smoothstep(.8, .4, bulge));\r
    refr_b -= .2 * edge;\r
\r
    refr_r *= u_refraction;\r
    refr_b *= u_refraction;\r
\r
    vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);\r
    w[1] -= .02 * smoothstep(.0, 1., edge + bulge);\r
    float stripe_r = mod(dir + refr_r, 1.);\r
    float r = get_color_channel(color1.r, color2.r, stripe_r, w, 0.02 + .03 * u_refraction * bulge, bulge);\r
    float stripe_g = mod(dir, 1.);\r
    float g = get_color_channel(color1.g, color2.g, stripe_g, w, 0.01 / (1. - diagonal), bulge);\r
    float stripe_b = mod(dir - refr_b, 1.);\r
    float b = get_color_channel(color1.b, color2.b, stripe_b, w, .01, bulge);\r
\r
    color = vec3(r, g, b);\r
\r
    color *= opacity;\r
\r
    fragColor = vec4(color, opacity);\r
}\r
`,J=`#version 300 es\r
precision mediump float;\r
\r
in vec2 a_position;\r
out vec2 vUv;\r
\r
void main() {\r
    vUv = .5 * (a_position + 1.);\r
    gl_Position = vec4(a_position, 0.0, 1.0);\r
}\r
`;function Q(y){const I=document.createElement("canvas"),s=I.getContext("2d");return new Promise((f,c)=>{if(!y||!s){c(new Error("Invalid image URL or context"));return}const i=new Image;i.crossOrigin="anonymous",i.onload=function(){let n=i.naturalWidth,a=i.naturalHeight;(n>1e3||a>1e3||n<500||a<500)&&(n>a?n>1e3?(a=Math.round(a*1e3/n),n=1e3):n<500&&(a=Math.round(a*500/n),n=500):a>1e3?(n=Math.round(n*1e3/a),a=1e3):a<500&&(n=Math.round(n*500/a),a=500)),I.width=n,I.height=a;const p=document.createElement("canvas");p.width=n,p.height=a;const b=p.getContext("2d");b.drawImage(i,0,0,n,a);const T=b.getImageData(0,0,n,a).data,h=new Array(n*a).fill(!1);for(let t=0;t<a;t++)for(let o=0;o<n;o++){const u=(t*n+o)*4,l=T[u],v=T[u+1],x=T[u+2],_=T[u+3];h[t*n+o]=!(l===255&&v===255&&x===255&&_===255||_===0)}function D(t,o){return t<0||t>=n||o<0||o>=a?!1:h[o*n+t]}const A=new Array(n*a).fill(!1);for(let t=0;t<a;t++)for(let o=0;o<n;o++){const u=t*n+o;if(!h[u])continue;let l=!1;for(let v=t-1;v<=t+1&&!l;v++)for(let x=o-1;x<=o+1&&!l;x++)D(x,v)||(l=!0);l&&(A[u]=!0)}const g=new Float32Array(n*a).fill(0),R=new Float32Array(n*a).fill(0),C=.01,r=300;function e(t,o,u){return t<0||t>=n||o<0||o>=a||!h[o*n+t]?0:u[o*n+t]}for(let t=0;t<r;t++){for(let o=0;o<a;o++)for(let u=0;u<n;u++){const l=o*n+u;if(!h[l]||A[l]){R[l]=0;continue}const v=e(u+1,o,g)+e(u-1,o,g)+e(u,o+1,g)+e(u,o-1,g);R[l]=(C+v)/4}g.set(R)}let m=0;for(let t=0;t<n*a;t++)g[t]>m&&(m=g[t]);const E=2,d=s.createImageData(n,a);for(let t=0;t<a;t++)for(let o=0;o<n;o++){const u=t*n+o,l=u*4;if(!h[u])d.data[l]=255,d.data[l+1]=255,d.data[l+2]=255,d.data[l+3]=255;else{const v=g[u]/m,_=255*(1-Math.pow(v,E));d.data[l]=_,d.data[l+1]=_,d.data[l+2]=_,d.data[l+3]=255}}s.putImageData(d,0,0),I.toBlob(t=>{if(!t){c(new Error("Failed to create PNG blob"));return}f({imageData:d,pngBlob:t})},"image/png")},i.onerror=()=>c(new Error("Failed to load image")),i.src=y})}const j=Z({__name:"index",props:{imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(y,{expose:I}){I();const s=y,f=S(null),c=S(null),i=S({}),P=S(0),M=S(0),n=S(null),a=S(!1);let p,b;H(async()=>{a.value=!0,await g(),T(),N(),b=await R(),a.value=!1,window.addEventListener("resize",A),A(),D()}),W(()=>{window.removeEventListener("resize",A),cancelAnimationFrame(p),b&&b()});function N(){!c.value||!i.value||(c.value.uniform1f(i.value.u_edge,s.edge),c.value.uniform1f(i.value.u_patternBlur,s.patternBlur),c.value.uniform1f(i.value.u_time,0),c.value.uniform1f(i.value.u_patternScale,s.patternScale),c.value.uniform1f(i.value.u_refraction,s.refraction),c.value.uniform1f(i.value.u_liquid,s.liquid))}function T(){const r=n.value,e=r?.getContext("webgl2",{antialias:!0,alpha:!0});if(!r||!e)return;e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);function m(_,U,B){const w=_.createShader(B);return w?(_.shaderSource(w,U),_.compileShader(w),_.getShaderParameter(w,_.COMPILE_STATUS)?w:(_.deleteShader(w),null)):null}const E=m(e,J,e.VERTEX_SHADER),d=m(e,K,e.FRAGMENT_SHADER),t=e.createProgram();if(!t||!E||!d)return;if(e.attachShader(t,E),e.attachShader(t,d),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))return null;function o(_,U){let B={},w=U.getProgramParameter(_,U.ACTIVE_UNIFORMS);for(let F=0;F<w;F++){let L=U.getActiveUniform(_,F)?.name;L&&(B[L]=U.getUniformLocation(_,L))}return B}const u=o(t,e);i.value=u;const l=new Float32Array([-1,-1,1,-1,-1,1,1,1]),v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,l,e.STATIC_DRAW),e.useProgram(t);const x=e.getAttribLocation(t,"a_position");e.enableVertexAttribArray(x),e.bindBuffer(e.ARRAY_BUFFER,v),e.vertexAttribPointer(x,2,e.FLOAT,!1,0,0),c.value=e}function h(r){const e=r-M.value;M.value=r,P.value+=e*s.speed,c.value.uniform1f(i.value.u_time,P.value),c.value.drawArrays(c.value.TRIANGLE_STRIP,0,4),p=requestAnimationFrame(h)}function D(){return M.value=performance.now(),p=requestAnimationFrame(h),()=>{cancelAnimationFrame(p)}}function A(){const r=n.value,e=c.value;if(!r||!e||!i.value)return;const m=f.value?f.value.width/f.value.height:1;e.uniform1f(i.value.u_img_ratio,m);const E=1e3;r.width=E*devicePixelRatio,r.height=E*devicePixelRatio,e.viewport(0,0,r.height,r.height),e.uniform1f(i.value.u_ratio,1),e.uniform1f(i.value.u_img_ratio,m)}async function g(){try{const{imageData:r}=await Q(s.imageUrl);f.value=r}catch{}}async function R(){const r=c.value;if(!r||!i.value||!f.value)return;const e=r.getParameter(r.TEXTURE_BINDING_2D);e&&r.deleteTexture(e);const m=r.createTexture();r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,m),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.pixelStorei(r.UNPACK_ALIGNMENT,1);try{r.texImage2D(r.TEXTURE_2D,0,r.RGBA,f.value.width,f.value.height,0,r.RGBA,r.UNSIGNED_BYTE,f.value.data),r.uniform1i(i.value.u_image_texture,0)}catch{}return()=>{m&&r.deleteTexture(m)}}Y(()=>[s.edge,s.patternBlur,s.patternScale,s.refraction,s.liquid],N);const C={props:s,imageData:f,glRef:c,uniforms:i,totalAnimationTime:P,lastRenderTime:M,liquidLogoRef:n,loading:a,get renderId(){return p},set renderId(r){p=r},get cleanUpTexture(){return b},set cleanUpTexture(r){b=r},updateUniforms:N,initShader:T,render:h,animate:D,resizeCanvas:A,processImage:g,cleanTexture:R};return Object.defineProperty(C,"__isScriptSetup",{enumerable:!1,value:!0}),C}});function rr(y,I,s,f,c,i){return $(),G(V,null,[f.loading?q(y.$slots,"loading",{key:0},void 0):z("",!0),O("canvas",k({ref:"liquidLogoRef",style:{display:f.loading?"none":"grid"}},y.$attrs),null,16)],64)}const nr=X(j,[["render",rr],["__scopeId","data-v-e6e0ea99"]]);export{nr as default};
