# frozen_string_literal: true

RSpec.configure do |config|
  config.before(:suite) do |_example|
    raise 'Failed to build modular JS assets!' unless system 'bin/gulp'
  end
end
