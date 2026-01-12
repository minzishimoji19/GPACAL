import { useState } from 'react';

export default function HelpGuide() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    { id: 'getting-started', label: 'Bắt đầu', icon: '🚀' },
    { id: 'courses', label: 'Quản lý môn học', icon: '📚' },
    { id: 'curriculum', label: 'Chương trình học', icon: '📖' },
    { id: 'target-gpa', label: 'GPA mục tiêu', icon: '🎯' },
    { id: 'planning', label: 'Planning', icon: '📅' },
    { id: 'import-export', label: 'Import/Export', icon: '💾' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              📖 Hướng dẫn sử dụng
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeSection === 'getting-started' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                🚀 Bắt đầu sử dụng
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Giới thiệu
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  GPA Calculator là ứng dụng web giúp bạn tính điểm GPA theo thang 4.0, quản lý
                  môn học, và lập kế hoạch đăng ký môn để đạt mục tiêu GPA mong muốn.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Các tính năng chính
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Dashboard:</strong> Xem tổng quan GPA, biểu đồ phân bố điểm
                  </li>
                  <li>
                    <strong>Quản lý môn học:</strong> Thêm, sửa, xóa môn học đã học
                  </li>
                  <li>
                    <strong>Chương trình học:</strong> Quản lý toàn bộ môn trong chương trình đào
                    tạo
                  </li>
                  <li>
                    <strong>GPA mục tiêu:</strong> Tính toán GPA cần đạt và gợi ý đăng ký môn
                  </li>
                  <li>
                    <strong>Planning:</strong> Lập kế hoạch với các môn học dự kiến
                  </li>
                  <li>
                    <strong>Import/Export:</strong> Xuất nhập dữ liệu để backup hoặc chuyển đổi
                  </li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Quy đổi điểm
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-600">
                        <th className="text-left py-2 text-gray-800 dark:text-gray-200">
                          Điểm hệ 10
                        </th>
                        <th className="text-left py-2 text-gray-800 dark:text-gray-200">GPA 4.0</th>
                        <th className="text-left py-2 text-gray-800 dark:text-gray-200">Điểm chữ</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr>
                        <td className="py-2">8.5 - 10.0</td>
                        <td className="py-2">4.0</td>
                        <td className="py-2">A</td>
                      </tr>
                      <tr>
                        <td className="py-2">8.0 - &lt;8.5</td>
                        <td className="py-2">3.5</td>
                        <td className="py-2">B+</td>
                      </tr>
                      <tr>
                        <td className="py-2">7.0 - &lt;8.0</td>
                        <td className="py-2">3.0</td>
                        <td className="py-2">B</td>
                      </tr>
                      <tr>
                        <td className="py-2">6.5 - &lt;7.0</td>
                        <td className="py-2">2.5</td>
                        <td className="py-2">C+</td>
                      </tr>
                      <tr>
                        <td className="py-2">5.5 - &lt;6.5</td>
                        <td className="py-2">2.0</td>
                        <td className="py-2">C</td>
                      </tr>
                      <tr>
                        <td className="py-2">5.0 - &lt;5.5</td>
                        <td className="py-2">1.5</td>
                        <td className="py-2">D+</td>
                      </tr>
                      <tr>
                        <td className="py-2">4.0 - &lt;5.0</td>
                        <td className="py-2">1.0</td>
                        <td className="py-2">D</td>
                      </tr>
                      <tr>
                        <td className="py-2">&lt;4.0</td>
                        <td className="py-2">0.0</td>
                        <td className="py-2">F</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'courses' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                📚 Quản lý môn học
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Thêm môn học
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Vào tab <strong>"Danh sách môn"</strong></li>
                  <li>Điền thông tin vào form:
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li><strong>Mã môn (tùy chọn):</strong> Mã môn học nếu có (VD: MATH101)</li>
                      <li><strong>Tên môn học:</strong> Tên đầy đủ của môn học</li>
                      <li><strong>Tín chỉ:</strong> Số tín chỉ (1-6)</li>
                      <li><strong>Điểm hệ 10:</strong> Điểm từ 0-10 (có thể nhập số thập phân)</li>
                      <li><strong>Kỳ học:</strong> Kỳ học đã học (VD: HK1-2023)</li>
                    </ul>
                  </li>
                  <li>Nhấn <strong>"Thêm môn học"</strong> hoặc nhấn <strong>Enter</strong> ở bất kỳ ô nào</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Sửa môn học
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click icon <strong>✏️</strong> ở môn học muốn sửa</li>
                  <li>Sửa thông tin trực tiếp trong bảng</li>
                  <li>Nhấn <strong>✓</strong> để lưu hoặc <strong>✕</strong> để hủy</li>
                  <li>Hoặc nhấn <strong>Enter</strong> để lưu, <strong>Escape</strong> để hủy</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Xóa và nhân đôi
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click icon <strong>🗑️</strong> để xóa môn học</li>
                  <li>Click icon <strong>📋</strong> để nhân đôi môn học (tạo bản sao)</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Sắp xếp và lọc
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click vào header cột để sắp xếp (tên môn, tín chỉ, điểm, kỳ học)</li>
                  <li>Chọn chế độ xem: <strong>"Theo kỳ học"</strong> hoặc <strong>"Tất cả"</strong></li>
                  <li>Ở chế độ "Tất cả", có thể lọc theo kỳ học bằng dropdown</li>
                  <li>Ở chế độ "Theo kỳ học", click vào header kỳ để thu gọn/mở rộng</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'curriculum' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                📖 Chương trình học
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Tải chương trình học
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Có 3 cách để nhập chương trình học:
                </p>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  1. Paste từ Excel/Google Sheets
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Copy dữ liệu từ Excel/Sheets (bao gồm cả header)</li>
                  <li>Click nút <strong>"Paste từ Excel"</strong></li>
                  <li>Dán dữ liệu vào textarea</li>
                  <li>Click <strong>"Thêm vào chương trình"</strong></li>
                </ol>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200">
                    <strong>Định dạng:</strong> CSV hoặc TSV với các cột:
                    <br />
                    courseCode, courseName, credits, recommendedSemester (optional), category
                    (optional), difficulty (optional)
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Ví dụ:</strong>
                    <br />
                    courseCode courseName credits
                    <br />
                    MATH101 Toán cao cấp 1 3
                    <br />
                    CS101 Nhập môn lập trình 3
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  2. Import File
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click nút <strong>"Import File"</strong></li>
                  <li>Chọn file CSV, TSV hoặc JSON</li>
                  <li>File sẽ được tự động parse và thêm vào chương trình</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  3. Template MIS
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click nút <strong>"Template MIS"</strong></li>
                  <li>Template 130 tín chỉ sẽ được thêm vào</li>
                  <li>Bạn có thể chỉnh sửa, thêm, xóa môn học theo nhu cầu</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Quản lý chương trình
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click <strong>✏️</strong> để sửa thông tin môn học</li>
                  <li>Click <strong>🗑️</strong> để xóa môn khỏi chương trình</li>
                  <li>Click <strong>"+ Thêm môn"</strong> để thêm môn mới</li>
                  <li>Click <strong>"Export CSV"</strong> để xuất dữ liệu</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Thông tin môn học
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Mã môn:</strong> Mã định danh duy nhất (VD: MATH101)</li>
                  <li><strong>Tên môn:</strong> Tên đầy đủ</li>
                  <li><strong>Tín chỉ:</strong> Số tín chỉ</li>
                  <li><strong>Kỳ đề xuất:</strong> Kỳ học được đề xuất (optional)</li>
                  <li><strong>Loại:</strong> Đại cương, Chuyên ngành, Tự chọn, Thực tập, Đồ án</li>
                  <li><strong>Độ khó:</strong> 1-5 (1=dễ nhất, 5=khó nhất)</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'target-gpa' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                🎯 GPA mục tiêu & Gợi ý đăng ký
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Tính GPA mục tiêu
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Vào tab <strong>"GPA mục tiêu"</strong></li>
                  <li>Nhập <strong>GPA mục tiêu</strong> (0-4.0) hoặc chọn preset (3.2, 3.4, 3.6, 3.8)</li>
                  <li>Nhập <strong>Tổng tín chỉ chương trình</strong> (tự động lấy từ chương trình học nếu đã nhập)</li>
                  <li>Click <strong>"Tính toán"</strong></li>
                  <li>Xem kết quả: GPA cần đạt cho các môn còn lại</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Gợi ý đăng ký môn
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Sau khi tính GPA mục tiêu, nếu đã có chương trình học, bạn sẽ thấy phần <strong>"Gợi ý đăng ký & điểm cần đạt"</strong>.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Cấu hình
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Chiến lược:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>Dễ nhất trước: Ưu tiên môn dễ, ít tín chỉ</li>
                      <li>Tác động lớn nhất: Ưu tiên môn nhiều tín chỉ</li>
                      <li>Cân bằng: Kết hợp cả hai yếu tố</li>
                    </ul>
                  </li>
                  <li><strong>Số kỳ muốn plan:</strong> Số kỳ học muốn lập kế hoạch (1-6)</li>
                  <li><strong>Max tín chỉ/kỳ:</strong> Số tín chỉ tối đa mỗi kỳ (mặc định 18)</li>
                  <li><strong>Baseline GPA:</strong> GPA giả định cho các môn ngoài plan (2.0-3.5)</li>
                  <li><strong>Chế độ tính toán:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>Đơn giản: Phân bổ GPA đều hoặc điều chỉnh theo độ khó</li>
                      <li>Tối ưu: Sử dụng thuật toán greedy để tối ưu effort</li>
                    </ul>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Kết quả
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Danh sách môn được gợi ý đăng ký</li>
                  <li>GPA cần đạt cho từng môn</li>
                  <li>Điểm chữ tương ứng (A, B+, B, ...)</li>
                  <li>Khoảng điểm hệ 10 cần đạt</li>
                  <li>Click <strong>"Áp dụng vào Planned Courses"</strong> để chuyển sang Planning</li>
                </ul>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    ⚠️ <strong>Lưu ý:</strong> Đây là gợi ý toán học dựa trên công thức. Kết quả thực tế có thể khác do tỷ lệ đánh giá từng môn học.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'planning' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                📅 Planning - Kế hoạch học tập
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Thêm môn học dự kiến
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Vào tab <strong>"Planning"</strong></li>
                  <li>Điền form thêm môn (tương tự như thêm môn đã học)</li>
                  <li>Môn học sẽ được đánh dấu là <strong>"dự kiến"</strong></li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Tính GPA dự kiến
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Checkbox <strong>"Bao gồm môn dự kiến"</strong> để bật/tắt tính toán</li>
                  <li>Khi bật: GPA sẽ tính cả môn đã học và môn dự kiến</li>
                  <li>Khi tắt: Chỉ tính môn đã học</li>
                  <li>Xem <strong>GPA dự kiến</strong> và <strong>Tổng tín chỉ</strong> sau khi hoàn thành</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Quản lý môn dự kiến
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Sửa, xóa, nhân đôi môn dự kiến tương tự như môn đã học</li>
                  <li>Có thể chuyển môn dự kiến thành môn đã học bằng cách sửa và bỏ đánh dấu "dự kiến"</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'import-export' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                💾 Import/Export dữ liệu
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Export dữ liệu
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Vào tab <strong>"Import/Export"</strong></li>
                  <li>Click <strong>"Export JSON"</strong> để xuất file JSON</li>
                  <li>Hoặc click <strong>"Export CSV"</strong> để xuất file CSV</li>
                  <li>File sẽ được tải xuống máy tính</li>
                </ol>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Import dữ liệu
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Import JSON
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click <strong>"Import JSON"</strong></li>
                  <li>Chọn file JSON đã export trước đó</li>
                  <li>Dữ liệu sẽ được thêm vào (không ghi đè dữ liệu hiện có)</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Import CSV
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click <strong>"Import CSV"</strong></li>
                  <li>Chọn file CSV với định dạng: courseName, credits, score10, semester</li>
                  <li>Dữ liệu sẽ được parse và thêm vào</li>
                </ol>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <strong>Định dạng CSV:</strong>
                    <br />
                    courseName,credits,score10,semester
                    <br />
                    "Toán cao cấp 1",3,8.5,"HK1-2023"
                    <br />
                    "Lập trình",3,7.5,"HK1-2023"
                  </p>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Backup và khôi phục
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Export thường xuyên để backup dữ liệu</li>
                  <li>Dữ liệu được lưu tự động trong LocalStorage của trình duyệt</li>
                  <li>Nếu xóa cache trình duyệt, dữ liệu sẽ mất nếu chưa export</li>
                  <li>Import để khôi phục từ file backup</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                  Reset dữ liệu
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click nút <strong>"Reset"</strong> ở header</li>
                  <li>Xác nhận để xóa toàn bộ dữ liệu</li>
                  <li><strong>⚠️ Cảnh báo:</strong> Hành động này không thể hoàn tác!</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

