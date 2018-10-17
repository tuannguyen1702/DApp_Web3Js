export const AirdropCreateModel = {
    fields: {
        type: {
            value: "pre-open",
            type: 'select',
            label: 'Type',
            placeholder: 'Select type',
            options: {
                validateOnChange: true,
            },
        },
        raw: {
            value: '',
            type: 'textarea',
            label: 'Raw file',
            placeholder: 'Raw file put here',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        },
        result: {
            value: '',
            type: 'textarea',
            label: 'Result',
            placeholder: 'Result',
            options: {
                validateOnChange: true,
            },
        },
    },
};