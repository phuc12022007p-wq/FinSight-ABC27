
/* ============================================
   GÓC NHÌN DỮ LIỆU - ABC-27
   DASHBOARD GALLERY - MẪU 2
============================================ */

// DANH SÁCH 12 BIỂU ĐỒ GỐC

const abcFigures = [
  {
    image: "chart-1.png",
    page: 5,
    category: "Tổng quan",
    title: "Hình 1 · Giá đóng cửa và dải High–Low",
    description: "Diễn biến giá đóng cửa và khoảng dao động trong ngày.",
    wide: true
  },
  {
    image: "chart-2.png",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2a · Nến 37",
    description: "Khung hình mô phỏng tại nến 37, ngày 181–185.",
    wide: false
  },
  {
    image: "chart-3.png",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2b · Nến 73",
    description: "Khung hình mô phỏng tại nến 73, ngày 361–365.",
    wide: false
  },
  {
    image: "chart-4.png",
    page: 11,
    category: "Theo tháng",
    title: "Hình 3 · Giá trung bình theo tháng",
    description: "Giá trung bình và độ lệch chuẩn theo tháng.",
    wide: false
  },
  {
    image: "chart-5.png",
    page: 11,
    category: "Theo tháng",
    title: "Hình 4 · Boxplot theo tháng",
    description: "Phân bố giá theo từng tháng.",
    wide: false
  },
  {
    image: "chart-6.png",
    page: 12,
    category: "Theo tháng",
    title: "Hình 5 · Biên độ theo tháng",
    description: "Chênh lệch Max − Min theo tháng.",
    wide: false
  },
  {
    image: "chart-7.png",
    page: 13,
    category: "Theo quý",
    title: "Hình 6 · Thống kê theo quý",
    description: "So sánh các chỉ số thống kê theo quý.",
    wide: true
  },
  {
    image: "chart-8.png",
    page: 14,
    category: "Theo quý",
    title: "Hình 7 · Boxplot theo quý",
    description: "Phân bố giá theo bốn quý.",
    wide: false
  },
  {
    image: "chart-9.png",
    page: 16,
    category: "Bất thường",
    title: "Hình 8 · Giá chạm trần/sàn",
    description: "Số ngày đóng cửa chạm trần hoặc sàn.",
    wide: false
  },
  {
    image: "chart-10.png",
    page: 17,
    category: "Phân bố",
    title: "Hình 9 · Histogram hai nửa năm",
    description: "So sánh phân bố giá giữa hai nửa năm.",
    wide: true
  },
  {
    image: "chart-11.png",
    page: 18,
    category: "Xu hướng",
    title: "Hình 10 · Xu hướng giá cả năm",
    description: "Diễn biến xu hướng giá trong năm.",
    wide: true
  },
  {
    image: "chart-12.png",
    page: 20,
    category: "Giải thích",
    title: "Hình 11 · Quy tắc màu sắc",
    description: "Giải thích quy tắc màu trong biểu đồ.",
    wide: true
  }
];

// KHỞI TẠO THƯ VIỆN

function initializeABCGallery() {

  const root = document.getElementById("abc-gallery");

  if (!root || root.dataset.initialized === "true") {
    return;
  }

  const tabs = root.querySelector(".abc-gallery__tabs");
  const grid = root.querySelector(".abc-gallery__grid");
  const count = root.querySelector("#galleryCount");
  const collapseButton = root.querySelector("#galleryCollapse");

  const dialog = root.querySelector(".abc-gallery__dialog");
  const bigImage = dialog?.querySelector("img");
  const caption = dialog?.querySelector("figcaption");
  const closeButton = dialog?.querySelector(".abc-gallery__close");

  if (
    !tabs || !grid || !count || !collapseButton ||
    !dialog || !bigImage || !caption || !closeButton
  ) {
    console.error("Thiếu thành phần của thư viện biểu đồ.");
    return;
  }

  root.dataset.initialized = "true";

  const baseURL = new URL("./", document.baseURI);

  function getImageURL(filename) {
    return new URL("assets/" + filename, baseURL).href;
  }

  let activeFilter = "Tất cả";
  let isCollapsed = false;

  const filters = [
    "Tất cả",
    "Tổng quan",
    "Mô phỏng",
    "Theo tháng",
    "Theo quý",
    "Bất thường",
    "Phân bố",
    "Xu hướng",
    "Giải thích"
  ];

  // TẠO NÚT LỌC

  filters.forEach(filter => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "abc-gallery__filter";
    button.textContent = filter;
    button.dataset.filter = filter;
    button.setAttribute(
      "aria-pressed",
      String(filter === activeFilter)
    );

    button.addEventListener("click", () => {

      activeFilter = filter;

      // Tự mở lại khi chọn nhóm
      if (isCollapsed) {
        isCollapsed = false;
        updateCollapse();
      }

      updateFilters();
      renderGallery();

    });

    tabs.appendChild(button);

  });

  function updateFilters() {

    tabs.querySelectorAll(".abc-gallery__filter").forEach(
      button => {

        const selected =
          button.dataset.filter === activeFilter;

        button.classList.toggle("active", selected);

        button.setAttribute(
          "aria-pressed",
          String(selected)
        );

      }
    );

  }

  // TẠO THẺ BIỂU ĐỒ

  function createFigureCard(item) {

    const figure = document.createElement("figure");

    figure.className = "abc-gallery__card";

    if (item.wide) {
      figure.classList.add("abc-gallery__card--wide");
    }

    const zoomButton = document.createElement("button");

    zoomButton.type = "button";
    zoomButton.className = "abc-gallery__zoom";

    zoomButton.setAttribute(
      "aria-label",
      "Phóng to " + item.title
    );

    const image = document.createElement("img");

    image.src = getImageURL(item.image);
    image.alt = item.title;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {

      image.style.display = "none";

      const error = document.createElement("p");

      error.className = "abc-gallery__error";
      error.textContent =
        "Không tải được hình: " + item.image;

      zoomButton.appendChild(error);

    });

    zoomButton.appendChild(image);

    // PHÓNG TO KHI NHẤN VÀO HÌNH

    zoomButton.addEventListener("click", () => {

      if (!image.complete || image.naturalWidth === 0) {
        return;
      }

      bigImage.src = image.src;
      bigImage.alt = item.title;
      caption.textContent = item.title;

      if (!dialog.open) {
        dialog.showModal();
      }

    });

    const info = document.createElement("figcaption");

    info.className = "abc-gallery__info";

    const meta = document.createElement("div");

    meta.className = "abc-gallery__meta";
    meta.textContent =
      item.category + " · Trang " + item.page;

    const title = document.createElement("h3");

    title.textContent = item.title;

    const description = document.createElement("p");

    description.textContent = item.description;

    info.append(meta, title, description);

    figure.append(zoomButton, info);

    return figure;

  }

  // HIỂN THỊ THEO BỘ LỌC

  function renderGallery() {

    const visibleFigures = abcFigures.filter(item => {
      return activeFilter === "Tất cả" ||
             item.category === activeFilter;
    });

    grid.replaceChildren();

    visibleFigures.forEach(item => {
      grid.appendChild(createFigureCard(item));
    });

    count.textContent =
      "Hiển thị " +
      visibleFigures.length +
      " / " +
      abcFigures.length +
      " biểu đồ";

  }

  // THU GỌN / MỞ RỘNG

  function updateCollapse() {

    grid.hidden = isCollapsed;

    collapseButton.textContent = isCollapsed
      ? "+ Mở rộng"
      : "− Thu gọn";

    collapseButton.setAttribute(
      "aria-expanded",
      String(!isCollapsed)
    );

  }

  collapseButton.addEventListener("click", () => {

    isCollapsed = !isCollapsed;

    updateCollapse();

  });

  // ĐÓNG CỬA SỔ PHÓNG TO

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", event => {

    if (event.target === dialog) {
      dialog.close();
    }

  });

  // CHẠY LẦN ĐẦU

  updateFilters();
  renderGallery();
  updateCollapse();

  console.log(
    "ABC-27 Dashboard Gallery: " +
    abcFigures.length +
    " biểu đồ đã được tải."
  );

}

// CHẠY SAU KHI HTML SẴN SÀNG

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeABCGallery,
    { once: true }
  );

} else {

  initializeABCGallery();

}
