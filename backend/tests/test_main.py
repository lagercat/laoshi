from fastapi.responses import Response
from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def call_root_endpoint(client: TestClient) -> Response:
    """Call the root endpoint."""
    response = client.get("/")
    return response


def test_read_root(client: TestClient) -> None:
    """Test the root endpoint."""
    response = call_root_endpoint(client)
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Laoshi API"}
