import React, { Component } from 'react';
import Plain from 'slate-plain-serializer';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import './App.css';

class ContentEditable extends Component {
	constructor(props) {
		super(props);

		this.state = { value: Plain.deserialize(this.props.text) }

		this.onChange = this.onChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.text !== nextProps.text) {
			console.log('SETTING NEW EDITOR STATE');
			this.setState({ value: Plain.deserialize(nextProps.text)} );
		}
	}

	onChange(change) {
		this.setState({ value: change.value });
	}
	render() {
		return (
			<div className='editor-div'>
				<Editor
					className='editor'
					onChange={this.onChange}
					value={this.state.value}
				/>
			</div>
		)
	}
}

export default ContentEditable;
