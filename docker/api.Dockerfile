# use python:3.12-slim as base image
FROM python:3.12-slim as builder

# set the working directory
WORKDIR /app/bedrock

# install os dependencies
RUN apt-get update && apt-get install -y gcc

# install poetry
RUN pip install poetry

# copy the poetry.lock and pyproject.toml, and README.md files to the working directory
COPY poetry.lock pyproject.toml README.md ./

# install python dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# copy all contents of bedrock directory to the working directory
COPY bedrock /app/bedrock

# set the entrypoint to the testharness.py file
CMD ["/bin/bash", "-c", "./entrypoint.sh"]
