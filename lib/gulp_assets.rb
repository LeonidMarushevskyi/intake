# frozen_string_literal: true
require 'json'
require 'uri'
require 'pathname'

module GulpAssets
  module Helper # :nodoc:
    APP_ROOT = Pathname.new(
      File.expand_path('../../', __FILE__)
    ).freeze

    def gulp_asset_path(name)
      asset_filename = filename(name)
      uri(asset_filename).to_s
    end

    def uri(filename)
      if ENV['RAILS_ENV'] == 'development'
        return URI::HTTP.build(
          host: request.host,
          port: 4857,
          path: "/assets/#{filename}"
        )
      else
        return URI::Generic.build(path: "/assets/#{filename}")
      end
    end

    def filename(filename)
      if ENV['RAILS_ENV'] == 'development' || ENV['RAIL_ENV'] == 'test'
        return filename
      else
        return manifest[filename]
      end
    end

    def manifest
      manifest_path = APP_ROOT.join(
        'public',
        'assets',
        'rev-manifest.json'
      ).freeze
      manifest_file = File.exist?(manifest_path)
      raise "Cannot find asset manifest: #{manifest_path}" unless manifest_file
      @manifest ||= JSON.parse(File.read(manifest_path))
    end
  end
end
