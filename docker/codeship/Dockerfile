FROM casecommons/ca_intake_base_image:latest

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ENV BUNDLE_PATH /ruby_gems

COPY Gemfile Gemfile.lock ./
RUN bundle install -j24

COPY package.json ./
RUN npm install --spin=false

COPY . ./
