<template>
  <div :class="['container_app', { dark__mode: darkMode }]">
    <header class="main_header">
      <HeaderIntruction @darkMode="handleDarkMode" />
    </header>
    <main class="main_main">
      <router-view />
    </main>
    <footer class="main_footer">
      <FooterComponent />
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import HeaderIntruction from '@/components/layout/header/HeaderIntroduct.vue'
import FooterComponent from '@/components/layout/footer/FooterComponent.vue'

export default defineComponent({
  name: "MainApp",
  data() {
    return {
      darkMode: false
    }
  },
  components: {
    HeaderIntruction,
    FooterComponent
  },
  mounted() {
    localStorage.setItem('defaultLanguage', '1')
  },
  methods: {
    handleDarkMode(darkMode: any) {
      this.darkMode = darkMode;
    }
  },
  setup() {
    const debounce = (callback: (...args: any[]) => void, delay: number) => {
      let tid: any;
      return function (...args: any[]) {
        const ctx = self;
        tid && clearTimeout(tid);
        tid = setTimeout(() => {
          callback.apply(ctx, args);
        }, delay);
      };
    }

    const _ = (window as any).ResizeObserver;
    (window as any).ResizeObserver = class ResizeObserver extends _ {
      constructor(callback: (...args: any[]) => void) {
        callback = debounce(callback, 20);
        super(callback);
      }
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}

:root {
  --color-main: #42b983;
  --color-background-header-intruction: #d485a6;
  --color-background-header-main: #ffffff;
  --color-background-header-category: #846a88;
  --color-background-home-main: #f6f6f6;
  --color-text: white;
  --fontsize-small: 13px;
  --fontsize-normal: 16px;
  --color-background-darkmode: #191e22;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

.dark__mode {
  background-color: #191e22;
  animation-name: gradually;
  animation-duration: 0.3s;
}

.main_header {
  height: 170px;
}

.main_main{
  height: 1200px;
}

.main_footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 10%
  
}

.dark__mode footer {
  color: var(--color-text);
}

@keyframes gradually {
  0% {
    opacity: 0;
  }

  15% {
    opacity: 0.15;
  }

  30% {
    opacity: 0.3;
  }

  45% {
    opacity: 0.45;
  }

  60% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.75;
  }

  90% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }
}</style>
