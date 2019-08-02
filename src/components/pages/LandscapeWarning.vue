<template>
  <div class='rotation-container'>
    <span class='rotation-icon'><q-icon color="primary" name="fas fa-sync-alt"></q-icon></span>
    <span class='rotation-text'>Querformat gibt's für diesen Bereich nicht...</span>
    <p>Drehe dein Gerät um weiter zu machen :)</p>
  </div> 
</template>

<script>

export default {
  name: 'LandscapeWarning',
}
</script>


<style lang="scss" scoped>

.rotation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.rotation-icon {
  margin-top: 20vh;
  font-size: 5.5rem;
  transform: rotate(30deg)
}

.rotation-text {
  font-size: 1rem;
}

</style>
