require 'json'
require 'uri'

module GulpAssets
  module Helper
    def gulp_asset_path(name)
      URI::HTTP.build(host: request.host, port: 4857, path: "/assets/#{name}").to_s
    end
  end
end
