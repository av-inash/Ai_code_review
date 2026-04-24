import { streamService } from "../services/streamService.js";

export const streamController = {

  streamReview: async (req, res, next) => {
    try {
      const { code, language } = req.body
      await streamService.streamReview(code, language, res)
    } catch (err) {
      next(err)
    }
  },

  streamExplain: async (req, res, next) => {
    try {
      const { code, language } = req.body
      await streamService.streamExplain(code, language, res)
    } catch (err) {
      next(err)
    }
  }
}