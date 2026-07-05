# 🌸 Cozy Task Board - Fullstack Task Management System

Một hệ thống quản lý công việc (Task Management System) fullstack hoàn chỉnh, được thiết kế theo phong cách **Modern Cozy Productivity** (ấm áp, thân thiện, tăng năng suất). Dự án được đóng gói hoàn chỉnh bằng Docker và tích hợp các chuẩn bảo mật, tối ưu hóa hiệu năng từ cơ sở dữ liệu tới giao diện người dùng.

Dự án này được chia làm 2 phần chính nằm trong cùng một repository:
*   **Backend (`todo-backend`)**: Xây dựng bằng NestJS, PostgreSQL và TypeORM.
*   **Frontend (`todo-frontend`)**: Xây dựng bằng Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui (Base UI) và TanStack Query v5.

---

## 🚀 Công Nghệ Sử Dụng

### Backend (NestJS API)
*   **NestJS Framework**: Thiết kế Module/Controller/Service chuẩn hóa kiến trúc.
*   **TypeORM & PostgreSQL**: Quản lý cơ sở dữ liệu quan hệ, tự động đồng bộ hóa schema.
*   **Security & Protection**:
    *   **Helmet**: Bảo vệ HTTP headers chống lại các lỗ hổng bảo mật phổ biến.
    *   **CORS**: Cấu hình chia sẻ tài nguyên nguồn gốc chéo an toàn.
    *   **Rate Limiting (`ThrottlerModule`)**: Giới hạn tấn công brute-force / DDoS API.
*   **Joi Schema Validation**: Kiểm tra kiểu dữ liệu và cấu hình môi trường nghiêm ngặt.
*   **Global Filters & Interceptors**:
    *   `transform.interceptor.ts`: Chuẩn hóa dữ liệu trả về dạng `{ success: true, data: ... }`.
    *   `http-exception.filter.ts`: Đồng bộ định dạng phản hồi lỗi.
*   **Swagger UI**: Tài liệu hóa RESTful API tự động tại `/api/docs`.
*   **Jest**: Unit testing đạt độ bao phủ (Coverage) **>94%**.

### Frontend (Next.js 15 Client)
*   **Next.js 15 App Router**: Tận dụng tối đa Server Components và Client Components.
*   **Tailwind CSS v4**: Động cơ CSS thế hệ mới, tối ưu hóa kích thước build.
*   **shadcn/ui (Base-Nova Preset)**: Style mật độ hiển thị cao, các nút capsule bo tròn lớn (`rounded-3xl`), giao diện cozy pastel thư giãn.
*   **TanStack Query v5 (React Query)**: Quản lý server state, cache dữ liệu và tích hợp cơ chế **Optimistic Update** (cập nhật giao diện lập tức trước khi API phản hồi).
*   **React Hook Form & Zod**: Validate dữ liệu forms ở client chặt chẽ.
*   **Framer Motion**: Tạo các micro-interactions tinh tế, chuyển động trượt mượt mà khi thêm, sắp xếp và xóa tasks.
*   **next-themes**: Hỗ trợ Dark/Light mode chuyển màu dịu mắt (smooth blend transition 300ms).

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
todo-list-fullstack/
├── todo-backend/             # Dự án NestJS API
│   ├── src/
│   │   ├── common/           # Filters, Interceptors, Pipes toàn cục
│   │   ├── config/           # Schema cấu hình môi trường (Joi)
│   │   └── todo/             # Thực thể DB, DTOs, Controllers, Services
│   ├── test/                 # Kịch bản kiểm thử (Jest)
│   ├── Dockerfile            # Cấu hình build image Backend
│   └── docker-compose.dev.yml# Khởi động PostgreSQL & pgAdmin môi trường dev
│
├── todo-frontend/            # Dự án Next.js 15
│   ├── src/
│   │   ├── app/              # Các trang chính (Page, Layout)
│   │   ├── components/       # Các UI Component cô lập (shadcn & dashboard)
│   │   ├── lib/              # Cấu hình Axios Client, API Services
│   │   └── types/            # Khai báo kiểu TypeScript dùng chung
│   ├── Dockerfile            # Cấu hình build image Next.js (Standalone output)
│   └── next.config.ts        # Kích hoạt output: "standalone"
│
└── docker-compose.yml        # Orchestration đóng gói toàn bộ hệ thống (Prod)
```

---

## 🛠️ Cài Đặt và Khởi Chạy

### Yêu Cầu Hệ Thống
*   Đã cài đặt **Node.js v20+**
*   Đã cài đặt **pnpm** (`npm install -g pnpm`)
*   Đã cài đặt **Docker** & **Docker Compose**

---

### Cách 1: Khởi chạy bằng Docker (Môi trường Production)

Đây là cách đơn giản nhất để chạy toàn bộ hệ thống (Database, Backend, Frontend) chỉ với 1 câu lệnh duy nhất. Hệ thống sẽ tự động liên kết các container vào cùng mạng bridge và chờ Database khởi động hoàn tất trước khi chạy API.

1.  Đứng tại thư mục gốc của dự án (`todo-list-fullstack`):
    ```bash
    docker compose up --build
    ```
2.  Sau khi khởi động thành công, các địa chỉ hoạt động:
    *   **Frontend**: [http://localhost:3001](http://localhost:3001)
    *   **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
    *   **Tài liệu Swagger**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### Cách 2: Khởi chạy thủ công (Môi trường Development)

Dùng cách này khi bạn cần chỉnh sửa code trực tiếp (Hot Reload) hoặc chạy các bài test.

#### 1. Khởi động Cơ Sở Dữ Liệu PostgreSQL
```bash
cd todo-backend
docker compose -f docker-compose.dev.yml up -d
```
*Lưu ý: Cơ sở dữ liệu sẽ chạy trên cổng `5432` với tài khoản mặc định `postgres/postgres`.*

#### 2. Khởi chạy và Kiểm thử Backend (NestJS)
1.  Di chuyển vào thư mục `todo-backend`:
    ```bash
    cd todo-backend
    pnpm install
    ```
2.  Tạo file cấu hình môi trường `.env.development` (đã có sẵn file mẫu):
    ```bash
    cp .env.example .env.development
    ```
3.  Khởi chạy chế độ Watch Mode (tự tải lại khi sửa code):
    ```bash
    pnpm start:dev
    ```
4.  Chạy các bài kiểm thử tự động (Unit Tests):
    ```bash
    pnpm test          # Chạy test
    pnpm test:cov      # Xem độ bao phủ code (Coverage)
    ```

#### 3. Khởi chạy Frontend (Next.js)
1.  Di chuyển vào thư mục `todo-frontend`:
    ```bash
    cd todo-frontend
    pnpm install
    ```
2.  Khởi chạy máy chủ phát triển (chạy trên cổng `3001` để tránh trùng với backend):
    ```bash
    pnpm dev
    ```
3.  Mở trình duyệt, truy cập [http://localhost:3001](http://localhost:3001) để bắt đầu sử dụng.

---

## 📊 Mô Hình Cơ Sở Dữ Liệu & APIs

### Bảng Dữ Liệu `todo`
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | `UUID` | Khóa chính (Tự động tạo) |
| `title` | `VARCHAR(150)` | Tiêu đề công việc (Bắt buộc) |
| `description` | `TEXT` | Mô tả chi tiết (Tùy chọn) |
| `status` | `ENUM` | Trạng thái (`pending`, `completed`) |
| `priority` | `ENUM` | Độ ưu tiên (`high`, `medium`, `low`) |
| `dueDate` | `TIMESTAMP` | Hạn chót hoàn thành (Tùy chọn) |
| `completedAt` | `TIMESTAMP` | Thời điểm hoàn thành (Tự động cập nhật) |
| `createdAt` | `TIMESTAMP` | Thời gian tạo (Tự động) |
| `updatedAt` | `TIMESTAMP` | Thời gian cập nhật (Tự động) |
| `deletedAt` | `TIMESTAMP` | Thời gian xóa tạm - Soft Delete (Tự động) |

### Danh Sách Các APIs RESTful (`/api/v1/todos`)
*   `GET /todos`: Lấy danh sách Todo (Hỗ trợ phân trang, tìm kiếm mờ theo title/description, lọc theo status/priority, sắp xếp theo thuộc tính động).
*   `GET /todos/stats`: Aggregated query thống kê tổng số task, đã hoàn thành, đang chờ xử lý, tỷ lệ % hoàn thành và số lượng task theo từng mức độ ưu tiên.
*   `GET /todos/:id`: Lấy chi tiết một task.
*   `POST /todos`: Tạo mới task (Kiểm tra dữ liệu đầu vào bằng class-validator).
*   `PATCH /todos/:id`: Cập nhật thông tin task (Hỗ trợ thay đổi status tự động cập nhật `completedAt`).
*   `DELETE /todos/:id`: Xóa tạm thời task (Soft Delete).
