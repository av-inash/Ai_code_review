import Joi from "joi";

const codeSchema = Joi.object({
  code: Joi.string().min(5).max(10000).required().messages({
    "string.min": "Code must be at least 5 characters",
    "string.max": "Code must not exceed 10,000 characters",
    "any.required": "code field is required",
  }),
  language: Joi.string()
    .valid("english", "hinglish", "hindi")
    .default("english")
})

export const validateCodeRequest = (req, res, next) => {
  const { error } = codeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
    });
  }
  next();
};

const securitySchema = Joi.object({
  code: Joi.string().min(5).max(10000).required(),
  language: Joi.string().valid("english", "hinglish").default("english")
})

const compareSchema = Joi.object({
  code1: Joi.string().min(5).max(10000).required().messages({
    "any.required": "code1 field is required"
  }),
  code2: Joi.string().min(5).max(10000).required().messages({
    "any.required": "code2 field is required"
  }),
  language: Joi.string().valid("english", "hinglish").default("english")
})

export const validateSecurityRequest = (req, res, next) => {
  const { error } = securitySchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    })
  }
  next()
}

export const validateCompareRequest = (req, res, next) => {
  const { error } = compareSchema.validate(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    })
  }
  next()
}


