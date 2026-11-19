
<script setup>
import { ref } from 'vue'
import { useStudentsStore } from '../stores/students'

const name = ref('')
const studentId = ref('')
const phone = ref('')
const zip = ref('')
const searchName = ref('')
const deleteName = ref('')
const message = ref('')
const student = ref(null)
const loading = ref(false)

const API_URL = 'http://localhost:3000'
const studentsStore = useStudentsStore()

async function addStudent() {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`${API_URL}/add-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        id: studentId.value,
        phone: phone.value,
        zip: zip.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to add student')
    }

    message.value = data.message
    await studentsStore.fetchStudents()
    name.value = ''
    studentId.value = ''
    phone.value = ''
    zip.value = ''
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}

async function findStudent() {
  loading.value = true
  message.value = ''
  student.value = null

  try {
    const response = await fetch(`${API_URL}/find-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: searchName.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Student not found')
    }

    student.value = data
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}

async function deleteStudent() {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`${API_URL}/delete-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: deleteName.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Unable to delete student')
    }

    message.value = data.message
    deleteName.value = ''
    student.value = null
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="students-page">
    <h2>Student Management</h2>
    <p>Add, search, and delete student records.</p>

    <section>
      <h3>Add Student</h3>

      <form @submit.prevent="addStudent">
        <input v-model="name" placeholder="Student Name" required />
        <input v-model="studentId" placeholder="Student ID" required />
        <input v-model="phone" placeholder="Phone Number" required />
        <input v-model="zip" placeholder="ZIP Code" required />

        <button type="submit" :disabled="loading">
          Add Student
        </button>
      </form>
    </section>

    <section>
      <h3>Find Student</h3>

      <form @submit.prevent="findStudent">
        <input v-model="searchName" placeholder="Enter student name" required />
        <button type="submit" :disabled="loading">
          Find Student
        </button>
      </form>

      <div v-if="student" class="student-result">
        <h4>Student Details</h4>
        <p>Name: {{ student.name }}</p>
        <p>ID: {{ student.id }}</p>
        <p>Phone: {{ student.phone }}</p>
        <p>ZIP: {{ student.zip }}</p>
      </div>
    </section>

    <section>
      <h3>Delete Student</h3>

      <form @submit.prevent="deleteStudent">
        <input v-model="deleteName" placeholder="Enter student name to delete" required />
        <button type="submit" class="delete-btn" :disabled="loading">
          Delete Student
        </button>
      </form>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.students-page {
  max-width: 700px;
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

h3 {
  margin-top: 0;
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

button:hover {
  background: #486581;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background: #c0392b;
}

.student-result {
  background: white;
  padding: 15px;
  margin-top: 15px;
  border-radius: 5px;
}

.message {
  margin-top: 20px;
  font-weight: bold;
}
</style>
