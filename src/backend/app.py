from flask import Flask, request, jsonify
from flask_cors import CORS
from routes import employees_bp,dividends_bp,positions_bp,departments_bp,report_bp
from auth import verify_token, verify_hr

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

#Đăng kí các blueprint
app.register_blueprint(employees_bp)
app.register_blueprint(dividends_bp)
app.register_blueprint(positions_bp)
app.register_blueprint(departments_bp)
app.register_blueprint(report_bp)


if __name__ == "__main__":
    app.run(debug=True)
