'use strict';

import React from 'react';
import {IntlProvider} from 'react-intl';
import TestUtils from 'react-addons-test-utils';
import User from "../../js/components/user/User";
import {ACTION_STATUS} from "../../js/constants/DefaultConstants";

describe('User', function () {
    const intlData = require('../../js/i18n/en');
    let user,
        admin,
        newUser,
        backToInstitution,
        loading,
        userSaved,
        showAlert,
        userLoaded,
        handlers = {
            onSave: jasmine.createSpy('onSave'),
            onCancel: jasmine.createSpy('onCancel'),
            onChange: jasmine.createSpy('onChange'),
        };

    beforeEach(() => {
        loading = false;
        showAlert = false;
        userLoaded = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        userSaved = {
            status: ACTION_STATUS.SUCCESS,
            error: ''
        };
        newUser = {
            firstName: '',
            lastName: '',
            username: '',
            emailAddress: '',
            password: 'test',
            isAdmin: false,
            isNew: true
        };
    });


    admin = {
        "uri":"http://vfn.cz/ontologies/study-manager/Admin-Administratorowitch",
        "firstName":"Test1",
        "lastName":"Man",
        "username":"testman1",
        "password":"test",
        "institution":{
            "uri":"http://test.io",
            "key":"823372507340798303",
            "name":"Test Institution",
            "emailAddress":"test@institution.io"
        },
        "types":[
            "http://vfn.cz/ontologies/study-manager/administrator",
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    };

    user = {
        "uri":"http://vfn.cz/ontologies/study-manager/erter-tert",
        "firstName":"Test2",
        "lastName":"Man",
        "username":"testman2",
        "password": "test",
        "emailAddress":"test@man.io",
        "types":[
            "http://vfn.cz/ontologies/study-manager/doctor"
        ]
    };

    it('is showing loader', function () {
        loading = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const result = TestUtils.findRenderedDOMComponentWithClass(tree, 'mask');
        expect(result).not.toBeNull();
    });

    it('should show error about user was not loaded', function () {
        userLoaded = {
            ...userLoaded,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
    const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
    expect(alert).not.toBeNull();
    });

    it("should render user's form empty", function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("text");
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
                default:
                    expect(input.type).toEqual("checkbox");
                    expect(input.checked).toBeFalsy();
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('should render clickable "Save" button and click on it', function () {
        newUser = {
            ...newUser,
            username: 'test',
            firstName: 'test1',
            lastName: 'test2'
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        let buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        expect(buttons[0].disabled).toBeFalsy();
        TestUtils.Simulate.click(buttons[0]); // save
        expect(handlers.onSave).toHaveBeenCalled();
    });


    it('should show successful alert that user was successfully saved', function () {
        showAlert = true;
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.SUCCESS
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-success");
        expect(alert).not.toBeNull();
    });

    it('should show unsuccessful alert that user was not saved', function () {
        showAlert = true;
        userSaved = {
            ...userSaved,
            status: ACTION_STATUS.ERROR,
            error: {
                message: "Error"
            }
        };
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const alert = TestUtils.scryRenderedDOMComponentsWithClass(tree, "alert-danger");
        expect(alert).not.toBeNull();
    });

    it('should render filled user\'s form without checked administrator checkbox', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={user} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("Test2");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("Man");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("testman2");
                    expect(input.type).toEqual("text");
                    expect(input.disabled).toBeTruthy();
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("test@man.io");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
                default:
                    expect(input.type).toEqual("checkbox");
                    expect(input.checked).toBeFalsy();
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('should render filled user\'s form with checked administrator checkbox', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={admin} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const result = TestUtils.scryRenderedDOMComponentsWithTag(tree,'input');
        expect(result.length).toEqual(6);
        for(let input of result) {
            switch(input.name){
                case "firstName":
                    expect(input.value).toEqual("Test1");
                    expect(input.type).toEqual("text");
                    break;
                case "lastName":
                    expect(input.value).toEqual("Man");
                    expect(input.type).toEqual("text");
                    break;
                case "username":
                    expect(input.value).toEqual("testman1");
                    expect(input.type).toEqual("text");
                    expect(input.disabled).toBeTruthy();
                    break;
                case "emailAddress":
                    expect(input.value).toEqual("");
                    expect(input.type).toEqual("email");
                    break;
                case "password":
                    expect(input.value).toEqual("test");
                    expect(input.type).toEqual("text");
                    expect(input.readOnly).toBeTruthy();
                    break;
                default:
                    expect(input.type).toEqual("checkbox");
                    expect(input.checked).toBeTruthy();
            }
        }
        const select = TestUtils.findRenderedDOMComponentWithTag(tree,'select');
        expect(select).not.toBeNull();
    });

    it('should render "Cancel" button and click on it', function () {
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // cancel
        expect(handlers.onCancel).toHaveBeenCalled();
    });

    it('should render "Back to institution" button and click on it', function () {
        backToInstitution = true;
        const tree = TestUtils.renderIntoDocument(
            <IntlProvider locale="en" {...intlData}>
                <User user={newUser} handlers={handlers} backToInstitution={backToInstitution}
                      loading={loading} userSaved={userSaved} showAlert={showAlert}
                      userLoaded={userLoaded}/>
            </IntlProvider>);
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, "Button");
        expect(buttons.length).toEqual(2);

        TestUtils.Simulate.click(buttons[1]); // back to institution
        expect(handlers.onCancel).toHaveBeenCalled();
    });
});