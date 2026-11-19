
import { ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchStudents() {
    loading.value = true
    error.value = ''

    try {
      const response = await fetch(`${API_URL}/students`)

      if (!response.ok) {
        throw new Error('Unable to load students')
      }

      students.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    loading,
    error,
    fetchStudents,
  }
})
