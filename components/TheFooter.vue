<template>
  <footer class="footer bg-neutral text-neutral-content mt-auto items-center py-4">
    <div class="container flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
      <div class="flex flex-col items-center gap-4 text-center sm:flex-row">
        <span class="text-md font-medium">EuroPrice</span>
        <span>Copyright © 2023 - All right reserved</span>
      </div>
      <div class="flex gap-4">
        <TheLink
          to="https://www.instagram.com/euro_price/?igshid=YmMyMTA2M2Y%3D"
          class="hover:text-primary-light transition"
        >
          <InstagramIcon class="text-lg" />
        </TheLink>
        <TheLink
          to="https://invite.viber.com/?g2=AQBMiX9uuUuuSksmmxuoKirb73jl%2F5VEEjqvy4D1U8mN7XBIpOtN0oyPFJXS8nBx"
          class="hover:text-primary-light transition"
        >
          <ViberIcon class="text-lg" />
        </TheLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import InstagramIcon from '~icons/mdi/instagram'
import ViberIcon from '~icons/mdi/whatsapp'
</script>
