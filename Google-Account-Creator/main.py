
from smsactivateru import Sms, SmsTypes, SmsService, GetBalance, GetFreeSlots, GetNumber
import time

print('[SMS]: Launched.')
print('[SMS]: Starting wrapper...')

API_KEY = "442cd408ed9e510fc175181A2A214574"
wrapper = Sms(API_KEY)

print('[SMS]: ...Done.')

# ------------------------------ #

balance = GetBalance().request(wrapper)
print('[SMS]: Current balance -- {}.'.format(balance))

# ------------------------------ #

#getting free slots (count available phone numbers for each services)
available_phones = GetFreeSlots(
	country=78,
	operator=SmsTypes.Operator.any
).request(wrapper)

# show for vk.com, whatsapp and youla.io)
print('[SMS]: There are {} slots available for Google accounts.'.format(available_phones.YouTube.count))

# ------------------------------ #

def get_number():
    activation = GetNumber(
	service=SmsService().Google,
	country=78,
	operator=SmsTypes.Operator.any
    ).request(wrapper)

    # show activation id and phone for reception sms
    print('id: {} phone: {}'.format(str(activation.id), str(activation.phone_number)))

    return activation

def got_code(code):
    with open('../Google-Account-Creator/communication.txt', 'a') as f:
        f.write(str(code)+"\n")
        f.close()


log = []
call = ""

while True :
    time.sleep(1)

    with open('../Google-Account-Creator/communication.txt', 'r') as f:
        log = f.read().splitlines()

    if (len(log) > 0):
        print(log[len(log) - 1])
        call = log[len(log) - 1]
    
    if (call == "REQUIRE_NUMBER"):
        print("Number required...")
        activation = get_number()
        number = str(activation.phone_number)
        #activation.cancel()
        with open('../Google-Account-Creator/communication.txt', 'a') as f:
            f.write(number+"\n")
            f.close()

    if (call == "REQUIRE_CODE"):
        activation.was_sent()
        activation.wait_code(callback=got_code, wrapper=wrapper, not_end=True)
        print('[SMS]: Waiting for code.')
        activation.wait_code(callback=got_code, wrapper=wrapper)
        #code = get_code()
        #with open('../Google-Account-Creator/communication.txt', 'a') as f:
        #    f.write(code)
        #    f.close()