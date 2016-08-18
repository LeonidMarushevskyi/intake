FROM casecommons/ca_intake_base_image:latest

ENV BUNDLE_PATH /ruby_gems

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY scripts/test.sh /usr/local/bin/test.sh
RUN chmod +x /usr/local/bin/test.sh

COPY . ./

ENTRYPOINT ["test.sh"]
