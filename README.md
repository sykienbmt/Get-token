# Get Code Cursor AI

Ứng dụng web kiểm tra hộp thư email để nhận mã kích hoạt Cursor AI miễn phí.

## 🚀 Tính năng

- ✅ Kiểm tra hộp thư email theo địa chỉ email
- ✅ Hiển thị danh sách email với preview
- ✅ Xem chi tiết email trong modal popup
- ✅ Hỗ trợ email HTML và text
- ✅ Hiển thị thông tin đính kèm
- ✅ Responsive design cho mobile và desktop
- ✅ Hash email bằng MD5 để bảo mật
- ✅ Loading states và error handling

## 🛠️ Công nghệ sử dụng

- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling với Flexbox và Grid
- **Vanilla JavaScript** - Logic ứng dụng
- **CryptoJS** - Hash MD5 cho email
- **Fetch API** - Gọi API backend

## 📋 Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet
- Server backend API (tùy chọn cho development)

## 🚀 Cách chạy project

### Cách 1: Chạy trực tiếp
1. Clone hoặc tải project về máy
2. Mở file `index.html` bằng trình duyệt

### Cách 2: Sử dụng HTTP Server (Khuyến nghị)
1. Cài đặt Node.js
2. Chạy lệnh:
```bash
npm install
npm start
```
3. Mở trình duyệt tại `http://localhost:3000`

### Cách 3: Sử dụng Live Server (Development)
```bash
npm run dev
```

## 📁 Cấu trúc project

```
cursor-ai-code-getter/
├── index.html          # File HTML chính
├── styles.css          # File CSS styling
├── script.js           # File JavaScript logic
├── package.json        # Cấu hình NPM
└── README.md          # Tài liệu hướng dẫn
```

## 🎨 Giao diện

- **Header**: Tiêu đề "Get Code Cursor AI" với gradient background
- **Form**: Input email và button kiểm tra
- **Email List**: Danh sách email với preview
- **Modal**: Popup xem chi tiết email
- **Responsive**: Tương thích với mobile và desktop

## 🔧 API Integration

Ứng dụng gọi API endpoint:
```
GET https://mailreader.zettix.net/api/request/mail/id/{hash}/
```

Trong đó `{hash}` là MD5 hash của địa chỉ email.

### Response format:
```json
[
  {
    "_id": {"oid": "..."},
    "mail_subject": "Email subject",
    "mail_from": "sender@example.com",
    "mail_timestamp": 1234567890,
    "mail_preview": "Email preview text...",
    "mail_text": "Full email text content",
    "mail_html": "<html>Email HTML content</html>",
    "mail_attachments_count": 2
  }
]
```

## 🔐 Bảo mật

- Email được hash bằng MD5 trước khi gửi lên server
- Không lưu trữ email gốc trên client
- Sanitize HTML content để tránh XSS
- Sử dụng iframe sandbox cho HTML content

## 📱 Responsive Design

- **Desktop**: Layout 2 cột với sidebar
- **Tablet**: Layout 1 cột với navigation
- **Mobile**: Stack layout với touch-friendly buttons

## 🎯 Tối ưu hóa

- **Performance**: Lazy loading cho email content
- **UX**: Loading states và smooth animations
- **Accessibility**: Keyboard navigation và screen reader support
- **SEO**: Meta tags và semantic HTML

## 🚀 Deployment

### GitHub Pages
1. Push code lên GitHub repository
2. Vào Settings > Pages
3. Chọn source branch (main/master)
4. Website sẽ có địa chỉ: `https://username.github.io/repo-name`

### Netlify
1. Kéo thả folder project vào Netlify
2. Hoặc connect với GitHub repository
3. Auto deploy khi có commit mới

### Vercel
1. **Cách 1: Qua Dashboard**
   - Import project từ GitHub
   - Vercel sẽ tự động detect static site
   - Deploy ngay lập tức

2. **Cách 2: Qua CLI**
   ```bash
   npm install -g vercel
   cd cursor-ai-code-getter
   vercel
   ```

3. **Cấu hình tự động**
   - File `vercel.json` đã được cấu hình sẵn
   - Zero-config deployment
   - Automatic HTTPS và CDN

## 🔧 Customization

### Thay đổi màu sắc chủ đạo:
```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #7c3aed;
  --accent-color: #06b6d4;
}
```

### Thay đổi API endpoint:
```javascript
// Trong file script.js - dòng 136
const response = await fetch(`https://your-api-domain.com/api/request/mail/id/${hash}/`);
```

### Thêm tính năng mới:
1. Thêm HTML elements trong `index.html`
2. Thêm styles trong `styles.css`
3. Thêm logic trong `script.js`

## 🐛 Troubleshooting

### Lỗi CORS khi gọi API:
- Cấu hình CORS headers trên server
- Hoặc sử dụng proxy trong development

### Email không hiển thị:
- Kiểm tra format response từ API
- Kiểm tra console để xem error logs

### Styling bị lỗi trên mobile:
- Kiểm tra viewport meta tag
- Test trên multiple devices

### Lỗi Vercel deployment:
- **"No Output Directory"**: File `vercel.json` đã được cấu hình để fix lỗi này
- **Build failed**: Đảm bảo tất cả file trong root directory của project
- **404 errors**: Kiểm tra routing trong `vercel.json`

## 📞 Support

- **Email**: your-email@example.com
- **GitHub**: https://github.com/yourusername/cursor-ai-code-getter
- **Issues**: https://github.com/yourusername/cursor-ai-code-getter/issues

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

Made with ❤️ for Cursor AI community
