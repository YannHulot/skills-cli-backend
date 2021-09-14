import Joi from 'joi';

export const jobIdValidator = Joi.object({
  jobId: Joi.number().integer().required(),
});

const jobInputValidator = Joi.object({
  title: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  companyName: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  description: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  startDate: Joi.date().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.required(),
  }),
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .alter({
      create: (schema) => schema.optional(),
      update: (schema) => schema.optional(),
    }),
  stack: Joi.array()
    .items(Joi.string())
    .alter({
      create: (schema) => schema.optional(),
      update: (schema) => schema.optional(),
    }),
});

export const createJobValidator = jobInputValidator.tailor('create');

export const updateJobValidator = jobInputValidator.tailor('update');
