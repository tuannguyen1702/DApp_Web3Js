import simulateAsyncFindUserCall from './_.async';

export function checkUser({ field }) {
    const msg = `Hey! The username ${field.value} is already taken.`;
    // show error if the call does not returns entries
    return simulateAsyncFindUserCall({ user: field.value })
        .then(items => [(items.length === 0), msg]);
}

export function shouldBeEqualTo(target) {
    return ({ field, form }) => {
        const fieldsAreEquals = (form.$(target).value === field.value);
        return [fieldsAreEquals, `The ${field.label} should be equals to ${form.$(target).label}`];
    };
}

export function shouldMatchEmail(target) {
    return ({ field, form }) => {
        const fieldsAreEquals = (form.$(target).value === field.value);
        return [fieldsAreEquals, `Email addresses do not match.`];
    };
}

export function shouldMatchPassword(target) {
    return ({ field, form }) => {
        const fieldsAreEquals = (form.$(target).value === field.value);
        return [fieldsAreEquals, `Password do not match.`];
    };
}

export function cannotBeNegativeNumber(){
    return({field,form})=>{
        const fieldsAreNegative = (!field.value.toString().includes("-"))
        return [fieldsAreNegative,`${field.label} cannot be negative`]
    }
}

export function checkMinValue(){
    return ({ field, form }) => {
        var isValid = (field.value >= field.options.min);
        isValid = field.value == "" ? true: isValid;

        return [isValid, `The value must be at least`];
    };
}

export function isEmail({ field }) {
    const isValid = (field.value.indexOf('@') > 0);
    return [isValid, `The ${field.label} should be an email address.`];
}
