import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const BaseInfoModel = {
    fields: {
        firstName: {
            value: '',
            type: 'text',
            label: 'firstName',
            placeholder: 'inputFirstName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        lastName: {
            value: '',
            type: 'text',
            label: 'lastName',
            placeholder: 'inputLastName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        birthDate: {
            value: '',
            label: 'birthDate',
            type: 'data',
            placeholder: 'DD/MM/YYYY',
            rules: 'required',
            options: {
                validateOnChange: true
            },
        },
        gender: {
            value: 1,
            label: 'gender',
            type: 'select',
            placeholder: 'select options',
            rules: 'required',
            options: {
                validateOnChange: true,
                options: [
                    { value: "OTHER", text: "" },
                    { value: "MALE",  text: "male" },
                    { value: "FEMALE", text: "female" },
                ]
            },
        },
        facebookLink: {
            value: '',
            type: 'textbox',
            label: '',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        }
    },
};

export const BankModel = {
    fields: {
        bank: {
            value: '',
            type: 'select',
            label: 'bank',
            placeholder: 'bank',
            options: {
                validateOnChange: true,
                options: [
                ]
            },
        },
        bankAccountName: {
            value: '',
            type: 'textbox',
            label: 'bankAccountName',
            placeholder: 'bankAccountName',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        bankID: {
            value: '',
            type: 'textbox',
            label: 'bankID',
            placeholder: 'bankID',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
    },
};

export const PhoneModel = {
    fields: {
        phone: {
            value: '',
            type: 'textbox',
            label: 'phone',
            placeholder: '901234567',
            rules: 'required|vi_phone',
            options: {
                validateOnChange: true,
            },
        },
        phoneVerifyCode: {
            value: '',
            type: 'textbox',
            label: 'verifyCode',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnBlur: true
            },
        }
    },
};

export const EmailModel = {
    
    fields: {
        email: {
            value: '',
            type: 'textbox',
            label: 'email',
            placeholder: 'vinfin@gmail.com',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        },
        emailVerifyCode: {
            value: '',
            type: 'textbox',
            label: 'verifyCode',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnBlur: true
            },
        }
    },
};