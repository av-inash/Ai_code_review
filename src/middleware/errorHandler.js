export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  if (err.message?.includes("API_KEY")) {
    return res.status(401).json({
      success: false,
      error: "Invalid API configuration.",
    });
  }

  if (err.message?.includes("quota") || err.message?.includes("429")) {
    return res.status(429).json({
      success: false,
      error: "AI quota exceeded. Please try again later.",
    });
  }

  if (err.message?.includes("invalid JSON")) {
    return res.status(500).json({
      success: false,
      error: "AI returned unexpected response. Please try again.",
    });
  }

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "development"
      ? err.message
      : "Internal server error",
  });
};