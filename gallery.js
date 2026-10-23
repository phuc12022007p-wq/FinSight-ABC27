
/* =====================================================
   GÓC NHÌN DỮ LIỆU - ABC-27
   THƯ VIỆN BIỂU ĐỒ TỪ BÁO CÁO PYTHON NÂNG CAO

   Tác giả: Huỳnh Thanh Phúc
   Năm: 2026

   Cấu trúc ảnh:
   assets/chart-1.png
   assets/chart-2.png
   ...
   assets/chart-12.png
===================================================== */


/* =====================================================
   1. DANH SÁCH BIỂU ĐỒ
===================================================== */

const abcFigures = [
  {
    image: "chart-1.png",
    page: 5,
    category: "Tổng quan",
    title: "Hình 1 · Giá đóng cửa và dải High–Low",
    description:
      "Diễn biến giá đóng cửa và khoảng dao động trong ngày.",
    wide: true
  },
  {
    image: "chart-2.png",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2a · Nến 37",
    description:
      "Khung hình mô phỏng tại nến 37, ngày 181–185.",
    wide: true
  },
  {
    image: "chart-3.png",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2b · Nến 73",
    description:
      "Khung hình mô phỏng cuối năm tại nến 73, ngày 361–365.",
    wide: true
  },
  {
    image: "chart-4.png",
    page: 11,
    category: "Theo tháng",
    title: "Hình 3 · Giá trung bình theo tháng",
    description:
      "Biểu đồ cột và thanh sai số ± một độ lệch chuẩn.",
    wide: false
  },
  {
    image: "chart-5.png",
    page: 11,
    category: "Theo tháng",
    title: "Hình 4 · Boxplot theo tháng",
    description:
      "Phân bố giá theo từng tháng.",
    wide: false
  },
  {
    image: "chart-6.png",
    page: 12,
    category: "Theo tháng",
    title: "Hình 5 · Biên độ theo tháng",
    description:
      "Chênh lệch Max − Min của từng tháng.",
    wide: false
  },
  {
    image: "chart-7.png",
    page: 13,
    category: "Theo quý",
    title: "Hình 6 · So sánh thống kê theo quý",
    description:
      "Trung bình, độ lệch chuẩn và hệ số biến thiên.",
    wide: true
  },
  {
    image: "chart-8.png",
    page: 14,
    category: "Theo quý",
    title: "Hình 7 · Boxplot theo quý",
    description:
      "Phân bố giá theo bốn quý.",
    wide: false
  },
  {
    image: "chart-9.png",
    page: 16,
    category: "Bất thường",
    title: "Hình 8 · Đóng cửa chạm trần/sàn",
    description:
      "Số ngày đóng cửa chạm trần hoặc sàn theo tháng.",
    wide: false
  },
  {
    image: "chart-10.png",
    page: 17,
    category: "Phân bố",
    title: "Hình 9 · Histogram hai nửa năm",
    description:
      "So sánh phân bố giá Q1–Q2 và Q3–Q4.",
    wide: true
  },
  {
    image: "chart-11.png",
    page: 18,
    category: "Xu hướng",
    title: "Hình 10 · Xu hướng giá cả năm",
    description:
      "Xu hướng giá và vị trí giá thấp nhất.",
    wide: true
  },
  {
    image: "chart-12.png",
    page: 20,
    category: "Giải thích",
    title: "Hình 11 · Quy tắc màu sắc",
    description:
      "Minh họa nến và đường giá khi so sánh với tham chiếu.",
    wide: true
  }
];


/* =====================================================
   2. KHỞI TẠO THƯ VIỆN
===================================================== */

function initializeABCGallery() {

  const root = document.getElementById("abc-gallery");

  if (!root) {
    console.warn("ABC-27: Không tìm thấy #abc-gallery.");
    return;
  }

  // Tránh khởi tạo nhiều lần
  if (root.dataset.initialized === "true") {
    return;
  }

  const grid = root.querySelector(".abc-gallery__grid");
  const tabs = root.querySelector(".abc-gallery__tabs");
  const dialog = root.querySelector(".abc-gallery__dialog");

  if (!grid || !tabs || !dialog) {
    console.error("ABC-27: Thiếu cấu trúc HTML thư viện.");
    return;
  }

  const bigImage = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(
    ".abc-gallery__close"
  );

  if (!bigImage || !caption || !closeButton) {
    console.error("ABC-27: Thiếu thành phần phóng to.");
    return;
  }

  root.dataset.initialized = "true";

  grid.replaceChildren();
  tabs.replaceChildren();


  /* =================================================
     3. XÁC ĐỊNH ĐƯỜNG DẪN ẢNH

     Tương thích GitHub Pages:
     /Goc-Nhin-Du-Lieu/assets/chart-1.png
  ================================================= */

  const baseURL = new URL("./", window.location.href);

  function getImageURL(filename) {
    return new URL(
      "assets/" + filename,
      baseURL
    ).href;
  }


  /* =================================================
     4. TẠO BỘ LỌC
  ================================================= */

  const filters = [
    "Tất cả",
    ...new Set(
      abcFigures.map(item => item.category)
    )
  ];

  filters.forEach(label => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "abc-gallery__tab";
    button.textContent = label;

    button.setAttribute(
      "aria-pressed",
      String(label === "Tất cả")
    );

    button.addEventListener("click", () => {

      tabs.querySelectorAll(
        ".abc-gallery__tab"
      ).forEach(btn => {

        btn.setAttribute(
          "aria-pressed",
          String(btn === button)
        );

      });

      grid.querySelectorAll(
        ".abc-gallery__card"
      ).forEach(card => {

        card.hidden =
          label !== "Tất cả" &&
          card.dataset.category !== label;

      });

    });

    tabs.appendChild(button);

  });


  /* =================================================
     5. TẠO 12 THẺ BIỂU ĐỒ
  ================================================= */

  abcFigures.forEach((figureData, index) => {

    const imageURL = getImageURL(figureData.image);

    const figure = document.createElement("figure");

    figure.className = "abc-gallery__card";
    figure.dataset.category = figureData.category;
    figure.dataset.wide = String(figureData.wide);


    /* NÚT PHÓNG TO */

    const zoomButton = document.createElement("button");

    zoomButton.type = "button";
    zoomButton.className = "abc-gallery__zoom";

    zoomButton.setAttribute(
      "aria-label",
      "Phóng to " + figureData.title
    );


    /* HÌNH ẢNH */

    const img = document.createElement("img");

    img.alt = figureData.title;
    img.loading = "lazy";
    img.decoding = "async";

    // Giúp hình hiển thị đầy đủ
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.objectFit = "contain";

    img.addEventListener("load", () => {

      console.log(
        `ABC-27: Đã tải hình ${index + 1}`,
        imageURL
      );

    });


    /* THÔNG BÁO NẾU ẢNH BỊ LỖI */

    img.addEventListener("error", () => {

      console.error(
        `ABC-27: Không tải được hình ${index + 1}`,
        imageURL
      );

      img.style.display = "none";

      const errorBox = document.createElement("div");

      errorBox.style.padding = "28px";
      errorBox.style.textAlign = "center";
      errorBox.style.color = "#c0392b";

      const message = document.createElement("p");

      message.textContent =
        "Không tải được ảnh: " + figureData.image;

      const link = document.createElement("a");

      link.href = imageURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Mở ảnh trực tiếp ↗";

      errorBox.append(message, link);
      zoomButton.appendChild(errorBox);

    });

    // Gán src sau khi đã đăng ký sự kiện
    img.src = imageURL;

    zoomButton.appendChild(img);


    /* PHÓNG TO */

    zoomButton.addEventListener("click", () => {

      if (!img.complete || img.naturalWidth === 0) {
        return;
      }

      bigImage.src = imageURL;
      bigImage.alt = figureData.title;
      caption.textContent = figureData.title;

      if (!dialog.open) {
        dialog.showModal();
      }

    });


    /* THÔNG TIN BIỂU ĐỒ */

    const info = document.createElement("figcaption");

    info.className = "abc-gallery__info";

    const meta = document.createElement("div");

    meta.className = "abc-gallery__meta";

    meta.textContent =
      figureData.category +
      " · Trang " +
      figureData.page +
      " của PDF";

    const title = document.createElement("h3");

    title.textContent = figureData.title;

    const description = document.createElement("p");

    description.textContent = figureData.description;

    info.append(meta, title, description);

    figure.append(zoomButton, info);

    grid.appendChild(figure);

  });


  /* =================================================
     6. ĐÓNG CỬA SỔ PHÓNG TO
  ================================================= */

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", event => {

    if (event.target === dialog) {
      dialog.close();
    }

  });


  /* =================================================
     7. HOÀN TẤT
  ================================================= */

  console.log(
    `ABC-27: Đã khởi tạo ${abcFigures.length} biểu đồ.`
  );

}


/* =====================================================
   8. CHẠY SAU KHI HTML TẢI XONG
===================================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeABCGallery,
    { once: true }
  );

} else {

  initializeABCGallery();

}
