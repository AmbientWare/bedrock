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
4. Copy the .env.example file to .env in both the bedrock and frontend directories and define required environment variables
```bash
cp ./bedrock/.env.example ./bedrock/.env
cp ./frontend/.env.example ./frontend/.env
```

# Install dependencies
```bash
poetry install
```

# Run the application
```bash
# for bedrock [expose port 8000]
cd bedrock
./entrypoint.sh

# for frontend [expose port 5173]
cd frontend
npm run dev
```

# alternatively, run the application using docker
1. Install latest docker and docker-compose
2. Run the application
```bash
docker compose build
docker compose up -d # to run in detached mode
docker compose down # to stop the application
```

# Launching the web application
1. Navigate to http://localhost:3000/
2. Enter a "project name" and click "Create Project"
    - This will upload the project directory in container dataroom directory
    - An alert will be displayed on the screen when the project is created
    - May take a few seconds to load... will add a loading screen soon :)
3. Under projects section, click on the project name to open the project
4. Click on the result name to view in "Results" section
5. Press cmd+shift+l to open the chat window
6. Add context to chat by highlighting text in the "Results" section and pressing cmd+shift+y
7. You can edit document by clicing in text area of "Results" section

# Viewing the API documentation
1. Navigate to http://localhost:8000/docs/

