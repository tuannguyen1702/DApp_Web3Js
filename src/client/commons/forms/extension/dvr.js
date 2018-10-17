import simulateAsyncFindUserCall from './_.async';

const asyncRules = {
    checkUser: (value, attr, key, passes) => {
        const msg = `Hey! The username ${value} is already taken.`;
        // show error if the call does not returns entries
        simulateAsyncFindUserCall({ user: value })
            .then(items => (items.length === 0) ? passes() : passes(false, msg));
    },
};

const rules = {
    telephone: {
        function: value => value.match(/^\d{3}-\d{3}-\d{4}$/),
        message: 'The :attribute phone number is not in the format XXX-XXX-XXXX.',
    },
    vi_phone: {
        function: value => 
        value.match(/^\d{9,10}$/)
        ,
        message: 'The phone number is not in the format',
    },
    checked: {
        function: value => {
            value == true
        },
        message: 'This is a required field',
    },
};

export default ($validator) => {
    var messages = $validator.getMessages('en')
    // messages.required = 'Whoops, :attribute field is required.';
    messages.required = 'This is a required field'
    messages.email = 'Email address is invalid'
    // messages.regex = 'Your password should have at least 1 letter and 1 number.'
    $validator.setMessages('en', messages)

    // register async rules
    Object.keys(asyncRules).forEach(key =>
        $validator.registerAsyncRule(key, asyncRules[key]));
    // register sync rules
    Object.keys(rules).forEach(key =>
        $validator.register(key, rules[key].function, rules[key].message));
};

