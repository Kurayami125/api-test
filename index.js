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

    // ===== BACKGROUND =====
    try {
      const background = await Canvas.loadImage(
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/43a44951-8866-4a53-bf09-a27850e06061/dgwrkew-416b5222-1a6f-4e61-9134-00fa6d378d89.png/v1/fill/w_1192,h_670,q_70,strp/capybara_wallpaper_by_mangoarrow_dgwrkew-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6Ii9mLzQzYTQ0OTUxLTg4NjYtNGE1My1iZjA5LWEyNzg1MGUwNjA2MS9kZ3dya2V3LTQxNmI1MjIyLTFhNmYtNGU2MS05MTM0LTAwZmE2ZDM3OGQ4OS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.YV09pxWbRAptga092z_oBwT0QgifMwp6Lyhq5cRhOik"
      );

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    } catch {
      ctx.fillStyle = "#5E4A36";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

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

    ctx.beginPath();
    ctx.arc(180, 250, 115, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,220,101,0.25)";
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(180, 250, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 80, 150, 200, 200);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(180, 250, 105, 0, Math.PI * 2);
    ctx.strokeStyle = "#8DDC65";
    ctx.lineWidth = 5;
    ctx.stroke();

    // ===== TEXT =====
    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 58px Sans";
    ctx.fillText("CAPY SHOP", 340, 110);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Sans";
    ctx.fillText("WELCOME!", 340, 180);

    let displayName = username;
    if (displayName.length > 24) {
      displayName = displayName.slice(0, 24) + "...";
    }

    ctx.font = "bold 42px Sans";
    ctx.fillText(displayName, 340, 260);

    ctx.fillStyle = "#8DDC65";
    ctx.font = "bold 34px Sans";
    ctx.fillText("Member #" + count, 340, 320);

    ctx.fillStyle = "#ffffff";
    ctx.font = "26px Sans";
    ctx.fillText(
      "Cam on ban da tham gia cong dong Capy Shop!",
      340,
      390
    );

    ctx.font = "22px Sans";
    ctx.fillText(
      "Nhanh Chong • Uy Tin • Chuyen Nghiep • Than Thien",
      340,
      430
    );

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
