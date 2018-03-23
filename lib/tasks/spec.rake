# frozen_string_literal: true

def host_env_string
  'AUTHENTICATION=false API_URL=http://api FERB_API_URL=https://ferb_api MARIONETTE=false'
end

namespace :spec do # rubocop:disable BlockLength
  def file_list
    # first ARGV is task name
    args = ARGV.drop(1)
    args.any? ? args.join(' ') : 'spec'
  end

  def webpack?
    run_webpack = file_list == 'spec' || file_list == 'spec/' || file_list.include?('features')
    'rm -rf public/packs-test && NODE_ENV=test bin/webpack &&' if run_webpack
  end

  def run_in_intake_container(command)
    # for some reason ca_intake requires redis for feature tests
    system 'docker-compose up -d redis'
    # docker-compose supports ENV vars for run, but not exec (yet?)
    # We need to set RAILS_ENV because the spawned spec processes pick up
    # RAILS_ENV=development from our dev environment.
    <<~HEREDOC.tr("\n", ' ')
      docker-compose run
      -e AUTHENTICATION=false
      -e RAILS_ENV=test
      --no-deps
      --rm ca_intake
      #{command}
    HEREDOC
  end

  desc 'Run specs in ca_intake container'
  task :intake do
    system "#{webpack?} #{run_in_intake_container('bundle exec rspec')} #{file_list}"
  end

  namespace :intake do
    desc 'Run specs locally outside container'
    task :local do
      system "#{webpack?} #{host_env_string} bundle exec rspec #{file_list}"
    end
    desc 'Run specs in parallel in ca_intake container (from host)'
    task :parallel do
      cmd = 'bundle exec parallel_rspec --runtime-log parallel_runtime_rspec.log'
      system "#{webpack?} #{run_in_intake_container(cmd)} #{file_list}"
    end

    desc 'Run ALL THE SPECS, LINT, & KARMA!!!'
    task :full do
      if system('bin/lint') && system('bin/karma')
        Rake::Task['spec:intake:parallel'].invoke
      end
    end
  end

  desc 'Run specs in api container'
  task :api do
    system "docker-compose run --rm -e AUTHENTICATION=false api bundle exec rspec #{file_list}"
  end

  namespace :api do
    desc 'Run ALL THE SPECS, & RUBOCOP!!!'
    task :full do
      system('rubocop ../intake_api') && Rake::Task['spec:api'].invoke
    end
  end

  desc 'Run specs and linters for both intake and api'
  task full: ['spec:api:full', 'spec:intake:full']
end
