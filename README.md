# Laoshi

A monorepo with FastAPI backend and future frontend support.

## Project Structure

```
laoshi/
├── backend/         # Python FastAPI Backend
│   ├── app/         # API code
│   └── tests/       # Backend tests
├── frontend/        # Future frontend code
└── .venv/           # Project-specific virtual environment (created during build)
```

## Setup

Just run the build command to set up everything in a dedicated virtual environment:

```bash
# Using pnpm
pnpm build

# OR using the shell script
chmod +x build.sh
./build.sh
```

The build process will:
1. Create a `.venv` virtual environment in the project root
2. Install Poetry in the virtual environment
3. Use Poetry to install all project dependencies
4. Set up pre-commit hooks

## Development

### Backend

Start the backend development server:
```bash
pnpm start:backend
```

Run backend tests:
```bash
pnpm test:backend
```

Run backend tests with coverage:
```bash
pnpm test:backend:cov
```

Format backend code:
```bash
pnpm format:backend
```

Lint backend code:
```bash
pnpm lint:backend
```

Run type checking:
```bash
pnpm type-check
```

Run all pre-commit hooks manually:
```bash
pnpm pre-commit:run-all
```

### Dependency Management

Update all dependencies to the latest versions:
```bash
pnpm deps:update
```

### Type Checking

This project enforces strict type checking with mypy. All functions must include proper type hints.

If you need to skip type checking for a specific line, use:
```python
# type: ignore
```

Example:
```python
from some_untyped_library import some_function  # type: ignore
```

### Pre-commit Hooks

The following checks run automatically on each commit:
- Black (code formatting)
- isort (import sorting)
- mypy (type checking)
- ruff (linting)
- Additional checks for trailing whitespace, YAML validity, etc.

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
