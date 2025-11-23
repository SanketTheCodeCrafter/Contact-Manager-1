import express from 'express'
import { Register, Login, Auth, updateProfile } from '../controller/userController.js'
import {
  AddContact, getContacts, getContact, updateContact, deleteContact
} from '../controller/contactController.js'
import { VerifyUser } from '../middleware/VerifyUser.js'
import { body } from 'express-validator'

const router = express.Router()

// auth
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please include a valid email'),
  body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], Register)

router.post('/login', [
  body('email').trim().isEmail().withMessage('Please include a valid email'),
  body('password').trim().notEmpty().withMessage('Password is required')
], Login)

router.get('/auth', VerifyUser, Auth)
router.put('/update-profile', VerifyUser, updateProfile)

// contacts
router.post('/add-contacts', VerifyUser, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please include a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').optional().trim()
], AddContact)

router.get('/contacts', VerifyUser, getContacts)
router.get('/contacts/:id', VerifyUser, getContact)
router.put('/update-contacts/:id', VerifyUser, updateContact)
router.delete('/contacts/:id', VerifyUser, deleteContact)

export { router as Router }
