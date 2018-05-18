import {map, assign, find} from 'lodash';
import {PermissionService, FieldMaterialsService} from '../services';

export default class FieldMaterialsController {
    static getFieldMaterials(req, res, next) {

        const {match} = PermissionService.getMatchFilters(req.user, req.query);

        const areaGroup = {
            _id: {stateId: '$stateId', ups: '$ups', area: '$area'},
            total: {$sum: 1}
        };

        const dwellingGroup = {
            _id: {stateId: '$stateId'},
            total: {$sum: 1}
        };

        const upsGroup = {
            _id: {stateId: '$stateId', ups: '$ups'},
            total: {$sum: 1}
        };

        if (req.query.stateId) {
            if (req.query.area) {
                return FieldMaterialsService.fetch(match).then(dwellings =>
                    FieldMaterialsService.fetchStates(req.user).then(states =>
                        res.send(
                            map(dwellings, dwelling => {
                                const total = {stateId: match.stateId, ups: match.ups, area: match.area};
                                const state = find(states, {_id: total.stateId});
                                state && assign(total, {stateName: state.name});
                                assign(total, dwelling);
                                return total;
                            })
                        )
                    )
                ).catch(next);

            } else if (req.query.ups) {
                return Promise.all([FieldMaterialsService.getSubTotalFieldMaterials(match, areaGroup),
                    FieldMaterialsService.getSubTotalFieldMaterials(match, areaGroup)
                ]).then(([areas, dwellings]) =>
                    FieldMaterialsService.fetchStates(req.user).then(states =>
                        res.send(map(areas, area => {
                            const total = {
                                stateId: area._id.stateId,
                                ups: match.ups,
                                area: area._id.area,
                                amountDwelling: area.total
                            };
                            const state = find(states, {_id: total.stateId});
                            state && assign(total, {stateName: state.name});
                            const dwelling = find(dwellings, dwelling => dwelling._id.area == total.area);
                            dwelling && assign(total, {dwelling: dwelling.total});
                            return total;
                        }))
                    )
                ).catch(next);
            }
            return Promise.all([
                FieldMaterialsService.getTotalFieldMaterials(match, areaGroup, {ups: '$_id.ups'}),
                FieldMaterialsService.getSubTotalFieldMaterials(match, upsGroup)
            ]).then(([ups, dwellings]) =>
                FieldMaterialsService.fetchStates(req.user).then(states =>
                    res.send(map(ups, up => {
                        const total = {stateId: up._id.stateId, ups: up._id.ups, amountArea: up.total};
                        const state = find(states, {_id: total.stateId});
                        state && assign(total, {stateName: state.name});
                        const dwelling = find(dwellings, dwelling => dwelling._id.ups == total.ups);
                        dwelling && assign(total, {amountDwelling: dwelling.total});
                        return total;
                    }))
                )
            ).catch(next);
        }
        return Promise.all([FieldMaterialsService.getTotalFieldMaterials(match, upsGroup),
            FieldMaterialsService.getTotalFieldMaterials(match, areaGroup),
            FieldMaterialsService.getSubTotalFieldMaterials(match, dwellingGroup)]).then(([ups, areas, dwellings]) =>
            FieldMaterialsService.fetchStates(req.user).then(states =>
                res.send(map(ups, up => {
                    const total = {stateId: up._id.stateId, amountUps: up.total};
                    const state = find(states, {_id: total.stateId});
                    state && assign(total, {stateName: state.name});
                    const area = find(areas, area => area._id.stateId == total.stateId && area._id.area == total.area);
                    area && assign(total, {amountArea: area.total});
                    const dwelling = find(dwellings, dwelling => dwelling._id.stateId == total.stateId);
                    dwelling && assign(total, {amountDwelling: dwelling.total});
                    return total;
                }))
            )
        ).catch(next);
    }
}
