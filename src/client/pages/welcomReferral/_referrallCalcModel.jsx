export const ReferralCalcModel = {
    fields: {
        numberReferral: {
            value: '',
            type:'number',
            label: 'Number of referrers invited per day',
            placeholder: '',
            rules: 'required|integer',
            options: {
                validateOnChange: true,
            },
        },
        numberTokens: {
            value: '',
            type:'number',
            label: 'Average tokens sold per referrer',
            placeholder: '',
            rules: 'required',
            options: {
                validateOnChange: true,
            },
        }
    }
}