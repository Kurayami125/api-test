 const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

// ===== BO GÓC =====
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// ===== AUTO FONT =====
function applyText(canvas, text, maxWidth, startSize) {
  const ctx = canvas.getContext("2d");
  let size = startSize;

  do {
    ctx.font = `bold ${size}px Sans`;
    size--;
  } while (ctx.measureText(text).width > maxWidth && size > 20);

  return ctx.font;
}

app.get("/", (req, res) => {
  res.send("🦫 Capy Shop Welcome API Online");
});

app.get("/welcome", async (req, res) => {
  try {

    const avatarURL = req.query.avatar;

    if (!avatarURL) {
      return res.status(400).send("Missing avatar parameter");
    }

    const username = decodeURIComponent(req.query.username || "Member");
    const count = req.query.count || "0";

    const canvas = Canvas.createCanvas(1200, 500);
    const ctx = canvas.getContext("2d");

    // ===== BACKGROUND =====
    try {

      const background = await Canvas.loadImage(
        "https://media.craiyon.com/2025-10-17/z060eYsOSY2hVXSoPImsyA.webp"
      );

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    } catch {

      ctx.fillStyle = "#64584d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

    }

    // Overlay
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ===== CARD =====
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "rgba(26,27,31,0.92)";
    roundRect(ctx, 40, 40, 1120, 420, 35);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Viền xanh
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#8DDC65";
    roundRect(ctx, 40, 40, 1120, 420, 35);
    ctx.stroke();

    // Viền trong
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    roundRect(ctx, 50, 50, 1100, 400, 30);
    ctx.stroke();

    // ===== AVATAR =====
    const avatar = await Canvas.loadImage(avatarURL);

    // Glow avatar
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 50;

    ctx.beginPath();
    ctx.arc(180, 250, 125, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,220,101,0.20)";
    ctx.fill();

    ctx.shadowBlur = 0;

    // Viền trắng
    ctx.beginPath();
    ctx.arc(180, 250, 112, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Avatar tròn
    ctx.save();

    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      avatar,
      80,
      150,
      200,
      200
    );

    ctx.restore();

    // Viền xanh avatar
    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Viền ngoài mờ
    ctx.beginPath();
    ctx.arc(180, 250, 118, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // ===== LOGO CAPY SHOP =====
    try {

      const logo = await Canvas.loadImage(
        "https://i.postimg.cc/Dfjts6q2/Capy-20260605-232214-0000.png"
      );

      // Vòng sáng phía sau logo
      ctx.beginPath();
      ctx.arc(1020, 105, 80, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(141,220,101,0.15)";
      ctx.fill();

      ctx.shadowColor = "#8DDC65";
      ctx.shadowBlur = 25;

      ctx.drawImage(
        logo,
        920,
        10,
        190,
        190
      );

      ctx.shadowBlur = 0;

    } catch {}

    // ===== CAPY SHOP =====
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 20;

    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 65px Sans";
    ctx.fillText(
      "CAPY SHOP",
      340,
      110
    );

    ctx.shadowBlur = 0;

    // ===== WELCOME =====
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 58px Sans";

    ctx.fillText(
      "WELCOME!",
      340,
      180
    );

    // ===== USERNAME =====
    ctx.fillStyle = "#FFFFFF";

    ctx.font = applyText(
      canvas,
      username,
      560,
      50
    );

    ctx.fillText(
      username,
      340,
      255
    );

    // ===== MEMBER COUNT =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 38px Sans";

    ctx.fillText(
      `Member #${count}`,
      340,
      320
    );

    // ===== ĐƯỜNG KẺ =====
    ctx.beginPath();
    ctx.moveTo(340, 345);
    ctx.lineTo(1040, 345);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // ===== DESCRIPTION =====
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "28px Sans";

    ctx.fillText(
      "Cảm ơn bạn đã tham gia cộng đồng CAPY SHOP!",
      340,
      395
    );

    // ===== SLOGAN =====
    ctx.fillStyle = "#D8D8D8";
    ctx.font = "22px Sans";

    ctx.fillText(
      "Nhanh Chóng • Uy Tín • Chuyên Nghiệp • Thân Thiện",
      340,
      435
    );

    // ===== FOOTER =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "18px Sans";

    ctx.fillText(
      "Created by Capy Shop",
      55,
      485
    );

    // ===== HẠT SÁNG =====
    for (let i = 0; i < 25; i++) {

      ctx.beginPath();

      ctx.arc(
        Math.random() * 1200,
        Math.random() * 500,
        Math.random() * 2.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();

    }

    // ===== CHẤM XANH TRANG TRÍ =====
    ctx.fillStyle = "rgba(141,220,101,0.4)";

    ctx.beginPath();
    ctx.arc(1080, 300, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1110, 340, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1050, 380, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1020, 420, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(980, 280, 3, 0, Math.PI * 2);
    ctx.fill();
    // ===== EXPORT PNG =====
    const buffer = canvas.toBuffer("image/png");

    res.setHeader(
      "Content-Type",
      "image/png"
    );

    res.end(buffer);

  } catch (err) {

    console.error(err);

    res.status(500).send(
      err.toString()
    );

  }

});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🦫 Capy Shop Welcome API Online | Port ${PORT}`
  );

});
