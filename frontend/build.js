const fs = require('fs');
const path = require('path');
const dir = __dirname;

// ════════════════════════════════════════════════════
//  REGISTER.HTML
// ════════════════════════════════════════════════════
const register = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Kodbank — Create Account</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#040611;--surface:rgba(255,255,255,0.04);--border:rgba(255,255,255,0.08);
--border-f:rgba(99,102,241,.6);--a:#6366f1;--a2:#8b5cf6;--text:#f1f5f9;
--muted:#64748b;--sub:#94a3b8;--danger:#f87171;--success:#34d399}
html,body{height:100%;overflow:hidden}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);display:flex}
/* LEFT */
.left{width:48%;background:linear-gradient(145deg,#06091a,#0d1135 50%,#10123d);
  position:relative;overflow:hidden;display:flex;flex-direction:column;
  justify-content:center;padding:60px 56px;flex-shrink:0}
.left::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 30% 60%,rgba(99,102,241,.22) 0%,transparent 60%),
             radial-gradient(ellipse at 80% 10%,rgba(139,92,246,.14) 0%,transparent 50%)}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),
  linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);
  background-size:40px 40px}
.orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
.o1{width:380px;height:380px;background:rgba(99,102,241,.16);top:-90px;right:-60px;animation:drift 8s ease-in-out infinite}
.o2{width:280px;height:280px;background:rgba(168,85,247,.12);bottom:-60px;left:30px;animation:drift 10s ease-in-out infinite reverse}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-26px)}}
.lc{position:relative;z-index:2}
.logo{display:flex;align-items:center;gap:14px;margin-bottom:52px}
.li{width:50px;height:50px;border-radius:15px;
  background:linear-gradient(135deg,var(--a),var(--a2));
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:22px;color:#fff;
  box-shadow:0 8px 28px rgba(99,102,241,.5)}
.ln{font-size:24px;font-weight:800;background:linear-gradient(90deg,#a5b4fc,#c4b5fd);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hh{font-size:40px;font-weight:900;line-height:1.15;margin-bottom:18px;letter-spacing:-1px}
.hh span{background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hs{font-size:15px;color:var(--sub);line-height:1.7;max-width:380px;margin-bottom:44px}
.feats{display:flex;flex-direction:column;gap:16px}
.feat{display:flex;align-items:center;gap:14px}
.fi{width:40px;height:40px;border-radius:10px;flex-shrink:0;
  background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.25);
  display:flex;align-items:center;justify-content:center;font-size:17px}
.ft strong{display:block;font-size:13px;font-weight:600}
.ft span{font-size:12px;color:var(--muted)}
/* floating card */
.fc{position:absolute;bottom:44px;right:36px;width:230px;height:136px;border-radius:18px;
  background:linear-gradient(135deg,rgba(99,102,241,.3),rgba(168,85,247,.2));
  border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(12px);
  padding:18px;display:flex;flex-direction:column;justify-content:space-between;
  box-shadow:0 20px 60px rgba(0,0,0,.4);animation:float 4s ease-in-out infinite;z-index:3}
@keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(-1deg)}}
.fc-chip{width:30px;height:22px;border-radius:4px;background:linear-gradient(135deg,#fbbf24,#f59e0b)}
.fc-num{font-size:11px;letter-spacing:3px;color:rgba(255,255,255,.65);font-family:monospace}
.fc-meta{display:flex;justify-content:space-between;align-items:flex-end}
.fcml{font-size:8px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.8px}
.fcmv{font-size:11px;color:rgba(255,255,255,.8);font-weight:600}
/* RIGHT */
.right{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center;padding:36px 52px;background:var(--bg)}
.right::-webkit-scrollbar{width:4px}
.right::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:2px}
.fb{width:100%;max-width:460px;animation:sr .5s ease both}
@keyframes sr{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.fh{margin-bottom:32px}
.fh h2{font-size:27px;font-weight:800;letter-spacing:-.5px;margin-bottom:6px}
.fh p{font-size:13px;color:var(--muted)}
.fh a{color:var(--a);text-decoration:none;font-weight:600}
.fh a:hover{text-decoration:underline}
/* floating label inputs */
.field{position:relative;margin-bottom:18px}
.field input,.field select{
  width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);
  border-radius:12px;padding:20px 16px 8px;color:var(--text);font-size:14px;
  font-family:'Inter',sans-serif;outline:none;
  transition:border-color .25s,box-shadow .25s,background .25s;-webkit-appearance:none}
.field select option{background:#0d1135}
.field label{position:absolute;left:16px;top:50%;transform:translateY(-50%);
  font-size:14px;color:var(--muted);pointer-events:none;transition:all .2s}
.field input:focus,.field input:not(:placeholder-shown),
.field select:focus,.field select:valid{
  border-color:var(--border-f);background:rgba(99,102,241,.04);
  box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.field input:focus~label,.field input:not(:placeholder-shown)~label,
.field select:focus~label,.field select:valid~label{
  top:12px;transform:translateY(0) scale(.78);color:var(--a)}
.err{font-size:11px;color:var(--danger);margin-top:4px;padding-left:2px;display:none}
.err.show{display:block}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
/* pw strength */
.pws{display:flex;gap:4px;margin-top:5px}
.pwb{height:3px;flex:1;border-radius:2px;background:rgba(255,255,255,.08);transition:background .3s}
.pwl{font-size:10px;color:var(--muted);margin-top:3px}
.btn-s{width:100%;margin-top:8px;padding:15px;border:none;border-radius:12px;
  background:linear-gradient(135deg,var(--a),var(--a2));
  font-size:15px;font-weight:700;color:#fff;cursor:pointer;
  box-shadow:0 6px 28px rgba(99,102,241,.45);
  transition:transform .2s,box-shadow .2s,opacity .2s;position:relative;overflow:hidden}
.btn-s::after{content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);opacity:0;transition:opacity .2s}
.btn-s:hover::after{opacity:1}
.btn-s:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 36px rgba(99,102,241,.6)}
.btn-s:active:not(:disabled){transform:scale(.98)}
.btn-s:disabled{opacity:.55;cursor:not-allowed}
.policy{font-size:11px;color:var(--muted);text-align:center;margin-top:14px;line-height:1.6}
.policy a{color:var(--a);text-decoration:none}
.alert{padding:12px 15px;border-radius:10px;font-size:13px;margin-bottom:18px;display:none;align-items:center;gap:10px}
.alert.show{display:flex}
.alert.error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);color:var(--danger)}
.alert.success{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);color:var(--success)}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:860px){.left{display:none}.right{padding:28px 20px}html,body{height:auto;overflow:auto}}
</style>
</head>
<body>
<div class="left">
  <div class="grid"></div><div class="orb o1"></div><div class="orb o2"></div>
  <div class="lc">
    <div class="logo"><div class="li">K</div><span class="ln">Kodbank</span></div>
    <h1 class="hh">Banking made<br/><span>beautifully simple.</span></h1>
    <p class="hs">Join thousands of users who trust Kodbank for secure, instant, and modern digital banking — completely free.</p>
    <div class="feats">
      <div class="feat"><div class="fi">🔒</div><div class="ft"><strong>Bank-grade Security</strong><span>256-bit encryption, JWT auth, SSL</span></div></div>
      <div class="feat"><div class="fi">⚡</div><div class="ft"><strong>Instant Transfers</strong><span>Send money in seconds, zero fees</span></div></div>
      <div class="feat"><div class="fi">📊</div><div class="ft"><strong>Live Market Insights</strong><span>World Bank data &amp; financial news</span></div></div>
      <div class="feat"><div class="fi">💳</div><div class="ft"><strong>Virtual Debit Card</strong><span>Secure virtual card for online use</span></div></div>
    </div>
  </div>
  <div class="fc">
    <div class="fc-chip"></div>
    <div class="fc-num">4000 •••• •••• 8219</div>
    <div class="fc-meta">
      <div><div class="fcml">Card Holder</div><div class="fcmv">Kodbank User</div></div>
      <div><div class="fcml">Expires</div><div class="fcmv">12/28</div></div>
    </div>
  </div>
</div>
<div class="right">
  <div class="fb">
    <div class="fh"><h2>Create your account</h2><p>Already have an account? <a href="login.html">Sign in</a></p></div>
    <div id="alert" class="alert"></div>
    <form id="regForm" novalidate>
      <div class="row2">
        <div class="field">
          <input type="text" id="username" placeholder=" " autocomplete="username"/>
          <label for="username">Username</label>
          <div class="err" id="err-username"></div>
        </div>
        <div class="field">
          <input type="tel" id="phone" placeholder=" " autocomplete="tel"/>
          <label for="phone">Phone</label>
          <div class="err" id="err-phone"></div>
        </div>
      </div>
      <div class="field">
        <input type="email" id="email" placeholder=" " autocomplete="email"/>
        <label for="email">Email address</label>
        <div class="err" id="err-email"></div>
      </div>
      <div class="field">
        <input type="password" id="password" placeholder=" " autocomplete="new-password"/>
        <label for="password">Password</label>
        <div class="pws" id="pws"><div class="pwb" id="pb1"></div><div class="pwb" id="pb2"></div><div class="pwb" id="pb3"></div><div class="pwb" id="pb4"></div></div>
        <div class="pwl" id="pwl"></div>
        <div class="err" id="err-password"></div>
      </div>
      <div class="field">
        <input type="password" id="cpw" placeholder=" " autocomplete="new-password"/>
        <label for="cpw">Confirm password</label>
        <div class="err" id="err-cpw"></div>
      </div>
      <button type="submit" class="btn-s" id="submitBtn">Create Account</button>
    </form>
    <p class="policy">By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
  </div>
</div>
<script>
const API='http://localhost:5000/api';
const form=document.getElementById('regForm');
const alert$=document.getElementById('alert');
const submitBtn=document.getElementById('submitBtn');
document.getElementById('password').addEventListener('input',function(){
  const v=this.value;let s=0;
  if(v.length>=8)s++;if(/[A-Z]/.test(v))s++;if(/[0-9]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;
  const c=['','#f87171','#fbbf24','#34d399','#818cf8'];const lb=['','Weak','Fair','Good','Strong'];
  [1,2,3,4].forEach(i=>{const b=document.getElementById('pb'+i);b.style.background=i<=s?c[s]:'rgba(255,255,255,.08)';});
  const pl=document.getElementById('pwl');pl.textContent=s>0?lb[s]:'';pl.style.color=c[s];
});
function se(id,msg){const e=document.getElementById('err-'+id);e.textContent=msg;e.classList[msg?'add':'remove']('show');}
function cl(){['username','email','phone','password','cpw'].forEach(id=>se(id,''));alert$.className='alert';}
function validate(d){let ok=true;
  if(!d.username||!/^[a-zA-Z0-9_]{3,80}$/.test(d.username)){se('username','3-80 chars: letters, numbers, underscores');ok=false;}
  if(!d.email||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(d.email)){se('email','Enter a valid email');ok=false;}
  if(!d.phone||!/^[0-9+\\-\\s]{7,25}$/.test(d.phone)){se('phone','Enter a valid phone number');ok=false;}
  if(!d.password||d.password.length<8||!/[A-Z]/.test(d.password)||!/[a-z]/.test(d.password)||!/\\d/.test(d.password)){se('password','Min 8 chars with upper, lower and digit');ok=false;}
  if(d.password!==d.cpw){se('cpw','Passwords do not match');ok=false;}
  return ok;
}
function setLoading(on){submitBtn.disabled=on;submitBtn.innerHTML=on?'<span class="spinner"></span>Creating account…':'Create Account';}
function showAlert(msg,type){alert$.innerHTML='<span>'+(type==='success'?'✓':'✕')+'</span> '+msg;alert$.className='alert '+type+' show';}
form.addEventListener('submit',async e=>{
  e.preventDefault();cl();
  const d={username:document.getElementById('username').value.trim(),email:document.getElementById('email').value.trim(),
    phone:document.getElementById('phone').value.trim(),password:document.getElementById('password').value,
    cpw:document.getElementById('cpw').value};
  if(!validate(d))return;setLoading(true);
  try{
    const res=await fetch(API+'/register',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',
      body:JSON.stringify({username:d.username,email:d.email,phone:d.phone,password:d.password,role:'customer'})});
    const body=await res.json();
    if(!res.ok)showAlert(Array.isArray(body.errors)?body.errors.join(' · '):body.message,'error');
    else{showAlert(body.message+' Redirecting…','success');setTimeout(()=>location.href='login.html',2000);}
  }catch{showAlert('Network error — ensure the server is running.','error');}
  finally{setLoading(false);}
});
</script>
</body>
</html>`;

// ════════════════════════════════════════════════════
//  LOGIN.HTML
// ════════════════════════════════════════════════════
const login = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Kodbank — Sign In</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#040611;--surface:rgba(255,255,255,.04);--border:rgba(255,255,255,.08);
  --bf:rgba(99,102,241,.6);--a:#6366f1;--a2:#8b5cf6;--text:#f1f5f9;
  --muted:#64748b;--sub:#94a3b8;--danger:#f87171;--success:#34d399}
html,body{height:100%;overflow:hidden}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);display:flex}
.left{width:48%;background:linear-gradient(145deg,#06091a,#0d1135 50%,#10123d);
  position:relative;overflow:hidden;display:flex;flex-direction:column;
  justify-content:center;align-items:center;padding:60px 48px;flex-shrink:0}
.left::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 40% 50%,rgba(99,102,241,.2) 0%,transparent 60%),
             radial-gradient(ellipse at 85% 20%,rgba(139,92,246,.13) 0%,transparent 50%)}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),
  linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);background-size:40px 40px}
.orb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none}
.o1{width:350px;height:350px;background:rgba(99,102,241,.14);top:-80px;left:50%;animation:drift 7s ease-in-out infinite}
.o2{width:250px;height:250px;background:rgba(168,85,247,.11);bottom:-50px;right:20px;animation:drift 9s ease-in-out infinite reverse}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-20px)}}
.lc{position:relative;z-index:2;text-align:center}
.logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:40px}
.li{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,var(--a),var(--a2));
  display:flex;align-items:center;justify-content:center;font-weight:900;font-size:24px;color:#fff;
  box-shadow:0 8px 28px rgba(99,102,241,.5)}
.ln{font-size:26px;font-weight:800;background:linear-gradient(90deg,#a5b4fc,#c4b5fd);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hh{font-size:36px;font-weight:900;line-height:1.2;margin-bottom:14px;letter-spacing:-.8px}
.hh span{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hs{font-size:14px;color:var(--sub);line-height:1.7;max-width:320px;margin:0 auto 40px}
/* stats */
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:400px}
.sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 10px;text-align:center}
.sv{font-size:18px;font-weight:800;background:linear-gradient(135deg,#a5b4fc,#c4b5fd);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sl{font-size:10px;color:var(--muted);margin-top:2px}
/* shield */
.shield{margin:32px auto 0;width:70px;height:70px;border-radius:50%;
  background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);
  display:flex;align-items:center;justify-content:center;font-size:30px;animation:pulse 3s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.4)}50%{box-shadow:0 0 0 14px rgba(99,102,241,0)}}
.right{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center;padding:36px 52px;background:var(--bg)}
.fb{width:100%;max-width:420px;animation:sr .5s ease both}
@keyframes sr{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.fh{margin-bottom:30px}
.fh h2{font-size:26px;font-weight:800;letter-spacing:-.4px;margin-bottom:6px}
.fh p{font-size:13px;color:var(--muted)}
.fh a{color:var(--a);text-decoration:none;font-weight:600}
.fh a:hover{text-decoration:underline}
.field{position:relative;margin-bottom:18px}
.field input{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--border);
  border-radius:12px;padding:20px 16px 8px;color:var(--text);font-size:14px;
  font-family:'Inter',sans-serif;outline:none;
  transition:border-color .25s,box-shadow .25s,background .25s}
.field label{position:absolute;left:16px;top:50%;transform:translateY(-50%);
  font-size:14px;color:var(--muted);pointer-events:none;transition:all .2s}
.field input:focus,.field input:not(:placeholder-shown){
  border-color:var(--bf);background:rgba(99,102,241,.04);box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.field input:focus~label,.field input:not(:placeholder-shown)~label{
  top:12px;transform:translateY(0) scale(.78);color:var(--a)}
.err{font-size:11px;color:var(--danger);margin-top:4px;display:none}
.err.show{display:block}
.pw-row{display:flex;justify-content:flex-end;margin-top:-10px;margin-bottom:16px}
.pw-row a{font-size:12px;color:var(--muted);text-decoration:none}
.pw-row a:hover{color:var(--a)}
.btn-s{width:100%;padding:15px;border:none;border-radius:12px;
  background:linear-gradient(135deg,var(--a),var(--a2));font-size:15px;font-weight:700;
  color:#fff;cursor:pointer;box-shadow:0 6px 28px rgba(99,102,241,.45);
  transition:transform .2s,box-shadow .2s,opacity .2s;position:relative;overflow:hidden}
.btn-s::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent);opacity:0;transition:opacity .2s}
.btn-s:hover::after{opacity:1}
.btn-s:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 36px rgba(99,102,241,.6)}
.btn-s:active:not(:disabled){transform:scale(.98)}
.btn-s:disabled{opacity:.55;cursor:not-allowed}
.alert{padding:12px 15px;border-radius:10px;font-size:13px;margin-bottom:18px;display:none;align-items:center;gap:10px}
.alert.show{display:flex}
.alert.error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);color:var(--danger)}
.alert.success{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);color:var(--success)}
.sec{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:22px;font-size:11px;color:var(--muted)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--success);animation:p2 2s infinite}
@keyframes p2{0%,100%{opacity:1}50%{opacity:.3}}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);
  border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:860px){.left{display:none}.right{padding:28px 20px}html,body{height:auto;overflow:auto}}
</style>
</head>
<body>
<div class="left">
  <div class="grid"></div><div class="orb o1"></div><div class="orb o2"></div>
  <div class="lc">
    <div class="logo"><div class="li">K</div><span class="ln">Kodbank</span></div>
    <h1 class="hh">Your money,<br/><span>your control.</span></h1>
    <p class="hs">Secure digital banking with real-time insights, instant transfers, and full financial visibility.</p>
    <div class="stats">
      <div class="sc"><div class="sv">256-bit</div><div class="sl">Encryption</div></div>
      <div class="sc"><div class="sv">0s</div><div class="sl">Transfer Delay</div></div>
      <div class="sc"><div class="sv">24/7</div><div class="sl">Uptime</div></div>
    </div>
    <div class="shield">🛡️</div>
  </div>
</div>
<div class="right">
  <div class="fb">
    <div class="fh"><h2>Welcome back</h2><p>New to Kodbank? <a href="register.html">Create an account</a></p></div>
    <div id="alert" class="alert"></div>
    <form id="loginForm" novalidate>
      <div class="field">
        <input type="text" id="username" placeholder=" " autocomplete="username"/>
        <label for="username">Username</label>
        <div class="err" id="err-username"></div>
      </div>
      <div class="field">
        <input type="password" id="password" placeholder=" " autocomplete="current-password"/>
        <label for="password">Password</label>
        <div class="err" id="err-password"></div>
      </div>
      <div class="pw-row"><a href="#">Forgot password?</a></div>
      <button type="submit" class="btn-s" id="submitBtn">Sign In</button>
    </form>
    <div class="sec"><span class="dot"></span>Protected with encrypted session &middot; SSL secured</div>
  </div>
</div>
<script>
const API='http://localhost:5000/api';
const form=document.getElementById('loginForm');
const alert$=document.getElementById('alert');
const submitBtn=document.getElementById('submitBtn');
function showAlert(msg,type){alert$.innerHTML='<span>'+(type==='success'?'✓':'✕')+'</span> '+msg;alert$.className='alert '+type+' show';}
function se(id,msg){const e=document.getElementById('err-'+id);if(e){e.textContent=msg;e.classList[msg?'add':'remove']('show');}}
function cl(){['username','password'].forEach(id=>se(id,''));alert$.className='alert';}
function setLoading(on){submitBtn.disabled=on;submitBtn.innerHTML=on?'<span class="spinner"></span>Signing in…':'Sign In';}
form.addEventListener('submit',async e=>{
  e.preventDefault();cl();
  const username=document.getElementById('username').value.trim();
  const password=document.getElementById('password').value;
  let ok=true;
  if(!username){se('username','Username is required');ok=false;}
  if(!password){se('password','Password is required');ok=false;}
  if(!ok)return;setLoading(true);
  try{
    const res=await fetch(API+'/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({username,password})});
    const body=await res.json();
    if(!res.ok){const msg=Array.isArray(body.errors)?body.errors.join(' · '):body.message;showAlert(msg,'error');}
    else{showAlert('Login successful! Redirecting…','success');setTimeout(()=>location.href='dashboard.html',1200);}
  }catch{showAlert('Network error — ensure the server is running.','error');}
  finally{setLoading(false);}
});
</script>
</body>
</html>`;

// ════════════════════════════════════════════════════
//  DASHBOARD.HTML  — full sidebar multi-section app
// ════════════════════════════════════════════════════
const dashboard = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Kodbank — Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#040611;--navy:#070a1a;--s0:rgba(255,255,255,.03);--s1:rgba(255,255,255,.06);
  --bd:rgba(255,255,255,.07);--bdf:rgba(99,102,241,.55);
  --a:#6366f1;--a2:#8b5cf6;--a3:#a855f7;
  --text:#f1f5f9;--muted:#64748b;--sub:#94a3b8;
  --green:#34d399;--red:#f87171;--yellow:#fbbf24;--blue:#60a5fa;
  --sb:240px;--hh:60px
}
html,body{height:100%;overflow:hidden}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);display:flex}

/* ───── SIDEBAR ───── */
.sidebar{
  width:var(--sb);height:100vh;background:var(--navy);
  border-right:1px solid var(--bd);display:flex;flex-direction:column;
  flex-shrink:0;position:relative;z-index:20
}
.sb-logo{display:flex;align-items:center;gap:11px;padding:20px 20px 18px;border-bottom:1px solid var(--bd)}
.sb-li{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--a),var(--a2));
  display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:#fff;
  box-shadow:0 4px 16px rgba(99,102,241,.45);flex-shrink:0}
.sb-ln{font-size:17px;font-weight:800;background:linear-gradient(90deg,#a5b4fc,#c4b5fd);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}
.sb-nav::-webkit-scrollbar{display:none}
.nav-item{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;
  cursor:pointer;transition:all .2s;color:var(--muted);font-size:13.5px;font-weight:500;
  border:1px solid transparent;text-decoration:none}
.nav-item:hover{background:rgba(99,102,241,.08);color:var(--text);border-color:rgba(99,102,241,.12)}
.nav-item.active{background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(139,92,246,.12));
  color:var(--text);border-color:rgba(99,102,241,.3);font-weight:600}
.nav-icon{font-size:17px;width:22px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:var(--a);color:#fff;font-size:10px;font-weight:700;
  padding:2px 7px;border-radius:99px}
.sb-section{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;
  padding:12px 14px 4px;margin-top:6px}
.sb-bottom{padding:14px 10px;border-top:1px solid var(--bd)}
.sb-user{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;
  background:rgba(255,255,255,.03);border:1px solid var(--bd);cursor:pointer;transition:all .2s}
.sb-user:hover{background:rgba(255,255,255,.06)}
.sb-avatar{width:34px;height:34px;border-radius:10px;
  background:linear-gradient(135deg,var(--a),var(--a2));
  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;flex-shrink:0}
.sb-uname{font-size:13px;font-weight:600;color:var(--text)}
.sb-urole{font-size:10px;color:var(--muted)}
.sb-logout{margin-left:auto;font-size:16px;color:var(--muted);cursor:pointer;
  padding:4px;border-radius:6px;transition:all .2s;background:none;border:none}
.sb-logout:hover{color:var(--red);background:rgba(248,113,113,.1)}

/* ───── MAIN AREA ───── */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{
  height:var(--hh);border-bottom:1px solid var(--bd);
  background:rgba(4,6,17,.85);backdrop-filter:blur(20px);
  display:flex;align-items:center;padding:0 28px;gap:16px;flex-shrink:0
}
.topbar-title{font-size:15px;font-weight:700;flex:1}
.topbar-search{
  display:flex;align-items:center;gap:8px;background:var(--s0);
  border:1px solid var(--bd);border-radius:9px;padding:7px 13px;
  font-size:13px;color:var(--muted);cursor:text;transition:all .2s
}
.topbar-search:focus-within{border-color:var(--bdf);background:rgba(99,102,241,.04)}
.topbar-search input{background:none;border:none;outline:none;color:var(--text);font-size:13px;font-family:'Inter',sans-serif;width:140px}
.topbar-actions{display:flex;align-items:center;gap:10px}
.icon-btn{width:34px;height:34px;border-radius:9px;background:var(--s0);border:1px solid var(--bd);
  display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;
  transition:all .2s;position:relative}
.icon-btn:hover{background:var(--s1);border-color:rgba(255,255,255,.14)}
.icon-btn .badge{position:absolute;top:-3px;right:-3px;width:14px;height:14px;
  background:var(--red);border-radius:50%;border:2px solid var(--bg);
  font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center}
.content{flex:1;overflow-y:auto;padding:28px}
.content::-webkit-scrollbar{width:5px}
.content::-webkit-scrollbar-thumb{background:rgba(99,102,241,.25);border-radius:3px}

/* ───── PAGES ───── */
.page{display:none;animation:fadeUp .35s ease both}
.page.active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* ───── CARDS ───── */
.card{background:var(--s0);border:1px solid var(--bd);border-radius:16px;padding:22px}
.card-sm{padding:16px}
.card-title{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;display:flex;align-items:center;gap:6px}

/* ───── DASHBOARD PAGE ───── */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.grid23{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:16px}

.greet-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.greet-left h1{font-size:22px;font-weight:800;letter-spacing:-.4px}
.greet-left h1 span{background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.greet-left p{font-size:13px;color:var(--muted);margin-top:3px}
.greet-date{font-size:12px;color:var(--muted);text-align:right}
.greet-date strong{display:block;color:var(--text);font-size:14px;font-weight:600}

/* balance hero */
.balance-hero{
  background:linear-gradient(135deg,#0f1235,#15103d,#0a0e2a);
  border:1px solid rgba(99,102,241,.3);border-radius:20px;padding:28px;
  position:relative;overflow:hidden;margin-bottom:16px
}
.balance-hero::before{content:'';position:absolute;
  top:-60px;right:-60px;width:260px;height:260px;
  background:radial-gradient(ellipse,rgba(99,102,241,.25) 0%,transparent 70%)}
.balance-hero::after{content:'';position:absolute;
  bottom:-40px;left:30px;width:180px;height:180px;
  background:radial-gradient(ellipse,rgba(168,85,247,.18) 0%,transparent 70%)}
.bh-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;position:relative;z-index:2}
.bh-label{font-size:12px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.1em}
.bh-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--green);
  background:rgba(52,211,153,.1);padding:4px 10px;border-radius:99px;border:1px solid rgba(52,211,153,.2)}
.bh-dot{width:5px;height:5px;border-radius:50%;background:var(--green);animation:p 1.8s infinite}
@keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
.bh-amount{position:relative;z-index:2}
.bh-amount-val{font-size:46px;font-weight:900;letter-spacing:-1.5px;line-height:1;
  background:linear-gradient(135deg,#a5b4fc,#818cf8,#c4b5fd);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.bh-hidden{font-size:46px;font-weight:900;letter-spacing:8px;color:rgba(255,255,255,.3)}
.bh-name{font-size:13px;color:rgba(255,255,255,.45);margin-top:8px;position:relative;z-index:2}
.bh-actions{display:flex;gap:10px;margin-top:20px;position:relative;z-index:2}
.ba-btn{flex:1;padding:10px;border-radius:10px;border:none;cursor:pointer;font-size:12px;font-weight:600;
  display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;font-family:'Inter',sans-serif}
.ba-btn.primary{background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;
  box-shadow:0 4px 16px rgba(99,102,241,.4)}
.ba-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(99,102,241,.55)}
.ba-btn.ghost{background:rgba(255,255,255,.07);color:var(--text);border:1px solid rgba(255,255,255,.1)}
.ba-btn.ghost:hover{background:rgba(255,255,255,.11)}

/* stat cards */
.stat-card{background:var(--s0);border:1px solid var(--bd);border-radius:14px;padding:18px 16px;
  display:flex;align-items:flex-start;gap:12px}
.stat-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.stat-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em}
.stat-v{font-size:16px;font-weight:700;margin-top:3px}
.stat-change{font-size:10px;margin-top:2px}
.up{color:var(--green)}.down{color:var(--red)}.neu{color:var(--muted)}

/* quick actions */
.qa-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}
.qa-btn{background:var(--s0);border:1px solid var(--bd);border-radius:13px;padding:16px 12px;
  text-align:center;cursor:pointer;transition:all .2s}
.qa-btn:hover{background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.25);transform:translateY(-2px)}
.qa-icon{font-size:24px;margin-bottom:7px}
.qa-name{font-size:12px;font-weight:600;color:var(--text)}
.qa-desc{font-size:10px;color:var(--muted);margin-top:2px}

/* mini chart bars */
.chart-bars{display:flex;align-items:flex-end;gap:4px;height:70px;padding-top:8px}
.bar{flex:1;border-radius:4px 4px 0 0;transition:height .5s ease;cursor:pointer;position:relative}
.bar:hover::after{content:attr(data-v);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
  font-size:9px;color:var(--text);background:rgba(0,0,0,.6);padding:2px 5px;border-radius:4px;white-space:nowrap}
.bar-label{font-size:8px;color:var(--muted);text-align:center;margin-top:3px}

/* recent transactions */
.tx-list{display:flex;flex-direction:column;gap:10px;margin-top:2px}
.tx-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
  background:rgba(255,255,255,.02);border:1px solid transparent;transition:all .2s;cursor:default}
.tx-item:hover{background:rgba(255,255,255,.04);border-color:var(--bd)}
.tx-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.tx-info{flex:1;min-width:0}
.tx-desc{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tx-meta{font-size:11px;color:var(--muted);margin-top:2px}
.tx-amt{font-size:14px;font-weight:700;flex-shrink:0}
.tx-badge{font-size:9px;font-weight:600;padding:2px 7px;border-radius:99px;margin-left:6px;vertical-align:middle}
.badge-credit{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.2)}
.badge-debit{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.2)}
.badge-pending{background:rgba(251,191,36,.12);color:var(--yellow);border:1px solid rgba(251,191,36,.2)}

/* ───── TRANSFER PAGE ───── */
.transfer-wrap{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px}
.form-row{margin-bottom:16px}
.form-label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.form-input{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--bd);border-radius:11px;
  padding:12px 14px;color:var(--text);font-size:14px;font-family:'Inter',sans-serif;
  outline:none;transition:border-color .2s,box-shadow .2s}
.form-input:focus{border-color:var(--bdf);box-shadow:0 0 0 3px rgba(99,102,241,.12);background:rgba(99,102,241,.04)}
.form-input::placeholder{color:var(--muted)}
.form-input.error-field{border-color:rgba(248,113,113,.5)}
.btn-primary{width:100%;padding:13px;border:none;border-radius:11px;
  background:linear-gradient(135deg,var(--a),var(--a2));font-size:14px;font-weight:700;
  color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(99,102,241,.4);
  transition:transform .2s,box-shadow .2s;margin-top:6px;font-family:'Inter',sans-serif}
.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 28px rgba(99,102,241,.55)}
.btn-primary:disabled{opacity:.55;cursor:not-allowed}
.tf-preview{background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08));
  border:1px solid rgba(99,102,241,.2);border-radius:14px;padding:20px;margin-top:14px}
.tf-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;
  border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
.tf-row:last-child{border-bottom:none;margin-top:4px}
.tf-key{color:var(--muted)}
.tf-val{font-weight:600}
.tf-bigamt{font-size:24px;font-weight:800;
  background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.alert{padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:14px;display:none;align-items:center;gap:8px}
.alert.show{display:flex}
.alert.error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);color:var(--red)}
.alert.success{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);color:var(--green)}

/* ───── TRANSACTIONS PAGE ───── */
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.page-h1{font-size:19px;font-weight:800}
.filter-row{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.filter-btn{padding:7px 14px;border-radius:8px;border:1px solid var(--bd);background:var(--s0);
  color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
.filter-btn.active,.filter-btn:hover{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.3);color:var(--text)}
.tx-table{width:100%;border-collapse:collapse}
.tx-table th{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;
  padding:10px 14px;text-align:left;border-bottom:1px solid var(--bd)}
.tx-table td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.03);font-size:13px;vertical-align:middle}
.tx-table tr:hover td{background:rgba(255,255,255,.025)}
.tx-table tr:last-child td{border-bottom:none}
.paginator{display:flex;align-items:center;justify-content:space-between;margin-top:16px}
.page-info{font-size:12px;color:var(--muted)}
.page-btns{display:flex;gap:6px}
.page-btn{padding:6px 13px;border-radius:7px;border:1px solid var(--bd);background:var(--s0);
  color:var(--sub);font-size:12px;cursor:pointer;transition:all .2s}
.page-btn:hover:not(:disabled){background:var(--s1);color:var(--text)}
.page-btn:disabled{opacity:.4;cursor:not-allowed}

/* ───── CARDS PAGE ───── */
.vcard{
  width:340px;height:200px;border-radius:20px;padding:24px;
  background:linear-gradient(135deg,#1a1050,#2d1b69,#4c1d95);
  position:relative;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.1)
}
.vcard::before{content:'';position:absolute;top:-40px;right:-40px;
  width:200px;height:200px;border-radius:50%;
  background:radial-gradient(rgba(168,85,247,.4),transparent 70%)}
.vcard::after{content:'';position:absolute;bottom:-30px;left:-20px;
  width:160px;height:160px;border-radius:50%;
  background:radial-gradient(rgba(99,102,241,.3),transparent 70%)}
.vc-logo{display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2}
.vc-bank{font-size:14px;font-weight:800;color:rgba(255,255,255,.9);letter-spacing:.5px}
.vc-chip{width:36px;height:26px;border-radius:5px;background:linear-gradient(135deg,#fbbf24,#f59e0b)}
.vc-num{font-size:16px;letter-spacing:4px;color:rgba(255,255,255,.8);
  font-family:monospace;margin:20px 0 16px;position:relative;z-index:2}
.vc-bottom{display:flex;justify-content:space-between;position:relative;z-index:2}
.vc-field{display:flex;flex-direction:column;gap:2px}
.vc-fl{font-size:8px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.5px}
.vc-fv{font-size:13px;font-weight:600;color:rgba(255,255,255,.85)}
.vc-network{font-size:22px;font-style:italic;font-weight:900;color:rgba(255,255,255,.75)}
.card-row{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:22px}
.card-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.info-item{background:var(--s0);border:1px solid var(--bd);border-radius:12px;padding:14px}
.info-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.info-val{font-size:14px;font-weight:600}

/* ───── PROFILE PAGE ───── */
.profile-header{display:flex;align-items:center;gap:20px;margin-bottom:24px}
.profile-avatar{width:72px;height:72px;border-radius:18px;
  background:linear-gradient(135deg,var(--a),var(--a2));
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:28px;color:#fff;
  box-shadow:0 8px 28px rgba(99,102,241,.45)}
.profile-name{font-size:22px;font-weight:800}
.profile-role{font-size:12px;color:var(--muted);margin-top:3px}
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.profile-field{background:var(--s0);border:1px solid var(--bd);border-radius:12px;padding:14px}
.pf-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.pf-val{font-size:14px;font-weight:600;color:var(--text)}

/* ───── MARKET / NEWS PAGE ───── */
.market-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ticker-row{display:flex;align-items:center;gap:12px;padding:12px 14px;
  border-radius:11px;background:rgba(255,255,255,.02);border:1px solid transparent;transition:all .2s}
.ticker-row:hover{background:rgba(255,255,255,.04);border-color:var(--bd)}
.ticker-sym{font-size:13px;font-weight:700;color:var(--text);width:50px}
.ticker-name{font-size:12px;color:var(--muted);flex:1}
.ticker-price{font-size:13px;font-weight:700;text-align:right}
.ticker-chg{font-size:11px;text-align:right;margin-top:1px}
.news-item{padding:14px;border-radius:12px;background:rgba(255,255,255,.02);
  border:1px solid transparent;transition:all .2s;cursor:pointer}
.news-item:hover{background:rgba(255,255,255,.04);border-color:var(--bd)}
.news-cat{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--a)}
.news-title{font-size:13px;font-weight:600;margin:5px 0;line-height:1.4}
.news-meta{font-size:11px;color:var(--muted)}
.news-list{display:flex;flex-direction:column;gap:8px}
.spark{display:inline-flex;align-items:flex-end;gap:2px;height:28px}
.spark-bar{width:4px;border-radius:2px}
.wb-item{padding:12px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid var(--bd);margin-bottom:8px}
.wb-name{font-size:13px;font-weight:600}
.wb-meta{font-size:11px;color:var(--muted);margin-top:3px}

/* ───── MISC ───── */
.section-title{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;
  padding:3px 9px;border-radius:99px;text-transform:uppercase;letter-spacing:.06em}
.pill-green{background:rgba(52,211,153,.1);color:var(--green);border:1px solid rgba(52,211,153,.2)}
.pill-red{background:rgba(248,113,113,.1);color:var(--red);border:1px solid rgba(248,113,113,.2)}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.2);
  border-top-color:var(--a);border-radius:50%;animation:spin .65s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:32px;color:var(--muted);font-size:13px}
.divider{height:1px;background:var(--bd);margin:18px 0}
.loading-overlay{display:flex;align-items:center;justify-content:center;gap:8px;padding:28px;color:var(--muted);font-size:13px}
.mb16{margin-bottom:16px}

@media(max-width:900px){
  .sidebar{width:56px}.sidebar .sb-ln,.sidebar .nav-item span,.sidebar .sb-uname,.sidebar .sb-urole,.sidebar .sb-section,.sidebar .nav-badge{display:none}
  .sidebar .nav-item{justify-content:center;padding:10px}
  .sidebar .sb-logo{justify-content:center;padding:16px 10px}
  .transfer-wrap,.market-grid,.grid23,.grid2,.profile-grid,.card-info-grid{grid-template-columns:1fr}
  .qa-grid,.grid3{grid-template-columns:1fr 1fr}
}
</style>
</head>
<body>

<!-- SIDEBAR -->
<nav class="sidebar">
  <div class="sb-logo">
    <div class="sb-li">K</div>
    <span class="sb-ln">Kodbank</span>
  </div>
  <div class="sb-nav">
    <div class="sb-section">Main</div>
    <a class="nav-item active" data-page="dashboard" onclick="nav(this,'dashboard')">
      <span class="nav-icon">🏠</span><span>Dashboard</span>
    </a>
    <a class="nav-item" data-page="transfer" onclick="nav(this,'transfer')">
      <span class="nav-icon">↗️</span><span>Transfer</span>
    </a>
    <a class="nav-item" data-page="transactions" onclick="nav(this,'transactions')">
      <span class="nav-icon">📋</span><span>Transactions</span>
    </a>
    <div class="sb-section">Account</div>
    <a class="nav-item" data-page="cards" onclick="nav(this,'cards')">
      <span class="nav-icon">💳</span><span>My Card</span>
    </a>
    <a class="nav-item" data-page="profile" onclick="nav(this,'profile')">
      <span class="nav-icon">👤</span><span>Profile</span>
    </a>
    <div class="sb-section">Insights</div>
    <a class="nav-item" data-page="market" onclick="nav(this,'market')">
      <span class="nav-icon">📈</span><span>Market</span><span class="nav-badge">Live</span>
    </a>
  </div>
  <div class="sb-bottom">
    <div class="sb-user">
      <div class="sb-avatar" id="sbAvatar">?</div>
      <div><div class="sb-uname" id="sbName">Loading…</div><div class="sb-urole">Customer</div></div>
      <button class="sb-logout" id="logoutBtn" title="Sign out">⏻</button>
    </div>
  </div>
</nav>

<!-- MAIN -->
<div class="main">
  <div class="topbar">
    <div class="topbar-title" id="topTitle">Dashboard</div>
    <div class="topbar-search">
      <span>🔍</span>
      <input type="text" placeholder="Search transactions…" id="searchInput" oninput="searchTx()"/>
    </div>
    <div class="topbar-actions">
      <div class="icon-btn" title="Notifications">🔔<div class="badge">3</div></div>
      <div class="icon-btn" title="Settings">⚙️</div>
    </div>
  </div>

  <div class="content">

    <!-- ── DASHBOARD PAGE ── -->
    <div class="page active" id="page-dashboard">
      <div class="greet-row">
        <div class="greet-left">
          <h1>Hello, <span id="greetName">…</span> 👋</h1>
          <p>Here's your financial overview for today.</p>
        </div>
        <div class="greet-date"><strong id="dateStr"></strong><span id="timeStr"></span></div>
      </div>

      <!-- Balance Hero -->
      <div class="balance-hero">
        <div class="bh-top">
          <div>
            <div class="bh-label">Available Balance</div>
            <div id="bh-acct" style="font-size:11px;color:rgba(255,255,255,.4);margin-top:2px"></div>
          </div>
          <div class="bh-badge"><span class="bh-dot"></span>Live · Aiven MySQL</div>
        </div>
        <div class="bh-amount">
          <div class="bh-amount-val" id="balanceVal">₹ ——</div>
        </div>
        <div class="bh-name" id="balanceName"></div>
        <div class="bh-actions">
          <button class="ba-btn primary" onclick="nav(document.querySelector('[data-page=transfer]'),'transfer')">↗️ Send Money</button>
          <button class="ba-btn ghost" onclick="refreshBalance()">↻ Refresh</button>
          <button class="ba-btn ghost" onclick="toggleBalance()">👁 Hide</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid4 mb16">
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(52,211,153,.1)">💰</div>
          <div><div class="stat-l">Total Credit</div><div class="stat-v up" id="statCredit">₹ —</div><div class="stat-change up" id="statCreditCount"></div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(248,113,113,.1)">💸</div>
          <div><div class="stat-l">Total Debit</div><div class="stat-v down" id="statDebit">₹ —</div><div class="stat-change down" id="statDebitCount"></div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(251,191,36,.1)">⏳</div>
          <div><div class="stat-l">Pending</div><div class="stat-v" style="color:var(--yellow)" id="statPending">₹ —</div><div class="stat-change neu" id="statPendingCount"></div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:rgba(96,165,250,.1)">📊</div>
          <div><div class="stat-l">Transactions</div><div class="stat-v" style="color:var(--blue)" id="statCount">—</div><div class="stat-change neu">Total</div></div>
        </div>
      </div>

      <div class="grid23">
        <!-- Recent Transactions -->
        <div class="card">
          <div class="card-title">
            📋 Recent Transactions
            <a onclick="nav(document.querySelector('[data-page=transactions]'),'transactions')" style="margin-left:auto;font-size:11px;color:var(--a);cursor:pointer;text-transform:none;letter-spacing:0">View all →</a>
          </div>
          <div class="tx-list" id="recentTx"><div class="loading-overlay"><span class="spinner"></span> Loading…</div></div>
        </div>

        <!-- Mini Chart + Quick Actions -->
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="card card-sm">
            <div class="card-title">📈 Monthly Activity</div>
            <div class="chart-bars" id="chartBars"></div>
            <div style="display:flex;gap:4px" id="chartLabels"></div>
          </div>
          <div class="card card-sm">
            <div class="card-title">⚡ Quick Actions</div>
            <div class="qa-grid" style="grid-template-columns:1fr 1fr">
              <div class="qa-btn" onclick="nav(document.querySelector('[data-page=transfer]'),'transfer')"><div class="qa-icon">↗️</div><div class="qa-name">Transfer</div></div>
              <div class="qa-btn" onclick="nav(document.querySelector('[data-page=transactions]'),'transactions')"><div class="qa-icon">📋</div><div class="qa-name">History</div></div>
              <div class="qa-btn" onclick="nav(document.querySelector('[data-page=cards]'),'cards')"><div class="qa-icon">💳</div><div class="qa-name">My Card</div></div>
              <div class="qa-btn" onclick="nav(document.querySelector('[data-page=market]'),'market')"><div class="qa-icon">📈</div><div class="qa-name">Market</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TRANSFER PAGE ── -->
    <div class="page" id="page-transfer">
      <div class="page-header">
        <div class="page-h1">💸 Send Money</div>
      </div>
      <div class="transfer-wrap">
        <div class="card">
          <div id="tf-alert" class="alert"></div>
          <div class="form-row">
            <div class="form-label">Recipient Username</div>
            <input class="form-input" id="tf-recipient" type="text" placeholder="Enter username"/>
          </div>
          <div class="form-row">
            <div class="form-label">Amount (₹)</div>
            <input class="form-input" id="tf-amount" type="number" min="1" placeholder="0.00" oninput="updatePreview()"/>
          </div>
          <div class="form-row">
            <div class="form-label">Description (optional)</div>
            <input class="form-input" id="tf-desc" type="text" placeholder="e.g. Rent, Dinner split"/>
          </div>
          <div class="tf-preview" id="tf-preview" style="display:none">
            <div class="tf-row"><span class="tf-key">From</span><span class="tf-val" id="tfFrom">—</span></div>
            <div class="tf-row"><span class="tf-key">To</span><span class="tf-val" id="tfTo">—</span></div>
            <div class="tf-row"><span class="tf-key">Amount</span><span class="tf-bigamt" id="tfAmt">—</span></div>
            <div class="tf-row"><span class="tf-key">Fee</span><span class="tf-val" style="color:var(--green)">₹ 0.00</span></div>
          </div>
          <button class="btn-primary" id="tfBtn" onclick="doTransfer()">Send Money</button>
        </div>
        <div class="card">
          <div class="card-title">💡 Transfer Tips</div>
          <div style="font-size:13px;color:var(--muted);line-height:1.8">
            <p>• Double-check the recipient username — transfers are instant and irreversible.</p>
            <div class="divider"></div>
            <p>• Kodbank transfers are <strong style="color:var(--green)">free and instant</strong>.</p>
            <div class="divider"></div>
            <p>• You can view all sent transfers in the Transactions section.</p>
            <div class="divider"></div>
          </div>
          <div class="card-title" style="margin-top:16px">📊 Your Balance</div>
          <div style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#a5b4fc,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent" id="tfBalDisplay">₹ —</div>
        </div>
      </div>
    </div>

    <!-- ── TRANSACTIONS PAGE ── -->
    <div class="page" id="page-transactions">
      <div class="page-header">
        <div class="page-h1">📋 Transaction History</div>
        <div style="font-size:12px;color:var(--muted)" id="txCountLabel"></div>
      </div>
      <div class="filter-row">
        <button class="filter-btn active" onclick="filterTx('all',this)">All</button>
        <button class="filter-btn" onclick="filterTx('credit',this)">Credit</button>
        <button class="filter-btn" onclick="filterTx('debit',this)">Debit</button>
        <button class="filter-btn" onclick="filterTx('pending',this)">Pending</button>
      </div>
      <div class="card" style="overflow:auto">
        <table class="tx-table">
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Type</th><th>Recipient</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody id="txTableBody"><tr><td colspan="6"><div class="loading-overlay"><span class="spinner"></span> Loading…</div></td></tr></tbody>
        </table>
      </div>
      <div class="paginator">
        <div class="page-info" id="txPageInfo"></div>
        <div class="page-btns">
          <button class="page-btn" id="btnPrev" onclick="changePage(-1)">← Prev</button>
          <button class="page-btn" id="btnNext" onclick="changePage(1)">Next →</button>
        </div>
      </div>
    </div>

    <!-- ── CARDS PAGE ── -->
    <div class="page" id="page-cards">
      <div class="page-header"><div class="page-h1">💳 My Card</div></div>
      <div class="card-row">
        <div class="vcard">
          <div class="vc-logo">
            <div class="vc-bank">KODBANK</div>
            <div class="vc-chip"></div>
          </div>
          <div class="vc-num" id="vcNum">4000 •••• •••• 8219</div>
          <div class="vc-bottom">
            <div class="vc-field"><div class="vc-fl">Card Holder</div><div class="vc-fv" id="vcHolder">—</div></div>
            <div class="vc-field"><div class="vc-fl">Expires</div><div class="vc-fv">12/28</div></div>
            <div class="vc-network">VISA</div>
          </div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:12px">
          <div class="card">
            <div class="card-title">🔒 Card Security</div>
            <div class="card-info-grid">
              <div class="info-item"><div class="info-label">Card Type</div><div class="info-val">Virtual Debit</div></div>
              <div class="info-item"><div class="info-label">Network</div><div class="info-val">VISA</div></div>
              <div class="info-item"><div class="info-label">Status</div><div class="info-val" style="color:var(--green)">● Active</div></div>
              <div class="info-item"><div class="info-label">3D Secure</div><div class="info-val" style="color:var(--green)">Enabled</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mt16">
        <div class="card-title">📊 Card Spending Summary</div>
        <div class="card-info-grid">
          <div class="info-item"><div class="info-label">Total Spent (Debit)</div><div class="info-val down" id="cardDebit">₹ —</div></div>
          <div class="info-item"><div class="info-label">Total Received (Credit)</div><div class="info-val up" id="cardCredit">₹ —</div></div>
          <div class="info-item"><div class="info-label">Transactions</div><div class="info-val" id="cardTxCount">—</div></div>
          <div class="info-item"><div class="info-label">Member Since</div><div class="info-val" id="cardSince">—</div></div>
        </div>
      </div>
    </div>

    <!-- ── PROFILE PAGE ── -->
    <div class="page" id="page-profile">
      <div class="page-header"><div class="page-h1">👤 My Profile</div></div>
      <div class="card mb16">
        <div class="profile-header">
          <div class="profile-avatar" id="profAvatar">?</div>
          <div>
            <div class="profile-name" id="profName">—</div>
            <div class="profile-role" id="profRole">Customer</div>
          </div>
          <div style="margin-left:auto"><span class="pill pill-green">✓ Verified</span></div>
        </div>
        <div class="profile-grid">
          <div class="profile-field"><div class="pf-label">Username</div><div class="pf-val" id="profUsername">—</div></div>
          <div class="profile-field"><div class="pf-label">Email</div><div class="pf-val" id="profEmail">—</div></div>
          <div class="profile-field"><div class="pf-label">Phone</div><div class="pf-val" id="profPhone">—</div></div>
          <div class="profile-field"><div class="pf-label">Role</div><div class="pf-val" id="profRole2">—</div></div>
          <div class="profile-field"><div class="pf-label">Member Since</div><div class="pf-val" id="profSince">—</div></div>
          <div class="profile-field"><div class="pf-label">Balance</div><div class="pf-val up" id="profBalance">—</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">🔒 Security</div>
        <div class="card-info-grid">
          <div class="info-item"><div class="info-label">Password</div><div class="info-val">••••••••</div></div>
          <div class="info-item"><div class="info-label">Session</div><div class="info-val" style="color:var(--green)">● Active JWT</div></div>
          <div class="info-item"><div class="info-label">Encryption</div><div class="info-val">256-bit SSL</div></div>
          <div class="info-item"><div class="info-label">2FA</div><div class="info-val" style="color:var(--yellow)">Coming Soon</div></div>
        </div>
      </div>
    </div>

    <!-- ── MARKET PAGE ── -->
    <div class="page" id="page-market">
      <div class="page-header"><div class="page-h1">📈 Market & Insights</div></div>
      <div class="market-grid">
        <!-- Left: financial news -->
        <div>
          <div class="section-title">📰 Financial News <span class="pill pill-green" style="margin-left:8px">Live</span></div>
          <div class="news-list" id="newsList"><div class="loading-overlay"><span class="spinner"></span></div></div>
        </div>
        <!-- Right: World Bank indicators -->
        <div>
          <div class="section-title">🌍 World Bank Indicators</div>
          <div id="wbList"><div class="loading-overlay"><span class="spinner"></span></div></div>
          <div class="divider"></div>
          <div class="section-title">💹 Live Tickers</div>
          <div style="display:flex;flex-direction:column;gap:6px" id="tickerList"></div>
        </div>
      </div>
    </div>

  </div><!-- /content -->
</div><!-- /main -->

<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
<script>
const API = 'http://localhost:5000/api';
const RAPIDAPI_KEY = '64d0e30511mshddf7bf026355b07p186714jsnc4c7e90848e4';

// ─── State ───────────────────────────────────────────────────────────────────
let currentUser = null;
let allTx = [];
let filteredTx = [];
let txPage = 0;
const TX_PER_PAGE = 10;
let balHidden = false;
let balanceValue = 0;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inr = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n);
const fmt  = d => new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
function $(id){return document.getElementById(id)}

// ─── Navigation ──────────────────────────────────────────────────────────────
const titles = {dashboard:'Dashboard',transfer:'Send Money',transactions:'Transaction History',cards:'My Card',profile:'Profile',market:'Market & Insights'};
function nav(el, page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  $('page-'+page).classList.add('active');
  if(el) el.classList.add('active');
  $('topTitle').textContent = titles[page]||page;
  if(page==='transactions') renderTxTable();
  if(page==='profile') loadProfile();
  if(page==='market') loadMarket();
  if(page==='cards') renderCard();
}

// ─── Clock ───────────────────────────────────────────────────────────────────
function updateClock(){
  const now=new Date();
  $('dateStr').textContent=now.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
  $('timeStr').textContent=now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
}
setInterval(updateClock,1000); updateClock();

// ─── Session bootstrap ───────────────────────────────────────────────────────
async function bootstrap(){
  try{
    const res=await fetch(API+'/balance',{credentials:'include'});
    if(res.status===401){location.href='login.html';return;}
    const b=await res.json();
    if(b.success){
      const {username,balance}=b.data;
      currentUser={username,balance};
      balanceValue=parseFloat(balance||0);
      // Update UI
      const initials=username[0].toUpperCase();
      $('sbAvatar').textContent=initials;
      $('sbName').textContent=username;
      $('greetName').textContent=username;
      $('balanceVal').textContent=inr(balanceValue);
      $('balanceName').textContent='@'+username;
      $('bh-acct').textContent='AC'+String(Math.abs(username.charCodeAt(0)*3847+9127)).padStart(10,'0').slice(0,10);
      $('tfBalDisplay').textContent=inr(balanceValue);
      $('tfFrom').textContent=username;
    }
    loadTransactions();
  }catch{location.href='login.html';}
}

function refreshBalance(){
  fetch(API+'/balance',{credentials:'include'}).then(r=>r.json()).then(b=>{
    if(b.success){balanceValue=parseFloat(b.data.balance);if(!balHidden)$('balanceVal').textContent=inr(balanceValue);$('tfBalDisplay').textContent=inr(balanceValue);}
  });
}
function toggleBalance(){
  balHidden=!balHidden;
  $('balanceVal').textContent=balHidden?'₹ ••••••':inr(balanceValue);
}

// ─── Load Transactions ───────────────────────────────────────────────────────
async function loadTransactions(){
  try{
    const res=await fetch(API+'/transactions?limit=100&offset=0',{credentials:'include'});
    const b=await res.json();
    allTx=(b.success&&b.data&&b.data.transactions)?b.data.transactions:getMockTx();
  }catch{allTx=getMockTx();}
  computeStats();
  renderRecentTx();
  filteredTx=[...allTx];
  updateChart();
}

function getMockTx(){
  const names=['Alice','Bob','Charlie','Diana','Eve','Frank'];
  const descs=['Salary Credit','Online Shopping','Rent Payment','Food Delivery','Subscription','Transfer'];
  const types=['credit','debit'];
  return Array.from({length:20},(_,i)=>({
    txid:i+1,type:i%3===0?'credit':'debit',
    amount:(Math.random()*9000+500).toFixed(2),
    description:descs[i%descs.length],
    recipient:names[i%names.length],
    status:i%8===0?'pending':'completed',
    created_at:new Date(Date.now()-i*86400000*2).toISOString()
  }));
}

function computeStats(){
  let credit=0,debit=0,pending=0,cc=0,dc=0,pc=0;
  allTx.forEach(t=>{
    const a=parseFloat(t.amount);
    if(t.status==='pending'){pending+=a;pc++;}
    else if(t.type==='credit'){credit+=a;cc++;}
    else{debit+=a;dc++;}
  });
  $('statCredit').textContent=inr(credit);
  $('statCreditCount').textContent=cc+' transactions';
  $('statDebit').textContent=inr(debit);
  $('statDebitCount').textContent=dc+' transactions';
  $('statPending').textContent=inr(pending);
  $('statPendingCount').textContent=pc+' pending';
  $('statCount').textContent=allTx.length;
  $('txCountLabel').textContent=allTx.length+' records';
  $('cardDebit').textContent=inr(debit);
  $('cardCredit').textContent=inr(credit);
  $('cardTxCount').textContent=allTx.length;
}

function renderRecentTx(){
  const el=$('recentTx');
  const recent=allTx.slice(0,6);
  if(!recent.length){el.innerHTML='<div class="empty">No transactions yet.</div>';return;}
  el.innerHTML=recent.map(t=>txItem(t)).join('');
}

function txItem(t){
  const isCredit=t.type==='credit';
  const isPending=t.status==='pending';
  const icon=isCredit?'💰':'💸';
  const amtCls=isCredit?'up':'down';
  const sign=isCredit?'+':'-';
  const badge=isPending
    ?'<span class="tx-badge badge-pending">Pending</span>'
    :isCredit?'<span class="tx-badge badge-credit">Credit</span>'
    :'<span class="tx-badge badge-debit">Debit</span>';
  const iconBg=isCredit?'rgba(52,211,153,.1)':isPending?'rgba(251,191,36,.1)':'rgba(248,113,113,.1)';
  return \`<div class="tx-item">
    <div class="tx-icon" style="background:\${iconBg}">\${icon}</div>
    <div class="tx-info">
      <div class="tx-desc">\${t.description||'Transfer'} \${badge}</div>
      <div class="tx-meta">\${fmt(t.created_at)} · \${t.recipient||'—'}</div>
    </div>
    <div class="tx-amt \${amtCls}">\${sign}\${inr(t.amount)}</div>
  </div>\`;
}

function updateChart(){
  const bars=$('chartBars');const labels=$('chartLabels');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul'];
  const vals=months.map(()=>Math.floor(Math.random()*80+20));
  const max=Math.max(...vals);
  bars.innerHTML=vals.map((v,i)=>\`<div class="bar" style="height:\${(v/max)*64}px;background:linear-gradient(180deg,var(--a),var(--a2))" data-v="₹\${v*100}"></div>\`).join('');
  labels.innerHTML=months.map(m=>\`<div class="bar-label" style="flex:1">\${m}</div>\`).join('');
}

// ─── Transactions Table ───────────────────────────────────────────────────────
let txFilter='all';
function filterTx(f,btn){
  txFilter=f;txPage=0;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTxTable();
}
function searchTx(){
  const q=$('searchInput').value.toLowerCase();
  filteredTx=allTx.filter(t=>(t.description||'').toLowerCase().includes(q)||(t.recipient||'').toLowerCase().includes(q));
  txPage=0;renderTxTable();
}
function renderTxTable(){
  let data=filteredTx.length?filteredTx:[...allTx];
  if(txFilter!=='all')data=data.filter(t=>txFilter==='pending'?t.status==='pending':t.type===txFilter);
  const total=data.length;const start=txPage*TX_PER_PAGE;const slice=data.slice(start,start+TX_PER_PAGE);
  $('txPageInfo').textContent='Showing '+(start+1)+'-'+Math.min(start+TX_PER_PAGE,total)+' of '+total;
  $('btnPrev').disabled=txPage===0;$('btnNext').disabled=start+TX_PER_PAGE>=total;
  if(!slice.length){$('txTableBody').innerHTML='<tr><td colspan="6"><div class="empty">No transactions found.</div></td></tr>';return;}
  $('txTableBody').innerHTML=slice.map(t=>{
    const isC=t.type==='credit';
    const badge=t.status==='pending'
      ?'<span class="tx-badge badge-pending">Pending</span>'
      :isC?'<span class="tx-badge badge-credit">Credit</span>'
      :'<span class="tx-badge badge-debit">Debit</span>';
    return \`<tr>
      <td style="color:var(--muted)">\${fmt(t.created_at)}</td>
      <td style="font-weight:600">\${t.description||'—'}</td>
      <td>\${badge}</td>
      <td style="color:var(--sub)">\${t.recipient||'—'}</td>
      <td class="\${isC?'up':'down'}" style="font-weight:700">\${isC?'+':'-'}\${inr(t.amount)}</td>
      <td>\${t.status==='completed'?'<span style="color:var(--green)">✓ Done</span>':'<span style="color:var(--yellow)">⏳ Pending</span>'}</td>
    </tr>\`;
  }).join('');
}
function changePage(dir){txPage+=dir;renderTxTable();}

// ─── Transfer ─────────────────────────────────────────────────────────────────
function updatePreview(){
  const r=$('tf-recipient').value.trim();const a=$('tf-amount').value;
  if(r&&a>0){
    $('tf-preview').style.display='block';
    $('tfTo').textContent=r;$('tfAmt').textContent=inr(a);
  } else{$('tf-preview').style.display='none';}
}
async function doTransfer(){
  const recipient=$('tf-recipient').value.trim();
  const amount=parseFloat($('tf-amount').value);
  const description=$('tf-desc').value.trim();
  const alertEl=$('tf-alert');
  alertEl.className='alert';
  if(!recipient){showTfAlert('Enter a recipient username.','error');return;}
  if(!amount||amount<=0){showTfAlert('Enter a valid amount.','error');return;}
  if(amount>balanceValue){showTfAlert('Insufficient balance.','error');return;}
  $('tfBtn').disabled=true;$('tfBtn').textContent='Sending…';
  try{
    const res=await fetch(API+'/transfer',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',
      body:JSON.stringify({recipient,amount,description})});
    const b=await res.json();
    if(!res.ok){showTfAlert(b.message||'Transfer failed.','error');}
    else{
      showTfAlert('Transfer successful!','success');
      balanceValue-=amount;$('balanceVal').textContent=inr(balanceValue);$('tfBalDisplay').textContent=inr(balanceValue);
      $('tf-recipient').value='';$('tf-amount').value='';$('tf-desc').value='';$('tf-preview').style.display='none';
      confetti({particleCount:80,spread:60,origin:{y:0.6},colors:['#818cf8','#a78bfa','#34d399']});
      loadTransactions();
    }
  }catch{showTfAlert('Network error.','error');}
  finally{$('tfBtn').disabled=false;$('tfBtn').textContent='Send Money';}
}
function showTfAlert(msg,type){const el=$('tf-alert');el.innerHTML='<span>'+(type==='success'?'✓':'✕')+'</span> '+msg;el.className='alert '+type+' show';}

// ─── Profile ──────────────────────────────────────────────────────────────────
async function loadProfile(){
  try{
    const res=await fetch(API+'/profile',{credentials:'include'});
    const b=await res.json();
    const d=(b.success&&b.data)?b.data:(currentUser||{username:'—'});
    setProfile(d);
  }catch{if(currentUser)setProfile({...currentUser,email:'—',phone:'—',role:'customer',created_at:new Date().toISOString()});}
}
function setProfile(d){
  const initials=(d.username||'?')[0].toUpperCase();
  $('profAvatar').textContent=initials;
  $('profName').textContent=d.username||'—';
  $('profUsername').textContent='@'+(d.username||'—');
  $('profEmail').textContent=d.email||'—';
  $('profPhone').textContent=d.phone||'—';
  $('profRole').textContent=d.role||'customer';
  $('profRole2').textContent=d.role||'customer';
  $('profSince').textContent=d.created_at?fmt(d.created_at):'—';
  $('profBalance').textContent=inr(balanceValue);
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function renderCard(){
  if(currentUser){
    $('vcHolder').textContent=(currentUser.username||'—').toUpperCase();
    const uid=currentUser.username.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    $('vcNum').textContent='4000 '+String(uid*37%9999+1000).slice(0,4)+' '+String(uid*13%9999+2000).slice(0,4)+' 8219';
    const since=allTx.length?fmt(allTx[allTx.length-1].created_at):'2025';
    $('cardSince').textContent=since;
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────
$('logoutBtn').addEventListener('click',async()=>{
  try{await fetch(API+'/logout',{method:'POST',credentials:'include'});}catch{}
  location.href='login.html';
});

// ─── MARKET PAGE ─────────────────────────────────────────────────────────────

// Mock financial news (Morningstar-style)
const MOCK_NEWS=[
  {category:'Banking',title:'RBI holds repo rate steady at 6.5% amid inflation concerns',source:'Financial Express',time:'2h ago',url:'#'},
  {category:'Markets',title:'Sensex rallies 400 points; IT and banking stocks lead gains',source:'ET Markets',time:'3h ago',url:'#'},
  {category:'Crypto',title:'Bitcoin crosses $98,000 as institutional demand surges',source:'CoinDesk',time:'5h ago',url:'#'},
  {category:'Global',title:'Fed signals two rate cuts possible in 2026 amid cooling jobs data',source:'Reuters',time:'6h ago',url:'#'},
  {category:'Fintech',title:'UPI transactions hit record 16 billion in January 2026',source:'NPCI',time:'1d ago',url:'#'},
  {category:'IPO',title:'Kodbank-style digital banks dominate Q4 FY26 earnings season',source:'Bloomberg',time:'1d ago',url:'#'},
];

// Mock World Bank datasets
const MOCK_WB=[
  {name:'World Development Indicators',description:'GDP, population, poverty & trade — 217 economies',update:'Jan 2026',entries:'1600+'},
  {name:'Global Financial Inclusion (Findex)',description:'Access to financial services across developing nations',update:'Dec 2025',entries:'148'},
  {name:'International Debt Statistics',description:'External debt of low & middle-income countries',update:'Feb 2026',entries:'209'},
  {name:'Doing Business Indicators',description:'Ease of business metrics across 190 economies',update:'Nov 2025',entries:'190'},
];

// Mock tickers
const MOCK_TICKERS=[
  {sym:'NIFTY',name:'Nifty 50',price:'22,847.50',chg:'+1.32%',up:true},
  {sym:'SENSEX',name:'BSE Sensex',price:'75,412.10',chg:'+1.18%',up:true},
  {sym:'USDINR',name:'USD/INR',price:'84.23',chg:'-0.12%',up:false},
  {sym:'GOLD',name:'Gold (MCX)',price:'₹82,450',chg:'+0.45%',up:true},
  {sym:'NIFTYIT',name:'Nifty IT',price:'37,241',chg:'-0.67%',up:false},
  {sym:'BTC',name:'Bitcoin',price:'$98,120',chg:'+2.14%',up:true},
];

async function loadMarket(){
  // Render mock immediately for instant load
  renderNews(MOCK_NEWS);
  renderWB(MOCK_WB);
  renderTickers(MOCK_TICKERS);
  // Try real APIs (browser has better chance of bypassing Cloudflare)
  tryWorldBankAPI();
  tryMorningStarAPI();
}

async function tryWorldBankAPI(){
  try{
    const r=await fetch('https://community-worldbank.p.rapidapi.com/datacatalog?format=json',{
      headers:{'x-rapidapi-host':'community-worldbank.p.rapidapi.com','x-rapidapi-key':RAPIDAPI_KEY}
    });
    if(!r.ok)return;
    const data=await r.json();
    const items=Array.isArray(data)?data.slice(0,4):(data.datacatalog||[]).slice(0,4);
    if(items.length){
      renderWB(items.map(it=>({
        name:it.name||it.title||'Dataset',
        description:it.description||it.desc||'World Bank open dataset',
        update:it.lastupdated||it.last_update||'2026',
        entries:it.numberofrecords||it.records||'—'
      })));
    }
  }catch{}
}

async function tryMorningStarAPI(){
  try{
    const r=await fetch('https://morning-star.p.rapidapi.com/articles/get-details',{
      headers:{'x-rapidapi-host':'morning-star.p.rapidapi.com','x-rapidapi-key':RAPIDAPI_KEY}
    });
    if(!r.ok)return;
    const data=await r.json();
    const articles=Array.isArray(data)?data:(data.articles||data.data||[]);
    if(articles.length){
      renderNews(articles.slice(0,6).map(a=>({
        category:a.sectorName||a.category||'Finance',
        title:a.title||a.headline||a.name||'Article',
        source:a.source||a.author||'Morningstar',
        time:a.publishDate?new Date(a.publishDate).toLocaleDateString():'',
        url:a.url||'#'
      })));
    }
  }catch{}
}

function renderNews(items){
  $('newsList').innerHTML=items.map(n=>\`
    <div class="news-item" onclick="window.open('\${n.url}','_blank')">
      <div class="news-cat">\${n.category}</div>
      <div class="news-title">\${n.title}</div>
      <div class="news-meta">\${n.source} · \${n.time}</div>
    </div>\`).join('');
}
function renderWB(items){
  $('wbList').innerHTML=items.map(d=>\`
    <div class="wb-item">
      <div class="wb-name">\${d.name}</div>
      <div class="wb-meta">\${d.description}</div>
      <div style="display:flex;gap:12px;margin-top:6px;font-size:10px;color:var(--muted)">
        <span>Updated: \${d.update||'—'}</span>
        <span>Records: \${d.entries||'—'}</span>
      </div>
    </div>\`).join('');
}
function renderTickers(tickers){
  $('tickerList').innerHTML=tickers.map(t=>\`
    <div class="ticker-row">
      <div class="ticker-sym">\${t.sym}</div>
      <div class="ticker-name">\${t.name}</div>
      <div>
        <div class="ticker-price">\${t.price}</div>
        <div class="ticker-chg \${t.up?'up':'down'}">\${t.chg}</div>
      </div>
    </div>\`).join('');
  // animate tickers every 4s
  setInterval(()=>{
    document.querySelectorAll('.ticker-chg').forEach(el=>{
      const delta=(Math.random()*0.1-0.05).toFixed(2);
      const up=parseFloat(delta)>=0;
      el.textContent=(up?'+':'')+delta+'%';
      el.className='ticker-chg '+(up?'up':'down');
    });
  },4000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
bootstrap();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(dir,'register.html'), register, 'utf-8');
fs.writeFileSync(path.join(dir,'login.html'), login, 'utf-8');
fs.writeFileSync(path.join(dir,'dashboard.html'), dashboard, 'utf-8');
console.log('✅ All pages written successfully');
console.log('  register.html:', fs.statSync(path.join(dir,'register.html')).size, 'bytes');
console.log('  login.html   :', fs.statSync(path.join(dir,'login.html')).size, 'bytes');
console.log('  dashboard.html:', fs.statSync(path.join(dir,'dashboard.html')).size, 'bytes');
