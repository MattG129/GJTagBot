import sys
import json
import itertools
from datetime import datetime
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/documents.readonly']
SHEET_ID = '1oN-BFreDodRP0biTo2Bvp3nxQnvnMblW9fCKfcp3jsA'
DOCUMENT_ID = '1xh41blzPdXi64NrwkSlNWk1ygUtG5TE6NwJ_PKQc7lk'

creds = service_account.Credentials.from_service_account_file(
    filename = '../credentials.json', 
    scopes   = SCOPES
)

def GetNames():  
    Service = build('docs', 'v1', credentials=creds)

    # Retrieve the documents contents from the Docs service.
    Document = Service.documents().get(documentId=DOCUMENT_ID).execute()

    Elements = Document.get('body')['content']
    
    Names = []
    for i in Elements:
        if 'paragraph' in i:
            ParagraphElements = i.get('paragraph').get('elements')
            for j in ParagraphElements:
                TextRun = j.get('textRun')
                if TextRun:
                    Names.append(TextRun.get('content')[:-1])
    
    return Names

def GetTags():    
    CrewMembers = GetNames()

    MessageID = sys.argv[1]
    
    AttachmentID = sys.argv[2]

    Tagger = sys.argv[3]

    # Will work more on this set up or scrap it if bot can be hosted.
    PostTime = sys.argv[4] #1682811088360
    PostTime = f"{datetime.fromtimestamp(int(f'{PostTime}'[:-3]))}"

    ImageURL = f'=HYPERLINK("{sys.argv[5]}", "Image")'

    Text = sys.argv[6]
    Tagged = [
        i for i in CrewMembers 
        if i in Text
            and f'{i}\'s' not in Text
    ]

    TimeStamp = f'{datetime.today().date()} {datetime.today().strftime("%I:%M %p")}'

    Tags = {
        "values": [
            [Tagger, i, PostTime, TimeStamp, ImageURL, MessageID, AttachmentID]
            for i in Tagged
        ]    
    }

    return Tags


try:    
    Service = build('sheets', 'v4', credentials=creds)

    request = Service.spreadsheets().values().append(
        spreadsheetId       = SHEET_ID, 
        range               = 'Records!A3:E3', 
        valueInputOption    = 'USER_ENTERED', 
        insertDataOption    = 'INSERT_ROWS',
        body                = GetTags()
    )

    request.execute()

except Exception as e: 
    print(f'SheetsAPI: {e}')

sys.stdout.flush()