import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Start server (local development only — Vercel uses api/index.ts instead)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
