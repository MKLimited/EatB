# EatB — Nutrition & Fitness Companion

> **EatB** là ứng dụng di động hỗ trợ người dùng xây dựng thói quen sống khỏe thông qua việc theo dõi dinh dưỡng, khám phá công thức món ăn, quản lý danh sách đi chợ và ghi nhận hoạt động luyện tập.

[![React Native](https://img.shields.io/badge/React%20Native-Mobile%20App-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Development-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**Repository:** https://github.com/MKLimited/EatB

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Chức năng chính](#chức-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt và chạy ứng dụng](#cài-đặt-và-chạy-ứng-dụng)
- [Cấu hình Supabase](#cấu-hình-supabase)
- [Dữ liệu](#dữ-liệu)
- [Bảo mật](#bảo-mật)
- [Tình trạng dự án](#tình-trạng-dự-án)

## Giới thiệu

EatB được phát triển như một dự án ứng dụng di động, hướng đến việc tập trung các công cụ theo dõi dinh dưỡng và vận động vào một nơi. Người dùng có thể xem thông tin món ăn, quản lý hoạt động cá nhân và theo dõi tiến độ hình thành thói quen sống khỏe.

Dự án sử dụng **React Native và Expo** cho ứng dụng di động, kết hợp **Supabase** cho các thành phần backend được cấu hình trong dự án.

## Chức năng chính

### Dành cho người dùng

- **Tài khoản và hồ sơ:** đăng ký, đăng nhập, khôi phục mật khẩu, onboarding, hồ sơ cá nhân và cài đặt.
- **Dashboard:** xem tổng quan và truy cập nhanh các khu vực chính của ứng dụng.
- **Thực phẩm và công thức:** duyệt danh sách món ăn, xem thông tin chi tiết và dữ liệu dinh dưỡng có trong ứng dụng.
- **Hỗ trợ về thực phẩm bằng AI:** dự án có Supabase Edge Function `food-chat`; chức năng cần được cấu hình đầy đủ với dịch vụ AI và các biến môi trường tương ứng.
- **Luyện tập:** xem danh sách bài tập theo nhóm, cơ mục tiêu, mức độ khó và giá trị MET có trong dữ liệu bài tập.
- **Danh sách đi chợ:** hỗ trợ quản lý các nguyên liệu cần chuẩn bị.
- **Theo dõi sức khỏe và tiến độ:** các màn hình Health Score, Progress và History giúp người dùng theo dõi thông tin được ghi nhận trong ứng dụng.
- **Cộng đồng:** khu vực bài đăng cộng đồng và các luồng báo cáo nội dung.

### Dành cho quản trị viên

Dự án có các màn hình quản trị liên quan đến tổng quan, bài đăng, báo cáo và nhật ký kiểm tra. Việc sử dụng các màn hình này phụ thuộc vào cấu hình quyền truy cập và dữ liệu trên backend.

> Lưu ý: danh sách trên mô tả các khu vực có trong mã nguồn. Mức độ hoạt động của từng chức năng phụ thuộc vào cấu hình Supabase, dữ liệu và môi trường chạy thực tế.

## Công nghệ sử dụng

| Thành phần            | Công nghệ / mục đích                      |
| --------------------- | ----------------------------------------- |
| Mobile app            | React Native, Expo                        |
| Ngôn ngữ              | JavaScript và TypeScript                  |
| Backend               | Supabase                                  |
| Server-side functions | Supabase Edge Functions (Deno/TypeScript) |
| Dữ liệu               | Các tệp CSV trong thư mục `data/`         |

## Cấu trúc dự án

```text
EatB/
├── eatb-app/                         # Mã nguồn ứng dụng mobile
│   ├── App.js                        # Điểm khởi chạy ứng dụng
│   ├── app.json                      # Cấu hình Expo
│   ├── package.json                  # Dependencies và scripts
│   └── src/
│       ├── screens/                  # Các màn hình ứng dụng
│       ├── components/               # Các thành phần giao diện dùng chung
│       ├── hooks/                    # Custom hooks
│       ├── utils/                    # Hàm tiện ích và xử lý dữ liệu
│       └── constants/                # Hằng số và cấu hình giao diện
├── data/
│   ├── FINAL FOOD DATASET/
│   │   └── all_recipes.csv           # Dữ liệu công thức món ăn
│   └── Workout/
│       └── workouts_import.csv       # Dữ liệu bài tập
├── supabase/
│   ├── config.toml                   # Cấu hình Supabase CLI
│   └── functions/
│       ├── food-chat/                # Edge Function cho luồng chat về thực phẩm
│       └── delete-account/           # Edge Function xử lý xóa tài khoản
└── README.md
```

## Yêu cầu môi trường

Trước khi chạy dự án, cần chuẩn bị:

- [Node.js](https://nodejs.org/) phiên bản LTS tương thích với các dependencies trong `eatb-app/package.json`.
- npm (được cài kèm Node.js).
- [Expo Go](https://expo.dev/go/) trên thiết bị di động hoặc Android Emulator/iOS Simulator phù hợp.
- Một dự án Supabase đã được thiết lập nếu muốn sử dụng các chức năng cần backend.

## Cài đặt và chạy ứng dụng

### 1. Clone repository

```bash
git clone https://github.com/MKLimited/EatB.git
cd EatB
```

### 2. Cài đặt dependencies

```bash
cd eatb-app
npm install
```

### 3. Cấu hình Supabase

Kiểm tra tệp cấu hình Supabase được ứng dụng sử dụng, hiện nằm tại:

```text
eatb-app/src/screens/supabase.js
```

Cấu hình URL và **publishable/anon key** của dự án Supabase của bạn theo cách mà mã nguồn hiện tại yêu cầu. Đảm bảo các bảng, chính sách Row Level Security (RLS), quyền truy cập và chức năng backend cần thiết đã được thiết lập.

### 4. Khởi động Expo

```bash
npx expo start
```

Sau khi Expo khởi động:

- Quét mã QR bằng Expo Go nếu môi trường và dependencies của dự án tương thích.
- Hoặc nhấn `a` để mở Android Emulator đã cài đặt.
- Để xem các tùy chọn chạy khác, tham khảo thông báo trong terminal của Expo.

Nếu gặp lỗi dependency hoặc cấu hình, hãy kiểm tra phiên bản trong `package.json`, cài đặt tương thích với Expo SDK của dự án và xem thông báo lỗi đầy đủ trước khi nâng cấp package.

## Cấu hình Supabase

Thư mục `supabase/` có cấu hình Supabase CLI và các Edge Functions. Để chạy backend trong môi trường riêng:

1. Tạo hoặc chọn dự án Supabase.
2. Cấu hình database schema, bảng, chính sách RLS, Auth và Storage mà ứng dụng yêu cầu.
3. Cài đặt và đăng nhập Supabase CLI nếu cần triển khai Edge Functions.
4. Liên kết thư mục dự án với Supabase project phù hợp.
5. Thiết lập các secrets cần thiết cho từng function theo tên biến môi trường được sử dụng trong mã nguồn function; không ghi giá trị secret trực tiếp vào README.
6. Triển khai các function cần dùng, ví dụ:

```bash
supabase functions deploy food-chat
supabase functions deploy delete-account
```

Việc deploy function không tự động tạo toàn bộ database schema hoặc các chính sách bảo mật. Hãy xác nhận các cấu hình database cần thiết đã có trên Supabase trước khi kiểm thử ứng dụng.

## Dữ liệu

| Tệp                                       | Nội dung                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| `data/FINAL FOOD DATASET/all_recipes.csv` | Dữ liệu công thức món ăn                                                   |
| `data/Workout/workouts_import.csv`        | Dữ liệu bài tập, gồm tên bài tập, nhóm bài tập, MET, cơ mục tiêu và độ khó |

Trước khi sử dụng hoặc phân phối lại các bộ dữ liệu, hãy kiểm tra nguồn gốc, giấy phép và yêu cầu ghi công của từng nguồn dữ liệu.

## Bảo mật

- Không commit file `.env`, mật khẩu, access token, API key bí mật hoặc thông tin đăng nhập cơ sở dữ liệu.
- Không đưa Supabase `service_role` key vào ứng dụng mobile. Ứng dụng client chỉ nên sử dụng publishable/anon key với chính sách RLS phù hợp.
- Lưu các API key của dịch vụ AI hoặc dịch vụ bên thứ ba trong Supabase Edge Function Secrets hoặc hệ thống quản lý secrets phù hợp.
- Kiểm tra các tệp sinh tự động trong `supabase/.temp/` và không đưa chúng lên repository nếu không cần thiết.
- Không xem thông tin dinh dưỡng, lượng calo hoặc điểm sức khỏe trong ứng dụng là lời khuyên y tế chuyên môn.

## Tình trạng dự án

EatB hiện là dự án học thuật đang được phát triển. Một số chức năng có thể cần cấu hình thêm backend, dữ liệu hoặc quyền truy cập trước khi hoạt động đầy đủ trên môi trường mới.

## Đóng góp và phản hồi

Bạn có thể tạo [GitHub Issue](https://github.com/MKLimited/EatB/issues) để báo lỗi hoặc đề xuất cải tiến. Khi gửi báo lỗi, hãy mô tả các bước tái hiện, kết quả mong đợi, kết quả thực tế và thông báo lỗi liên quan; không đăng thông tin bí mật hoặc dữ liệu cá nhân.

---

**Repository:** [MKLimited/EatB](https://github.com/MKLimited/EatB)
