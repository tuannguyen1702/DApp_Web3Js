import React from 'react';
import { Label, Input, FormText, FormGroup } from 'reactstrap';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone'

class UploadImageComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { img: "", loading: false }
    }

    onDrop(files) {
        var self = this
        const { callbackDrop } = this.props

        var reader = new FileReader();

        // When the image is loaded we will set it as source of
        // our img tag
        reader.onloadend = function () {
            self.setState({ img: reader.result, loading: true })
        }


        if (files) {
            // Load image as a base64 encoded URI
            reader.readAsDataURL(files[0]);
        } else {
            preview.src = "";
        }

        var onCompleted = () => {
            self.setState({ loading: false })
        }

        callbackDrop(files, onCompleted)
    }

    render() {

        const { description, className = "", callbackDrop, note, defaultImg } = this.props

        return (

            <div className="image-upload form-control">
                {(this.state.img || defaultImg) && <img src={this.state.img || defaultImg} height="200" />}
                <div hidden={!this.state.loading} className="loading-container"><img src="data:image/gif;base64,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"/></div>
                <Dropzone preventDropOnDocument={false} className={"dropzone " + className} accept="image/jpeg, image/png" onDrop={this.onDrop.bind(this)}>
                {!(this.state.img || defaultImg) && <div className="description img-icon">{description && <FormattedMessage id={description} />}</div>}
                </Dropzone>
                <div>
                    {note && <FormattedMessage id={note} />}
                </div>
            </div>
        )
    }
}
export default injectIntl(observer(UploadImageComponent))