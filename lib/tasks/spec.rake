# frozen_string_literal: true

def host_env_string
  'REDIS_HOST=$(docker-machine ip intake) REDIS_PORT=6379 API_URL=http://api'
end

namespace :spec do # rubocop:disable BlockLength
  def file_list
    # first ARGV is task name
    args = ARGV.drop(1)
    args.any? ? args.join(' ') : 'spec'
  end

  def gulp?
    run_gulp = file_list == 'spec' || file_list == 'spec/' || file_list.include?('features')
    'bin/gulp &&' if run_gulp
  end

  desc 'Run specs in ca_intake container'
  task :intake do
    system "#{gulp?} docker-compose exec ca_intake bundle exec rspec #{file_list}"
  end

  namespace :intake do
    desc 'Run specs locally outside container'
    task :local do
      docker_cmd = 'docker-compose exec ca_intake bundle exec rspec'
      system "#{host_env_string} #{gulp?} #{docker_cmd} #{file_list}"
    end
    desc 'Run specs in parallel in ca_intake container (from host)'
    task :parallel do
      # docker-compose supports ENV vars for run, but not exec (yet?)
      # We need to set RAILS_ENV because the spawned spec processes pick up
      # RAILS_ENV=development from our dev environment.
      docker_cmd = 'docker-compose run -e RAILS_ENV=test --rm ca_intake bundle exec parallel_rspec'
      system "#{gulp?} #{docker_cmd} #{file_list}"
    end
  end

  desc 'Run specs in api container'
  task :api do
    system "docker-compose exec api bundle exec rspec #{file_list}"
  end

  desc 'Run ALL THE SPECS, LINT, & KARMA!!!'
  task :full do
    Rake::Task['spec:intake'].invoke
    Rake::Task['spec:api'].invoke
    system 'bin/lint'
    system 'bin/karma'
  end
end
