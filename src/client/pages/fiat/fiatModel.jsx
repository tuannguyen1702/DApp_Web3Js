import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

import moment from 'moment'

export const FIATModel = {
    fields: {
        email: {
            value: '',
            type: 'text',
            label: 'Email',
            placeholder: 'Email',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        },
        rate: {
            value: '',
            type: 'text',
            label: 'Rate',
            placeholder: 'Rate',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            },
        },
        date: {
            value: moment(new Date()),
            type: 'date',
            label: 'Opening Time',
            placeholder: 'DD/MM/YYYY',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        amount: {
            value: '',
            type: 'text',
            label: 'USD Number',
            placeholder: 'Input USD number',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        token: {
            value: '',
            type: 'text',
            label: 'Mozo Token',
            placeholder: 'Token number',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        bankAccount: {
            value: "Development Bank of Singapore",
            type: 'select',
            label: 'Bank Account',
            placeholder: 'Select bank account',
            options: {
                validateOnChange: true,
            },
        },
    },
};