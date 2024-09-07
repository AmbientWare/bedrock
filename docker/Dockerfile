# use python:3.12-slim as base image
FROM python:3.12-slim

# set the working directory
WORKDIR /app

# install poetry
RUN pip install poetry

# copy the poetry.lock and pyproject.toml, and README.md files to the working directory
COPY poetry.lock pyproject.toml README.md ./

# install the dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# copy all contents of bedrock directory to the working directory
COPY bedrock /app

# set the entrypoint to the testharness.py file
CMD ["python", "testharness.py"]
