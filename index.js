const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

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

function applyText(canvas, text, maxWidth, startSize) {
  const ctx = canvas.getContext("2d");
  let fontSize = startSize;

  do {
    ctx.font = `bold ${fontSize -= 2}px Sans`;
  } while (ctx.measureText(text).width > maxWidth);

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

      const gradient = ctx.createLinearGradient(0, 0, 1200, 500);
      gradient.addColorStop(0, "#53473d");
      gradient.addColorStop(1, "#7c6856");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 500);

    }

    // overlay
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, 1200, 500);

    // card
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "rgba(26,27,31,0.92)";
    roundRect(ctx, 40, 40, 1120, 420, 35);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#8DDC65";
    roundRect(ctx, 40, 40, 1120, 420, 35);
    ctx.stroke();

    // avatar
    const avatar = await Canvas.loadImage(avatarURL);

    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 40;

    ctx.beginPath();
    ctx.arc(180, 250, 120, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,220,101,0.25)";
    ctx.fill();

    ctx.shadowBlur = 0;

    // viền trắng
    ctx.beginPath();
    ctx.arc(180, 250, 108, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.save();

    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(avatar, 80, 150, 200, 200);

    ctx.restore();

    // viền xanh
    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();
    // Capybara góc phải
    try {

      const capy = await Canvas.loadImage(
        "https://i.postimg.cc/Fz188XgB/images-(2).jpg"
      );

      ctx.globalAlpha = 0.95;
      ctx.drawImage(capy, 930, 55, 170, 170);
      ctx.globalAlpha = 1;

    } catch {}

    // CAPY SHOP
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 15;

    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 60px Sans";
    ctx.fillText("CAPY SHOP", 340, 110);

    ctx.shadowBlur = 0;

    // Welcome
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 58px Sans";
    ctx.fillText("WELCOME!", 340, 180);

    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = applyText(canvas, username, 600, 52);
    ctx.fillText(username, 340, 255);

    // Member
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 38px Sans";
    ctx.fillText(`Member #${count}`, 340, 315);

    // Nội dung
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Sans";

    ctx.fillText(
      "Cảm ơn bạn đã tham gia cộng đồng CAPY SHOP!",
      340,
      385
    );

    ctx.font = "24px Sans";

    ctx.fillText(
      "Nhanh Chóng • Uy Tín • Chuyên Nghiệp • Thân Thiện",
      340,
      430
    );

    // hạt sáng
    for (let i = 0; i < 30; i++) {

      ctx.beginPath();

      ctx.arc(
        Math.random() * 1200,
        Math.random() * 500,
        Math.random() * 2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fill();

    }

    ctx.fillStyle = "#8DDC65";
    ctx.font = "22px Sans";
    ctx.fillText("Created by Capy Shop", 55, 485);

    const buffer = canvas.toBuffer("image/png");

    res.setHeader("Content-Type", "image/png");
    res.end(buffer);

  } catch (err) {

    console.error(err);
    res.status(500).send(err.toString());

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🦫 Server running on port " + PORT);
});
