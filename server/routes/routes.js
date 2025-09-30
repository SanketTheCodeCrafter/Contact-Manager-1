import express from 'express'
import { Register, Login, Auth } from '../controller/userController.js'
import {
  AddContact, getContacts, getContact, updateContact, deleteContact
} from '../controller/contactController.js'
import { VerifyUser } from '../middleware/VerifyUser.js'

const router = express.Router()

// auth
router.post('/register', Register)
router.post('/login', Login)
router.get('/auth', VerifyUser, Auth)

// contacts
router.post('/add-contacts', VerifyUser, AddContact)
router.get('/contacts', VerifyUser, getContacts)
router.get('/contacts/:id', VerifyUser, getContact)
router.put('/update-contacts/:id', VerifyUser, updateContact)
router.delete('/contacts/:id', VerifyUser, deleteContact)

export { router as Router }
