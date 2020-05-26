FROM nikolaik/python-nodejs:latest

RUN python -V
RUN node -v
RUN pip -V

RUN apt-get update
RUN export PIP_DEFAULT_TIMEOUT=100
COPY requirements.txt ./
RUN pip install -r requirements.txt

RUN apt install graphviz -y
RUN mkdir -p /usr/src/scalableapp
WORKDIR /usr/src/scalableapp
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]