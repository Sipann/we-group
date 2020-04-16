import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private _groups = new BehaviorSubject<Group[]>([
    new Group(1, 'Boulangerie', 'Boulangerie du Fournil - Mont Choisty', '', 'id1'),
    new Group(2, 'Fruits & Légumes', 'Maraîcher de MChoisty', '', 'id1'),
    new Group(3, 'Piscine', 'Produits d\'entretien pour la piscine', '', 'id2'),
  ]);

  get groups() {
    return this._groups.asObservable();
  }

  getGroup(id: number) {
    return this._groups.pipe(
      take(1),
      map(groups => { return { ...groups.find(g => g.id === id) }; })
    );
  }

  constructor() { }
}
