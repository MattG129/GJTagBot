import sys
import json
import itertools
from datetime import datetime
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from google.oauth2 import service_account

try:
    # I would like to try and add brackets here
    def GetTags():

        # This should ultimately read from a file in parent directory
        # Using a scuffed version of Airam's name for now. System for detecting when substrings are 'close enough' to the actual name will be implemented.
        CrewMembers = ['Matt129', 'Casre', 'NovaPulser', 'Alram', 'Ver.Melakal', 'RedBB', 'Airam', 'suzunya']

        MessageID = sys.argv[1]
        
        AttachmentID = sys.argv[2]

        Tagger = sys.argv[3]

        # Will work more on this set up or scrap it if bot can be hosted.
        PostTime = sys.argv[4] #1682811088360
        PostTime = f"{datetime.fromtimestamp(int(f'{PostTime}'[:-3]))}"

        # Find a way to make these into hyperlinks
        ImageURL = f'=HYPERLINK("{sys.argv[5]}", "Image")'
    
        # Combine all text into one string
        Text = sys.argv[6].replace("\'", "\"")
        Text = json.loads(Text)
        Tagged = [[j for j in CrewMembers if j in i['text']] for i in Text]
        Tagged = list(itertools.chain(*Tagged))

        TimeStamp = f'{datetime.today().date()} {datetime.today().strftime("%I:%M %p")}'

        Tags = {
            "values": [
                [Tagger, i, PostTime, TimeStamp, ImageURL, MessageID, AttachmentID]
                for i in Tagged
            ]    
        }

        return Tags

    creds = service_account.Credentials.from_service_account_file(
        filename='../credentials.json', 
        scopes=['https://www.googleapis.com/auth/spreadsheets'])

    Service = build('sheets', 'v4', credentials=creds)

    # When we append to first row the text becomes bold. This should not be the case.
    request = Service.spreadsheets().values().append(
        spreadsheetId='1oN-BFreDodRP0biTo2Bvp3nxQnvnMblW9fCKfcp3jsA', 
        range='Records!A3:E3', 
        valueInputOption='USER_ENTERED', 
        insertDataOption='INSERT_ROWS',
        body=GetTags()
    )

    request.execute()

except Exception as e: 
    print(f'SheetsAPI: {e}')

sys.stdout.flush()