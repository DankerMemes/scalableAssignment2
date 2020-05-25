FROM nikolaik/python-nodejs:latest

RUN python -V
RUN node -v
RUN pip -V

COPY requirements.txt ./
RUN pip install -r requirements.txt
