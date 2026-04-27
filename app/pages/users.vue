<template>
  <div>
    <h1>Users</h1>
    <ul v-if="users?.length">
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
    <p v-else>No users yet.</p>
  </div>
</template>

<script setup>
const { data: users } = await useFetch("/api/users");
</script>
