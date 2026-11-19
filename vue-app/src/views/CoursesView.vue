
<script setup>
import { ref, onMounted } from 'vue'

const courseId = ref('')
const courseName = ref('')
const courses = ref([])
const message = ref('')
const loading = ref(false)

const API_URL = 'http://localhost:3000'

async function loadCourses() {
  try {
    const response = await fetch(`${API_URL}/courses`)
    if (!response.ok) throw new Error('Unable to load courses')
    courses.value = await response.json()
  } catch (error) {
    message.value = error.message
  }
}

async function addCourse() {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: courseId.value,
        name: courseName.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to add course')
    }

    message.value = 'Course added successfully'
    courseId.value = ''
    courseName.value = ''
    await loadCourses()
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}

async function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return

  try {
    const response = await fetch(`${API_URL}/courses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to delete course')
    }

    message.value = 'Course deleted successfully'
    await loadCourses()
  } catch (error) {
    message.value = error.message
  }
}

onMounted(loadCourses)
</script>

<template>
  <div class="courses-page">
    <h2>Course Management</h2>
    <p>Add, view, and delete courses.</p>

    <section>
      <h3>Add Course</h3>

      <form @submit.prevent="addCourse">
        <input v-model="courseId" placeholder="Course ID" required />
        <input v-model="courseName" placeholder="Course Name" required />
        <button type="submit" :disabled="loading">Add Course</button>
      </form>
    </section>

    <section>
      <h3>All Courses</h3>

      <p v-if="courses.length === 0">No courses available.</p>

      <table v-else>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.name }}</td>
            <td>
              <button class="delete-btn" @click="deleteCourse(course.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.courses-page {
  max-width: 800px;
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

input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background: #243b53;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn {
  background: #c0392b;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.message {
  margin-top: 20px;
  font-weight: bold;
}
</style>
