import React, { PropTypes, Component } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import _ from 'lodash'

class Countdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        }
    }

    // dateFromString(str) {
    //     var a = _.map(str.split(/[^0-9]/), function (s) {
    //         return parseInt(s, 10)
    //     }); //4 -1-8-4
    //     console("Data", Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0))
    //     return new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
    // }

    componentDidMount() {
        // update every second
        var self = this

        var {endCountDown} = self.props

        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.date);
            if(date == false && typeof endCountDown == "function") {
                endCountDown()
            }
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown(endDate){
        let diff = (endDate - Date.parse(new Date())) / 1000;
        if (diff == 'NaN') {
            return false;
        }

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = isNaN(diff) ? 0 : diff;

        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
    }

    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    render() {
        const countDown = this.state;
        return (
            <div className="Countdown">
                <span className="Countdown-col">
                    <span className="Countdown-col-element">
                        <strong>{this.addLeadingZeros(countDown.days)}</strong><br />
                        <span>{countDown.days === 1 ? <FormattedMessage id="day" /> : <FormattedMessage id="days" />}</span>
                    </span>
                </span>

                <span className="Countdown-col">
                    <span className="Countdown-col-element">
                        <strong>{this.addLeadingZeros(countDown.hours)}</strong><br />
                        <span><FormattedMessage id="hours" /></span>
                    </span>
                </span>


                <span className="Countdown-col">
                    <span className="Countdown-col-element">
                        <strong>{this.addLeadingZeros(countDown.min)}</strong><br />
                        <span><FormattedMessage id="minutes" /></span>
                    </span>
                </span>

                <span className="Countdown-col">
                    <span className="Countdown-col-element">
                        <strong>{this.addLeadingZeros(countDown.sec)}</strong><br />
                        <span><FormattedMessage id="seconds" /></span>
                    </span>
                </span>
            </div>
        );
    }
}

Countdown.propTypes = {
    date: PropTypes.string.isRequired
};

Countdown.defaultProps = {
    date: new Date()
};

export default Countdown;