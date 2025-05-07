# Dockerfile for Django backend
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY ./currencyApp /app/

# Run migrations and start server
CMD ["gunicorn", "currencyApp.wsgi:application", "--bind", "0.0.0.0:8000"]