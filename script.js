const $ = id => document.getElementById(id);

let priceChart;
let heroChart;

const format = n =>
  Number(n).toLocaleString("vi-VN", {
    maximumFractionDigits: 2
  });

// VẼ BIỂU ĐỒ
function renderChart(id, labels, values, isHero = false) {
  if (!window.Chart) {
    console.error("Chưa tải được Chart.js");
    return null;
  }

  const ctx = $(id).getContext("2d");

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Giá đóng cửa",
        data: values,
        borderColor: isHero ? "#6778ef" : "#32bd9c",
        backgroundColor: isHero
          ? "rgba(103,120,239,.12)"
          : "rgba(50,189,156,.1)",
        fill: true,
        tension: 0.32,
        pointRadius: 0,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => "Giá: " + format(context.parsed.y)
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxTicksLimit: 7,
            color: "#9ca4b5"
          }
        },
        y: {
          grid: { color: "#eef0f6" },
          ticks: {
            color: "#9ca4b5",
            callback: value => format(value)
          }
        }
      }
    }
  });
}

function showCharts(labels, values) {
  if (priceChart) priceChart.destroy();
  if (heroChart) heroChart.destroy();

  priceChart = renderChart("priceChart", labels, values);
  heroChart = renderChart("heroChart", labels, values, true);
}

// DỮ LIỆU MINH HỌA, KHÔNG PHẢI ABC-27 THẬT
const demo = [
  10, 11, 10.5, 12, 11.8,
  13.5, 13, 14.2, 12.5, 13.4,
  15, 14, 15.8, 14.9, 16.7,
  16, 17.3, 16.8, 18.4, 17.7
];

window.addEventListener("load", () => {
  showCharts(
    demo.map((_, i) => "Mốc " + (i + 1)),
    demo
  );
});

// ĐỌC FILE CSV
function parseCSV(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  return lines.map((line, index) => {
    const cols = line
      .split(/[;,\t]/)
      .map(s => s.trim().replace(/^"|"$/g, ""));

    if (cols.length !== 7) {
      throw Error(`Dòng ${index + 1} phải có đúng 7 cột`);
    }

    const nums = cols.map(s => Number(s));

    if (nums.some(n => !Number.isFinite(n))) {
      throw Error(`Dòng ${index + 1} chứa dữ liệu không hợp lệ`);
    }

    return nums;
  });
}

// GOM 5 NGÀY THÀNH 1 NẾN
function processRows(rows) {
  const candles = [];

  for (let i = 0; i < rows.length; i += 5) {
    const group = rows.slice(i, i + 5);

    const open = group[0][0];
    const close = group[group.length - 1][6];

    const allPrices = group.flat();

    const high = Math.max(...allPrices);
    const low = Math.min(...allPrices);

    const ref = i > 0 ? rows[i - 1][6] : open;

    candles.push({
      open, close, high, low, ref
    });
  }

  return candles;
}

// XỬ LÝ KHI NGƯỜI DÙNG CHỌN CSV
$("csvInput").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const rows = parseCSV(await file.text());

    if (!rows.length) {
      throw Error("File CSV trống");
    }

    const candles = processRows(rows);

    const high = Math.max(...candles.map(c => c.high));
    const low = Math.min(...candles.map(c => c.low));

    const rise = candles.filter(c => c.close > c.ref).length;
    const fall = candles.filter(c => c.close < c.ref).length;

    $("days").textContent = rows.length;
    $("candles").textContent = candles.length;
    $("highest").textContent = format(high);
    $("lowest").textContent = format(low);
    $("rise").textContent = rise;
    $("fall").textContent = fall;

    const labels = candles.map((_, i) => "Nến " + (i + 1));
    const values = candles.map(c => c.close);

    showCharts(labels, values);

    $("status").textContent =
      `Đã đọc ${rows.length} ngày và ${candles.length} nến từ ${file.name}.`;

  } catch (error) {
    $("status").textContent =
      "Không thể đọc CSV: " + error.message;
  }
});

// CHỌN VIDEO MP4
let currentVideoUrl;

$("videoInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (currentVideoUrl) {
    URL.revokeObjectURL(currentVideoUrl);
  }

  currentVideoUrl = URL.createObjectURL(file);

  $("stockVideo").src = currentVideoUrl;
  $("stockVideo").load();
});