import { z as tasksSchema, r as mockTasks, p as mockProjects } from './index-D-j7ajRT.mjs';
import { ref } from 'vue';

const tasksRef = ref(tasksSchema.parse(mockTasks, "tasks"));
function useTeamTagClass(team) {
  const map = {
    Backend: "text-blue-600 bg-blue-50",
    Frontend: "text-indigo-600 bg-indigo-50",
    DevOps: "text-emerald-600 bg-emerald-50"
  };
  return team && map[team] || "text-slate-600 bg-slate-100";
}
function useTasksData() {
  return tasksRef.value;
}
function groupTasksByPriority(tasks) {
  const order = ["critica", "alta", "media", "baixa"];
  return order.map((key) => ({ key, tasks: tasks.filter((t) => t.priority === key) })).filter((group) => group.tasks.length > 0);
}
const PROJECT_PROGRESS = {
  ...Object.fromEntries(mockProjects.map((p) => [p.name, p.progress])),
  "App de Gestão Produtiva Corp.": 45,
  "Sistema de Logística": 62,
  "Portal do Cliente": 30,
  "Data Warehouse": 50
};
function useProjectProgressForTask(project, override) {
  if (override !== void 0) return override;
  if (!project) return 0;
  return PROJECT_PROGRESS[project] ?? 0;
}

export { useTasksData as a, useTeamTagClass as b, groupTasksByPriority as g, useProjectProgressForTask as u };
//# sourceMappingURL=useProjectProgress-CQIoMO92.mjs.map
