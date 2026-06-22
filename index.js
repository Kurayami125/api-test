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

    if (!avatarURL)
      return res.status(400).send("Missing avatar parameter");

    const username = decodeURIComponent(req.query.username || "Member");
    const count = req.query.count || "0";

    const canvas = Canvas.createCanvas(1200, 500);
    const ctx = canvas.getContext("2d");

    // ===== BACKGROUND =====
    try {
      const background = await Canvas.loadImage(
        "https://media.craiyon.com/2025-10-17/z060eYsOSY2hVXSoPImsyA.webp"
      );

      ctx.drawImage(background, 0, 0, 1200, 500);
    } catch {
      ctx.fillStyle = "#64584d";
      ctx.fillRect(0, 0, 1200, 500);
    }

    // Overlay
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, 1200, 500);

    // ===== CARD =====
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "rgba(30,31,34,0.90)";
    roundRect(ctx, 40, 40, 1120, 420, 30);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#8DDC65";
    roundRect(ctx, 40, 40, 1120, 420, 30);
    ctx.stroke();

    // ===== AVATAR =====
    const avatar = await Canvas.loadImage(avatarURL);

    // Glow ngoài
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 40;

    ctx.beginPath();
    ctx.arc(180, 250, 120, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,220,101,0.25)";
    ctx.fill();

    ctx.shadowBlur = 0;

    // Viền trắng
    ctx.beginPath();
    ctx.arc(180, 250, 108, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Avatar tròn
    ctx.save();

    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(avatar, 80, 150, 200, 200);

    ctx.restore();

    // Viền xanh
    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke(); 

// ===== TEXT SHADOW =====
    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;

    // CAPY SHOP
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 68px Sans";
    ctx.fillText("CAPY SHOP", 340, 115);

    // WELCOME
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px Sans";
    ctx.fillText("WELCOME!", 340, 190);

    // Username (auto font size)
    ctx.fillStyle = "#ffffff";
    ctx.font = applyText(canvas, username, 760, 52);
    ctx.fillText(username, 340, 280);

    // Member Count
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 40px Sans";
    ctx.fillText(`Member #${count}`, 340, 340);

    // Mô tả
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px Sans";
    ctx.fillText(
      "Cam on ban da tham gia cong dong Capy Shop!",
      340,
      405
    );

    ctx.font = "20px Sans";
    ctx.fillStyle = "#d9d9d9";
    ctx.fillText(
      "Nhanh Chong • Uy Tin • Chuyen Nghiep • Than Thien",
      340,
      440
    );

    // Footer
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#8DDC65";
    ctx.font = "18px Sans";
    ctx.fillText(
      "Created by Capy Shop",
      55,
      485
    );

    // ===== OUTPUT =====
    const buffer = canvas.toBuffer("image/png");

    res.setHeader("Content-Type", "image/png");
    res.end(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🦫 Server running on port ${PORT}`);
});
