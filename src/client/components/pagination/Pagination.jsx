import React, { Component } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const Dot = ({ onClick }) => {
    return (
        <div
            onClick={() => {
                if (!onClick) return;
                onClick();
            }}
            className="pagination-3-dot"
        >
            <span className="pagination-number">...</span>
        </div>
    );
};

const getEqualLength = (number, max_number) => {
    let res = number + ""
    while(res.length < (max_number + "").length){
        res = "0" + res;
    }
    return res
}

const Left = ({ onClick }) => {
    return (
        <div
            onClick={() => {
                if (!onClick) return;
                onClick();
            }}
            className="pagination-button"
        >
            <div className="pagination-img">
                <img src={require("../../images/arrow-left.png")} />
            </div>
        </div>
    );
};

const Right = ({ onClick }) => {
    return (
        <div
            onClick={() => {
                if (!onClick) return;
                onClick();
            }}
            className="pagination-button"
        >
            <div className="pagination-img">
                <img src={require("../../images/arrow-right.png")} />
            </div>
        </div>
    );
};

const Padding = () => {
    return <div className="pagination-padding" />;
};

const Button = ({ number, active, onClick }) => {
    return (
        <div
            onClick={() => {
                if (!onClick) return;
                onClick();
            }}
            className={"pagination-button " + (active ? " active" : "")}
        >
            <span className="pagination-number">{number}</span>
        </div>
    );
};

class PaginationComponent extends Component {
    constructor(props) {
        super(props);
        const { number_of_page, curPage } = this.props;
        this.state = {
            active_number: curPage,
        };
    }
    setNewPage(number) {
        const { number_of_page, onChange } = this.props;
        number = Math.min(number, number_of_page);
        number = Math.max(number, 1);
        this.setState({
            active_number: number
        });
        if(onChange){
            onChange(number)
        }
    }
    render() {
        const { number_of_page, BLOCK_RADIUS = 2 } = this.props;
        const { active_number } = this.state
        let pages = [];
        let left = active_number, right = active_number;
        if( 1 < active_number && active_number < number_of_page) {
            pages.push(active_number)
        }else {
            if ( active_number == 1  && number_of_page > 1 ){
                pages.push(active_number + 1)
                left = right = active_number + 1
            }
            if( active_number == number_of_page && number_of_page > 1 ) {
                pages.push(number_of_page - 1)
                left = right = number_of_page - 1
            }
        }

        for(let i = 1; i < BLOCK_RADIUS; i++){
            if( left - 1 > 1){
                left = left - 1;
                pages.unshift(left);
            } else {
                if ( right + 1 < number_of_page ){
                    right = right + 1
                    pages.push(right)
                }
            }
            if ( right + 1 < number_of_page ){
                right = right + 1
                pages.push(right)
            } else {
                if( left - 1 > 1 ){
                    left = left - 1;
                    pages.unshift(left);
                }
            }
        }
        let isPush = false
        if(pages[0] - 1 <=  2){
            isPush = true
            if( left - 1 > 1){
                left = left - 1;
                pages.unshift(left);
            } else {
                if ( right + 1 < number_of_page ){
                    right = right + 1
                    pages.push(right)
                }
            }
        }
        if(number_of_page - 1 <= pages[pages.length - 1] + 1){
            if ( right + 1 < number_of_page ){
                right = right + 1
                pages.push(right)
            } else {
                if( left - 1 > 1 ){
                    left = left - 1;
                    pages.unshift(left);
                }
            }
        }
        if(pages[0] - 1 <=  2 && !isPush){
            if( left - 1 > 1){
                left = left - 1;
                pages.unshift(left);
            } else {
                if ( right + 1 < number_of_page ){
                    right = right + 1
                    pages.push(right)
                }
            }
        }
        if(number_of_page <= 2) pages = []
        return (
            <div className="pagination-container">
                <Left onClick={() => this.setNewPage(active_number - 1)} />
                <Button number={getEqualLength(1, number_of_page)}
                    active={active_number == 1}
                    onClick={() => this.setNewPage(1)}
                />
                { pages[0] - 1 >  2 &&
                    <Dot onClick={() => this.setNewPage( pages[0] - 1 )}/>
                }
                {pages.map( (value, index) => {
                    return <Button key={index} number={getEqualLength(value, number_of_page)}
                        active={active_number == value}
                        onClick={() => this.setNewPage(value)}
                    />
                })
                }
                {number_of_page - 1 > pages[pages.length - 1] + 1 &&
                    <Dot onClick={() => this.setNewPage( pages[pages.length - 1] + 1)}/>
                }
                {number_of_page > 1 &&
                    <Button number={getEqualLength(number_of_page, number_of_page)}
                    active={number_of_page == active_number}
                    onClick={() => this.setNewPage(number_of_page)}
                    />
                }
                <Right onClick={() => this.setNewPage(active_number + 1)} />
            </div>
        );
    }
}

export default PaginationComponent;
