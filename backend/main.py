from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/macro")
def get_macro_data():
    try:
        # 10-Year Treasury Yield (^TNX)
        tnx_data = yf.Ticker("^TNX").history(period="1d")
        tnx = float(tnx_data['Close'].iloc[-1]) if not tnx_data.empty else 4.0

        # US Dollar Index (DX-Y.NYB)
        dxy_data = yf.Ticker("DX-Y.NYB").history(period="1d")
        dxy = float(dxy_data['Close'].iloc[-1]) if not dxy_data.empty else 100.0

        # Vanguard Real Estate Index Fund (VNQ)
        vnq_data = yf.Ticker("VNQ").history(period="1d")
        vnq = float(vnq_data['Close'].iloc[-1]) if not vnq_data.empty else 80.0

        # Target Institutional Cap Rate: 10Y Treasury + 300 basis points
        expected_cap_rate = tnx + 3.00

        return {
            "tenYearYield": round(tnx, 2),
            "dxy": round(dxy, 2),
            "vnq": round(vnq, 2),
            "expectedCapRate": round(expected_cap_rate, 2),
            "status": "success"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def read_root():
    return {"message": "Spread-Out Macro API is running"}
