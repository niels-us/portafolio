(async function () {
  const el = document.getElementById("visit-count");
  if (!el) return;

  try {
    const res = await fetch("https://countapi.mileshilliard.com/api/v1/hit/portafolio-niels-us-visits");
    const data = await res.json();
    el.textContent = data.value;
  } catch {
    el.textContent = "—";
  }
})();
