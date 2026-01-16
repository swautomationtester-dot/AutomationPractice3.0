(function () {
  const inLabs = window.location.pathname.includes("/labs/");
  const basePath = inLabs ? ".." : ".";

  const headerHTML = `
    <header class="app-header">
      <div class="header-inner">

        <!-- LEFT: BRAND -->
        <div class="brand-pill"
             onclick="window.location.href='${basePath}/index.html'"
             style="cursor:pointer">
          <img src="${basePath}/images/isha-logo.jpeg" class="logo-min" alt="logo">
          <div class="title-block">
            <div class="brand-title">Isha Automation Practice</div>
            <div class="brand-sub">Playwright • Selenium</div>
          </div>
        </div>

        <!-- RIGHT: ACTIONS -->
        <div class="header-actions">

          <!-- HOME BUTTON -->
          <a href="${basePath}/index.html" class="btn btn-secondary">🏠 Home</a>

          <!-- USER MENU -->
          <div class="user-menu" id="userMenu">

            <div class="avatar-btn" id="avatarBtn" title="User menu" data-testid="user-avatar">
              <img src="${basePath}/images/avatar.png" alt="User">
            </div>

            <div class="user-dropdown" id="userDropdown">
              <div class="user-info">
                <div class="user-name">Venkat</div>
                <div class="user-email">trainer@isha.com</div>
              </div>

              <div class="dropdown-sep"></div>

              <button class="dropdown-item">👤 Profile</button>
              <button class="dropdown-item">⚙️ Settings</button>

              <div class="dropdown-sep"></div>

              <button class="dropdown-item danger">🚪 Logout</button>
            </div>

          </div>

        </div>

      </div>
    </header>
  `;

  // Inject header at top of body
  document.body.insertAdjacentHTML("afterbegin", headerHTML);

  // Menu behavior
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("avatarBtn");
    const menu = document.getElementById("userDropdown");

    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      menu.classList.remove("show");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") menu.classList.remove("show");
    });
  });

})();
