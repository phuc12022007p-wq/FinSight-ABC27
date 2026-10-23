
/* ==========================================
   GÓC NHÌN DỮ LIỆU - ABC-27
   SCRIPT.JS HOÀN CHỈNH
========================================== */

const $ = (id) => document.getElementById(id);

const CSV_PATH = "./data/abc-27.csv";
const VIDEO_PATH = "./videos/stock_simulation_2min.mp4";

let heroChart = null;
let priceChart = null;

/* ==========================================
   1. ĐỊNH DẠNG VÀ THÔNG BÁO
========================================== */

const format = (value) =>
  Number(value).toLocaleString("vi-VN", {
    maximumFractionDigits: 2
  });

const formatPrice = (value) =>
  Number(value).toLocaleString("vi-VN", {
    minimumFractionDigits: 2,
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

/* ==========================================
   2. PLUGIN ĐƯỜNG DỌC NÉT ĐỨT
========================================== */

const abcHoverLinePlugin = {
  id: "abcHoverLine",

  afterDatasetsDraw(chart) {
    const active = chart.getActiveElements();

    if (!active.length) return;

    const point = active[0].element;

    if (!point) return;

    const { ctx, chartArea } = chart;

    ctx.save();

    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#24c6a6";
    ctx.lineWidth = 1.3;

    ctx.moveTo(point.x, chartArea.top);
    ctx.lineTo(point.x, chartArea.bottom);

    ctx.stroke();
    ctx.restore();
  }
};

/* ==========================================
   3. TOOLTIP HTML GIỐNG ẢNH MẪU
========================================== */

function getOrCreateTooltip(chart) {
  const canvas = chart.canvas;
  const parent = canvas.parentElement;

  if (!parent) return null;

  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  let tooltip = parent.querySelector(".abc-stock-tooltip");

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "abc-stock-tooltip";

    Object.assign(tooltip.style, {
      position: "absolute",
      zIndex: "100",
      width: "262px",
      maxWidth: "calc(100% - 16px)",
      boxSizing: "border-box",
      padding: "20px 21px",
      borderRadius: "16px",
      background: "#172e3e",
      color: "#ffffff",
      boxShadow: "0 12px 30px rgba(15,35,50,0.18)",
      opacity: "0",
      visibility: "hidden",
      pointerEvents: "none",
      transition: "opacity 0.12s ease",
      fontFamily: "inherit",
      textAlign: "left"
    });

    parent.appendChild(tooltip);
  }

  return tooltip;
}

function renderExternalTooltip(context, candles) {
  const { chart, tooltip } = context;

  const box = getOrCreateTooltip(chart);

  if (!box) return;

  if (!tooltip || tooltip.opacity === 0) {
    box.style.opacity = "0";
    box.style.visibility = "hidden";
    return;
  }

  const point = tooltip.dataPoints?.[0];

  if (!point) return;

  const index = point.dataIndex;
  const candle = candles[index];

  if (!candle) {
    box.style.opacity = "0";
    box.style.visibility = "hidden";
    return;
  }

  const startDay = index * 5 + 1;
  const endDay = candle.endDay ?? startDay + 4;

  // Dữ liệu chỉ lấy từ CSV, không dùng giá giả
  box.innerHTML = `
    <div style="
      font-size:16px;
      font-weight:800;
      line-height:1.4;
      margin-bottom:11px;
    ">
      Nến ${index + 1} · Ngày ${startDay}–${endDay}
    </div>

    <div style="
      font-size:14px;
      color:#d8e6ee;
      margin-bottom:6px;
    ">
      Giá đóng cửa (VND)
    </div>

    <div style="
      font-size:25px;
      font-weight:800;
      color:#42dfc0;
      line-height:1.25;
      margin-bottom:14px;
    ">
      ${formatPrice(candle.close)}
    </div>

    <div style="font-size:14px;line-height:1.9;">
      Mở cửa: ${formatPrice(candle.open)}
    </div>

    <div style="font-size:14px;line-height:1.9;">
      Cao nhất: ${formatPrice(candle.high)}
    </div>

    <div style="font-size:14px;line-height:1.9;">
      Thấp nhất: ${formatPrice(candle.low)}
    </div>
  `;

  const canvasRect = chart.canvas.getBoundingClientRect();
  const parentRect =
    chart.canvas.parentElement.getBoundingClientRect();

  const pointX =
    canvasRect.left - parentRect.left + tooltip.caretX;

  const boxWidth = box.offsetWidth;
  const parentWidth = chart.canvas.parentElement.clientWidth;

  let left = pointX + 18;

  if (left + boxWidth > parentWidth - 8) {
    left = pointX - boxWidth - 18;
  }

  left = Math.max(
    8,
    Math.min(left, parentWidth - boxWidth - 8)
  );

  box.style.left = left + "px";
  box.style.top = "12px";
  box.style.opacity = "1";
  box.style.visibility = "visible";
}

/* ==========================================
   4. VẼ BIỂU ĐỒ TƯƠNG TÁC
========================================== */

function renderChart(
  id,
  labels,
  values,
  isHero = false,
  candles = []
) {
  if (typeof Chart === "undefined") {
    console.error("Không tải được Chart.js");
    return null;
  }

  const canvas = $(id);

  if (!canvas) {
    console.warn("Không tìm thấy canvas:", id);
    return null;
  }

  const oldChart = Chart.getChart(canvas);

  if (oldChart) oldChart.destroy();

  // Xóa tooltip cũ khi tải CSV khác
  const oldTooltip = canvas.parentElement?.querySelector(
    ".abc-stock-tooltip"
  );

  if (oldTooltip) oldTooltip.remove();

  return new Chart(canvas, {
    type: "line",

    data: {
      labels,

      datasets: [{
        label: "Giá đóng cửa (VND)",
        data: values,

        borderColor: isHero
          ? "#6778ef"
          : "#28bea1",

        backgroundColor: isHero
          ? "rgba(103,120,239,0.10)"
          : "rgba(40,190,161,0.10)",

        fill: true,
        tension: 0.32,

        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 5,

        pointHoverBackgroundColor: "#28bea1",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2
      }]
    },

    plugins: [abcHoverLinePlugin],

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          enabled: false,

          external: (context) => {
            renderExternalTooltip(context, candles);
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            maxTicksLimit: 8,
            color: "#94a0b7"
          }
        },

        y: {
          beginAtZero: true,

          grid: {
            color: "#e9edf5"
          },

          ticks: {
            color: "#94a0b7",
            callback: (value) => format(value)
          }
        }
      }
    }
  });
}

function showCharts(labels, values, candles) {
  heroChart = renderChart(
    "heroChart",
    labels,
    values,
    true,
    candles
  );

  priceChart = renderChart(
    "priceChart",
    labels,
    values,
    false,
    candles
  );

  if (heroChart) {
    setHeroMessage("");
  } else if ($("heroChart")) {
    setHeroMessage(
      "Không thể vẽ biểu đồ. Hãy kiểm tra Chart.js."
    );
  }

  return Boolean(heroChart || priceChart);
}

/* ==========================================
   5. ĐỌC FILE CSV GỐC
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
   6. GỘP 5 NGÀY THÀNH MỘT NẾN
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
      ref,
      startDay: i + 1,
      endDay: i + group.length
    });
  }

  return candles;
}

/* ==========================================
   7. CẬP NHẬT DASHBOARD
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
    rise,
    fall
  };

  Object.entries(stats).forEach(([id, value]) => {
    const element = $(id);

    if (element) {
      element.textContent = value;
    }
  });

  const rendered = showCharts(
    labels,
    values,
    candles
  );

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
      "Hãy kiểm tra Chart.js và thẻ canvas."
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
   8. TỰ ĐỘNG TẢI CSV
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
   9. CHỌN CSV TỪ MÁY
========================================== */

function setupCSVInput() {
  const input = $("csvInput");

  if (!input) return;

  input.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];

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
   10. VIDEO PYTHON
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
   11. PHƯƠNG PHÁP - CUTE TABS
========================================== */

function setupCuteMethod() {
  const section = document.querySelector(".cute-method");

  if (!section) return;

  const tabs = Array.from(
    section.querySelectorAll(".cute-method__tab")
  );

  const panel = section.querySelector("#method-panel");
  const icon = section.querySelector("#method-icon");
  const title = section.querySelector("#method-title");
  const description = section.querySelector(
    "#method-description"
  );

  if (!tabs.length || !panel || !icon || !title || !description) {
    return;
  }

  const methods = [
    {
      icon: "📅",
      title: "Lịch giả định",
      description:
        "365 dòng được ánh xạ thành một năm không nhuận " +
        "từ 01/01. Đây là quy ước phân tích, " +
        "không phải lịch giao dịch thực tế.",
      color: "#fce2ee"
    },
    {
      icon: "📈",
      title: "Nến 5 ngày",
      description:
        "Open là giá đầu tiên của ngày đầu; " +
        "Close là giá cuối cùng của ngày cuối; " +
        "High/Low là giá trị lớn nhất/nhỏ nhất " +
        "trong 35 giá trị của nhóm " +
        "(5 ngày × 7 giá trị).",
      color: "#e7e0ff"
    },
    {
      icon: "💗",
      title: "Hai cách tham chiếu",
      description:
        "Mô phỏng lấy Open = 11.000 VND cho nến đầu. " +
        "Thống kê ngày đầu dùng tham chiếu giả định " +
        "10.000 VND; sàn 90%, trần 110%.",
      color: "#fff0d8"
    },
    {
      icon: "💻",
      title: "Công cụ thực hiện",
      description:
        "Pandas xử lý dữ liệu, NumPy tính toán, " +
        "Matplotlib tạo biểu đồ và FuncAnimation. " +
        "FFmpegWriter xuất video 120 giây.",
      color: "#dff4eb"
    }
  ];

  function activateTab(index, moveFocus = false) {
    const method = methods[index];

    if (!method || !tabs[index]) return;

    tabs.forEach((tab, i) => {
      const active = i === index;

      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    icon.textContent = method.icon;
    icon.style.background = method.color;

    title.textContent = method.title;
    description.textContent = method.description;

    panel.setAttribute(
      "aria-labelledby",
      tabs[index].id
    );

    if (moveFocus) {
      tabs[index].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(index);
    });

    tab.addEventListener("keydown", (event) => {
      let next = index;

      if (event.key === "ArrowRight") {
        next = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        next = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(next, true);
    });
  });

  activateTab(0);
}

/* ==========================================
   12. KHỞI ĐỘNG WEBSITE
========================================== */

function startWebsite() {
  console.log("Góc Nhìn Dữ Liệu ABC-27 đang khởi động...");

  setupCSVInput();
  setupVideo();
  setupCuteMethod();

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
