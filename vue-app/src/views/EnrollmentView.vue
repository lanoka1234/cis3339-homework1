
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentsStore } from '../stores/students'

const API_URL = 'http://localhost:3000'

const studentsStore = useStudentsStore()
const { students } = storeToRefs(studentsStore)
const courses = ref([])
const selectedStudent = ref('')
const selectedCourse = ref('')
const viewCourse = ref('')
const enrolledStudents = ref([])
const message = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function loadData() {
    try {
        await studentsStore.fetchStudents()

        const coursesResponse = await fetch(`${API_URL}/courses`)

        if (studentsStore.error || !coursesResponse.ok) {
            throw new Error('Unable to load students or courses')
        }

        courses.value = await coursesResponse.json()
    } catch (error) {
        errorMessage.value = error.message
    }
}

async function enrollStudent() {
    message.value = ''
    errorMessage.value = ''
    loading.value = true

    try {
        const response = await fetch(`${API_URL}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: selectedStudent.value,
                courseId: selectedCourse.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Enrollment failed')
        }

        message.value = data.message
        await loadData()

        if (viewCourse.value === selectedCourse.value) {
            await loadEnrolledStudents()
        }
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}

async function loadEnrolledStudents() {
    errorMessage.value = ''
    enrolledStudents.value = []

    if (!viewCourse.value) return

    try {
        const response = await fetch(
            `${API_URL}/courses/${encodeURIComponent(viewCourse.value)}/students`
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Unable to load enrolled students')
        }

        enrolledStudents.value = data
    } catch (error) {
        errorMessage.value = error.message
    }
}

onMounted(loadData)
</script>

<template>
    <div class="enrollment-page">
        <h2>Student Enrollment</h2>
        <p>Enroll students in courses and view course enrollment.</p>

        <section>
            <h3>Enroll a Student</h3>

            <form @submit.prevent="enrollStudent">
                <label for="student">Select Student</label>
                <select
                    id="student"
                    v-model="selectedStudent"
                    required
                >
                    <option value="" disabled>
                        Choose a student
                    </option>
                    <option
                        v-for="student in students"
                        :key="student.id"
                        :value="student.id"
                    >
                        {{ student.name }} ({{ student.id }})
                    </option>
                </select>

                <label for="course">Select Course</label>
                <select
                    id="course"
                    v-model="selectedCourse"
                    required
                >
                    <option value="" disabled>
                        Choose a course
                    </option>
                    <option
                        v-for="course in courses"
                        :key="course.id"
                        :value="course.id"
                    >
                        {{ course.name }} ({{ course.id }})
                    </option>
                </select>

                <button type="submit" :disabled="loading">
                    {{ loading ? 'Enrolling...' : 'Enroll Student' }}
                </button>
            </form>
        </section>

        <section>
            <h3>View Enrolled Students</h3>

            <label for="view-course">Select Course</label>
            <select
                id="view-course"
                v-model="viewCourse"
                @change="loadEnrolledStudents"
            >
                <option value="">
                    Choose a course
                </option>
                <option
                    v-for="course in courses"
                    :key="course.id"
                    :value="course.id"
                >
                    {{ course.name }} ({{ course.id }})
                </option>
            </select>

            <div v-if="viewCourse">
                <p v-if="enrolledStudents.length === 0">
                    No students enrolled in this course.
                </p>

                <table v-else>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>ZIP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="student in enrolledStudents"
                            :key="student.id"
                        >
                            <td>{{ student.id }}</td>
                            <td>{{ student.name }}</td>
                            <td>{{ student.phone }}</td>
                            <td>{{ student.zip }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <p v-if="message" class="success">
            {{ message }}
        </p>

        <p v-if="errorMessage" class="error">
            {{ errorMessage }}
        </p>
    </div>
</template>

<style scoped>
.enrollment-page {
    max-width: 850px;
    margin: auto;
}

h2 {
    color: #243b53;
}

section {
    background: #f5f7fa;
    padding: 25px;
    margin-top: 25px;
    border-radius: 8px;
}

label {
    display: block;
    margin-top: 15px;
    margin-bottom: 8px;
    font-weight: bold;
}

select {
    display: block;
    width: 100%;
    padding: 12px;
    margin-bottom: 18px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: white;
}

button {
    background: #243b53;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 5px;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.success {
    color: green;
    font-weight: bold;
    margin-top: 20px;
}

.error {
    color: #c0392b;
    font-weight: bold;
    margin-top: 20px;
}
</style>
