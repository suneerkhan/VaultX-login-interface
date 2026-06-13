/* ─── NeoVault — script.js ───────────────────────────────────── */

/* ── Utility: Toast ─────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth; // reflow
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Utility: Field validation helpers ──────────────────────── */
function setError(groupId, show) {
  const group = document.getElementById(groupId);
  if (!group) return;
  if (show) group.classList.add('has-error');
  else group.classList.remove('has-error');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* ── Password visibility toggle ─────────────────────────────── */
function setupToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

    // swap icon
    btn.innerHTML = isHidden
      ? /* eye-off */
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>`
      : /* eye */
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>`;
  });
}

/* ── Password strength ──────────────────────────────────────── */
function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, Math.ceil(score * 4 / 5));
}

const strengthMeta = [
  { label: 'Weak',   cls: 'weak'   },
  { label: 'Fair',   cls: 'fair'   },
  { label: 'Good',   cls: 'good'   },
  { label: 'Strong', cls: 'strong' },
];

function updateStrength(pw) {
  const wrap  = document.getElementById('strengthWrap');
  const label = document.getElementById('strengthLabel');
  const bars  = [
    document.getElementById('bar1'),
    document.getElementById('bar2'),
    document.getElementById('bar3'),
    document.getElementById('bar4'),
  ];
  if (!wrap) return;

  if (!pw) {
    wrap.classList.remove('visible');
    return;
  }
  wrap.classList.add('visible');

  const level = calcStrength(pw); // 1–4
  const meta  = strengthMeta[level - 1];

  bars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < level) bar.classList.add(meta.cls);
  });

  label.textContent = `Strength: ${meta.label}`;
}

/* ── Button loading state ───────────────────────────────────── */
function setLoading(btn, loading) {
  if (loading) btn.classList.add('loading');
  else btn.classList.remove('loading');
}

/* ══════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════ */
const loginForm = document.getElementById('loginForm');
if (loginForm) {

  setupToggle('togglePw', 'password');

  // Real-time clear errors on input
  document.getElementById('email')?.addEventListener('input', () => setError('fg-email', false));
  document.getElementById('password')?.addEventListener('input', () => setError('fg-password', false));

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    let valid = true;

    if (!isValidEmail(email)) {
      setError('fg-email', true);
      valid = false;
    }

    if (password.length < 6) {
      setError('fg-password', true);
      valid = false;
    }

    if (!valid) return;

    // Simulate async login
    const btn = document.getElementById('loginBtn');
    setLoading(btn, true);

    setTimeout(() => {
      setLoading(btn, false);
      showToast('Signed in successfully! Welcome back.', 'success');
    }, 1800);
  });

  // Google button
  document.getElementById('googleBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Google sign-in coming soon!', 'success');
  });
}

/* ══════════════════════════════════════════════════════════════
   SIGNUP PAGE
══════════════════════════════════════════════════════════════ */
const signupForm = document.getElementById('signupForm');
if (signupForm) {

  setupToggle('togglePw',      'password');
  setupToggle('toggleConfirm', 'confirm');

  // Password strength live update
  document.getElementById('password')?.addEventListener('input', (e) => {
    updateStrength(e.target.value);
    setError('fg-password', false);
  });

  // Real-time clear errors
  document.getElementById('name')?.addEventListener('input',    () => setError('fg-name',     false));
  document.getElementById('email')?.addEventListener('input',   () => setError('fg-email',    false));
  document.getElementById('confirm')?.addEventListener('input', () => setError('fg-confirm',  false));

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm  = document.getElementById('confirm').value;
    let valid = true;

    if (!name) {
      setError('fg-name', true);
      valid = false;
    }

    if (!isValidEmail(email)) {
      setError('fg-email', true);
      valid = false;
    }

    if (password.length < 8) {
      setError('fg-password', true);
      valid = false;
    }

    if (password !== confirm) {
      setError('fg-confirm', true);
      valid = false;
    }

    if (!valid) return;

    // Simulate async signup
    const btn = document.getElementById('signupBtn');
    setLoading(btn, true);

    setTimeout(() => {
      setLoading(btn, false);
      showToast(`Welcome aboard, ${name.split(' ')[0]}! 🎉`, 'success');
    }, 2000);
  });
}