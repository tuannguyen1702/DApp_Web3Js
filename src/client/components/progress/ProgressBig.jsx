import React from 'react';
import { Progress } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape } from 'react-intl';


class ProgressBigComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // let myProgressBar = this.refs._myUncontrolledComp;
        // let _progress_bar = myProgressBar.querySelector('.progress');
        // let _label = myProgressBar.querySelector('label');
        // _progress_bar.appendChild(_label);
    }

    render() {
        let { value = 0, color = '', more_detail, heading} = this.props;
        let position_percent = '' + value + '%';
        return (
            <div className={["widget-progress", "widget-progress--big", color ? "widget-progress__" + color : ""].join(' ')} ref="_myUncontrolledComp">
                <Progress value={value} />
                <div className="top_popup" style={{left: position_percent}}>
                    {more_detail}
                </div>
                <div className="text-center">{ heading }</div>
                <ul className="labels">
                    <li className="label-item">
                        <span className="square">#CA8959</span>
                        <span className="number">{value + "%"}</span>
                        <span className="text">Sold</span>
                    </li>
                    <li className="label-item">
                        <span className="number">{100 - value + "%"}</span>
                        <span className="text">Holding</span>
                        <span className="square">#CA8959</span>
                    </li>
                </ul>
                {/*<label style={{left: position_percent}}>{value}</label>*/}

            </div>
        );
    }
}
ProgressBigComponent.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(ProgressBigComponent))