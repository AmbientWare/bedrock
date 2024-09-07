# Prerequisites
1. Follow instructions to install [Poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
    - Make sure venv in project is active for poetry by running
    ```bash
    poetry config virtualenvs.in-project true
    ```
2. Follow instructions to install [pyenv](https://github.com/pyenv/pyenv)
3. Install python 3.12 using pyenv
```bash
pyenv install 3.12
```
4. Copy the .env.example file to .env and define required environment variables
```bash
cp .env.example .env
```

# Install dependencies
```bash
poetry install
```

# Run the application
```bash
cd bedrock
poetry run python testharness.py
```

# alternatively, run the application using docker
1. Install latest docker and docker-compose
2. Run the application
```bash
docker compose build
docker compose up bedrock
```

