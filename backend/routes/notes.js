const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Notes");
const { validate } = require("../models/User");

// ROUTE1:Get all the notes using : GET "api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE2:Add a new Note using: POST "api/notes/addnote" . Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there is errors,return bad request and array
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // creating a note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      // saving a note
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE3: Update an existing note using :PUT "api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  //put is used to update . you can use post also

  const { title, description, tag } = req.body;
  try {
    // Create a new Note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the node to be updated and then update it
    let note = await Note.findById(req.params.id); //this params.id is of '/:id' which we want to update
    if (!note) {
      res.status(404).send("Not Found");
    }

    // To check that user which is going to update the note of 'id' given in put request is owner of this note or not, means if the notes which user want  to update is his note or not.
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true } //new true here is to create the new contact or object comes, then it will also be created
    ); //updating the note
    res.json({ note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// ROUTE4: Deleting an existing note using :DELETE "api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //delete is used to delete . you can use post also.But the benefit to use put and delete is: we can make more and more req on same endpoints
  try {
    // Find the node to be deleted and then delete it
    let note = await Note.findById(req.params.id); //this params.id is of '/:id' which we want to update
    if (!note) {
      res.status(404).send("Not Found");
    }

    // To check that user which is going to delete the note of 'id' given in put request is owner of this note or not, means if the notes which user want  to delete is his note or not.
    // Allow deletion only if user owns this Note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id); //deleting the note
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
