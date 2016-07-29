FROM ruby:2.3.1
RUN apt-get update -qq && apt-get install -y build-essential

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ENV BUNDLE_PATH /ruby_gems
