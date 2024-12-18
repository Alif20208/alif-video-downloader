const express = require("express");
const ytdl = require("ytdl-core"); // YouTube ভিডিও ডাউনলোডের জন্য লাইব্রেরি
const app = express();

// আপনার API সম্পর্কে একটি পরিচিতি রুট
app.get("/", (req, res) => {
  res.send("স্বাগতম! এই ভিডিও ডাউনলোডার API তৈরি করেছেন [আপনার নাম]।");
});

// ভিডিও ডাউনলোড API রুট
app.get("/download", async (req, res) => {
  const videoUrl = req.query.url; // ইউজার থেকে ভিডিও URL ইনপুট
  if (!videoUrl) {
    return res.status(400).send("অনুগ্রহ করে একটি বৈধ URL দিন।");
  }

  try {
    const videoInfo = await ytdl.getInfo(videoUrl); // ভিডিও তথ্য বের করা
    const title = videoInfo.videoDetails.title;

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(videoUrl, { format: "mp4" }).pipe(res); // ভিডিও ডাউনলোড করা
  } catch (error) {
    console.error("ডাউনলোড করতে সমস্যা হচ্ছে:", error.message);
    res.status(500).send("ভিডিও ডাউনলোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
  }
});

// Vercel এর জন্য লিস্টেনার
app.listen(3000, () => console.log("সার্ভার চালু হয়েছে 3000 পোর্টে।"));

module.exports = app; // Vercel এর জন্য এক্সপোর্ট
