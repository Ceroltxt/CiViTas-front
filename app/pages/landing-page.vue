<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const activeTab = ref('Projetos')
const tabs = ['Projetos', 'Eventos', 'Cursos', 'Campanhas']

const features = [
  { icon: 'i-lucide-circle-dollar-sign', color: 'text-purple-500', bg: 'bg-purple-100', label: 'Use tudo sem pagar nada' },
  { icon: 'i-lucide-layout-dashboard',   color: 'text-orange-500', bg: 'bg-orange-100', label: 'Estruture seus projetos com facilidade' },
  { icon: 'i-lucide-zap',               color: 'text-amber-500',  bg: 'bg-amber-100',  label: 'Experiência pensada para alto desempenho' },
  { icon: 'i-lucide-check-square',       color: 'text-green-500',  bg: 'bg-green-100',  label: 'Controle total das suas tarefas' },
]

const perks = [
  'Acesso completo',
  'Clareza em cada etapa',
  'Ideal para equipes e projetos',
  'Sem nenhum custo',
]

const gamification = [
  { icon: 'i-lucide-star',        color: 'text-amber-500',  bg: 'bg-amber-50',  title: 'Estrelas',  desc: 'Motivação constante para a equipe, incentivando o engajamento e melhores resultados.' },
  { icon: 'i-lucide-target',      color: 'text-purple-500', bg: 'bg-purple-50', title: 'Metas',     desc: 'Objetivos definidos que ajudam a equipe a alcançar resultados.' },
  { icon: 'i-lucide-trophy',      color: 'text-orange-500', bg: 'bg-orange-50', title: 'Rankings',  desc: 'Classificações que incentivam a competitividade saudável e a evolução da equipe.' },
  { icon: 'i-lucide-gift',        color: 'text-red-500',    bg: 'bg-red-50',    title: 'Recompensas', desc: 'Incentivo para valorizar conquistas individuais e coletivas.' },
]

const footerLinks = {
  Shop:    ['Sell online', 'Features', 'Exemplos', 'Website editors', 'Online retail'],
  Press:   ['Events', 'News', 'Awards', 'Testimonials', 'Online retail'],
  About:   ['Contact', 'Services', 'Team', 'Career', 'Contacts'],
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 overflow-x-hidden">

    <!-- navbar -->
    <nav class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-100 dark:border-slate-800 px-6 py-3">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <img src="/civitas-logo-transparent.png" alt="Civitas" class="h-8" />
        </div>
        <!-- actions (alternar modo, login e cadastro) -->
        <div class="flex items-center gap-3">
          <UButton
            variant="ghost"
            color="neutral"
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            square
            size="sm"
            @click="toggleTheme()"
        />
          <UButton variant="outline" color="neutral" size="sm" @click="navigateTo('/login')">Login</UButton>
          <UButton color="neutral" size="sm" @click="navigateTo('/cadastro')">Cadastrar</UButton>
        </div>
      </div>
    </nav>

    <!-- mensagem no topo -->
    <div class="bg-gradient-to-r from-purple-600 via-red-400 to-amber-400 text-white px-6 py-3 opacity-75">
      <div class="max-w-6xl mx-auto">
        <p class="font-bold text-sm">Uma solução mais que simples</p>
        <p class="text-xs opacity-90">Organize seu trabalho e seja mais eficiente com caixa de entrada, quadros e planejador.</p>
      </div>
    </div>

    <!-- hero-section -->
    <section class="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4 max-w-2xl mx-auto dark:text-slate-100">
        Planeje com facilidade e execute com rapidez
        </h1>
      <p class="text-slate-500 max-w-xl mx-auto mb-10 text-base leading-relaxed dark:text-slate-400">
        Gerencie seu projeto com mais organização e foco, utilizando uma plataforma intuitiva e completa. Planeje, execute e acompanhe cada etapa com facilidade e produtividade.
      </p>

      <!-- tabs -->
      <div class="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab"
          class="px-5 py-2 rounded-l-full text-sm font-semibold transition-all"
          :class="activeTab === tab
            ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <!-- dashboard image -->
      <div class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl mx-auto max-w-5xl mt-8">
        <img
          src="/inicio-adm.png"
          alt="Dashboard Civitas"
          class="w-full h-auto object-cover"
        />
      </div>
    </section>

    <!-- 100% gratuito -->
    <section class="py-20 bg-slate-50  dark:bg-slate-800 mt-8">
      <div class="max-w-2xl mx-auto text-center px-6">
        <h2 class="text-4xl font-extrabold text-slate-800 mb-3 dark:text-slate-100">100% Gratuito</h2>
        <p class="text-slate-500 leading-relaxed dark:text-slate-400">
          Uma plataforma completa, aberta e 100% gratuita. Use a vontade, sem se preocupar com cobranças ou restrições.
        </p>
      </div>
    </section>

    <!-- "simples, completo e gratuito" -->
    <section class="px-6 py-20 mt-10">
      <div class="grid md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">

        <!-- Esquerda: texto + lista -->
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
            Simples, completo<br />e gratuito
          </h2>
          <p class="text-slate-500 mb-6 leading-relaxed dark:text-slate-400">
            Aproveite uma plataforma totalmente aberta, com todos os recursos disponíveis para você usar quando quiser, sem qualquer custo.
          </p>
          <ul class="space-y-3">
            <li v-for="perk in perks" :key="perk" class="flex items-center gap-2 text-slate-700 font-medium dark:text-slate-300">
              <UIcon name="i-lucide-check" class="text-purple-500 text-lg flex-shrink-0" />
              {{ perk }}
            </li>
          </ul>
        </div>

        <!-- Direita: cards de features -->
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="feat in features"
            :key="feat.label"
            class="flex items-center gap-4 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-4 bg-white dark:bg-slate-800 hover:shadow-md transition"
          >
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="feat.bg">
              <UIcon :name="feat.icon" class="text-xl" :class="feat.color" />
            </div>
            <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ feat.label }}</span>
          </div>
        </div>

      </div>
    </section>

    <!-- dashboards interativos -->
    <section class="max-w-3xl mx-auto px-6 py-20 mt-10">
      <div class="grid md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">

        <!-- Esquerda: screenshot dashboard -->
        <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
          <img
            src="/inicio-adm.png"
            alt="Dashboard interativo"
            class="w-full h-auto object-cover"
          />
        </div>

        <!-- Direita: texto -->
        <div>
          <h2 class="text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
            Dashboards<br />Interativos
          </h2>
          <p class="text-slate-500 mb-8 leading-relaxed">
            Acompanhe seus dados com dashboards modernos e interativos, facilitando a análise e tornando a visualização mais clara e intuitiva.
          </p>
          <div class="space-y-3">
            <div class="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <UIcon name="i-lucide-zap" class="text-amber-500 text-lg" />
              <span class="text-sm font-semibold text-amber-700">O melhor desempenho</span>
            </div>
            <div class="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
              <UIcon name="i-lucide-layout-dashboard" class="text-purple-500 text-lg" />
              <span class="text-sm font-semibold text-purple-700">Organização de ponta</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- gameficação -->
    <section class="max-w-6xl mx-auto px-6 py-20 mt-10">
      <div class="grid md:grid-cols-2 gap-16 items-start">

        <!-- Esquerda: título + CTAs -->
        <div>
          <h2 class="text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
            Sistema de<br />Gamificação
          </h2>
          <p class="text-slate-500 mb-8 leading-relaxed">
            Crie um ambiente mais motivador com gamificação, incentivando a equipe a manter o foco e evoluir constantemente, acesse já
          </p>
          <div class="flex gap-3 flex-wrap">
            <button
              class="bg-gradient-to-r from-purple-500 to-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition flex items-center gap-2 mt-4"
              @click="navigateTo('/login')"
            >
              Acesso Login <UIcon name="i-lucide-arrow-right" />
            </button>
            <button
              class="border border-slate-300 text-slate-700 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-slate-50 transition mt-4"
              @click="navigateTo('/cadastro')"
            >
              Cadastrar-se
            </button>
          </div>
        </div>

        <!-- Direita: cards de gamificação -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="g in gamification"
            :key="g.title"
            class="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition"
            :class="g.bg"
          >
            <div class="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center mb-3 shadow-sm">
              <UIcon :name="g.icon" class="text-xl" :class="g.color" />
            </div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1 text-sm">{{ g.title }}</h3>
            <p class="text-xs text-slate-500 leading-relaxed dark:text-slate-400">{{ g.desc }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════════════════
         FOOTER
    ══════════════════════════════════════════ -->
    <footer class="bg-slate-900 text-slate-400 pt-14 pb-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">

          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <img src="/civitas-logo-transparent.png" alt="Civitas" class="h-8 mb-4 brightness-0 invert" />
            <p class="text-xs leading-relaxed text-slate-500">
              Organize projetos com clareza e alcance melhores resultados em uma plataforma simples e gratuita.
            </p>
          </div>

          <!-- Links -->
          <div v-for="(links, section) in footerLinks" :key="section">
            <h4 class="text-white font-semibold text-sm mb-3">{{ section }}</h4>
            <ul class="space-y-2">
              <li v-for="link in links" :key="link">
                <a href="#" class="text-xs hover:text-white transition">{{ link }}</a>
              </li>
            </ul>
          </div>

        </div>

        <hr class="border-slate-700 mb-6" />

        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div class="flex gap-4 flex-wrap justify-center">
            <a href="#" class="hover:text-white">Privacy Policy</a>
            <a href="#" class="hover:text-white">Terms & Conditions</a>
            <a href="#" class="hover:text-white">Code of Contact</a>
          </div>
          <div class="flex gap-3">
            <UIcon name="i-lucide-facebook" class="hover:text-white cursor-pointer" />
            <UIcon name="i-lucide-instagram" class="hover:text-white cursor-pointer" />
            <UIcon name="i-lucide-twitter" class="hover:text-white cursor-pointer" />
            <UIcon name="i-lucide-youtube" class="hover:text-white cursor-pointer" />
          </div>
        </div>

        <p class="text-center text-xs text-slate-600 mt-4">
          Ana Carolyne Ramos, Beatriz Ribeiro Milani, Cecília Costa Neves, Dimitri Brito Monteiro e Daniel Macena. Todos os direitos reservados.
        </p>
      </div>
    </footer>

  </div>
</template>