import { ContactModel } from '../models/Contact.js';
import { validationResult } from 'express-validator';

const AddContact = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address } = req.body;

    try {
        const newContact = new ContactModel({
            name,
            email,
            phone,
            address,
            postedBy: req.user._id
        });

        const result = await newContact.save();
        return res.status(201).json({ success: true, ...result._doc });
    } catch (err) {
        if (err.code === 11000) {
            if (err.keyPattern.email) {
                return res.status(400).json({ message: "Contact with this email already exists" });
            }
            if (err.keyPattern.phone) {
                return res.status(400).json({ message: "Contact with this phone number already exists" });
            }
        }
        return res.status(500).json({ error: err.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        const query = { postedBy: req.user._id };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const contacts = await ContactModel.find(query)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort({ name: 1 }); // Optional: sort by name

        const total = await ContactModel.countDocuments(query);

        return res.status(200).json({
            success: true,
            contacts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).json({ error: "No id found" });
    }
    try {
        const contact = await ContactModel.findOne({ _id: id });
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        return res.status(200).json({ success: true, ...contact._doc });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).json({ error: "No id found" });
    }
    try {
        const result = await ContactModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(200).json({ success: true, ...result._doc });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).json({ error: "No id Specified" });
    }
    try {
        const contact = await ContactModel.findOne({ _id: id });
        if (!contact) {
            return res.status(404).json({ error: "No Record Existed" });
        }
        await ContactModel.findByIdAndDelete(id);
        const contacts = await ContactModel.find({ postedBy: req.user._id });
        return res.status(200).json({ success: true, contacts });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { AddContact, getContacts, getContact, updateContact, deleteContact };
