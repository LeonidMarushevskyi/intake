FROM casecommons/ca_intake_base_image:latest

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD https://s3-us-west-1.amazonaws.com/intake-dependencies/phantomjs-2.1.1-linux-x86_64.tar.bz2 $APP_HOME

ADD ./bin/install_phantomjs $APP_HOME/install_phantomjs
RUN $APP_HOME/install_phantomjs

ENV BUNDLE_PATH /ca_intake/ruby_gems

RUN mkdir /build_artefacts
COPY scripts/build.sh /usr/local/bin/build.sh
RUN chmod +x /usr/local/bin/build.sh

COPY . ./
RUN bundle install -j24
RUN npm install --spin=false
