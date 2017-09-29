FROM ruby:2.4.0

RUN apt-get update -y
RUN apt-get install -y apt-transport-https

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update -y
RUN apt-get upgrade -y

RUN  apt-get install -y \
    build-essential \
    sudo \
    iceweasel \
    chromium \
    xvfb \
    chrpath \
    libssl-dev \
    libxft-dev \
    libfreetype6 \
    libfreetype6-dev \
    libfontconfig1 \
    libfontconfig1-dev \
    yarn \
    bzip2

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD https://s3-us-west-1.amazonaws.com/intake-dependencies/phantomjs-2.1.1-linux-x86_64.tar.bz2 $APP_HOME
ADD ./bin/install_phantomjs $APP_HOME/install_phantomjs
RUN $APP_HOME/install_phantomjs

ARG GECKODRIVER_VERSION=0.18.0
RUN wget --no-verbose -O /tmp/geckodriver.tar.gz https://github.com/mozilla/geckodriver/releases/download/v$GECKODRIVER_VERSION/geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz \
  && rm -rf /opt/geckodriver \
  && tar -C /opt -zxf /tmp/geckodriver.tar.gz \
  && rm /tmp/geckodriver.tar.gz \
  && mv /opt/geckodriver /opt/geckodriver-$GECKODRIVER_VERSION \
  && chmod 755 /opt/geckodriver-$GECKODRIVER_VERSION \
  && ln -fs /opt/geckodriver-$GECKODRIVER_VERSION /usr/bin/geckodriver

ENV DISPLAY :1
ENV BUNDLE_PATH /ruby_gems
