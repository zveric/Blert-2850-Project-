import africastalking  #used ClaudeAI, to discover this library and read the documentation for this library
from decouple import config

def send_sms(phone_number, message):
    africastalking.initialize(

        username = config('AFRICA_TALKING_USERNAME'),
        api_key = config('AFRICA_TALKING_API')

    )

    sms = africastalking.SMS
    response = sms.send(message, [phone_number])

    return response
