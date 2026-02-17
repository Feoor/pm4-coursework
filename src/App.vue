<script setup>

</script>

<template>
  <router-view />
</template>

<style lang="scss">
body.auth-bg {
  background-image: url("@/assets/img/auth_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
}

main {
  padding-top: var(--header-height); // Отступ для шапки
}
</style>
