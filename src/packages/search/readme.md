src/
 ├─ packages/
 │   └─ search/
 │       ├─ components/
 │       │   ├─ SearchBar.tsx          # Ô input chính (có xử lý debounce)
 │       │   ├─ SearchDropdown.tsx     # Popup hiển thị 3 cột gợi ý
 │       │   ├─ RecentList.tsx         # Render UI Cá nhân hóa
 │       │   └─ TrendingList.tsx       # Render UI Xu hướng
 │       ├─ hooks/
 │       │   ├─ useRecentSearch.ts     # Logic đọc/ghi localStorage
 │       │   └─ useSearchData.ts       # Logic gọi tRPC lấy Trending/Picks có Cache
 │       └─ index.ts                   # File export chính ra ngoài dùng
 ├─ server/
 │   └─ api/
 │       └─ routers/
 │           └─ search.router.ts       # Backend: tRPC xử lý logic Database
