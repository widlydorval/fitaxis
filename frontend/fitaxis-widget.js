// Injecter le bouton sur la page
document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");
  button.innerText = "Quelle taille choisir ?";
  button.id = "fitaxis-btn";
  document.body.appendChild(button);

  button.onclick = openFitAxisModal;
});

function openFitAxisModal() {
  const modal = document.createElement("div");
  modal.id = "fitaxis-modal";
  modal.innerHTML = `
    <div class="fitaxis-content">
      <h2>Quelle taille choisir ?</h2>
      <label>Taille (cm)</label>
      <input type="number" id="height" />

      <label>Poids (kg)</label>
      <input type="number" id="weight" />

      <label>Préférence de fit</label>
      <select id="fit_pref">
        <option value="serre">Serré</option>
        <option value="normal" selected>Normal</option>
        <option value="ample">Ample</option>
      </select>

      <button id="fitaxis-submit">Trouver ma taille</button>
      <div id="fitaxis-result"></div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("fitaxis-submit").onclick = sendFitAxisData;
}

async function sendFitAxisData() {
  const data = {
    height_cm: Number(document.getElementById("height").value),
    weight_kg: Number(document.getElementById("weight").value),
    fit_preference: document.getElementById("fit_pref").value,
    sku: "SKU123"
  };

  const response = await fetch("http://127.0.0.1:8000/recommendation", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  const result = await response.json();
  document.getElementById("fitaxis-result").innerHTML =
    `Taille recommandée : <b>${result.recommended_size}</b><br>${result.fit_comment}`;
}
