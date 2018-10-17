import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const CheckMozoAddressModel = {
    fields: {
        address: {
            value: '',
            type: 'text',
            label: 'Address',
            placeholder: 'Address',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        }
    },
};