const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

app.get("/welcome", async (req, res) => {
  try {
    const avatarURL = req.query.avatar;
    const username = decodeURIComponent(req.query.username || "Member");
    const count = req.query.count || "0";

    const canvas = Canvas.createCanvas(1200, 500);
    const ctx = canvas.getContext("2d");

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 500);
    gradient.addColorStop(0, "#4A3728");
    gradient.addColorStop(1, "#8B6B4A");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decoration circles
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * 1200,
        Math.random() * 500,
        Math.random() * 60 + 20,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Main card
    ctx.fillStyle = "#1f2027";
    ctx.roundRect(40, 40, 1120, 420, 30);
    ctx.fill();

    // Green border
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Avatar
    const avatar = await Canvas.loadImage(avatarURL);

    // Glow
    ctx.shadowColor = "#8DDC65";
    ctx.shadowBlur = 40;

    ctx.save();
    ctx.beginPath();
    ctx.arc(180, 250, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 70, 140, 220, 220);
    ctx.restore();

    ctx.shadowBlur = 0;

    // Avatar border
    ctx.beginPath();
    ctx.arc(180, 250, 115, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Title
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 56px Sans";
    ctx.fillText("🦫 CAPY SHOP", 350, 120);

    // Welcome
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 46px Sans";
    ctx.fillText("WELCOME!", 350, 190);

    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Sans";

    let displayName = username;
    if (displayName.length > 22) {
      displayName = displayName.slice(0, 22) + "...";
    }

    ctx.fillText(displayName, 350, 270);

    // Member count
    ctx.fillStyle = "#8DDC65";
    ctx.font = "36px Sans";
    ctx.fillText(`Member #${count}`, 350, 330);

    // Welcome message
    ctx.fillStyle = "#d9d9d9";
    ctx.font = "28px Sans";
    ctx.fillText(
      "Cảm ơn bạn đã tham gia cộng đồng Capy Shop!",
      350,
      390
    );

    ctx.fillText(
      "Chúc bạn có những trải nghiệm tuyệt vời 🥰",
      350,
      430
    );

    // Footer
    ctx.fillStyle = "#8DDC65";
    ctx.font = "24px Sans";
    ctx.fillText(
      `Generated: ${new Date().toLocaleString("vi-VN")}`,
      40,
      485
    );

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer("image/png"));
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

app.get("/", (req, res) => {
  res.send("Capy Shop Welcome API Online");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Capy Shop API Started");
});
