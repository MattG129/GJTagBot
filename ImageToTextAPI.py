import os
import sys
import requests
from dotenv import dotenv_values

config = dotenv_values("../.env")

ImgURL = sys.argv[1]

ImgData = requests.get(ImgURL).content
with open('../image_name.jpg', 'wb') as Handler:
    Handler.write(ImgData)

URL = 'https://api.api-ninjas.com/v1/imagetotext'
image_file_descriptor = open('../image_name.jpg', 'rb')
files = {'image': image_file_descriptor}
r = requests.post(URL, files=files, headers={'X-Api-Key': config['API_KEY']})

print(r.json())
sys.stdout.flush()