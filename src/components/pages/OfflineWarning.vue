<template>
  <div class="offline-container">
    <!-- meteor, sad-cry -->
    <span class="offline-icon">
      <q-icon color="primary" name="fas fa-sad-cry"></q-icon>
    </span>
    <span class="offline-text offline-text__header">Kein Netz!</span>
    <span class="offline-text">Verbinde dich mit dem Internet, um weiter zu machen.</span>
    <q-btn @click="reload()" class="offline-retry-button">Erneut versuchen</q-btn>
  </div>
</template>

<script>
export default {
  name: "OfflineWarning",
  methods: {
    reload() {
      location.reload();
    }
  }
};
</script>


<style lang="scss" scoped>
.offline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.offline-icon {
  font-size: 5.5rem;
  line-height: 0;
  // transform: rotate(30deg)
}

.offline-text {
  text-align: center;
  font-size: 1rem;
  margin: 0 1rem 0.5rem 1rem;

  &__header {
    font-size: 2rem;
  }
}
</style>
