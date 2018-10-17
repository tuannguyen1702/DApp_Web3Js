import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const IcoActionModel = {
    fields: {
        gas: {
            value: 300000,
            type: 'text',
            label: 'Gas Limit',
            placeholder: 'Gas Limit',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        gasPrice: {
            value: 10,
            type: 'text',
            label: 'Gas Price',
            placeholder: 'Gas Price',
            rules: 'required|integer|min: 5',
            options: {
                validateOnChange: true,
            },
        },
        transactionFee: {
            value: 10 * 300000 / 1000000000,
            type: 'text',
            label: 'Max Transaction Fee',
            placeholder: 'Max Transaction Fee',
            options: {
                validateOnChange: true,
            },
        },
        wallet: {
            value: -1,
            type: 'radio',
            label: 'How would you like to access your wallet?',
            placeholder: 'How would you like to access your wallet?',
            options: {
                validateOnChange: true,
            },
        },
        fromAddress: {
            value: '',
            type: 'text',
            label: 'Your wallet',
            placeholder: 'Your wallet',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
    },
};