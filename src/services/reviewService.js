import { getModel } from "../config/gemini.js";
import { reviewPrompt, explainPrompt,securityPrompt,comparePrompt } from "../prompts/reviewPrompts.js";
import { cacheService } from "./cacheService.js";
// This function safely parses JSON from AI response
// AI sometimes adds extra text — this handles that
const parseAIResponse = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    let cleaned = text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim()
    try {
      return JSON.parse(cleaned)
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      console.error('[AI RAW RESPONSE]:', text)
      throw new Error('AI returned invalid JSON format')
    }
  }
}

export const reviewService = {

  reviewCode: async (code,language="english") => {


    const cacheKey= cacheService.generateKey("review",code,language)
    const cached=await cacheService.get(cacheKey)
    if(cached)return cached
    const model = getModel(0.1);
    const prompt = reviewPrompt(code,language);
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // const text = result.response.text()
// console.log('[GEMINI RAW]:', text)  // ← add this
    
    const parsed = parseAIResponse(text);
    
    // Add metadata
    const response = {
      ...parsed,
      reviewedAt: new Date().toISOString(),
      codeLength: code.split('\n').length + " lines",
      cached: false  // pehli baar aa raha hai
    }
    await cacheService.set(cacheKey,{...response,cached:true})
    return response
  },

  explainCode: async (code,language="english") => {


    const cacheKey=cacheService.generateKey("explain",code,language)
    const cached=await cacheService.get(cacheKey)
    if(cached)return cached
    const model = getModel(0.3); // slightly higher temp for explanation
    const prompt = explainPrompt(code,language);
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const parsed = parseAIResponse(text);

    const response={
      ...parsed,
      explainedAt:new Date().toISOString(),
      cached:false
    }

  await cacheService.set(cacheKey,{...response,cached:true})
  return response
  },

  securityScan: async (code, language = "english") => {

     const cacheKey = cacheService.generateKey("security", code, language)
    const cached = await cacheService.get(cacheKey)
    if (cached) return cached

  const model = getModel(0.1)
  const prompt = securityPrompt(code, language)
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const parsed = parseAIResponse(text)


  const response = {
      ...parsed,
      scannedAt: new Date().toISOString(),
      codeLength: code.split('\n').length + " lines",
      cached: false
    }
    await cacheService.set(cacheKey, { ...response, cached: true })
    return response
},

compareCode: async (code1, code2, language = "english") => {

   const cacheKey = cacheService.generateKey("compare", code1 + code2, language)
    const cached = await cacheService.get(cacheKey)
    if (cached) return cached

  const model = getModel(0.1)
  const prompt = comparePrompt(code1, code2, language)
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const parsed = parseAIResponse(text)


   const response = {
      ...parsed,
      comparedAt: new Date().toISOString(),
      cached: false
    }

    await cacheService.set(cacheKey, { ...response, cached: true })
    return response
}
};










