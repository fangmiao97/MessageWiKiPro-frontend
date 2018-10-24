import React from "react";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import {Row, Layout, Menu, Breadcrumb, Icon, Button, Popover, notification, Card, Modal,From} from 'antd'
import App from "./App";
import './homepage.css'
import MostHotTopic from "./MostHotTopic";
import HotMessageTopic from "./HotMessageTopic";
import AllTopic from "./AllTopic";r
import Involved from "./Involved";
import Visitor from "./Visitor";
import Auth from "./login/auth";
import LoginForm from "./login/login"
import Notice from "./Notice";
import UserBlock from "./UserBlock";
import EditMessage from "./EditMessage";
import NOLoginInvolved from "./NOLoginInvolved";

/**
 *created by Chaoyue
 */

let auth = new Auth();//全局Auth对象

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const openErrorNotification = (type) => {
    notification[type]({
        message: '未登录',
        description: '请点击右上角登录',
        style:{
            marginTop: 60
        }
    });
}

class Homepage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            loginCardVisible: false,
            username: auth.username,
            editFormVisible: false
        }
    }

    showLoginCard(){
        this.setState({loginCardVisible : true})
    }

    handleVisibleChange = (loginCardVisible) => {
        this.setState({ loginCardVisible});
    }

    hideLoginCard(loginCardVisible){
        this.setState({
            loginCardVisible
        });
    }

    setUsername(username){
        this.setState({
            username
        })
    }

    submitMessage(){
        alert("hauhauhua")
    }

    openEditModal(editFormVisible){
        this.setState({
            editFormVisible
        })
    }



    handleCancel = () => {
        this.setState({ editFormVisible: false });
    }

    closeEditModal(editFormVisible){
        this.setState({
            editFormVisible
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }


    render(){

        return(
        <div className="page">
            <Router>
            <Layout style={{ height: '100%'}}>
                <Header className="header">
                    <div className="logo" >
                        MessageWikiPro
                    </div>
                    <div className="loginPopover">
                        <Popover
                            content={<LoginForm auth={auth} {...this.props} hideLoginCard={ loginCardVisible => this.hideLoginCard(loginCardVisible)} setUsername={ username => this.setUsername(username)}/>}
                            title="登录"
                            trigger="click"
                            visible={this.state.loginCardVisible}
                            onVisibleChange={this.handleVisibleChange}
                            placement="bottomRight"
                        >
                            <Button type="primary" shape='circle' icon="login">
                            </Button>
                        </Popover>
                    </div>
                </Header>
                <Layout>
                    <Sider width={230} style={{ background: '#fff' }}>
                        <UserBlock username = {this.state.username} openEditModal={ editFormVisible => this.openEditModal(editFormVisible)}/>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            style={{  borderRight: 0 }}
                        >
                            <Menu.Item key="1">
                                    <Icon type="star" theme="twoTone" twoToneColor="#35ce7b"/>
                                    最热主题
                                    <Link to='/mosthottopic'/>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Icon type="like" theme="twoTone" twoToneColor="#35ce7b"/>
                                    最热留言
                                    <Link to='/hotmessagetopic'></Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Icon type="bulb" theme="twoTone" twoToneColor="#35ce7b"/>
                                    全部主题
                                    <Link to='/alltopic'></Link>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Icon type="eye" theme="twoTone" twoToneColor="#35ce7b"/>
                                    我参与的
                                    <Link to='/involved'/>
                                </Menu.Item>

                        </Menu>
                    </Sider>
                    <Layout style={{ background:'#fafafa',padding: '10px 10px 10px' }}>
                        <Content style={{ background: '#fff', padding: '0px 20px 10px' , margin: 0 }}>
                            <Route path='/visitor' component={Visitor}/>
                            <Route path='/mosthottopic' render={(props)=>{
                                if (auth.isLogin){
                                    return <MostHotTopic {...props} username = {this.state.username}/>
                                }else{
                                    openErrorNotification('error')
                                    return <Redirect to='/notice'/>
                                }
                            }}/>
                            <Route path='/hotmessagetopic' render={(props)=>{
                                if (auth.isLogin){
                                    return <HotMessageTopic {...props} username = {this.state.username}/>
                                } else {
                                    openErrorNotification('error')
                                    return <Redirect to='/notice'/>
                                }
                            }}/>
                            <Route path='/alltopic' render={(props)=>{
                                if (auth.isLogin){
                                    return <AllTopic {...props} username = {this.state.username}/>
                                } else {
                                    openErrorNotification('error')
                                    return <Redirect to='/notice'/>
                                }
                            }}/>
                            <Route path='/involved' render={(props) => {
                                if (auth.isLogin){
                                    return <Involved {...props} username = {this.state.username}/>
                                } else {
                                    openErrorNotification('error')
                                    return <Redirect to='/noLoginInvolved'/>
                                }
                            }}/>
                            <Route path='/notice' component={Notice}/>
                            <Route path='/edit' component={EditMessage}/>
                            <Route path='/noLoginInvolved' component={NOLoginInvolved}/>

                            {/*<Route path='/login' render={(props)=>{*/}
                                {/*return <LoginForm auth={auth} {...props}/>*/}
                            {/*}}/>*/}
                        </Content>
                    </Layout>
                </Layout>
                <EditMessage
                    wrappedComponentRef={this.saveFormRef}
                    editFormVisible={this.state.editFormVisible}
                    handleCancel = {this.handleCancel}
                    username = {this.state.username}
                    closeEditModal = { editFormVisible => this.closeEditModal(editFormVisible)}
                />
            </Layout>
            </Router>
        </div>
        )
    }
}


export default Homepage;