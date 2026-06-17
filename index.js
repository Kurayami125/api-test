const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

app.get("/", (req, res) => {
  res.send("Capy Shop API Online");
});

app.get("/welcome", async (req, res) => {
  try {
    const avatarURL = req.query.avatar;

    if (!avatarURL) {
      return res.status(400).send("Missing avatar parameter");
    }

    const username = req.query.username || "Member";
    const count = req.query.count || "0";

    const canvas = Canvas.createCanvas(1200, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#2F3E2F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Overlay
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card
    ctx.fillStyle = "#1e1f22";
    ctx.fillRect(40, 40, 1120, 420);

    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.strokeRect(40, 40, 1120, 420);

    // Avatar
    const avatar = await Canvas.loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 80, 150, 200, 200);

    ctx.restore();

    // Avatar Border
    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Text
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 55px Sans";
    ctx.fillText("CAPY SHOP", 340, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Sans";
    ctx.fillText("WELCOME!", 340, 190);

    ctx.font = "bold 40px Sans";
    ctx.fillText(username, 340, 270);

    ctx.fillStyle = "#8DDC65";
    ctx.font = "32px Sans";
    ctx.fillText("Member #" + count, 340, 330);

    ctx.fillStyle = "#ffffff";
    ctx.font = "26px Sans";
    ctx.fillText(
      "Cam on ban da tham gia cong dong Capy Shop!",
      340,
      400
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
  console.log("Server running on port " + PORT);
}); 
