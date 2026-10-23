/* ABC-27 Gallery · bộ lọc, phóng to, thu gọn */
(() => {
  "use strict";
  const figures = [
    {image:"chart-1.png",page:5,category:"Tổng quan",title:"Hình 1 · Giá đóng cửa và dải High–Low",description:"Diễn biến giá đóng cửa và khoảng dao động trong ngày.",wide:true},
    {image:"chart-2.png",page:9,category:"Mô phỏng",title:"Hình 2a · Nến 37",description:"Khung hình mô phỏng tại nến 37, ngày 181–185.",wide:true},
    {image:"chart-3.png",page:9,category:"Mô phỏng",title:"Hình 2b · Nến 73",description:"Khung hình mô phỏng cuối năm tại nến 73, ngày 361–365.",wide:true},
    {image:"chart-4.png",page:11,category:"Theo tháng",title:"Hình 3 · Giá trung bình theo tháng",description:"Biểu đồ cột và thanh sai số ± một độ lệch chuẩn.",wide:false},
    {image:"chart-5.png",page:11,category:"Theo tháng",title:"Hình 4 · Boxplot theo tháng",description:"Phân bố giá theo từng tháng.",wide:false},
    {image:"chart-6.png",page:12,category:"Theo tháng",title:"Hình 5 · Biên độ theo tháng",description:"Chênh lệch Max − Min của từng tháng.",wide:false},
    {image:"chart-7.png",page:13,category:"Theo quý",title:"Hình 6 · So sánh thống kê theo quý",description:"Trung bình, độ lệch chuẩn và hệ số biến thiên.",wide:true},
    {image:"chart-8.png",page:14,category:"Theo quý",title:"Hình 7 · Boxplot theo quý",description:"Phân bố giá theo bốn quý.",wide:false},
    {image:"chart-9.png",page:16,category:"Bất thường",title:"Hình 8 · Đóng cửa chạm trần/sàn",description:"Số ngày đóng cửa chạm trần hoặc sàn theo tháng.",wide:false},
    {image:"chart-10.png",page:17,category:"Phân bố",title:"Hình 9 · Histogram hai nửa năm",description:"So sánh phân bố giá Q1–Q2 và Q3–Q4.",wide:true},
    {image:"chart-11.png",page:18,category:"Xu hướng",title:"Hình 10 · Xu hướng giá cả năm",description:"Xu hướng giá và vị trí giá thấp nhất.",wide:true},
    {image:"chart-12.png",page:20,category:"Giải thích",title:"Hình 11 · Quy tắc màu sắc",description:"Minh họa nến và đường giá khi so sánh với tham chiếu.",wide:true}
  ];
  const categories = ["Tất cả", ...new Set(figures.map(f => f.category))];
  const imageUrl = file => new URL("assets/" + file, document.baseURI).href;
  function init() {
    const tabs = document.querySelector(".abc-gallery__tabs");
    const grid = document.getElementById("abc-gallery-grid");
    const count = document.getElementById("galleryCount");
    const dialog = document.querySelector(".abc-gallery__dialog");
    // Tự tạo nút khi trang HTML đang dùng phiên bản cũ.
    const header = document.querySelector(".abc-gallery__header");
    let collapse = document.getElementById("galleryCollapse");
    if (!collapse && header) {
      collapse = document.createElement("button");
      collapse.type = "button";
      collapse.id = "galleryCollapse";
      collapse.className = "abc-gallery__collapse";
      collapse.setAttribute("aria-controls", "abc-gallery-grid");
      header.appendChild(collapse);
    }
    if (collapse && header && collapse.parentElement !== header) header.appendChild(collapse);
    if (collapse) {
      collapse.style.setProperty("display", "inline-flex", "important");
      collapse.style.setProperty("visibility", "visible", "important");
    }
    if (!tabs || !grid) return;
    let selected = "Tất cả";
    let collapsed = false;
    const openImage = f => {
      if (!dialog || typeof dialog.showModal !== "function") {
        window.open(imageUrl(f.image), "_blank", "noopener");
        return;
      }
      dialog.querySelector("img").src = imageUrl(f.image);
      dialog.querySelector("img").alt = f.title;
      dialog.querySelector("figcaption").textContent = f.title;
      dialog.showModal();
    };
    function renderTabs() {
      tabs.replaceChildren();
      categories.forEach(category => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "abc-gallery__tab abc-gallery__filter" + (category === selected ? " active" : "");
        button.textContent = category;
        button.setAttribute("aria-pressed", String(category === selected));
        button.addEventListener("click", () => { selected = category; renderTabs(); renderCards(); });
        tabs.appendChild(button);
      });
    }
    function renderCards() {
      const filtered = figures.filter(f => selected === "Tất cả" || f.category === selected);
      grid.replaceChildren();
      filtered.forEach(f => {
        const card = document.createElement("article");
        card.className = "abc-gallery__card" + (f.wide ? " abc-gallery__card--wide" : "");
        const zoom = document.createElement("button");
        zoom.type = "button";
        zoom.className = "abc-gallery__open abc-gallery__zoom";
        zoom.setAttribute("aria-label", "Phóng to " + f.title);
        const img = document.createElement("img");
        img.src = imageUrl(f.image);
        img.alt = f.title;
        img.loading = "lazy";
        img.addEventListener("error", () => {
          zoom.replaceChildren();
          const error = document.createElement("div");
          error.className = "abc-gallery__error";
          error.textContent = "Không tải được ảnh: assets/" + f.image;
          zoom.appendChild(error);
          zoom.disabled = true;
        }, {once:true});
        zoom.appendChild(img);
        zoom.addEventListener("click", () => openImage(f));
        const info = document.createElement("div");
        info.className = "abc-gallery__content abc-gallery__info";
        const category = document.createElement("span");
        category.className = "abc-gallery__category";
        category.textContent = f.category;
        const title = document.createElement("h3");
        title.textContent = f.title;
        const desc = document.createElement("p");
        desc.textContent = f.description;
        const meta = document.createElement("small");
        meta.className = "abc-gallery__meta";
        meta.textContent = "Trang " + f.page + " · Báo cáo ABC-27";
        info.append(category,title,desc,meta);
        card.append(zoom,info);
        grid.appendChild(card);
      });
      if (count) count.textContent = `Hiển thị ${filtered.length} / ${figures.length} biểu đồ`;
    }
    function updateCollapse() {
      grid.classList.toggle("is-collapsed", collapsed);
      grid.hidden = collapsed;
      if (collapse) {
        collapse.textContent = collapsed ? "+ Xem tất cả" : "− Thu gọn";
        collapse.setAttribute("aria-expanded", String(!collapsed));
      }
    }
    if (collapse) collapse.addEventListener("click", () => { collapsed = !collapsed; updateCollapse(); });
    if (dialog) {
      const close = dialog.querySelector(".abc-gallery__close");
      if (close) close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
    }
    renderTabs(); renderCards(); updateCollapse();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
