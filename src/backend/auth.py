from flask import request, jsonify
import jwt as pyjwt
from functools import wraps

# JWT Secret Key - phải giống với secret key trong Node.js
JWT_SECRET = "123456"

def verify_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print("🔥 verify_token thật đang chạy")

        # Kiểm tra token trong header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer TOKEN format
            except IndexError:
                return jsonify({'error': 'Token không hợp lệ'}), 401
        
        if not token:
            return jsonify({'error': 'Token không tồn tại'}), 401
        
        try:
            # Giải mã token
            payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload
        except pyjwt.ExpiredSignatureError:
            return jsonify({'error': 'Token đã hết hạn'}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({'error': 'Token không hợp lệ'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def verify_hr(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Đảm bảo token đã được xác thực
        if not hasattr(request, 'user'):
            return jsonify({'error': 'Chưa xác thực token'}), 401
        
        print(f"User role: {request.user.get('role')}")

        # Kiểm tra role
        if request.user.get('role') not in ['hr', 'admin']:
            return jsonify({'error': 'Không có quyền truy cập. Chỉ HR mới được phép.'}), 403
        
        return f(*args, **kwargs)
    
    return decorated
