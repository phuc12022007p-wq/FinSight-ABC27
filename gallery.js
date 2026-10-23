
/* ==========================================
   THU VIEN BIEU DO ABC-27
   Hinh goc trich tu bao cao PDF
========================================== */

const abcFigures = [
  {
    slug: "hinh-01",
    page: 5,
    category: "Tổng quan",
    title: "Hình 1 · Giá đóng cửa và dải High–Low",
    description: "Diễn biến giá đóng cửa và khoảng dao động trong ngày.",
    wide: true
  },
  {
    slug: "hinh-02a",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2a · Nến 37",
    description: "Khung hình mô phỏng tại nến 37, ngày 181–185.",
    wide: true
  },
  {
    slug: "hinh-02b",
    page: 9,
    category: "Mô phỏng",
    title: "Hình 2b · Nến 73",
    description: "Khung hình mô phỏng cuối năm tại nến 73, ngày 361–365.",
    wide: true
  },
  {
    slug: "hinh-03",
    page: 11,
    category: "Theo tháng",
    title: "Hình 3 · Giá trung bình theo tháng",
    description: "Biểu đồ cột và thanh sai số ± một độ lệch chuẩn.",
    wide: false
  },
  {
    slug: "hinh-04",
    page: 11,
    category: "Theo tháng",
    title: "Hình 4 · Boxplot theo tháng",
    description: "Phân bố giá theo từng tháng.",
    wide: false
  },
  {
    slug: "hinh-05",
    page: 12,
    category: "Theo tháng",
    title: "Hình 5 · Biên độ theo tháng",
    description: "Chênh lệch Max − Min của từng tháng.",
    wide: false
  },
  {
    slug: "hinh-06",
    page: 13,
    category: "Theo quý",
    title: "Hình 6 · So sánh thống kê theo quý",
    description: "Trung bình, độ lệch chuẩn và hệ số biến thiên.",
    wide: true
  },
  {
    slug: "hinh-07",
    page: 14,
    category: "Theo quý",
    title: "Hình 7 · Boxplot theo quý",
    description: "Phân bố giá theo bốn quý.",
    wide: false
  },
  {
    slug: "hinh-08",
    page: 16,
    category: "Bất thường",
    title: "Hình 8 · Đóng cửa chạm trần/sàn",
    description: "Số ngày đóng cửa chạm trần hoặc sàn theo tháng.",
    wide: false
  },
  {
    slug: "hinh-09",
    page: 17,
    category: "Phân bố",
    title: "Hình 9 · Histogram hai nửa năm",
    description: "So sánh phân bố giá Q1–Q2 và Q3–Q4.",
    wide: true
  },
  {
    slug: "hinh-10",
    page: 18,
    category: "Xu hướng",
    title: "Hình 10 · Xu hướng giá cả năm",
    description: "Xu hướng giá và vị trí giá thấp nhất.",
    wide: true
  },
  {
    slug: "hinh-11",
    page: 20,
    category: "Giải thích",
    title: "Hình 11 · Quy tắc màu sắc",
    description: "Minh họa nến và đường giá khi so sánh với tham chiếu.",
    wide: true
  }
];

/* ==========================================
   TAO GIAO DIEN THU VIEN
========================================== */

(() => {
  const root = document.getElementById("abc-gallery");

  if (!root) return;

  const grid = root.querySelector(".abc-gallery__grid");
  const tabs = root.querySelector(".abc-gallery__tabs");
  const dialog = root.querySelector(".abc-gallery__dialog");

  if (!grid || !tabs || !dialog) return;

  const big = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(".abc-gallery__close");

  const filters = [
    "Tất cả",
    ...new Set(abcFigures.map(f => f.category))
  ];

  /* TAO NUT LOC */

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
      tabs.querySelectorAll("button").forEach(btn => {
        btn.setAttribute(
          "aria-pressed",
          String(btn === button)
        );
      });

      grid.querySelectorAll(".abc-gallery__card").forEach(card => {
        card.hidden =
          label !== "Tất cả" &&
          card.dataset.category !== label;
      });
    });

    tabs.appendChild(button);
  });

  /* DONG CUA SO PHONG TO */

  closeButton.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  /* TAO DANH SACH HINH */

  abcFigures.forEach(figureData => {
    const figure = document.createElement("figure");

    figure.className = "abc-gallery__card";
    figure.dataset.category = figureData.category;
    figure.dataset.wide = String(figureData.wide);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "abc-gallery__zoom";

    button.setAttribute(
      "aria-label",
      "Phóng to " + figureData.title
    );

    const img = document.createElement("img");

    img.src =
      "assets/charts/" +
      figureData.slug +
      ".png";

    img.alt = figureData.title;
    img.loading = "lazy";

    button.appendChild(img);

    /* NHAN VAO HINH DE PHONG TO */

    button.addEventListener("click", () => {
      big.src = img.src;
      big.alt = img.alt;
      caption.textContent = figureData.title;

      dialog.showModal();
    });

    /* THONG TIN HINH */

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
    figure.append(button, info);
    grid.appendChild(figure);
  });
})();
