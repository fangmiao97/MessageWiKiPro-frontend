import React, { Component } from 'react';
import { Modal, Input, Tag, Button, Form, Select, message} from 'antd';
import axios from 'axios';
import "./EditMessage.css"

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

class EditMessageForm extends React.Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            submitButtonLoading: false
        }
    }

    submit(username, title, content, callback){
        axios.get("http://www.chmod777.top:8080/submitTopic",{
            params:{
                username: encodeURIComponent(username),
                title: encodeURIComponent(title),
                content: encodeURIComponent(content),
            }
        }).then(function (response) {
            if (response.data === 0){
                message.error("发布错误，请重试！");
                callback();
            } else{
                message.success("发布成功！");
                callback();
            }
        }).catch(function (error) {
            message.error("网络有错误吧少年");
            callback()
        })
    }


    submitEditMessage = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);//处理表单内容
                console.log(this.props.username);
                if (this.props.username === "未登录"){
                    message.error("请登录！")
                }else {
                    // this.setState({submitButtonLoading: true});
                    this.submit(this.props.username, values.title, values.content,
                        () => {
                        this.props.closeEditModal(false)
                        });
                }
            }
        });
    }


    render() {

        const { editFormVisible, handleCancel, handleOk, form} = this.props;
        const { getFieldDecorator } = form;

        return (
            <div>
                <Modal visible={editFormVisible}
                       title={"新建主题"}
                       mask={false}
                       onOk={handleOk}
                       onCancel={handleCancel}
                       footer={null}>
                <Form layout={"vertical"} onSubmit={this.submitEditMessage}>
                    <FormItem label="标题">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请输入标题' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="内容">
                        {getFieldDecorator("content")(<TextArea rows={4} />)}
                    </FormItem>
                    <FormItem label="选择结点">
                        {getFieldDecorator("select")(
                            <Select placeholder={"选择发布结点"}>
                                <Option value="campus">校园</Option>
                                <Option value="computer">计算机</Option>
                                <Option value="fun">好玩</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="submitButton" loading={this.state.submitButtonLoading}>发布</Button>
                    </FormItem>
                </Form>
                </Modal>
            </div>
        );
    }
}

const EditMessage = Form.create()(EditMessageForm);

export default EditMessage;