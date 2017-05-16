# frozen_string_literal: true

def host_env_string
  'REDIS_HOST=$(docker-machine ip intake) REDIS_PORT=6379 API_URL=http://api'
end

namespace :spec do # rubocop:disable BlockLength
  def spec_cmd
    # first ARGV is task name
    args = ARGV.drop(1)
    extra = args.any? ? "SPEC='#{args.join(' ')}'" : ''
    "bundle exec rake spec #{extra}"
  end

  desc 'Run specs in ca_intake container'
  task :intake do
    system "docker-compose exec ca_intake #{spec_cmd}"
  end

  namespace :intake do
    desc 'Run specs locally outside container'
    task :local do
      system "#{host_env_string} #{spec_cmd}"
    end

    desc 'Run ALL THE SPECS, LINT, & KARMA!!!'
    task :full do
      Rake::Task['spec:intake'].invoke
      system 'bin/lint'
      system 'bin/karma'
    end
  end

  desc 'Run specs in api container'
  task :api do
    system "docker-compose exec api #{spec_cmd}"
  end

  namespace :api do
    desc 'Run ALL THE SPECS, & RUBOCOP!!!'
    task :full do
      Rake::Task['spec:api'].invoke
      system 'docker-compose exec api rubocop'
    end
  end

  desc 'Run specs and linters for both intake and api'
  task :full do
    Rake::Task['spec:intake'].invoke
    system 'bin/lint'
    system 'bin/karma'
    Rake::Task['spec:api'].invoke
    system 'docker-compose exec api rubocop'
  end
end
