<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { ENDPOINTS } from '~/services/endpoints'

interface ImportRow {
  row: number
  nome: string | null
  valid: boolean
  errors: string[]
}

interface ImportResult {
  valid: boolean
  total_rows: number
  valid_rows: number
  invalid_rows: number
  rows: ImportRow[]
  errors: string[]
  imported_rows?: number
  message?: string
  task_ids?: number[]
}

const { downloadCsv, postFile } = useApi()

const dataInicial = ref('')
const dataFinal = ref('')
const exportando = ref<'projetos' | 'tarefas' | null>(null)
const erroExportacao = ref('')

const arquivo = ref<File | null>(null)
const importando = ref(false)
const previa = ref<ImportResult | null>(null)
const resultadoImportacao = ref('')
const erroImportacao = ref('')

const periodoValido = computed(() => {
  return (
    !!dataInicial.value &&
    !!dataFinal.value &&
    dataInicial.value <= dataFinal.value
  )
})

function nomeArquivo(tipo: string) {
  return `${tipo}-${dataInicial.value}-${dataFinal.value}.csv`
}

async function exportar(tipo: 'projetos' | 'tarefas') {
  if (!periodoValido.value) {
    erroExportacao.value =
      'Informe um período válido para realizar a exportação.'
    return
  }

  exportando.value = tipo
  erroExportacao.value = ''

  const query = {
    start_date: dataInicial.value,
    end_date: dataFinal.value,
  }

  const endpoint = tipo === 'projetos'
    ? ENDPOINTS.projectsExport
    : ENDPOINTS.tasksExport

  try {
    await downloadCsv(endpoint, query, nomeArquivo(tipo))
  } catch (error) {
    console.error('Erro ao exportar CSV:', error)
    erroExportacao.value =
      `Não foi possível exportar ${tipo}. Verifique sua conexão, permissões e workspace ativo.`
  } finally {
    exportando.value = null
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0] ?? null

  arquivo.value = selectedFile
  previa.value = null
  resultadoImportacao.value = ''
  erroImportacao.value = ''
}

function extrairResultadoErro(error: unknown): ImportResult | null {
  if (!error || typeof error !== 'object') return null

  const fetchError = error as {
    data?: ImportResult
    response?: {
      _data?: ImportResult
    }
  }

  return fetchError.data ?? fetchError.response?._data ?? null
}

async function validarArquivo() {
  if (!arquivo.value) {
    erroImportacao.value = 'Selecione um arquivo CSV primeiro.'
    return
  }

  importando.value = true
  previa.value = null
  resultadoImportacao.value = ''
  erroImportacao.value = ''

  try {
    previa.value = await postFile<ImportResult>(
      ENDPOINTS.tasksImportPreview,
      arquivo.value,
    )
  } catch (error) {
    const result = extrairResultadoErro(error)

    if (result) {
      previa.value = result
    } else {
      console.error('Erro ao validar CSV:', error)
      erroImportacao.value =
        'Não foi possível validar o arquivo. Verifique sua conexão e tente novamente.'
    }
  } finally {
    importando.value = false
  }
}

async function confirmarImportacao() {
  if (!arquivo.value || !previa.value?.valid) return

  importando.value = true
  erroImportacao.value = ''
  resultadoImportacao.value = ''

  try {
    const result = await postFile<ImportResult>(
      ENDPOINTS.tasksImportConfirm,
      arquivo.value,
    )

    resultadoImportacao.value =
      result.message ?? `${result.imported_rows ?? 0} tarefa(s) importada(s).`

    arquivo.value = null
    previa.value = null

    const input = document.getElementById(
      'csv-task-file',
    ) as HTMLInputElement | null

    if (input) input.value = ''
  } catch (error) {
    const result = extrairResultadoErro(error)

    if (result) {
      previa.value = result
    } else {
      console.error('Erro ao importar CSV:', error)
      erroImportacao.value =
        'Não foi possível concluir a importação. Verifique sua conexão e tente novamente.'
    }
  } finally {
    importando.value = false
  }
}
</script>

<template>
  <section class="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <div>
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">
        Importação e exportação CSV
      </h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Exporte projetos e tarefas ou importe tarefas por meio de arquivos CSV.
      </p>
    </div>

    <!-- Exportação -->
    <div class="space-y-4">
      <h3 class="font-semibold text-slate-700 dark:text-slate-200">
        Exportar dados
      </h3>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="csv-start-date" class="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Data inicial
          </label>
          <input
            id="csv-start-date"
            v-model="dataInicial"
            type="date"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label for="csv-end-date" class="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Data final
          </label>
          <input
            id="csv-end-date"
            v-model="dataFinal"
            type="date"
            :min="dataInicial || undefined"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400">
        O período é obrigatório para exportar projetos e tarefas.
      </p>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          :disabled="!periodoValido || exportando !== null"
          class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="exportar('projetos')"
        >
          {{ exportando === 'projetos' ? 'Exportando...' : 'Exportar projetos' }}
        </button>

        <button
          type="button"
          :disabled="!periodoValido || exportando !== null"
          class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="exportar('tarefas')"
        >
          {{ exportando === 'tarefas' ? 'Exportando...' : 'Exportar tarefas' }}
        </button>
      </div>

      <p
        v-if="erroExportacao"
        role="alert"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ erroExportacao }}
      </p>
    </div>

    <div class="border-t border-slate-100 dark:border-slate-800" />

    <!-- Importação -->
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-slate-700 dark:text-slate-200">
          Importar tarefas
        </h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Selecione um arquivo CSV para validar as tarefas antes de importá-las.
        </p>
      </div>

      <div>
        <label for="csv-task-file" class="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Arquivo CSV
        </label>

        <input
          id="csv-task-file"
          type="file"
          accept=".csv,.txt,text/csv"
          class="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-slate-200"
          @change="onFileChange"
        />

        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Formato CSV com separador ponto e vírgula. Tamanho máximo: 2 MB.
        </p>
      </div>

      <div class="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
        <p class="font-semibold">Colunas obrigatórias:</p>
        <p class="mt-1">nome; prioridade; data_prazo</p>

        <p class="mt-3 font-semibold">Colunas opcionais:</p>
        <p class="mt-1">
          descricao; ID_projeto; ID_equipe; matriculas_colaboradores; subtarefas
        </p>

        <p class="mt-3">
          Para matrículas e subtarefas, separe os valores usando
          <strong>|</strong>. Informe um ID de projeto ou de equipe.
        </p>
      </div>

      <button
        type="button"
        :disabled="!arquivo || importando"
        class="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
        @click="validarArquivo"
      >
        {{ importando ? 'Validando...' : 'Validar arquivo' }}
      </button>

      <p
        v-if="erroImportacao"
        role="alert"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ erroImportacao }}
      </p>

      <p
        v-if="resultadoImportacao"
        role="status"
        class="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
      >
        {{ resultadoImportacao }}
      </p>

      <!-- Resultado da validação -->
      <div
        v-if="previa"
        class="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
      >
        <div>
          <h4 class="font-semibold text-slate-800 dark:text-slate-100">
            Resultado da validação
          </h4>

          <div class="mt-2 grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p class="text-xl font-bold text-slate-800 dark:text-slate-100">
                {{ previa.total_rows }}
              </p>
              <p class="text-xs text-slate-500">Total</p>
            </div>

            <div class="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
              <p class="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {{ previa.valid_rows }}
              </p>
              <p class="text-xs text-emerald-700 dark:text-emerald-300">Válidas</p>
            </div>

            <div class="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <p class="text-xl font-bold text-red-700 dark:text-red-300">
                {{ previa.invalid_rows }}
              </p>
              <p class="text-xs text-red-700 dark:text-red-300">Inválidas</p>
            </div>
          </div>
        </div>

        <div
          v-if="previa.errors?.length"
          class="space-y-1 text-sm text-red-600 dark:text-red-400"
        >
          <p v-for="(error, index) in previa.errors" :key="index">
            {{ error }}
          </p>
        </div>

        <div
          v-if="previa.rows?.length"
          class="max-h-72 space-y-2 overflow-y-auto"
        >
          <div
            v-for="row in previa.rows"
            :key="row.row"
            class="rounded-lg border border-slate-100 p-3 dark:border-slate-800"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
                Linha {{ row.row }} — {{ row.nome || 'Sem nome' }}
              </span>

              <span
                class="rounded-full px-2 py-1 text-xs font-semibold"
                :class="row.valid
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'"
              >
                {{ row.valid ? 'Válida' : 'Inválida' }}
              </span>
            </div>

            <ul
              v-if="row.errors?.length"
              class="mt-2 list-inside list-disc text-xs text-red-600 dark:text-red-400"
            >
              <li v-for="(error, index) in row.errors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>

        <p
          v-if="previa.valid"
          class="text-sm text-emerald-700 dark:text-emerald-300"
        >
          Todas as linhas foram validadas. Você pode confirmar a importação.
        </p>

        <button
          v-if="previa.valid"
          type="button"
          :disabled="importando || !arquivo"
          class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="confirmarImportacao"
        >
          {{ importando ? 'Importando...' : 'Confirmar importação' }}
        </button>

        <p
          v-else
          class="text-sm text-red-600 dark:text-red-400"
        >
          Corrija os problemas indicados no arquivo e faça uma nova validação.
        </p>
      </div>
    </div>
  </section>
</template>