<template>
  <div class="icons-page">
    <h2>Alle SVG-Icons</h2>
    <div class="icons-svg-wrapper">
      <object
        type="image/svg+xml"
        data="/src/assets/icons.svg"
        class="icons-svg"
      ></object>
    </div>
  </div>
</template>
<script setup>
// keine Logik nötig
</script>
<style scoped>
.icons-page {
  max-width: 700px;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 4px 24px #2563eb11;
  padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  text-align: center;
}
.icons-page h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2563eb;
}
.icons-svg-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
}
.icons-svg {
  width: 90%;
  max-width: 480px;
  min-height: 220px;
  border: none;
  background: none;
}
</style>
