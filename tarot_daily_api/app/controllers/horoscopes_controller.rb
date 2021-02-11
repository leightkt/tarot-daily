class HoroscopesController < ApplicationController

    def daily_horoscope
        @user = User.find(params[:user_id])
        @star_sign = @user.star_sign
        response = RestClient.get("http://horoscope-api.herokuapp.com/horoscope/today/#{@star_sign}")
        result = JSON.parse response
        render json: result
    end

end
