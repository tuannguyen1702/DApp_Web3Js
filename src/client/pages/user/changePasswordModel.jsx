import {
    isEmail,
    shouldBeEqualTo,
    shouldMatchPassword,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const ChangePasswordModel =  {
    fields: {
        oldpassword: {
            value: '',
            label: 'Old Password',
            type:'password',
            placeholder: 'Old Password',
            rules: 'required|string|between:8,100',
            options: {
                validateOnChange: true,
            },
        },
        password: {
            value: '',
            label: 'Password',
            type:'password',
            placeholder: 'New Password',
            rules: 'required|string|between:8,100',
            options: {
                validateOnChange: true,
            },
        },
        confirmPassword: {
            value: '',
            label: 'Confirm Password',
            type:'password',
            placeholder: 'Confirm New Password',
            rules: 'required',
            validators: [shouldMatchPassword('password')],
            options: {
                validateOnChange: true,
            },
        },
    },
};
