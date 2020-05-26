import { Group } from 'src/app/models/group.model';


export const updateGroup = (stateGroups: Group[], updatedGroup: Group): Group[] => stateGroups.map(g => {
  if (g.id === updatedGroup.id) {
    const { name, description, deadline, currency, id, manager_id } = updatedGroup;
    return { ...g, name, description, deadline, currency, id, manager_id };
  }
  return g;
});


export const selectGroup = (stateGroups: Group[], selectedGroupid: string): Group => {
  return stateGroups.find(group => group.id === selectedGroupid);
};