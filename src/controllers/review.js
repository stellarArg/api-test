import {flatMap, isEmpty, parseInt, find, map, join, get, forEach, compact, orderBy, toString} from 'lodash';
import {Types} from 'mongoose';
import Heimdall from '@indec/heimdall';

import enums from '../common/enums';
import {AddressService, PermissionService, UsersService, SurveyAddressService, LogService} from '../services';

const {surveyAddressState, states} = enums;
const {UserService} = Heimdall.services;
const {ObjectId} = Types;

export default class ReviewController {
    static getStates(req, res, next) {
        return AddressService.fetchStates(req.user).then(states => res.send({states: compact(states)})).catch(next);
    }

    static getAdditionalInfo(req, res, next) {
        const {filters, group} = PermissionService.getReviewAggregation(req.user, req.query.stateId);
        return Promise.all([
            AddressService.getRegionalAggregation(filters, group),
            UsersService.getReassignUsers(req.user, req.query.stateId)
        ]).then(([regionals, users]) => {
            const stateInfo = flatMap(regionals, regions => regions._id);
            return res.send({stateInfo, users});
        }).catch(next);
    }

    static getSurveys(req, res, next) {
        const {filters} = PermissionService.getReviewAggregation(req.user, req.query.stateId);
        const {ups, area, status, user} = req.query;
        if(!isEmpty(ups)) {
            filters.ups = parseInt(ups);
        }
        if(!isEmpty(area)) {
            filters.area = parseInt(area);
        }
        if(!isEmpty(status)) {
            filters.surveyAddressState = parseInt(status);
        }
        if(!isEmpty(user)) {
            filters.pollster = ObjectId(user);
        }

        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        return Promise.all([
            SurveyAddressService.fetch(filters, skip),
            SurveyAddressService.getTotalSurveys(filters),
            UsersService.getPollstersAndTeamLeaders(req.user, req.query.stateId)
        ]).then(
            ([surveyAddress, surveysSize, users]) => {
                const surveys = orderBy(map(surveyAddress, survey => {
                    let rejected = false;
                    let valid = true;
                    const dwellingsInfo = [];
                    const surveyInfo = {};
                    const pollster = find(users, user => user._id == survey.pollster);
                    const supervisor = find(users, user => user._id == get(survey, 'addressInfo.supervisor'));
                    surveyInfo.pollsterName = pollster ? `${pollster.surname}, ${pollster.name}` : 'N/A';
                    surveyInfo.supervisorName = supervisor ? `${supervisor.surname}, ${supervisor.name}` : 'N/A';
                    const dwellings = survey.dwellings;
                    let dwellingCount = 1;
                    forEach(dwellings, dwelling => {
                        const d = {};
                        let householdCount = 0;
                        if(dwelling && !dwelling.disabled) {
                            rejected = dwelling.response === 2;
                            valid = dwelling.valid;
                            d.id = dwellingCount;
                            d.response = dwelling.response;
                            d.households = [];
                            forEach(dwelling.households, household => {
                                let memberCount = 0;
                                if(household && !household.disabled) {
                                    d.households[householdCount] = {};
                                    rejected = !rejected && household.response === 2 ? true : rejected;
                                    valid = valid && !household.valid ? false :  valid;
                                    d.households[householdCount].members = [];
                                    forEach(household.members, member => {
                                        if(member && !member.disabled) {
                                            rejected = !rejected && (member.response === 2 || !member.response) &&
                                                member.selectedMember ? true : rejected;
                                            valid = valid && !member.valid ? false : valid;
                                            if(member.selectedMember) {
                                                d.households[householdCount].members.push({
                                                    id: memberCount + 1,
                                                    response: member.response
                                                });
                                            }
                                            memberCount += 1;
                                        }
                                    });
                                    d.households[householdCount].id = householdCount + 1;
                                    d.households[householdCount].response = household.response;
                                    d.households[householdCount].memberQuantity = memberCount;
                                    householdCount += 1;
                                }
                            });
                            d.householdQuantity = householdCount;
                            dwellingsInfo.push(d);
                            dwellingCount += 1;
                        }
                    });
                    surveyInfo.info = dwellingsInfo;
                    surveyInfo.ups = get(survey, 'addressInfo.ups');
                    surveyInfo.area = get(survey, 'addressInfo.area');
                    surveyInfo.streetNumber = get(survey, 'address.streetNumber');
                    surveyInfo.street = get(survey, 'address.street');
                    surveyInfo.listNumber = get(survey, 'address.listNumber');
                    surveyInfo.stateId = get(survey, 'addressInfo.stateId');
                    surveyInfo.supervisor = get(survey, 'addressInfo.supervisor');
                    surveyInfo.stateName = get(survey, 'states.name');
                    surveyInfo.subCoordinator = get(survey, 'addressInfo.subCoordinator');
                    surveyInfo.valid = valid ? 1 : 2;
                    surveyInfo.rejected = rejected;
                    surveyInfo._id = survey._id;
                    surveyInfo.surveyAddressState = survey.surveyAddressState;
                    return surveyInfo;
                }), ['ups', 'area', 'listNumber'], [1, 1, 1]);
                return res.send({surveysAddresses: surveys, surveysSize});
            }).catch(next);
    }

    static getSurvey(req, res, next) {
        const {filters} = PermissionService.getReviewAggregation(req.user);
        const {id} = isEmpty(req.params) ? req.body : req.params;
        filters._id = ObjectId(id);
        return SurveyAddressService.fetch(filters, 0).then(
            ([surveyAddress]) => UserService.fetch([surveyAddress.pollster, surveyAddress.addressInfo.supervisor])
                .then(users => {
                    const surveyInfo = {};
                    const households = flatMap(surveyAddress.dwellings, d => !d.disabled && d.households);
                    const members = flatMap(households, h => !h.disabled && h.members);
                    let valid = true;
                    forEach(surveyAddress.dwellings, dwelling => {
                        if(!dwelling.disabled && !dwelling.valid) {
                            valid = false;
                        }
                    });
                    forEach(households, household => {
                        if(!household.disabled && !household.valid) {
                            valid = false;
                        }
                    });
                    forEach(members, member => {
                        if(!member.disabled && !member.valid && member.selected) {
                            valid = false;
                        }
                    });

                    const pollster = find(users, u => u._id === toString(surveyAddress.pollster));
                    const supervisor = find(users, u => u._id === toString(surveyAddress.addressInfo.supervisor));
                    surveyInfo.stateName = find(states, s => s._id === get(surveyAddress, 'addressInfo.stateId')).name;
                    surveyInfo.address = get(surveyAddress, 'address');
                    surveyInfo.pollsterName = pollster ? `${pollster.surname}, ${pollster.name}` : 'N/A';
                    surveyInfo.supervisorName = supervisor ? `${supervisor.surname}, ${supervisor.name}` : 'N/A';
                    surveyInfo.supervisor = get(surveyAddress, 'addressInfo.supervisor');
                    surveyInfo.subCoordinator = get(surveyAddress, 'addressInfo.subCoordinator');
                    surveyInfo.updatedAt = get(surveyAddress, 'updatedAt');
                    surveyInfo._id = get(surveyAddress, '_id');
                    surveyInfo.surveyAddressState = get(surveyAddress, 'surveyAddressState');
                    surveyInfo.dwellings = get(surveyAddress, 'dwellings');
                    surveyInfo.valid = valid;
                    return res.send({surveyAddress: surveyInfo});
                })
        ).catch(next);
    }

    static reopenSurvey(req, res, next) {
        return SurveyAddressService.setSurveyAddressState(req.body.id, surveyAddressState.OPEN).then(() =>
            LogService.log(
                req.user._id,
                'update',
                'surveyAddresses', {update: {surveyAddressState: surveyAddressState.OPEN}, filters: {
                    _id: req.body.id
                }},
                `Update(reopen) perform on surveyAddresses by the user ${req.user.surname}, ` +
                `${req.user.username} rol/es: ${join(req.user.roles, ', ')}`
            ).then(
                () => ReviewController.getSurvey(req, res, next)
            ).catch(next)
        ).catch(next);
    }

    static approveSurvey(req, res, next) {
        return SurveyAddressService.setSurveyAddressState(req.body.id, surveyAddressState.APPROVED).then(() =>
            LogService.log(
                req.user._id,
                'update',
                'surveyAddresses', {update: {surveyAddressState: surveyAddressState.OPEN}, filters: {_id: req
                    .body.id}},
                `Update(approve) perform on surveyAddresses by the user ${req.user.surname}, ` +
                `${req.user.username} rol/es: ${join(req.user.roles, ', ')}`
            ).then(
                () => ReviewController.getSurvey(req, res, next)
            ).catch(next)
        ).catch(next);
    }

    static reassign(req, res, next) {
        const {id, pollster} = req.body;
        return SurveyAddressService.create({_id: id}, {pollster}).then(
            surveyAddress => AddressService.saveRegionalAssign({_id: surveyAddress.address}, {pollster}).then(
                () => LogService.log(
                    req.user._id,
                    'update',
                    'surveyAddresses', {update: {pollster}, filters: {_id: id}},
                    `Update(reassign) perform on surveyAddresses by the user ${req.user.surname}, ` + 
                    `${req.user.username} rol/es: ${join(req.user.roles, ', ')}`
                ).then(() => ReviewController.getSurvey(req, res, next)).catch(next)
            ).catch(next)
        ).catch(next);
    }
}
