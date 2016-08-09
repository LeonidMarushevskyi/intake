module API
  def self.connection
    @connection ||= Faraday.new(url: ENV['API_URL']) do |connection|
      connection.response :json, :content_type => /\bjson$/
      connection.adapter Faraday.default_adapter
    end
  end
end
