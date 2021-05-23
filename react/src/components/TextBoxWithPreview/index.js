import React from 'react';
import { Form, Input, Card, Row, Col } from 'antd';
import ReactMarkdown from 'react-markdown';
import './TextBoxWithPreview.css';

const { TextArea } = Input

function TextBoxWithPreview(props) {
    return (
        <div className="textbox-preview-columns">
            <Form.Item label={props.label} style={{ width: '50%' }}>
                <TextArea
                    maxLength={props.maxLength}
                    showCount
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
            </Form.Item>
            <Row style={{ width: '50%', marginBottom: '24px', marginLeft: '1em' }}>
                <Col>
                    <label className="preview-label">Preview:</label>
                </Col>
                <Col style={{ flexGrow: 1 }}>
                    <Card
                        size='small'
                        style = {{ height: '100%', textAlign: 'left' }}
                    >
                        <ReactMarkdown children={props.value}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default TextBoxWithPreview;