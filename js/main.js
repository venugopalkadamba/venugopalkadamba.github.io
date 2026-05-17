(function () {
  "use strict";

  var STORAGE_KEY = "vgk-theme";

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.getElementById("nav-menu");
    var themeBtn = document.querySelector(".theme-toggle");
    var yearEl = document.getElementById("year");

    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", function () {
        var open = navMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          navMenu.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });

      navMenu.querySelectorAll(".nav-details-panel a").forEach(function (link) {
        link.addEventListener("click", function () {
          var details = link.closest(".nav-details");
          if (details) details.removeAttribute("open");
        });
      });
    }

    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      document.querySelectorAll(".nav-details[open]").forEach(function (d) {
        if (!d.contains(t)) d.removeAttribute("open");
      });
    });

    /* Active nav link on scroll */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

    function setActiveNav() {
      var scrollY = window.scrollY + 120;
      var current = "";
      sections.forEach(function (sec) {
        var top = sec.offsetTop;
        var h = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + h) current = sec.getAttribute("id") || "";
      });
      navLinks.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
    }

    window.addEventListener("scroll", setActiveNav, { passive: true });
    setActiveNav();

    var mqWide = window.matchMedia("(min-width: 881px)");
    function closeMobileNavIfWide() {
      if (mqWide.matches && navMenu && navToggle) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
    mqWide.addEventListener("change", closeMobileNavIfWide);

    /* Scroll reveal */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px 0px -50px 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  });
})();
