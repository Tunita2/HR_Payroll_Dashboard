import pyodbc

def get_connection():
    conn = pyodbc.connect(
        r'DRIVER={ODBC Driver 17 for SQL Server};'
        r'SERVER=DESKTOP-R84OL9S\SQL_SERVER;'  
        r'DATABASE=HUMAN;'
        r'Trusted_Connection=yes;'
    )
    return conn


