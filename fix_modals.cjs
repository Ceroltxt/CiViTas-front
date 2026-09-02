const fs = require('fs');

['ModalCreateProject.vue', 'ModalCreateTeam.vue'].forEach(f => {
  const p = 'c:/dev/CiViTas-front/app/components/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace('<template #content>`n    ', '<template #content>\n    ');
  c = c.replace('</UForm>`n    </template>`n  </UModal>', '</UForm>\n    </template>\n  </UModal>');
  fs.writeFileSync(p, c);
});
