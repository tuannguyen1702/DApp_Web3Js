import React from "react"
import StaticCard from "./StaticCard"
import AnimatedCard from "./AnimatedCard"
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class FlipUnitContainer extends React.Component {

	render() {
		const { digit, shuffle, unit } = this.props;

		let now = digit;
		let after = digit + 1;

		// to prevent a negative value
		
		if (unit === 'seconds' || unit==='minutes') {
			after = after === 60 ? 0 : after;
		} else if(unit ==='hours') {
			after = after === 24 ? 0 : after;
		} else if(unit === 'days'){
			after = after === 7 ? 0 : after
		}

		// add zero
		if (now < 10) now = `0${now}`;
		if (after < 10) after = `0${after}`;

		// shuffle digits
		const digit1 = shuffle ? after : now;
		const digit2 = !shuffle ? after : now;

		// shuffle animations
		const animation1 = shuffle ? 'fold' : 'unfold';
		const animation2 = !shuffle ? 'fold' : 'unfold';

		return (
			<div className="flipContainer">
				<div className="label-unit-container" >{this.props.label && <FormattedMessage id={this.props.label} />}</div>
				<div className={'flipUnitContainer'}>
					<StaticCard
						position={'upperCard'}
						digit={now}
					/>
					<StaticCard
						position={'lowerCard'}
						digit={after}
					/>
					<AnimatedCard
						position={'first'}
						digit={digit1}
						animation={animation1}
					/>
					<AnimatedCard
						position={'second'}
						digit={digit2}
						animation={animation2}
					/>
				</div>
			</div>
		);
	}
}
export default  injectIntl(FlipUnitContainer);