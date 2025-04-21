import pytest

from fastapi.testclient import TestClient

from backend.app.main import app


@pytest.fixture
def client() -> TestClient:
    """
    Create a test client for the app.

    Returns:
        TestClient: A FastAPI test client
    """
    return TestClient(app)
