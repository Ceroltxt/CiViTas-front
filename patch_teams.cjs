const fs = require('fs');

const roles = ['admin', 'gestor', 'colaborador'];

for (const role of roles) {
  const path = `c:/dev/CiViTas-front/app/pages/${role}/projetos/[id]/index.vue`;
  if (!fs.existsSync(path)) continue;
  
  let content = fs.readFileSync(path, 'utf8');
  
  // 1. Add script var if not exists
  if (!content.includes('const isCreateTeamOpen = ref(false)')) {
    content = content.replace('</script>', 'const isCreateTeamOpen = ref(false)\n</script>');
  }
  
  // 2. Safely replace the exact header to add the button without adding extra closing tags.
  // The original string is precisely this:
  const originalHeader = '    <div class="flex items-center gap-2">\n     <UIcon name="i-heroicons-user-group" class="size-5 text-violet-500" />\n     <h2 class="font-semibold text-slate-800 dark:text-slate-100">Equipes que você faz parte neste projeto</h2>\n    </div>\n   </div>';
  
  const newHeader = '    <div class="flex items-center gap-2">\n     <UIcon name="i-heroicons-user-group" class="size-5 text-violet-500" />\n     <h2 class="font-semibold text-slate-800 dark:text-slate-100">Equipes do projeto</h2>\n    </div>\n    <UButton color="primary" size="sm" icon="i-heroicons-plus" label="Criar Equipe" @click="isCreateTeamOpen = true" />\n   </div>';

  if (content.includes(originalHeader)) {
    content = content.replace(originalHeader, newHeader);
  } else {
    // If it's admin, it might have 'Equipes do projeto' without the button (from my very first replacement)
    const adminHeader = '    <div class="flex items-center gap-2">\n     <UIcon name="i-heroicons-user-group" class="size-5 text-violet-500" />\n     <h2 class="font-semibold text-slate-800 dark:text-slate-100">Equipes do projeto</h2>\n    </div>\n   </div>';
    if (content.includes(adminHeader)) {
      content = content.replace(adminHeader, newHeader);
    }
  }
  
  // 3. Add ModalCreateTeam right before the LAST </template>
  if (!content.includes('<ModalCreateTeam')) {
    const lastIdx = content.lastIndexOf('</template>');
    if (lastIdx !== -1) {
      content = content.slice(0, lastIdx) + '  <ModalCreateTeam v-model="isCreateTeamOpen" />\n' + content.slice(lastIdx);
    }
  }
  
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed', path);
}
