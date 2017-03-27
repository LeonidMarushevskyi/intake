FROM ruby:2.4.0
RUN \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install -y \
    build-essential \
    sudo \
    chromium \
    xvfb

# Install firefox 52, Jessie repositories only go to 45.8
RUN echo "deb http://mozilla.debian.net/ jessie-backports firefox-esr" >> /etc/apt/sources.list
RUN wget -qO - https://mozilla.debian.net/archive.asc | sudo apt-key add -
RUN apt-get update && apt-get install -y firefox-esr

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ENV DISPLAY :1
ENV BUNDLE_PATH /ruby_gems
