# Start from the official Python base image
FROM python:3.11

# Set the current working directory to /code
# This is where we'll put the requirements.txt file and the app directory
WORKDIR /code

# Copy the file with the requirements to the /code directory
COPY ./requirements.txt /code/requirements.txt

# Install the package dependencies in the requirements file
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the ./backend directory inside the /code directory
COPY ./app /code/app

# Set the command to use "fastapi run", which uses Uvicorn underneath
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]