<template>
  <div class='desktop-warning-container'>
    <span class='desktop-warning-icon'><i class='sl-icon icon-screen-smartphone'></i></span>
    <span class='desktop-warning-text'>App ist für mobile Geräte optimiert!</span>
    <BaseParagraph>In der mobilen Ansicht kannst du die Web-App aber trotzdem nutzen</BaseParagraph>
    <slot></slot>
    <BaseParagraph style='margin-top: 1rem; font-size: 0.75rem'>Wenn du hier bist, um deine Mailadresse zu bestätigen öffne einfach die mobile Ansicht</BaseParagraph>
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
