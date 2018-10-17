import React from 'react'
import { Row, Col } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Icon from '../icons/index';

const getDollarText = (unit, decimalNum = 0) => {
    if(unit >= 1000000){
        let number = parseFloat(Math.round(unit / 10000) / 100).toFixed(decimalNum);
        let decimal = number - Math.floor(number);
        if ( number - Math.floor(number) > 0 ) {
            return '$' + number + 'M'
        } else {
            let x = number - decimal;
            return '$' + x + 'M'
        }
    }
    if(unit >= 1000){
        return '$' + Math.round( unit / 10) / 100 + 'K'
    }
    return '$' + Math.round( unit * 100) / 100
}

const getDollarTextRound = (unit) => {
    if(unit >= 1000000){
        return '$' + Math.round(unit / 1000000) + 'M'
    }
    if(unit >= 1000){
        return '$' + Math.round( unit / 1000) + 'K'
    }
    return '$' + Math.round( unit )
}
class ProgressBarCrowdsale extends React.Component {

    constructor(props) {
        super(props)
        // this.state = {
        //     softcap : props.softCap,
        //     hardcap : props.hardCap,
        //     estcap : props.estCap
        // }
    }

    componentDidMount(){
        // fetch('https://beuat.mozocoin.io/api/v1/dashboard')
        //     .then((response) => {
        //         return response.json()
        //     })
        //     .then((res) => {
        //         const { hardCap, estCap, softCap } = res
        //         this.setState({
        //             hardcap: hardCap,
        //             estcap: estCap,
        //             softcap: softCap
        //         })
        //     })
        //     .catch((err) => {
        //         console.log("err", err)
        //     })
    }

    render() {
        // const { softcap, hardcap, estcap } = this.st
        const IconCheck = () => {
            return <span className="svg-icon-container"><Icon name="check" /></span>
        };
        return (
            <div className="progressbar-container">
                <Row>
                    <Col xs={4}>
                        <div className="raise-to-date">
                            Raised to date:
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="softcap">
                            <IconCheck /> Softcap: {getDollarText(this.props.softCap)}
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="hardcap">
                            Hardcap
                            : {getDollarText(this.props.hardCap)}
                        </div>
                    </Col>
                </Row>

                <div className="progress-bar-container">
                    <div  className="progress-bar-insider" style={{ width: (this.props.estCap * 100 / this.props.hardCap) + '%' }}>
                        <div className="trail">
                        </div>
                    </div>
                </div>
                <div className="progress-border">
                </div>
                <div className="hardcap-used" style={{
                    paddingLeft: (this.props.estCap * 100 / this.props.hardCap - 2.5) + "%" }}>
                    {getDollarText(this.props.estCap, 1)}
                </div>
                <div className="noticed-text">There is only {getDollarText(this.props.hardCap - this.props.estCap, 1)} left!</div>
            </div>
        )
    }
}

ProgressBarCrowdsale.propTypes = {
    intl: intlShape.isRequired
}
export default injectIntl(observer(ProgressBarCrowdsale))
