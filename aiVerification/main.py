from fastapi import FastAPI, UploadFile, File 
from verifier import run_verification
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# I'm initializing the FastAPI app here.
app = FastAPI()

# This is just a root endpoint so I can check if the API is up and running.
@app.get("/")
def root():
    return {"message": "NeoEterna AI Verification API is running 🚀"}

# This endpoint handles file uploads for verification. 
# I expect a file and then send it to my AI verifier module.
@app.post("/api/verify")
async def verify(file: UploadFile = File(...)):
    try:
        print("File received:", file.filename)  # For debugging purposes, helps confirm receipt.
        print("MIME type detected:", file.content_type)

        if not file:
         raise ValueError("No file received")
        
        return await run_verification(file)     # Main logic happens in this helper.
    except Exception as e:
        print("Verification error:", str(e))    # Logging the error for easier debugging.
        return JSONResponse(status_code=500, content={"error": str(e)})

# This endpoint just lists the models I'm supporting. It's mostly static for now.
@app.get("/api/verify/models")
def get_supported_models():
    return {
        "models": [
            "HuggingFace - microsoft/resnet-50 (image classifier)",  # The default model I'm using now.
            "Future: Fine-tuned forgery detection model"              # Planning to add this later.
        ]
    }

# I added this placeholder to make it clear that training isn't supported in this API.
@app.post("/api/verify/train")
def train_disabled():
    return {"message": "Training is disabled. Using pre-trained hosted model."}

# This endpoint mocks a verification status check by job ID.
# I might replace this later with actual async job processing.
@app.get("/api/verify/status/{job_id}")
def mock_status(job_id: str):
    return {
        "job_id": job_id,
        "status": "done",            # Mocked status—everything looks successful.
        "confidence": 0.93           # Also mocked—shows how confident the model is.
    }

# Setting up CORS so that my frontend (probably running on localhost:5173) can access this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  #MY frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
