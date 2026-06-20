const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

app.get("/", (req, res) => {
  res.send("🦫 Capy Shop API Online");
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

    // ===== CAPYBARA BACKGROUND =====
    const background = await Canvas.loadImage(
  "https://raw.githubusercontent.com/rafaballerini/capybara-wallpapers/main/pastel-capybara-1.png"
);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Overlay tối
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ===== CARD =====
    ctx.fillStyle = "rgba(30,31,34,0.88)";
    ctx.fillRect(40, 40, 1120, 420);

    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 420);

    // ===== AVATAR =====
    const avatar = await Canvas.loadImage(avatarURL);

    // Vòng phát sáng
    ctx.beginPath();
    ctx.arc(180, 250, 115, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,220,101,0.25)";
    ctx.fill();

    // Avatar tròn
    ctx.save();
    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 80, 150, 200, 200);

    ctx.restore();

    // Viền avatar
    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();

    // ===== LOGO =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 58px Sans";
    ctx.fillText("CAPY SHOP", 340, 110);

    // ===== WELCOME =====
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Sans";
    ctx.fillText("WELCOME!", 340, 180);

    // ===== USERNAME =====
    let displayName = username;

    if (displayName.length > 24) {
      displayName = displayName.slice(0, 24) + "...";
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Sans";
    ctx.fillText(displayName, 340, 260);

    // ===== MEMBER COUNT =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 34px Sans";
    ctx.fillText("Member #" + count, 340, 320);

    // ===== DESCRIPTION =====
    ctx.fillStyle = "#ffffff";
    ctx.font = "26px Sans";
    ctx.fillText(
      "Cam on ban da tham gia cong dong Capy Shop!",
      340,
      390
    );

    ctx.fillText(
      "Nhanh Chóng • Uy tín • Chuyên Nghiệp • Thân Thiện",
      340,
      430
    );

    // ===== FOOTER =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "20px Sans";
    ctx.fillText(
      "Created by Capy Shop",
      50,
      485
    );

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
