/* CEPAR@Tufts - contact form (prototype; nothing is sent).
   Choosing "I am a..." shows who the message would go to. The routing is
   a PROPOSAL for CEPAR to confirm and only uses contacts already on the
   page. Edit ROUTES to change it. */
(function () {
  "use strict";

  var form = document.getElementById("contact-form-el");
  if (!form) return;

  var PEOPLE = {
    tcrc: "the Tisch College Community Research Center (tcrc@tufts.edu)",
    elaine: "Elaine Donnelly",
    anjuli: "Anjuli Fahlberg"
  };
  var ROUTES = {
    researcher: ["anjuli", "tcrc"],
    faculty: ["elaine", "anjuli"],
    partner: ["tcrc"],
    student: ["tcrc"],
    funder: ["elaine", "tcrc"],
    other: ["tcrc"]
  };

  var sel = document.getElementById("c-as");
  var otherWrap = document.getElementById("c-other-wrap");
  var other = document.getElementById("c-other");
  var route = document.getElementById("c-route");
  var err = document.getElementById("c-error");
  var done = document.getElementById("c-done");
  var doneMsg = document.getElementById("c-done-msg");

  function recipients(key) {
    var list = (ROUTES[key] || []).map(function (k) { return PEOPLE[k]; });
    return list.length > 1 ? list.slice(0, -1).join(", ") + " and " + list[list.length - 1] : list[0];
  }

  function update() {
    var key = sel.value;
    otherWrap.hidden = key !== "other";
    route.textContent = key ? "Your message would go to " + recipients(key) + ". (Proposed routing, for CEPAR to confirm.)" : "";
  }

  sel.addEventListener("change", function () {
    update();
    try { history.replaceState(null, "", "?as=" + sel.value); } catch (e) {}
  });

  // Pre-select from ?as=student etc., so other pages can link straight to a group.
  var pre = new URLSearchParams(window.location.search).get("as");
  if (pre && ROUTES[pre]) { sel.value = pre; update(); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = [];
    ["c-fname", "c-lname", "c-email", "c-as", "c-msg"].forEach(function (id) {
      var el = document.getElementById(id);
      var ok = el.value.trim() !== "" && (el.type !== "email" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok) bad.push(el);
    });
    if (bad.length) {
      err.textContent = "Please fill in every field" + (document.getElementById("c-email").getAttribute("aria-invalid") === "true" ? " and check your email address" : "") + ".";
      err.hidden = false;
      bad[0].focus();
      return;
    }
    err.hidden = true;
    doneMsg.textContent = "In the full site, this would go to " + recipients(sel.value) + ".";
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
})();
