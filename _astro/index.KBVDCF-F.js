import{N as e,S as t,T as n,_ as r,a as i,b as a,c as o,k as s,p as c,s as l,t as u,x as d}from"./runtime-core.esm-bundler.5tswaBl0.js";import{t as f}from"./_plugin-vue_export-helper.BDNMzG2s.js";var p=`#version 300 es\r
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
`,m=`#version 300 es\r
precision mediump float;\r
\r
in vec2 a_position;\r
out vec2 vUv;\r
\r
void main() {\r
    vUv = .5 * (a_position + 1.);\r
    gl_Position = vec4(a_position, 0.0, 1.0);\r
}\r
`;function h(e){let t=document.createElement(`canvas`),n=t.getContext(`2d`);return new Promise((r,i)=>{if(!e||!n){i(Error(`Invalid image URL or context`));return}let a=new Image;a.crossOrigin=`anonymous`,a.onload=function(){let e=1e3,o=a.naturalWidth,s=a.naturalHeight;(o>e||s>e||o<500||s<500)&&(o>s?o>e?(s=Math.round(s*e/o),o=e):o<500&&(s=Math.round(s*500/o),o=500):s>e?(o=Math.round(o*e/s),s=e):s<500&&(o=Math.round(o*500/s),s=500)),t.width=o,t.height=s;let c=document.createElement(`canvas`);c.width=o,c.height=s;let l=c.getContext(`2d`);l.drawImage(a,0,0,o,s);let u=l.getImageData(0,0,o,s).data,d=Array(o*s).fill(!1);for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=(e*o+t)*4,r=u[n],i=u[n+1],a=u[n+2],s=u[n+3];d[e*o+t]=!(r===255&&i===255&&a===255&&s===255||s===0)}function f(e,t){return e<0||e>=o||t<0||t>=s?!1:d[t*o+e]}let p=Array(o*s).fill(!1);for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=e*o+t;if(!d[n])continue;let r=!1;for(let n=e-1;n<=e+1&&!r;n++)for(let e=t-1;e<=t+1&&!r;e++)f(e,n)||(r=!0);r&&(p[n]=!0)}let m=new Float32Array(o*s).fill(0),h=new Float32Array(o*s).fill(0);function g(e,t,n){return e<0||e>=o||t<0||t>=s||!d[t*o+e]?0:n[t*o+e]}for(let e=0;e<300;e++){for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=e*o+t;h[n]=!d[n]||p[n]?0:(.01+(g(t+1,e,m)+g(t-1,e,m)+g(t,e+1,m)+g(t,e-1,m)))/4}m.set(h)}let _=0;for(let e=0;e<o*s;e++)m[e]>_&&(_=m[e]);let v=n.createImageData(o,s);for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=e*o+t,r=n*4;if(!d[n])v.data[r]=255,v.data[r+1]=255,v.data[r+2]=255,v.data[r+3]=255;else{let e=255*(1-(m[n]/_)**2);v.data[r]=e,v.data[r+1]=e,v.data[r+2]=e,v.data[r+3]=255}}n.putImageData(v,0,0),t.toBlob(e=>{e?r({imageData:v,pngBlob:e}):i(Error(`Failed to create PNG blob`))},`image/png`)},a.onerror=()=>i(Error(`Failed to load image`)),a.src=e})}var g=c({__name:`index`,props:{imageUrl:{},patternScale:{default:2},refraction:{default:.015},edge:{default:.4},patternBlur:{default:.005},liquid:{default:.07},speed:{default:.3}},setup(t,{expose:n}){n();let r=t,i=e(null),o=e(null),c=e({}),l=e(0),u=e(0),f=e(null),g=e(!1),_,v;a(async()=>{g.value=!0,await w(),b(),y(),v=await T(),g.value=!1,window.addEventListener(`resize`,C),C(),S()}),d(()=>{window.removeEventListener(`resize`,C),cancelAnimationFrame(_),v&&v()});function y(){o.value&&c.value&&(o.value.uniform1f(c.value.u_edge,r.edge),o.value.uniform1f(c.value.u_patternBlur,r.patternBlur),o.value.uniform1f(c.value.u_time,0),o.value.uniform1f(c.value.u_patternScale,r.patternScale),o.value.uniform1f(c.value.u_refraction,r.refraction),o.value.uniform1f(c.value.u_liquid,r.liquid))}function b(){let e=f.value,t=e?.getContext(`webgl2`,{antialias:!0,alpha:!0});if(!e||!t)return;t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);function n(e,t,n){let r=e.createShader(n);return r?(e.shaderSource(r,t),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}let r=n(t,m,t.VERTEX_SHADER),i=n(t,p,t.FRAGMENT_SHADER),a=t.createProgram();if(!a||!r||!i)return;if(t.attachShader(a,r),t.attachShader(a,i),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))return null;function s(e,t){let n={},r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<r;i++){let r=t.getActiveUniform(e,i)?.name;r&&(n[r]=t.getUniformLocation(e,r))}return n}let l=s(a,t);c.value=l;let u=new Float32Array([-1,-1,1,-1,-1,1,1,1]),d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,u,t.STATIC_DRAW),t.useProgram(a);let h=t.getAttribLocation(a,`a_position`);t.enableVertexAttribArray(h),t.bindBuffer(t.ARRAY_BUFFER,d),t.vertexAttribPointer(h,2,t.FLOAT,!1,0,0),o.value=t}function x(e){let t=e-u.value;u.value=e,l.value+=t*r.speed,o.value.uniform1f(c.value.u_time,l.value),o.value.drawArrays(o.value.TRIANGLE_STRIP,0,4),_=requestAnimationFrame(x)}function S(){return u.value=performance.now(),_=requestAnimationFrame(x),()=>{cancelAnimationFrame(_)}}function C(){let e=f.value,t=o.value;if(!e||!t||!c.value)return;let n=i.value?i.value.width/i.value.height:1;t.uniform1f(c.value.u_img_ratio,n);let r=1e3;e.width=r*devicePixelRatio,e.height=r*devicePixelRatio,t.viewport(0,0,e.height,e.height),t.uniform1f(c.value.u_ratio,1),t.uniform1f(c.value.u_img_ratio,n)}async function w(){try{let{imageData:e}=await h(r.imageUrl);i.value=e}catch{}}async function T(){let e=o.value;if(!e||!c.value||!i.value)return;let t=e.getParameter(e.TEXTURE_BINDING_2D);t&&e.deleteTexture(t);let n=e.createTexture();e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_ALIGNMENT,1);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i.value.width,i.value.height,0,e.RGBA,e.UNSIGNED_BYTE,i.value.data),e.uniform1i(c.value.u_image_texture,0)}catch{}return()=>{n&&e.deleteTexture(n)}}s(()=>[r.edge,r.patternBlur,r.patternScale,r.refraction,r.liquid],y);let E={props:r,imageData:i,glRef:o,uniforms:c,totalAnimationTime:l,lastRenderTime:u,liquidLogoRef:f,loading:g,get renderId(){return _},set renderId(e){_=e},get cleanUpTexture(){return v},set cleanUpTexture(e){v=e},updateUniforms:y,initShader:b,render:x,animate:S,resizeCanvas:C,processImage:w,cleanTexture:T};return Object.defineProperty(E,"__isScriptSetup",{enumerable:!1,value:!0}),E}});function _(e,a,s,c,d,f){return t(),o(u,null,[c.loading?n(e.$slots,`loading`,{},void 0,!0,0):l(``,!0),i(`canvas`,r({ref:`liquidLogoRef`,style:{display:c.loading?`none`:`grid`}},e.$attrs),null,16)],64)}var v=f(g,[[`render`,_],[`__scopeId`,`data-v-e6e0ea99`]]);export{v as default};