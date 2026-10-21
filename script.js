
const $ = (id) => document.getElementById(id);

const CSV_PATH = "./data/abc-27.csv";
const VIDEO_PATH = "./videos/stock_simulation_2min.mp4";

let heroChart = null;
let priceChart = null;

const format = (value) =>
  Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 2
  });

function setStatus(message) {
  const element = $("status");
  if (element) element.textContent = message;
}

function setHeroMessage(message) {
  const element = $("heroMessage");
  if (!element) return;

  element.textContent = message;
  element.hidden = !message;
}


function renderChart(id, labels, values, isHero = false) {
  if (typeof Chart === "undefined") {
    console.error("Không tải được Chart.js");
    return null;
  }

  const canvas = $(id);

  if (!canvas) {
    console.error("Không tìm thấy canvas:", id);
    return null;
  }

  const existing = Chart.getChart(canvas);

  if (existing) {
    existing.destroy();
  }

  return new Chart(canvas, {
    type: "line",

    data: {
      labels: labels,

      datasets: [{
        label: "Giá đóng cửa ABC-27",
        data: values,

        borderColor: isHero
          ? "#6778ef"
          : "#32bd9c",

        backgroundColor: isHero
          ? "rgba(103,120,239,0.12)"
          : "rgba(50,189,156,0.10)",

        fill: true,
        tension: 0.32,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 3
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: "index"
      },

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          callbacks: {
            label: (context) =>
              "Giá: " +
              format(context.parsed.y) +
              " VND"
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            maxTicksLimit: 7,
            color: "#9ca4b5"
          }
        },

        y: {
          grid: {
            color: "#eef0f6"
          },

          ticks: {
            color: "#9ca4b5",
            callback: (value) => format(value)
          }
        }
      }
    }
  });
}

function showCharts(labels, values) {
  heroChart = renderChart(
    "heroChart",
    labels,
    values,
    true
  );

  priceChart = renderChart(
    "priceChart",
    labels,
    values,
    false
  );

  if (heroChart) {
    setHeroMessage("");
  } else {
    setHeroMessage(
      "Không thể vẽ biểu đồ. Hãy kiểm tra Chart.js."
    );
  }

  return Boolean(heroChart && priceChart);
}

/* ==========================================
   2. DOC FILE CSV GOC
========================================== */

function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (!lines.length) {
    throw new Error("File CSV trống.");
  }

  const rows = [];

  lines.forEach((line, index) => {
    const cols = line
      .split(/[;,\t]/)
      .map((value) =>
        value.trim().replace(/^"|"$/g, "")
      );

    // Bỏ qua dòng tiêu đề nếu có
    if (
      index === 0 &&
      cols.some((value) =>
        value === "" ||
        !Number.isFinite(Number(value))
      )
    ) {
      return;
    }

    if (cols.length !== 7) {
      throw new Error(
        "Dòng " + (index + 1) +
        " phải có đúng 7 cột."
      );
    }

    const numbers = cols.map((value) =>
      value === "" ? NaN : Number(value)
    );

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
   3. GOM 5 NGAY THANH 1 NEN
========================================== */

function processRows(rows) {
  const candles = [];

  for (let i = 0; i < rows.length; i += 5) {
    const group = rows.slice(i, i + 5);

    const open = group[0][0];
    const close = group[group.length - 1][6];

    const allPrices = group.flat();

    const high = Math.max(...allPrices);
    const low = Math.min(...allPrices);

    const ref = i > 0
      ? rows[i - 1][6]
      : open;

    candles.push({
      open,
      close,
      high,
      low,
      ref
    });
  }

  return candles;
}

/* ==========================================
   4. CAP NHAT DASHBOARD
========================================== */

function updateDashboard(rows, sourceName) {
  if (!rows.length) {
    throw new Error("Không có dữ liệu.");
  }

  const candles = processRows(rows);

  const highest = Math.max(
    ...candles.map((candle) => candle.high)
  );

  const lowest = Math.min(
    ...candles.map((candle) => candle.low)
  );

  const rise = candles.filter(
    (candle) => candle.close > candle.ref
  ).length;

  const fall = candles.filter(
    (candle) => candle.close < candle.ref
  ).length;

  const labels = candles.map(
    (_, index) => "Nến " + (index + 1)
  );

  const values = candles.map(
    (candle) => candle.close
  );

  const stats = {
    days: rows.length,
    candles: candles.length,
    highest: format(highest),
    lowest: format(lowest),
    rise: rise,
    fall: fall
  };

  Object.entries(stats).forEach(([id, value]) => {
    const element = $(id);

    if (element) {
      element.textContent = value;
    }
  });

  const rendered = showCharts(labels, values);

  if (rendered) {
    setStatus(
      "Đã tải thành công " +
      rows.length + " ngày và " +
      candles.length + " nến từ " +
      sourceName + "."
    );
  } else {
    setStatus(
      "Đã đọc CSV nhưng không vẽ được biểu đồ. " +
      "Hãy kiểm tra Chart.js."
    );
  }

  console.log("Thống kê ABC-27:", {
    days: rows.length,
    candles: candles.length,
    highest,
    lowest,
    rise,
    fall
  });
}

/* ==========================================
   5. TU DONG TAI CSV GOC
========================================== */

async function autoLoadCSV() {
  setStatus("Đang tải dữ liệu ABC-27 gốc...");
  setHeroMessage("Đang tải dữ liệu ABC-27...");

  try {
    const response = await fetch(CSV_PATH, {
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(
        "HTTP " + response.status +
        " - Không tìm thấy " + CSV_PATH
      );
    }

    const text = await response.text();
    const rows = parseCSV(text);

    updateDashboard(rows, "abc-27.csv");

  } catch (error) {
    console.error("Lỗi tải CSV:", error);

    setStatus(
      "Chưa thể tải dữ liệu ABC-27: " +
      error.message +
      ". Hãy kiểm tra file CSV hoặc chọn CSV từ máy."
    );

    setHeroMessage(
      "Chưa tải được dữ liệu ABC-27 gốc"
    );
  }
}

/* ==========================================
   6. CHON CSV THU CONG
========================================== */

function setupCSVInput() {
  const input = $("csvInput");

  if (!input) return;

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      updateDashboard(rows, file.name);

    } catch (error) {
      console.error("Lỗi đọc CSV:", error);

      setStatus(
        "Không thể đọc CSV: " + error.message
      );
    }
  });
}

/* ==========================================
   7. VIDEO PYTHON
========================================== */

function setupVideo() {
  const video = $("stockVideo");
  const status = $("videoStatus");

  if (!video) return;

  video.addEventListener("loadedmetadata", () => {
    if (status) {
      status.textContent =
        "Video đã tải thành công. Nhấn Play để xem.";
    }
  });

  video.addEventListener("error", () => {
    console.error(
      "Không tải được video:",
      VIDEO_PATH
    );

    if (status) {
      status.textContent =
        "Không thể tải video. " +
        "Hãy kiểm tra thư mục videos.";
    }
  });

  video.src = VIDEO_PATH;
  video.preload = "metadata";
  video.load();
}

/* ==========================================
   8. KHOI DONG WEBSITE
========================================== */

function startWebsite() {
  console.log("FinSight AI đang khởi động...");

  setupCSVInput();
  setupVideo();

  // Chỉ tải dữ liệu gốc, không vẽ dữ liệu giả
  autoLoadCSV();
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startWebsite
  );
} else {
  startWebsite();
}
