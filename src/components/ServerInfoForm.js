import React from 'react';
import {connect } from 'dva';
import { Form, Icon, Input, Button } from 'antd';



class ServerInfoForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.updateServerInfo(values.serverIP);
        this.props.toggleVisible();
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item
        >
          {getFieldDecorator('serverIP', {
            rules: [{ required: true, message: 'IP:PORT required' }],
            initialValue: this.props.wsUrl
          })(
            <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="IP:PORT" />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            OK
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(
  ({ global }) => global,
  dispatch => ({
      updateServerInfo: data => dispatch({ type: 'global/updateServerInfo', payload: data }),
      toggleVisible: () => dispatch({ type: 'global/toggleVisible' })
  }))(Form.create()(ServerInfoForm));
