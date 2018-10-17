import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { injectIntl, intlShape } from 'react-intl';
import { Progress } from 'reactstrap';
import ProgressComponent from '../progress/Progress';
import moment from "moment";

class TimeLineChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let myProgressBar = this.refs._myUncontrolledComp;
        let _progress_bar = myProgressBar.querySelector('.progress');
        let _progress_bar__inner = myProgressBar.querySelector('.progress-bar');
        let _label = myProgressBar.querySelector('label');
        _progress_bar.appendChild(_label);

        if (this.props.show_cliff) {
            let _cliff = myProgressBar.querySelector('.cliff');
            _progress_bar__inner.before(_cliff);
        }
    }

    handleMiddlePercent(start, end, middle) {
        const total_date = moment(end).diff(moment(start), 'days');
        const middle_diff = moment(middle).diff((start), 'days');
        return (middle_diff / total_date) * 100;
    }

    render() {
        let { show_middle_date = true, start_date, end_date, middle_date = null, current_date, show_cliff = false } = this.props;
        let percent_middle = this.handleMiddlePercent(start_date.date, end_date.date, middle_date.date);
        let percent_current = this.handleMiddlePercent(start_date.date, end_date.date, current_date.date);
        // let percent_current = this.handleMiddlePercent(start_date.date, end_date.date, '20180510');
        percent_current = percent_current < 0 ? 0 : percent_current
        return (
            <div className="timeline" ref="_myUncontrolledComp">
                <Progress value={percent_current} />
                <label style={{ left: percent_current + "%" }}>35</label>
                <div className="top_popup" style={{ left: percent_current + "%" }}>
                    <strong>Now</strong><br />({moment(current_date.date).format('LL')})
                </div>

                {show_cliff && (<div className="cliff" style={{ width: percent_middle + "%" }}></div>)}

                <div className="timeline__date">
                    <div className="start-date">
                        <strong>Start</strong><br />{moment(start_date.date).format('LL')}
                    </div>

                    {/* {show_middle_date &&
                        (<div className="middle-date" style={{ left: percent_middle + "%" }}>
                            <strong>Presale end</strong><br />{moment(middle_date.date).format('LL')}
                        </div>)} */}

                    <div className="end-date">
                        <strong>End</strong><br />{moment(end_date.date).format('LL')}
                    </div>
                </div>
            </div>
        );
    }
}
TimeLineChart.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(TimeLineChart));
