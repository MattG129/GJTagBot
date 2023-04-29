import os.path
from datetime import datetime
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from google.oauth2 import service_account

TimeStamp = f'{datetime.today().date()} {datetime.today().strftime("%I:%M %p")}'

Values = {
    "values":[
        ['Xia', 'Waffle', 'today', TimeStamp, 'image url', 'Waffle']
    ]    
}

creds = service_account.Credentials.from_service_account_file(
    filename='../credentials.json', 
    scopes=['https://www.googleapis.com/auth/spreadsheets'])

Service = build('sheets', 'v4', credentials=creds)

request = Service.spreadsheets().values().append(
    spreadsheetId='1oN-BFreDodRP0biTo2Bvp3nxQnvnMblW9fCKfcp3jsA', 
    range='Records!A2:E2', 
    valueInputOption='RAW', 
    insertDataOption='INSERT_ROWS',
    body=Values)

request.execute()