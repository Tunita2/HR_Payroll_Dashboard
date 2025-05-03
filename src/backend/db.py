import pyodbc
import mysql.connector

# ✅ Kết nối Sql Server (HUMAN)
def get_sqlserver_connection():
    conn_sqlServer = pyodbc.connect(
        r'DRIVER={ODBC Driver 17 for SQL Server};'
        r'SERVER=DESKTOP-R84OL9S\SQL_SERVER;'  
        r'DATABASE=HUMAN;'
        r'Trusted_Connection=yes;'
    )
    return conn_sqlServer

# ✅ Kết nối MySQL (payroll)
def get_mysql_connection():
    conn_mySql = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Minh0987654321,./",
        database="payroll"
    )
    return conn_mySql
