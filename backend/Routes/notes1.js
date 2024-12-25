const express = require('express')
const router = express.Router();
var fetchuser = require('../Middleware/fetchuser')
const Notes = require('../Models/Notes');
const { body, validationResult } = require('express-validator');

// Route 1 Get All the Notes using : POST "/api/auth/getuser" .login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server Error")
    }

})

// Route 2 Add a new  Notes using : POST "/api/auth/addnote" .login required


router.post('/addnote', fetchuser,

    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),

        body('description', 'Description must be atleast  5 characters or string password').isLength({ min: 5 }),],

    async (req, res) => {
        try {


            const { title, description, tag } = req.body;
            const errors = validationResult(req);  // Get validation errors

            // If validation fails, send errors and stop further execution
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });  // Return errors and exit the function
            }

            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()


            res.json(savedNote)
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error")
        }


    })

// Route 3 Add a new  Notes using : POST "/api/auth/updatenote" .login required


router.put('/updatenote/:id', fetchuser,
    async (req, res) => {
        try {


            const { title, description, tag } = req.body;
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            // find the note to b updated and update it
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send("Not Found")
            }
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note });

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error")
        }
    })
// Route 4. Delete  a new  Notes using : POST "/api/auth/deletenote" .login required


router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {
      
        try {

            // find the note to be deleted  it
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send("Not Found")
            }
            // Allow deletion only ifuser owns this Note

            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Note has been deleted" });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server Error")
        }
    })

module.exports = router;