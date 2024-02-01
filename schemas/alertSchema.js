const Joi = require("joi");
const alertSchema = Joi.object().keys({
  receiver: Joi.string().required(),
  status: Joi.string().valid("firing").required(),
  alerts: Joi.array().length(7).required(),
  groupLabels: Joi.object().required(),
  commonLabels: Joi.object().required(),
  commonAnnotations: Joi.object().length(1).required(),
  externalURL: Joi.string().required(),
  version: Joi.string().required(),
  groupKey: Joi.string().required(),
  truncatedAlerts: Joi.number().integer().required(),
});

module.exports = alertSchema;
