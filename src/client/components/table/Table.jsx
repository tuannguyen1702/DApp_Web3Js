import React, { Component } from 'react';
import { Table } from 'reactstrap';

class TableComponent extends Component {
    constructor(props) {
        super(props)
    }

    rowOnClick(data){
        var { rowOnClick } = this.props
        if(typeof rowOnClick == 'function'){
            rowOnClick(data)
        }
    }

    render() {
        var self = this
        var { tableData, colData, handleView = null, handleEdit = null, haveHeader = false, haveFooter = false, startIndex = 0 , className = "", style={} } = this.props
        return (
            <Table style={style} className={className}>
                <thead>
                    <tr>
                        {colData.map((col, rowItemIndex) => (
                            <th style={col.style || null} className={col.className || ""} key={(rowItemIndex + 1)}>{col.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index} onClick={()=>{self.rowOnClick(row)}}>
                            {colData.map((col, rowItemIndex) => (
                                <td style={col.style || null} className={col.className || ""} key={index + "_" + (rowItemIndex + 1)}>
                                    {className == 'mobile-tbl' ? <label className="mobile-lbl">{col.name}</label>:""}
                                    {
                                        col.binding ? col.binding(row, index) : row[col.mapData]
                                    }
                                </td>
                            ))}

                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }
}

export default TableComponent