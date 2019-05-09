const yup = require('yup')

export const ThreadModel = yup.string().oneOf([
    "DEV",
    "DESIGN",
    "CITIES",
    "IOT",
    "BIZ",
    "DATA"
])