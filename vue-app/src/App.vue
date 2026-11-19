
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <h1>Student Management System</h1>

      <nav>
        <RouterLink to="/">Students</RouterLink>
        <RouterLink to="/courses">Courses</RouterLink>
        <RouterLink to="/enrollment">Enrollment</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

header {
  background-color: #243b53;
  color: white;
  padding: 24px;
  text-align: center;
}

h1 {
  margin: 0 0 20px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 25px;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
}

nav a:hover,
nav a.router-link-active {
  background-color: #486581;
}

main {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
}
</style>
