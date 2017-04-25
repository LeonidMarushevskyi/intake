# rubocop:disable BlockLength
# frozen_string_literal: true
namespace :spec do
  def spec_cmd
    # first ARGV is task name
    args = ARGV.drop(1)
    extra = args.any? ? "SPEC='#{args.join(' ')}'" : ''
    "bundle exec rake spec #{extra}"
  end

  namespace :intake do
    task :default do
      system "docker-compose exec ca_intake #{spec_cmd}"
    end
    task local: :env do
      system " #{spec_cmd}"
    end
  end

  task :api do
    system "docker-compose exec api #{spec_cmd}"
  end

  task :full do
    Rake::Task['spec:intake'].invoke
    Rake::Task['spec:api'].invoke
    system 'bin/lint'
    system 'bin/karma'
  end

  task :env do
    system 'export REDIS_HOST=$(docker-machine ip intake)'
    system 'export REDIS_PORT=6379'
    system 'export API_URL=http://api'
  end
end

namespace :docker do
  task :reup do
    steps = [
      'docker-compose down',
      'docker-compose up -d',
      'docker-compose exec api bundle exec rake db:migrate',
      'docker-compose exec api bundle exec rake db:test:prepare',
      'docker-compose exec api bundle exec rake search:migrate'
    ]
    steps.each { |step| system(step) }
  end

  task :clean do
    steps = [
      'docker rm $(docker ps -q -f status=exited)',
      'docker rmi $(docker images -q -f dangling=true)',
      'docker volume rm $(docker volume ls -qf dangling=true)'
    ]
    steps.each { |step| system(step) }
  end
end

namespace :logs do
  task :intake do
    system 'docker-compose logs -f ca_intake'
  end
  task :api do
    system 'docker-compose logs -f api'
  end
end
