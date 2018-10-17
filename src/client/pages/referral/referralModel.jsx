import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
    checkMinValue
} from '../../commons/forms/extension/vjf';

export const BuyTokenModel = {
    fields: {
        toAddress: {
            value: '',
            type: 'text',
            label: 'To Address',
            placeholder: 'Address',
            rules: 'required|regex:/^(0x)?[0-9a-fA-F]{40}$/',
            options: {
                validateOnChange: true,
            },
        },
        amount: {
            value: '',
            type: 'text',
            label: 'Amount to Send',
            placeholder: 'Minimum 0.1 ETH',
            rules: 'required|numeric',
            options: {
                validateOnChange: true,
            },
        },
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
        // rawTransaction: {
        //     value: '',
        //     type: 'textarea',
        //     label: 'Raw Transaction',
        //     placeholder: 'Raw Transaction',
        //     rules: 'required',
        //     options: {
        //         validateOnChange: true,
        //     },
        // },
        // signedTransaction: {
        //     value: '',
        //     type: 'textarea',
        //     label: 'Signed Transaction',
        //     placeholder: 'Signed Transaction',
        //     rules: 'required',
        //     options: {
        //         validateOnChange: true,
        //     },
        // }, 
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

export const BTCWalletModel = {
    fields: {
        BTCAddress: {
            value: '',
            type: 'text',
            label: 'BTC Address',
            placeholder: '',
            options: {
                validateOnChange: true,
            },
        }
    }
}

export const InvestorBonusModel = {
    fields: {
        bonusValue: {
            value: '',
            type: 'text',
            label: 'Bonus for Investor',
            placeholder: '',
            rules: 'required|numeric|max:8|min:0',
            options: {
                validateOnChange: true,
            },
        }
    },
};