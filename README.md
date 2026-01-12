# GPA Calculator - Tính điểm đại học theo thang 4.0

Ứng dụng web tính điểm/GPA theo chuẩn thang 4.0, phù hợp với cách tính điểm đại học theo tín chỉ.

## ✨ Tính năng

### Core Features
- ✅ **Nhập và quản lý môn học**: Form thêm môn, table với sửa inline, xóa, nhân đôi, sắp xếp
- ✅ **Dashboard**: Hiển thị GPA tích lũy (4.0 và 10.0), tổng quality points, tổng tín chỉ
- ✅ **Biểu đồ**: Bar chart và Pie chart phân bố điểm chữ theo tín chỉ
- ✅ **GPA mục tiêu**: Tính GPA cần đạt cho các môn còn lại để đạt mục tiêu
- ✅ **What-if/Planning**: Thêm môn học dự kiến và tính GPA dự kiến
- ✅ **Import/Export**: Export và Import dữ liệu dạng JSON và CSV
- ✅ **Dark mode**: Chuyển đổi giao diện sáng/tối
- ✅ **Lọc theo kỳ**: Lọc và xem môn học theo từng kỳ học
- ✅ **Auto-save**: Tự động lưu dữ liệu vào LocalStorage

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js 16+ và npm/yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy ứng dụng (development)

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

File build sẽ nằm trong thư mục `dist/`

### Preview build

```bash
npm run preview
```

## 📊 Công thức quy đổi điểm

Điểm hệ 10 → GPA 4.0 và Letter Grade:

- **8.5 – 10.0** => 4.0 (A)
- **8.0 – <8.5** => 3.5 (B+)
- **7.0 – <8.0** => 3.0 (B)
- **6.5 – <7.0** => 2.5 (C+)
- **5.5 – <6.5** => 2.0 (C)
- **5.0 – <5.5** => 1.5 (D+)
- **4.0 – <5.0** => 1.0 (D)
- **<4.0** => 0.0 (F)

## 🧮 Công thức tính GPA

### GPA tích lũy (thang 4.0)
```
GPA = Σ(GPA4 × tín chỉ) / Σ(tín chỉ)
```

### GPA mục tiêu
```
Required GPA = (Target GPA × Total Credits - Current Quality Points) / Remaining Credits
```

Trong đó:
- **Quality Points** = GPA4 × tín chỉ
- **Current Quality Points** = tổng quality points của các môn đã học

## 🛠️ Công nghệ sử dụng

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **TailwindCSS** - Styling
- **Recharts** - Biểu đồ
- **LocalStorage** - Lưu trữ dữ liệu

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── CourseForm.tsx
│   ├── CourseTable.tsx
│   ├── Dashboard.tsx
│   ├── TargetGPACalculator.tsx
│   ├── PlanningTool.tsx
│   └── ImportExport.tsx
├── utils/            # Utility functions
│   ├── gpa.ts        # GPA calculation logic
│   ├── storage.ts    # LocalStorage & Import/Export
│   └── chart.ts      # Chart data processing
├── types.ts          # TypeScript types
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 💡 Hướng dẫn sử dụng

1. **Thêm môn học**: Vào tab "Danh sách môn", điền form và click "Thêm môn học"
2. **Sửa môn học**: Click icon ✏️ trong bảng để sửa inline
3. **Xem Dashboard**: Tab "Dashboard" hiển thị GPA và biểu đồ
4. **Tính GPA mục tiêu**: Tab "GPA mục tiêu", nhập target GPA và tổng tín chỉ chương trình
5. **Planning**: Tab "Planning" để thêm môn học dự kiến và tính GPA dự kiến
6. **Import/Export**: Tab "Import/Export" để xuất/nhập dữ liệu

## 📝 Lưu ý

- Dữ liệu được tự động lưu vào LocalStorage của trình duyệt
- Có thể export/import để backup hoặc chuyển dữ liệu
- Reset sẽ xóa toàn bộ dữ liệu (không thể hoàn tác)

