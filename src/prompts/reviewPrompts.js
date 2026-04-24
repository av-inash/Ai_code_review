// RULE 1: Role
// RULE 2: Output format
// RULE 3: Examples
// RULE 4: What not to do
// RULE 5: Chain of thought
// RULE 6: Constraints

export const reviewPrompt = (code, language = "english") => {

  const languageInstruction = {
    english: "Respond in professional English.",
    hinglish: "Respond in Hinglish — mix Hindi and English naturally like Indian developers talk. Example: 'Bhai yahan SQL injection ka issue hai, parameterized queries use kar.'",

  }

  return `Analyze this code and return JSON only.

LANGUAGE RULE: ${languageInstruction[language]}
Apply this language to: summary, bugs.issue, bugs.fix, security.description, improvements

ABSOLUTE RULES - NO EXCEPTIONS:
- Your entire response must be a single JSON object
- Start your response with { immediately
- End your response with } immediately
- Zero text before or after the JSON
- Zero markdown, zero backticks, zero thinking out loud
- If you write anything outside JSON you have failed

JSON structure to return:
{"language":"detected language","score":0,"summary":"one line verdict","bugs":[{"line":1,"severity":"critical","issue":"what is wrong","fix":"how to fix"}],"security":[{"type":"vulnerability type","severity":"critical","description":"details"}],"improvements":["suggestion 1","suggestion 2"]}

Scoring:
0-20 = dangerous, 21-40 = major bugs, 41-60 = significant problems, 61-80 = minor issues, 81-100 = excellent

Steps:
1. Detect language
2. Find bugs and logic errors
3. Check SQL injection, XSS, hardcoded secrets, missing validation
4. Suggest improvements
5. Score honestly - never above 80 unless genuinely excellent
6. Return JSON immediately with no preamble

Always flag: console.log statements, var in JS, missing error handling, SQL injection

Code:
${code}`
}

export const explainPrompt = (code, language = "english") => {

  const languageInstruction = {
    english: "Respond in professional English.",
    hinglish: "Respond in Hinglish — mix Hindi and English naturally like Indian developers talk.",
    hindi: "Respond in pure Hindi. Technical terms English mein rakh but explanation Hindi mein de."
  }

  return `Explain this code and return JSON only.

LANGUAGE RULE: ${languageInstruction[language]}
Apply this language to: purpose, explanation, quickTip

ABSOLUTE RULES - NO EXCEPTIONS:
- Your entire response must be a single JSON object
- Start your response with { immediately
- End your response with } immediately
- Zero text before or after the JSON
- Zero markdown, zero backticks, zero thinking out loud

JSON structure to return:
{"language":"detected language","purpose":"one sentence purpose","explanation":"step by step in simple English under 150 words","keyConceptsUsed":["concept1","concept2"],"difficultyLevel":"beginner","canBeImproved":true,"quickTip":"one useful tip"}

Code:
${code}`
}



export const securityPrompt = (code, language = "english") => {

  const languageInstruction = {
    english: "Respond in professional English.",
    hinglish: "Respond in Hinglish — mix Hindi and English naturally like Indian developers talk."
  }

  return `You are a cybersecurity expert with 10 years experience in penetration testing and secure code review.

Perform a DEEP security analysis of this code and return JSON only.

LANGUAGE RULE: ${languageInstruction[language]}
Apply this language to: verdict, all description fields, recommendation fields.

ABSOLUTE RULES:
- Your entire response must be a single JSON object
- Start with { immediately, end with } immediately
- Zero markdown, zero backticks, zero text outside JSON

JSON structure to return:
{
  "language": "detected language",
  "securityScore": 0,
  "verdict": "one line security verdict",
  "riskLevel": "critical|high|medium|low",
  "vulnerabilities": [
    {
      "type": "vulnerability name",
      "severity": "critical|high|medium|low",
      "line": 1,
      "description": "what is vulnerable and why",
      "exploit": "how an attacker would exploit this",
      "fix": "exact fix with code example"
    }
  ],
  "secureCodeExample": "show the fixed version of the code",
  "recommendations": [
    "recommendation 1",
    "recommendation 2"
  ]
}

Security checks to perform:
1. SQL Injection
2. XSS (Cross Site Scripting)
3. Command Injection
4. Hardcoded secrets or API keys
5. Insecure authentication
6. Missing input validation
7. Sensitive data exposure
8. Insecure dependencies
9. Path traversal
10. Broken access control

Scoring:
0-20 = Critical risk, do not deploy
21-40 = High risk, major fixes needed
41-60 = Medium risk, some fixes needed
61-80 = Low risk, minor improvements
81-100 = Secure code

IMPORTANT: Also show secureCodeExample — the fixed version of the code.
This helps developer understand exactly what to change.

Code to analyze:
${code}`
}

export const comparePrompt = (code1, code2, language = "english") => {

  const languageInstruction = {
    english: "Respond in professional English.",
    hinglish: "Respond in Hinglish — mix Hindi and English naturally like Indian developers talk."
  }

  return `You are a senior software engineer. Compare these two code snippets and return JSON only.

LANGUAGE RULE: ${languageInstruction[language]}
Apply this language to: verdict, all explanation fields, suggestion fields.

ABSOLUTE RULES:
- Your entire response must be a single JSON object
- Start with { immediately, end with } immediately
- Zero markdown, zero backticks, zero text outside JSON

JSON structure to return:
{
  "winner": "code1|code2|tie",
  "verdict": "one line explanation of which is better and why",
  "code1Analysis": {
    "score": 0,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "code2Analysis": {
    "score": 0,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "comparisonPoints": [
    {
      "aspect": "aspect name like Security/Performance/Readability",
      "code1": "how code1 handles this",
      "code2": "how code2 handles this",
      "winner": "code1|code2|tie"
    }
  ],
  "suggestion": "what the developer should do next to improve the winning code"
}

Compare on these aspects:
1. Security — which is more secure
2. Performance — which is faster
3. Readability — which is easier to read
4. Error handling — which handles errors better
5. Best practices — which follows modern standards

Code 1:
${code1}

Code 2:
${code2}`
}






