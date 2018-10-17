import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
    checkMinValue
} from '../../commons/forms/extension/vjf';

export const ETHWalletModel = {
    fields: {
        ETHAddress: {
            value: '',
            type: 'text',
            label: 'ETH Wallet Address',
            placeholder: 'Input Your ETH Wallet Address',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        }
    }
}
