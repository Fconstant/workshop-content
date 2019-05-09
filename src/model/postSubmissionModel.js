const yup = require('yup')
import { ThreadModel } from './threadModel';

export const PostSubmissionModel = yup.object().shape({
    title: yup.string().required(),
    speaker: yup.object().required().shape({
        email: yup.string().required().email(),
        name: yup.string().required()
    }),
    threads: yup.array().of(ThreadModel),
    materials: yup.string(),
    subject: yup.string()
})