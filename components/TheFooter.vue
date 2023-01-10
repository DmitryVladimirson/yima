<template>
  <footer class="footer bg-neutral text-neutral-content mt-auto items-center py-4">
    <div class="container flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
      <div class="flex flex-col items-center gap-4 sm:flex-row">
        <span class="text-md font-medium">EuroPrice</span>
        <span>Copyright © 2023 - All right reserved</span>
      </div>
      <div class="flex gap-4">
        <TheLink to="/" class="hover:text-primary-light transition"> <FacebookIcon class="text-lg" /></TheLink>
        <TheLink to="/" class="hover:text-primary-light transition"> <TwitterIcon class="text-lg" /></TheLink>
        <TheLink to="/" class="hover:text-primary-light transition"> <YoutubeIcon class="text-lg" /></TheLink>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import TwitterIcon from '~icons/mdi/twitter'
import FacebookIcon from '~icons/mdi/facebook'
import YoutubeIcon from '~icons/mdi/youtube'
</script>
