import { Group } from 'src/app/models/group.model';
import { Item } from 'src/app/models/item.model';

export const addItemToGroup = (
  stateGroups: Group[],
  payload: { groupid: string, item: Item }
): Group[] => {
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      return {
        ...group,
        items: [...group.items, payload.item]
      }
    }
    return group;
  });
};

export const deleteItemFromGroup = (
  stateGroups: Group[],
  payload: { itemid: string, groupid: string }
): Group[] => {
  return stateGroups.map(group => {
    if (group.id === payload.groupid) {
      return {
        ...group,
        items: group.items.filter(item => item.id !== payload.itemid),
      }
    }
    return group;
  });
};


export const updateGroup = (
  stateGroups: Group[],
  updatedGroup: Group
): Group[] => stateGroups.map(g => {
  if (g.id === updatedGroup.id) {
    const { name, description, deadline, currency, id, manager_id } = updatedGroup;
    return { ...g, name, description, deadline, currency, id, manager_id };
  }
  return g;
});


export const selectGroup = (
  stateGroups: Group[],
  selectedGroupid: string
): Group => {
  return stateGroups.find(group => group.id === selectedGroupid);
};