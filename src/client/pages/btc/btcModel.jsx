import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const BTCModel = {
    fields: {
        address: {
            value: '',
            type: 'text',
            label: 'ETH Address',
            placeholder: 'Input your ETH address',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        btc: {
            value: '',
            type: 'text',
            label: 'BTC Address',
            placeholder: 'BTC Address',
            options: {
                validateOnChange: true,
            },
        }
    },
};