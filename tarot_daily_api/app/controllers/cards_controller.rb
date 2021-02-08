class CardsController < ApplicationController

    def index
        @cards = Card.all
        render json: @cards
    end
    
    def show
        @card = Card.find(params[:id])
        render json: @card
    end
    
    def random_card
        @card = Card.all.sample(1)
        render json: CardSerializer.new(@card).to_serialized_json
    end
end
