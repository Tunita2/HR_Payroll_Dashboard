# Employee API Testing for HR Payroll Dashboard

Hướng dẫn chạy các bài kiểm thử cho API Employee và kiểm tra đồng bộ dữ liệu giữa hai hệ thống HUMAN (SQL Server) và payroll (MySQL).

## Các file kiểm thử

1. **employee-api.test.js**: Kiểm thử chức năng cơ bản của các API endpoint
2. **employee-data-sync.test.js**: Kiểm thử đồng bộ dữ liệu giữa hai hệ thống
3. **employee-api-validation.test.js**: Kiểm thử xác thực dữ liệu và xử lý lỗi

## Cài đặt

```bash
cd src/tests
npm install
```

## Chạy kiểm thử

### Chạy tất cả các bài kiểm thử

```bash
npx jest employee-api.test.js employee-data-sync.test.js employee-api-validation.test.js
```

### Chạy từng file kiểm thử

```bash
npx jest employee-api.test.js
```

```bash
npx jest employee-data-sync.test.js
```

```bash
npx jest employee-api-validation.test.js
```

### Chạy với báo cáo coverage

```bash
npx jest --coverage employee-api.test.js employee-data-sync.test.js employee-api-validation.test.js
```

## Các bài kiểm thử

### Employee API Tests (employee-api.test.js)

1. **GET /profile**
   - Kiểm tra lấy thông tin hồ sơ nhân viên
   - Xử lý khi không tìm thấy nhân viên

2. **PUT /profile**
   - Kiểm tra cập nhật thông tin hồ sơ nhân viên

3. **GET /payroll**
   - Kiểm tra lấy dữ liệu lương và điểm danh

4. **Đồng bộ dữ liệu**
   - Kiểm tra tính nhất quán dữ liệu giữa hai hệ thống

### Employee Data Sync Tests (employee-data-sync.test.js)

1. **Tính nhất quán dữ liệu**
   - Kiểm tra dữ liệu nhân viên nhất quán giữa hai hệ thống

2. **Liên kết dữ liệu lương**
   - Kiểm tra dữ liệu lương được liên kết chính xác với nhân viên

3. **Tính nhất quán sau khi cập nhật**
   - Kiểm tra dữ liệu vẫn nhất quán sau khi cập nhật

### Employee API Validation Tests (employee-api-validation.test.js)

1. **Cấu trúc phản hồi API**
   - Kiểm tra cấu trúc dữ liệu trả về từ API profile
   - Kiểm tra cấu trúc dữ liệu trả về từ API payroll

2. **Xác thực dữ liệu đầu vào**
   - Kiểm tra xác thực các trường bắt buộc
   - Kiểm tra xác thực định dạng email

3. **Xác thực người dùng**
   - Kiểm tra yêu cầu xác thực khi truy cập API

4. **Xử lý lỗi**
   - Kiểm tra xử lý lỗi cơ sở dữ liệu

## Ghi chú

- Các bài kiểm thử sử dụng mock để giả lập tương tác với cơ sở dữ liệu
- Kiểm tra cả chức năng API, tính nhất quán dữ liệu và xác thực dữ liệu
