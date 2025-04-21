#!/bin/bash
set -e

echo "Setting up virtual environment..."
python -m pip install virtualenv
python -m virtualenv .venv

echo "Installing build requirements in virtual environment..."
.venv/bin/pip install -r build_requirements.txt

echo "Installing project dependencies with Poetry..."
.venv/bin/poetry install

echo "Setting up pre-commit hooks..."
.venv/bin/poetry run pre-commit install

echo "Setup complete!"
echo
echo "To run commands without activating the environment, use pnpm scripts:"
echo "  pnpm start:backend  # To start the development server"
