FROM casecommons/ca_intake_base_image:latest

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY release /release
RUN dpkg -i /release/*.deb && rm -rf /release

ENV BUNDLE_PATH /ca_intake/ruby_gems

COPY scripts/release.sh /usr/local/bin/release.sh
RUN chmod +x /usr/local/bin/release.sh

ENTRYPOINT ["release.sh"]
