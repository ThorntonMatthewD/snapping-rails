FROM python:3.10.4

WORKDIR /code
COPY ./Pipfile.lock /code/Pipfile.lock

RUN export PIP_NO_CACHE_DIR=false

RUN pip install pipenv
RUN pipenv install

COPY . /code/

CMD ["uvicorn", "src.app:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "5000"] 