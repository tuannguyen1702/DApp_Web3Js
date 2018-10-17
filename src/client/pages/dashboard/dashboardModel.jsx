import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export default {
    fields: {
        username: {
            value: 'vunguyen@big-labs.com',
            type:'email',
            label: 'Your Email',
            placeholder: 'Eg: email@domain.com',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        },
        password: {
            value: 'biglabs@12',
            label: 'Password',
            type:'password',
            placeholder: 'Password',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        dropdown:{
            value: '',
            label: 'Dropdown',
            type:'select',
            placeholder: 'select options',
            rules: 'required',
            options: {
                validateOnChange: true,
                options:[
                    {value:100,text:"Sample Text"},
                    {value:1000,text:"Sample Text 2"},
                    {value:10000,text:"Sample Text 3"}
                ],
            },
        },
        multiradio:{
            value: '',
            label: 'Dropdown',
            type:'radio',
            placeholder: 'select options',
            rules: 'required',
            options: {
                validateOnChange: true,
                options:[
                    {value:1,text:"Sample Radio"},
                    {value:2,text:"Sample Radio 2"},
                    {value:3,text:"Sample Radio 3"}
                ]
            },
        },
        multicheckbox:{
            value: [],
            label: 'Dropdown',
            type:'checkbox',
            placeholder: 'select options',
            rules: '',
            options: {
                validateOnChange: true,
                options:[
                    {value:1,text:"Sample checkbox"},
                    {value:2,text:"Sample checkbox"},
                    {value:3,text:"Sample checkbox"}
                ]
            },
        },
        singleCheckbox:{
            value: '',
            label: 'Dropdown',
            type:'checkbox',
            placeholder: 'select options',
            rules: 'required',
            options: {
                validateOnChange: true,
                option:{value:1,text:"Sample Single CheckBox"},
            },
        },
        textArea: {
            value: '',
            type:'textarea',
            label: 'textarea',
            placeholder: 'this is text area',
            rules: '',
            options: {
                validateOnChange: true,
            },
        },
    },
};