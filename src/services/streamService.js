import { getModel } from "../config/gemini.js";
import { reviewPrompt, explainPrompt } from "../prompts/reviewPrompts.js";

// Ye helper function headers set karta hai
// Har streaming endpoint ke liye same headers chahiye
const setStreamHeaders = (res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.flushHeaders()
}

// Ye helper function chunk bhejta hai client ko
const sendChunk = (res, data) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

export const streamService = {

  streamReview: async (code, language = "english", res) => {
    const model = getModel(0.1)
    const prompt = reviewPrompt(code, language)

    // Step 1: Headers set karo — browser ko batao streaming aa rahi hai
    setStreamHeaders(res)

    try {
      // Step 2: Gemini ko streaming mode mein call karo
      const result = await model.generateContentStream(prompt)

      let fullText = ""

      // Step 3: Har chunk aate hi client ko bhejo
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        fullText += chunkText

        // Client ko chunk bhejo — browser console mein ye dikhega
        sendChunk(res, { chunk: chunkText })
      }

      // Step 4: Sab chunks aa gaye — ab JSON parse karo
      try {
        let cleaned = fullText
          .replace(/```json\n?/gi, "")
          .replace(/```\n?/gi, "")
          .trim()

        const parsed = JSON.parse(cleaned)

        // Final complete result bhejo
        sendChunk(res, {
          done: true,
          result: {
            ...parsed,
            reviewedAt: new Date().toISOString(),
            codeLength: code.split("\n").length + " lines",
          }
        })

      } catch {
        sendChunk(res, {
          done: true,
          error: "AI response parse nahi hua — dobara try karo"
        })
      }

    } catch (err) {
      sendChunk(res, { error: err.message })
    } finally {
      // Step 5: Connection band karo
      res.end()
    }
  },

  streamExplain: async (code, language = "english", res) => {
    const model = getModel(0.3)
    const prompt = explainPrompt(code, language)

    setStreamHeaders(res)

    try {
      const result = await model.generateContentStream(prompt)

      let fullText = ""

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        fullText += chunkText
        sendChunk(res, { chunk: chunkText })
      }

      try {
        let cleaned = fullText
          .replace(/```json\n?/gi, "")
          .replace(/```\n?/gi, "")
          .trim()

        const parsed = JSON.parse(cleaned)

        sendChunk(res, {
          done: true,
          result: {
            ...parsed,
            explainedAt: new Date().toISOString(),
          }
        })

      } catch {
        sendChunk(res, {
          done: true,
          error: "AI response parse nahi hua"
        })
      }

    } catch (err) {
      sendChunk(res, { error: err.message })
    } finally {
      res.end()
    }
  }
}