const { ObjectId } = require('mongoose').Types;
const router = require('express').Router();
const { Thought, Reaction, User } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-_v');

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that id!' })
        }
        res.json(thought);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id }},
            { new: true, runValidate: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User does not exist!' })
        }
        res.json('Created the thought!')
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.post('/:userId', async (req, res) => {
//     try {
//         const thoughtData = await User.findOneAndUpdate(
//             { $push: { thoughts: req.body }},
//             { new: true, runValidate: true }
//         );
//         res.json(thoughtData);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

router.put('/:thoughtId', async (req, res) => {
    try {
        const thoughtData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
        if (!thoughtData) {
            return res.status(400).json({ message: 'No thought with that id!' });
        }
        res.json(thoughtData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:thoughtId', async (req, res) => {
    try {
        const thoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thoughtData) {
            return res.status(400).json({ message: 'That thought does not exist!' })
        }
        res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const reactionData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { new: true, runValidators: true }
        )
        if (!reactionData) {
            return res.status(400).json({ message: 'That thought does not exist!' })
        };
        res.json(reactionData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const reactionData = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.params.reactionId }},
            { new: true, runValidators: true }
        )
        if (!reactionData) {
            return res.status(400).json({ message: 'That thought does not exist!' })
        };
        res.json({ message: 'Reaction successfully deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;