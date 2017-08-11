# frozen_string_literal: true

require 'json'
require 'uri'
require 'pathname'

module GulpAssets
  module Helper # :nodoc:
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
      asset_path = "#{ENV.fetch('BASE_PATH', '')}/assets/#{filename}"
      if Rails.env.development?
        return URI::HTTP.build(
          host: request.host,
          port: 4857,
          path: asset_path
        )
      end
      URI::Generic.build(path: asset_path)
    end

    # Returns the filenames actual versioned name that is
    # stored in the manifest file.
    def filename(filename)
      return filename if Rails.env.development? || Rails.env.test?
      manifest[filename]
    end

    # Returns the asset manifest file.
    # The asset maifest file contains the original filename and the
    # versioned filename. This can be used to translate the original filename
    # to the actual filename.
    def manifest
      manifest_path = Rails.root.join(
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
