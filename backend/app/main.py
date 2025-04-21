import os

from dotenv import load_dotenv
from fastapi import FastAPI

from backend.app.routers import users


# Load environment variables
load_dotenv()

app: FastAPI = FastAPI(
    title="Laoshi API",
    description="A FastAPI application",
    version="0.1.0",
)

# Include routers
app.include_router(users.router)


@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint that returns a welcome message.

    Returns:
        Dict[str, str]: A dictionary with a welcome message
    """
    return {"message": "Welcome to Laoshi API"}


if __name__ == "__main__":
    import uvicorn

    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    uvicorn.run("backend.app.main:app", host=host, port=port, reload=debug)
