<template>
  <div class='desktop-warning-container'>
    <span class='desktop-warning-icon'><q-icon color="grey-9" name='fas fa-mobile-alt'></q-icon></span>
    <span class='desktop-warning-text'>Die App ist für mobile Geräte optimiert!</span>
    <p>In der mobilen Ansicht kannst du die Web-App aber trotzdem nutzen</p>
    <slot></slot>
    <p style='margin-top: 1rem; font-size: 0.75rem'>Wenn du hierhin weitergeleitet wurdest, um deine Mailadresse zu bestätigen, öffne einfach die mobile Ansicht</p>
  </div> 
</template>

<script>

export default {
  name: 'DesktopWarning',
}
</script>


<style lang="scss" scoped>

.desktop-warning-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}

.desktop-warning-icon {
  margin-top: 25vh;
  font-size: 6rem;
}

.desktop-warning-text {
  padding-top: -1rem;
  font-size: 1rem;
}

</style>
