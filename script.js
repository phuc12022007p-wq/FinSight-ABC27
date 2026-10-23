
/* ==========================================
   ABC-27 - SCRIPT.JS HOÀN CHỈNH
   - Đọc dữ liệu CSV
   - Gom 5 ngày thành 1 nến
   - Thống kê Dashboard
   - Biểu đồ giá đóng cửa
   - Tooltip OHLC chi tiết
   - Đường dọc nét đứt
   - Video Python
========================================== */

/* ==========================================
   1. CẤU HÌNH CHUNG
========================================== */

const $ = (id) => document.getElementById(id);

const CSV_PATH = "./data/abc-27.csv";
const VIDEO_PATH = "./videos/stock_simulation_2min.mp4";

let heroChart = null;
let priceChart = null;

/* Định dạng số theo Việt Nam */

const format = (value) =>
  Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 2
  });

/* Định dạng tiền VND */

function formatVND(value) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "Không có dữ liệu";
  }

  return Number(value).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " VND";
}

/* Trạng thái Dashboard */

function setStatus(message) {
  const element = $("status");

  if (element) {
    element.textContent = message;
  }
}

/* Trạng thái biểu đồ đầu trang */

function setHeroMessage(message) {
  const element = $("heroMessage");

  if (!element) return;

  element.textContent = message;
  element.hidden = !message;
}


/* ==========================================
   2. PLUGIN ĐƯỜNG DỌC NÉT ĐỨT
========================================== */

const verticalHoverLine = {
  id: "verticalHoverLine",

  afterDatasetsDraw(chart) {
    const activeElements =
      chart.tooltip?.getActiveElements();

    if (
      !activeElements ||
      activeElements.length === 0
    ) {
      return;
    }

    const x = activeElements[0].element.x;

    const {
      top,
      bottom
    } = chart.chartArea;

    const ctx = chart.ctx;

    ctx.save();

    ctx.beginPath();

    ctx.setLineDash([5, 5]);

    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#5263d9";

    ctx.stroke();

    ctx.restore();
  }
};


/* ==========================================
   3. CẤU HÌNH TOOLTIP OHLC
========================================== */

function createOHLCTooltip(candles, isHero) {
  return {
    enabled: true,

    backgroundColor: "#182444",
    titleColor: "#ffffff",
    bodyColor: "#ffffff",

    borderColor: "#5263d9",
    borderWidth: 1,

    padding: 14,

    displayColors: false,

    titleFont: {
      size: 13,
      weight: "bold"
    },

    bodyFont: {
      size: 12
    },

    bodySpacing: 6,

    callbacks: {

      /* Tiêu đề nến */

      title(items) {
        if (!items.length) return "";

        const index = items[0].dataIndex;
        const candle = candles[index];

        if (!candle) return "";

        return (
          "Nến " + (index + 1) +
          " | Ngày " +
          candle.startDay +
          "–" +
          candle.endDay
        );
      },

      /* Thông tin chi tiết */

      label(context) {
        const index = context.dataIndex;
        const candle = candles[index];

        if (!candle) {
          return "Không có dữ liệu OHLC";
        }

        /* Biểu đồ đầu trang hiển thị ngắn */

        if (isHero) {
          return [
            "Đóng cửa: " +
              formatVND(candle.close),

            "Cao nhất: " +
              formatVND(candle.high),

            "Thấp nhất: " +
              formatVND(candle.low)
          ];
        }

        /* Dashboard hiển thị đầy đủ */

        return [
          "Mở cửa (Open): " +
            formatVND(candle.open),

          "Cao nhất (High): " +
            formatVND(candle.high),

          "Thấp nhất (Low): " +
            formatVND(candle.low),

          "Đóng cửa (Close): " +
            formatVND(candle.close),

          "Tham chiếu (Ref): " +
            formatVND(candle.ref)
        ];
      }
    }
  };
}


/* ==========================================
   4. VẼ BIỂU ĐỒ CHART.JS
========================================== */

function renderChart(
  id,
  labels,
  values,
  candles,
  isHero = false
) {

  if (typeof Chart === "undefined") {
    console.error("Không tải được Chart.js");
    return null;
  }

  const canvas = $(id);

  if (!canvas) {
    console.error(
      "Không tìm thấy canvas:",
      id
    );

    return null;
  }

  /* Xóa biểu đồ cũ trước khi vẽ lại */

  const existing = Chart.getChart(canvas);

  if (existing) {
    existing.destroy();
  }

  /* Màu sắc */

  const lineColor = isHero
    ? "#6778ef"
    : "#32bd9c";

  const fillColor = isHero
    ? "rgba(103,120,239,0.12)"
    : "rgba(50,189,156,0.10)";

  /* Tạo biểu đồ */

  return new Chart(canvas, {

    type: "line",

    data: {
      labels: labels,

      datasets: [{
        label: "Giá đóng cửa ABC-27",

        data: values,

        borderColor: lineColor,
        backgroundColor: fillColor,

        fill: true,

        tension: 0.32,

        pointRadius: 0,
        pointHoverRadius: 6,

        pointHoverBackgroundColor:
          "#ffffff",

        pointHoverBorderColor:
          lineColor,

        pointHoverBorderWidth: 3,

        borderWidth: 3
      }]
    },

    /* Đường dọc nét đứt */

    plugins: [
      verticalHoverLine
    ],

    options: {

      responsive: true,

      maintainAspectRatio: false,

      /* Hiệu ứng */

      animation: {
        duration: 700
      },

      /* Tương tác chuột */

      interaction: {
        intersect: false,
        mode: "index"
      },

      /* Tooltip và chú thích */

      plugins: {

        legend: {
          display: false
        },

        tooltip: createOHLCTooltip(
          candles,
          isHero
        )
      },

      /* Trục biểu đồ */

      scales: {

        x: {

          grid: {
            display: false
          },

          ticks: {
            maxTicksLimit: 7,
            color: "#9ca4b5"
          },

          border: {
            display: false
          }
        },

        y: {

          beginAtZero: true,

          grid: {
            color: "#eef0f6"
          },

          ticks: {
            color: "#9ca4b5",

            callback: (value) =>
              format(value)
          },

          border: {
            display: false
          }
        }
      }
    }
  });
}


/* ==========================================
   5. HIỂN THỊ HAI BIỂU ĐỒ
========================================== */

function showCharts(labels, values, candles) {

  /* Biểu đồ đầu trang */

  heroChart = renderChart(
    "heroChart",
    labels,
    values,
    candles,
    true
  );

  /* Biểu đồ Dashboard */

  priceChart = renderChart(
    "priceChart",
    labels,
    values,
    candles,
    false
  );

  if (heroChart) {
    setHeroMessage("");
  } else {
    setHeroMessage(
      "Không thể vẽ biểu đồ. " +
      "Hãy kiểm tra Chart.js."
    );
  }

  return Boolean(
    heroChart && priceChart
  );
}


/* ==========================================
   6. ĐỌC FILE CSV GỐC
========================================== */

function parseCSV(text) {

  const lines = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/)
    .filter((line) =>
      line.trim() !== ""
    );

  if (!lines.length) {
    throw new Error(
      "File CSV trống."
    );
  }

  const rows = [];

  lines.forEach((line, index) => {

    const cols = line
      .split(/[;,\t]/)
      .map((value) =>
        value.trim().replace(/^"|"$/g, "")
      );

    /* Bỏ qua dòng tiêu đề */

    if (
      index === 0 &&
      cols.some((value) =>
        value === "" ||
        !Number.isFinite(Number(value))
      )
    ) {
      return;
    }

    /* Kiểm tra số cột */

    if (cols.length !== 7) {
      throw new Error(
        "Dòng " + (index + 1) +
        " phải có đúng 7 cột."
      );
    }

    /* Chuyển thành số */

    const numbers = cols.map(
      (value) =>
        value === ""
          ? NaN
          : Number(value)
    );

    /* Kiểm tra dữ liệu */

    if (
      numbers.some((value) =>
        !Number.isFinite(value)
      )
    ) {
      throw new Error(
        "Dữ liệu không hợp lệ tại dòng " +
        (index + 1)
      );
    }

    rows.push(numbers);
  });

  if (!rows.length) {
    throw new Error(
      "Không có dữ liệu số trong CSV."
    );
  }

  return rows;
}


/* ==========================================
   7. GOM 5 NGÀY THÀNH 1 NẾN
========================================== */

function processRows(rows) {

  const candles = [];

  for (
    let i = 0;
    i < rows.length;
    i += 5
  ) {

    const group = rows.slice(
      i,
      i + 5
    );

    /* Giá mở cửa */

    const open = group[0][0];

    /* Giá đóng cửa */

    const close =
      group[group.length - 1][6];

    /* Toàn bộ giá trong nhóm */

    const allPrices = group.flat();

    /* Giá cao nhất */

    const high = Math.max(
      ...allPrices
    );

    /* Giá thấp nhất */

    const low = Math.min(
      ...allPrices
    );

    /* Giá tham chiếu */

    const ref = i > 0
      ? rows[i - 1][6]
      : open;

    /* Khoảng ngày */

    const startDay = i + 1;

    const endDay = Math.min(
      i + group.length,
      rows.length
    );

    /* Lưu nến */

    candles.push({
      open,
      high,
      low,
      close,
      ref,
      startDay,
      endDay
    });
  }

  return candles;
}


/* ==========================================
   8. CẬP NHẬT DASHBOARD
========================================== */

function updateDashboard(rows, sourceName) {

  if (!rows.length) {
    throw new Error(
      "Không có dữ liệu."
    );
  }

  /* Tạo các nến */

  const candles = processRows(rows);

  /* Giá cao nhất */

  const highest = Math.max(
    ...candles.map(
      (candle) => candle.high
    )
  );

  /* Giá thấp nhất */

  const lowest = Math.min(
    ...candles.map(
      (candle) => candle.low
    )
  );

  /* Số nến tăng */

  const rise = candles.filter(
    (candle) =>
      candle.close > candle.ref
  ).length;

  /* Số nến giảm */

  const fall = candles.filter(
    (candle) =>
      candle.close < candle.ref
  ).length;

  /* Nhãn trục X */

  const labels = candles.map(
    (_, index) =>
      "Nến " + (index + 1)
  );

  /* Giá đóng cửa */

  const values = candles.map(
    (candle) => candle.close
  );

  /* Các chỉ số Dashboard */

  const stats = {
    days: rows.length,
    candles: candles.length,
    highest: format(highest),
    lowest: format(lowest),
    rise: rise,
    fall: fall
  };

  /* Cập nhật HTML */

  Object.entries(stats).forEach(
    ([id, value]) => {

      const element = $(id);

      if (element) {
        element.textContent = value;
      }
    }
  );

  /* Vẽ biểu đồ */

  const rendered = showCharts(
    labels,
    values,
    candles
  );

  /* Thông báo trạng thái */

  if (rendered) {

    setStatus(
      "Đã tải thành công " +
      rows.length +
      " ngày và " +
      candles.length +
      " nến từ " +
      sourceName +
      "."
    );

  } else {

    setStatus(
      "Đã đọc CSV nhưng không vẽ được " +
      "biểu đồ. Hãy kiểm tra Chart.js."
    );
  }

  /* Kiểm tra trong Console */

  console.log(
    "Thống kê ABC-27:",
    {
      days: rows.length,
      candles: candles.length,
      highest,
      lowest,
      rise,
      fall
    }
  );

  console.log(
    "Danh sách 73 nến:",
    candles
  );
}


/* ==========================================
   9. TỰ ĐỘNG TẢI CSV
========================================== */

async function autoLoadCSV() {

  setStatus(
    "Đang tải dữ liệu ABC-27 gốc..."
  );

  setHeroMessage(
    "Đang tải dữ liệu ABC-27..."
  );

  try {

    const response = await fetch(
      CSV_PATH,
      {
        cache: "no-cache"
      }
    );

    if (!response.ok) {
      throw new Error(
        "HTTP " +
        response.status +
        " - Không tìm thấy " +
        CSV_PATH
      );
    }

    const text =
      await response.text();

    const rows = parseCSV(text);

    updateDashboard(
      rows,
      "abc-27.csv"
    );

  } catch (error) {

    console.error(
      "Lỗi tải CSV:",
      error
    );

    setStatus(
      "Chưa thể tải dữ liệu ABC-27: " +
      error.message +
      ". Hãy kiểm tra file CSV " +
      "hoặc chọn CSV từ máy."
    );

    setHeroMessage(
      "Chưa tải được dữ liệu ABC-27 gốc"
    );
  }
}


/* ==========================================
   10. CHỌN CSV THỦ CÔNG
========================================== */

function setupCSVInput() {

  const input = $("csvInput");

  if (!input) return;

  input.addEventListener(
    "change",
    async (event) => {

      const file =
        event.target.files[0];

      if (!file) return;

      try {

        const text =
          await file.text();

        const rows =
          parseCSV(text);

        updateDashboard(
          rows,
          file.name
        );

      } catch (error) {

        console.error(
          "Lỗi đọc CSV:",
          error
        );

        setStatus(
          "Không thể đọc CSV: " +
          error.message
        );
      }
    }
  );
}


/* ==========================================
   11. VIDEO PYTHON
========================================== */

function setupVideo() {

  const video = $("stockVideo");
  const status = $("videoStatus");

  if (!video) return;

  /* Video tải thành công */

  video.addEventListener(
    "loadedmetadata",
    () => {

      if (status) {
        status.textContent =
          "Video đã tải thành công. " +
          "Nhấn Play để xem.";
      }
    }
  );

  /* Video bị lỗi */

  video.addEventListener(
    "error",
    () => {

      console.error(
        "Không tải được video:",
        VIDEO_PATH
      );

      if (status) {
        status.textContent =
          "Không thể tải video. " +
          "Hãy kiểm tra thư mục videos.";
      }
    }
  );

  /* Gán đường dẫn video */

  video.src = VIDEO_PATH;

  video.preload = "metadata";

  video.load();
}


/* ==========================================
   12. KHỞI ĐỘNG WEBSITE
========================================== */

function startWebsite() {

  console.log(
    "Góc Nhìn Dữ Liệu đang khởi động..."
  );

  /* Chọn CSV */

  setupCSVInput();

  /* Video Python */

  setupVideo();

  /* Tải dữ liệu gốc */

  autoLoadCSV();
}

/* Chờ HTML tải xong */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startWebsite
  );

} else {

  startWebsite();
}
