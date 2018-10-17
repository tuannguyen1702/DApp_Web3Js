import {
    isEmail,
    shouldBeEqualTo,
    shouldMatchPassword,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const ForgotPasswordModel =  {
    fields: {
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