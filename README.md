# 🌸 Cozy Task Board - Production-Ready Fullstack System

[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS 11](https://img.shields.io/badge/Backend-NestJS%2011-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Playwright](https://img.shields.io/badge/Testing-Playwright-2E8B57?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Orchestration-Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

**Cozy Task Board** là hệ thống quản lý công việc (Task Management) fullstack hoàn chỉnh, được thiết kế theo trường phái **Modern Cozy Productivity** (thân thiện, ấm áp, tối giản, tăng năng suất). Dự án được đóng gói container hóa (Docker standalone), thiết lập hệ thống bảo mật nghiêm ngặt (security-first), tối ưu hóa luồng dữ liệu (RESTful compliance) và tích hợp bộ kiểm thử tự động toàn diện từ Unit Test tới E2E browser automation.

---

## ✨ Điểm Sáng Kiến Trúc & Tối Ưu Hóa (Architecture Decisions)

Dự án được cải tiến sâu sắc và áp dụng các giải pháp kỹ thuật cấp Senior nhằm tối ưu hóa tính mở rộng, bảo mật và trải nghiệm người dùng:

*   **Next.js Dynamic Proxy Rewrites**: Khắc phục triệt để hạn chế "baking" (nướng cứng) biến môi trường tại thời điểm biên dịch (build-time) của Next.js trong Docker. Hệ thống định tuyến client-side API thông qua đường dẫn tương đối `/api/v1` và thực hiện viết lại địa chỉ (rewrites) sang `API_URL_SERVER` ở thời điểm chạy container (runtime), giúp bảo mật IP backend và tránh lỗi CORS.
*   **Trọng số sắp xếp Database (SQL Priority Weights)**: PostgreSQL sắp xếp các trường Enum theo bảng chữ cái. Hệ thống được cải tiến bằng mệnh đề `CASE WHEN` ở lớp Repository để gán trọng số số học (`high` = 3, `medium` = 2, `low` = 1), đảm bảo kết quả lọc theo độ ưu tiên chính xác về mặt logic.
*   **Khắc phục lệch múi giờ Date-picker (Timezone Alignment)**: Đồng bộ hóa định dạng ngày từ UTC sang múi giờ địa phương của trình duyệt người dùng bằng chuẩn ISO `'en-CA'` (`YYYY-MM-DD`), loại bỏ lỗi lệch ngày (Date-shifting) thường gặp khi người dùng sửa đổi công việc.
*   **Bảo mật Shielding & Tuân thủ REST**:
    *   **Bảo vệ cấu trúc hệ thống**: Che giấu (masking) toàn bộ chi tiết mã lỗi truy vấn DB thô (raw query exception) trong môi trường Production để ngăn ngừa rò rỉ cấu trúc cơ sở dữ liệu.
    *   **Rate Limiting**: Chặn các cuộc tấn công brute-force / DDoS API bằng `ThrottlerModule`.
    *   **Bypass HTTP 204**: Tự động nhận diện và bỏ qua đóng gói (wrap) dữ liệu dạng JSON envelope đối với các phản hồi HTTP `204 No Content` theo đúng đặc tả RFC 7231.
*   **Playwright E2E Scoped Locators**: Thiết kế bộ test tự động sử dụng truy vấn ngược XPath (`ancestor::div`) từ tiêu đề duy nhất lên thẻ Card cha. Giải pháp này giúp bộ test hoàn toàn cô lập, không bị xung đột dữ liệu cũ trong DB và vượt qua lỗi ghi đè CSS class của `tailwind-merge` khi cập nhật trạng thái.

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

### 🔴 Backend (NestJS API)
*   **NestJS v11 & TypeScript**: Thiết kế Modular chuẩn kiến trúc SOLID.
*   **TypeORM & PostgreSQL**: Quản lý thực thể cơ sở dữ liệu và đồng bộ hóa schema.
*   **Validation**: `class-validator` & `Joi` schema validation cho biến môi trường.
*   **Tài liệu RESTful API**: Tích hợp **Swagger UI** tại `/api/docs`.
*   **Kiểm thử**: Jest Unit testing (Coverage đạt **>94%**) & Jest E2E API testing.

### 🔵 Frontend (Next.js Client)
*   **Next.js 15 (App Router)**: Hybrid Rendering (Server-side Prefetching kết hợp Client-side React Query).
*   **Tailwind CSS v4**: Biên dịch CSS thế hệ mới siêu nhẹ.
*   **shadcn/ui & Radix UI**: Hệ thống component bo góc tròn capsule (`rounded-3xl`) mang gam màu pastel ấm áp.
*   **TanStack Query v5 (React Query)**: Quản lý server state, kích hoạt **Optimistic Updates** giúp cập nhật UI tức thì trong 0ms.
*   **Framer Motion**: Micro-interactions chuyển động trượt mượt mà khi CRUD hoặc sắp xếp.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
todo-list-fullstack/
├── .github/workflows/        # Cấu hình GitHub Actions CI/CD (Playwright)
├── todo-backend/             # Dự án NestJS API
│   ├── src/
│   │   ├── common/           # Filters, Interceptors, Pipes toàn cục
│   │   ├── config/           # Schema validation cấu hình Joi
│   │   └── todo/             # Entities, Repositories, DTOs, Controllers
│   ├── test/                 # NestJS E2E API tests (Jest & Supertest)
│   └── Dockerfile            # Multi-stage production Dockerfile
│
├── todo-frontend/            # Dự án Next.js 15
│   ├── src/
│   │   ├── app/              # Next.js App Router (Layout & Pages)
│   │   ├── components/       # UI Components & Dashboard layout
│   │   ├── lib/              # Axios, API Client Services
│   │   └── types/            # TypeScript Shared interfaces
│   ├── tests/                # Playwright E2E browser tests
│   ├── playwright.config.ts  # Cấu hình Playwright & webServer
│   └── Dockerfile            # Next.js standalone runner Dockerfile
│
└── docker-compose.yml        # Tệp gom chạy toàn bộ hệ thống ở Local Production
```

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy (Local)

### Yêu Cầu Hệ Thống
*   **Node.js v20+**
*   **pnpm** (`npm install -g pnpm`)
*   **Docker & Docker Compose**

---

### Cách 1: Đóng gói Docker (Môi trường Local Production)
Cách chạy nhanh nhất để kiểm tra tính đồng bộ của toàn bộ hệ thống dưới dạng Container độc lập:

1.  Đứng tại thư mục gốc của dự án (`todo-list-fullstack`):
    ```bash
    docker compose up --build
    ```
2.  Sau khi khởi chạy thành công, truy cập các địa chỉ:
    *   **Frontend**: [http://localhost:3001](http://localhost:3001)
    *   **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
    *   **Tài liệu API Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### Cách 2: Khởi chạy thủ công (Môi trường Development)

#### 1. Khởi động DB PostgreSQL
Di chuyển vào thư mục backend và khởi động database cục bộ qua Docker:
```bash
cd todo-backend
docker compose -f docker-compose.dev.yml up -d
```

#### 2. Cài đặt và Khởi chạy Backend (NestJS)
1.  Cài đặt thư viện & chuẩn bị file biến môi trường:
    ```bash
    cd todo-backend
    pnpm install
    cp .env.example .env.development
    ```
2.  Chạy server dev:
    ```bash
    pnpm start:dev
    ```
3.  Chạy kiểm thử Unit Test & E2E API Test:
    ```bash
    pnpm test          # Chạy Jest unit tests
    pnpm test:e2e      # Chạy Jest integration tests
    pnpm test:cov      # Xem báo cáo độ bao phủ code (Coverage)
    ```

#### 3. Cài đặt và Khởi chạy Frontend (Next.js)
1.  Cài đặt thư viện:
    ```bash
    cd ../todo-frontend
    pnpm install
    ```
2.  Chạy máy chủ phát triển (cổng 3001):
    ```bash
    pnpm dev
    ```

---

## 🧪 Chạy Kiểm Thử Tự Động Toàn Diện (Playwright E2E)

Bộ test tự động Playwright kiểm thử trọn vẹn vòng đời CRUD của ứng dụng (Thêm -> Đánh dấu hoàn thành -> Sửa đổi -> Tìm kiếm/Lọc -> Xóa).

1.  Đảm bảo bạn đã di chuyển vào thư mục `todo-frontend`.
2.  **Khởi chạy test ở Local**:
    ```bash
    # Chạy ẩn danh (Headless mode - Playwright sẽ tự khởi động server Next.js ngầm)
    npx playwright test
    
    # Chạy giao diện tương tác trực tiếp
    npx playwright test --ui
    ```
3.  **Khởi chạy test trên Web đã Deploy (Vercel)**:
    Bạn có thể chạy kiểm thử trực tiếp lên website thật mà không cần bật bất cứ server nào dưới máy:
    *   **Windows (PowerShell)**:
        ```powershell
        $env:TEST_TARGET_URL="https://srt-taskboard-quy.vercel.app"; npx playwright test
        ```
    *   **macOS / Linux**:
        ```bash
        TEST_TARGET_URL=https://srt-taskboard-quy.vercel.app npx playwright test
        ```
4.  Xem báo cáo kết quả chi tiết dưới dạng HTML:
    ```bash
    npx playwright show-report
    ```

---

## 🌐 Triển Khai Lên Môi Trường Cloud (Deployment)

Dự án được tối ưu hóa cho mô hình Cloud Hosting miễn phí và chuyên nghiệp:
*   **Database & Backend (PostgreSQL & NestJS)**: Triển khai trên **Railway** thông qua Dockerfile tự động nhận diện.
*   **Frontend (Next.js 15)**: Triển khai trên **Vercel** thông qua Serverless Functions.

> 📝 Hướng dẫn cấu hình biến môi trường, định tuyến CORS chi tiết từng bước xem tại **[deployment_guide.md](file:///C:/Users/Admin/.gemini/antigravity/brain/6a4cef04-cc51-4b8c-b912-33484c45009d/deployment_guide.md)**.

---

## 📊 Thiết Kế Cơ Sở Dữ Liệu & APIs

### Thực thể cơ sở dữ liệu `todo`
*   `id` (UUID - Primary Key)
*   `title` (VARCHAR(150) - Not Null)
*   `description` (TEXT - Nullable)
*   `status` (ENUM: `'pending'`, `'completed'`)
*   `priority` (ENUM: `'high'`, `'medium'`, `'low'`)
*   `dueDate` (TIMESTAMP - Nullable)
*   `completedAt` (TIMESTAMP - Nullable)
*   `createdAt` & `updatedAt` (TIMESTAMP)
*   `deletedAt` (TIMESTAMP - Soft Delete)

### RESTful API Route Map (`/api/v1/todos`)
*   `GET /todos`: Lấy danh sách Todo (Hỗ trợ phân trang, tìm kiếm mờ, lọc theo trạng thái/độ ưu tiên, sắp xếp động).
*   `GET /todos/stats`: Thống kê tổng quan số lượng task, trạng thái và phần trăm hoàn thành.
*   `GET /todos/:id`: Lấy thông tin chi tiết một task.
*   `POST /todos`: Tạo mới task (Validate dữ liệu nghiêm ngặt).
*   `PATCH /todos/:id`: Cập nhật thông tin/trạng thái task.
*   `DELETE /todos/:id`: Xóa tạm thời (Soft Delete).
