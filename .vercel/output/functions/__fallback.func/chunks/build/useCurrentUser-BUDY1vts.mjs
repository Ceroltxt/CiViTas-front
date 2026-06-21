import { D as userSummarySchema, j as mockCurrentUser, w as projectDetailSchema, o as mockProjectDetail, d as currentProjectSchema, i as mockCurrentProject } from './index-D-j7ajRT.mjs';

const user = userSummarySchema.parse(mockCurrentUser, "currentUser");
const project = currentProjectSchema.parse(mockCurrentProject, "currentProject");
const projectDetail = projectDetailSchema.parse(mockProjectDetail, "projectDetail");
function useCurrentUser() {
  return user;
}
function useCurrentProject() {
  return project;
}
function useProjectDetail() {
  return projectDetail;
}

export { useCurrentUser as a, useProjectDetail as b, useCurrentProject as u };
//# sourceMappingURL=useCurrentUser-BUDY1vts.mjs.map
