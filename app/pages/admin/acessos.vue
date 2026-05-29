<template>
  <main>
    <div class="pre-dashboard">
      <h1>Dashboard de Acessos</h1>
      <p>Visualize os acessos e atividades recentes dos usuários.</p>
      <article>
        <h1>Olá, User!!!!</h1>
        <p>Acompanhe o desempenho da sua equipe e dos projetos</p>
      </article>
      <button @click="dropdownSchedule">{{ date }}</button> /* Botão para
      descer o dropdown do calendário na pós navbar. */
      <button @click="exportFeedbacks">Exportar relatório</button> /* Botão
      para exportar os relatórios. */
    </div>
    <section class="dashboard">
      <div class="dasbord-ranking-notifications">
        <h2>Ranking de Acessos</h2>
        <p>Ver mais</p>
        <h2>Notificações</h2>
        <p>Ver mais</p>
      </div>
    </section>
    <footer>
      <p>dados mais detalhados de cada trabalho</p> /* Aqui vai ser só um teste pra subir no repositório */
    </footer>
  </main>
</template>
