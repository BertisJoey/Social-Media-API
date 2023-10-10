const { ObjectId } = require('mongoose').Types;
const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.params.userId})
            .select('-_v');

        if (!userData) {
            return res.status(404).json({ message: 'No user with that id' })
        }

        res.json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        res.json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const userData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!userData) {
            return res.status(404).json({ message: 'No user with that id!' });
        }
        res.json(userData);           
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const userData = await User.findOneAndDelete({ _id: req.params.userId });
        if (!userData) {
            return res.status(404).json({ message: 'That user does not exist!' })
        }
        res.json({ message: 'User successfully deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const friendData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        );
        if (!friendData) {
            return res.status(404).json({ message: 'That user does not exist!' })
        }
        res.json(friendData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const friendData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true }
        );
        if (!friendData) {
            return res.status(404).json({ message: 'That user does not exist!' })
        }
        res.json({ message: 'Friend successfully removed!' })
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;