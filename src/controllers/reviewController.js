import { reviewService } from "../services/reviewService.js";

export const reviewController = {

  reviewCode: async (req, res, next) => {
    try {
      const { code ,language} = req.body;
      const result = await reviewService.reviewCode(code,language);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  explainCode: async (req, res, next) => {
    try {
      const { code ,language} = req.body;
      const result = await reviewService.explainCode(code,language);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  securityScan: async (req, res, next) => {
  try {
    const { code, language } = req.body
    const result = await reviewService.securityScan(code, language)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
},

compareCode: async (req, res, next) => {
  try {
    const { code1, code2, language } = req.body
    const result = await reviewService.compareCode(code1, code2, language)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
};







