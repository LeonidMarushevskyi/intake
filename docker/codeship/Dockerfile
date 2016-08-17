FROM casecommons/ca_intake_base_image:latest


ENV BUNDLE_PATH /ruby_gems

ENV APP_HOME /ca_intake
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile Gemfile.lock ./
RUN bundle install --without=development -j24

COPY package.json ./
RUN npm install --spin=false

COPY . ./
