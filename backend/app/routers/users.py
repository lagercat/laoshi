from fastapi import APIRouter, HTTPException, status

from backend.app.models import User, UserCreate


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[User])
async def get_users() -> list[User]:
    """
    Get all users.

    Returns:
        List[User]: List of all users
    """
    # This is a stub - would normally fetch from database
    return [
        User(
            id="1",
            username="johndoe",
            email="john@example.com",
            full_name="John Doe",
            created_at="2023-01-01T00:00:00Z",
            updated_at="2023-01-01T00:00:00Z",
        ),
    ]


@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate) -> User:
    """
    Create a new user.

    Args:
        user (UserCreate): User data for creation

    Returns:
        User: Created user

    Raises:
        HTTPException: If user with the same username already exists
    """
    # This is a stub - would normally insert to database
    if user.username == "exists":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username already exists",
        )

    # Stub implementation
    return User(
        id="new_id",
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        created_at="2023-01-01T00:00:00Z",
        updated_at="2023-01-01T00:00:00Z",
    )


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str) -> User:
    """
    Get a specific user by ID.

    Args:
        user_id (str): The ID of the user to retrieve

    Returns:
        User: The requested user

    Raises:
        HTTPException: If user not found
    """
    # This is a stub - would normally fetch from database
    if user_id != "1":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return User(
        id=user_id,
        username="johndoe",
        email="john@example.com",
        full_name="John Doe",
        created_at="2023-01-01T00:00:00Z",
        updated_at="2023-01-01T00:00:00Z",
    )
