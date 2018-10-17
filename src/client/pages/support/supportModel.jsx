import {
    isEmail,
    shouldBeEqualTo,
    // checkUser,
} from '../../commons/forms/extension/vjf';

export const SupportModel = {
    fields: {
        title: {
            value: '',
            type: 'text',
            label: 'Title',
            placeholder: 'Title',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        content: {
            value: '',
            type: 'textarea',
            label: "Content",
            placeholder: 'Content',
            rules: 'required',
            options: {
                validateOnChange: true,
            }
        }
    },
};

export const ReplySupportModel = {
    fields: {
        content: {
            value: '',
            type: 'textarea',
            label: "Content",
            placeholder: '',
            options: {
                validateOnChange: true,
            }
        }
    },
};