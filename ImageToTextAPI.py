import os
import sys
import requests
from dotenv import dotenv_values

config = dotenv_values("../.env")

image_url = sys.argv[1]

img_data = requests.get(image_url).content
with open('../image_name.jpg', 'wb') as handler:
    handler.write(img_data)


api_url = 'https://api.api-ninjas.com/v1/imagetotext'
# response = requests.get(api_url, headers={'X-Api-Key': 'zUpKbVPc+sDiTEDaEIcj+Q==SCvQDa4VvGJYtCnt'})
image_file_descriptor = open('../image_name.jpg', 'rb')
# image_file_descriptor = get_image_from_url('https://cdn.discordapp.com/attachments/1051349596883931139/1089295001172852776/image.png')
files = {'image': image_file_descriptor}
r = requests.post(api_url, files=files, headers={'X-Api-Key': config['API_KEY']})
print(r.json())


sys.stdout.flush()