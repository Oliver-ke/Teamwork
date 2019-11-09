/* eslint-disable import/prefer-default-export */
import { body } from 'express-validator';

const nameRegex = /^[A-Za-z\-']{2,250}$/;

export const userRegister = [
  body('firstName')
    .matches(nameRegex)
    .trim()
    .withMessage('firstName should be an alphabet between 2 and 250 characters'),
  body('lastName').matches(nameRegex).trim().withMessage('lastName should be an alphabet between 2 and 250 characters'),
  body('password', 'password should be at least 6 characters').isLength({ min: 6 }),
  body('gender').not().isEmpty().trim()
    .isIn(['male', 'female'])
    .withMessage('please specify male or female'),
  body('jobRole').not().isEmpty()
    .isString()
    .withMessage('Provide a jobRole')
    .trim(),
  body('department').not().isEmpty()
    .isString()
    .withMessage('Provide your department')
    .trim(),
  body('address').not().isEmpty()
    .isString()
    .withMessage('Provide your address')
    .trim(),
  body('email', 'Please provide a valid email').isEmail().isLength({ min: 3, max: 250 }).trim(),
];

export const loginUser = [
  body('email').not().isEmpty()
    .isEmail()
    .withMessage('Provide your email')
    .trim(),
  body('password').not().isEmpty()
    .isString()
    .withMessage('Provide your password')
    .trim(),
];

export const createGif = [
  body('title').not().isEmpty().isString()
    .withMessage('Provide a title for gif')
    .trim(),
  body('share').optional().isBoolean().withMessage('Share should be true or false else default to true')
];
