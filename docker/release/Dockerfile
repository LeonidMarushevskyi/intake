FROM ruby:2.4.0
ENV BUILD_DATE unknown
ENV BUILD_NUMBER unknown
ENV VERSION unknown
ENV VCS-REF unknown

RUN \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install -y \
    build-essential \
    sudo \
    iceweasel \
    chromium \
    xvfb

RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

LABEL application=intake_accelerator \
  gov.ca.cwds.build-date=$BUILD_DATE \
  gov.ca.cwds.build-number=$BUILD_NUMBER \
  gov.ca.cwds.version=$VERSION \
  gov.ca.cwds.name=Intake \
  gov.ca.cwds.license=Apache-2.0 \
  gov.ca.cwds.vcs-ref=$VCS-REF \
  gov.ca.cwds.vcs-type=git \
  gov.ca.cwds.vcs-url=git@github.com:ca-cwds/intake.git \
  gov.ca.cwds.vendor=Intake
COPY release /release
RUN dpkg -i /release/*.deb && rm -rf /release

ENV BUNDLE_PATH /ca_intake/ruby_gems

COPY scripts/release.sh /usr/local/bin/release.sh
RUN chmod +x /usr/local/bin/release.sh

VOLUME ["/ca_intake/public"]

ENTRYPOINT ["release.sh"]
