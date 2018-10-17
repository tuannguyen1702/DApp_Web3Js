import {
    isEmail,
    shouldBeEqualTo,
    shouldMatchPassword,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const EmailModel = {
    fields: {
        username: {
            value: '',
            type:'email',
            label: 'Email',
            placeholder: 'email@domain.com',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        }
    }
};

export const PasswordModel =  {
    fields: {
        password: {
            value: '',
            label: 'Password',
            type:'password',
            placeholder: 'Password',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        }
    },
};

export const SignUpModel =  {
    fields: {
        password: {
            value: '',
            label: 'Password',
            type:'password',
            placeholder: 'Password',
            rules: 'required|string|between:8,100|regex:/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*#?&-._=+"~`^<>]+)$/',
            options: {
                validateOnChange: true,
            },
        },
        confirmPassword: {
            value: '',
            label: 'Confirm Password',
            type:'password',
            placeholder: 'Confirm Password',
            rules: 'required',
            validators: [shouldMatchPassword('password')],
            options: {
                validateOnChange: true,
            },
        },
    },
};