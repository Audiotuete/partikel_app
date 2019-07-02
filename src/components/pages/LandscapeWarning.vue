<template>
  <div class='rotation-container'>
    <span class='rotation-icon'><i class='sl-icon icon-refresh'></i></span>
    <span class='rotation-text'>Querformat gibt's nicht...</span>
    <p>Drehe dein Gerät um weiter zu machen.</p>
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
  margin-top: 17.5vh;
  font-size: 6rem;
  transform: rotate(100deg)
}

.rotation-text {
  font-size: 1rem;
}

</style>
