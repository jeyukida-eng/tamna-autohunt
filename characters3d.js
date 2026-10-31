/* Game-ready procedural 3D characters based on the supplied portrait references.
 * Meshes, lights, joints, and live WebGL rendering. No remote asset requests.
 */
(() => {
  'use strict';
  const T = window.TAMNA_THREE;
  if (!T) return;
  const materials = new Map(), rounded = new Map();
  const sphere = new T.SphereGeometry(1, 20, 14);
  const cylinder = new T.CylinderGeometry(1, 1, 1, 16);
  const cone = new T.ConeGeometry(1, 1, 16);
  const rigs = new Map();
  const GOLD = '#e8ad32', ROCK = '#414846', CREAM = '#fff2ca', PINK = '#e8a18a';
  function mat(color, options = {}) {
    const key = color + JSON.stringify(options);
    if (!materials.has(key)) materials.set(key, new T.MeshStandardMaterial({ color, roughness: .62, metalness: .02, ...options }));
    return materials.get(key);
  }
  function mesh(parent, geometry, color, position, scale = [1, 1, 1], options = {}) {
    const m = new T.Mesh(geometry, mat(color, options));
    m.position.set(...position); m.scale.set(...scale); parent.add(m); return m;
  }
  function ball(p, color, x, y, z, sx, sy = sx, sz = sx, options = {}) { return mesh(p, sphere, color, [x,y,z], [sx,sy,sz], options); }
  function block(p, color, x,y,z,w,h,d,r=.08,options={}) {
    const key=[w,h,d,r].join(',');
    if (!rounded.has(key)) rounded.set(key,new T.RoundedBoxGeometry(w,h,d,3,r));
    return mesh(p,rounded.get(key),color,[x,y,z],[1,1,1],options);
  }
  function rod(p,color,x,y,z,r,h,options={}) { return mesh(p,cylinder,color,[x,y,z],[r,h,r],options); }
  function spike(p,color,x,y,z,r,h) { return mesh(p,cone,color,[x,y,z],[r,h,r]); }
  function curve(p,color,points,r=.04,options={}) {
    const path=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));
    return mesh(p,new T.TubeGeometry(path,28,r,8,false),color,[0,0,0],[1,1,1],options);
  }
  function group(parent,x=0,y=0,z=0) { const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g; }
  function eyes(head,y,z,spread=.26,color='#493b26',size=.16,sclera=CREAM) {
    for(const sign of [-1,1]) { const x=sign*spread; ball(head,sclera,x,y,z,size*1.15,size*1.3,.075);ball(head,color,x,y,z+.055,size*.77,size*.94,.045,{roughness:.15});ball(head,'#151e20',x+.015,y,z+.09,size*.45,size*.65,.025);ball(head,'#ffffff',x-.03,y+.045,z+.114,.035,.04,.015); }
  }
  function limb(root,x,y,z,color,length=.65,width=.16){const pivot=group(root,x,y,z);ball(pivot,color,0,-length/2,0,width,length/2,width);ball(pivot,color,0,-length,0,width*1.1);return pivot;}
  function baseRig(id) { const root=new T.Group();root.name=id;return {id,root,body:group(root),arms:[],legs:[],wings:[],head:null,accessories:[],phase:0}; }
  function pig() {
    const r=baseRig('jeyukje'),b=r.body;
    ball(b,'#baa079',0,1.05,0,.55,.68,.36);
    ball(b,'#6f4836',0,1.28,-.025,.59,.6,.39);
    block(b,'#bba583',0,1.25,.34,.6,.86,.12,.06);
    for(const side of [-1,1]) { const lapel=block(b,'#8b6040',side*.25,1.57,.39,.17,.47,.09,.02);lapel.rotation.z=side*-.25;block(b,'#c5af86',side*.18,1.35,.42,.22,.19,.055,.02);ball(b,'#896c40',side*.18,1.39,.454,.024); }
    block(b,'#65492f',0,.85,.37,.9,.13,.08,.025);block(b,GOLD,0,.85,.43,.17,.15,.055,.025);
    for(const side of [-1,1]) { const leg=limb(b,side*.25,.67,0,'#ae9470',.5,.19);ball(leg,'#664933',0,-.53,.08,.23,.16,.32);r.legs.push(leg);const arm=limb(b,side*.62,1.61,0,'#75503b',.65,.19);ball(arm,PINK,0,-.68,0,.17,.19,.16);block(arm,'#c2ab83',0,-.5,.02,.35,.15,.32,.035);r.arms.push(arm); }
    const h=group(b,0,2.03,.04);r.head=h;ball(h,PINK,0,0,0,.69,.62,.53);
    for(const side of [-1,1]){const ear=spike(h,PINK,side*.56,.48,0,.22,.38);ear.rotation.z=-side*.35;ball(h,'#cf7d76',side*.56,.45,.115,.11,.16,.04);}
    ball(h,'#f1b39b',0,-.05,.49,.3,.22,.16);for(const side of [-1,1])ball(h,'#a85f56',side*.105,-.045,.64,.048,.065,.018);
    for(const side of [-1,1]){block(h,'#2c2420',side*.29,.19,.49,.48,.29,.10,.1,{roughness:.12});const glint=block(h,'#6a7f7b',side*.29-.08,.255,.55,.18,.025,.012,.01);glint.rotation.z=.3;}
    block(h,'#a88042',0,.19,.55,.12,.045,.04,.01);curve(h,'#7a4240',[[-.22,-.25,.46],[0,-.34,.48],[.22,-.25,.46]],.027);block(h,CREAM,0,-.29,.49,.22,.06,.03,.01);
    rod(h,GOLD,0,.59,-.015,.52,.16,{metalness:.65,roughness:.25});
    const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=128;const labelCtx=labelCanvas.getContext('2d');labelCtx.fillStyle='#dcac44';labelCtx.fillRect(0,0,256,128);labelCtx.fillStyle='#302b20';labelCtx.textAlign='center';labelCtx.textBaseline='middle';labelCtx.font='bold 80px Malgun Gothic, sans-serif';labelCtx.fillText('제육',128,69);const labelTexture=new T.CanvasTexture(labelCanvas);labelTexture.colorSpace=T.SRGBColorSpace;const label=new T.Mesh(new T.PlaneGeometry(.35,.175),new T.MeshBasicMaterial({map:labelTexture}));label.position.set(0,.65,.52);h.add(label);
    for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=Math.sin(a)*.46,z=Math.cos(a)*.4;spike(h,GOLD,x,.83,z,.105,.4);ball(h,GOLD,x,1.03,z,.095,.095,.095,{metalness:.6});if(z>0)ball(h,'#be4340',x,.66,z+.045,.065,.075,.035,{roughness:.15});}
    const bag=block(b,'#704c32',.44,.83,.32,.39,.45,.2,.07);bag.rotation.z=-.15;curve(b,'#5e3b26',[[-.4,1.78,.38],[0,1.23,.46],[.46,.87,.46]],.052);
    return r;
  }
  function stonePits(parent,x,y,z,sx,sy,sz,count=26) {
    for(let i=0;i<count;i++){const u=((i*73)%103)/103-.5,v=((i*47)%97)/97-.5;ball(parent,'#293330',x+u*sx,y+v*sy,z+Math.sin(i)*.025,.015+(i%3)*.008,.02,.012);}
  }
  function rockMage() {
    const r=baseRig('mongdol'),b=r.body;
    ball(b,ROCK,0,1.38,0,.82,1.05,.62);r.head=group(b,0,1.67,.28);
    eyes(r.head,0,.34,.3,'#252c29',.23);
    for(const side of [-1,1]){const brow=ball(r.head,ROCK,side*.31,.23,.41,.36,.12,.12);brow.rotation.z=side*.2;const leg=limb(b,side*.36,.55,0,ROCK,.32,.2);ball(leg,ROCK,0,-.3,.15,.27,.12,.27);r.legs.push(leg);const arm=limb(b,side*.79,1.7,0,ROCK,.64,.16);arm.rotation.z=side*.25;r.arms.push(arm);}
    curve(b,'#1b2623',[[-.2,1.07,.6],[0,1.13,.64],[.2,1.07,.6]],.027);spike(b,CREAM,.2,1.03,.62,.055,.13).rotation.z=Math.PI;
    stonePits(b,0,1.58,.6,1.22,1.43,.1,55);
    const staff=group(r.arms[0],0,-.5,0);rod(staff,'#947049',0,.15,.05,.075,2.1);ball(staff,ROCK,0,1.29,.05,.31,.34,.31);rod(staff,GOLD,0,1.02,.05,.13,.12,{metalness:.4});
    return r;
  }
  function fairy() {
    const r=baseRig('sorang'),b=r.body;
    const mint='#8ddbcc',yellow='#f1cf82';
    const glow={roughness:.25,metalness:.12};
    ball(b,mint,0,1.15,0,.39,.56,.32,glow);curve(b,mint,[[.15,.95,0],[.12,.6,0],[-.15,.3,.05],[-.04,.16,.09],[.14,.26,.1]],.18,glow);
    const head=group(b,0,1.99,.02);r.head=head;ball(head,mint,0,0,-.07,.63,.69,.49,glow);ball(head,yellow,0,-.025,.25,.49,.51,.28);eyes(head,.02,.48,.21,'#6d421f',.15);ball(head,'#e3a65c',0,-.1,.54,.065,.07,.045);curve(head,'#a25734',[[-.17,-.2,.48],[0,-.28,.52],[.17,-.2,.48]],.024);
    curve(head,mint,[[-.46,-.1,.13],[-.54,.5,.12],[-.13,.69,.25],[.31,.99,.04],[.24,1.22,0],[-.04,1.26,0]],.105,glow);
    curve(head,'#f4aa29',[[.13,.53,.15],[.29,.86,.15],[.02,1.12,.05],[-.03,1.38,.01],[.22,1.5,0],[.36,1.36,0],[.23,1.26,0]],.105,{roughness:.22,metalness:.08});
    for(const side of [-1,1]){const w=group(b,side*.34,1.55,-.2);const top=ball(w,'#e0f4e2',side*.36,.12,0,.24,.68,.055,{transparent:true,opacity:.7,roughness:.15,side:T.DoubleSide});top.rotation.z=-side*.65;const lower=ball(w,'#e6eee1',side*.34,-.24,0,.38,.16,.055,{transparent:true,opacity:.7,side:T.DoubleSide});lower.rotation.z=side*.3;r.wings.push(w);const arm=limb(b,side*.42,1.42,.04,mint,.43,.12);arm.rotation.z=side*.65;r.arms.push(arm);}
    const flower=group(r.arms[1],.09,-.44,.05);rod(flower,'#6d9e6e',0,.15,0,.025,.5);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(flower,'#f1af43',Math.sin(a)*.15,.46+Math.cos(a)*.15,0,.10,.12,.06);}ball(flower,'#f4d985',0,.46,.06,.075);
    return r;
  }
  function shellSage() {
    const r=baseRig('soradaegam'),b=r.body;
    ball(b,'#5f6550',0,.93,0,.69,.7,.48);rod(b,'#7f6941',0,.73,0,.63,.24);rod(b,'#496f60',0,1.01,0,.65,.12);ball(b,'#257c73',0,1.01,.62,.14,.14,.06,{metalness:.3,roughness:.2});
    const head=group(b,0,1.75,.1);r.head=head;ball(head,'#ce9b5d',0,0,0,.63,.58,.48);eyes(head,.04,.43,.25,'#533b20',.17);ball(head,'#9b6537',0,-.07,.51,.105,.08,.075);
    for(const side of [-1,1]){curve(head,CREAM,[[side*.02,-.16,.5],[side*.22,-.25,.52],[side*.47,-.2,.46],[side*.54,-.07,.39],[side*.44,-.1,.42]],.085);curve(head,'#473f2c',[[side*.09,.29,.43],[side*.29,.35,.42],[side*.44,.28,.36]],.065);}
    spike(head,CREAM,0,-.42,.31,.25,.44).rotation.z=Math.PI;
    // Sculpted conical shell, each ring is real geometry.
    for(let i=0;i<6;i++){const radius=.72-i*.11,yy=.31+i*.23;rod(head,i%2?'#c08a38':'#8e632c',0,yy,-.04,radius,.27,{metalness:.55,roughness:.34});for(let j=0;j<7;j++){const a=j/7*Math.PI*2;ball(head,GOLD,Math.sin(a)*radius,yy,Math.cos(a)*radius-.04,.045,.04,.045,{metalness:.5});}}
    spike(head,GOLD,0,1.67,-.04,.12,.3);
    for(const side of [-1,1]){const leg=limb(b,side*.3,.4,0,'#bb8a4d',.2,.16);ball(leg,'#a57240',0,-.17,.14,.23,.12,.24);r.legs.push(leg);const arm=limb(b,side*.65,1.35,0,'#6d7056',.58,.23);ball(arm,'#cf9a54',0,-.56,.07,.19);r.arms.push(arm);}
    const staff=group(r.arms[0],-.05,-.4,.04);rod(staff,'#8d642e',0,.15,0,.055,1.7);rod(staff,GOLD,0,.95,0,.11,.12,{metalness:.5});const points=[];for(let i=0;i<40;i++){const t=i/39*Math.PI*4,rr=.02+.22*i/39;points.push([Math.cos(t)*rr,1.18+Math.sin(t)*rr,0]);}curve(staff,GOLD,points,.055,{metalness:.6});ball(staff,'#399885',0,.8,.03,.09);
    return r;
  }
  function stoneKing() {
    const r=baseRig('banddeukdaewang'),b=r.body;
    block(b,ROCK,0,1.03,0,1.24,1.15,.82,.18);const h=group(b,0,2.05,0);r.head=h;block(h,ROCK,0,0,0,1.37,1.22,.94,.18);
    eyes(h,-.035,.46,.3,'#322c20',.18,'#e3b44d');
    for(const side of [-1,1]){const brow=block(h,'#363d38',side*.32,.19,.52,.6,.17,.15,.035);brow.rotation.z=side*.17;const arm=limb(b,side*.73,1.49,0,ROCK,.6,.24);r.arms.push(arm);const leg=limb(b,side*.34,.48,0,ROCK,.29,.23);ball(leg,ROCK,0,-.27,.13,.29,.14,.32);r.legs.push(leg);}
    block(h,'#343c36',0,-.14,.51,.16,.16,.1,.02);block(h,'#343c36',-.17,-.3,.51,.15,.14,.1,.02);block(h,'#343c36',.17,-.3,.51,.15,.14,.1,.02);
    block(b,GOLD,0,.88,.43,1.19,.19,.12,.03,{metalness:.6});block(b,GOLD,0,.88,.52,.27,.29,.12,.035,{metalness:.5});block(b,'#74582c',0,.88,.59,.14,.16,.02,.02);
    for(let i=-5;i<=5;i++)block(b,'#644f2c',i*.095,.91,.5,.012,i%2?.07:.12,.01,.002);
    stonePits(h,0,0,.49,1.16,1.05,.1,35);stonePits(b,0,1.2,.43,1.04,.8,.1,28);
    const ruler=group(r.arms[0],-.1,-.41,.04);rod(ruler,GOLD,0,.18,0,.065,2.05,{metalness:.6});block(ruler,GOLD,0,1.18,0,.18,.95,.13,.025,{metalness:.6});block(ruler,GOLD,.3,1.57,0,.7,.18,.13,.025,{metalness:.6});for(let i=0;i<8;i++)block(ruler,'#634c24',.04,.81+i*.09,.076,.075,.015,.015,.003);
    return r;
  }
  function getRig(id){if(!rigs.has(id)){const builders={jeyukje:pig,mongdol:rockMage,sorang:fairy,soradaegam:shellSage,banddeukdaewang:stoneKing};if(!builders[id])throw Error('Unknown character');const r=builders[id]();r.root.traverse(o=>{if(o.isMesh)o.frustumCulled=false;});rigs.set(id,r);}return rigs.get(id);}
  let renderer=null,scene=null,camera=null,holder=null,failed=false,contextLost=false;
  let currentRig=null,viewAngle=.2;
  function init(){
    if(failed)return false;if(renderer)return true;
    try{
      renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});renderer.setSize(256,320,false);renderer.setPixelRatio(1);renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
      renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;});renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;});
      scene=new T.Scene();scene.add(new T.HemisphereLight('#fff2d5','#497173',2.6));const key=new T.DirectionalLight('#fff2cf',3.4);key.position.set(-3,6,7);scene.add(key);const rim=new T.DirectionalLight('#90c7d5',2.2);rim.position.set(4,3,-4);scene.add(rim);const fill=new T.DirectionalLight('#ffffff',1);fill.position.set(4,1,6);scene.add(fill);
      camera=new T.OrthographicCamera(-1.72,1.72,2.15,-2.15,.1,30);camera.position.set(4,4.3,9);camera.lookAt(0,1.7,0);holder=new T.Group();scene.add(holder);return true;
    }catch(error){failed=true;console.warn('3D renderer unavailable, keeping original portrait.',error.message);return false;}
  }
  function pose(r,time,moving,attack,reduced){
    const walk=reduced?0:Math.sin(time*11)*(moving?.55:.04);
    r.body.position.y=reduced?0:Math.sin(time*(moving?22:2.5))*(moving?.045:.025);
    r.body.rotation.z=attack?Math.sin(attack*Math.PI)*-.08:0;
    r.legs.forEach((leg,i)=>leg.rotation.x=(i%2?1:-1)*walk);
    r.arms.forEach((arm,i)=>{arm.rotation.x=(i%2?-1:1)*walk*.65;arm.rotation.z=(i?-.12:.12)+(attack?(i?-.4:1)*Math.sin(attack*Math.PI)*.7:0);});
    if(r.id==='mongdol')r.arms[0].rotation.z=.12+attack*-.9;
    if(r.id==='sorang'){r.body.position.y+=.1;r.wings.forEach((w,i)=>{w.rotation.y=(i?1:-1)*(reduced?.25:.4+Math.sin(time*7)*.25);});}
    if(r.head){r.head.rotation.x=attack?Math.sin(attack*Math.PI)*.08:0;}
  }
  function draw(context,e,time,reduced=false,options={}){
    if(!init()||contextLost)return false;
    try {
    const rig=getRig(e.classId);if(currentRig!==rig){if(currentRig)holder.remove(currentRig.root);holder.add(rig.root);currentRig=rig;}
    const attack=e.atkCooldown>e.atkInterval-.35?Math.max(0,(e.atkInterval-e.atkCooldown)/.35):0;
    const desired=e.facing??.2;rig.root.rotation.y=options.angle??(desired+viewAngle);pose(rig,time,e.moving,options.preview?0:attack,reduced);renderer.render(scene,camera);
    const width=options.width||104,height=width*1.25,x=options.x??e.x,y=options.y??e.y+23;context.drawImage(renderer.domElement,x-width/2,y-height,width,height);return true;
    } catch(error) { failed=true;console.warn('3D drawing unavailable; using original portrait.',error.message);return false; }
  }
  window.TamnaCharacters3D={draw,ready:init,rotate(delta){viewAngle+=delta;},get available(){return !!renderer&&!failed&&!contextLost;},get diagnostics(){return {available:this.available,characters:[...rigs.keys()],meshes:renderer?.info.render.calls||0,geometries:renderer?.info.memory.geometries||0};}};
})();
