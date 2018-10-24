import React,{ Component } from 'react';
import axios from 'axios';
import { Button, Card, Row, Form, Icon, Input, Checkbox, Modal, Radio, Alert, message, notification } from 'antd';
import './login.css';
import { Redirect } from 'react-router-dom'
import Auth from './auth'

/**
 * author: Chaoyue
 * login card
 */

const FormItem = Form.Item;

const openErrorNotification = (type) => {
    notification[type]({
        message: '注册错误',
        description: '请更换用户名或联系管理员',
    });
}

const openSuccessNotification = (type) => {
    notification[type]({
        message: '注册成功',
        description: '返回登录页',
    });
}

const CollectionCreateForm = Form.create()(//注册表单
    class extends React.Component {

        state = {
            confirmDirty: false,
            registerLoading: false,
        };

        register = (username, password, email, callback) =>{
            axios.get('http://www.*****.top:8080/register',{
                params:{
                    username: encodeURIComponent(username),
                    password: encodeURIComponent(password),
                    email: encodeURIComponent(email)
                }
            })
                .then(function (response) {
                    console.log("register response data:",response.data);
                    if (response.data === 0){
                        openErrorNotification('error');
                        }else {
                        openSuccessNotification('success');
                        callback();
                    }
                })
                .catch(function (error) {
                    openErrorNotification('error');
                    console.log(error);
                })
        }

        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    message.loading('注册中...', 2.5);
                    console.log('Received values of form: ', values);//处理表单内容
                    console.log(values.username)
                    this.register(values.username, values.password, values.email,
                        () => {
                        this.props.closeRegisterModel(false)
                        });

                }
            });
        }

        handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        }

        compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('输入密码不一致');
            } else {
                callback();
            }
        }

        validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        }



        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="注册"
                    onCancel={onCancel}
                    footer={null}
                >
                    <Form layout="vertical" onSubmit={this.handleSubmit}>
                        <FormItem label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="请输入密码"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入密码',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            label="请确认密码"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请确认输入的密码',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem
                            label="请输入邮箱地址"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '请输入正确邮箱!',
                                }, {
                                    required: true, message: '请输入邮箱',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem className="collection-create-form_last-form-item">
                            {getFieldDecorator('modifier', {
                                initialValue: 'publicUser',
                            })(
                                <Radio.Group>
                                    <Radio value="publicUser">普通用户</Radio>
                                    <Radio value="adm">管理员</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="registerButton" loading={this.state.registerLoading}>注册</Button>
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class LoginCard extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            loading: false,
            visible: false,//注册modal可见性
            username: '',
            password: ''
        };
    }

    handleSubmit = (e) => {//需要改
        e.preventDefault();
        this.setState({loading: true});
        try {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);//处理登录数据
                    let auth = this.props.auth == null ? new new Auth() : this.props.auth;
                    auth.login(values.username, values.password, () => {
                        // this.props.history.push("/mosthottopic")
                        this.setState({loading: false});
                        this.props.hideLoginCard(false)
                    },
                        () => this.setState({loading: false}),
                        () => this.props.setUsername(values.username));
                }
            })
        }catch (e) {
            console.log(e)
        }finally {

        }
    }

    showRegisterModal = () =>{//显示注册表单
        this.setState({visible: true})
        this.props.hideLoginCard(false)
    }

    closeRegisterModel(visible){
        this.setState({
            visible
        })
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render(){

        const { form, visible, onCancle } = this.props;//这里注意
        const { getFieldDecorator } = form;
            return (
                <div >
                    {/*<Card className="loginCard" title="登录" style={{ width: 450}} >*/}
                        <Form onSubmit={this.handleSubmit} className="login-form" >
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules:[{ required: true, message: '请输入用户名靴靴'}]
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入你的密码'}],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: false,
                                })(
                                    <Checkbox>记住我</Checkbox>
                                )}
                                <a className="login-form-forgot" href="">忘记密码</a>
                                <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
                                    登录
                                </Button>
                                Or <a onClick={this.showRegisterModal}>快来注册</a>
                            </FormItem>
                        </Form>
                    {/*</Card>*/}
                    <CollectionCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        closeRegisterModel = { visible => this.closeRegisterModel(visible)}
                    />
                </div>
            );
    }
}

const LoginForm = Form.create()(LoginCard);//这一句一定要加！！！

export default LoginForm;


