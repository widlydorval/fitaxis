from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Autoriser les requêtes du frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- MODELES DE DONNEES ---------

class FitInput(BaseModel):
    height_cm: float
    weight_kg: float
    fit_preference: str
    sku: str


# --------- GUIDE DE TAILLES (PROTOTYPE) ---------

PRODUCTS = {
    "SKU123": {
        "size_chart": {
            "S": 48,
            "M": 52,
            "L": 56,
            "XL": 60
        }
    }
}


# --------- ENDPOINT API ---------

@app.post("/recommendation")
def recommend(data: FitInput):

    # 1. Formule de base calibrée pour correspondre au size chart
    chest = 52 + (data.height_cm - 175) * 0.2 + (data.weight_kg - 70) * 0.3

    # 2. Ajustement selon la préférence du client
    if data.fit_preference == "serre":
        chest *= 0.97
    elif data.fit_preference == "ample":
        chest *= 1.05

    # 3. Sélection de la taille la plus proche
    chart = PRODUCTS[data.sku]["size_chart"]
    best = min(chart, key=lambda s: abs(chart[s] - chest))

    # 4. Retour API
    return {
        "recommended_size": best,
        "fit_comment": "Ajusté confortable",
        "confidence": 0.85
    }
