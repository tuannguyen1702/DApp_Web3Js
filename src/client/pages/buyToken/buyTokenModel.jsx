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
            value: 1,
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

export const ETHRateModel = {
    fields: {
        amountETH: {
            value: '',
            type: 'text',
            label: 'ETH',
            placeholder: 'Minimum 0.1 ETH',
            rules: 'required|numeric',
            validators: [checkMinValue()],
            options: {
                min: 0.1,
                validateOnChange: true,
            },
        },
        amountETHtoMOZO: {
            value: '',
            type: 'text',
            label: 'MOZO',
            placeholder: 'Token number',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            },
        }
    },
};

export const BTCRateModel = {
    fields: {
        amountBTC: {
            value: '',
            type: 'text',
            label: 'BTC',
            placeholder: 'Minimum 0.01 BTC',
            rules: 'numeric',
            validators: [checkMinValue()],
            options: {
                min: 0.01,
                validateOnChange: true,
            },
        },
        amountBTCtoMOZO: {
            value: '',
            type: 'text',
            label: 'MOZO',
            placeholder: 'Token number',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            },
        }
    },
};

export const FIATRateModel = {
    fields: {
        amountFIAT: {
            value: '',
            type: 'text',
            label: 'FIAT',
            placeholder: 'Input amount of money',
            rules: 'numeric',
            validators: [checkMinValue()],
            options: {
                min: 90,
                validateOnChange: true,
            },
        },
        amountFIATtoMOZO: {
            value: '',
            type: 'text',
            label: 'MOZO',
            placeholder: 'Token number',
            rules: 'numeric',
            options: {
                validateOnChange: true,
            },
        }
    },
};