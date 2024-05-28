import express from 'express';
import { Register,Login,Auth} from '../controller/userController.js';
import { body } from 'express-validator';
import { VerifyUser } from '../middleware/VerifyUser.js';
import { createContact, getContacts,getContact ,updateContact,deleteContact} from '../controller/contactController.js';
import { ContactModel } from '../models/Contact.js';

const router = express.Router();
// user routes
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage("Name should not be empty"),
        body('email').trim().notEmpty().withMessage("Email should not be empty").isEmail().withMessage("Invalid Email!!"),
        body('password').trim().notEmpty().withMessage("Password should not be empty").isLength({ min: 5, max: 30 }).withMessage("Password Length should be 5-30")
    ],
    Register
);
router.post(
    '/login',
    [
       
        body('email').trim().notEmpty().withMessage("Email should not be empty").isEmail().withMessage("Invalid Email!!"),
        body('password').trim().notEmpty().withMessage("Password should not be empty").isLength({ min: 5, max: 30 }).withMessage("Password Length should be 5-30")
    ],
    Login
);
router.get('/verify', VerifyUser,Auth)
// contact routes


router.post('/add-contacts',VerifyUser ,createContact)
router.get('/contacts',VerifyUser ,getContacts)
router.get('/contacts/:id',VerifyUser ,getContact)
router.put('/update-contacts/:id',VerifyUser ,updateContact)
router.delete('/contacts/:id',VerifyUser ,deleteContact)
export { router as Router };
