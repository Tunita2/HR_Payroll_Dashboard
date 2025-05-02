# API Testing for HR Payroll Dashboard

Tài liệu này hướng dẫn cách chạy các test case để kiểm tra chức năng của API trong dự án HR Payroll Dashboard.

## Cài đặt

1. Di chuyển vào thư mục tests:

```bash
cd src/tests
```

2. Cài đặt các dependency:

```bash
npm install
```

## Chạy test

Để chạy tất cả các test:

```bash
npm test
```

Để chạy một file test cụ thể:

```bash
npx jest admin-api.test.js
```

## Các test case

### Admin API Tests

1. **GET /departments**

   - Kiểm tra API trả về dữ liệu phòng ban đã được merge từ cả SQL Server và MySQL
   - Kiểm tra xử lý lỗi khi có vấn đề với database

2. **GET /positions**

   - Kiểm tra API trả về dữ liệu vị trí đã được merge từ cả SQL Server và MySQL

3. **GET /attendances**

   - Kiểm tra API trả về dữ liệu điểm danh từ MySQL

4. **GET /salaries**

   - Kiểm tra API trả về dữ liệu lương từ MySQL

5. **GET /dividends**

   - Kiểm tra API trả về dữ liệu cổ tức từ SQL Server

6. **GET /status**

   - Kiểm tra API trả về dữ liệu trạng thái nhân viên từ SQL Server

7. **GET /alerts**

   - Kiểm tra API trả về dữ liệu cảnh báo từ MySQL

8. **POST /notifications/send-payroll**

   - Kiểm tra API gửi email thông báo lương
   - Kiểm tra xử lý lỗi khi thiếu thông tin bắt buộc

9. **Data Synchronization Tests**
   - Kiểm tra đồng bộ dữ liệu giữa SQL Server và MySQL

## Báo cáo test coverage

Sau khi chạy test, bạn có thể xem báo cáo coverage trong thư mục `coverage/lcov-report/index.html`.
