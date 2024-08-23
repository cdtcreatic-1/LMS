# Use an official Python runtime as a parent image
FROM python:3.10.12-slim-bullseye

ENV LOG_FILE_PATH='ds.log'
ENV OPENAI_API_KEY='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'
ENV POSTGRES_INITDB_DATABASE='database'
ENV POSTGRES_INITDB_USERNAME='myuser'
ENV POSTGRES_INITDB_PASSWORD='mypassword'
ENV POSTGRES_INITDB_HOST='db'
ENV POSTGRES_INITDB_PORT='5432'

RUN pip install --upgrade pip

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

RUN pip install -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5020

# Run app.py when the container launches
CMD ["python", "main.py"]
