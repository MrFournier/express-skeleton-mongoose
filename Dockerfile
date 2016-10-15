FROM node

#
# Create `app` user and update `npm`
# 2016-10-7 https://github.com/npm/npm/issues/9863
#
RUN useradd --user-group --create-home --shell /bin/false app &&\
              curl -L https://npmjs.org/install.sh | sh

ENV HOME=/home/app

#COPY package.json npm-shrinkwrap.json $HOME/skeleton/
COPY package.json $HOME/skeleton/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/skeleton

RUN npm install

USER root
COPY . $HOME/skeleton
RUN chown -R app:app $HOME/*
USER app

CMD ["node", "app.js"]
