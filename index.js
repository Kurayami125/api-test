const express = require("express");
const Canvas = require("@napi-rs/canvas");

const app = express();

app.get("/welcome", async (req, res) => {
    try {
        const avatarURL = req.query.avatar;
        const username = req.query.username || "Member";
        const count = req.query.count || "0";

        const canvas = Canvas.createCanvas(1200, 400);
        const ctx = canvas.getContext("2d");

        // Nền
        ctx.fillStyle = "#1e1f22";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Viền xanh
        ctx.strokeStyle = "#8DDC65";
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Avatar
        const avatar = await Canvas.loadImage(avatarURL);

        ctx.save();
        ctx.beginPath();
        ctx.arc(180, 200, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 80, 100, 200, 200);
        ctx.restore();

        // Text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 50px Sans";
        ctx.fillText("WELCOME TO CAPY SHOP", 330, 130);

        ctx.font = "40px Sans";
        ctx.fillText(username, 330, 220);

        ctx.font = "30px Sans";
        ctx.fillText(`Member #${count}`, 330, 290);

        res.set("Content-Type", "image/png");
        res.send(canvas.toBuffer("image/png"));
    } catch (err) {
        res.status(500).send(err.toString());
    }
});

app.listen(process.env.PORT || 3000);