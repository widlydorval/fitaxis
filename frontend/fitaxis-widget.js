// Widget FitAxis V1 – premium UI

document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");
  button.innerText = "Trouver ma taille avec FitAxis";
  button.id = "fitaxis-btn";
  document.body.appendChild(button);

  button.onclick = openFitAxisModal;
});

function openFitAxisModal() {
  // Si la modal existe déjà, on ne la recrée pas
  const existing = document.getElementById("fitaxis-modal");
  if (existing) {
    existing.style.display = "flex";
    return;
  }

  const modal = document.createElement("div");
  modal.id = "fitaxis-modal";
  modal.innerHTML = `
    <div class="fitaxis-card">
      <div class="fitaxis-header">
        <div>
          <h2>FitAxis</h2>
          <p>Nous calculons la taille idéale pour ce produit.</p>
        </div>
        <button id="fitaxis-close" aria-label="Fermer">✕</button>
      </div>

      <div class="fitaxis-grid">
        <div class="fitaxis-field">
          <label for="height">Taille (cm)</label>
          <input type="number" id="height" placeholder="ex : 175" />
        </div>
        <div class="fitaxis-field">
          <label for="weight">Poids (kg)</label>
          <input type="number" id="weight" placeholder="ex : 70" />
        </div>
      </div>

      <div class="fitaxis-field">
        <label for="fit_pref">Préférence de coupe</label>
        <select id="fit_pref">
          <option value="serre">Près du corps</option>
          <option value="normal" selected>Standard</option>
          <option value="ample">Plus ample</option>
        </select>
      </div>

      <button id="fitaxis-submit">Calculer ma taille</button>

      <div id="fitaxis-result" class="fitaxis-result">
        <span class="fitaxis-hint">
          Répondez aux questions ci-dessus, puis cliquez sur “Calculer ma taille”.
        </span>
      </div>

      <p class="fitaxis-footer">
        Basé sur votre morphologie et les données produit. Powered by FitAxis.
      </p>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("fitaxis-close").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("fitaxis-submit").onclick = sendFitAxisData;
}

async function sendFitAxisData() {
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const fitPref = document.getElementById("fit_pref").value;
  const resultDiv = document.getElementById("fitaxis-result");

  if (!height || !weight) {
    resultDiv.innerHTML = `<span class="fitaxis-error">Merci d’indiquer votre taille et votre poids.</span>`;
    return;
  }

  const data = {
    height_cm: height,
    weight_kg: weight,
    fit_preference: fitPref,
    sku: "SKU123" // à terme: dynamique via data-attribute
  };

  resultDiv.innerHTML = `<span class="fitaxis-loading">Calcul en cours…</span>`;

  try {
    const response = await fetch("https://fitaxis-aif2.onrender.com/recommendation", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Réponse API non valide");
    }

    const result = await response.json();

    resultDiv.innerHTML = `
      <div class="fitaxis-size-block">
        <div class="fitaxis-size-label">Taille recommandée</div>
        <div class="fitaxis-size-value">${result.recommended_size ?? "—"}</div>
        <div class="fitaxis-size-comment">${result.fit_comment ?? ""}</div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<span class="fitaxis-error">Impossible de calculer la taille pour le moment. Merci de réessayer.</span>`;
  }
}
