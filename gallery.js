
/* ==========================================
   GÓC NHÌN DỮ LIỆU - ABC-27
   GALLERY.JS HOÀN CHỈNH
   THƯ VIỆN 12 BIỂU ĐỒ
========================================== */

(function () {
  "use strict";

  /* ========================================
     1. DANH SÁCH BIỂU ĐỒ
  ======================================== */

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

  /* ========================================
     2. KHỞI TẠO THƯ VIỆN
  ======================================== */

  function initGallery() {
    const section = document.querySelector(
      "#abc-gallery"
    );

    if (!section) {
      console.warn(
        "Không tìm thấy section #abc-gallery"
      );
      return;
    }

    const tabs = section.querySelector(
      ".abc-gallery__tabs"
    );

    const grid = section.querySelector(
      ".abc-gallery__grid"
    );

    const dialog = section.querySelector(
      ".abc-gallery__dialog"
    );

    const count = section.querySelector(
      "#galleryCount"
    );

    if (!tabs || !grid) {
      console.error(
        "Thiếu .abc-gallery__tabs hoặc .abc-gallery__grid"
      );
      return;
    }

    /* ======================================
       3. LOẠI BỎ CHỨC NĂNG THU GỌN
    ====================================== */

    const collapseButton = section.querySelector(
      "#galleryCollapse"
    );

    if (collapseButton) {
      collapseButton.remove();
    }

    grid.hidden = false;
    grid.removeAttribute("hidden");

    grid.style.removeProperty("display");
    grid.style.removeProperty("visibility");
    grid.style.removeProperty("opacity");

    /* ======================================
       4. ĐƯỜNG DẪN HÌNH ẢNH
    ====================================== */

    const baseURL = new URL(
      "./",
      window.location.href.split("#")[0]
    );

    function getImageURL(filename) {
      return new URL(
        "assets/" + filename,
        baseURL
      ).href;
    }

    /* ======================================
       5. TẠO THẺ BIỂU ĐỒ
    ====================================== */

    function createFigureCard(figure, index) {
      const card = document.createElement("article");

      card.className = "abc-gallery__card";

      if (figure.wide) {
        card.classList.add(
          "abc-gallery__card--wide"
        );
      }

      const button = document.createElement("button");

      button.type = "button";
      button.className = "abc-gallery__open";

      button.setAttribute(
        "aria-label",
        "Phóng to " + figure.title
      );

      button.style.cssText = `
        display: block;
        width: 100%;
        border: 0;
        padding: 0;
        background: transparent;
        text-align: left;
        cursor: zoom-in;
        font: inherit;
        color: inherit;
      `;

      const image = document.createElement("img");

      image.src = getImageURL(figure.image);
      image.alt = figure.title;
      image.loading = index < 3 ? "eager" : "lazy";
      image.decoding = "async";

      image.style.cssText = `
        display: block;
        width: 100%;
        height: auto;
        object-fit: contain;
      `;

      image.addEventListener("error", () => {
        image.alt =
          "Không tải được hình: " + figure.image;

        console.error(
          "Không tải được biểu đồ:",
          image.src
        );
      });

      const content = document.createElement("div");

      content.className = "abc-gallery__content";

      const category = document.createElement("span");

      category.className = "abc-gallery__category";
      category.textContent = figure.category;

      const title = document.createElement("h3");

      title.textContent = figure.title;

      const description = document.createElement("p");

      description.textContent = figure.description;

      const meta = document.createElement("small");

      meta.className = "abc-gallery__meta";
      meta.textContent =
        "Trang " + figure.page + " · Nhấn để phóng to";

      content.append(
        category,
        title,
        description,
        meta
      );

      button.append(
        image,
        content
      );

      card.appendChild(button);

      button.addEventListener("click", () => {
        openFigure(figure);
      });

      return card;
    }

    /* ======================================
       6. PHÓNG TO BIỂU ĐỒ
    ====================================== */

    const closeButton = dialog?.querySelector(
      ".abc-gallery__close"
    );

    const dialogImage = dialog?.querySelector("img");

    const dialogCaption = dialog?.querySelector(
      "figcaption"
    );

    function openFigure(figure) {
      const url = getImageURL(figure.image);

      if (
        !dialog ||
        !dialogImage ||
        typeof dialog.showModal !== "function"
      ) {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
        return;
      }

      dialogImage.src = url;
      dialogImage.alt = figure.title;

      if (dialogCaption) {
        dialogCaption.textContent =
          figure.title +
          " · Trang " +
          figure.page +
          " · " +
          figure.description;
      }

      if (!dialog.open) {
        dialog.showModal();
      }
    }

    function closeFigure() {
      if (dialog?.open) {
        dialog.close();
      }
    }

    if (closeButton) {
      closeButton.addEventListener(
        "click",
        closeFigure
      );
    }

    if (dialog) {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          closeFigure();
        }
      });

      dialog.addEventListener("close", () => {
        if (dialogImage) {
          dialogImage.removeAttribute("src");
        }
      });
    }

    /* ======================================
       7. BỘ LỌC THEO CHỦ ĐỀ
    ====================================== */

    const categories = [
      "Tất cả",
      ...new Set(
        abcFigures.map(
          (figure) => figure.category
        )
      )
    ];

    let activeCategory = "Tất cả";

    function renderFilters() {
      tabs.replaceChildren();

      categories.forEach((category) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "abc-gallery__tab";
        button.textContent = category;

        const isActive =
          category === activeCategory;

        button.classList.toggle(
          "active",
          isActive
        );

        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );

        button.addEventListener("click", () => {
          activeCategory = category;

          renderFilters();
          renderFigures();
        });

        tabs.appendChild(button);
      });
    }

    /* ======================================
       8. HIỂN THỊ BIỂU ĐỒ
    ====================================== */

    function renderFigures() {
      const filteredFigures =
        activeCategory === "Tất cả"
          ? abcFigures
          : abcFigures.filter(
              (figure) =>
                figure.category === activeCategory
            );

      grid.replaceChildren();

      // Luôn hiển thị, không thu gọn
      grid.hidden = false;
      grid.removeAttribute("hidden");

      filteredFigures.forEach((figure) => {
        const originalIndex =
          abcFigures.indexOf(figure);

        const card = createFigureCard(
          figure,
          originalIndex
        );

        grid.appendChild(card);
      });

      if (count) {
        count.textContent =
          "Hiển thị " +
          filteredFigures.length +
          " / " +
          abcFigures.length +
          " biểu đồ";
      }
    }

    /* ======================================
       9. KHỞI ĐỘNG
    ====================================== */

    renderFilters();
    renderFigures();

    console.log(
      "Thư viện ABC-27 đã khởi tạo:",
      abcFigures.length,
      "biểu đồ"
    );
  }

  /* ========================================
     10. CHẠY SAU KHI HTML TẢI XONG
  ======================================== */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initGallery
    );
  } else {
    initGallery();
  }

})();
