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

  def webpack?
    run_webpack = file_list == 'spec' || file_list == 'spec/' || file_list.include?('features')
    'bin/webpack &&' if run_webpack
  end

  desc 'Run specs in ca_intake container'
  task :intake do
    command = "AUTHENTICATION=false RAILS_ENV=test bundle exec rspec #{file_list}"
    system "#{webpack?} docker-compose exec ca_intake bash -c '#{command}'"
  end

  namespace :intake do
    desc 'Run specs locally outside container'
    task :local do
      system "#{webpack?} #{host_env_string} bundle exec rspec #{file_list}"
    end
    desc 'Run specs in parallel in ca_intake container (from host)'
    task :parallel do
      # docker-compose supports ENV vars for run, but not exec (yet?)
      # We need to set RAILS_ENV because the spawned spec processes pick up
      # RAILS_ENV=development from our dev environment.
      docker_cmd = <<~END.tr("\n", ' ')
        docker-compose run
        -e AUTHENTICATION=false
        -e RAILS_ENV=test
        --rm ca_intake
        bundle exec parallel_rspec
      END
      system "#{webpack?} #{docker_cmd} #{file_list}"
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
    system "docker-compose exec api bash -c 'AUTHENTICATION=false bundle exec rspec #{file_list}'"
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
    Rake::Task['spec:intake:parallel'].invoke
    system 'bin/lint'
    system 'bin/karma'
    Rake::Task['spec:api'].invoke
    system 'docker-compose exec api rubocop'
  end
end
