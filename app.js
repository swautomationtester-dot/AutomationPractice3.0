

// ---------- Utilities ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const create = (tag, props = {}) => Object.assign(document.createElement(tag), props);

// ================= TOAST ENGINE (STACKED + ANIMATIONS) =================
function showToast({
  message,
  type = "info",       // success | error | info
  position = "top",    // top | center
  animation = "slide", // slide | fade | zoom
  duration = 2500
}) {
  const container = position === "center"
    ? document.getElementById("toastCenter")
    : document.getElementById("toastTop");

  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type} ${animation}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "scale(0.9)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Backward compatible wrappers (so you don't need to change rest of code)
function toastTop(msg) {
  showToast({ message: msg, type: "success", position: "top", animation: "slide" });
}

function toastCenter(msg) {
  showToast({ message: msg, type: "error", position: "center", animation: "zoom", duration: 3000 });
}

function toastInfo(msg) {
  showToast({ message: msg, type: "info", position: "top", animation: "fade" });
}

/* DARK MODE */
function toggleDark() {
  document.body.classList.toggle("dark");
  themeIcon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// ---------- Theme Toggle ----------
(() => {
  const darkSwitch = $('#darkSwitch');
  if (!darkSwitch) return;

  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialDark = stored ? stored === 'dark' : prefersDark;

  darkSwitch.checked = initialDark;
  document.documentElement.style.colorScheme = initialDark ? 'dark' : 'light';
  document.body.dataset.theme = initialDark ? 'dark' : 'light';

  const flipGradient = (isDark) => {
    document.body.style.background =
      isDark
        ? 'radial-gradient(900px 600px at -5% 0%, #0ea5e9 0%, transparent 60%), radial-gradient(900px 600px at 105% 20%, #a78bfa 0%, transparent 60%), linear-gradient(180deg, #0e141b, #0f172a)'
        : 'radial-gradient(900px 600px at -5% 0%, #bae6fd 0%, transparent 60%), radial-gradient(900px 600px at 105% 20%, #ddd6fe 0%, transparent 60%), linear-gradient(180deg, #eef2f7, #f5f7fb)';
  };
  flipGradient(initialDark);

  darkSwitch.addEventListener('change', () => {
    const isDark = darkSwitch.checked;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
    flipGradient(isDark);
  });
})();

// ---------- Validation ----------
(() => {
  const btn = $('#validateInputs');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const u = $('#username');
    const p = $('#password');
    const uErr = $('#usernameError');
    const pErr = $('#passwordError');

    let ok = true;

    if (!u.value.trim()) { uErr.classList.remove('hidden'); ok = false; }
    else uErr.classList.add('hidden');

    if (!p.value.trim()) {
      pErr.textContent = 'Password is required';
      pErr.classList.remove('hidden'); ok = false;
    } else if (p.value.length < 6) {
      pErr.textContent = 'Password must be at least 6 characters';
      pErr.classList.remove('hidden'); ok = false;
    } else pErr.classList.add('hidden');

    ok ? toastTop('Validation passed ✅') : toastCenter('Validation failed ❌');
  });
})();

// ---------- Form Submission ----------
(() => {
  const form = $('#automationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#formName').value.trim();
    const email = $('#formEmail').value.trim();

    if (!name || !email) {
      toastCenter('Please fill the form properly ❌');
      $('#formResult').classList.add('hidden');
      return;
    }

    const res = $('#formResult');
    res.textContent = `Form submitted ✅ — Name: ${name}, Email: ${email}`;
    res.classList.remove('hidden');
    toastTop('Form submitted');
  });
})();

// ---------- Dynamic Inputs ----------
(() => {
  const container = $('#dynamicContainer');
  const addBtn = $('#addFieldBtn');
  if (!container || !addBtn) return;

  let idx = 1;

  const addFieldRow = () => {
    const testId = `dynamic-${idx++}`;

    const wrapper = create('div', { className: 'field' });
    const label = create('label', { className: 'field-label', textContent: `Dynamic Field ${testId}` });
    const control = create('div', { className: 'control' });
    const input = create('input', { type: 'text', placeholder: 'Type something...', 'data-testid': testId });
    const removeBtn = create('button', { textContent: 'Remove', className: 'btn btn-danger', type: 'button' });

    removeBtn.onclick = () => {
      container.removeChild(wrapper);
      toastInfo(`Removed ${testId}`);
    };

    control.appendChild(input);
    wrapper.append(label, control, removeBtn);
    container.appendChild(wrapper);
  };

  addBtn.addEventListener('click', addFieldRow);
})();

// ---------- Auto Suggest ----------
(() => {
  const input = $('#country');
  const box = $('#suggestions');
  if (!input || !box) return;

  const countries = ["India","Japan","USA","UK","Germany","France","Australia","Canada","Singapore","UAE"];

  const render = (items) => {
    box.innerHTML = '';
    if (!items.length) { box.style.display = 'none'; return; }
    items.forEach(c => {
      const d = create('div', { className: 'suggestion-item', textContent: c });
      d.onclick = () => {
        input.value = c;
        box.style.display = 'none';
        toastTop(`Selected: ${c}`);
      };
      box.appendChild(d);
    });
    box.style.display = 'block';
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    render(countries.filter(c => c.toLowerCase().includes(q)).slice(0, 8));
  });

  document.addEventListener('click', (e) => {
    if (e.target !== input && !box.contains(e.target)) box.style.display = 'none';
  });
})();

// ---------- Alerts ----------
(() => {
  const na = $('#nativeAlert');
  if (!na) return;

  na.onclick = () => { alert("This is a native alert"); toastInfo("Native alert closed"); };

  $('#nativeConfirm').onclick = () => {
    const ok = confirm("Proceed?");
    ok ? toastTop("Confirmed ✅") : toastCenter("Cancelled ❌");
  };

  $('#nativePrompt').onclick = () => {
    const v = prompt("Enter value:");
    v !== null ? toastTop("Entered: " + v) : toastCenter("Prompt cancelled");
  };
})();
