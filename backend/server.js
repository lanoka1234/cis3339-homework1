
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const Student = require('./models/Student');
const Course = require('./models/Course');

const app = express();

app.use(cors());
app.use(express.json());

// ------------------------------
// STUDENT ROUTES
// ------------------------------

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find().lean();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to load students'
        });
    }
});

// Find a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Student name is required'
            });
        }

        const student = await Student.findOne({ name }).lean();

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to find student'
        });
    }
});

// Add a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;

        if (!name || !id || !phone || !zip) {
            return res.status(400).json({
                error: 'All student fields are required'
            });
        }

        const student = await Student.create({
            name,
            id,
            phone,
            zip,
            courses: []
        });

        res.status(201).json({
            message: 'Student added successfully',
            student
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Student ID already exists'
            });
        }

        console.error(error);
        res.status(500).json({
            error: 'Unable to add student'
        });
    }
});

// Delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Student name is required'
            });
        }

        const student = await Student.findOneAndDelete({ name });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        res.json({
            message: 'Student deleted successfully',
            student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to delete student'
        });
    }
});

// ------------------------------
// COURSE ROUTES
// ------------------------------

// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().lean();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to load courses'
        });
    }
});

// Add a course
app.post('/courses', async (req, res) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({
                error: 'Course ID and name are required'
            });
        }

        const course = await Course.create({ id, name });

        res.status(201).json(course);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Course ID already exists'
            });
        }

        console.error(error);
        res.status(500).json({
            error: 'Unable to add course'
        });
    }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({
            id: req.params.id
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        // Remove the deleted course from student enrollments
        await Student.updateMany(
            { courses: req.params.id },
            { $pull: { courses: req.params.id } }
        );

        res.json({
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to delete course'
        });
    }
});

// ------------------------------
// ENROLLMENT ROUTES
// ------------------------------

// Enroll a student in a course
app.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({
                error: 'Student ID and Course ID are required'
            });
        }

        const student = await Student.findOne({ id: studentId });
        const course = await Course.findOne({ id: courseId });

        if (!student) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        const result = await Student.updateOne(
            {
                id: studentId,
                courses: { $ne: courseId }
            },
            {
                $addToSet: { courses: courseId }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(409).json({
                error: 'Student is already enrolled in this course'
            });
        }

        res.json({
            message: 'Student enrolled successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to enroll student'
        });
    }
});

// Get students enrolled in a specific course
app.get('/courses/:id/students', async (req, res) => {
    try {
        const course = await Course.findOne({
            id: req.params.id
        });

        if (!course) {
            return res.status(404).json({
                error: 'Course not found'
            });
        }

        const students = await Student.find({
            courses: req.params.id
        }).lean();

        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Unable to load enrolled students'
        });
    }
});

// ------------------------------
// SERVE VUE PRODUCTION BUILD
// ------------------------------

const frontendPath = path.join(__dirname, '../vue-app/dist');

// Serve the compiled Vue files
app.use(express.static(frontendPath));

// Support refreshing Vue Router pages
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ------------------------------
// START SERVER
// ------------------------------

const PORT = 3000;

async function startServer() {
    await connectDB();

    await Promise.all([
        Student.init(),
        Course.init()
    ]);

    app.listen(PORT, () => {
        console.log(
            `Server is running on http://localhost:${PORT}`
        );
    });
}

startServer().catch(error => {
    console.error('Server startup failed:', error);
    process.exit(1);
});
