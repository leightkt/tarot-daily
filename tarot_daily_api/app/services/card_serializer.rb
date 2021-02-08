class CardSerializer
    
    def initialize card_object
        @card = card_object
    end     

    def to_serialized_json
        reading = {
            card: @card,
            direction: random_meaning
        }
        reading.to_json
    end

    
    def random_meaning
        meanings_array = ["up", "down"]
        direction = meanings_array.sample()
    end

end