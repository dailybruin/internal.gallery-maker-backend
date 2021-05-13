import React from 'react';
import { Form, Input, Card } from 'antd';
import ReactMarkdown from 'react-markdown';
import './TextBoxWithPreview.css';

const { TextArea } = Input

function TextBoxWithPreview(props) {
    return (
        <div className="columns">
            <Form.Item label={props.label}>
                <TextArea
                    maxLength={props.maxLength}
                    showCount
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
            </Form.Item>
            <Card
                size='small'
                title='Preview'
                style={{ width: '50%' }}
            >
                <ReactMarkdown children={props.value}/>
            </Card>
        </div>
    );
}

export default TextBoxWithPreview;