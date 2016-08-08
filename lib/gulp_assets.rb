# frozen_string_literal: true
require 'json'
require 'uri'
require 'pathname'

module GulpAssets
  module Helper # :nodoc:
    APP_ROOT = Pathname.new(
      File.expand_path('../../', __FILE__)
    ).freeze

    # Returns the location of the gulp served assets.
    def gulp_asset_path(name)
      asset_filename = filename(name)
      uri(asset_filename).to_s
    end

    # Returns the location of the gulp server. Whilst in development
    # these are provided by an instance of a gulp server on port 4857
    # and all other cases assets are provided by the file system from
    # the public assets folder.
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

    # Returns the filenames actual versioned name that is
    # stored in the manifest file.
    def filename(filename)
      if ENV['RAILS_ENV'] == 'development' || ENV['RAIL_ENV'] == 'test'
        return filename
      else
        return manifest[filename]
      end
    end

    # Returns the asset manifest file.
    # The asset maifest file contains the original filename and the
    # versioned filename. This can be used to translate the original filename
    # to the actual filename.
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
