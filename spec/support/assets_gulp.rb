RSpec.configure do |config|
  did_gen_assets = false
  build_already_failed = false

  config.around(:example, type: :feature) do |example|
    if !build_already_failed && !did_gen_assets
      build_success = system 'bin/gulp'
      if build_success
        did_gen_assets = true
      else
        build_already_failed = true
      end
    end

    if build_already_failed
      raise 'Failed to build modular JS assets!'
    end

    example.run
  end
end
