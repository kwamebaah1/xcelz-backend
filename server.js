const express = require('express');
const cors = require('cors');
const { meetings, users } = require('./data');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// POST /meetings: Schedule a new meeting
app.post('/meetings', (req, res) => {
    const { title, date, time, duration, participants } = req.body;

    // Validate incoming data
    if (!title || !date || !time || !duration || !participants) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if this slot is already taken
    const isConflict = meetings.some(meeting => {
        return meeting.date === date && meeting.time === time;
    });

    if (isConflict) {
        return res.status(400).json({ error: 'This time slot is already taken. Please choose another one.' });
    }

    const newMeeting = {
        id: meetings.length + 1, // Simple ID generation for now
        title,
        date,
        time,
        duration,
        participants,
    };

    meetings.push(newMeeting); // Save the meeting to the in-memory "database"

    // Simulate a notification (logging it to the console)
    console.log(`Meeting scheduled: ${title} at ${date} ${time}`);

    res.status(201).json(newMeeting); // Respond with the created meeting
});

// GET /meetings: Fetch all scheduled meetings
app.get('/meetings', (req, res) => {
    res.json(meetings); // Return all scheduled meetings
});

// PUT /meetings/:meetingId: Update (reschedule) a meeting
app.put('/meetings/:meetingId', (req, res) => {
    const meetingId = parseInt(req.params.meetingId);
    const { title, date, time, duration, participants } = req.body;

    const meetingIndex = meetings.findIndex((meeting) => meeting.id === meetingId);
    if (meetingIndex === -1) {
        return res.status(404).json({ error: 'Meeting not found' });
    }

    const updatedMeeting = {
        ...meetings[meetingIndex],
        title,
        date,
        time,
        duration,
        participants,
    };

    meetings[meetingIndex] = updatedMeeting; // Update the meeting

    // Simulate a notification (logging it to the console)
    console.log(`Meeting updated: ${title} at ${date} ${time}`);

    res.json(updatedMeeting); // Respond with the updated meeting
});

// DELETE /meetings/:meetingId: Cancel a meeting
app.delete('/meetings/:meetingId', (req, res) => {
    const meetingId = parseInt(req.params.meetingId);

    const meetingIndex = meetings.findIndex((meeting) => meeting.id === meetingId);
    if (meetingIndex === -1) {
        return res.status(404).json({ error: 'Meeting not found' });
    }

    meetings.splice(meetingIndex, 1); // Remove the meeting from the array

    // Simulate a notification (logging it to the console)
    console.log(`Meeting canceled`);

    res.status(204).send(); // Respond with no content (meeting deleted)
});

// GET /users/:userId/available-slots: Fetch available time slots for a user
app.get('/users/:userId/available-slots', (req, res) => {
    const userId = req.params.userId;

    // Mock data for availability (this can be expanded later)
    const availableSlots = users[userId] ? users[userId].availableSlots : [];

    res.json({ availableSlots });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
