<template>
  <div class="lp-phone-mockup" :class="{ 'lp-phone-mockup--lg': large, 'lp-phone-mockup--hero': hero }">
    <div class="lp-phone-mockup__frame">
      <div class="lp-phone-mockup__notch" aria-hidden="true" />
      <div class="lp-phone-mockup__screen">
        <slot>
          <img v-if="imageSrc" :src="imageSrc" :alt="alt" class="lp-phone-mockup__image" />
        </slot>
      </div>
    </div>
    <div class="lp-phone-mockup__glow" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    imageSrc?: string
    alt?: string
    large?: boolean
    hero?: boolean
  }>(),
  {
    imageSrc: undefined,
    alt: '',
    large: false,
    hero: false,
  },
)
</script>

<style scoped>
.lp-phone-mockup {
  position: relative;
  width: min(100%, 16rem);
  margin-inline: auto;
}

.lp-phone-mockup--lg {
  width: min(100%, 19rem);
}

.lp-phone-mockup--hero {
  width: min(100%, 20rem);
}

.lp-phone-mockup--hero .lp-phone-mockup__frame {
  padding: 0.65rem;
  border-radius: 2.5rem;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    0 40px 80px rgba(0, 0, 0, 0.45),
    0 0 60px rgba(var(--lp-premium-accent-rgb, 247, 168, 40), 0.25);
}

.lp-phone-mockup--hero .lp-phone-mockup__glow {
  inset: 10% -20% -20%;
  background: radial-gradient(circle, rgba(var(--lp-premium-accent-rgb, 247, 168, 40), 0.45), transparent 65%);
}

.lp-phone-mockup__frame {
  position: relative;
  z-index: 1;
  padding: 0.55rem;
  border-radius: 2.25rem;
  background: linear-gradient(145deg, #2a2035 0%, #0a0612 100%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 32px 64px rgba(0, 0, 0, 0.28);
}

.lp-phone-mockup__notch {
  position: absolute;
  top: 0.65rem;
  left: 50%;
  transform: translateX(-50%);
  width: 28%;
  height: 0.35rem;
  border-radius: 999px;
  background: #000;
  z-index: 2;
}

.lp-phone-mockup__screen {
  aspect-ratio: 9 / 19.5;
  border-radius: 1.75rem;
  overflow: hidden;
  background: var(--lp-premium-surface, #14101c);
}

.lp-phone-mockup__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lp-phone-mockup__glow {
  position: absolute;
  inset: 20% -10% -15%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--lp-premium-primary-rgb, 93, 49, 142), 0.35), transparent 68%);
  filter: blur(40px);
  z-index: 0;
  pointer-events: none;
}
</style>
