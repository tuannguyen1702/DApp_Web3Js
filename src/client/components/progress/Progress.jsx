import React from 'react';
import { Progress } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedNumber } from 'react-intl';


class ProgressComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate() {
    //     return false;
    // }

    componentDidMount() {
        let myProgressBar = this.refs._myUncontrolledComp;
        let _progress_bar = myProgressBar.querySelector('.progress');
        let _label = myProgressBar.querySelector('label');
        _progress_bar.appendChild(_label);
    }

    render() {
        let { value = 0, color = '', more_detail , total_lb, total_num, logo_coin, heading, maximumFractionDigits = 2, unit = ""} = this.props;
        let position_percent = '' + value + '%';
        return (
            <div className={["widget-progress", color ? "widget-progress__" + color : ""].join(' ')} ref="_myUncontrolledComp">
                <h3>
                    <span className="logo-coin">
                        <img src={logo_coin} />
                    </span>
                    {heading}
                </h3>
                <div className="total-token__label">{total_lb}</div>
                <Progress value={value} />
                <div className="top_popup" style={{left: position_percent}}>
                <FormattedNumber
                    value={more_detail || 0}
                    style='decimal'
                    minimumFractionDigits={0}
                    maximumFractionDigits={maximumFractionDigits}
                    /> {unit}
                </div>
                <label style={{left: position_percent}}>{value}</label>
                <div className="total-token__number">
                <FormattedNumber
                    value={total_num || 0}
                    style='decimal'
                    minimumFractionDigits={0}
                    maximumFractionDigits={maximumFractionDigits}
                    />
                </div>
                
            </div>
        );
    }
}
ProgressComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(ProgressComponent))