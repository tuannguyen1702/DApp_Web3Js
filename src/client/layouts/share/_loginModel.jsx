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
            placeholder: 'Email',
            rules: 'required|email',
            options: {
                validateOnChange: true,
            },
        },
        password: {
            value: '',
            label: 'Password',
            type:'password',
            placeholder: 'Password',
            rules: 'required|string|between:8,100',
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
        },
    },
};

export const SignUpModel =  {
    fields: {
        password: {
            value: '',
            label: 'Password',
            type:'password',
            placeholder: 'Password',
            rules: 'required|string|between:8,100',
            options: {
                validateOnChange: true,
            },
        },
        // confirmPassword: {
        //     value: '',
        //     label: 'Confirm Password',
        //     type:'password',
        //     placeholder: 'Confirm Password',
        //     rules: 'required',
        //     validators: [shouldMatchPassword('password')],
        //     options: {
        //         validateOnChange: true,
        //     },
        // },
    },
};