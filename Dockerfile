FROM ruby:2.4.0
RUN \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install -y \
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
    libfontconfig1-dev

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD https://s3-us-west-1.amazonaws.com/intake-dependencies/phantomjs-2.1.1-linux-x86_64.tar.bz2 $APP_HOME

ADD ./bin/install_phantomjs $APP_HOME/install_phantomjs
RUN $APP_HOME/install_phantomjs

ENV DISPLAY :1
ENV BUNDLE_PATH /ruby_gems
