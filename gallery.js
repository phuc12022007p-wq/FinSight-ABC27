
/* ==============================================
   GOC NHIN DU LIEU - ABC-27
   THU VIEN BIEU DO GOC TU BAO CAO

   Tac gia: Huynh Thanh Phuc
   Nam: 2026

   Duong dan hinh anh:
   assets/chart-1.png
   ...
   assets/chart-12.png
============================================== */


/* ==============================================
   1. DANH SACH 12 BIEU DO
============================================== */

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


/* ==============================================
   2. KHOI TAO THU VIEN
============================================== */

function initializeABCGallery() {

  const root = document.getElementById("abc-gallery");

  if (!root) {
    console.warn(
      "ABC-27: Không tìm thấy #abc-gallery trong HTML."
    );
    return;
  }

  const grid = root.querySelector(".abc-gallery__grid");

  const tabs = root.querySelector(".abc-gallery__tabs");

  const dialog = root.querySelector(
    ".abc-gallery__dialog"
  );

  if (!grid || !tabs || !dialog) {
    console.error(
      "ABC-27: Thiếu thành phần HTML của thư viện."
    );
    return;
  }

  const bigImage = dialog.querySelector("img");

  const caption = dialog.querySelector("figcaption");

  const closeButton = dialog.querySelector(
    ".abc-gallery__close"
  );

  if (!bigImage || !caption || !closeButton) {
    console.error(
      "ABC-27: Thiếu thành phần cửa sổ phóng to."
    );
    return;
  }


  /* ==========================================
     3. XOA NOI DUNG CU
  ========================================== */

  grid.innerHTML = "";
  tabs.innerHTML = "";


  /* ==========================================
     4. TAO DANH SACH BO LOC
  ========================================== */

  const filters = [
    "Tất cả",
    ...new Set(
      abcFigures.map(figure => figure.category)
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


    /* SU KIEN LOC BIEU DO */

    button.addEventListener("click", () => {

      const allButtons = tabs.querySelectorAll(
        ".abc-gallery__tab"
      );

      allButtons.forEach(btn => {

        btn.setAttribute(
          "aria-pressed",
          String(btn === button)
        );

      });


      const cards = grid.querySelectorAll(
        ".abc-gallery__card"
      );

      cards.forEach(card => {

        const category = card.dataset.category;

        if (
          label === "Tất cả" ||
          category === label
        ) {

          card.hidden = false;

        } else {

          card.hidden = true;

        }

      });

    });


    tabs.appendChild(button);

  });


  /* ==========================================
     5. TAO CAC THE BIEU DO
  ========================================== */

  abcFigures.forEach((figureData, index) => {

    /* DUONG DAN HINH ANH */

    const imagePath =
      "assets/" + figureData.image;


    /* TAO THE FIGURE */

    const figure = document.createElement("figure");

    figure.className = "abc-gallery__card";

    figure.dataset.category = figureData.category;

    figure.dataset.wide = String(figureData.wide);


    /* TAO NUT PHONG TO */

    const zoomButton = document.createElement("button");

    zoomButton.type = "button";

    zoomButton.className = "abc-gallery__zoom";

    zoomButton.setAttribute(
      "aria-label",
      "Phóng to " + figureData.title
    );


    /* TAO HINH ANH */

    const img = document.createElement("img");

    img.src = imagePath;

    img.alt = figureData.title;

    img.loading = "lazy";

    img.decoding = "async";


    /* ========================================
       6. XU LY HINH KHONG TAI DUOC
    ======================================== */

    img.addEventListener("error", () => {

      console.error(
        "Không tải được hình:",
        imagePath
      );

      img.style.display = "none";

      const errorMessage = document.createElement("div");

      errorMessage.style.padding = "35px 15px";

      errorMessage.style.textAlign = "center";

      errorMessage.style.color = "#c0392b";

      errorMessage.style.fontSize = "14px";

      errorMessage.textContent =
        "Không tìm thấy ảnh: " + imagePath;

      zoomButton.appendChild(errorMessage);

    });


    /* ========================================
       7. SU KIEN PHONG TO HINH
    ======================================== */

    zoomButton.addEventListener("click", () => {

      if (!img.complete || img.naturalWidth === 0) {
        return;
      }

      bigImage.src = imagePath;

      bigImage.alt = figureData.title;

      caption.textContent = figureData.title;

      if (!dialog.open) {
        dialog.showModal();
      }

    });


    zoomButton.appendChild(img);


    /* ========================================
       8. TAO THONG TIN BIEU DO
    ======================================== */

    const info = document.createElement("figcaption");

    info.className = "abc-gallery__info";


    /* NHOM VA TRANG BAO CAO */

    const meta = document.createElement("div");

    meta.className = "abc-gallery__meta";

    meta.textContent =
      figureData.category +
      " · Trang " +
      figureData.page +
      " của PDF";


    /* TIEU DE */

    const title = document.createElement("h3");

    title.textContent = figureData.title;


    /* MO TA */

    const description = document.createElement("p");

    description.textContent = figureData.description;


    /* GAN CAC THANH PHAN */

    info.appendChild(meta);

    info.appendChild(title);

    info.appendChild(description);

    figure.appendChild(zoomButton);

    figure.appendChild(info);

    grid.appendChild(figure);

  });


  /* ==========================================
     9. DONG CUA SO PHONG TO
  ========================================== */

  closeButton.addEventListener("click", () => {

    dialog.close();

  });


  /* NHAN RA NGOAI DE DONG */

  dialog.addEventListener("click", event => {

    if (event.target === dialog) {

      dialog.close();

    }

  });


  /* ==========================================
     10. THONG BAO HOAN THANH
  ========================================== */

  console.log(
    "ABC-27: Đã tạo thư viện với",
    abcFigures.length,
    "biểu đồ."
  );

}


/* ==============================================
   11. CHAY SAU KHI HTML TAI XONG
============================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeABCGallery
  );

} else {

  initializeABCGallery();

}
