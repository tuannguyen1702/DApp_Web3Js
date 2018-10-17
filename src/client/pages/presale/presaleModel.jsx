import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const ETHPresaleModel = {
    fields: {
        amount: {
            value: '',
            type: 'text',
            label: 'ETH Amount',
            placeholder: 'Amount',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        description: {
            value: '',
            type: 'textarea',
            label: 'Description',
            placeholder: 'Description',
            options: {
                validateOnChange: true,
            },
        }

    },
};

export const BTCPresaleModel = {
    fields: {
        amount: {
            value: '',
            type: 'text',
            label: 'ETH Amount',
            placeholder: 'Amount',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        description: {
            value: '',
            type: 'text',
            label: 'Description',
            placeholder: 'Description',
            options: {
                validateOnChange: true,
            },
        }
    },
};

export const FIATPresaleModel = {
    fields: {
        amount: {
            value: '',
            type: 'text',
            label: 'ETH Amount',
            placeholder: 'Amount',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
        description: {
            value: '',
            type: 'text',
            label: 'Description',
            placeholder: 'Description',
            options: {
                validateOnChange: true,
            },
        },
    },
};